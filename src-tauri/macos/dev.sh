#!/bin/bash
# codesign --entitlements ./macos/p2p-app-host.entitlements -s "$APPLE_ID" "$@"
# not good, but using sudo for now until we find a better way
sudo "$@"
