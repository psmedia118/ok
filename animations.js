// Scroll Animations
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.service-card, .team-card, .masonry-item, .split-left, .split-right, .hours-card');
    
    // Add reveal class to elements
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroRight = document.querySelector('.hero-right');
            if (heroRight && scrolled < window.innerHeight) {
                heroRight.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }
    
    // Counter animation for statistics (if added later)
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.innerText = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Hover animation for buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
});
