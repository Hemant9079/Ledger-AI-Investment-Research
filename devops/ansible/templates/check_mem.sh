#!/bin/bash
# Nagios NRPE check_mem plugin

WARN=80
CRIT=90

while getopts "w:c:" opt; do
  case $opt in
    w) WARN=$OPTARG ;;
    c) CRIT=$OPTARG ;;
  esac
done

TOTAL=$(free -m | awk '/^Mem:/{print $2}')
USED=$(free -m | awk '/^Mem:/{print $3}')
PERCENT=$(( 100 * USED / TOTAL ))

if [ $PERCENT -ge $CRIT ]; then
  echo "MEMORY CRITICAL - ${PERCENT}% used (${USED}MB/${TOTAL}MB) | 'mem_used'=${PERCENT}%;${WARN};${CRIT};0;100"
  exit 2
elif [ $PERCENT -ge $WARN ]; then
  echo "MEMORY WARNING - ${PERCENT}% used (${USED}MB/${TOTAL}MB) | 'mem_used'=${PERCENT}%;${WARN};${CRIT};0;100"
  exit 1
else
  echo "MEMORY OK - ${PERCENT}% used (${USED}MB/${TOTAL}MB) | 'mem_used'=${PERCENT}%;${WARN};${CRIT};0;100"
  exit 0
fi
