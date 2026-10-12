# Bukhara Tech

Sa'dulla Khaitov sayti (https://bukharatech.uz): sayt va Telegram botlar, sunʼiy intellekt va avtomatlashtirish, internet va IT, PowerPoint prezentatsiyalar — Buxoro.

## Sahifalar

| Fayl | Sahifa |
|---|---|
| `index.html` | Bosh sahifa: xizmatlar, loyihalar va sharhlar, ish tartibi, narx kalkulyatori, men haqimda, savollar, aloqa |
| `sayt.html` | Sayt va Telegram botlar |
| `ai.html` | Sunʼiy intellekt va avtomatlashtirish |
| `internet.html` | Internet, Wi-Fi va IT |
| `prezentatsiya.html` | PowerPoint prezentatsiyalar |
| `ru/*.html`, `en/*.html` | Shu 5 sahifaning ruscha va inglizcha versiyasi |
| `sadulla/sherali/umid/maruf/doston/video.html` | Eski manzillar — yangi sahifaga yoʻnaltiradi (oʻchirmang) |

## Tuzilishi

- `content/*.json` — matnlar, narxlar, ishlar, sharhlar (admin panel: `/admin`, Sveltia CMS)
- `tools/build.py` — `content/` dan sahifalardagi `<!-- cms:… -->` oraliqlarini qayta yozadi (`python3 tools/build.py`); GitHub Action (`.github/workflows/cms.yml`) buni avtomatik qiladi
- `assets/style.css` — barcha uslublar; `assets/main.js` — tungi rejim, menyu, karusellar, kalkulyator, forma, Google Analytics
- `worker/form-worker.js` — formani Telegram'ga yuboruvchi Cloudflare Worker (token faqat Cloudflare secret'larida)
- `images/works/` — haqiqiy bajarilgan ishlar rasmlari, `images/clients/` — mijozlar logotiplari

CSS/JS oʻzgarganda sahifalardagi `?v=` raqamini yangilang (kesh).
