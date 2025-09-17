// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.getElementById('header');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const sections = document.querySelectorAll('section[id]');

// Mobile Navigation Toggle
function showMenu() {
    navMenu.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideMenu() {
    navMenu.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Event Listeners for Mobile Navigation
if (navToggle) {
    navToggle.addEventListener('click', showMenu);
}

if (navClose) {
    navClose.addEventListener('click', hideMenu);
}

// Close menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', hideMenu);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        hideMenu();
    }
});

// Header Scroll Effect
function scrollHeader() {
    if (window.scrollY >= 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Active Navigation Link
function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector('.nav__link[href*=' + sectionId + ']');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

// Back to Top Button
function showBackToTop() {
    if (window.scrollY >= 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

// Back to Top Click
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for scroll animation
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll(`
        .service__card,
        .reason__card,
        .project__card,
        .stat,
        .about__text,
        .about__illustration,
        .testimonial__card,
        .contact__info,
        .contact__form-container
    `);

    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Validation
function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    
    let isValid = true;
    
    // Clear previous errors
    clearErrors();
    
    // Validate name
    if (!name.value.trim()) {
        showError('name-error', 'Le nom est requis');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showError('name-error', 'Le nom doit contenir au moins 2 caractères');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showError('email-error', 'L\'email est requis');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        showError('email-error', 'Veuillez entrer un email valide');
        isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
        showError('message-error', 'Le message est requis');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showError('message-error', 'Le message doit contenir au moins 10 caractères');
        isValid = false;
    }
    
    return isValid;
}

function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearErrors() {
    const errors = document.querySelectorAll('.form__error');
    errors.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form__message ${type}`;
        formMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Handle Form Submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate the form using the existing validation function
        if (!validateForm()) {
            showFormMessage('Veuillez corriger les erreurs avant de soumettre.', 'error');
            return;
        }

        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Company email from the HTML
        const to = 'contact@gitdev-sn.com';

        // Construct the email subject
        const mailtoSubject = subject ? `[${subject}] - Formulaire de contact de ${name}` : `Formulaire de contact de ${name}`;

        // Construct the email body
        const mailtoBody = `Vous avez reçu un nouveau message depuis le site GITDEV-SN.\n\n` +
                         `--------------------------------------------------\n` +
                         `Nom: ${name}\n` +
                         `Email: ${email}\n\n` +
                         `Sujet: ${subject || '(Aucun sujet)'}\n\n` +
                         `Message:\n${message}`;

        // Create the mailto link, ensuring components are properly encoded
        const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;

        // Open the user's email client
        window.location.href = mailtoLink;

        // Reset the form and show a success message after a short delay
        setTimeout(() => {
            contactForm.reset();
            clearErrors();
            showFormMessage('Redirection vers votre application de messagerie. Veuillez vérifier que l\'envoi a bien été effectué.', 'success');
        }, 500);
    });
}

// Real-time form validation
const formInputs = document.querySelectorAll('.form__input, .form__textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', validateForm);
    input.addEventListener('input', () => {
        // Clear error when user starts typing
        const errorId = input.id + '-error';
        const errorElement = document.getElementById(errorId);
        if (errorElement && errorElement.textContent) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    });
});

// Initialize Google Maps (placeholder function)
function initMap() {
    // This would typically initialize Google Maps
    // For now, we'll just show a placeholder
    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #757575;">
                <div style="text-align: center;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <p>Carte Google Maps<br>Dakar, Sénégal</p>
                </div>
            </div>
        `;
    }
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('show')) {
        hideMenu();
    }
});

// Performance optimized scroll handler
let ticking = false;

function updateOnScroll() {
    scrollHeader();
    scrollActive();
    showBackToTop();
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
}

// Scroll event listener
window.addEventListener('scroll', requestTick);

// Initialize animations on load
window.addEventListener('load', () => {
    // Initialize Google Maps placeholder
    initMap();
    
    // Trigger initial scroll functions
    updateOnScroll();
    
    // Add loaded class for additional animations
    document.body.classList.add('loaded');
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Re-initialize animations or refresh content if needed
    }
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for potential use in other scripts
window.GitdevSN = {
    showMenu,
    hideMenu,
    validateForm,
    showFormMessage,
    initMap
};