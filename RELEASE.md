# Changelog — luci-theme-argondash

## v1.0.1 [ 2026.04.27 ]

Fork of [luci-theme-argon](https://github.com/jerrykuku/luci-theme-argon) by jerrykuku.
Full redesign to match [Argon Dashboard 2](https://www.creative-tim.com/product/argon-dashboard) (Creative Tim) visual language.

### Visual redesign
- **Topbar**: frosted glass effect (`backdrop-filter: blur`) on a white bar with rounded bottom corners; `position: sticky` — always visible while scrolling
- **Sidebar**: dark gradient background (`#42424a → #191919`), pill-shaped active item highlight, rounded right edge, smooth hover transitions
- **Page accent strip**: thin colored separator (`#4F62BC`, `0.5rem`) between the topbar and content cards with equal vertical spacing
- **Cards**: `border-radius: 0.75rem`, soft `box-shadow`, clean white background
- **Login page**: glassmorphism card over full-screen background (image/video/Bing/Wallhaven/Unsplash), frosted blur effect

### Security fixes (vs upstream argon)
- **CSS injection prevention**: all UCI color/numeric/mode values validated via regex before insertion into `<style>` blocks (`san_color`, `san_num`, `san_mode`)
- **XSS in background URL**: `bgUrl` and `bgMime` escaped with `entityencode()` in all HTML attributes
- **Path traversal in wallpaper script**: `WEB_PIC_SRC` validated against a strict whitelist; suffix stripped to `[A-Za-z0-9-]` only
- **URL injection in API requests**: `tag_id` / `collection_id` sanitized; `EXACT_RESO` uses POSIX `case` instead of `[ -eq ]`

### Build & infrastructure
- **POSIX shell compatibility**: replaced `bash [[ ]]` with `case` in GitHub Actions workflow
- **Push trigger fix**: corrected `push.paths` to match actual Makefile location in repository root
- **Multi-version matrix**: builds `.ipk` for OpenWrt 23.05 / 24.10 and `.apk` for 25.12 / snapshot
- **i18n foundation**: added `po/templates/luci-theme-argondash.pot` with 13 extractable strings; `CONFIG_LUCI_LANG_ru=y` ready in CI
- **Manifest**: updated PWA `manifest.json` to reference only existing icon files, modern format with `purpose`, `display`, `theme_color`
- **Dead code removed**: `sysauth.js` (unreachable JS view) deleted

### Compatibility
- Verified against LuCI API for OpenWrt **23.05**, **24.10**, **25.12**
- All template globals (`dispatched`, `version.*`, `getspnam`, `lua_active`, etc.) confirmed present in all three branches
- LESS sources resynced with compiled CSS; all CSS variables match

