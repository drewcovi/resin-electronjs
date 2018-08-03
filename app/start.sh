#!/bin/bash

# By default docker gives us 64MB of shared memory size but to display heavy
# pages we need more.
umount /dev/shm && mount -t tmpfs shm /dev/shm

# using local electron module instead of the global electron lets you
# easily control specific version dependency between your app and electron itself.
# the syntax below starts an X istance with ONLY our electronJS fired up,
# it saves you a LOT of resources avoiding full-desktops envs

rm /tmp/.X0-lock &>/dev/null || true

if [ ! -c /dev/fb1 ] && [ "$TFT" = "1" ]; then
  modprobe spi-bcm2708 || true
  modprobe fbtft_device name=pitft verbose=0 rotate=${TFT_ROTATE:-0} || true
  sleep 1
  mknod /dev/fb1 c $(cat /sys/class/graphics/fb1/dev | tr ':' ' ') || true
  FRAMEBUFFER=/dev/fb1 startx /usr/src/app/node_modules/electron/dist/electron /usr/src/app --enable-logging
else
  startx /usr/src/app/node_modules/electron/dist/electron /usr/src/app --enable-logging
fi


#!/usr/bin/env bash

export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket

# Choose a condition for running WiFi Connect according to your use case:

# 1. Is there a default gateway?
# ip route | grep default

# 2. Is there Internet connectivity?
# nmcli -t g | grep full

# 3. Is there Internet connectivity via a google ping?
# wget --spider http://google.com 2>&1

# 4. Is there an active WiFi connection?
# iwgetid -r

# if [ $? -eq 0 ]; then
#     printf 'Skipping WiFi Connect\n'
# else
#     printf 'Starting WiFi Connect\n'
#     ./wifi-connect
# fi

# Start your application here.