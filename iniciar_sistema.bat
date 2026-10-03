@echo off
title Sistema ControlEDU Alvart - Servidor Local
color 0A

echo ========================================================
echo       UNIVERSIDAD ALVART - SISTEMA DE CONTROL ESCOLAR
echo                 Iniciando Servidores y Tunel
echo ========================================================
echo.

cd /d "C:\tesis_proyecto"

echo [1/3] Iniciando Servidor Backend (Node.js + SQLite en Puerto 3001)...
start "Backend ControlEDU (Puerto 3001)" /min "C:\Program Files\nodejs\node.exe" server/index.js

timeout /t 2 /nobreak >nul

echo [2/3] Iniciando Servidor Frontend (Vite en Puerto 5173)...
start "Frontend ControlEDU (Puerto 5173)" /min cmd /c ""C:\Program Files\nodejs\npm.cmd" run dev -- --host"

timeout /t 3 /nobreak >nul

echo [3/3] Iniciando Tunel Seguro HTTPS hacia Internet (Cloudflare)...
start "Tunel Cloudflare" cmd /k ""C:\tesis_proyecto\cloudflared.exe" tunnel --url http://localhost:5173"

echo.
echo ========================================================
echo  ¡TODO EL SISTEMA ESTA CORRIENDO CORRECTAMENTE!
echo  Revisa la ventana "Tunel Cloudflare" para ver tu URL HTTPS.
echo  No cierres las ventanas minimizadas.
echo ========================================================
echo.
pause
