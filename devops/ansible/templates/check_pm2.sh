#!/usr/bin/env bash
# Nagios plugin to check PM2 application status

APP_NAME="${1:-ledger-ai}"

export PATH="$PATH:/usr/bin:/usr/local/bin:/home/ubuntu/.nvm/versions/node/$(node -v 2>/dev/null)/bin"

# Query PM2 as the ubuntu user
STATUS=$(su - ubuntu -c "pm2 jlist 2>/dev/null" | grep -o "\"name\":\"$APP_NAME\"[^}]*\"pm2_env\":{[^}]*\"status\":\"[^\"]*\"" | grep -o "\"status\":\"[^\"]*\"" | cut -d'"' -f4 | head -n 1)

if [ -z "$STATUS" ]; then
  # Fallback check using pm2 list text output
  STATUS=$(su - ubuntu -c "pm2 list 2>/dev/null" | grep "$APP_NAME" | awk '{print $18}' | tr -d '│ ')
fi

if [ "$STATUS" = "online" ]; then
  echo "OK - PM2 application '$APP_NAME' is online and running healthy."
  exit 0
elif [ "$STATUS" = "stopped" ] || [ "$STATUS" = "errored" ]; then
  echo "CRITICAL - PM2 application '$APP_NAME' status is: $STATUS!"
  exit 2
else
  echo "CRITICAL - PM2 application '$APP_NAME' process not found or status is: '${STATUS:-UNKNOWN}'"
  exit 2
fi

