#!/bin/bash
while true
do
    CPU_TEMP=$(sensors | grep 'Core 0' | awk '{print $3}')
    GPU_TEMP=$(nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader)
    echo "CPU Temperature: $CPU_TEMP, GPU Temperature: $GPU_TEMP" >> temp_log.txt
    sleep 1
done
