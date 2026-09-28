#!/usr/bin/env python3
"""Run regression checks for the organization connection phone popup."""

from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


def check(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)
    print(f"[PASS] {message}")


def main() -> int:
    index = (ROOT / "index.html").read_text(encoding="utf-8")
    main_js = (ROOT / "assets/scripts/main.js").read_text(encoding="utf-8")
    analytics_js = (ROOT / "assets/scripts/analytics.js").read_text(encoding="utf-8")
    amo_js = (ROOT / "assets/scripts/amocrm-connect-org.js").read_text(encoding="utf-8")

    drawer_match = re.search(
        r'<div\b[^>]*id="connectOrgDrawer"[^>]*>(.*?)<!-- Скрипты -->',
        index,
        re.S,
    )
    check(drawer_match is not None, "попап подключения организации существует")
    drawer = drawer_match.group(0)
    check('role="dialog"' in drawer and 'aria-modal="true"' in drawer, "попап размечен как модальный")

    form_match = re.search(r'<form\b[^>]*id="connectOrgForm"[^>]*>(.*?)</form>', drawer, re.S)
    check(form_match is not None, "форма находится внутри попапа")
    form = form_match.group(1)
    check('id="connectOrgPhone"' in form and 'required' in form, "номер телефона обязательный")
    check('id="connectOrgSubmitBtn"' in form, "кнопка подключения присутствует")
    check('connectOrgName' not in form and 'connectOrgMessenger' not in form, "в форме нет имени и мессенджера")
    check(len(re.findall(r'<input\b', form)) == 1, "в форме только одно поле")

    check('a[href*="passport.yandex.ru/auth/reg/org"]' in main_js, "кнопки подключения перехватываются")
    check("openConnectOrgDrawer(btn.href" in main_js, "клик открывает попап")
    check("(function initConnectOrgDrawer()" in main_js, "попап инициализируется")
    check("Укажите номер телефона, чтобы зарегистрировать организацию" in main_js, "пустой телефон валидируется")
    check("Введите корректный номер телефона" in main_js, "неполный телефон валидируется")
    check("CONNECT_ORG_REDIRECT_DELAY_MS = 2500" in main_js, "переход задерживается на 2,5 секунды")
    check("b2b_landing_connect_organization_after_phone_redirect" in main_js, "после отправки сохраняется переход к регистрации")

    check("function sendConnectOrgLeadToAmoCRM(phone)" in amo_js, "в AmoCRM передаётся телефон")
    check("AMO_FORM_ID = '1687954'" in amo_js, "используется форма AmoCRM 1687954")
    check("AMO_FORM_HASH = '4868e5e00c42e9a3e4c15d58398140ff'" in amo_js, "используется актуальный hash формы")
    check("fields[1147529_1][634523]" in amo_js, "используется поле телефона AmoCRM")
    check("fields[name_1]" not in amo_js and "fields[1365239_2]" not in amo_js, "лишние поля в AmoCRM не отправляются")
    check("DUPLICATE_WINDOW_MS = 10000" in amo_js, "повторная отправка защищена")
    check("navigator.sendBeacon(queueUrl, formData)" in amo_js, "отправка переживает переход со страницы")
    check("if (!beaconQueued)" in amo_js and "form.submit();" in amo_js, "iframe остаётся запасным транспортом")
    check("}, 10000);" in amo_js, "транспорт AmoCRM не удаляется до завершения задержки")

    check("b2b:connectPhoneDrawerShow" in analytics_js, "показ попапа отслеживается")
    check("b2b_landing_connect_phone_form_show" in analytics_js, "сохранилась цель показа формы")
    check("var COUNTERS = [108202214, 50912507]" in analytics_js, "цели отправляются в оба счётчика Метрики")
    for goal in (
        "b2b_landing_connect_organization_button_click",
        "b2b_landing_connect_phone_form_show",
        "b2b_landing_submit_phone_number_button_click",
        "b2b_landing_connect_organization_after_phone_redirect",
    ):
        check(goal in analytics_js or goal in main_js, f"цель {goal} подключена")

    print("Phone popup tests passed.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except AssertionError as error:
        print(f"[FAIL] {error}", file=sys.stderr)
        raise SystemExit(1)
