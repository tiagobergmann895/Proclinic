@echo off
echo Instalando dependencias...
npm install express cors bcryptjs jsonwebtoken @prisma/client
echo.
echo Iniciando servidor com banco real...
node real-server.js
pause



