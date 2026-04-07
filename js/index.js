/* =================================================
   SynOpusTech — Windows 7 Aero Desktop JS
   ================================================= */
(function () {
    'use strict';

    /* ── Globals ──────────────────────────────── */
    var loginScreen = document.getElementById('login-screen');
    var loginBtn = document.getElementById('login-btn');
    var desktop = document.getElementById('desktop');
    var startBtn = document.getElementById('start-btn');
    var startMenu = document.getElementById('start-menu');
    var taskbarButtons = document.getElementById('taskbar-buttons');
    var windowsContainer = document.getElementById('windows-container');
    var clockEl = document.getElementById('taskbar-clock');
    var menuClockEl = document.getElementById('menu-clock');
    var yearEl = document.getElementById('current-year');
    var contactForm = document.getElementById('contactForm');
    var successMsg = document.getElementById('success-message');

    var topZ = 100;

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function getSnappedWindowPosition(win, left, top) {
        var container = windowsContainer || win.parentElement;
        if (!container || !container.clientWidth || !container.clientHeight) {
            return { left: left, top: top };
        }

        return {
            left: clamp(left, 0, Math.max(0, container.clientWidth - win.offsetWidth)),
            top: clamp(top, 0, Math.max(0, container.clientHeight - win.offsetHeight))
        };
    }

    function snapWindowInside(win) {
        var position;

        if (!win || win.classList.contains('maximized')) return;

        position = getSnappedWindowPosition(win, win.offsetLeft, win.offsetTop);
        win.style.left = position.left + 'px';
        win.style.top = position.top + 'px';
    }

    function snapAllWindowsInside() {
        document.querySelectorAll('.aero-window').forEach(function (win) {
            snapWindowInside(win);
        });
    }

    /* ── Login ────────────────────────────────── */
    if (loginBtn) {
        loginBtn.addEventListener('click', function () {
            loginScreen.classList.add('fade-out');
            setTimeout(function () {
                loginScreen.style.display = 'none';
                desktop.classList.remove('hidden');
                // Randomise positions before revealing windows
                randomizeWindowPositions();
                // Show apps first so about ends up on top (last = highest z-index)
                showWindow('win-csv');
                showWindow('win-chat');
                showWindow('win-kimmygo');
                showWindow('win-contact');
                showWindow('win-about');
                window.requestAnimationFrame(snapAllWindowsInside);
            }, 600);
        });
    }

    // If URL has ?submitted=true, skip login
    if (window.location.search.indexOf('submitted=true') !== -1) {
        if (loginScreen) loginScreen.style.display = 'none';
        if (desktop) desktop.classList.remove('hidden');
        window.requestAnimationFrame(snapAllWindowsInside);
        if (successMsg) {
            successMsg.hidden = false;
            showWindow('win-contact');
            setTimeout(function () {
                successMsg.hidden = true;
                history.replaceState({}, document.title, window.location.pathname);
            }, 5000);
        }
    }

    /* ── Year ───────────────────────────────────── */
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    /* ── Clock ──────────────────────────────────── */
    function updateClock() {
        var now = new Date();
        var timeOnly = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (clockEl) clockEl.textContent = timeOnly;
        if (menuClockEl) {
            menuClockEl.textContent = now.toLocaleString([], {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
    updateClock();
    setInterval(updateClock, 1000);

    /* ── Focus management ────────────────────── */
    function focusWindow(winId) {
        var allWins = document.querySelectorAll('.aero-window');
        allWins.forEach(function (w) { w.classList.remove('focused'); });
        var win = document.getElementById(winId);
        if (win) {
            win.classList.add('focused');
            topZ++;
            win.style.zIndex = topZ;
        }
        // Update taskbar
        var btns = taskbarButtons.querySelectorAll('.taskbar-btn');
        btns.forEach(function (b) { b.classList.remove('focused'); });
        var tb = taskbarButtons.querySelector('[data-win="' + winId + '"]');
        if (tb) tb.classList.add('focused');
    }

    /* ── Show window ─────────────────────────── */
    function showWindow(winId) {
        var win = document.getElementById(winId);
        if (!win) return;
        win.classList.remove('minimized');
        win.style.display = '';
        snapWindowInside(win);
        focusWindow(winId);
        // Update taskbar btn
        var tb = taskbarButtons.querySelector('[data-win="' + winId + '"]');
        if (tb) {
            tb.classList.add('active');
            tb.classList.remove('minimized-btn');
        }
        // Lazy-load iframe src if needed
        var iframe = win.querySelector('iframe[data-src]');
        if (iframe) {
            iframe.src = iframe.getAttribute('data-src');
            iframe.removeAttribute('data-src');
        }
    }

    /* ── Minimize window ─────────────────────── */
    function minimizeWindow(winId) {
        var win = document.getElementById(winId);
        if (!win) return;
        win.classList.add('minimized');
        var tb = taskbarButtons.querySelector('[data-win="' + winId + '"]');
        if (tb) tb.classList.add('minimized-btn');
    }

    /* ── Close window ────────────────────────── */
    function closeWindow(winId) {
        var win = document.getElementById(winId);
        if (!win) return;
        win.classList.add('minimized');
        var tb = taskbarButtons.querySelector('[data-win="' + winId + '"]');
        if (tb) {
            tb.classList.remove('active');
            tb.classList.remove('focused');
            tb.classList.add('minimized-btn');
        }
    }

    /* ── Maximize window ─────────────────────── */
    function toggleMaximize(winId) {
        var win = document.getElementById(winId);
        if (!win) return;
        win.classList.toggle('maximized');
        if (!win.classList.contains('maximized')) snapWindowInside(win);
        focusWindow(winId);
    }

    /* ── Window control buttons ───────────── */
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        var winId = btn.getAttribute('data-win');
        if (action === 'minimize') minimizeWindow(winId);
        else if (action === 'maximize') toggleMaximize(winId);
        else if (action === 'close') closeWindow(winId);
    });

    /* ── Click window to focus ────────────── */
    document.addEventListener('mousedown', function (e) {
        var win = e.target.closest('.aero-window');
        if (win) focusWindow(win.id);
    });

    /* ── Taskbar button clicks ────────────── */
    if (taskbarButtons) {
        taskbarButtons.addEventListener('click', function (e) {
            var btn = e.target.closest('.taskbar-btn');
            if (!btn) return;
            var winId = btn.getAttribute('data-win');
            var win = document.getElementById(winId);
            if (!win) return;

            if (win.classList.contains('minimized')) {
                showWindow(winId);
            } else if (win.classList.contains('focused')) {
                minimizeWindow(winId);
            } else {
                focusWindow(winId);
            }
        });
    }

    /* ── Desktop shortcut double-click ────── */
    document.querySelectorAll('.desktop-shortcut').forEach(function (shortcut) {
        shortcut.addEventListener('click', function () {
            var winId = shortcut.getAttribute('data-window');
            showWindow(winId);
        });
    });

    /* ── Data-open-window buttons & links ────── */
    document.addEventListener('click', function (e) {
        var el = e.target.closest('[data-open-window]');
        if (!el) return;
        e.preventDefault();
        var winId = el.getAttribute('data-open-window');
        showWindow(winId);
    });

    /* ── Start menu ──────────────────────────── */
    if (startBtn && startMenu) {
        startBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            startMenu.classList.toggle('hidden');
        });
        startMenu.addEventListener('click', function (e) {
            var item = e.target.closest('.start-item');
            if (!item) return;
            var winId = item.getAttribute('data-window');
            if (winId) {
                showWindow(winId);
                startMenu.classList.add('hidden');
            }
            // Links will navigate naturally
        });
        // Close start menu on outside click
        document.addEventListener('click', function (e) {
            if (!startBtn.contains(e.target) && !startMenu.contains(e.target)) {
                startMenu.classList.add('hidden');
            }
        });
    }

    /* ═══════════════════════════════════════════
       WINDOW POSITION RANDOMISER
       ═══════════════════════════════════════════ */
    function rand(min, max) {
        return Math.floor(min + Math.random() * (max - min));
    }

    function randomizeWindowPositions() {
        var dockH = 110;
        var menuBarH = 36;
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var edge = 24;  // minimum margin from viewport edges

        // [id, approx-width, approx-height]
        var wins = [
            ['win-about',   640, 560],
            ['win-contact', 520, 480],
            ['win-csv',     900, 620],
            ['win-chat',    900, 620],
            ['win-kimmygo', 900, 620],
            ['win-privacy', 640, 540]
        ];

        wins.forEach(function (def) {
            var el = document.getElementById(def[0]);
            if (!el) return;
            var w = def[1], h = def[2];
            var maxLeft = Math.max(edge, vw - w - edge);
            var maxTop  = Math.max(menuBarH + edge, vh - dockH - h - edge);
            el.style.left = rand(edge, maxLeft) + 'px';
            el.style.top  = rand(menuBarH + edge, maxTop)  + 'px';
            snapWindowInside(el);
        });
    }

    /* ═══════════════════════════════════════════
       WINDOW DRAGGING
       Inspired by Z2r-YT/7-Aero-Stylesheet
       ═══════════════════════════════════════════ */
    var dragState = null;

    /* Cover iframes during drag to prevent them stealing events */
    function setIframePointerEvents(value) {
        var iframes = document.querySelectorAll('.aero-iframe');
        for (var i = 0; i < iframes.length; i++) {
            iframes[i].style.pointerEvents = value;
        }
    }

    document.addEventListener('mousedown', function (e) {
        var titlebar = e.target.closest('[data-drag]');
        if (!titlebar) return;
        // Don't drag if clicking a button
        if (e.target.closest('button')) return;

        var winId = titlebar.getAttribute('data-drag');
        var win = document.getElementById(winId);
        if (!win || win.classList.contains('maximized')) return;

        e.preventDefault();
        focusWindow(winId);
        setIframePointerEvents('none');

        dragState = {
            win: win,
            startX: e.clientX,
            startY: e.clientY,
            origLeft: win.offsetLeft,
            origTop: win.offsetTop
        };
    });

    document.addEventListener('mousemove', function (e) {
        var nextPosition;

        if (!dragState) return;
        e.preventDefault();
        nextPosition = getSnappedWindowPosition(
            dragState.win,
            dragState.origLeft + (e.clientX - dragState.startX),
            dragState.origTop + (e.clientY - dragState.startY)
        );
        dragState.win.style.left = nextPosition.left + 'px';
        dragState.win.style.top = nextPosition.top + 'px';
    });

    document.addEventListener('mouseup', function () {
        if (dragState) {
            setIframePointerEvents('');
            snapWindowInside(dragState.win);
        }
        dragState = null;
    });

    /* ── Touch dragging ──────────────────────── */
    document.addEventListener('touchstart', function (e) {
        var titlebar = e.target.closest('[data-drag]');
        if (!titlebar) return;
        if (e.target.closest('button')) return;

        var winId = titlebar.getAttribute('data-drag');
        var win = document.getElementById(winId);
        if (!win || win.classList.contains('maximized')) return;

        var touch = e.touches[0];
        focusWindow(winId);

        dragState = {
            win: win,
            startX: touch.clientX,
            startY: touch.clientY,
            origLeft: win.offsetLeft,
            origTop: win.offsetTop
        };
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
        var nextPosition;

        if (!dragState) return;
        var touch = e.touches[0];
        nextPosition = getSnappedWindowPosition(
            dragState.win,
            dragState.origLeft + (touch.clientX - dragState.startX),
            dragState.origTop + (touch.clientY - dragState.startY)
        );
        dragState.win.style.left = nextPosition.left + 'px';
        dragState.win.style.top = nextPosition.top + 'px';
    }, { passive: true });

    document.addEventListener('touchend', function () {
        if (dragState) {
            setIframePointerEvents('');
            snapWindowInside(dragState.win);
        }
        dragState = null;
    });

    window.addEventListener('resize', function () {
        if (!desktop || desktop.classList.contains('hidden')) return;
        snapAllWindowsInside();
    });

    /* ── Contact form subject ────────────── */
    if (contactForm) {
        contactForm.addEventListener('submit', function () {
            var nameEl = document.getElementById('name');
            var subjectEl = document.getElementById('formSubject');
            if (nameEl && subjectEl) {
                subjectEl.value = nameEl.value + ' - ' + new Date().toLocaleString();
            }
        });
    }

    /* ── Initial state: show all windows ─────── */
    // All windows start visible; the login screen covers them
})();
