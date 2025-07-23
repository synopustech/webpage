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

// Form submission handling
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');

// Check if form was just submitted (for when redirected back from Formspree)
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('submitted') === 'true') {
        successMessage.style.display = 'block';
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
            // Remove the submitted parameter from URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }, 5000);
    }
});

contactForm.addEventListener('submit', function() {
    // Set the subject with name and timestamp
    const currentTime = new Date().toLocaleString();
    const nameValue = document.getElementById('name').value;
    document.getElementById('formSubject').value = `${nameValue} - ${currentTime}`;
    
    // Form will be submitted directly to Formspree
    // No need to prevent default or handle AJAX submission
    // Formspree will redirect back to the page with ?submitted=true
});
