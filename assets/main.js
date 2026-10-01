// Telefondagi menyu
const header = document.querySelector(".header");
const burger = document.querySelector(".burger");
if (header && burger) {
  burger.addEventListener("click", () => {
    const open = header.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Menyuni yopish" : "Menyuni ochish");
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
