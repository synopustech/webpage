// Scroll animations
const observeElements = () => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach((element) => {
        observer.observe(element);
    });
};

// Initialize animations when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeElements);
} else {
    observeElements();
}

// Back to top button functionality
const goTopButton = document.querySelector('.go-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        goTopButton.classList.add('show');
    } else {
        goTopButton.classList.remove('show');
    }
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Add parallax effect to header background with fade out
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('header');
    const hero = document.querySelector('.hero');
    
    if (header) {
        // Parallax effect
        header.style.transform = `translateY(${scrolled * 0.3}px)`;
        
        // Fade out effect when scrolling
        const fadeStart = 100;
        const fadeEnd = 400;
        
        if (scrolled <= fadeStart) {
            header.style.opacity = '1';
        } else if (scrolled >= fadeEnd) {
            header.style.opacity = '0';
        } else {
            const opacity = 1 - ((scrolled - fadeStart) / (fadeEnd - fadeStart));
            header.style.opacity = opacity;
        }
    }
});
