#!/bin/sh

INIT_FILE="/app/.initialized"

# DB가 준비될 때까지 대기
# until mysqladmin ping -h"$MYSQL_HOST" --silent; do
#   echo "Waiting for database connection..."
#   sleep 2
# done

# 최초 실행 시만 Prisma 초기화
if [ ! -f "$INIT_FILE" ]; then
  echo "Running Prisma init..."
  npm run prisma:init
  touch "$INIT_FILE"
fi

# 서버 실행
npm start:dev
