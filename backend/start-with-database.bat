@echo off
cls
echo ================================================
echo     PROCLINIC - Inicializacao com Database
echo ================================================
echo.

REM =============================================
REM STEP 1: Verificar Docker
REM =============================================
echo [1/8] Verificando Docker Desktop...
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo   ERRO: Docker nao encontrado!
    echo   Por favor, instale o Docker Desktop.
    pause
    exit /b 1
)
echo   OK - Docker instalado
echo.

REM =============================================
REM STEP 2: Iniciar PostgreSQL
REM =============================================
echo [2/8] Iniciando PostgreSQL...
docker ps | findstr proclinic-db >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   OK - PostgreSQL ja esta rodando
) else (
    echo   Iniciando container PostgreSQL...
    cd ..
    docker-compose up -d db
    if %ERRORLEVEL% NEQ 0 (
        echo   Tentando iniciar container existente...
        docker start proclinic-db
    )
    cd backend
    echo   Aguardando PostgreSQL inicializar...
    timeout /t 5 /nobreak >nul
)
echo.

REM =============================================
REM STEP 3: Verificar conexao
REM =============================================
echo [3/8] Verificando conexao com o banco...
docker exec proclinic-db pg_isready -U proclinic >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo   AVISO: PostgreSQL pode nao estar pronto
    echo   Continuando mesmo assim...
)
echo   OK - Tentando conectar...
echo.

REM =============================================
REM STEP 4: Instalar dependencias
REM =============================================
echo [4/8] Instalando dependencias do Node.js...
call npm install
echo.

REM =============================================
REM STEP 5: Gerar Prisma Client
REM =============================================
echo [5/8] Gerando Prisma Client...
call npx prisma generate
echo.

REM =============================================
REM STEP 6: Criar/Atualizar schema do banco
REM =============================================
echo [6/8] Criando schema no banco de dados...
echo   Tentando db push...
call npx prisma db push --accept-data-loss
if %ERRORLEVEL% NEQ 0 (
    echo   db push falhou, tentando migrate...
    call npx prisma migrate dev --name init --skip-generate
)
echo.

REM =============================================
REM STEP 7: Seed (opcional)
REM =============================================
echo [7/8] Populando dados iniciais (seed)...
if exist prisma\seed.ts (
    call npx prisma db seed
) else (
    echo   Arquivo seed nao encontrado, pulando...
)
echo.

REM =============================================
REM STEP 8: Iniciar servidor
REM =============================================
echo [8/8] Iniciando servidor NestJS...
echo.
echo ================================================
echo   SERVIDOR INICIANDO COM BANCO DE DADOS...
echo   
echo   Backend API: http://localhost:3000
echo   Swagger Docs: http://localhost:3000/api
echo   Database: PostgreSQL (Docker)
echo   
echo   Pressione Ctrl+C para parar
echo ================================================
echo.

call npm run start:dev

pause




