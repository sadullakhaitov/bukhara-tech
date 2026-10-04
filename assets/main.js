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
// Worker manzili. Bo'sh bo'lsa, forma xato ko'rsatadi (Telegram/qo'ng'iroq havolasi bilan).
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
    // Manzil bo'lmasa — soxta "qabul qilindi" ko'rsatmaymiz, xato chiqadi
    let ok = false;
    if (FORM_ENDPOINT) {
      btn.disabled = true;
      try {
        const data = Object.fromEntries(new FormData(form));
        data.lang = LANG;
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

// Setlar va kalkulyator: tugma bosilganda tanlov forma xabariga yoziladi,
// sahifa formaga tushadi va "Ismingiz" maydoni faollashadi (so'rovni forma yuboradi).
const msgField = document.querySelector("#f-msg");
const nameField = document.querySelector("#f-name");
let orderHint = null;
const needSel = document.querySelector("#f-need");
// dirs: ["p-cam"] — bitta yo'nalish; bir nechta bo'lsa "Bir nechta: ..." varianti yaratiladi
function setNeed(dirs) {
  if (!needSel) return;
  needSel.querySelector('option[data-dir="multi"]')?.remove();
  const opt = (d) => needSel.querySelector(`option[data-dir="${d}"]`);
  if (dirs.length === 1 && opt(dirs[0])) { opt(dirs[0]).selected = true; return; }
  const names = dirs.map((d) => opt(d)?.textContent).filter(Boolean);
  const multi = document.createElement("option");
  multi.dataset.dir = "multi";
  multi.textContent = tx("Bir nechta", "Несколько", "Several") + ": " + names.join(", ");
  needSel.append(multi);
  multi.selected = true;
}
document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-order]");
    if (!a || !form || !msgField || !a.dataset.order) return; // usta sahifalarida — oddiy havola (Telegram)
    e.preventDefault();
    let text = a.dataset.order;
    const set = a.closest(".set");
    if (set) {
      // Setning tarkibi va narxi kartadan olinadi (UZ/RU/EN uchun bir xil ishlaydi)
      const items = [...set.querySelectorAll(".set-items li")].map((li) => "• " + li.textContent.trim());
      const price = set.querySelector(".set-price strong")?.textContent.trim();
      const equip = set.querySelector(".set-equip")?.textContent.trim();
      text = text.replace(/[.!]$/, ":") + "\n" + items.join("\n");
      if (price) text += "\n" + tx("Narxi", "Цена", "Price") + ": " + price.replace(/\s+/g, " ");
      if (equip) text += "\n" + equip.replace(/\s+/g, " ");
    }
    msgField.value = text;
    // "Nima kerak?" maydonini tanlovga qarab avtomatik belgilaymiz
    if (set) setNeed(["set"]);
    else if (a.classList.contains("calc-order")) {
      const dirs = [...document.querySelectorAll(".calc-group")]
        .filter((g) => [...g.querySelectorAll(".calc-row input")].some((i) => (parseInt(i.value, 10) || 0) > 0))
        .map((g) => [...g.classList].find((c) => c.startsWith("p-")));
      if (dirs.length) setNeed(dirs);
    }
    if (!orderHint) {
      orderHint = document.createElement("p");
      orderHint.className = "form-hint";
      orderHint.setAttribute("role", "status");
      form.prepend(orderHint);
    }
    orderHint.textContent = tx(
      "✓ Tanlovingiz xabarga qoʻshildi. Endi ism va telefonni yozib, «Soʻrov yuborish»ni bosing.",
      "✓ Ваш выбор добавлен в сообщение. Укажите имя и телефон и нажмите «Отправить заявку».",
      "✓ Your selection has been added to the message. Enter your name and phone, then press “Send request”."
    );
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => nameField && nameField.focus({ preventScroll: true }), 500);
    form.classList.remove("flash");
    void form.offsetWidth;
    form.classList.add("flash");
});

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
    barTotal.textContent = total.textContent;
    hasSum = s > 0;
    syncBar();
  };

  // Telefonda: tanlov bo'lsa, ekran pastida "Jami · Buyurtma berish" qatori
  const bar = document.createElement("div");
  bar.className = "calc-bar";
  bar.setAttribute("aria-hidden", "true");
  bar.innerHTML = '<span class="calc-bar-text"><small></small><b></b></span><button type="button" class="btn btn-dark"></button>';
  bar.querySelector("small").textContent = tx("Jami", "Итого", "Total");
  bar.querySelector("button").textContent = tx("Buyurtma →", "Заказать →", "Order →");
  bar.querySelector("button").addEventListener("click", () => order.click());
  const barTotal = bar.querySelector("b");
  document.body.append(bar);
  let hasSum = false, inCalc = false, sumVisible = false;
  const syncBar = () => {
    const show = hasSum && inCalc && !sumVisible;
    bar.classList.toggle("show", show);
    bar.setAttribute("aria-hidden", String(!show));
    bar.inert = !show;
  };
  if ("IntersectionObserver" in window) {
    // Kalkulyator bo'limi ekranning o'rta qismini egallagandagina (chetidan ko'rinib turganda emas)
    new IntersectionObserver(([e]) => { inCalc = e.isIntersecting; syncBar(); }, { rootMargin: "-35% 0px -35% 0px" }).observe(calc.closest("section") || calc);
    // Jami summa raqamining o'zi ko'rinsa (pastki panellar ostida emas) — bar kerak emas
    new IntersectionObserver(([e]) => { sumVisible = e.isIntersecting; syncBar(); }, { rootMargin: "0px 0px -170px 0px", threshold: 1 }).observe(total);
  }

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

// Telefon: "Barcha savollar" tugmasi (CSS faqat ≤600px da ko'rsatadi)
const faqAll = document.querySelector(".faq:not(.faq-one)");
if (faqAll) {
  const hidden = faqAll.querySelectorAll(".faq-group .faq-item:nth-of-type(n+3)").length;
  if (hidden) {
    const more = document.createElement("button");
    more.type = "button";
    more.className = "btn btn-outline faq-more";
    more.textContent = tx(`Yana ${hidden} ta savol`, `Ещё ${hidden} вопросов`, `${hidden} more questions`);
    more.addEventListener("click", () => { faqAll.classList.add("faq-all"); more.remove(); });
    faqAll.after(more);
  }
}

// Telefon: xizmatlar, ishlar va setlar — cheksiz aylanadigan qator.
// Yonga surishni telefonning o'zi (oddiy scroll + scroll-snap) bajaradi — iPhone yo'nalishni
// eng to'g'ri aniqlaydi. Kartalar har ikki tomonga ko'p marta takrorlanadi, shuning uchun oxiriga
// yetib bo'lmaydi; surish to'xtagach, ko'rinmas tarzda o'rtadagi asl nusxaga qaytariladi.
const mqPhone = matchMedia("(max-width: 600px)");
// Barmoq/sichqoncha bilan gorizontal surish. Telefonda touch hodisalari ishlatiladi:
// birinchi harakatdayoq yo'nalish aniqlanadi va yon harakat bo'lsa sahifa surilishi to'xtatiladi
// (pointer hodisalarida iPhone harakatni "tikka" deb o'zi hal qilib, karuselni bekor qilib qo'yardi).
function swipe(el, h) {
  const ac = new AbortController(), o = { signal: ac.signal };
  let s = null;
  // Sichqoncha
  el.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    s = { x: e.clientX, y: e.clientY, dir: null, mouse: true, id: e.pointerId };
    h.down && h.down();
  }, o);
  el.addEventListener("pointermove", (e) => {
    if (!s || !s.mouse || e.pointerId !== s.id) return;
    const dx = e.clientX - s.x;
    if (!s.dir) {
      if (Math.abs(dx) < 5) return;
      s.dir = "x";
      el.setPointerCapture(e.pointerId);
      h.start(s.x);
    }
    h.move(dx, e.clientX);
  }, o);
  const mouseEnd = (e) => {
    if (!s || !s.mouse || e.pointerId !== s.id) return;
    const was = s.dir === "x"; s = null;
    if (was) h.end();
  };
  el.addEventListener("pointerup", mouseEnd, o);
  el.addEventListener("pointercancel", mouseEnd, o);
  // Barmoq
  el.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) { if (s && s.dir === "x") h.end(); s = null; return; }
    const t = e.touches[0];
    s = { x: t.clientX, y: t.clientY, dir: null };
    h.down && h.down();
  }, { passive: true, signal: ac.signal });
  el.addEventListener("touchmove", (e) => {
    if (!s || s.mouse) return;
    const t = e.touches[0];
    const dx = t.clientX - s.x, dy = t.clientY - s.y;
    if (!s.dir) {
      if (!dx && !dy) return;
      s.dir = Math.abs(dx) >= Math.abs(dy) * 0.8 && e.cancelable ? "x" : "y"; // yoy shaklidagi surish ham yonga hisoblanadi
      if (s.dir === "x") h.start(s.x);
    }
    if (s.dir !== "x") return; // tikka — sahifa o'zi suriladi
    if (e.cancelable) e.preventDefault();
    h.move(dx, t.clientX);
  }, { passive: false, signal: ac.signal });
  const touchEnd = () => {
    if (!s || s.mouse) return;
    const was = s.dir === "x"; s = null;
    if (was) h.end();
  };
  el.addEventListener("touchend", touchEnd, o);
  el.addEventListener("touchcancel", touchEnd, o);
  el.addEventListener("dragstart", (e) => e.preventDefault(), o);
  return () => ac.abort();
}
function cloneOf(el) {
  const c = el.cloneNode(true);
  c.classList.add("is-clone");
  c.setAttribute("aria-hidden", "true");
  c.querySelectorAll("a, button").forEach((x) => (x.tabIndex = -1));
  return c;
}
function loopRow(row) {
  const items = [...row.children];
  const n = items.length;
  if (n < 2) return () => {};
  const reps = Math.max(4, Math.ceil(36 / n)); // har tomonda nechta to'liq nusxa
  for (let r = 0; r < reps; r++) {
    row.prepend(...items.map(cloneOf));
    row.append(...items.map(cloneOf));
  }
  const x = (el) => el.getBoundingClientRect().left;
  const posOf = (el) => row.scrollLeft + x(el) - x(row) - parseFloat(getComputedStyle(row).paddingLeft);
  const period = () => x(items[n - 1].nextElementSibling) - x(items[0]);
  const fix = () => {
    const p = period(), home = posOf(items[0]);
    if (!p) return;
    let sl = row.scrollLeft;
    while (sl < home - p / 2) sl += p;
    while (sl >= home + p / 2) sl -= p;
    if (Math.abs(sl - row.scrollLeft) > 1) row.scrollLeft = sl;
  };
  let t;
  const onScroll = () => { clearTimeout(t); t = setTimeout(fix, 220); };
  const onEnd = () => { clearTimeout(t); t = setTimeout(fix, 60); };
  row.addEventListener("scroll", onScroll, { passive: true });
  if ("onscrollend" in window) row.addEventListener("scrollend", onEnd);
  const start = items.find((el) => el.classList.contains("set-hot")) || items[0];
  row.scrollLeft = posOf(start);
  return () => {
    clearTimeout(t);
    row.removeEventListener("scroll", onScroll);
    row.removeEventListener("scrollend", onEnd);
    row.querySelectorAll(":scope > .is-clone").forEach((c) => c.remove());
    row.scrollLeft = 0;
  };
}
let rowTeardowns = [];
const applyRows = () => {
  rowTeardowns.forEach((f) => f());
  rowTeardowns = mqPhone.matches ? [...document.querySelectorAll(".svcs, .works, .sets")].map(loopRow) : [];
};
mqPhone.addEventListener("change", applyRows);
applyRows();

// "Biz ishlagan joylar" va sharhlar: o'zi sekin aylanadigan, qo'lda ham suriladigan cheksiz lenta.
// scrollLeft emas, transform bilan suriladi — iPhone'da tez surilganda ham yo'qolib qolmaydi.
function marquee(list, SPEED) {
  const originals = [...list.children];
  if (!originals.length) return;
  const box = document.createElement("div");
  box.className = "marquee";
  list.before(box);
  box.append(list);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let period = 0, pos = 0, vel = 0, holdUntil = 0, hover = false, visible = true, last = 0;
  let drag = null; // { id, x, y, pos, on, t, lx }
  const paint = () => { list.style.transform = `translate3d(${-pos}px, 0, 0)`; };
  const wrap = () => {
    if (!period) return;
    pos = ((pos % period) + period) % period;
  };
  const build = () => {
    list.querySelectorAll(".is-clone").forEach((c) => c.remove());
    list.append(...originals.map(cloneOf));
    period = list.children[originals.length].offsetLeft - originals[0].offsetLeft;
    while (list.scrollWidth < period + box.clientWidth * 2) list.append(...originals.map(cloneOf));
    wrap();
    paint();
  };
  const tick = (now) => {
    const dt = last ? Math.min(now - last, 64) / 1000 : 0;
    last = now;
    if (visible && !drag && period) {
      if (Math.abs(vel) > 5) {
        // qo'yib yuborilgandan keyingi inersiya
        pos += vel * dt;
        vel *= Math.pow(0.04, dt);
        wrap(); paint();
      } else if (!reduce && !hover && now > holdUntil) {
        pos += SPEED * dt;
        wrap(); paint();
      }
    }
    requestAnimationFrame(tick);
  };
  list.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") hover = true; });
  list.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") hover = false; });
  swipe(list, {
    down: () => { holdUntil = performance.now() + 2500; vel = 0; },
    start: (x) => {
      drag = { pos, t: performance.now(), lx: x };
      vel = 0;
      box.classList.add("dragging");
    },
    move: (dx, x) => {
      const now = performance.now(), dt = (now - drag.t) / 1000;
      if (dt > 0) vel = vel * 0.6 + (-(x - drag.lx) / dt) * 0.4;
      drag.t = now; drag.lx = x;
      pos = drag.pos - dx;
      if (period && (pos < 0 || pos >= period)) { const p0 = pos; wrap(); drag.pos += pos - p0; }
      paint();
    },
    end: () => {
      if (!drag) return;
      if (performance.now() - drag.t > 80) vel = 0;
      vel = Math.max(-2500, Math.min(2500, vel));
      drag = null;
      holdUntil = performance.now() + 2500;
      box.classList.remove("dragging");
    },
  });
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; last = 0; }).observe(box);
  let rt, lastW = innerWidth;
  // iPhone'da manzil qatori yashiringanda ham resize bo'ladi — faqat kenglik o'zgarsa qayta quramiz
  addEventListener("resize", () => {
    if (innerWidth === lastW) return;
    lastW = innerWidth;
    clearTimeout(rt); rt = setTimeout(build, 200);
  });
  build();
  if (document.fonts) document.fonts.ready.then(build);
  requestAnimationFrame(tick);
}
document.querySelectorAll(".clients").forEach((el) => marquee(el, 32)); // px / soniya
document.querySelectorAll(".reviews").forEach((el) => marquee(el, 26));
