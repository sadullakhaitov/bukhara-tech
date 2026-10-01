# Bukhara Tech — loyiha konteksti

Bu fayl Claude Code uchun: oldingi suhbatlarda qabul qilingan qarorlar va to'plangan ma'lumotlar. Foydalanuvchi bilan **o'zbek tilida (lotin)** gaplashing.

## Loyiha nima

Buxorodagi 4 kishilik jamoaning xizmatlar sayti. Har bir usta o'z yo'nalishida ishlaydi, bosh sahifada hammasi, har biriga alohida sahifa.

- **Sayt:** https://sadullakhaitov.github.io/bukhara-tech/ (GitHub Pages, `main` tarmog'i, ildiz papka)
- **Repo:** https://github.com/sadullakhaitov/bukhara-tech (public)
- **Brend:** Bukhara Tech. Rejadagi domen `bukharatech.uz` (2026-09-30 da bo'sh edi, hali sotib olinmagan; olingach Pages'ga ulash kerak)
- **Til:** asosiy o'zbek (lotin, `oʻ gʻ` uchun U+02BB `ʻ`). RU versiyasi keyin.

## Jamoa

| Fayl | Usta | Yo'nalish | Staj | Rang (CSS klass) |
|---|---|---|---|---|
| `sadulla.html` | Sa'dulla Khaitov | Web saytlar, fullstack, Telegram botlar, PowerPoint prezentatsiyalar | 5 yil | ko'k `p-web` #3743D1 |
| `sherali.html` | Sherali Bozorov | SysAdmin: tarmoqlar, internet, MikroTik | 15 yil | yashil `p-net` #0A7359 |
| `doston.html` | Doston Muxammadov | DaVinci Resolve, Photoshop, Premiere Pro, After Effects (montaj, color grading) | 10 yil | pushti `p-media` #A8235F |
| `maruf.html` | Maruf Usmonov | Kamera o'rnatish, sozlash, sbros, barcha kamera mahsulotlariga xizmat | 10 yil | jigarrang `p-cam` #8F530C |

Jami staj: 40 yil (saytda shu raqam ishlatilgan).

## Dizayn qarorlari

- **Hozirgi uslub foydalanuvchiga yoqqan, saqlansin:** och fon #F4F6F9, Unbounded (sarlavha) + Manrope (matn) + JetBrains Mono (kichik yorliqlar), har ustaga o'z rangi, logotip 4 rangli 2×2 kvadrat.
- **Rad etilgan:** Buxoro ravoqlari va girih naqshli, Bricolage Grotesque shriftli uslub — foydalanuvchiga "umuman yoqmadi". Qaytarmang.
- Sayt oddiy HTML/CSS/JS, build yo'q. `assets/style.css` da 3 ta breakpoint: 1200, 900, 600 px. Telefon versiyasi 390 px da tekshirilgan.
- Sahifalar dastlab Python skripti bilan yig'ilgan, lekin skript repoda **yo'q** — endi HTML fayllarni to'g'ridan-to'g'ri tahrirlang. Ko'p sahifali o'zgarishda (masalan header) 5 ta faylning hammasini birdek o'zgartirishni unutmang.

## Hali to'ldirilishi kerak (foydalanuvchidan so'raladi)

- Telefon, Telegram, Instagram, manzil, ish vaqti — saytda `[...]` va `USERNAME` bilan belgilangan
- Viloyat tumanlariga chiqiladimi
- Har bir usta: shaxsiy rasm, shaxsiy aloqa, 3 tadan narx (`[NARX]`), haqiqiy ishlar rasmi va izohi, bio tuzatishlari
- Bajarilgan ishlar soni (`[000]+`), `[N]` lar
- Logotip bormi; mijozlar sharhlari bormi
- Forma so'rovi qayerga borsin (umumiy Telegram guruh yoki usta) — hozir `assets/main.js` faqat "qabul qilindi" xabarini ko'rsatadi, hech qayerga yubormaydi

**Rasm qo'yish:** ustalar rasmini internetdan OLMANG (begona odam rasmi — aldov). `images/` ga `sadulla.jpg` va h.k. qo'yilib, `.photo` ichiga `<img src="images/maruf.jpg" alt="Maruf Usmonov">` qo'shiladi (CSS uni joyga to'ldiradi). `images/works/` dagi 23 ta rasm Unsplash'dan vaqtinchalik namuna ("Namuna" belgisi bilan), manbalari `images/works/MANBALAR.txt` da — haqiqiy ishlar bilan almashtirilishi kerak.

## Bozor tadqiqoti (2026-09-30, OLX Buxoro viloyati)

E'lonlar soni (raqobat ko'rsatkichi): sayt/bot 57, Wi-Fi/internet 42, kamera 41, kompyuter 29, video montaj 11, prezentatsiya 7, **MikroTik 1**. Kamera e'lonlari asosan ruscha ("Установка камера", "видеонаблюдение"), shuning uchun RU versiya muhim. Hamma yo'nalishni bir joyda beradigan jamoa Buxoroda topilmadi — asosiy afzallik.

**Kalit so'zlar:** kamera o'rnatish, установка камер, видеонаблюдение, sayt yaratish, создание сайтов, telegram bot yaratish, video montaj, MikroTik sozlash, Wi-Fi, Buxoro / Бухара.

**Raqobatchilar:** areainfo.uz / elit.uz (Buxoro web studiya, 2000-yildan, landing $300 dan), mirumitech.uz (Buxoro, dasturlash), trassir-asia.uz (videokuzatuv, Buxoroda ofisi, mehmonxonalar), NEW STAR BUKHARA (kompyuter/Hikvision). Namuna ko'p xizmatli saytlar: adminz.uz (eng yaxshi namuna), alextech.uz, web-labs.kz.

**Kelajakdagi g'oyalar** (foydalanuvchi hali tasdiqlamagan): "Kimlar uchun" bo'limi (mehmonxona/do'kon/ofis/uy to'plamlari), "Bepul ko'rik" tugmasi, mijozlar sharhlari, RU versiya, formani Telegram botga ulash.

## Ish tartibi

- O'zgarishdan keyin: `git add -A && git commit -m "..." && git push` — Pages 1–2 daqiqada yangilanadi.
- Ishni boshlashdan oldin `git pull` (foydalanuvchi bir nechta kompyuterda ishlaydi).
- Commit xabarlari o'zbekcha.
