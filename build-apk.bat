call "C:\Program Files\nodejs\nodevars.bat"
cd /d "C:\Users\CC Gamer\english-tutor-app"
echo ========================================
echo   PASSO 1: Login na conta Expo
echo ========================================
echo.
echo Se nao tiver conta, cria em: https://expo.dev/signup
echo.
npx eas-cli@latest login
echo.
echo ========================================
echo   PASSO 2: Configurar projecto
echo ========================================
npx eas-cli@latest project:init
echo.
echo ========================================
echo   PASSO 3: Construir APK Android
echo ========================================
echo Isto vai demorar 5-10 minutos na nuvem...
npx eas-cli@latest build --platform android --profile preview --non-interactive
echo.
echo APK PRONTO! Vai ao link acima para descarregar.
pause
