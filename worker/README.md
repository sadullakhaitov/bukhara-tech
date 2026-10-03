# Formani Telegramga ulash (Cloudflare Worker)

Bot tokeni sayt kodiga **qo'yilmaydi** (repo ochiq). U Cloudflare Worker ichida yashirin turadi:

```
Sayt formasi  →  Cloudflare Worker (token shu yerda)  →  Telegram bot  →  sizning chatingiz
```

## Sozlash (5 daqiqa)

1. **Worker yaratish:** dash.cloudflare.com → **Workers & Pages** → **Create** → **Create Worker** → nomi `bukhara-tech-form` → **Deploy**.
2. **Kodni qo'yish:** **Edit code** → hammasini o'chirib, `form-worker.js` ichidagini qo'ying → **Deploy**.
3. **Tokenni qo'shish:** **Settings → Variables and Secrets → Add** → turi **Secret**, nomi `BOT_TOKEN`, qiymati — @BotFather bergan token → **Deploy**.
4. **Botga yozish:** Telegramda botingizga `/start` yozing (yoki botni ustalar guruhiga qo'shib, guruhga biror xabar yozing).
5. **Worker manzilini oching** (`https://bukhara-tech-form.LOGIN.workers.dev`). Sahifa botga yozgan chatlarni va ularning raqamini ko'rsatadi.
6. **CHAT_ID qo'shish:** o'sha raqamni **Settings → Variables and Secrets → Add** → turi **Text**, nomi `CHAT_ID` → **Deploy**.
7. Worker manzilini qayta oching — **"✅ Ishlayapti"** chiqsa tayyor. Manzilni `assets/main.js` dagi `FORM_ENDPOINT` ga yozing.

## Xavfsizlik

- Worker faqat `sadullakhaitov.github.io` va `bukharatech.uz` dan kelgan so'rovlarni qabul qiladi.
- Yashirin "website" maydoni spam-botlarni to'xtatadi.
- Chatlar ro'yxati faqat `CHAT_ID` kiritilmaguncha ko'rinadi.
- Token kimgadir yuborilgan bo'lsa: @BotFather → `/revoke` → yangisini faqat `BOT_TOKEN` ga qo'ying.
