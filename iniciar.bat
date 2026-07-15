@echo off
title English Tutor - Servidor Expo
echo ========================================
echo   ENGLISH TUTOR - Iniciando servidor...
echo ========================================
echo.

:: Adiciona Node.js ao PATH desta sessao
call "C:\Program Files\nodejs\nodevars.bat"

:: Vai para a pasta do projecto
cd /d "C:\Users\CC Gamer\english-tutor-app"

:: Verifica se node funciona
echo Node.js versao:
node --version
echo.

:: Inicia o servidor Expo com tunnel
echo Iniciando servidor Expo...
echo Aguarda o QR code aparecer...
echo.
"C:\Program Files\nodejs\npx.cmd" expo start --tunnel

pause
