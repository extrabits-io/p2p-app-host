#!/bin/bash
sudo setcap cap_net_admin+epi "$@"
exec "$@"
