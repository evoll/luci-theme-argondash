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

# ArgonDash — тема LuCI для OpenWrt

**Чистая тема для OpenWrt LuCI в стиле Argon Dashboard 2**

ArgonDash — форк [luci-theme-argon](https://github.com/jerrykuku/luci-theme-argon), переработанный в визуальном языке [Argon Dashboard 2](https://www.creative-tim.com/product/argon-dashboard).  
Матовая стеклянная шапка · тёмный градиентный сайдбар · glassmorphism страница входа · автоскрытие шапки при прокрутке.

[![license][license-badge]][license]
[![prs][prs-badge]][prs]
[![issues][issues-badge]][issues]
[![release][release-badge]][release]
[![download][download-badge]][download]
[![contact][contact-badge]][contact]

[English][en-us-link] | **Русский**

[Возможности](#возможности) •
[Установка](#установка) •
[Сборка из исходников](#сборка-из-исходников) •
[Скриншоты](#скриншоты) •
[Благодарности](#благодарности)

<img src="https://raw.githubusercontent.com/evoll/luci-theme-argondash/staff/master/argon2.gif">
</div>

## Возможности

- Визуальный язык Argon Dashboard 2 — матовая стеклянная шапка, тёмный градиентный сайдбар, pill-кнопки активных пунктов.
- Автоскрытие sticky-шапки — убирается при прокрутке вниз, возвращается при прокрутке вверх или при наличии несохранённых изменений.
- Glassmorphism страница входа с поддержкой пользовательского изображения, видео, Bing, Wallhaven и Unsplash в качестве фона.
- Адаптивный светлый / тёмный / авто режим.
- Настраиваемые акцентные цвета, градиент сайдбара и радиус размытия через [luci-app-argondash-config][config-link].
- Адаптивный макет для мобильных устройств.
- Улучшенная безопасность: все UCI-значения валидируются перед вставкой в CSS, URL фонов экранированы, скрипт обоев защищён от path traversal.
- Полная совместимость с OpenWrt **23.05**, **24.10**, **25.12** и snapshot.

## Установка

### Способ 1 — OpenWrt feeds (рекомендуется для ImageBuilder / SDK)

Добавьте feed в файл `feeds.conf` или `feeds.conf.default`:

```text
src-git argondash https://github.com/evoll/luci-theme-argondash.git
```

Затем обновите и установите:

```bash
./scripts/feeds update argondash
./scripts/feeds install luci-theme-argondash
make menuconfig   # LuCI → Themes → luci-theme-argondash
make -j$(nproc) package/luci-theme-argondash/compile
```

Скомпилированный пакет будет в `bin/packages/<arch>/argondash/`.

### Способ 2 — Добавить в дерево пакетов (OpenWrt SDK / buildroot)

```bash
cd openwrt/package
git clone https://github.com/evoll/luci-theme-argondash.git
make menuconfig   # LuCI → Themes → luci-theme-argondash
make -j$(nproc) package/luci-theme-argondash/compile V=s
```

### Способ 3 — Готовый пакет (OpenWrt 23.05 / 24.10, opkg)

```bash
wget -O /tmp/luci-theme-argondash.ipk \
  https://github.com/evoll/luci-theme-argondash/releases/latest/download/luci-theme-argondash_1.0.1-23.05.x_r20260428_all.ipk
opkg install /tmp/luci-theme-argondash.ipk
```

### Способ 4 — Готовый пакет (OpenWrt 25.12 / snapshot, apk)

```bash
wget -O /tmp/luci-theme-argondash.apk \
  https://github.com/evoll/luci-theme-argondash/releases/latest/download/luci-theme-argondash_1.0.1-25.12.x_r20260428_all.apk
apk add --allow-untrusted /tmp/luci-theme-argondash.apk
```

### Дополнительно: плагин настроек

Установите [luci-app-argondash-config][config-link] для настройки цветов, радиуса размытия и источника фона через веб-интерфейс LuCI.

## Сборка из исходников

Требования: OpenWrt SDK или полный buildroot с подключённым LuCI feed.

```bash
# Клонировать в директорию пакетов
cd openwrt
git clone https://github.com/evoll/luci-theme-argondash.git package/luci-theme-argondash

# Или через feed (см. Способ 1)

make package/luci-theme-argondash/compile V=s
```

Makefile использует `luci.mk` из LuCI feed и собирает:
- `luci-theme-argondash_<ver>_all.ipk` (23.05 / 24.10)
- `luci-theme-argondash_<ver>_all.apk` (25.12 / snapshot)

CI/CD через GitHub Actions собирает все четыре варианта при каждом теге релиза (см. `.github/workflows/manual_release.yml`).

## Ветки

| Ветка | Версия | Совместимость с LuCI |
| ----- | ------ | -------------------- |
| master | v1.x.x | OpenWrt 23.05 / 24.10 / 25.12 / snapshot |

## История версий

См. [RELEASE_RU.md][ru-ru-release-log] для полного списка изменений.

## Примечания

- Рекомендуется Chrome / Chromium — лучшая поддержка `backdrop-filter`.
- Firefox: включите `layout.css.backdrop-filter.enabled` в `about:config` для эффекта матового стекла.
- IE не поддерживается.

## Скриншоты

![desktop](/Screenshots/screenshot_pc.jpg)
![mobile](/Screenshots/screenshot_phone.jpg)

## Contributors

<a href="https://github.com/evoll/luci-theme-argondash/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=evoll/luci-theme-argondash&v=2" />
</a>

Сделано с помощью [contrib.rocks](https://contrib.rocks).

## Связанные проекты

- [luci-app-argondash-config](https://github.com/evoll/luci-app-argondash-config) — плагин настроек темы ArgonDash

## Благодарности

- [luci-theme-argon](https://github.com/jerrykuku/luci-theme-argon) by jerrykuku — оригинальная тема, форком которой является этот проект
- [Argon Dashboard 2](https://www.creative-tim.com/product/argon-dashboard) by Creative Tim — визуальный дизайн
- [luci-theme-material](https://github.com/LuttyYang/luci-theme-material/) by LuttyYang
