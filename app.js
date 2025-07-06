// Theme Toggle Functionality
class ThemeToggle {
    constructor() {
        this.toggle = document.getElementById('theme-toggle');
        this.icon = this.toggle.querySelector('.theme-toggle__icon');
        this.currentTheme = this.getPreferredTheme();
        
        this.init();
    }
    
    init() {
        this.setTheme(this.currentTheme);
        this.toggle.addEventListener('click', () => this.toggleTheme());
    }
    
    getPreferredTheme() {
        // Check if user has a preference stored
        const stored = this.getStoredTheme();
        if (stored) return stored;
        
        // Fall back to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        this.icon.textContent = theme === 'dark' ? '☀️' : '🌙';
        this.currentTheme = theme;
        
        // Try to store preference
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            // LocalStorage not available, continue without storing
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// Smooth Scrolling for Navigation Links
class SmoothScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav__link[href^="#"]');
        this.init();
    }
    
    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        // Validate form data
        if (!this.validateForm(data)) {
            return;
        }
        
        // Simulate form submission
        this.showSubmissionMessage(data);
        this.form.reset();
    }
    
    validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Please enter a valid name');
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Please enter a message with at least 10 characters');
        }
        
        if (errors.length > 0) {
            this.showErrorMessage(errors.join(', '));
            return false;
        }
        
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showSubmissionMessage(data) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Message Sent!';
        submitBtn.disabled = true;
        submitBtn.style.background = 'var(--color-success)';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
        
        // Show success notification
        this.showNotification(`Thank you, ${data.name}! Your message has been received.`, 'success');
    }
    
    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        const bgColor = type === 'success' ? 'var(--color-success)' : 'var(--color-error)';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: var(--color-btn-primary-text);
            padding: var(--space-12) var(--space-16);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Scroll Animation Observer
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                this.observerOptions
            );
            
            this.observeElements();
        }
    }
    
    observeElements() {
        const elements = document.querySelectorAll(
            '.education__card, .experience__item, .project__card, .skills__category, .about__photo'
        );
        elements.forEach(el => this.observer.observe(el));
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Navigation Bar Scroll Effect
class NavigationScroll {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.lastScrollY = 0;
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        const scrolled = window.pageYOffset;
        
        if (scrolled > 100) {
            this.nav.style.background = 'rgba(255, 255, 255, 0.98)';
            this.nav.style.boxShadow = 'var(--shadow-md)';
        } else {
            this.nav.style.background = 'rgba(255, 255, 255, 0.95)';
            this.nav.style.boxShadow = 'none';
        }
        
        // Update for dark mode
        if (document.documentElement.getAttribute('data-color-scheme') === 'dark') {
            if (scrolled > 100) {
                this.nav.style.background = 'rgba(38, 40, 40, 0.98)';
            } else {
                this.nav.style.background = 'rgba(38, 40, 40, 0.95)';
            }
        }
        
        this.lastScrollY = scrolled;
    }
}

// Project Cards Hover Effect
class ProjectInteractions {
    constructor() {
        this.projectCards = document.querySelectorAll('.project__card');
        this.init();
    }
    
    init() {
        this.projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleMouseEnter(card));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
            card.addEventListener('click', () => this.handleCardClick(card));
        });
    }
    
    handleMouseEnter(card) {
        const header = card.querySelector('.project__header');
        if (header) {
            header.style.transform = 'scale(1.02)';
            header.style.transition = 'transform 0.3s ease';
        }
    }
    
    handleMouseLeave(card) {
        const header = card.querySelector('.project__header');
        if (header) {
            header.style.transform = 'scale(1)';
        }
    }
    
    handleCardClick(card) {
        // Add a subtle click animation
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }
}

// Skill Badge Interactions
class SkillInteractions {
    constructor() {
        this.skillBadges = document.querySelectorAll('.skill__badge');
        this.init();
    }
    
    init() {
        this.skillBadges.forEach(badge => {
            badge.addEventListener('click', () => this.handleSkillClick(badge));
            badge.addEventListener('mouseenter', () => this.handleSkillHover(badge));
        });
    }
    
    handleSkillClick(badge) {
        // Add a brief animation to show the skill was clicked
        badge.style.transform = 'scale(1.1)';
        badge.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            badge.style.transform = 'scale(1)';
        }, 200);
        
        // Show skill info (could be expanded to show more details)
        this.showSkillInfo(badge.textContent);
    }
    
    handleSkillHover(badge) {
        // Add subtle glow effect
        badge.style.boxShadow = '0 0 15px rgba(33, 128, 141, 0.5)';
        badge.style.transition = 'box-shadow 0.3s ease';
        
        badge.addEventListener('mouseleave', () => {
            badge.style.boxShadow = '';
        }, { once: true });
    }
    
    showSkillInfo(skillName) {
        // Simple skill info display
        const info = document.createElement('div');
        info.textContent = `${skillName} - Click to learn more!`;
        info.className = 'skill-info';
        info.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-primary);
            color: var(--color-btn-primary-text);
            padding: var(--space-8) var(--space-16);
            border-radius: var(--radius-base);
            z-index: 1000;
            animation: slideInUp 0.3s ease-out;
        `;
        
        document.body.appendChild(info);
        
        setTimeout(() => {
            if (document.body.contains(info)) {
                document.body.removeChild(info);
            }
        }, 2000);
    }
}

// Hero Particle Animation
class HeroParticles {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.init();
    }
    
    init() {
        const heroParticles = document.querySelector('.hero__particles');
        if (!heroParticles) return;
        
        // Create canvas for particles
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        
        heroParticles.appendChild(this.canvas);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    createParticles() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(33, 128, 141, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Mobile Navigation (if needed for hamburger menu)
class MobileNavigation {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.navMenu = document.querySelector('.nav__menu');
        this.init();
    }
    
    init() {
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }
    
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            this.nav.classList.add('nav--mobile');
        } else {
            this.nav.classList.remove('nav--mobile');
        }
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Monitor performance and reduce animations on slower devices
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === '2g' || connection.effectiveType === '3g') {
                this.reduceAnimations();
            }
        }
    }
    
    reduceAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Main Application
class PortfolioApp {
    constructor() {
        this.components = [];
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        try {
            // Initialize all components
            this.components.push(new ThemeToggle());
            this.components.push(new SmoothScroll());
            this.components.push(new ContactForm());
            this.components.push(new ScrollAnimations());
            this.components.push(new NavigationScroll());
            this.components.push(new ProjectInteractions());
            this.components.push(new SkillInteractions());
            this.components.push(new HeroParticles());
            this.components.push(new MobileNavigation());
            this.components.push(new PerformanceMonitor());
            
            // Add loading animation
            this.addLoadingAnimation();
            
            // Add custom CSS animations
            this.addCustomAnimations();
            
            // Add error handling for images
            this.handleImageErrors();
            
        } catch (error) {
            console.error('Error initializing portfolio components:', error);
        }
    }
    
    addLoadingAnimation() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }
    
    addCustomAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @keyframes slideInUp {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
                100% {
                    transform: scale(1);
                }
            }
            
            .skill__badge:hover {
                animation: pulse 0.6s ease-in-out;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    handleImageErrors() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', (e) => {
                e.target.style.display = 'none';
                console.warn('Image failed to load:', e.target.src);
            });
        });
    }
}

// Initialize the application
const app = new PortfolioApp();

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        // Trigger resize events for components that need it
        window.dispatchEvent(new Event('resizeComplete'));
    }, 250);
});

// Utility functions
const Utils = {
    // Smooth element animation
    animateElement: (element, properties, duration = 300) => {
        const start = performance.now();
        const startStyles = {};
        
        // Store starting values
        Object.keys(properties).forEach(prop => {
            startStyles[prop] = parseFloat(getComputedStyle(element)[prop]) || 0;
        });
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Apply easing function (ease-out)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            Object.keys(properties).forEach(prop => {
                const startValue = startStyles[prop];
                const endValue = properties[prop];
                const currentValue = startValue + (endValue - startValue) * easeProgress;
                
                element.style[prop] = currentValue + (prop.includes('opacity') ? '' : 'px');
            });
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    },
    
    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};
class CertificationsSection {
    constructor() {
        this.viewMoreBtn = null;
        this.moreSection = null;
        this.init();
    }

    init() {
        this.viewMoreBtn = document.querySelector('.certifications__viewmore-btn');
        this.moreSection = document.getElementById('certifications__more');
        if (this.viewMoreBtn && this.moreSection) {
            this.viewMoreBtn.addEventListener('click', () => this.showMore());
        }
    }

    showMore() {
        this.moreSection.style.display = 'flex';
        this.viewMoreBtn.style.display = 'none';
    }
}

// 2. Add the following code to initialize the certifications section
document.addEventListener('DOMContentLoaded', () => {
    new CertificationsSection();
});

// 3. Inject certifications styles dynamically (so you don't need to touch your CSS file)
(function addCertificationsStyles() {
    const style = document.createElement('style');
    style.textContent = `
    .certifications {
        margin: 60px 0 0 0;
    }
    .certifications .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 20px;
    }
    .certifications__list, .certifications__more {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    .certification__item {
        background: #232a34;
        color: #00b4d8;
        border-radius: 8px;
        padding: 0.7em 1.2em;
        font-size: 1rem;
        font-weight: 500;
        box-shadow: 0 2px 8px rgba(0,180,216,0.08);
        margin-bottom: 0.5rem;
        transition: background 0.2s, color 0.2s;
        cursor: pointer;
    }
    .certification__item:hover {
        background: #00b4d8;
        color: #fff;
    }
    .certifications__viewmore-btn {
        margin-top: 1.2rem;
        background: transparent;
        color: #00b4d8;
        border: 2px solid #00b4d8;
        border-radius: 24px;
        padding: 0.5em 1.5em;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
        display: inline-block;
    }
    .certifications__viewmore-btn:hover {
        background: #00b4d8;
        color: #fff;
    }
    @media (max-width: 600px) {
        .certifications__list, .certifications__more {
            flex-direction: column;
            gap: 0.5rem;
        }
    }
    `;
    document.head.appendChild(style);
})();

// Export for potential use
window.PortfolioApp = PortfolioApp;
window.Utils = Utils;
