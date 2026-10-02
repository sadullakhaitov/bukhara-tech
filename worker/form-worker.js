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

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== "POST") return json({ ok: false }, 405, origin);
    if (!ALLOWED_ORIGINS.includes(origin)) return json({ ok: false }, 403, origin);

    let d;
    try { d = await request.json(); } catch { return json({ ok: false }, 400, origin); }

    // Spam-bot tuzog'i: odam bu yashirin maydonni to'ldirmaydi
    if (d.website) return json({ ok: true }, 200, origin);

    const name = clip(d.name, 80);
    const phone = clip(d.phone, 30);
    if (!name || phone.replace(/\D/g, "").length < 7) return json({ ok: false, error: "fields" }, 400, origin);

    const text = [
      "🆕 <b>Saytdan yangi so'rov</b>",
      `👤 ${esc(name)}`,
      `📞 ${esc(phone)}`,
      d.need ? `🔧 ${esc(clip(d.need, 60))}` : "",
      d.message ? `\n💬 ${esc(clip(d.message, 1500))}` : "",
      `\n🌐 ${d.lang === "ru" ? "RU" : "UZ"} · ${esc(clip(d.page, 100))}`,
    ].filter(Boolean).join("\n");

    const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
    return json({ ok: r.ok }, r.ok ? 200 : 502, origin);
  },
};
