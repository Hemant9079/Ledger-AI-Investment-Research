#!/bin/bash
# Nagios NRPE check_pm2 plugin

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://127.0.0.1:3000/api/health)
PID_COUNT=$(pgrep -f "next" | wc -l)

if [ "$HTTP_CODE" = "200" ] && [ "$PID_COUNT" -gt 0 ]; then
  echo "PM2 OK - ledger-ai process is online (HTTP 200, workers: ${PID_COUNT}) | 'workers'=${PID_COUNT};;0;0"
  exit 0
else
  echo "PM2 CRITICAL - ledger-ai process is NOT online (HTTP: ${HTTP_CODE}, workers: ${PID_COUNT})"
  exit 2
fi
