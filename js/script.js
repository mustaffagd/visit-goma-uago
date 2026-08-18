/* =============================================
   Visit Goma & UAGO — JavaScript
   ============================================= */

(function () {
    'use strict';

    /* ---- DOM READY ---- */
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initMobileMenu();
        initSmoothScroll();
        initHeaderScroll();
        initScrollAnimations();
        initActiveNavOnScroll();
        initGalleryLightbox();
        initContactForm();
        initBackToTop();
        initStatsAnimation();
        initMapMarkers();
        initDestinationModal();
    }

    /* =============================================
       1. MOBILE MENU
       ============================================= */
    function initMobileMenu() {
        const burger = document.getElementById('burgerBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
        const ctaLink = mobileMenu.querySelector('.mobile-menu__cta');

        if (!burger || !mobileMenu) return;

        function toggleMenu() {
            const isActive = burger.classList.toggle('active');
            mobileMenu.classList.toggle('active', isActive);
            burger.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        }

        function closeMenu() {
            burger.classList.remove('active');
            mobileMenu.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        burger.addEventListener('click', toggleMenu);

        mobileLinks.forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        if (ctaLink) {
            ctaLink.addEventListener('click', closeMenu);
        }

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    /* =============================================
       2. SMOOTH SCROLLING
       ============================================= */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;

                var target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();

                var headerHeight = document.querySelector('.header').offsetHeight;
                var targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            });
        });
    }

    /* =============================================
       3. HEADER SCROLL
       ============================================= */
    function initHeaderScroll() {
        var header = document.getElementById('header');
        if (!header) return;

        var lastScroll = 0;
        var scrollThreshold = 50;

        function onScroll() {
            var currentScroll = window.pageYOffset;

            if (currentScroll > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Run once
    }

    /* =============================================
       4. SCROLL ANIMATIONS (IntersectionObserver)
       ============================================= */
    function initScrollAnimations() {
        var elements = document.querySelectorAll('.animate-on-scroll');
        if (!elements.length) return;

        if (!('IntersectionObserver' in window)) {
            // Fallback: show everything
            elements.forEach(function (el) { el.classList.add('visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Stagger animations for siblings
                    var parent = entry.target.parentElement;
                    var siblings = parent.querySelectorAll('.animate-on-scroll');
                    var index = Array.prototype.indexOf.call(siblings, entry.target);

                    setTimeout(function () {
                        entry.target.classList.add('visible');
                    }, index * 100);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* =============================================
       5. ACTIVE NAVIGATION ON SCROLL
       ============================================= */
    function initActiveNavOnScroll() {
        var navLinks = document.querySelectorAll('.nav__link');
        var sections = [];

        navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                var section = document.querySelector(href);
                if (section) {
                    sections.push({ el: section, link: link, id: href });
                }
            }
        });

        if (!sections.length) return;

        var headerHeight = document.querySelector('.header').offsetHeight;

        function onScroll() {
            var scrollPos = window.pageYOffset + headerHeight + 100;

            var activeSection = sections[0];
            sections.forEach(function (s) {
                if (s.el.offsetTop <= scrollPos) {
                    activeSection = s;
                }
            });

            navLinks.forEach(function (l) { l.classList.remove('active'); });
            if (activeSection) {
                activeSection.link.classList.add('active');
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* =============================================
       6. GALLERY LIGHTBOX
       ============================================= */
    function initGalleryLightbox() {
        var lightbox = document.getElementById('lightbox');
        var lightboxClose = document.getElementById('lightboxClose');
        var lightboxPrev = document.getElementById('lightboxPrev');
        var lightboxNext = document.getElementById('lightboxNext');
        var lightboxBackdrop = document.getElementById('lightboxBackdrop');
        var lightboxContent = document.getElementById('lightboxContent');
        var galleryItems = document.querySelectorAll('.gallery-item');

        if (!lightbox || !galleryItems.length) return;

        // Build gallery data from items
        var galleryData = [];
        galleryItems.forEach(function (item) {
            var placeholder = item.querySelector('.gallery-item__placeholder');
            var icon = placeholder ? placeholder.querySelector('span:first-child').textContent : '📷';
            var caption = placeholder ? placeholder.querySelector('p').textContent : '';
            var bg = placeholder ? placeholder.style.getPropertyValue('--bg') : '';
            galleryData.push({ icon: icon, caption: caption, bg: bg });
        });

        var currentIndex = 0;

        function showImage(index) {
            currentIndex = index;
            var data = galleryData[index];
            var iconEl = lightboxContent.querySelector('.lightbox__icon');
            var captionEl = lightboxContent.querySelector('.lightbox__caption');
            var placeholder = lightboxContent.querySelector('.lightbox__image-placeholder');

            iconEl.textContent = data.icon;
            captionEl.textContent = data.caption;
            placeholder.style.background = data.bg;
        }

        function openLightbox(index) {
            showImage(index);
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % galleryData.length;
            showImage(currentIndex);
        }

        function prevImage() {
            currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
            showImage(currentIndex);
        }

        // Events
        galleryItems.forEach(function (item, i) {
            item.addEventListener('click', function () {
                openLightbox(i);
            });
        });

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
        if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
        if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });
    }

    /* =============================================
       7. CONTACT FORM VALIDATION
       ============================================= */
    function initContactForm() {
        var form = document.getElementById('contactForm');
        if (!form) return;

        var submitBtn = document.getElementById('submitBtn');
        var successMsg = document.getElementById('formSuccess');

        var fields = {
            name: {
                input: document.getElementById('formName'),
                error: document.getElementById('nameError'),
                validate: function (val) {
                    if (!val.trim()) return 'Veuillez entrer votre nom.';
                    if (val.trim().length < 2) return 'Le nom doit contenir au moins 2 caractères.';
                    return '';
                }
            },
            email: {
                input: document.getElementById('formEmail'),
                error: document.getElementById('emailError'),
                validate: function (val) {
                    if (!val.trim()) return 'Veuillez entrer votre email.';
                    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRe.test(val)) return 'Veuillez entrer un email valide.';
                    return '';
                }
            },
            subject: {
                input: document.getElementById('formSubject'),
                error: document.getElementById('subjectError'),
                validate: function (val) {
                    if (!val) return 'Veuillez sélectionner un sujet.';
                    return '';
                }
            },
            message: {
                input: document.getElementById('formMessage'),
                error: document.getElementById('messageError'),
                validate: function (val) {
                    if (!val.trim()) return 'Veuillez entrer un message.';
                    if (val.trim().length < 10) return 'Le message doit contenir au moins 10 caractères.';
                    return '';
                }
            }
        };

        // Real-time validation
        Object.keys(fields).forEach(function (key) {
            var field = fields[key];
            if (field.input) {
                field.input.addEventListener('blur', function () {
                    validateField(field);
                });
                field.input.addEventListener('input', function () {
                    if (field.input.classList.contains('error')) {
                        validateField(field);
                    }
                });
            }
        });

        function validateField(field) {
            var errorMsg = field.validate(field.input.value);
            field.error.textContent = errorMsg;
            field.input.classList.toggle('error', !!errorMsg);
            return !errorMsg;
        }

        function validateAll() {
            var valid = true;
            Object.keys(fields).forEach(function (key) {
                if (!validateField(fields[key])) {
                    valid = false;
                }
            });
            return valid;
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!validateAll()) return;

            // Simulate sending
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            setTimeout(function () {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                successMsg.classList.add('show');
                form.reset();

                // Hide success after 5s
                setTimeout(function () {
                    successMsg.classList.remove('show');
                }, 5000);
            }, 1500);
        });
    }

    /* =============================================
       8. BACK TO TOP
       ============================================= */
    function initBackToTop() {
        var btn = document.getElementById('backToTop');
        if (!btn) return;

        function onScroll() {
            if (window.pageYOffset > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* =============================================
       9. STATS COUNTER ANIMATION
       ============================================= */
    function initStatsAnimation() {
        var stats = document.querySelectorAll('.stat-item__number');
        if (!stats.length) return;

        var animated = false;

        if (!('IntersectionObserver' in window)) {
            stats.forEach(function (s) {
                s.textContent = s.getAttribute('data-target');
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    animateStats(stats);
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        // Observe the stats section
        var statsSection = document.querySelector('.section--stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    function animateStats(statsElements) {
        var statConfigs = [
            { label: 'Destination', value: '1', suffix: '', prefix: '' },
            { label: 'UAGO', value: '1', suffix: '', prefix: '' },
            { label: 'Lac Kivu', value: '1', suffix: '', prefix: '' },
            { label: 'Virunga', value: '1', suffix: '', prefix: '' }
        ];

        statsElements.forEach(function (el, i) {
            var config = statConfigs[i] || { value: '1', suffix: '', prefix: '' };
            var target = parseInt(config.value, 10) || 1;
            var duration = 1500;
            var start = 0;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);

                // Ease out cubic
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = Math.floor(eased * target);

                el.textContent = config.prefix + current + config.suffix;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = config.prefix + target + config.suffix;
                    // Show text label instead of number
                    el.textContent = config.label;
                }
            }

            requestAnimationFrame(step);
        });
    }

    /* =============================================
       10. MAP MARKERS INTERACTIVE
       ============================================= */
    function initMapMarkers() {
        var markers = document.querySelectorAll('.map__marker');
        var tooltip = document.getElementById('mapTooltip');

        if (!markers.length || !tooltip) return;

        var tooltipTitle = tooltip.querySelector('.map__tooltip-title');
        var tooltipDesc = tooltip.querySelector('.map__tooltip-desc');

        markers.forEach(function (marker) {
            marker.addEventListener('click', function () {
                var name = marker.getAttribute('data-name');
                var desc = marker.getAttribute('data-desc');

                tooltipTitle.textContent = name;
                tooltipDesc.textContent = desc;

                tooltip.classList.add('active');

                // Move tooltip near the marker
                var markerRect = marker.getBoundingClientRect();
                var mapRect = marker.closest('.map').getBoundingClientRect();
                var left = markerRect.left - mapRect.left + markerRect.width / 2;

                // Clamp tooltip position
                var tooltipWidth = 200;
                left = Math.max(tooltipWidth / 2 + 10, Math.min(left, mapRect.width - tooltipWidth / 2 - 10));

                tooltip.style.left = left + 'px';
                tooltip.style.bottom = (mapRect.height - (markerRect.top - mapRect.top) + 12) + 'px';
                tooltip.style.top = 'auto';
                tooltip.style.transform = 'translateX(-50%)';
            });
        });

        // Close tooltip on map click (not marker)
        var map = document.getElementById('interactiveMap');
        if (map) {
            map.addEventListener('click', function (e) {
                if (!e.target.closest('.map__marker')) {
                    tooltip.classList.remove('active');
                }
            });
        }
    }

    /* =============================================
       11. DESTINATION MODAL
       ============================================= */
    function initDestinationModal() {
        var modal = document.getElementById('destinationModal');
        var modalClose = document.getElementById('modalClose');
        var modalBackdrop = document.getElementById('modalBackdrop');
        var modalContactBtn = document.getElementById('modalContactBtn');

        if (!modal) return;

        function closeModal() {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
        if (modalContactBtn) {
            modalContactBtn.addEventListener('click', function() {
                closeModal();
                document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Global function to open modal
    window.openDestinationModal = function(destinationId) {
        var modal = document.getElementById('destinationModal');
        var modalImage = document.getElementById('modalImage');
        var modalTitle = document.getElementById('modalTitle');
        var modalText = document.getElementById('modalText');
        var modalDetails = document.getElementById('modalDetails');

        if (!modal) return;

        // Destination data
        var destinations = {
            'lac-kivu': {
                image: 'assets/images/lac-kivu-photo.jpg',
                title: 'Lac Kivu',
                text: 'Le lac Kivu est l\'un des plus beaux lacs d\'Afrique, situé à la frontière entre la RDC et le Rwanda. Avec ses eaux turquoise et ses paysages montagneux spectaculaires, c\'est une destination incontournable pour les amoureux de la nature.',
                details: [
                    { icon: '📍', label: 'Localisation', value: 'Goma, Nord-Kivu, RDC' },
                    { icon: '🌊', label: 'Superficie', value: '2 700 km²' },
                    { icon: '🎯', label: 'Activités', value: 'Baignade, sports nautiques, balades en bateau, pêche' },
                    { icon: '🏨', label: 'Hébergement', value: 'Resorts, hôtels de luxe, bungalows' }
                ]
            },
            'virunga': {
                image: 'assets/images/parc-virunga.png',
                title: 'Parc des Virunga',
                text: 'Classé au patrimoine mondial de l\'UNESCO, le parc des Virunga est le plus ancien parc national d\'Afrique. Il abrite une biodiversité exceptionnelle, dont les gorilles de montagne, une espèce en danger critique.',
                details: [
                    { icon: '📍', label: 'Localisation', value: 'Nord-Kivu, RDC' },
                    { icon: '🦍', label: 'Faune', value: 'Gorilles de montagne, éléphants, hippos' },
                    { icon: '🎯', label: 'Activités', value: 'Randonnée, observation des gorilles, safari' },
                    { icon: '📅', label: 'Meilleure période', value: 'Juin à Septembre' }
                ]
            },
            'nyiragongo': {
                image: 'assets/images/volcano-nyiragongo.png',
                title: 'Mont Nyiragongo',
                text: 'Le mont Nyiragongo est un volcan actif célèbre pour son lac de lave permanent, le plus grand au monde. L\'ascension de ce volcan offre une expérience unique et inoubliable, avec des panoramas spectaculaires sur la région.',
                details: [
                    { icon: '📍', label: 'Localisation', value: 'Parc des Virunga, Nord-Kivu' },
                    { icon: '🌋', label: 'Altitude', value: '3 470 m' },
                    { icon: '🎯', label: 'Activités', value: 'Randonnée volcanique, observation de lave' },
                    { icon: '⚠️', label: 'Difficulté', value: 'Modérée à difficile' }
                ]
            },
            'centre-ville': {
                image: 'assets/images/rond-point-bdgl.png',
                title: 'Centre-ville de Goma',
                text: 'Le centre-ville de Goma est le cœur battant de la ville, avec ses artères animées, ses commerces, ses restaurants et sa vie urbaine dynamique. C\'est l\'endroit parfait pour découvrir la culture locale et la vie quotidienne des Gomais.',
                details: [
                    { icon: '📍', label: 'Localisation', value: 'Centre de Goma' },
                    { icon: '🛍️', label: 'À voir', value: 'Marchés, boutiques, restaurants' },
                    { icon: '🎭', label: 'Ambiance', value: 'Vivante, cosmopolite, chaleureuse' },
                    { icon: '🍽️', label: 'Gastronomie', value: 'Cuisine congolaise et internationale' }
                ]
            },
            'marches': {
                image: 'assets/images/marche-local.png',
                title: 'Marchés locaux',
                text: 'Les marchés de Goma sont des lieux animés où se mêlent artisanat, épices et savoir-faire local. C\'est l\'endroit idéal pour découvrir la culture congolaise, goûter aux spécialités locales et ramener des souvenirs uniques.',
                details: [
                    { icon: '📍', label: 'Marchés principaux', value: 'Marché de Birere, Marché du Lac' },
                    { icon: '🛍️', label: 'Produits', value: 'Artisanat, épices, fruits, vêtements' },
                    { icon: '⏰', label: 'Horaires', value: '6h00 - 18h00' },
                    { icon: '💡', label: 'Conseil', value: 'Négociez les prix avec le sourire' }
                ]
            },
            'culture': {
                image: 'assets/images/site-culturel.png',
                title: 'Sites culturels',
                text: 'Goma regorge de sites culturels qui racontent l\'histoire riche et complexe de la région. Musées, centres culturels et lieux de mémoire vous permettent de découvrir le patrimoine culturel du Nord-Kivu.',
                details: [
                    { icon: '🏛️', label: 'Lieux', value: 'Musée de Goma, centres culturels' },
                    { icon: '📚', label: 'Thèmes', value: 'Histoire, art, traditions' },
                    { icon: '🎭', label: 'Événements', value: 'Festivals, expositions, spectacles' },
                    { icon: '📅', label: 'Visites', value: 'Guidées disponibles' }
                ]
            },
            'nature': {
                image: 'assets/images/espace-naturel.png',
                title: 'Espaces naturels',
                text: 'Les espaces naturels autour de Goma offrent des panoramas époustouflants sur le lac et les montagnes. Jardins botaniques, réserves naturelles et sentiers de randonnée vous permettent de vous reconnecter avec la nature.',
                details: [
                    { icon: '🌿', label: 'Lieux', value: 'Jardins botaniques, forêts' },
                    { icon: '🎯', label: 'Activités', value: 'Randonnée, observation oiseaux' },
                    { icon: '📸', label: 'Points de vue', value: 'Panoramas sur le lac et montagnes' },
                    { icon: '🧘', label: 'Ambiance', value: 'Tranquille, apaisante' }
                ]
            }
        };

        var data = destinations[destinationId];
        if (!data) return;

        modalImage.src = data.image;
        modalImage.alt = data.title;
        modalTitle.textContent = data.title;
        modalText.textContent = data.text;

        // Build details HTML
        var detailsHTML = '';
        data.details.forEach(function(detail) {
            detailsHTML += '<div class="modal__detail">' +
                '<span class="modal__detail-icon">' + detail.icon + '</span>' +
                '<div class="modal__detail-content">' +
                    '<strong>' + detail.label + '</strong>' +
                    '<span>' + detail.value + '</span>' +
                '</div>' +
            '</div>';
        });
        modalDetails.innerHTML = detailsHTML;

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

})();
