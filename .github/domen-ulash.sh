#!/usr/bin/env bash
# Saytni bukharatech.uz domeniga o'tkazadi: CNAME fayli + barcha absolyut manzillar.
# .github/workflows/domen.yml DNS tayyor bo'lganda bir marta ishga tushiradi.
set -euo pipefail
DOMAIN="bukharatech.uz"
OLD="https://sadullakhaitov.github.io/bukhara-tech/"
NEW="https://${DOMAIN}/"
printf '%s\n' "$DOMAIN" > CNAME
for f in *.html ru/*.html en/*.html sitemap.xml robots.txt; do
  sed -i "s#${OLD}#${NEW}#g" "$f"
done
sed -i 's#Disallow: /bukhara-tech/worker/#Disallow: /worker/#' robots.txt
sed -i "s#<lastmod>[0-9-]*</lastmod>#<lastmod>$(date -u +%F)</lastmod>#g" sitemap.xml
if grep -rq "sadullakhaitov.github.io/bukhara-tech" -- *.html ru/*.html en/*.html sitemap.xml robots.txt; then
  echo "Eski manzil qolib ketdi" >&2; exit 1
fi
