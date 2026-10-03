const LANG = document.documentElement.lang;
const ru = LANG === "ru";
// Uch tilli matn: tx("o'zbekcha", "русский", "english")
const tx = (uz, r, en) => (LANG === "ru" ? r : LANG === "en" ? en : uz);

// Kunduzgi / tungi rejim. Boshlang'ich qiymat <head> dagi skriptda o'rnatiladi.
const root = document.documentElement;
const themeBtn = document.querySelector(".theme-btn");
const themeLabel = (dark) =>
  dark
    ? tx("Kunduzgi rejimni yoqish", "Включить светлую тему", "Switch to light mode")
    : tx("Tungi rejimni yoqish", "Включить тёмную тему", "Switch to dark mode");
if (themeBtn) {
  themeBtn.setAttribute("aria-label", themeLabel(root.dataset.theme === "dark"));
  themeBtn.addEventListener("click", () => {
    const dark = root.dataset.theme !== "dark";
    root.dataset.theme = dark ? "dark" : "light";
    themeBtn.setAttribute("aria-label", themeLabel(dark));
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  });
}

// Til tanlash: globus tugmasi bosilganda ro'yxat ochiladi
const langBtn = document.querySelector(".lang-btn");
const langMenu = document.querySelector(".lang-menu");
if (langBtn && langMenu) {
  const setOpen = (open) => {
    langMenu.hidden = !open;
    langBtn.setAttribute("aria-expanded", String(open));
  };
  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(langMenu.hidden);
    if (!langMenu.hidden) langMenu.querySelector("a")?.focus({ preventScroll: true });
  });
  document.addEventListener("click", (e) => {
    if (!langMenu.hidden && !langMenu.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !langMenu.hidden) { setOpen(false); langBtn.focus(); }
  });
}

// Telefondagi menyu
const header = document.querySelector(".header");
const burger = document.querySelector(".burger");
if (header && burger) {
  burger.addEventListener("click", () => {
    const open = header.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open
      ? tx("Menyuni yopish", "Закрыть меню", "Close menu")
      : tx("Menyuni ochish", "Открыть меню", "Open menu"));
  });
  header.querySelectorAll(".nav a").forEach((a) =>
    a.addEventListener("click", () => {
      header.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    })
  );
}

// Buyurtma formasi -> Cloudflare Worker -> Telegram (worker/README.md ga qarang).
// Worker o'rnatilgach, uning manzilini shu yerga yozing. Bo'sh bo'lsa, forma hech qayerga yubormaydi.
const FORM_ENDPOINT = "https://bukhara-tech-form.sadulla-khaitov.workers.dev";
const form = document.querySelector("#order-form");
if (form) {
  const done = form.querySelector(".form-done");
  const fail = form.querySelector(".form-error");
  const btn = form.querySelector('[type="submit"]');
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    done.hidden = true;
    fail.hidden = true;
    let ok = true;
    if (FORM_ENDPOINT) {
      btn.disabled = true;
      try {
        const data = Object.fromEntries(new FormData(form));
        data.lang = LANG;
        data.page = location.pathname;
        const r = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        ok = r.ok;
      } catch (err) {
        ok = false;
      }
      btn.disabled = false;
    }
    const msgEl = ok ? done : fail;
    msgEl.hidden = false;
    msgEl.focus();
    if (ok) form.reset();
  });
}

// Setlar va kalkulyator: tugma bosilganda forma xabariga yoziladi
const msgField = document.querySelector("#f-msg");
document.querySelectorAll("[data-order]").forEach((a) =>
  a.addEventListener("click", () => {
    if (msgField && a.dataset.order) msgField.value = a.dataset.order;
  })
);

// Narx kalkulyatori
const calc = document.querySelector(".calc");
if (calc) {
  const money = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const { sum: cur, from, msg } = calc.dataset;
  const rows = [...calc.querySelectorAll(".calc-row")];
  const total = calc.querySelector(".calc-total");
  const picked = calc.querySelector(".calc-picked");
  const empty = picked.querySelector(".calc-empty").textContent;
  const order = calc.querySelector(".calc-order");

  const update = () => {
    let s = 0;
    const lines = [];
    picked.replaceChildren();
    rows.forEach((r) => {
      const input = r.querySelector("input");
      let n = Math.max(0, Math.min(999, parseInt(input.value, 10) || 0));
      if (String(n) !== input.value) input.value = n;
      r.classList.toggle("on", n > 0);
      if (!n) return;
      const cost = n * Number(r.dataset.price);
      s += cost;
      const li = document.createElement("li");
      const a = document.createElement("span");
      const b = document.createElement("span");
      a.textContent = `${r.dataset.name} × ${n}`;
      b.textContent = `${money(cost)} ${cur}`;
      li.append(a, b);
      picked.append(li);
      lines.push(`— ${r.dataset.name}: ${n} ${r.dataset.unit}`);
    });
    if (!lines.length) {
      const li = document.createElement("li");
      li.className = "calc-empty";
      li.textContent = empty;
      picked.append(li);
    }
    calc.querySelectorAll(".calc-group").forEach((g) => {
      let gs = 0;
      g.querySelectorAll(".calc-row").forEach((r) => {
        gs += (parseInt(r.querySelector("input").value, 10) || 0) * Number(r.dataset.price);
      });
      g.querySelector(".calc-gsum").textContent = gs ? `${money(gs)} ${cur}` : "";
    });
    total.textContent = s ? `${money(s)} ${cur}${from || ""}` : `0 ${cur}`;
    order.setAttribute("aria-disabled", String(!s));
    order.dataset.order = s ? `${msg}\n${lines.join("\n")}\n≈ ${money(s)} ${cur}` : "";
  };

  calc.addEventListener("click", (e) => {
    const btn = e.target.closest(".step-btn");
    if (!btn) return;
    const input = btn.parentElement.querySelector("input");
    input.value = Math.max(0, (parseInt(input.value, 10) || 0) + Number(btn.dataset.step));
    update();
  });
  calc.addEventListener("input", update);
  update();
}
