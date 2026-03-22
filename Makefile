#
# Copyright (C) 2026 Evoll
#
# This is free software, licensed under the Apache License, Version 2.0 .
#

include $(TOPDIR)/rules.mk

LUCI_TITLE:=ArgonDash Theme
# FIX: OpenWrt 24.10+ images may not include 'wget' by default (replaced by uclient-fetch).
# The wallpaper script uses wget-specific flags (-T, --spider) that uclient-fetch doesn't support.
# Depend on wget explicitly; users on minimal images should install it manually or
# adapt the script to use uclient-fetch syntax.
# jsonfilter is part of libjson-c and is always available on OpenWrt.
LUCI_DEPENDS:=+wget-ssl +jsonfilter
PKG_VERSION:=1.0.1
PKG_RELEASE:=20260314

CONFIG_LUCI_CSSTIDY:=

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
