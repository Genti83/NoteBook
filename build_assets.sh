#!/bin/bash
# ================================================================
# build_assets.sh — Ndërto Web App-in dhe kopjoje te Android assets
# ================================================================
# Ekzekutoni këtë skript nga dosja NoteBook/ (rrënja e projektit)
# Kërkon: Node.js + npm të instaluara
#
# Përdorim:
#   chmod +x build_assets.sh
#   ./build_assets.sh /rruga/drejt/bllok-shenimesh-web
# ================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WEB_SRC="${1:-../bllok-shenimesh-web}"
ASSETS_DST="$SCRIPT_DIR/app/src/main/assets/www"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  Bllok Shënimesh — Build Web Assets       ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Kontrollo dosjen e burimit
if [ ! -d "$WEB_SRC" ]; then
    echo "❌ GABIM: Dosja e projektit web nuk u gjet: $WEB_SRC"
    echo ""
    echo "Përdorimi:"
    echo "  ./build_assets.sh /rruga/drejt/projektit-web"
    echo ""
    echo "Shembull:"
    echo "  ./build_assets.sh ~/Downloads/bllok-shenimesh"
    exit 1
fi

echo "📁 Projekti web: $WEB_SRC"
echo "📱 Destinacioni: $ASSETS_DST"
echo ""

# Shko te dosja e burimit
cd "$WEB_SRC"

# Kontrollo nëse ka package.json
if [ ! -f "package.json" ]; then
    echo "❌ GABIM: Nuk u gjet package.json në $WEB_SRC"
    exit 1
fi

# Kontrollo Node.js dhe npm
if ! command -v node >/dev/null 2>&1; then
    echo "❌ GABIM: Node.js nuk është instaluar!"
    echo "Shkarkoni nga: https://nodejs.org/"
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo "❌ GABIM: npm nuk është i disponueshëm!"
    exit 1
fi

echo "✅ Node.js $(node --version) | npm $(npm --version)"
echo ""

# Instalimi i varësive
echo "📦 Duke instaluar varësitë (npm install)..."
npm install --prefer-offline 2>&1 | tail -5
echo ""

# Ndërtimi i projektit
echo "🔨 Duke ndërtuar projektin (npm run build)..."
npm run build 2>&1 | tail -20
echo ""

# Kontrollo nëse dist/ u krijua
DIST_DIR="$WEB_SRC/dist"
if [ ! -d "$DIST_DIR" ]; then
    echo "❌ GABIM: Dosja dist/ nuk u gjet pas build-it!"
    exit 1
fi

if [ ! -f "$DIST_DIR/index.html" ]; then
    echo "❌ GABIM: index.html mungon në dist/!"
    exit 1
fi

echo "✅ Build u krye! Skedarë në dist/: $(ls "$DIST_DIR" | wc -l)"
echo ""

# Pastrimi i www/ të vjetër
echo "🧹 Duke pastruar assets/www/ të vjetër..."
mkdir -p "$ASSETS_DST"
rm -rf "$ASSETS_DST"/*
rm -f "$ASSETS_DST"/.gitkeep

# Kopjimi
echo "📋 Duke kopjuar skedarët..."
cp -r "$DIST_DIR"/. "$ASSETS_DST/"

# Verifikim
if [ -f "$ASSETS_DST/index.html" ]; then
    FILE_COUNT=$(find "$ASSETS_DST" -type f | wc -l)
    echo ""
    echo "╔══════════════════════════════════════════╗"
    echo "║  ✅ SUKSES! $FILE_COUNT skedarë u kopjuan    "
    echo "╚══════════════════════════════════════════╝"
    echo ""
    echo "Tani hapni Android Studio dhe:"
    echo "  1. Build → Rebuild Project"
    echo "  2. Build → Generate Signed Bundle/APK"
    echo ""
else
    echo "❌ GABIM: Kopjimi dështoi!"
    exit 1
fi
