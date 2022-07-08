#!/usr/bin/env bash

# run yarn audit, check the number of lines that have 'high' on
# them in the output table, meaning high vulnerability

if [[ $(yarn audit | grep "critical" |  wc -l | tr -d ' ') -gt 0 ]]; then
   echo "critical vulnerability found"
   exit 1
 else
   exit 0
fi