<!-- markdownlint-configure-file {
  "MD013": {
    "code_blocks": false,
    "tables": false,
    "line_length":200
  },
  "MD033": false,
  "MD041": false
} -->

[license]: /LICENSE
[license-badge]: https://img.shields.io/github/license/evoll/luci-theme-argondash?style=flat-square&a=1
[prs]: https://github.com/evoll/luci-theme-argondash/pulls
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[issues]: https://github.com/evoll/luci-theme-argondash/issues/new
[issues-badge]: https://img.shields.io/badge/Issues-welcome-brightgreen.svg?style=flat-square
[release]: https://github.com/evoll/luci-theme-argondash/releases
[release-badge]: https://img.shields.io/github/v/release/evoll/luci-theme-argondash?style=flat-square
[download]: https://github.com/evoll/luci-theme-argondash/releases
[download-badge]: https://img.shields.io/github/downloads/evoll/luci-theme-argondash/total?style=flat-square
[contact]: https://t.me/moo0re
[contact-badge]: https://img.shields.io/badge/Contact-telegram-blue?style=flat-square
[en-us-link]: /README.md
[ru-ru-link]: /README_RU.md
[en-us-release-log]: /RELEASE.md
[ru-ru-release-log]: /RELEASE_RU.md
[config-link]: https://github.com/evoll/luci-app-argondash-config/releases
[official]: https://github.com/openwrt/openwrt
[immortalwrt]: https://github.com/immortalwrt/immortalwrt

<div align="center">
<img src="https://raw.githubusercontent.com/evoll/luci-theme-argondash/staff/master/argon_title4.svg">

# luci-theme-argondash

**A clean Argon Dashboard 2–style theme for OpenWrt LuCI**

ArgonDash is a fork of [luci-theme-argon](https://github.com/jerrykuku/luci-theme-argon) redesigned in the visual language of [Argon Dashboard 2](https://www.creative-tim.com/product/argon-dashboard).  
Frosted-glass topbar · dark gradient sidebar · glassmorphism login page · auto-hide header on scroll.

[![license][license-badge]][license]
[![prs][prs-badge]][prs]
[![issues][issues-badge]][issues]
[![release][release-badge]][release]
[![download][download-badge]][download]
[![contact][contact-badge]][contact]

**English** | [Русский][ru-ru-link]

[Key Features](#key-features) •
[Installation](#installation) •
[Build from source](#build-from-source) •
[Screenshots](#screenshots) •
[Contributors](#contributors) •
[Credits](#credits)

<img src="https://raw.githubusercontent.com/evoll/luci-theme-argondash/staff/master/argon2.gif">
</div>

## Key Features

- Argon Dashboard 2 visual language — frosted-glass topbar, dark gradient sidebar, pill-style active items.
- Auto-hiding sticky header — stays out of the way while scrolling, reappears on scroll up or when unsaved changes are pending.
- Glassmorphism login page with support for custom image, video, Bing, Wallhaven, and Unsplash backgrounds.
- Adaptive light / dark / auto mode.
- Customizable accent colors, sidebar gradient, and blur radius via [luci-app-argondash-config][config-link].
- Mobile-responsive layout.
- Security-hardened: all UCI values validated before CSS injection, background URLs escaped, wallpaper script path-traversal protection.
- Full compatibility with OpenWrt **23.05**, **24.10**, **25.12** and snapshot.

## Installation

### Method 1 — OpenWrt feeds (recommended for ImageBuilder / SDK)

Add the feed to your `feeds.conf` or `feeds.conf.default`:

```text
src-git argondash https://github.com/evoll/luci-theme-argondash.git
```

Then update and install:

```bash
./scripts/feeds update argondash
./scripts/feeds install luci-theme-argondash
make menuconfig   # LuCI → Themes → luci-theme-argondash
make -j$(nproc) package/luci-theme-argondash/compile
```

The compiled package will be in `bin/packages/<arch>/argondash/`.

### Method 2 — Add to package tree (OpenWrt SDK / buildroot)

```bash
cd openwrt/package
git clone https://github.com/evoll/luci-theme-argondash.git
make menuconfig   # LuCI → Themes → luci-theme-argondash
make -j$(nproc) package/luci-theme-argondash/compile V=s
```

### Method 3 — Install pre-built package (OpenWrt 23.05 / 24.10, opkg)

```bash
wget -O /tmp/luci-theme-argondash.ipk \
  https://github.com/evoll/luci-theme-argondash/releases/latest/download/luci-theme-argondash_1.0.1-23.05.x_r20260428_all.ipk
opkg install /tmp/luci-theme-argondash.ipk
```

### Method 4 — Install pre-built package (OpenWrt 25.12 / snapshot, apk)

```bash
wget -O /tmp/luci-theme-argondash.apk \
  https://github.com/evoll/luci-theme-argondash/releases/latest/download/luci-theme-argondash_1.0.1-25.12.x_r20260428_all.apk
apk add --allow-untrusted /tmp/luci-theme-argondash.apk
```

### Optional: settings plugin

Install [luci-app-argondash-config][config-link] to configure colors, blur radius, and background source from the LuCI web interface.

## Build from source

Requirements: OpenWrt SDK or full buildroot with the LuCI feed enabled.

```bash
# Clone into package directory
cd openwrt
git clone https://github.com/evoll/luci-theme-argondash.git package/luci-theme-argondash

# Or as a feed (see Method 1 above)

make package/luci-theme-argondash/compile V=s
```

The Makefile uses `luci.mk` from the LuCI feed and produces:
- `luci-theme-argondash_<ver>_all.ipk` (23.05 / 24.10)
- `luci-theme-argondash_<ver>_all.apk` (25.12 / snapshot)

CI/CD via GitHub Actions builds all four variants on every release tag (see `.github/workflows/manual_release.yml`).

## Branch Introduction

| Branch | Version | LuCI compatibility |
| ------ | ------- | ------------------ |
| master | v1.x.x  | OpenWrt 23.05 / 24.10 / 25.12 / snapshot |

## Version History

See [RELEASE.md][en-us-release-log] for full changelog.

## Notice

- Chrome / Chromium recommended — best `backdrop-filter` support.
- Firefox: enable `layout.css.backdrop-filter.enabled` in `about:config` for the frosted-glass effect.
- IE is not supported.

## Screenshots

![desktop](/Screenshots/screenshot_pc.jpg)
![mobile](/Screenshots/screenshot_phone.jpg)

## Contributors

<a href="https://github.com/evoll/luci-theme-argondash/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=evoll/luci-theme-argondash&v=2" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

## Related Projects

- [luci-app-argondash-config](https://github.com/evoll/luci-app-argondash-config) — ArgonDash theme settings plugin

## Credits

- [luci-theme-argon](https://github.com/jerrykuku/luci-theme-argon) by jerrykuku — original theme this fork is based on
- [Argon Dashboard 2](https://www.creative-tim.com/product/argon-dashboard) by Creative Tim — visual design language
- [luci-theme-material](https://github.com/LuttyYang/luci-theme-material/) by LuttyYang
