

// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {

    // Smooth Scroll for Book Now
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to Top Button
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.navbar nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');

            // Optional: Animate hamburger
            const spans = hamburger.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                // Reset hamburger
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
});

// Interactive Mindmap: Why Choose Us & Services
document.addEventListener('DOMContentLoaded', () => {
    // Why Choose Us - Accordion Behavior
    const chooseBoxes = document.querySelectorAll('.choose_us .box');
    chooseBoxes.forEach(box => {
        box.addEventListener('click', (e) => {
            // Close other boxes
            chooseBoxes.forEach(b => {
                if (b !== box) {
                    b.classList.remove('active');
                }
            });
            // Toggle clicked box
            box.classList.toggle('active');
        });
    });

    // Our Services - Accordion Behavior
    const serviceBoxes = document.querySelectorAll('.our_services .box');
    serviceBoxes.forEach(box => {
        box.addEventListener('click', (e) => {
            // Close other boxes
            serviceBoxes.forEach(b => {
                if (b !== box) {
                    b.classList.remove('active');
                }
            });
            // Toggle clicked box
            box.classList.toggle('active');
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Create Toast Helper
        const showToast = (message) => {
            let toast = document.getElementById('toast-notification');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'toast-notification';
                document.body.appendChild(toast);
            }
            toast.textContent = message;
            toast.className = 'show';
            setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 3000);
        };

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // detailed selector to catch <button> or <input type="submit">
            const submitBtn = contactForm.querySelector('button[type="submit"], input[type="submit"]');

            // store original text/value safely
            let originalText = '';
            if (submitBtn) {
                originalText = submitBtn.tagName === 'INPUT' ? submitBtn.value : submitBtn.textContent;

                // Update button state
                if (submitBtn.tagName === 'INPUT') {
                    submitBtn.value = 'Sending...';
                } else {
                    submitBtn.textContent = 'Sending...';
                }
                submitBtn.disabled = true;
            }

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showToast("Booked Successfully! We will contact you soon.");
                    contactForm.reset();
                    if (submitBtn) {
                        if (submitBtn.tagName === 'INPUT') submitBtn.value = 'Booked';
                        else submitBtn.textContent = 'Booked';
                    }
                } else {
                    showToast("Oops! Problem submitting via Formspree. Try WhatsApp.");
                }
            } catch (error) {
                console.error('Error:', error);
                showToast("Oops! Network error. Please check connection.");
            } finally {
                if (submitBtn) {
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        if (submitBtn.tagName === 'INPUT') submitBtn.value = originalText;
                        else submitBtn.textContent = originalText;
                    }, 3000);
                }
            }
        });
    }
});

// Page Transition Logic
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');

            if (!href || href.startsWith('#') || link.target === '_blank' || href.startsWith('mailto:') || href.startsWith('tel:')) return;

            if (href.includes('.html') || href.endsWith('/')) {
                // Safeguard: Check if it's same page navigation
                try {
                    const targetUrl = new URL(href, window.location.href);
                    if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
                        return; // Allow default smooth scroll or hash change for same page
                    }
                } catch (err) {
                    // Ignore URL parsing errors and proceed with transition for .html links
                }

                e.preventDefault();
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = href;
                }, 400);
            }
        });
    });
});
