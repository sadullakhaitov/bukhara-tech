# Formani Telegramga ulash (Cloudflare Worker)

Sayt oddiy HTML va repo ochiq (public), shuning uchun bot tokenini sayt kodiga qo'yib **bo'lmaydi** — uni har kim ko'rib, botingizni boshqarib oladi. Token alohida bepul "vositachi" — Cloudflare Worker ichida yashirin saqlanadi:

```
Sayt formasi  →  Cloudflare Worker (token shu yerda)  →  Telegram bot  →  sizning chatingiz
```

## 1. CHAT_ID ni bilish (xabar qayerga borsin)

**Shaxsiy chatga:** Telegramda botingizni oching va `/start` yozing.
**Guruhga:** botni guruhga qo'shing va guruhga istalgan xabar yozing.

Keyin brauzerda oching (TOKEN o'rniga bot tokeningiz):

```
https://api.telegram.org/botTOKEN/getUpdates
```

Chiqqan matndan `"chat":{"id":` dan keyingi raqamni toping — bu CHAT_ID. Guruhniki minus bilan boshlanadi (`-100...`).

## 2. Worker yaratish (bepul, ~5 daqiqa)

1. https://dash.cloudflare.com da ro'yxatdan o'ting.
2. **Workers & Pages → Create → Create Worker** → nomi: `bukhara-tech-form` → **Deploy**.
3. **Edit code** → hamma kodni o'chirib, `form-worker.js` faylining ichidagini qo'ying → **Deploy**.
4. **Settings → Variables and Secrets → Add**:
   - `BOT_TOKEN` — turi **Secret**, qiymati: bot tokeni
   - `CHAT_ID` — turi **Text**, qiymati: 1-qadamdagi raqam
5. Worker manzilini nusxalang, masalan: `https://bukhara-tech-form.LOGIN.workers.dev`

## 3. Saytga ulash

`assets/main.js` dagi qatorga Worker manzilini yozing:

```js
const FORM_ENDPOINT = "https://bukhara-tech-form.LOGIN.workers.dev";
```

## Xavfsizlik

- Worker faqat `sadullakhaitov.github.io` va `bukharatech.uz` dan kelgan so'rovlarni qabul qiladi.
- Yashirin "website" maydoni spam-botlarni to'xtatadi.
- Token kimgadir yuborilgan bo'lsa: @BotFather → `/revoke` → yangi tokenni faqat Cloudflare'ga (`BOT_TOKEN`) qo'ying.
