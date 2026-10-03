// Bukhara Tech — sayt formasidan kelgan so'rovni Telegramga yuboruvchi Cloudflare Worker.
//
// Bot tokeni shu yerda EMAS, Cloudflare "Secrets" ichida saqlanadi:
//   BOT_TOKEN — @BotFather bergan token
//   CHAT_ID   — xabar boradigan chat (shaxsiy chat yoki guruh) raqami
// O'rnatish yo'riqnomasi: worker/README.md

const ALLOWED_ORIGINS = [
  "https://sadullakhaitov.github.io",
  "https://bukharatech.uz",
  "https://www.bukharatech.uz",
];

const cors = (origin) => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Vary": "Origin",
});

const json = (data, status, origin) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...cors(origin) } });

// Telegram HTML rejimi uchun maxsus belgilarni xavfsiz qilish
const esc = (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const clip = (s, n) => String(s ?? "").trim().slice(0, n);

// Brauzerda Worker manzili ochilganda: sozlash holatini ko'rsatadi.
// CHAT_ID hali kiritilmagan bo'lsa — botga yozgan chatlarni topib, ularning raqamini chiqaradi.
// CHAT_ID kiritilgach, bu ro'yxat boshqa ko'rsatilmaydi (begonalar chatlarni ko'ra olmaydi).
async function setupPage(env) {
  const page = (body) => new Response(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bukhara Tech — forma</title>` +
    `<body style="font:16px/1.5 system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 16px;color:#101820">${body}</body>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } });
  if (!env.BOT_TOKEN) {
    return page("<h2>1-qadam qolgan</h2><p><b>Settings → Variables and Secrets</b> ga <code>BOT_TOKEN</code> (turi: Secret) qo'shing va shu sahifani yangilang.</p>");
  }
  if (env.CHAT_ID) {
    // Bot va chatni Telegram'dan tekshiramiz (xabar yubormasdan)
    try {
      const api = (m, q = "") => fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${m}${q}`).then((r) => r.json());
      const me = await api("getMe");
      if (!me.ok) return page(`<h2>❌ Token xato</h2><p>Telegram javobi: ${esc(me.description)}. <code>BOT_TOKEN</code> ni tekshiring.</p>`);
      const ch = await api("getChat", `?chat_id=${encodeURIComponent(env.CHAT_ID)}`);
      if (!ch.ok) return page(`<h2>❌ CHAT_ID xato</h2><p>Bot: <b>@${esc(me.result.username)}</b></p><p>Telegram javobi: ${esc(ch.description)}.</p><p>Botga <b>/start</b> yozganingizni tekshiring va <code>CHAT_ID</code> ni o'chirib, shu sahifani qayta oching — to'g'ri raqam chiqadi.</p>`);
      const c = ch.result;
      const who = c.title || [c.first_name, c.last_name].filter(Boolean).join(" ") || c.username || c.id;
      return page(`<h2>✅ Ishlayapti</h2><p>Bot: <b>@${esc(me.result.username)}</b><br>So'rovlar shu chatga keladi: <b>${esc(String(who))}</b> (${esc(c.type)}, <code>${esc(String(c.id))}</code>)</p><p>Agar bu boshqa chat bo'lsa — <code>CHAT_ID</code> ni o'zgartiring.</p>`);
    } catch (e) {
      return page("<h2>Telegram'ga ulanib bo'lmadi</h2><p>Bir ozdan keyin sahifani yangilang.</p>");
    }
  }
  let chats = [];
  try {
    const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/getUpdates`);
    const j = await r.json();
    if (!j.ok) return page(`<h2>Token xato</h2><p>Telegram javobi: ${esc(j.description || "noma'lum xato")}. <code>BOT_TOKEN</code> ni tekshiring.</p>`);
    const seen = new Map();
    for (const u of j.result || []) {
      const c = (u.message || u.channel_post || u.my_chat_member || {}).chat;
      if (c) seen.set(c.id, c.title || [c.first_name, c.last_name].filter(Boolean).join(" ") || c.username || "");
    }
    chats = [...seen];
  } catch (e) {
    return page("<h2>Telegram'ga ulanib bo'lmadi</h2><p>Bir ozdan keyin sahifani yangilang.</p>");
  }
  if (!chats.length) {
    return page("<h2>2-qadam: botga yozing</h2><p>Telegramda botingizni oching va <b>/start</b> yozing (yoki botni ustalar guruhiga qo'shib, guruhga biror xabar yozing). Keyin shu sahifani yangilang.</p>");
  }
  const rows = chats.map(([id, name]) => `<li style="margin:8px 0"><b>${esc(name)}</b> — <code style="font-size:18px;background:#eef;padding:2px 6px">${id}</code></li>`).join("");
  return page(`<h2>3-qadam: CHAT_ID ni kiriting</h2><p>So'rovlar qaysi chatga kelsin? Raqamini nusxalab, <b>Settings → Variables and Secrets</b> ga <code>CHAT_ID</code> nomi bilan qo'shing:</p><ul>${rows}</ul><p>Guruh raqami minus bilan boshlanadi.</p>`);
}

// Telefonni chiroyli ko'rinishga keltiradi: 901234567 / 998901234567 → +998 90 123 45 67
function prettyPhone(p) {
  const dg = p.replace(/\D/g, "");
  const n = dg.length === 9 ? "998" + dg : dg;
  if (n.length === 12 && n.startsWith("998")) return `+998 ${n.slice(3, 5)} ${n.slice(5, 8)} ${n.slice(8, 10)} ${n.slice(10)}`;
  return p;
}

const LANGS = { uz: "🇺🇿 Oʻzbekcha", ru: "🇷🇺 Русский", en: "🇬🇧 English" };

// Telegram xabari (HTML)
function formatMessage({ name, phone, need, message, lang }) {
  const time = new Date().toLocaleString("ru-RU", { timeZone: "Asia/Tashkent", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const lines = [
    "🔔 <b>Yangi buyurtma · Bukhara Tech</b>",
    "",
    `👤 <b>Ism:</b> ${esc(name)}`,
    `📞 <b>Telefon:</b> ${esc(prettyPhone(phone))}`,
  ];
  if (need) lines.push(`🔧 <b>Yoʻnalish:</b> ${esc(need)}`);
  lines.push(`🌐 <b>Til:</b> ${LANGS[lang] || LANGS.uz}`);
  if (message) lines.push("", "📝 <b>Xabar:</b>", `<blockquote>${esc(message)}</blockquote>`);
  lines.push("", `🕒 ${time}`);
  return lines.join("\n");
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method === "GET") return setupPage(env);
    if (request.method !== "POST") return json({ ok: false }, 405, origin);
    if (!ALLOWED_ORIGINS.includes(origin)) return json({ ok: false }, 403, origin);

    let d;
    try { d = await request.json(); } catch { return json({ ok: false }, 400, origin); }

    // Spam-bot tuzog'i: odam bu yashirin maydonni to'ldirmaydi
    if (d.website) return json({ ok: true }, 200, origin);

    const name = clip(d.name, 80);
    const phone = clip(d.phone, 30);
    if (!name || phone.replace(/\D/g, "").length < 7) return json({ ok: false, error: "fields" }, 400, origin);

    const text = formatMessage({ name, phone, need: clip(d.need, 60), message: clip(d.message, 1500), lang: d.lang });

    const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      console.log("Telegram sendMessage xato:", r.status, err.description); // Cloudflare → Observability → Logs
      return json({ ok: false, error: err.description || "telegram" }, 502, origin);
    }
    return json({ ok: true }, 200, origin);
  },
};
