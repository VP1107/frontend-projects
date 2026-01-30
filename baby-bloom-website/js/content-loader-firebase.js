// ===================================
// CONTENT LOADER - Firebase Version
// Loads saved content from Firebase Firestore
// ===================================

async function loadFirebaseContent() {
    // Check for Preview Mode
    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.get('preview') === 'true';

    if (isPreview) {
        const previewData = localStorage.getItem('babyBloomPreviewData');
        if (previewData) {
            console.log('👁️ Loading PREVIEW content from SessionStorage');

            // Show Preview Banner
            const banner = document.createElement('div');
            banner.style.position = 'fixed';
            banner.style.top = '0';
            banner.style.left = '0';
            banner.style.width = '100%';
            banner.style.backgroundColor = '#ff9800';
            banner.style.color = 'white';
            banner.style.textAlign = 'center';
            banner.style.padding = '10px';
            banner.style.zIndex = '9999';
            banner.style.fontWeight = 'bold';
            banner.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            banner.innerHTML = '⚠️ PREVIEW MODE - Changes are not saved to the live website';
            document.body.prepend(banner);
            document.body.style.marginTop = '40px'; // Push body down

            const content = JSON.parse(previewData);
            applyContent(content); // Use helper function to apply content
            document.body.classList.add('content-loaded');
            return;
        }
    }

    // Check if Firebase is available
    if (typeof firebase === 'undefined' || !window.firebaseDB) {
        console.log('Firebase not configured, using default content');
        document.body.classList.add('content-loaded');
        return;
    }

    try {
        const doc = await window.firebaseDB.collection('content').doc('website-data').get();

        if (!doc.exists) {
            console.log('No Firebase content found, using default content');
            document.body.classList.add('content-loaded');
            return;
        }

        const content = doc.data();
        applyContent(content);

        console.log('✅ Content loaded from Firebase');

        // Mark content as loaded to show it smoothly
        document.body.classList.add('content-loaded');
    } catch (error) {
        console.error('Error loading Firebase content:', error);
        // Show default content if Firebase fails
        document.body.classList.add('content-loaded');
    }
}

// Helper function to apply content to DOM
function applyContent(content) {
    // Load Hero content
    if (content.hero) {
        const heroTitle = document.querySelector('.hero-content h1');
        const heroDesc = document.querySelector('.hero-content p');
        const heroButton = document.querySelector('.hero-button');

        if (heroTitle) heroTitle.textContent = content.hero.title;
        if (heroDesc) heroDesc.textContent = content.hero.description;
        if (heroButton) {
            const buttonText = heroButton.childNodes[heroButton.childNodes.length - 1];
            if (buttonText) buttonText.textContent = ' ' + content.hero.buttonText;
        }
    }

    // Load About content
    if (content.about) {
        const aboutTitle = document.querySelector('.about-content h2');
        const aboutDesc = document.querySelector('.about-content p');
        const aboutButton = document.querySelector('.about-button');

        if (aboutTitle) aboutTitle.textContent = content.about.title;
        if (aboutDesc) aboutDesc.textContent = content.about.description;
        if (aboutButton) {
            const buttonText = aboutButton.childNodes[0];
            if (buttonText) buttonText.textContent = content.about.buttonText + ' ';
        }
    }

    // Load Expert content
    if (content.expert) {
        const expertSectionTitle = document.querySelector('.teacher-content h2');
        const expertName = document.querySelector('.teacher-content h3');
        const expertTitle = document.querySelector('.teacher-content h4');
        const expertDesc = document.querySelector('.teacher-content p');
        const qualifications = document.querySelectorAll('.qualifications li');

        if (expertSectionTitle) expertSectionTitle.textContent = content.expert.sectionTitle;
        if (expertName) expertName.textContent = content.expert.name;
        if (expertTitle) expertTitle.textContent = content.expert.title;
        if (expertDesc) expertDesc.textContent = content.expert.description;

        if (qualifications && content.expert.qualifications) {
            qualifications.forEach((qual, index) => {
                if (content.expert.qualifications[index]) {
                    const textNode = qual.childNodes[qual.childNodes.length - 1];
                    if (textNode) textNode.textContent = ' ' + content.expert.qualifications[index];
                }
            });
        }
    }

    // Load Features
    if (content.features && content.features.length === 6) {
        const featureBoxes = document.querySelectorAll('.feature-box');
        featureBoxes.forEach((box, index) => {
            if (content.features[index]) {
                const title = box.querySelector('h3');
                const desc = box.querySelector('p');
                if (title) title.textContent = content.features[index].title;
                if (desc) desc.textContent = content.features[index].description;
            }
        });
    }

    // Load Pricing
    if (content.pricing) {
        // Silver
        const silverPrice = document.querySelector('.pricing-card.silver .price');
        const silverSubtitle = document.querySelector('.pricing-card.silver .card-header p');
        const silverFeatures = document.querySelector('.pricing-card.silver .features');

        if (silverPrice && content.pricing.silver.price) {
            silverPrice.childNodes[0].textContent = content.pricing.silver.price;
        }
        if (silverSubtitle && content.pricing.silver.subtitle) {
            silverSubtitle.textContent = content.pricing.silver.subtitle;
        }
        if (silverFeatures && content.pricing.silver.features) {
            const features = content.pricing.silver.features.split('\n');
            const featureItems = silverFeatures.querySelectorAll('li');
            features.forEach((feature, index) => {
                if (featureItems[index]) {
                    const textNode = featureItems[index].childNodes[featureItems[index].childNodes.length - 1];
                    if (textNode) textNode.textContent = ' ' + feature;
                }
            });
        }

        // Gold
        const goldPrice = document.querySelector('.pricing-card.gold .price');
        const goldSubtitle = document.querySelector('.pricing-card.gold .card-header p');
        const goldFeatures = document.querySelector('.pricing-card.gold .features');

        if (goldPrice && content.pricing.gold.price) {
            goldPrice.childNodes[0].textContent = content.pricing.gold.price;
        }
        if (goldSubtitle && content.pricing.gold.subtitle) {
            goldSubtitle.textContent = content.pricing.gold.subtitle;
        }
        if (goldFeatures && content.pricing.gold.features) {
            const features = content.pricing.gold.features.split('\n');
            const featureItems = goldFeatures.querySelectorAll('li');
            features.forEach((feature, index) => {
                if (featureItems[index]) {
                    const textNode = featureItems[index].childNodes[featureItems[index].childNodes.length - 1];
                    if (textNode) textNode.textContent = ' ' + feature;
                }
            });
        }

        // Platinum
        const platinumPrice = document.querySelector('.pricing-card.platinum .price');
        const platinumSubtitle = document.querySelector('.pricing-card.platinum .card-header p');
        const platinumFeatures = document.querySelector('.pricing-card.platinum .features');

        if (platinumPrice && content.pricing.platinum.price) {
            platinumPrice.childNodes[0].textContent = content.pricing.platinum.price;
        }
        if (platinumSubtitle && content.pricing.platinum.subtitle) {
            platinumSubtitle.textContent = content.pricing.platinum.subtitle;
        }
        if (platinumFeatures && content.pricing.platinum.features) {
            const features = content.pricing.platinum.features.split('\n');
            const featureItems = platinumFeatures.querySelectorAll('li');
            features.forEach((feature, index) => {
                if (featureItems[index]) {
                    const textNode = featureItems[index].childNodes[featureItems[index].childNodes.length - 1];
                    if (textNode) textNode.textContent = ' ' + feature;
                }
            });
        }
    }

    // Load Testimonials
    if (content.testimonials && content.testimonials.length >= 2) {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach((card, index) => {
            if (content.testimonials[index]) {
                const name = card.querySelector('.testimonial-name');
                const title = card.querySelector('.testimonial-title');
                const text = card.querySelector('.testimonial-text');

                if (name) name.textContent = content.testimonials[index].name;
                if (title) title.textContent = content.testimonials[index].title;
                if (text) text.textContent = content.testimonials[index].text;
            }
        });
    }

    // Load Blog posts
    if (content.blog && content.blog.length === 3) {
        const blogCards = document.querySelectorAll('.blog-card');
        blogCards.forEach((card, index) => {
            if (content.blog[index]) {
                const title = card.querySelector('h3');
                const date = card.querySelector('.blog-date');
                const desc = card.querySelector('.blog-content p');

                if (title) title.textContent = content.blog[index].title;
                if (date) {
                    const dateObj = new Date(content.blog[index].date);
                    const options = { year: 'numeric', month: 'short', day: '2-digit' };
                    date.textContent = dateObj.toLocaleDateString('en-US', options);
                }
                if (desc) desc.textContent = content.blog[index].description;
            }
        });
    }

    // Load Contact info
    if (content.contact) {
        // Phone numbers
        const phoneLinks = document.querySelectorAll('a[href^="https://wa.me"], a[href^="tel:"]');
        phoneLinks.forEach(link => {
            if (link.href.includes('wa.me')) {
                const cleanPhone = content.contact.phone.replace(/\D/g, '');
                link.href = `https://wa.me/${cleanPhone}`;
            }
        });

        const phoneTexts = document.querySelectorAll('.contact-item p, .footer-section p');
        phoneTexts.forEach(p => {
            if (p.textContent.includes('+91')) {
                p.textContent = content.contact.phone;
            }
            if (p.textContent.includes('@')) {
                p.textContent = content.contact.email;
            }
        });

        // Address
        const addressElements = document.querySelectorAll('.contact-item p');
        addressElements.forEach(p => {
            if (p.innerHTML.includes('<br>') && p.textContent.includes('Baby Bloom')) {
                p.innerHTML = content.contact.address.replace(/\n/g, '<br>');
            }
        });

        // Working hours
        const hoursSection = document.querySelector('.footer-hours');
        if (hoursSection && content.contact.hours) {
            const hoursParagraphs = hoursSection.querySelectorAll('p');
            const hours = content.contact.hours.split('\n');
            hours.forEach((hour, index) => {
                if (hoursParagraphs[index] && !hoursParagraphs[index].closest('.footer-cta')) {
                    hoursParagraphs[index].textContent = hour;
                }
            });
        }
    }

    // Load Images
    if (content.images) {
        if (content.images.heroImage) {
            const heroImg = document.querySelector('.hero-image img');
            if (heroImg) heroImg.src = content.images.heroImage;
        }
        if (content.images.aboutImage) {
            const aboutImg = document.querySelector('.about-image img');
            if (aboutImg) aboutImg.src = content.images.aboutImage;
        }
        if (content.images.expertImage) {
            const expertImg = document.querySelector('.teacher-image img');
            if (expertImg) expertImg.src = content.images.expertImage;
        }
        if (content.images.whyChooseImage) {
            const whyChooseImg = document.querySelector('.why-choose-image img');
            if (whyChooseImg) whyChooseImg.src = content.images.whyChooseImage;
        }
    }
}

// Initialize Firebase connection, then load content
async function initFirebaseAndLoadContent() {
    // Wait for Firebase to be initialized
    if (typeof firebase === 'undefined') {
        console.log('Firebase SDK not loaded');
        return;
    }

    try {
        // Initialize Firebase if config exists
        if (window.firebaseApp && window.firebaseDB) {
            await loadFirebaseContent();

            // Set up real-time listener for content changes
            window.firebaseDB.collection('content').doc('website-data')
                .onSnapshot(function (doc) {
                    if (doc.exists) {
                        console.log('Content updated in Firebase, updating dynamically...');
                        // Reload content without full page refresh for smooth experience
                        loadFirebaseContent();
                    }
                });
        }
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
}

// Load content when Firebase is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebaseAndLoadContent);
} else {
    initFirebaseAndLoadContent();
}

// Admin access keyboard shortcut (Ctrl+Shift+A)
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        window.location.href = 'admin/';
    }
});
