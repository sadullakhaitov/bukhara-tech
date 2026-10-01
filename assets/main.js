const ru = document.documentElement.lang === "ru";

// Kunduzgi / tungi rejim. Boshlang'ich qiymat <head> dagi skriptda o'rnatiladi.
const root = document.documentElement;
const themeBtn = document.querySelector(".theme-btn");
const themeLabel = (dark) =>
  dark
    ? (ru ? "Включить светлую тему" : "Kunduzgi rejimni yoqish")
    : (ru ? "Включить тёмную тему" : "Tungi rejimni yoqish");
if (themeBtn) {
  themeBtn.setAttribute("aria-label", themeLabel(root.dataset.theme === "dark"));
  themeBtn.addEventListener("click", () => {
    const dark = root.dataset.theme !== "dark";
    root.dataset.theme = dark ? "dark" : "light";
    themeBtn.setAttribute("aria-label", themeLabel(dark));
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
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
      ? (ru ? "Закрыть меню" : "Menyuni yopish")
      : (ru ? "Открыть меню" : "Menyuni ochish"));
  });
  header.querySelectorAll(".nav a").forEach((a) =>
    a.addEventListener("click", () => {
      header.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    })
  );
}

// Buyurtma formasi. Telegram bot ulangach, so'rov shu yerdan botga yuboriladi.
const form = document.querySelector("#order-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const done = form.querySelector(".form-done");
    done.hidden = false;
    done.focus();
    form.reset();
  });
}
