let particleAnimationId;

document.addEventListener('DOMContentLoaded', function () {
    // Add intro-active class to body
    document.body.classList.add('intro-active');

    // Check if user has seen intro before (in this session)
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');

    if (hasSeenIntro) {
        skipIntro();
        return;
    }

    // Run intro animation
    runIntroAnimation();
    initParticles();
});

function runIntroAnimation() {

    const stages = [
        { id: 'stage1', delay: 0 },
        { id: 'stage2', delay: 900 },
        { id: 'stage3', delay: 1800 },
        { id: 'stage4', delay: 2700 },
        { id: 'stage5', delay: 3600 },
        { id: 'stage6', delay: 4500 },
        { id: 'stage7', delay: 5400 },
        { id: 'introLogo', delay: 6300 }
    ];


    const firstStage = document.getElementById(stages[0].id);
    if (!firstStage) return; // Exit if intro elements are missing (e.g., inner pages)

    firstStage.classList.add('active');


    const progressDots = document.querySelectorAll('.progress-dot');
    const progressLines = document.querySelectorAll('.progress-line');


    stages.forEach((stage, index) => {
        if (index === 0) return; // Skip first, already shown

        setTimeout(() => {
            // Hide prev, show current
            if (index > 0) {
                const prevStage = document.getElementById(stages[index - 1].id);
                if (prevStage) prevStage.classList.remove('active');
            }

            const currStage = document.getElementById(stage.id);
            if (currStage) currStage.classList.add('active');


            if (progressDots[index - 1]) {
                progressDots[index - 1].classList.remove('active');
                progressDots[index - 1].classList.add('completed');
            }
            if (progressLines[index - 1]) {
                progressLines[index - 1].classList.add('active');
            }
            if (progressDots[index]) {
                progressDots[index].classList.add('active');
            }
        }, stage.delay);
    });


    setTimeout(() => {
        endIntro();
    }, 8000);
}

let isSkipping = false;

function skipIntro() {
    if (isSkipping) return;
    isSkipping = true;

    sessionStorage.setItem('hasSeenIntro', 'true');
    const overlay = document.getElementById('introOverlay');

    if (overlay) {
        // Trigger Portal Effect
        overlay.classList.add('portal-active');

        // Remove overlay from DOM after animation (1.5s)
        setTimeout(() => {
            overlay.remove();
            document.body.classList.remove('intro-active');
            document.body.classList.add('loaded');
        }, 1500);
    } else {
        // Fallback if no overlay
        document.body.classList.remove('intro-active');
        document.body.classList.add('loaded');
    }

    // Stop particles
    if (particleAnimationId) {
        cancelAnimationFrame(particleAnimationId);
    }
}

function endIntro() {
    skipIntro(); // Reuse same logic
}

// Make skipIntro available globally
window.skipIntro = skipIntro;

// Interactive Particles
function initParticles() {
    const canvas = document.getElementById('bgParticles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const numberOfParticles = 100;

    // Mouse position
    let mouse = {
        x: null,
        y: null,
        radius: 150
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return; // Skip particles if reduced motion preferred

    window.addEventListener('mousemove', function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // Debounce resize
    let resizeTimeout;

    class Particle {
        constructor(x, y, size, color) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.color = color;
            this.baseX = x;
            this.baseY = y;
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }

            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        // Reduce particles for mobile
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 30 : numberOfParticles;

        for (let i = 0; i < particleCount; i++) {
            let size = (Math.random() * 4) + 1;
            let x = (Math.random() * innerWidth);
            let y = (Math.random() * innerHeight);
            let color = 'rgba(237, 30, 121, 0.4)'; // Primary pink transparency

            // Mix in some secondary colors
            if (i % 3 === 0) color = 'rgba(0, 0, 124, 0.3)'; // Navy blue
            if (i % 5 === 0) color = 'rgba(255, 255, 255, 0.6)'; // White

            particlesArray.push(new Particle(x, y, size, color));
        }
    }

    function animate() {
        particleAnimationId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    init();
    animate();

    // Resize event
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            init();
        }, 200);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Wait for intro to finish or be skipped
    setTimeout(() => {
        initializeSiteFeatures();
    }, 100);
});

function initializeSiteFeatures() {
    // FAQ Toggle
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other open FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current FAQ
            item.classList.toggle('active');
        });
    });

    // Smooth Scroll for Navigation Links
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form Validation and Submission
    const contactForm = document.getElementById('contactForm');
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwzRxKyko0DzVQfNbT9nO3c8VVrfoE8RdkUvigRqgKgDUjU4t_4IEpDALN-mFzjhAMs/exec"; // User must update this!

    if (contactForm) {
        // Create Overlay dynamically
        const overlay = document.createElement('div');
        overlay.className = 'form-overlay';
        overlay.innerHTML = `
            <h3>Thank You! 🌸</h3>
            <p>We have received your message and will get back to you shortly.</p>
            <button class="submit-button" onclick="this.parentElement.classList.remove('active')">Close</button>
        `;
        // Append to container (ensure container is relative)
        contactForm.parentElement.style.position = 'relative';
        contactForm.parentElement.appendChild(overlay);

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const elements = this.elements;
            const data = {
                name: elements.name.value.trim(),
                email: elements.email.value.trim(),
                phone: elements.phone.value.trim(),
                trimester: elements.trimester.value,
                message: elements.message.value.trim()
            };

            // Basic validation
            if (!data.name || !data.email || !data.phone || !data.trimester) {
                alert('Please fill in all required fields.'); // Fallback valid
                return;
            }

            // Button State
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Sending...';
            btn.disabled = true;

            const isPlaceholderURL = SCRIPT_URL.includes("script.google.com") === false || SCRIPT_URL.length < 50;

            setTimeout(() => {
                overlay.classList.add('active');
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
                console.log("Form Data Captured (Demo Mode):", data);
            }, 1500);
        });
    }

    // --- Dynamic Events Fetching ---
    function fetchEvents() {
        const eventsContainer = document.getElementById('events-container');
        if (!eventsContainer) return;

        if (SCRIPT_URL === "INSERT_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
            eventsContainer.innerHTML = '<div style="text-align:center; padding:20px;">Please configure SCRIPT_URL to load events.</div>';
            return;
        }

        fetch(SCRIPT_URL)
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success' && data.events && data.events.length > 0) {
                    eventsContainer.innerHTML = ''; // Clear loading state
                    data.events.forEach(event => {
                        const eventCard = document.createElement('div');
                        eventCard.className = 'event-card';

                        // Handle date formatting if needed, assuming simple strings for now
                        eventCard.innerHTML = `
                            <div class="event-date">
                                <span class="day">${event.date}</span>
                                <span class="month">${event.month}</span>
                            </div>
                            <div class="event-details">
                                <h4>${event.title}</h4>
                                <p>${event.description}</p>
                                <span class="event-time">${event.time}</span>
                            </div>
                            <button class="join-btn" onclick="window.open('${event.link}', '_blank')">Join</button>
                        `;
                        eventsContainer.appendChild(eventCard);
                    });

                    // Re-run observer for new elements
                    const newCards = eventsContainer.querySelectorAll('.event-card');
                    newCards.forEach(el => {
                        el.style.opacity = '0';
                        el.style.transform = 'translateY(30px)';
                        el.style.transition = 'all 0.6s ease';
                        observer.observe(el);
                    });

                } else if (data.result === 'error') {
                    console.error('Apps Script Error:', data.error);
                    eventsContainer.innerHTML = '<div style="text-align:center;">No upcoming events found.</div>';
                } else {
                    eventsContainer.innerHTML = '<div style="text-align:center;">No upcoming events at the moment.</div>';
                }
            })
            .catch(error => {
                console.error('Error fetching events:', error);
                eventsContainer.innerHTML = '<div style="text-align:center; color: red;">Failed to load events.</div>';
            });
    }

    fetchEvents();

    // Notification Function
    function showNotification(message, type) {
        // Remove existing notification
        const existingNotification = document.querySelector('.form-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `form-notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: 16px;
            font-weight: 500;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            background: ${type === 'success' ? '#10B981' : '#EF4444'};
            color: white;
        `;

        // Add close button styles
        const closeBtn = notification.querySelector('button');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Add animation keyframes
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
    `;
    document.head.appendChild(style);

    // Floating Elements & Page Transition
    // Note: The backToTop button visibility and click handler are already present
    // in the 'Back to Top and Navbar Effect' section below.

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.feature-box, .testimonial-card, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinksList = document.querySelector('.nav-links');

    if (hamburger && navLinksList) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksList.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinksList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinksList.classList.remove('active');
            });
        });
    }

    // Back to Top and Navbar Effect
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset; // or scrollY

        // Navbar Effect (handled above, but we can refine here or leave as is)
        // Existing logic handles shadow. We can add padding shrink here if needed.
        if (currentScroll > 50) {
            navbar.style.padding = '15px 80px';
        } else {
            navbar.style.padding = '20px 80px';
        }

        // Mobile responsive padding correction
        if (window.innerWidth <= 768) {
            navbar.style.padding = '15px 20px';
        }

        // Back to Top Visibility
        if (currentScroll > 500 && backToTopBtn) {
            backToTopBtn.classList.add('visible');
        } else if (backToTopBtn) {
            backToTopBtn.classList.remove('visible');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Page Transition Effect - Global Function
window.handlePageTransition = function (url) {
    const overlay = document.getElementById('zoomTransition');
    if (overlay) {
        // Prevent interfering scrolls
        document.body.style.overflow = 'hidden';
        overlay.classList.add('active');

        setTimeout(() => {
            window.location.href = url;
        }, 800); // Wait for zoom animation (0.8s)
    } else {
        window.location.href = url;
    }
};

// --- Gallery Carousel Logic ---
function initGallery() {
    const track = document.getElementById('galleryTrack');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.getElementById('galleryDots');

    if (!track || !prevBtn || !nextBtn) return;

    let scrollAmount = 0;
    let autoPlayInterval;

    // Create Dots
    const items = track.querySelectorAll('.gallery-item');
    dotsContainer.innerHTML = ''; // Clear existing
    items.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = index === 0 ? 'dot active' : 'dot';
        dot.addEventListener('click', () => scrollToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Event Listeners
    nextBtn.addEventListener('click', () => {
        moveSlide('next');
        resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
        moveSlide('prev');
        resetAutoPlay();
    });

    // Scroll Logic
    function moveSlide(direction) {
        const itemWidth = track.clientWidth; // Width of visible area (1 item)
        if (direction === 'next') {
            if (Math.ceil(track.scrollLeft + itemWidth) >= track.scrollWidth) {
                // Loop back to start
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: itemWidth, behavior: 'smooth' });
            }
        } else {
            if (track.scrollLeft <= 0) {
                // Loop to end
                track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: -itemWidth, behavior: 'smooth' });
            }
        }
        // Update dots after scroll completes (approximate)
        setTimeout(updateDots, 300);
    }

    function scrollToSlide(index) {
        const itemWidth = track.clientWidth;
        track.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
        resetAutoPlay();
        updateDots();
    }

    function updateDots() {
        const itemWidth = track.clientWidth;
        const index = Math.round(track.scrollLeft / itemWidth);

        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            if (i === index) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    // Auto Play
    function startAutoPlay() {
        // Only auto-play on mobile/tablet where slider is active
        if (window.innerWidth <= 1024) {
            clearInterval(autoPlayInterval); // Ensure no duplicates
            autoPlayInterval = setInterval(() => {
                moveSlide('next');
            }, 3000); // 3 seconds
        }
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Initialize
    track.addEventListener('scroll', () => {
        // Debounce dot update
        clearTimeout(window.scrollTimeout);
        window.scrollTimeout = setTimeout(updateDots, 100);
    });

    window.addEventListener('resize', () => {
        clearInterval(autoPlayInterval);
        startAutoPlay();
        updateDots();
    });

    startAutoPlay();
}

// Call initGallery when DOM is ready (or immediately since script is at end of body)
document.addEventListener('DOMContentLoaded', initGallery);
// Also call immediately in case DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initGallery();
}

// --- Video Modal Logic ---
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('videoModal');
    const closeBtn = document.querySelector('.close-modal');
    const videoFrame = document.getElementById('videoFrame');
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    const videoCards = document.querySelectorAll('.video-card');

    if (!modal) return;

    // Open Modal
    videoCards.forEach(card => {
        card.addEventListener('click', function () {
            // Remove old alert
            // alert('Playing video testimonial... (Video integration coming soon!)'); 

            // For now, we use a placeholder video or logic
            // In a real app, you'd get the video ID from data-attribute
            // const videoId = this.dataset.videoId; 

            modal.classList.add('active');

            // Simulate video loading
            videoPlaceholder.style.display = 'flex';
            videoFrame.hidden = true;

            setTimeout(() => {
                videoPlaceholder.style.display = 'none';
                videoFrame.hidden = false;
                // Using a generic nature video as placeholder since we don't have user videos
                videoFrame.src = "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1";
            }, 1000);
        });
    });

    // Close Modal Function
    function closeModal() {
        modal.classList.remove('active');
        videoFrame.src = ""; // Stop video
    }

    // Event Listeners
    closeBtn.addEventListener('click', closeModal);

    // Close on click outside
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});

// --- Cookie Consent Logic ---
document.addEventListener('DOMContentLoaded', function () {
    const cookieBanner = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');

    // Check if user has already made a choice
    if (!localStorage.getItem('cookieConsent')) {
        // Show banner after a short delay
        setTimeout(() => {
            if (cookieBanner) {
                cookieBanner.style.display = 'block';
                // Allow display:block to apply before adding visible class for transition
                requestAnimationFrame(() => {
                    cookieBanner.classList.remove('hidden');
                    cookieBanner.classList.add('visible');
                });
            }
        }, 2000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            hideCookieBanner();
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            // Store 'false' so it doesn't ask again
            localStorage.setItem('cookieConsent', 'false');
            hideCookieBanner();
        });
    }

    function hideCookieBanner() {
        if (cookieBanner) {
            cookieBanner.classList.remove('visible');
            setTimeout(() => {
                cookieBanner.style.display = 'none';
            }, 500); // Wait for transition
        }
    }
});
