# B2B Landing

Лендинг **Яндекс Путешествия для бизнеса** — корпоративные скидки на жильё до 40%, закрывающие документы и отсрочка платежей.

## Запуск

```bash
python3 -m http.server 8080
```

Открыть [http://localhost:8080](http://localhost:8080).

## Проверка формы

Быстрый автоматический прогон контрактов формы:

```bash
python3 scripts/test-form.py
```

Сборка production-архива автоматически запускает эту проверку и прекращается при первой ошибке:

```bash
python3 scripts/publish-b2b-landing.py
```

Ручные браузерные сценарии описаны в [tests/FORM_TEST_CASES.md](tests/FORM_TEST_CASES.md).

## Стек

HTML, CSS, JS. Карта — Яндекс.Карты API. Шрифты — Yandex Sans (YS Display, YS Text).
