#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }

PROJECT_DIR="$HOME/projects"
cd "$PROJECT_DIR"

echo ""
echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}   BLLOK SHËNIMESH - Android APK Build${NC}"
echo -e "${BLUE}===============================================${NC}"
echo ""

log_info "Building web app..."
npm run build
log_success "Web build complete"
echo ""

log_info "Setting up Capacitor..."
if [ ! -d "android" ]; then
    npx cap add android
fi
npx cap sync android
log_success "Capacitor setup complete"
echo ""

log_info "Building Android APK..."
cd android
chmod +x gradlew
export _JAVA_OPTIONS="-Xmx1024m"
./gradlew assembleDebug

if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    log_success "✓ APK GATA!"
    cp "app/build/outputs/apk/debug/app-debug.apk" "$HOME/notebook3-app-debug.apk"
    ls -lh "$HOME/notebook3-app-debug.apk"
fi

echo ""
echo -e "${GREEN}BUILD COMPLETE!${NC}"
echo "Instalim: adb install -r ~/notebook3-app-debug.apk"
echo ""
