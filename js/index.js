const siteHeader = document.querySelector('.site-header');
const revealElements = document.querySelectorAll('.reveal');
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('success-message');
const yearElement = document.getElementById('current-year');

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15,
        rootMargin: '0px 0px -45px 0px'
    }
);

revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 55, 260)}ms`;
    revealObserver.observe(element);
});

window.addEventListener('scroll', () => {
    if (!siteHeader) {
        return;
    }

    if (window.scrollY > 8) {
        siteHeader.classList.add('scrolled');
    } else {
        siteHeader.classList.remove('scrolled');
    }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') {
            return;
        }

        const target = document.querySelector(href);
        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

if (contactForm) {
    contactForm.addEventListener('submit', () => {
        const name = document.getElementById('name');
        const subject = document.getElementById('formSubject');

        if (!name || !subject) {
            return;
        }

        const timestamp = new Date().toLocaleString();
        subject.value = `${name.value} - ${timestamp}`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('submitted') === 'true' && successMessage) {
        successMessage.hidden = false;
        setTimeout(() => {
            successMessage.hidden = true;
            history.replaceState({}, document.title, `${window.location.pathname}#contact`);
        }, 5000);
    }

    if (yearElement) {
        yearElement.textContent = String(new Date().getFullYear());
    }
});
