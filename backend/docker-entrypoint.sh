#!/bin/sh
set -e

echo "[entrypoint] Starting Proclinic API"

if [ -n "$DATABASE_URL" ]; then
  echo "[entrypoint] DATABASE_URL detected. Applying migrations..."
  npx prisma migrate deploy || npx prisma db push
else
  echo "[entrypoint] DATABASE_URL not set. Skipping migrations."
fi

echo "[entrypoint] Launching NestJS server..."
node dist/main.js




