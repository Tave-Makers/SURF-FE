#!/bin/sh
set -eu

if ! command -v mkcert >/dev/null 2>&1; then
  echo "mkcert is required. Install it with: brew install mkcert"
  exit 1
fi

if [ ! -f "tavesurf.site.pem" ] || [ ! -f "tavesurf.site-key.pem" ]; then
  echo "Missing local certificates. Run from apps/web: mkcert tavesurf.site"
  exit 1
fi

export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"

node scripts/gen-sw.js
next dev --turbopack --experimental-https --experimental-https-cert tavesurf.site.pem --experimental-https-key tavesurf.site-key.pem --port 443
