#!/usr/bin/env python3
"""Admin panel (content/*.json) ma'lumotlaridan saytning 12 ta HTML sahifasini yangilaydi
(bosh sahifa + 3 xizmat sahifasi: sayt, ai, internet — uchala tilda).

HTML ichida `<!-- cms:NOM -->` ... `<!-- /cms:NOM -->` belgilari orasidagi qism shu yerda
qayta yoziladi — u joylarni qo'lda tahrirlamang, content/ dagi JSON'ni o'zgartiring.
Aloqa ma'lumotlari (telefon, Telegram, Instagram, ish vaqti) esa butun saytda eski qiymatni
yangisiga almashtirish orqali yangilanadi (oxirgi qo'llangan qiymatlar tools/.aloqa-holat.json da).

Ishga tushirish: python3 tools/build.py   (GitHub Action ham shuni qiladi)
"""
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
C = ROOT / "content"
LANGS = {"": "uz", "ru/": "ru", "en/": "en"}
PAGES = ["sayt", "ai", "internet"]
DIR_PAGE = {"p-net": "internet", "p-web": "sayt", "p-ai": "ai"}
DIR_ICON = {"p-cam": "fa-video", "p-net": "fa-wifi", "p-web": "fa-laptop-code", "p-media": "fa-clapperboard",
            "p-ai": "fa-wand-magic-sparkles", "p-pc": "fa-desktop"}
FA = '<i class="fa-solid {}" aria-hidden="true"></i>'

T = {  # sahifadagi doimiy yozuvlar
    "cur": {"uz": "soʻm", "ru": "сум", "en": "UZS"},
    "from": {"uz": "{p} soʻmdan", "ru": "от {p} сум", "en": "from {p} UZS"},
    "per": {"uz": "1 {u} uchun", "ru": "за 1 {u}", "en": "per {u}"},
    "less": {"uz": "Kamaytirish", "ru": "Меньше", "en": "Less"},
    "more": {"uz": "Koʻpaytirish", "ru": "Больше", "en": "More"},
    "sep": {"uz": "Alohida", "ru": "По отдельности", "en": "Separately"},
    "save": {"uz": "Tejaysiz", "ru": "Экономия", "en": "Save"},
    "hot_home": {"uz": "Eng koʻp tanlanadi", "ru": "Выбирают чаще всего", "en": "Most popular"},
    "hot_master": {"uz": "Koʻp tanlanadi", "ru": "Выбирают чаще", "en": "Most popular"},
    "pick_home": {"uz": "Setni tanlash", "ru": "Выбрать сет", "en": "Choose bundle"},
    "pick_master": {"uz": "Tanlash", "ru": "Выбрать", "en": "Choose"},
    "order_home": {"uz": "«{t}» buyurtma qilmoqchiman.", "ru": "Хочу заказать {t}.", "en": "I'd like to order the {t}."},
    "order_master": {"uz": "Salom! «{t}» paketi qiziqtiradi.", "ru": "Здравствуйте! Интересует пакет «{t}».",
                     "en": "Hello! I'm interested in the “{t}” package."},
    "single": {"uz": "Alohida xizmatlar:", "ru": "Отдельные услуги:", "en": "Individual services:"},
    "free": {"uz": "bepul", "ru": "бесплатно", "en": "free"},
    "sample": {"uz": "Namuna", "ru": "Пример", "en": "Sample"},
    "before": {"uz": "OLDIN", "ru": "ДО", "en": "BEFORE"},
    "no_photo": {"uz": "Rasm qoʻyiladi", "ru": "Здесь будет фото", "en": "Photo coming soon"},
    "after": {"uz": "KEYIN", "ru": "ПОСЛЕ", "en": "AFTER"},
    "card_years": {"uz": "yillik tajriba", "ru": "лет опыта", "en": "years of experience"},
    "more_link": {"uz": "Batafsil", "ru": "Подробнее", "en": "Learn more"},
    "years_a": {"uz": "yillik", "ru": "лет", "en": "years"},
    "years_b": {"uz": "ish staji", "ru": "опыта", "en": "of experience"},
    "total": {"uz": "ish tajribasi", "ru": "опыта работы", "en": "of experience"},
    "reviews": {"uz": "Mijozlar fikri", "ru": "Отзывы клиентов", "en": "What clients say"},
    "c_map": {"uz": "Xaritada ochish", "ru": "Открыть на карте", "en": "Open in maps"},
    "stir": {"uz": "STIR", "ru": "ИНН", "en": "TIN"},
    "c_tg": {"uz": "Telegram", "ru": "Telegram", "en": "Telegram"},
    "c_phone": {"uz": "Telefon", "ru": "Телефон", "en": "Phone"},
    "c_ig": {"uz": "Instagram", "ru": "Instagram", "en": "Instagram"},
    "c_hours": {"uz": "Ish vaqti", "ru": "Время работы", "en": "Working hours"},
    "c_addr": {"uz": "Manzil", "ru": "Адрес", "en": "Address"},
    # Hero'dagi "Xizmatlar va narxlar" kartasi
    "hc_title": {"uz": "Xizmatlar va narxlar", "ru": "Услуги и цены", "en": "Services and prices"},
    "hc_calc": {"uz": "Aniq narxni hisoblash", "ru": "Рассчитать точную цену", "en": "Calculate the exact price"},
    "hc_sub": {
        "p-web": {"uz": "Landing · korporativ sayt · Telegram bot", "ru": "Лендинг · корпоративный сайт · Telegram-бот",
                  "en": "Landing page · company site · Telegram bot"},
        "p-ai": {"uz": "AI yordamchi · avtomatlashtirish", "ru": "AI-помощник · автоматизация", "en": "AI assistant · automation"},
        "p-net": {"uz": "Wi-Fi · MikroTik · kompyuterlar", "ru": "Wi-Fi · MikroTik · компьютеры", "en": "Wi-Fi · MikroTik · computers"},
    },
}
def load(name):
    return json.loads((C / f"{name}.json").read_text(encoding="utf-8"))


def e(s):
    return html.escape(str(s or ""), quote=True)


def tr(obj, lang):
    """{uz, ru, en} matn — tarjima bo'sh bo'lsa o'zbekchasi ko'rinadi."""
    if isinstance(obj, dict):
        return (obj.get(lang) or obj.get("uz") or "").strip()
    return str(obj or "").strip()


def money(n):
    return f"{int(n):,}".replace(",", "&nbsp;")


def img_src(path, prefix):
    path = (path or "").strip()
    if path.startswith(("http://", "https://")):
        return path
    return ("../" if prefix else "") + path.lstrip("/")


def ru_years(n):
    n = int(n)
    if n % 10 == 1 and n % 100 != 11:
        return f"{n} год"
    if 2 <= n % 10 <= 4 and not 12 <= n % 100 <= 14:
        return f"{n} года"
    return f"{n} лет"


def ru_word(n, one, few, many):
    n = int(n)
    if n % 10 == 1 and n % 100 != 11:
        return one
    if 2 <= n % 10 <= 4 and not 12 <= n % 100 <= 14:
        return few
    return many


def card_years(n, lang):
    return ru_word(n, "год опыта", "года опыта", "лет опыта") if lang == "ru" else T["card_years"][lang]


def years_total(n, lang):
    return {"uz": f"{n} yil", "ru": ru_years(n), "en": f"{n} years"}[lang]


# ---------------- Bloklar ----------------

def r_svcs(lang, prefix):
    out = ['<div class="svcs">']
    for s in load("xizmatlar")["kartalar"]:
        d = s["yonalish"]
        out.append(f'''        <article class="svc {d}">
          <span class="svc-icon">{FA.format(DIR_ICON[d])}</span>
          <h3>{e(tr(s["sarlavha"], lang))}</h3>
          <p>{e(tr(s["matn"], lang))}</p>
          <div class="svc-price">{T["from"][lang].format(p=money(s["narx"]))}</div>
          <a class="btn btn-outline" href="{DIR_PAGE[d]}.html">{e(tr(s["tugma"], lang))} {FA.format("fa-arrow-right")}</a>
        </article>''')
    out.append("      </div>")
    return "\n".join(out)


def r_hero(lang, prefix):
    a = load("aloqa")
    rows = []
    for s in load("xizmatlar")["kartalar"]:
        d = s["yonalish"]
        rows.append(f'''<a class="hc-row {d}" href="{DIR_PAGE[d]}.html"><span class="hc-ico">{FA.format(DIR_ICON[d])}</span><span class="hc-text"><b>{e(tr(s["tugma"], lang))}</b><small>{e(T["hc_sub"][d][lang])}</small></span><span class="hc-price">{T["from"][lang].format(p=money(s["narx"]))}</span></a>''')
    return f'''<div class="hero-card">
          <div class="hc-head"><span>{T["hc_title"][lang]}</span><span class="hc-live"><i></i>{e(tr(a["ish_vaqti"], lang))}</span></div>
          {"".join(rows)}
          <a class="hc-foot" href="#kalkulyator">{T["hc_calc"][lang]} {FA.format("fa-arrow-right")}</a>
        </div>'''


def r_calc(lang, prefix):
    out = ['<div class="calc-list">']
    for g in load("kalkulyator")["guruhlar"]:
        out.append(f'          <details class="calc-group {g["yonalish"]}"{" open" if g.get("ochiq") else ""}>')
        out.append(f'            <summary><i></i><span>{e(tr(g["nomi"], lang))}</span><span class="calc-gsum"></span></summary>')
        for r in g["qatorlar"]:
            name, unit = e(tr(r["nomi"], lang)), e(tr(r["birlik"], lang))
            per = T["per"][lang].format(u=unit)
            out.append(f'''            <div class="calc-row" data-price="{int(r["narx"])}" data-name="{name}" data-unit="{unit}">
              <span class="calc-name"><b>{name}</b><small>{money(r["narx"])} {T["cur"][lang]} · {per}</small></span>
              <span class="stepper"><button type="button" class="step-btn" data-step="-1" aria-label="{T["less"][lang]}: {name}">−</button><input type="number" min="0" max="999" value="{int(r.get("boshlangich") or 0)}" inputmode="numeric" aria-label="{name}"><button type="button" class="step-btn" data-step="1" aria-label="{T["more"][lang]}: {name}">+</button></span>
            </div>''')
        out.append("          </details>")
    out.append("        </div>")
    return "\n".join(out)


def r_set(s, lang, home, master=None):
    title = tr(s["nomi"], lang)
    hot = bool(s.get("mashhur"))
    cls = "set" + ("" if home else " set-acc") + (" set-hot" if hot else "")
    label = f'<span class="set-hot-label">{T["hot_home" if home else "hot_master"][lang]}</span>' if hot else ""
    items = ""
    for i in s["tarkibi"]:
        li_cls = ' class="%s"' % i["yonalish"] if home and i.get("yonalish") else ""
        items += f"<li{li_cls}><i></i>{e(tr(i['matn'], lang))}</li>"
    lines = [f'        <article class="{cls}">', f"          {label}", f"          <h3>{e(title)}</h3>",
             f'          <p class="set-desc">{e(tr(s["tavsif"], lang))}</p>', f'          <ul class="set-items">{items}</ul>']
    if tr(s.get("kafolat"), lang):
        lines.append(f'          <p class="set-warranty">{FA.format("fa-shield-halved")}{e(tr(s["kafolat"], lang))}</p>')
    old, price = int(s.get("alohida_narx") or 0), int(s["narx"])
    lines.append('          <div class="set-price">')
    if old > price:
        lines.append(f'            <span class="set-old">{T["sep"][lang]}: <s>{money(old)} {T["cur"][lang]}</s> · '
                     f'<em>{T["save"][lang]} {money(old - price)}</em></span>')
    lines.append(f'            <strong>{money(price)} {T["cur"][lang]}</strong>')
    if tr(s.get("uskuna"), lang):
        lines.append(f'            <span class="set-equip">{e(tr(s["uskuna"], lang))}</span>')
    lines.append("          </div>")
    if home:
        btn = "btn btn-acc p-web" if hot else "btn btn-outline"
        order = T["order_home"][lang].format(t=title)
        lines.append(f'          <a class="{btn}" href="#aloqa" data-order="{e(order)}">{T["pick_home"][lang]}</a>')
    else:
        btn = "btn btn-acc" if hot else "btn btn-outline"
        order = T["order_master"][lang].format(t=title)
        tg = load("aloqa")["telegram"].lstrip("@")
        lines.append(f'          <a class="{btn}" href="https://t.me/{e(tg)}" data-order="{e(order)}">{T["pick_master"][lang]}</a>')
    lines.append("        </article>")
    return "\n".join(lines)


def r_packages(lang, prefix, master):
    return '<div class="sets">\n' + "\n".join(
        r_set(s, lang, False, master) for s in load("paketlar")[master]["paketlar"]) + "\n      </div>"


def r_note(lang, prefix, master):
    parts = []
    for x in load("paketlar")[master].get("alohida") or []:
        price = int(x.get("narx") or 0)
        val = f"<b>{money(price)} {T['cur'][lang]}</b>" if price else f"<b>{T['free'][lang]}</b>"
        per = tr(x.get("izoh"), lang)
        parts.append(f"{e(tr(x['nomi'], lang))} — {val}" + (f" ({e(per)})" if per else ""))
    return f'<p class="note"><b>{T["single"][lang]}</b> ' + " · ".join(parts) + "</p>"


def r_work(w, lang, prefix, home):
    cls = f'work {w["yonalish"]}' if home and w.get("yonalish") else "work"
    title = tr(w["nomi"], lang)
    if (w.get("rasm") or "").strip():
        tag = f'<span class="work-tag">{T["sample"][lang]}</span>' if w.get("namuna") else ""
        photo = (f'<div class="photo"><img src="{e(img_src(w["rasm"], prefix))}" alt="{e(title)}" loading="lazy" '
                 f'width="900" height="675">{tag}</div>')
    elif w.get("oldin_keyin"):
        photo = f'<div class="photo"><div class="split"><span>{T["before"][lang]}</span><span>{T["after"][lang]}</span></div></div>'
    else:
        photo = f'<div class="photo"><span class="work-ph">{T["no_photo"][lang]}</span></div>'
    return f'<figure class="{cls}">{photo}<figcaption><b>{e(title)}</b><span>{e(tr(w.get("izoh"), lang))}</span></figcaption></figure>'


def r_works(lang, prefix, key):
    home = key == "bosh"
    return '<div class="works">' + "".join(r_work(w, lang, prefix, home) for w in load("ishlar")[key]) + "</div>"


def r_reviews(lang, prefix):
    out = []
    for r in load("sharhlar")["sharhlar"]:
        d = r["yonalish"]
        icon = DIR_ICON.get(r.get("belgi") or d, DIR_ICON.get(d, "fa-star"))
        name = tr(r["ism"], lang)
        out.append(
            f'<li class="review {d}"><span class="review-tag">{FA.format(icon + " ico")}{e(tr(r["mavzu"], lang))}</span>'
            f'<blockquote>{e(tr(r["matn"], lang))}</blockquote><p class="review-who"><span class="review-ava" '
            f'aria-hidden="true">{e(name[:1])}</span><span><b>{e(name)}</b><small>{e(tr(r["joy"], lang))}</small></span></p></li>')
    if not out:
        return ""
    return f'<h3 class="sub-h">{T["reviews"][lang]}</h3><ul class="reviews">' + "".join(out) + "</ul>"


def r_clients(lang, prefix):
    out = []
    for c in load("mijozlar")["mijozlar"]:
        logo = (c.get("logotip") or "").strip()
        img = f'<span class="client-logo"><img src="{e(img_src(logo, prefix))}" alt="" loading="lazy"></span>' if logo else ""
        out.append(f'<li>{img}<b>{e(tr(c["nomi"], lang))}</b><small>{e(tr(c["turi"], lang))}</small></li>')
    return '<ul class="clients">' + "".join(out) + "</ul>"


def r_total(lang, prefix):
    n = int(load("men")["staj"])
    return f'<div class="stat"><b>{years_total(n, lang)}</b><span>{T["total"][lang]}</span></div>'


def r_men(lang, prefix):
    m = load("men")
    name = tr(m["ism"], lang)
    if (m.get("rasm") or "").strip():
        photo = f'<div class="photo"><img src="{e(img_src(m["rasm"], prefix))}" alt="{e(name)}" loading="lazy"></div>'
    else:
        photo = f'<div class="photo"><span class="photo-ini" aria-hidden="true">{e(m.get("bosh_harflar") or name[:2].upper())}</span></div>'
    chips = "".join(f"<li>{e(tr(c, lang))}</li>" for c in m.get("teglar") or [])
    n = int(m["staj"])
    links = "".join(f' <a href="{e(k["havola"])}" target="_blank" rel="noopener">{e(k["nomi"])} <span>{e(k["havola"].split("//")[-1])}</span></a>'
                    for k in m.get("kompaniyalar") or [] if k.get("havola"))
    if links:
        links = f'\n          <p class="about-links">{links.strip()}</p>'
    return f'''<div class="about p-web">
        {photo}
        <div class="about-text">
          <div class="card-role">{e(tr(m["lavozim"], lang))}</div>
          <h3>{e(name)}</h3>
          <p>{e(tr(m["tavsif"], lang))}</p>
          <div class="card-years"><b>{n}</b><span>{card_years(n, lang)}</span></div>
          <ul class="chips">{chips}</ul>{links}
        </div>
      </div>'''


def r_rekvizit(lang, prefix):
    a = load("aloqa")
    parts = [tr(a.get("yuridik_nomi"), lang)]
    if (a.get("stir") or "").strip():
        parts.append(f'{T["stir"][lang]} {a["stir"].strip()}')
    parts = [p for p in parts if p]
    return f'<span class="legal">{e(" · ".join(parts))}</span>' if parts else ""


def r_contacts(lang, prefix):
    a = load("aloqa")
    tg, ig = a["telegram"].lstrip("@"), a["instagram"].lstrip("@")
    rows = [
        f'<div><span>{T["c_tg"][lang]}</span><a href="https://t.me/{e(tg)}">@{e(tg)}</a></div>',
        f'<div><span>{T["c_phone"][lang]}</span><a href="tel:{phone_digits(a["telefon"])}">{e(a["telefon"])}</a></div>',
        f'<div><span>{T["c_ig"][lang]}</span><a href="https://instagram.com/{e(ig)}">@{e(ig)}</a></div>',
        f'<div><span>{T["c_hours"][lang]}</span><b>{e(tr(a["ish_vaqti"], lang))}</b></div>',
    ]
    addr, maps = tr(a.get("manzil"), lang), (a.get("xarita") or "").strip()
    if addr or maps:
        link = f' <a href="{e(maps)}" target="_blank" rel="noopener">{T["c_map"][lang]}</a>' if maps else ""
        rows.append(f'<div><span>{T["c_addr"][lang]}</span><b>{e(addr)}{link}</b></div>')
    return '<div class="contacts">\n' + "\n".join("            " + r for r in rows) + "\n          </div>"


def phone_digits(p):
    d = re.sub(r"\D", "", p)
    return "+" + d


HOME = {"hero-xizmatlar": r_hero, "stat-tajriba": r_total, "xizmatlar": r_svcs, "kalkulyator": r_calc, "ishlar": lambda l, p: r_works(l, p, "bosh"),
        "sharhlar": r_reviews, "mijozlar": r_clients, "men": r_men, "aloqa": r_contacts, "rekvizit": r_rekvizit}
MASTER = {"ishlar": lambda l, p, m: r_works(l, p, m), "paketlar": r_packages, "alohida": r_note,
          "rekvizit": lambda l, p, m: r_rekvizit(l, p)}

MARK = re.compile(r"(<!-- cms:([a-z-]+) -->)(.*?)(<!-- /cms:\2 -->)", re.S)


def render_page(text, page, prefix):
    lang = LANGS[prefix]
    used = set()

    def sub(m):
        key = m.group(2)
        used.add(key)
        if page == "index":
            body = HOME[key](lang, prefix)
        else:
            body = MASTER[key](lang, prefix, page)
        return m.group(1) + body + m.group(4)

    out = MARK.sub(sub, text)
    expected = set(HOME if page == "index" else MASTER)
    if used != expected:
        sys.exit(f"{prefix}{page}.html: belgilar yetishmaydi: {sorted(expected - used)}")
    return out


# ---------------- Aloqa: eski qiymatlarni yangisiga almashtirish ----------------

STATE = ROOT / "tools" / ".aloqa-holat.json"


def contact_pairs(old, new):
    pairs = []
    if old["telefon"] != new["telefon"]:
        pairs += [(phone_digits(old["telefon"]), phone_digits(new["telefon"])), (old["telefon"], new["telefon"])]
    for k, url in (("telegram", "t.me/"), ("instagram", "instagram.com/")):  # noqa
        o, n = old[k].lstrip("@"), new[k].lstrip("@")
        if o != n:
            pairs += [(url + o, url + n), ("@" + o, "@" + n)]
    for lang in ("uz", "ru", "en"):
        o, n = tr(old["ish_vaqti"], lang), tr(new["ish_vaqti"], lang)
        if o and n and o != n:
            pairs.append((o, n))
    return pairs


def main():
    new_contacts = load("aloqa")
    old_contacts = json.loads(STATE.read_text(encoding="utf-8")) if STATE.exists() else new_contacts
    pairs = contact_pairs(old_contacts, new_contacts)
    changed = []
    for prefix in LANGS:
        for page in ["index"] + PAGES:
            f = ROOT / f"{prefix}{page}.html"
            text = f.read_text(encoding="utf-8")
            out = text
            for o, n in pairs:
                out = out.replace(o, n)
            out = render_page(out, page, prefix)
            if out != text:
                f.write_text(out, encoding="utf-8")
                changed.append(f.relative_to(ROOT).as_posix())
    STATE.write_text(json.dumps(new_contacts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("O'zgargan sahifalar:", ", ".join(changed) if changed else "yo'q")


if __name__ == "__main__":
    main()
