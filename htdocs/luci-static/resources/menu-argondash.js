'use strict';
'require baseclass';
'require ui';

/**
 * Native JavaScript slide animation utilities
 * Replaces jQuery slideUp/slideDown functionality with CSS transitions
 */
const SlideAnimations = {
	durations: {
		fast: 200,
		normal: 400,
		slow: 600
	},

	runningAnimations: new WeakMap(),

	slideDown: function(element, duration, callback) {
		if (!element) return;
		this.stop(element);

		const animDuration = typeof duration === 'string' ?
			this.durations[duration] || this.durations.normal :
			(duration || this.durations.normal);

		const originalStyles = {
			overflow: element.style.overflow,
			height: element.style.height,
			transition: element.style.transition
		};

		element.style.display = 'block';
		element.style.overflow = 'hidden';
		element.style.height = '0px';
		element.style.transition = `height ${animDuration}ms ease-out`;

		// Force reflow
		void element.offsetHeight;

		const targetHeight = element.scrollHeight;
		element.style.height = targetHeight + 'px';

		const cleanup = () => {
			element.style.height = originalStyles.height || '';
			element.style.overflow = originalStyles.overflow || '';
			element.style.transition = originalStyles.transition || '';
			this.runningAnimations.delete(element);
			if (typeof callback === 'function') {
				try { callback.call(element); } catch (e) { /* ignore */ }
			}
		};

		const timeoutId = setTimeout(cleanup, animDuration);
		this.runningAnimations.set(element, { timeoutId, cleanup });
	},

	slideUp: function(element, duration, callback) {
		if (!element) return;
		this.stop(element);

		const animDuration = typeof duration === 'string' ?
			this.durations[duration] || this.durations.normal :
			(duration || this.durations.normal);

		const originalStyles = {
			overflow: element.style.overflow,
			height: element.style.height,
			transition: element.style.transition
		};

		const currentHeight = element.scrollHeight;
		element.style.overflow = 'hidden';
		element.style.height = currentHeight + 'px';
		element.style.transition = `height ${animDuration}ms ease-out`;

		// Force reflow
		void element.offsetHeight;

		element.style.height = '0px';

		const cleanup = () => {
			element.style.display = 'none';
			element.style.height = originalStyles.height || '';
			element.style.overflow = originalStyles.overflow || '';
			element.style.transition = originalStyles.transition || '';
			this.runningAnimations.delete(element);
			if (typeof callback === 'function') {
				try { callback.call(element); } catch (e) { /* ignore */ }
			}
		};

		const timeoutId = setTimeout(cleanup, animDuration);
		this.runningAnimations.set(element, { timeoutId, cleanup });
	},

	stop: function(element) {
		if (!element) return;
		const animationData = this.runningAnimations.get(element);
		if (animationData) {
			clearTimeout(animationData.timeoutId);
			animationData.cleanup();
		}
		element.style.transition = '';
		void element.offsetHeight;
	},

	isAnimating: function(element) {
		return this.runningAnimations.has(element);
	}
};

return baseclass.extend({
	__init__: function () {
		ui.menu.load().then(L.bind(this.render, this));
	},

	render: function (tree) {
		var node = tree;
		var url = '';

		this.renderModeMenu(node);

		if (L.env.dispatchpath.length >= 3) {
			for (var i = 0; i < 3 && node; i++) {
				node = node.children[L.env.dispatchpath[i]];
				url = url + (url ? '/' : '') + L.env.dispatchpath[i];
			}
			if (node) {
				this.renderTabMenu(node, url);
			}
		}

		var sidebarToggle = document.querySelector('a.showSide');
		var darkMask = document.querySelector('.darkMask');

		if (sidebarToggle) {
			sidebarToggle.addEventListener('click', ui.createHandlerFn(this, 'handleSidebarToggle'));
		}
		if (darkMask) {
			darkMask.addEventListener('click', ui.createHandlerFn(this, 'handleSidebarToggle'));
		}

		this.initHeaderAutoHide();
		this.initMobileSidebar();
	},

	initMobileSidebar: function () {
		var self = this;

		/* ── Create FAB and append to <body> ──────────────────────────────
		   Must be a direct child of <body>, NOT inside .main{overflow:auto},
		   otherwise position:fixed breaks on iOS Safari and some Android
		   browsers when an ancestor has overflow:auto/hidden. */
		var fab = document.createElement('button');
		fab.id = 'sidebarFab';
		fab.className = 'sidebar-fab';
		fab.setAttribute('aria-label', 'Toggle menu');
		/* Three lines via innerHTML — simpler than appendChild × 3 */
		fab.innerHTML = '<span></span><span></span><span></span>';
		document.body.appendChild(fab);

		fab.addEventListener('click', ui.createHandlerFn(this, 'handleSidebarToggle'));

		/* ── Swipe-right-from-left-edge to open, swipe-left to close ─── */
		var touchStartX = 0;
		var touchStartY = 0;
		var EDGE_ZONE   = 40;   /* px from left edge */
		var MIN_SWIPE   = 60;   /* min horizontal travel */
		var MAX_VERT    = 80;   /* max vertical drift */

		document.addEventListener('touchstart', function (e) {
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
		}, { passive: true });

		document.addEventListener('touchend', function (e) {
			var dx      = e.changedTouches[0].clientX - touchStartX;
			var dy      = Math.abs(e.changedTouches[0].clientY - touchStartY);
			var sidebar = document.querySelector('#mainmenu');
			if (!sidebar) return;

			if (touchStartX <= EDGE_ZONE && dx >= MIN_SWIPE && dy <= MAX_VERT) {
				if (!sidebar.classList.contains('active'))
					self.handleSidebarToggle();
				return;
			}
			if (sidebar.classList.contains('active') && dx <= -MIN_SWIPE && dy <= MAX_VERT) {
				self.handleSidebarToggle();
			}
		}, { passive: true });
	},

	initHeaderAutoHide: function () {
		var header     = document.querySelector('header');
		var scrollArea = document.querySelector('.main-right');

		if (!header || !scrollArea) return;

		var lastY    = 0;
		var ticking  = false;

		function hasActiveIndicators() {
			/* Шапка остаётся видимой только при наличии индикаторов,
			   требующих действия пользователя.
			   poll-status (спиннер "Обновляется") намеренно НЕ включён —
			   он не требует взаимодействия и присутствует на дашборде постоянно. */
			return !!document.querySelector(
				'header .status span[data-indicator="uci-changes"], ' +
				'header .status span[data-style="notice"], ' +
				'header .status span[data-style="warning"], ' +
				'header .status span[data-style="error"]'
			);
		}

		function setHidden(hide) {
			var fab = document.getElementById('sidebarFab');
			if (hide) {
				header.classList.add('header-hidden');
				if (fab) fab.classList.add('header-hidden');
			} else {
				header.classList.remove('header-hidden');
				if (fab) fab.classList.remove('header-hidden');
			}
		}

		scrollArea.addEventListener('scroll', function () {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(function () {
				var currentY = scrollArea.scrollTop;
				if (currentY <= 10 || currentY < lastY || hasActiveIndicators()) {
					/* Скролл вверх, у верхней границы, или есть индикаторы — показать */
					setHidden(false);
				} else {
					/* Скролл вниз и нет активных индикаторов — скрыть */
					setHidden(true);
				}
				lastY   = currentY;
				ticking = false;
			});
		}, { passive: true });
	},

	handleMenuExpand: function (ev) {
		var target = ev.target;
		var slide = target.parentNode;
		var slideMenu = target.nextElementSibling;
		var shouldCollapse = false;

		var activeMenus = document.querySelectorAll('.main .main-left .nav > li > ul.active');
		activeMenus.forEach(function (ul) {
			SlideAnimations.stop(ul);
			ul.classList.remove('active');
			ul.previousElementSibling.classList.remove('active');
			SlideAnimations.slideUp(ul, 'fast');
			if (!shouldCollapse && ul === slideMenu) {
				shouldCollapse = true;
			}
		});

		if (!slideMenu) return;

		if (!shouldCollapse) {
			var slideMenuElement = slide.querySelector('.slide-menu');
			if (slideMenuElement) {
				slideMenu.classList.add('active');
				target.classList.add('active');
				SlideAnimations.slideDown(slideMenuElement, 'fast');
			}
			target.blur();
		}

		ev.preventDefault();
		ev.stopPropagation();
	},

	renderMainMenu: function (tree, url, level) {
		var currentLevel = (level || 0) + 1;
		var menuContainer = E('ul', { 'class': level ? 'slide-menu' : 'nav' });
		var children = ui.menu.getChildren(tree);

		if (children.length === 0 || currentLevel > 2) {
			return E([]);
		}

		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			var isActive = (
				(L.env.dispatchpath[currentLevel] === child.name) &&
				(L.env.dispatchpath[currentLevel - 1] === tree.name)
			);

			var submenu = this.renderMainMenu(child, url + '/' + child.name, currentLevel);
			var hasChildren = submenu.children.length > 0;

			// FIX: slideClass was set to null for leaf nodes, then " active" was appended,
			// resulting in the string "null active" as a CSS class.
			// Now we always start with a string and build it correctly.
			var slideClass = hasChildren ? 'slide' : '';
			var menuClass  = hasChildren ? 'menu'  : 'food';

			if (isActive) {
				menuContainer.classList.add('active');
				// FIX: only append ' active' if slideClass is non-empty, else just 'active'
				slideClass = slideClass ? slideClass + ' active' : 'active';
				menuClass  = menuClass  + ' active';
			}

			var menuItem = E('li', { 'class': slideClass || null }, [
				E('a', {
					'href': L.url(url, child.name),
					'click': (currentLevel === 1) ? ui.createHandlerFn(this, 'handleMenuExpand') : null,
					'class': menuClass,
					'data-title': child.title.replace(/ /g, '_'),
				}, [_(child.title)]),
				submenu
			]);

			menuContainer.appendChild(menuItem);
		}

		if (currentLevel === 1) {
			var mainMenuElement = document.querySelector('#mainmenu');
			if (mainMenuElement) {
				mainMenuElement.appendChild(menuContainer);
				mainMenuElement.style.display = '';
			}
		}

		return menuContainer;
	},

	renderModeMenu: function (tree) {
		var menu = document.querySelector('#modemenu');
		var children = ui.menu.getChildren(tree);

		for (var i = 0; i < children.length; i++) {
			var isActive = (L.env.requestpath.length ? children[i].name == L.env.requestpath[0] : i == 0);
			if (i > 0)
				menu.appendChild(E([], ['\u00a0|\u00a0']));
			menu.appendChild(E('li', {}, [
				E('a', {
					'href': L.url(children[i].name),
					'class': isActive ? 'active' : null
				}, [_(children[i].title)])
			]));
			if (isActive)
				this.renderMainMenu(children[i], children[i].name);
		}
		if (menu.children.length > 1)
			menu.style.display = '';
	},

	renderTabMenu: function (tree, url, level) {
		var container = document.querySelector('#tabmenu');
		var currentLevel = (level || 0) + 1;
		var tabContainer = E('ul', { 'class': 'tabs' });
		var children = ui.menu.getChildren(tree);
		var activeNode = null;

		if (children.length === 0) {
			return E([]);
		}

		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			var isActive = (L.env.dispatchpath[currentLevel + 2] === child.name);
			var activeClass = isActive ? ' active' : '';
			var className = 'tabmenu-item-%s%s'.format(child.name, activeClass);

			var tabItem = E('li', { 'class': className }, [
				E('a', { 'href': L.url(url, child.name) }, [_(child.title)])
			]);

			tabContainer.appendChild(tabItem);

			if (isActive) {
				activeNode = child;
			}
		}

		if (container) {
			container.appendChild(tabContainer);
			container.style.display = '';

			if (activeNode) {
				var nestedTabs = this.renderTabMenu(activeNode, url + '/' + activeNode.name, currentLevel);
				if (nestedTabs.children.length > 0) {
					container.appendChild(nestedTabs);
				}
			}
		}

		return tabContainer;
	},

	handleSidebarToggle: function (ev) {
		var showSideButton = document.querySelector('a.showSide');
		var sidebar        = document.querySelector('#mainmenu');
		var darkMask       = document.querySelector('.darkMask');
		var scrollbarArea  = document.querySelector('.main-right');
		var fab            = document.getElementById('sidebarFab');

		if (!sidebar || !darkMask || !scrollbarArea) return;

		if (sidebar.classList.contains('active')) {
			if (showSideButton) showSideButton.classList.remove('active');
			if (fab) fab.classList.remove('active');
			sidebar.classList.remove('active');
			scrollbarArea.classList.remove('active');
			darkMask.classList.remove('active');
		} else {
			if (showSideButton) showSideButton.classList.add('active');
			if (fab) fab.classList.add('active');
			sidebar.classList.add('active');
			scrollbarArea.classList.add('active');
			darkMask.classList.add('active');
		}
	}
});
