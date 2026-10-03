# Bukhara Tech — loyiha konteksti

Bu fayl Claude Code uchun: oldingi suhbatlarda qabul qilingan qarorlar va to'plangan ma'lumotlar. Foydalanuvchi bilan **o'zbek tilida (lotin)** gaplashing.

## Loyiha nima

Buxorodagi 5 kishilik jamoaning xizmatlar sayti. Har bir usta o'z yo'nalishida ishlaydi, bosh sahifada hammasi, har biriga alohida sahifa.

- **Sayt:** https://sadullakhaitov.github.io/bukhara-tech/ (GitHub Pages, `main` tarmog'i, ildiz papka)
- **Repo:** https://github.com/sadullakhaitov/bukhara-tech (public)
- **Brend:** Bukhara Tech. Rejadagi domen `bukharatech.uz` (2026-09-30 da bo'sh edi, hali sotib olinmagan; olingach Pages'ga ulash kerak)
- **Til:** asosiy o'zbek (lotin, `oʻ gʻ` uchun U+02BB `ʻ`). RU versiyasi `ru/` papkada (2026-10-01), EN versiyasi `en/` papkada (2026-10-02) — har birida 6 ta sahifa, `../assets`, `../images` yo'llari. Matn o'zgarsa UZ, RU va EN uchalasini ham yangilang — jami 18 ta fayl. Til tanlagich: headerdagi globus tugmasi (`.lang-btn`) → ochiladigan ro'yxat (`.lang-menu`: Oʻzbekcha / Русский / English), JS `assets/main.js` da; `hreflang` uz/ru/en + x-default har sahifada; `main.js` da matnlar `tx(uz, ru, en)` bilan. EN'da pul birligi "UZS", ismlar: Sa'dulla Khaitov, Sherali Bozorov, Doston Mukhammadov, Maruf Usmonov, Umid Murodov.

## Jamoa

| Fayl | Usta | Yo'nalish | Staj | Rang (CSS klass) |
|---|---|---|---|---|
| `sadulla.html` | Sa'dulla Khaitov | Web saytlar, fullstack, Telegram botlar, PowerPoint prezentatsiyalar | 5 yil | ko'k `p-web` #3743D1 |
| `sherali.html` | Sherali Bozorov | SysAdmin: tarmoqlar, internet, MikroTik | 15 yil | yashil `p-net` #0A7359 |
| `doston.html` | Doston Muxammadov | DaVinci Resolve, Photoshop, Premiere Pro, After Effects (montaj, color grading) | 10 yil | pushti `p-media` #A8235F |
| `maruf.html` | Maruf Usmonov | Kamera o'rnatish, sozlash, sbros, barcha kamera mahsulotlariga xizmat | 10 yil | jigarrang `p-cam` #8F530C |
| `umid.html` | Umid Murodov (2026-10-02 qo'shilgan) | Full-Stack dasturchi, AI prompt muhandisi, aqlli texnologiyalar integratori | 3 yil | binafsha `p-ai` #6D28D9 |

Jami staj: 43 yil, 5 yo'nalish (saytda shu raqamlar). Logotip 4 rangli kvadratligicha qoldi.

## Dizayn qarorlari

- **Hozirgi uslub foydalanuvchiga yoqqan, saqlansin:** och fon #F4F6F9, Unbounded (sarlavha) + Manrope (matn) + JetBrains Mono (kichik yorliqlar), har ustaga o'z rangi, logotip 4 rangli 2×2 kvadrat.
- **Rad etilgan:** Buxoro ravoqlari va girih naqshli, Bricolage Grotesque shriftli uslub — foydalanuvchiga "umuman yoqmadi". Qaytarmang.
- **Kunduzgi/tungi rejim:** headerdagi oy/quyosh tugmasi (`.theme-btn`). Ranglar `[data-theme="dark"]` da qayta belgilangan (`assets/style.css`), tanlov `localStorage` da saqlanadi, birinchi kirishda tizim sozlamasiga qaraladi (`<head>` dagi kichik skript). Rangli fon ustidagi matn uchun `#fff` emas, `var(--on-acc)` ishlating.
- **Tez va silliq o'tish (2026-10-02):** `assets/style.css` boshida `@view-transition { navigation: auto; }` (header va `.mbar` joyida qoladi), har sahifa `<head>` ida `speculationrules` — havolaga sichqoncha borganda (telefonda bosilganda) keyingi sahifa oldindan yuklanadi. Turbo/React **ishlatilmaydi**: `main.js` qayta ishga tushib, `const` takrorlanishi xato beradi. Yangi sahifa qo'shilsa, `<head>` ga shu ikki skriptni (tema + speculationrules) qo'shing.
- **Liquid glass (2026-10-02):** `style.css` oxiridagi blok. Fonda `body::before` — 5 yo'nalish rangidagi xira dog'lar; kartalar `var(--glass-sheen), var(--glass)` (yarim shaffof, blur'siz — telefonda tez ishlashi uchun); haqiqiy `backdrop-filter` faqat header, `.mbar`, hero yorliqlari, tema/burger va outline tugmalarda. Tokenlar `--glass*` kunduzgi va tungi rejimda alohida. `prefers-reduced-transparency` da oddiy yuzalarga qaytadi. Yangi karta turi qo'shilsa, shu blokdagi ro'yxatga qo'shing.
- **Kesh:** barcha sahifalarda `assets/style.css?v=...` va `assets/main.js?v=...` — CSS/JS o'zgarganda 18 ta sahifadagi `v=` ni yangilang, aks holda brauzer eski CSS'ni ko'rsatadi (2026-10-02 da shu xato bo'lgan: menyu yozuvlari sinib ketgan).
- **Hero:** o'ngda 2×2 rasm kollaji (`.hero-grid`, `images/works` dagi Unsplash namunalari: maruf-3, sherali-3, doston-6, sadulla-2), har birida yo'nalish nomi va "Namuna rasmlar" yorlig'i. Haqiqiy ish rasmlari kelsa almashtiriladi.
- Sayt oddiy HTML/CSS/JS, build yo'q. `assets/style.css` da 3 ta breakpoint: 1200, 900, 600 px. Telefon versiyasi 390 px da tekshirilgan.
- Sahifalar dastlab Python skripti bilan yig'ilgan, lekin skript repoda **yo'q** — endi HTML fayllarni to'g'ridan-to'g'ri tahrirlang. Ko'p sahifali o'zgarishda (masalan header) 6 ta faylning (UZ+RU+EN — 18 ta) hammasini birdek o'zgartirishni unutmang.

## Hali to'ldirilishi kerak (foydalanuvchidan so'raladi)

- **To'ldirildi (2026-10-01):** telefon +998 90 121 88 87, Telegram @sadulla_khaitov (hozircha hamma sahifadagi Telegram tugmalari shunga, ustalar sahifasidagi ham), Instagram @bukhara_tech
- Manzil (ish vaqti qo'yildi: Du–Sha, 09:00–19:00)
- Viloyat tumanlariga chiqiladimi
- Har bir usta: shaxsiy rasm, shaxsiy aloqa, haqiqiy ishlar rasmi va izohi, bio tuzatishlari
- **Narxlar (2026-10-01):** internetdagi Toshkent narxlari asosida Buxoro uchun taxminiy boshlang'ich narx qo'yildi (Toshkentdan biroz arzon). Ustalar o'zlari tasdiqlashi kerak.
- **Mijozlar sharhlari:** foydalanuvchi o'ylab topilgan sharh so'radi — rad etildi (soxta sharh aldov). Faqat haqiqiy mijozlarning ruxsat bilan berilgan sharhlari qo'yiladi.
- `[N]` lar (bajarilgan ishlar soni 250+ deb qo'yildi — foydalanuvchi aytgan)
- Logotip: hozirgi 4 rangli kvadrat qoladi (foydalanuvchi tasdiqladi)
- **Forma → Telegram (2026-10-02):** `worker/form-worker.js` (Cloudflare Worker, token `BOT_TOKEN` va `CHAT_ID` Cloudflare secret'larida) tayyor, yo'riqnoma `worker/README.md`. Foydalanuvchi Worker'ni o'rnatib manzilini bersa, `assets/main.js` dagi `FORM_ENDPOINT` ga yoziladi. Cloudflare Worker GitHub repoga ulangan (2026-10-03): ildizdagi `wrangler.jsonc` (`name: bukhara-tech-form`, `main: worker/form-worker.js`, `keep_vars: true`) — main'ga har push'da Worker o'zi qayta joylanadi. Worker manzili brauzerda ochilsa sozlash sahifasi (CHAT_ID topish / "Ishlayapti"). `FORM_ENDPOINT` = `https://bukhara-tech-form.sadulla-khaitov.workers.dev` (2026-10-03 ulandi). Bot: @bukharatechbot; so'rovlar Sa'dullaning shaxsiy chatiga keladi (CHAT_ID dashboard'da, BOT_TOKEN Secret). Muammo bo'lsa: Worker manzilini brauzerda ochish — bot va chatni tekshirib ko'rsatadi; Telegram xatolari Cloudflare → Observability → Logs da. **Bot tokenini HECH QACHON repoga/sayt kodiga yozmang** (repo public).

**Rasm qo'yish:** ustalar rasmini internetdan OLMANG (begona odam rasmi — aldov). `images/` ga `sadulla.jpg` va h.k. qo'yilib, `.photo` ichiga `<img src="images/maruf.jpg" alt="Maruf Usmonov">` qo'shiladi (CSS uni joyga to'ldiradi). `images/works/` dagi 23 ta rasm Unsplash'dan vaqtinchalik namuna ("Namuna" belgisi bilan), manbalari `images/works/MANBALAR.txt` da — haqiqiy ishlar bilan almashtirilishi kerak.

## Bozor tadqiqoti (2026-09-30, OLX Buxoro viloyati)

E'lonlar soni (raqobat ko'rsatkichi): sayt/bot 57, Wi-Fi/internet 42, kamera 41, kompyuter 29, video montaj 11, prezentatsiya 7, **MikroTik 1**. Kamera e'lonlari asosan ruscha ("Установка камера", "видеонаблюдение"), shuning uchun RU versiya muhim. Hamma yo'nalishni bir joyda beradigan jamoa Buxoroda topilmadi — asosiy afzallik.

**Kalit so'zlar:** kamera o'rnatish, установка камер, видеонаблюдение, sayt yaratish, создание сайтов, telegram bot yaratish, video montaj, MikroTik sozlash, Wi-Fi, Buxoro / Бухара.

**Raqobatchilar:** areainfo.uz / elit.uz (Buxoro web studiya, 2000-yildan, landing $300 dan), mirumitech.uz (Buxoro, dasturlash), trassir-asia.uz (videokuzatuv, Buxoroda ofisi, mehmonxonalar), NEW STAR BUKHARA (kompyuter/Hikvision). Namuna ko'p xizmatli saytlar: adminz.uz (eng yaxshi namuna), alextech.uz, web-labs.kz.

**Bosh sahifa bo'limlari tartibi (2026-10-03 yangilangan):** hero → `#xizmatlar` → `#kalkulyator` (foydalanuvchi so'rovi bilan yuqoriga ko'tarildi; hero'dagi "Narxni hisoblash" havolasi shu yerga olib boradi) → `#ishlar` → `#setlar` → `#jarayon` → `#jamoa` → `#savollar` → `#aloqa`; `section-white` bo'limlar bittadan almashadi. Telefon/planshetda (≤900px) kalkulyatorda tanlov bo'lsa ekran pastida `.calc-bar` ("Jami · Buyurtma berish →") chiqadi — JS'da yaratiladi, faqat kalkulyator bo'limida va jami summa raqami ko'rinmaganda ko'rinadi.

**Bosh sahifa tuzilishi (2026-10-02, mijoz psixologiyasi bo'yicha qayta tuzilgan):** hero (bitta asosiy tugma "Telegramga yozish" + "Narxlarni ko'rish" havolasi, ostida "15 daqiqada javob beramiz · Ko'rik bepul", o'ngda katta ish rasmi uchun placeholder `.hero-photo`) → `#xizmatlar` (4 karta mijoz muammosi tilida, "...dan" narx) → `#ishlar` (6 ish rasmi + 3 ta izoh kartasi `[Mijoz ismi]` placeholder bilan + "Biz ishlagan joylar" logotip joylari) → `#setlar` (Do'kon 890 000, **Ofis 1 790 000 — "Eng ko'p tanlanadi", ajratilgan**, Mehmonxona 3 690 000; har birida "6 oy bepul xizmat kafolati" va "+ uskunalar taxminan N mln") → `#jarayon` → `#jamoa` (texnik yozuvlarsiz, har ustaga iliq jumla) → `#kalkulyator` (4 ta ochiladigan guruh, boshida Kamera 4 dona) → `#savollar` (15 FAQ + FAQPage JSON-LD) → `#aloqa` (iliq `.final` blok + forma). Telefonda (≤600px) pastda doimiy `.mbar` (Telegram / Qo'ng'iroq) — hamma sahifalarda. Xizmatlar va Jamoa — 5 tadan karta (Umid: AI), kompyuterda 3+2 ko'rinishida (pastki 2 tasi o'rtada), planshetda 2 tadan, telefonda 1 tadan. Kalkulyator va FAQ'da "AI va avtomatlashtirish" guruhi bor.
- **Umid narxlari (2026-10-02, bozor tahlili):** AI yordamchi bot 3 000 000 (Toshkent: $339 / 20 mln dan), avtomatlashtirish 500 000 / 1 jarayon (Google Sheets integratsiya 300 000), AI trening 300 000 / 1 mashg'ulot (onlayn kurslar 700 ming–5 mln). Xizmat kartasida "500 000 so'mdan". Ish vaqti: Du–Sha, 09:00–19:00. "Sbros" o'rniga "Parolni tiklash". Usta sahifalarida "RASM" va "N-bo'lim" yozuvlari olib tashlangan. Narx o'zgarsa: usta sahifasi (UZ+RU), xizmat kartalari, kalkulyator, setlar va FAQ JSON-LD ni tekshiring.
- **Yo'nalishlar bo'yicha tuzilma (2026-10-02):** sayt 5 yo'nalishga teng urg'u beradi (faqat kamera/tarmoq emas). Menyu barcha sahifalarda (kompyuterda headerning 2-qatori, har biri o'z rangli nuqtasi bilan; ≤1200px burger): Kuzatuv kameralari (maruf) · Internet va Wi-Fi (sherali) · Sayt va botlar (sadulla) · Video montaj (doston) · Sunʼiy intellekt (umid) · Tayyor setlar (index#setlar); RU: Видеонаблюдение · Интернет и Wi-Fi · Сайты и боты · Видеомонтаж · Искусственный интеллект · Готовые сеты. Joriy sahifa `aria-current` (rangli fon). Har usta sahifasida bir xil bloklar: `#paketlar` (3 ta paket, o'rtadagisi "Ko'p tanlanadi", o'sha usta rangida `.set.set-acc`; ostida "Alohida xizmatlar" qatori) va `#savollar` (o'sha yo'nalish FAQ + FAQPage JSON-LD).
- **Paket narxlari (bozor tahlili, 2026-10-02):** Kamera paketlari — faqat ish haqi, bosh sahifadagi setlar formatida (Alohida ~~X~~ · Tejaysiz Y, + uskunalar taxminan Z): Uy uchun 2 kamera 340 000 (uskuna ~2–2,5 mln), Standart 4 kamera 590 000 (~3–3,5 mln), Biznes 8 kamera 1 090 000 (~5–5,5 mln) (2MP kamera ~330 ming, 4MP ~550 ming, NVR ~550–650 ming, 1TB ~600 ming, 2TB ~900 ming, UTP 305 m 1,65 mln). Internet: Uy Wi-Fi (hAP ax² ~1,47 mln bilan) 1 650 000, Ofis tarmog'i 4 200 000, Oylik IT xizmat 1 200 000/oy (Toshkent adminz: 10 PK gacha 1,75 mln). Sayt: bot 1 mln, landing 2,5 mln, korporativ 5 mln (Toshkent 5–9 mln). Video: 4 Reels 400 ming, reklama rolik 600 ming, oylik 12 Reels 1,1 mln (Reels montaj 80–120 ming). AI: avtomatlashtirish 500 ming, AI bot 3 mln, AI paket 4 mln. "Ko'rik" hamma joyda bepul.
- **SEO (2026-10-02):** `assets/favicon.svg`, `assets/og.png` (1200×630), har sahifada og:/canonical teglari, `sitemap.xml` (18 URL), `robots.txt` (GitHub Pages pastki papkasida robots.txt o'qilmaydi — domen ulangach ishlaydi; sitemap'ni Search Console/Yandex Webmaster'ga qo'lda berish kerak). Yandex Metrika/GA uchun hisoblagich ID kerak.
- **Biz ishlagan joylar (2026-10-03, foydalanuvchi bilan bevosita ishlagan):** Orzu Tech, Oʻzbekiston temir yoʻllari, Osiyo xalqaro universiteti, Buxoro viloyati soliq boshqarmasi, Monday IT oʻquv akademiyasi, Asia Alliance Bank — `.places ul.clients` da nom + turi (uchala tilda). Logotip fayllari kelsa `images/clients/` ga qo'yib, `<b>` o'rniga `<img alt="...">` qo'yiladi (CSS tayyor). Logotiplarni internetdan o'zimiz olmadik.
- Izohlar namunaviy placeholder — faqat haqiqiy mijoz izohlari bilan almashtiriladi (o'ylab topilgan izoh yozilmaydi).

**Kelajakdagi g'oyalar** (foydalanuvchi hali tasdiqlamagan): formani Telegram botga ulash, Google Maps / Yandex.

## Ish tartibi

- O'zgarishdan keyin: `git add -A && git commit -m "..." && git push` — Pages 1–2 daqiqada yangilanadi.
- Ishni boshlashdan oldin `git pull` (foydalanuvchi bir nechta kompyuterda ishlaydi).
- Commit xabarlari o'zbekcha.
