document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('nav#main-nav');

    function runLucide() {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    const initTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', currentTheme);
    };

    const toggleTheme = () => {
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    document.querySelectorAll('.theme-toggle-btn, #theme-toggle').forEach((btn) => {
        btn.addEventListener('click', toggleTheme);
    });

    initTheme();

    const initRTL = () => {
        const currentDir = localStorage.getItem('dir') || 'ltr';
        html.setAttribute('dir', currentDir);
    };

    const toggleRTL = () => {
        const newDir = html.getAttribute('dir') === 'ltr' ? 'rtl' : 'ltr';
        html.setAttribute('dir', newDir);
        localStorage.setItem('dir', newDir);
    };

    const ensureMobileNavActions = () => {
        if (!navMenu) return;
        if (navMenu.querySelector('.mobile-nav-actions')) return;

        const desktopActions = document.querySelector('header .nav-actions');
        if (!desktopActions) return;

        const mobileActions = document.createElement('div');
        mobileActions.className = 'mobile-nav-actions';

        const container = document.createElement('div');
        container.className = 'mobile-nav-actions-container';

        desktopActions.querySelectorAll('a.icon-btn, button.icon-btn').forEach((source) => {
            if (source.id === 'menu-toggle') return;

            const tagName = source.tagName.toLowerCase();
            const item = document.createElement(tagName === 'a' ? 'a' : 'button');
            item.className = source.className;
            item.innerHTML = source.innerHTML;

            const title = source.getAttribute('title') || '';
            if (title) item.setAttribute('title', title);
            item.setAttribute('aria-label', source.getAttribute('aria-label') || title);

            if (tagName === 'a') {
                item.setAttribute('href', source.getAttribute('href') || '#');
            } else {
                item.setAttribute('type', 'button');
                if (source.id === 'theme-toggle') item.classList.add('theme-toggle-btn');
                if (source.id === 'rtl-toggle') item.classList.add('rtl-toggle-btn');
            }

            container.appendChild(item);
        });

        if (!container.children.length) return;
        mobileActions.appendChild(container);
        navMenu.appendChild(mobileActions);
    };

    document.querySelectorAll('.rtl-toggle-btn, #rtl-toggle').forEach((btn) => {
        btn.addEventListener('click', toggleRTL);
    });

    initRTL();
    ensureMobileNavActions();

    navMenu?.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
        btn.addEventListener('click', toggleTheme);
    });

    navMenu?.querySelectorAll('.rtl-toggle-btn').forEach((btn) => {
        btn.addEventListener('click', toggleRTL);
    });

    runLucide();

    const getNavPathKey = (value) => {
        if (!value) return 'index.html';
        const pathOnly = value.split('#')[0].split('?')[0];
        const normalized = pathOnly.replace(/\\/g, '/');
        const fileName = normalized.split('/').pop();
        return (fileName || 'index.html').toLowerCase();
    };

    const currentPathKey = getNavPathKey(window.location.pathname);
    if (navMenu) {
        navMenu.querySelectorAll('ul li a[href]').forEach((link) => {
            const href = link.getAttribute('href');
            if (!href || href === '#' || href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(href)) return;
            const isCurrent = getNavPathKey(href) === currentPathKey;
            link.classList.toggle('active-link', isCurrent);
            if (isCurrent) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    }

    function setMenuOpenVisual(open) {
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            // The icon is either the button itself (old <i>) or a child <i>
            const icon = menuToggle.querySelector('i') || menuToggle;
            if (open) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
        runLucide();
    }

    if (menuToggle && navMenu) {
        const openMenu = () => {
            navMenu.classList.add('active');
            document.body.classList.add('nav-active');
            setMenuOpenVisual(true);
        };

        const closeMenu = () => {
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-active');
            setMenuOpenVisual(false);
        };

        const toggleMenu = () => {
            if (navMenu.classList.contains('active')) closeMenu();
            else openMenu();
        };


        menuToggle.addEventListener('click', toggleMenu);

        navMenu.querySelectorAll('ul li a').forEach((link) => {
            link.addEventListener('click', function (e) {
                console.log('Mobile menu link clicked:', this.getAttribute('href'));
                const href = this.getAttribute('href');
                if (!href || href === '#') {
                    closeMenu();
                    return;
                }
                if (href.startsWith('#')) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        closeMenu();
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                    return;
                }
                // Prevent default and explicitly navigate — relying on passive default
                // behavior fails on mobile when the DOM changes (drawer closing) mid-tap.
                e.preventDefault();
                closeMenu();
                // Small delay to ensure menu closes before navigation
                setTimeout(() => {
                    window.location.href = href;
                }, 100);
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('.card, .section-title, .hero-content').forEach((el) => observer.observe(el));

    // Back to Top Button Logic
    const backToTop = document.createElement('button');
    backToTop.id = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.setAttribute('title', 'Back to Top');
    backToTop.setAttribute('aria-label', 'Back to Top');
    document.body.appendChild(backToTop);

    const toggleBackToTop = () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', toggleBackToTop);

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Before/After Slider Interaction
    const initBeforeAfterSliders = () => {
        document.querySelectorAll('.ba-slider').forEach((slider) => {
            const range = slider.querySelector('input[type="range"]');
            const resize = slider.querySelector('.resize');
            const handle = slider.querySelector('.handle');

            if (!range || !resize || !handle) return;

            const updateSlider = (val) => {
                resize.style.width = `${val}%`;
                handle.style.left = `${val}%`;
            };

            range.addEventListener('input', (e) => {
                updateSlider(e.target.value);
            });

            // Set initial state
            updateSlider(50);
        });
    };

    initBeforeAfterSliders();
});
