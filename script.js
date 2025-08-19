document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile nav when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Project gallery: filtering + search + layout toggle
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const searchInput = document.getElementById('projectSearch');
    const layoutButtons = document.querySelectorAll('.layout-btn');
    const projectGrid = document.getElementById('projectGrid');

    function applyGalleryFilters() {
        const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
        const query = (searchInput?.value || '').toLowerCase().trim();

        projectCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            const text = card.textContent.toLowerCase();
            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            const matchesQuery = query === '' || text.includes(query);

            if (matchesFilter && matchesQuery) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 60);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => { card.style.display = 'none'; }, 250);
            }
        });
    }

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                applyGalleryFilters();
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            applyGalleryFilters();
        });
    }

    if (layoutButtons.length > 0 && projectGrid) {
        layoutButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                layoutButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const layout = this.getAttribute('data-layout');
                projectGrid.classList.toggle('compact', layout === 'compact');
            });
        });
    }
    
    // Animated Text Rotation
    function TxtRotate(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    }
    
    TxtRotate.prototype.tick = function() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];
        
        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
        
        this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';
        
        const that = this;
        let delta = 200 - Math.random() * 100;
        
        if (this.isDeleting) { delta /= 2; }
        
        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }
        
        setTimeout(function() {
            that.tick();
        }, delta);
    };
    
    // Start text rotation
    const elements = document.getElementsByClassName('txt-rotate');
    for (let i = 0; i < elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-rotate');
        const period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }
    
    // Theme toggle functionality
    function initTheme() {
        const themeToggle = document.getElementById('checkbox');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        // Set initial theme
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.checked = currentTheme === 'dark';
        
        // Theme toggle event
        themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add transition effect
            document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        });
    }
    
    // Navbar scroll effect
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Magnetic hover for buttons
    const magneticButtons = document.querySelectorAll('.btn');
    magneticButtons.forEach(btn => {
        const strength = 18;
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x/strength}px, ${y/strength}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0,0)';
        });
    });

    // Ripple effect on buttons
    function addRipple(e) {
        const target = e.currentTarget;
        const circle = document.createElement('span');
        const size = Math.max(target.clientWidth, target.clientHeight);
        const rect = target.getBoundingClientRect();
        circle.className = 'ripple';
        circle.style.width = circle.style.height = size + 'px';
        circle.style.left = (e.clientX - rect.left - size/2) + 'px';
        circle.style.top = (e.clientY - rect.top - size/2) + 'px';
        target.appendChild(circle);
        setTimeout(() => circle.remove(), 650);
    }

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', addRipple);
    });

    // 3D tilt for project cards
    const tiltCards = document.querySelectorAll('.project-card');
    tiltCards.forEach(card => {
        const rotate = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };
        card.addEventListener('mousemove', rotate);
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
        });
    });

    // Reveal images on scroll using IntersectionObserver
    const grid = document.getElementById('projectGrid');
    if (grid) {
        grid.classList.add('reveal-ready');
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-in');
                    cardObserver.unobserve(entry.target);
                }
            })
        }, { threshold: 0.25 });
        document.querySelectorAll('.project-card').forEach(card => cardObserver.observe(card));
    }

    // Animated counters for stats
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.textContent);
            const duration = 1200;
            const startTime = performance.now();
            function update(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const value = Math.floor(target * progress);
                el.textContent = value + (el.textContent.includes('+') ? '+' : '');
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.6 });
    counters.forEach(c => counterObserver.observe(c));

    // Subtle parallax for aurora blobs
    const auroras = document.querySelectorAll('.aurora-1, .aurora-2, .aurora-3, .aurora-4');
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        auroras.forEach((a, i) => {
            a.style.transform = `translate(${x * (i+1)}px, ${y * (i+1)}px)`;
        });
    });

    // Stagger reveal of skill items when skill-category is in view
    const skillCategories = document.querySelectorAll('.skill-category');
    const listRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('skills-revealed');
            listRevealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.3 });
    skillCategories.forEach(cat => listRevealObserver.observe(cat));

    // Global cursor-following glow
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    window.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Animate elements on scroll
    const animateOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animateOnScroll.observe(el);
    });
    
    // Add animation class
    document.addEventListener('scroll', function() {
        animatedElements.forEach(el => {
            if (el.classList.contains('animate-in')) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Animate skill bars on scroll
    const skillSection = document.querySelector('.skills-progress');
    
    if (skillSection) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBars = document.querySelectorAll('.skill-level');
                    skillBars.forEach((bar, index) => {
                        setTimeout(() => {
                            const width = bar.getAttribute('data-level');
                            bar.style.width = width;
                        }, index * 200);
                    });
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillObserver.observe(skillSection);
    }
    
    // Portfolio image popup functionality
    const projectImages = document.querySelectorAll('.project-img img');
    
    projectImages.forEach(img => {
        img.addEventListener('click', function() {
            createImagePopup(this.src, this.alt);
        });
    });
    
    function createImagePopup(src, alt) {
        const overlay = document.createElement('div');
        overlay.className = 'image-popup-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const popupContent = document.createElement('div');
        popupContent.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;
        
        const popupImg = document.createElement('img');
        popupImg.src = src;
        popupImg.alt = alt;
        popupImg.style.cssText = `
            width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        `;
        
        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            width: 30px;
            height: 30px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 20px;
            transition: background 0.3s ease;
        `;
        
        closeBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.3)';
        });
        
        closeBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        popupContent.appendChild(popupImg);
        popupContent.appendChild(closeBtn);
        overlay.appendChild(popupContent);
        document.body.appendChild(overlay);
        
        // Prevent scrolling when popup is open
        document.body.style.overflow = 'hidden';
        
        // Animate in
        setTimeout(() => {
            overlay.style.opacity = '1';
            popupContent.style.transform = 'scale(1)';
        }, 10);
        
        // Close popup when clicking close button or overlay
        closeBtn.addEventListener('click', closePopup);
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closePopup();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closePopup();
            }
        });
        
        function closePopup() {
            overlay.style.opacity = '0';
            popupContent.style.transform = 'scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(overlay);
                document.body.style.overflow = '';
            }, 300);
        }
    }
    
    // Form submission with validation
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const formElements = this.elements;
            
            for (let i = 0; i < formElements.length; i++) {
                if (formElements[i].hasAttribute('required') && formElements[i].value.trim() === '') {
                    isValid = false;
                    formElements[i].classList.add('error');
                } else {
                    formElements[i].classList.remove('error');
                }
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual form handling)
                setTimeout(() => {
                    // Show success message
                    showNotification('Message sent successfully!', 'success');
                    
                    // Reset form
                    this.reset();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        // Set colors based on type
        switch(type) {
            case 'success':
                notification.style.background = '#10b981';
                break;
            case 'error':
                notification.style.background = '#ef4444';
                break;
            default:
                notification.style.background = '#3b82f6';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    // Smooth reveal animation for sections
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        sectionObserver.observe(section);
    });
    
    // Add section visibility class
    document.addEventListener('scroll', function() {
        sections.forEach(section => {
            if (section.classList.contains('section-visible')) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Add floating animation to hero image
    const heroImage = document.querySelector('.image-container');
    if (heroImage) {
        heroImage.style.animation = 'float 6s ease-in-out infinite';
    }
    
    // Add CSS for float animation if not exists
    if (!document.querySelector('#float-animation')) {
        const style = document.createElement('style');
        style.id = 'float-animation';
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize particles effect (if particles.js is loaded)
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#6366f1" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#6366f1",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
    
    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #6366f1, #06b6d4);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
    
    // Add hover effects to project cards
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add typing effect to hero text
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Initialize typing effect for hero title
    const heroTitle = document.querySelector('.title .txt-rotate');
    if (heroTitle && heroTitle.textContent) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 1000);
    }
    
    // Add scroll-triggered animations (separate set)
    const scrollAnimatedElements = document.querySelectorAll('.animate-on-scroll');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    scrollAnimatedElements.forEach(el => {
        scrollObserver.observe(el);
    });
    
    // Performance optimization: Throttle scroll events
    let ticking = false;
    
    function updateOnScroll() {
        // Update scroll-based animations here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Escape key closes any open modals/popups
        if (e.key === 'Escape') {
            const popup = document.querySelector('.image-popup-overlay');
            if (popup) {
                popup.click();
            }
        }
        
        // Tab key navigation enhancement
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Add focus styles for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Initialize tooltips for project actions
    const projectActions = document.querySelectorAll('.project-link, .project-code');
    projectActions.forEach(action => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = action.title || 'View Project';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1000;
        `;
        
        action.appendChild(tooltip);
        
        action.addEventListener('mouseenter', function() {
            tooltip.style.opacity = '1';
        });
        
        action.addEventListener('mouseleave', function() {
            tooltip.style.opacity = '0';
        });
    });
    
    // Add loading animation for images and ensure already-cached images are visible
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const reveal = () => { img.style.opacity = '1'; };
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        if (img.complete && img.naturalWidth > 0) {
            // Image already loaded from cache
            requestAnimationFrame(reveal);
        } else {
            img.addEventListener('load', reveal, { once: true });
            img.addEventListener('error', () => { img.style.opacity = '1'; }, { once: true });
        }
    });
    
    // Initialize the page
    console.log('Portfolio initialized successfully! 🚀');

    // Ensure header height does not overlap content (dynamic offset)
    function setHeaderOffset() {
        const headerEl = document.querySelector('header');
        if (!headerEl) return;
        const height = headerEl.offsetHeight;
        document.documentElement.style.setProperty('--header-offset', height + 'px');
    }
    setHeaderOffset();
    window.addEventListener('resize', setHeaderOffset);
});