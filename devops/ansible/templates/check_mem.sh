#!/usr/bin/env bash
# Nagios plugin to check memory usage percentage

WARN=80
CRIT=90

while getopts "w:c:" opt; do
  case $opt in
    w) WARN=$OPTARG ;;
    c) CRIT=$OPTARG ;;
    *) echo "Usage: $0 [-w warn_percent] [-c crit_percent]"; exit 3 ;;
  esac
done

TOTAL=$(free -m | awk '/^Mem:/{print $2}')
USED=$(free -m | awk '/^Mem:/{print $3}')

if [ -z "$TOTAL" ] || [ "$TOTAL" -eq 0 ]; then
  echo "UNKNOWN - Unable to retrieve memory details"
  exit 3
fi

USAGE_PERCENT=$(( 100 * USED / TOTAL ))

PERFDATA="used=${USED}MB;${TOTAL}MB"

if [ "$USAGE_PERCENT" -ge "$CRIT" ]; then
  echo "CRITICAL - Memory usage is ${USAGE_PERCENT}% (${USED}MB / ${TOTAL}MB) | ${PERFDATA}"
  exit 2
elif [ "$USAGE_PERCENT" -ge "$WARN" ]; then
  echo "WARNING - Memory usage is ${USAGE_PERCENT}% (${USED}MB / ${TOTAL}MB) | ${PERFDATA}"
  exit 1
else
  echo "OK - Memory usage is ${USAGE_PERCENT}% (${USED}MB / ${TOTAL}MB) | ${PERFDATA}"
  exit 0
fi

