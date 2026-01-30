// ===================================
// BABY BLOOM ADMIN PANEL - Firebase Version
// ===================================

// Default content structure (same as before)
const DEFAULT_CONTENT = {
    hero: {
        title: "Welcome to Baby Bloom",
        description: "Experience the joy of pregnancy with our Garbhasanskar",
        buttonText: "Book your appointment today"
    },
    about: {
        title: "About Us",
        description: "At Baby Bloom, we are committed to providing the best possible care for pregnant women and their families. Our Garbhasanskar program is designed to help expectant mothers prepare for the joys and challenges of pregnancy. We believe in nurturing both the mother and the unborn child through ancient Vedic practices combined with modern scientific approaches. Our expert team guides you through every step of this beautiful journey, ensuring a healthy pregnancy and a bright future for your little one.",
        buttonText: "Read More"
    },
    expert: {
        sectionTitle: "Meet Our Expert",
        name: "Dr. Ananya Sharma",
        title: "MBBS, Garbhasanskar Specialist",
        description: "With over 15 years of experience in prenatal care and holistic wellness, Dr. Ananya Sharma guides expectant mothers through a journey of spiritual and physical well-being. Her unique approach combines modern medical science with ancient Vedic wisdom to ensure a healthy mother and a brilliant child.",
        qualifications: [
            "Certified Garbhasanskar Trainer",
            "5000+ Happy Families Guided",
            "Expert in Yoga & Meditation"
        ]
    },
    features: [
        { title: "Expert Guidance", description: "Certified Garbhasanskar practitioners with years of experience" },
        { title: "Personalized Care", description: "Customized programs tailored to your unique pregnancy journey" },
        { title: "Holistic Approach", description: "Combining ancient wisdom with modern prenatal science" },
        { title: "Flexible Scheduling", description: "Sessions designed to fit your busy lifestyle" },
        { title: "Community Support", description: "Join a supportive community of expecting mothers" },
        { title: "Comprehensive Resources", description: "Access to guides, videos, and educational materials" }
    ],
    pricing: {
        silver: {
            price: "₹4,999",
            subtitle: "Essential Care",
            features: "Weekly Online Sessions\nBasic Diet Chart\nGarbhasanskar Music\nGroup Meditation"
        },
        gold: {
            price: "₹7,999",
            subtitle: "Complete Wellness",
            features: "All Silver Features\nPersonalized Yoga Plan\n24/7 WhatsApp Support\n1-on-1 Counseling (Weekly)\nPartner Sessions"
        },
        platinum: {
            price: "₹11,999",
            subtitle: "Premium Mother Care",
            features: "All Gold Features\nPersonal Dietician Access\nDaily Progress Tracking\nPost-natal Care Guide\nHome Visit (Optional)"
        }
    },
    testimonials: [
        {
            name: "Ananya Patel",
            title: "Mother of Two",
            text: "The personalized attention and expert guidance made all the difference. I felt supported every step of the way. Highly recommend Baby Bloom!"
        },
        {
            name: "Sneha Reddy",
            title: "Working Mom",
            text: "I was skeptical at first, but the results speak for themselves. The music therapy and positive affirmations created such a beautiful bond."
        }
    ],
    blog: [
        { title: "Essential Nutrition for Two", date: "2024-01-05", description: "Discover the power of traditional Indian superfoods perfect for your trimester." },
        { title: "5 Calming Yoga Poses", date: "2024-01-02", description: "Simple poses to relieve back pain and prepare your body for labor." },
        { title: "Bonding Before Birth", date: "2023-12-28", description: "How Garbhasanskar helps build a deep connection with your unborn child." }
    ],
    contact: {
        phone: "+91 98765 43210",
        email: "thebabybloomindia@gmail.com",
        address: "123 Baby Bloom Center,\nAhmedabad, Gujarat 380001",
        hours: "Monday - Friday: 9:00 AM - 7:00 PM\nSaturday: 9:00 AM - 5:00 PM\nSunday: Closed"
    },
    images: {}
};

// Show toast notification
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;

    if (isError) {
        toast.classList.add('error');
    } else {
        toast.classList.remove('error');
    }

    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Firebase Authentication
async function login(email, password) {
    try {
        const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

function logout() {
    firebaseAuth.signOut().then(() => {
        window.location.reload();
    });
}

// Data management functions
async function loadContent() {
    try {
        const doc = await firebaseDB.collection('content').doc('website-data').get();
        if (doc.exists) {
            return doc.data();
        } else {
            // Initialize with default content
            await saveContent(DEFAULT_CONTENT);
            return DEFAULT_CONTENT;
        }
    } catch (error) {
        console.error('Error loading content:', error);
        showToast('Error loading content from Firebase', true);
        return DEFAULT_CONTENT;
    }
}

async function saveContent(content) {
    try {
        // First, backup the current content before overwriting
        const currentDoc = await firebaseDB.collection('content').doc('website-data').get();
        if (currentDoc.exists) {
            await firebaseDB.collection('content').doc('website-data-backup').set({
                ...currentDoc.data(),
                backedUpAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        // Now save the new content
        await firebaseDB.collection('content').doc('website-data').set({
            ...content,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error saving content:', error);
        showToast('Error saving to Firebase', true);
        return false;
    }
}

async function exportData() {
    try {
        const content = await loadContent();
        const dataStr = JSON.stringify(content, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `babybloom-firebase-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Data exported successfully!');
    } catch (error) {
        console.error('Export error:', error);
        showToast('Export failed', true);
    }
}

async function undoChanges() {
    try {
        const backupDoc = await firebaseDB.collection('content').doc('website-data-backup').get();
        if (!backupDoc.exists) {
            showToast('No backup available to restore', true);
            return;
        }

        const backupContent = backupDoc.data();
        delete backupContent.backedUpAt; // Remove backup timestamp

        // Restore the backup (this will create a new backup of current state)
        const success = await saveContent(backupContent);
        if (success) {
            await populateAllForms();
            showToast('Changes undone successfully!');
        }
    } catch (error) {
        console.error('Undo error:', error);
        showToast('Failed to undo changes', true);
    }
}

async function importData(file) {
    const reader = new FileReader();
    reader.onload = async function (e) {
        try {
            const content = JSON.parse(e.target.result);
            delete content.lastUpdated; // Remove timestamp if present
            const success = await saveContent(content);
            if (success) {
                await populateAllForms();
                showToast('Data imported successfully!');
            }
        } catch (error) {
            console.error('Import error:', error);
            showToast('Error importing data. Please check the file format.', true);
        }
    };
    reader.readAsText(file);
}

// Form population functions
async function populateAllForms() {
    const content = await loadContent();

    // Hero section
    document.getElementById('heroTitle').value = content.hero.title;
    document.getElementById('heroDescription').value = content.hero.description;
    document.getElementById('heroButton').value = content.hero.buttonText;

    // About section
    document.getElementById('aboutTitle').value = content.about.title;
    document.getElementById('aboutDescription').value = content.about.description;
    document.getElementById('aboutButton').value = content.about.buttonText;

    // Expert section
    document.getElementById('expertSectionTitle').value = content.expert.sectionTitle;
    document.getElementById('expertName').value = content.expert.name;
    document.getElementById('expertTitle').value = content.expert.title;
    document.getElementById('expertDescription').value = content.expert.description;
    document.getElementById('expertQual1').value = content.expert.qualifications[0] || '';
    document.getElementById('expertQual2').value = content.expert.qualifications[1] || '';
    document.getElementById('expertQual3').value = content.expert.qualifications[2] || '';

    // Features
    content.features.forEach((feature, index) => {
        const num = index + 1;
        document.getElementById(`feature${num}Title`).value = feature.title;
        document.getElementById(`feature${num}Desc`).value = feature.description;
    });

    // Pricing
    document.getElementById('silverPrice').value = content.pricing.silver.price;
    document.getElementById('silverSubtitle').value = content.pricing.silver.subtitle;
    document.getElementById('silverFeatures').value = content.pricing.silver.features;
    document.getElementById('goldPrice').value = content.pricing.gold.price;
    document.getElementById('goldSubtitle').value = content.pricing.gold.subtitle;
    document.getElementById('goldFeatures').value = content.pricing.gold.features;
    document.getElementById('platinumPrice').value = content.pricing.platinum.price;
    document.getElementById('platinumSubtitle').value = content.pricing.platinum.subtitle;
    document.getElementById('platinumFeatures').value = content.pricing.platinum.features;

    // Testimonials
    content.testimonials.forEach((testimonial, index) => {
        const num = index + 1;
        if (document.getElementById(`testimonial${num}Name`)) {
            document.getElementById(`testimonial${num}Name`).value = testimonial.name;
            document.getElementById(`testimonial${num}Title`).value = testimonial.title;
            document.getElementById(`testimonial${num}Text`).value = testimonial.text;
        }
    });

    // Blog
    content.blog.forEach((post, index) => {
        const num = index + 1;
        if (document.getElementById(`blog${num}Title`)) {
            document.getElementById(`blog${num}Title`).value = post.title;
            document.getElementById(`blog${num}Date`).value = post.date;
            document.getElementById(`blog${num}Desc`).value = post.description;
        }
    });

    // Contact
    document.getElementById('contactPhone').value = content.contact.phone;
    document.getElementById('contactEmail').value = content.contact.email;
    document.getElementById('contactAddress').value = content.contact.address;
    document.getElementById('contactHours').value = content.contact.hours;

    // Load images
    if (content.images) {
        const imageInputs = ['heroImage', 'aboutImage', 'expertImage', 'whyChooseImage'];
        imageInputs.forEach(inputId => {
            if (content.images[inputId]) {
                const preview = document.getElementById(inputId + 'Preview');
                if (preview) {
                    const img = document.createElement('img');
                    img.src = content.images[inputId];
                    preview.innerHTML = '';
                    preview.appendChild(img);
                }
            }
        });
    }
}

// Save section functions
async function saveSection(section) {
    const content = await loadContent();

    switch (section) {
        case 'hero':
            content.hero.title = document.getElementById('heroTitle').value;
            content.hero.description = document.getElementById('heroDescription').value;
            content.hero.buttonText = document.getElementById('heroButton').value;
            break;

        case 'about':
            content.about.title = document.getElementById('aboutTitle').value;
            content.about.description = document.getElementById('aboutDescription').value;
            content.about.buttonText = document.getElementById('aboutButton').value;
            break;

        case 'expert':
            content.expert.sectionTitle = document.getElementById('expertSectionTitle').value;
            content.expert.name = document.getElementById('expertName').value;
            content.expert.title = document.getElementById('expertTitle').value;
            content.expert.description = document.getElementById('expertDescription').value;
            content.expert.qualifications = [
                document.getElementById('expertQual1').value,
                document.getElementById('expertQual2').value,
                document.getElementById('expertQual3').value
            ];
            break;

        case 'features':
            content.features = [];
            for (let i = 1; i <= 6; i++) {
                content.features.push({
                    title: document.getElementById(`feature${i}Title`).value,
                    description: document.getElementById(`feature${i}Desc`).value
                });
            }
            break;

        case 'pricing':
            content.pricing.silver.price = document.getElementById('silverPrice').value;
            content.pricing.silver.subtitle = document.getElementById('silverSubtitle').value;
            content.pricing.silver.features = document.getElementById('silverFeatures').value;
            content.pricing.gold.price = document.getElementById('goldPrice').value;
            content.pricing.gold.subtitle = document.getElementById('goldSubtitle').value;
            content.pricing.gold.features = document.getElementById('goldFeatures').value;
            content.pricing.platinum.price = document.getElementById('platinumPrice').value;
            content.pricing.platinum.subtitle = document.getElementById('platinumSubtitle').value;
            content.pricing.platinum.features = document.getElementById('platinumFeatures').value;
            break;

        case 'testimonials':
            content.testimonials = [];
            for (let i = 1; i <= 2; i++) {
                if (document.getElementById(`testimonial${i}Name`)) {
                    content.testimonials.push({
                        name: document.getElementById(`testimonial${i}Name`).value,
                        title: document.getElementById(`testimonial${i}Title`).value,
                        text: document.getElementById(`testimonial${i}Text`).value
                    });
                }
            }
            break;

        case 'blog':
            content.blog = [];
            for (let i = 1; i <= 3; i++) {
                if (document.getElementById(`blog${i}Title`)) {
                    content.blog.push({
                        title: document.getElementById(`blog${i}Title`).value,
                        date: document.getElementById(`blog${i}Date`).value,
                        description: document.getElementById(`blog${i}Desc`).value
                    });
                }
            }
            break;

        case 'contact':
            content.contact.phone = document.getElementById('contactPhone').value;
            content.contact.email = document.getElementById('contactEmail').value;
            content.contact.address = document.getElementById('contactAddress').value;
            content.contact.hours = document.getElementById('contactHours').value;
            break;

        case 'images':
            showToast('Images saved successfully!');
            return;
    }

    const success = await saveContent(content);
    if (success) {
        showToast('Changes saved to cloud!');
    }
}

// Image handling
function handleImageUpload(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    input.addEventListener('change', async function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async function (event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                preview.innerHTML = '';
                preview.appendChild(img);

                // Save to Firebase
                const content = await loadContent();
                if (!content.images) content.images = {};
                content.images[inputId] = event.target.result;
                await saveContent(content);
                showToast('Image uploaded to cloud!');
            };
            reader.readAsDataURL(file);
        }
    });
}

// Initialize image uploads
function initImageUploads() {
    const imageInputs = [
        { input: 'heroImage', preview: 'heroImagePreview' },
        { input: 'aboutImage', preview: 'aboutImagePreview' },
        { input: 'expertImage', preview: 'expertImagePreview' },
        { input: 'whyChooseImage', preview: 'whyChooseImagePreview' }
    ];

    imageInputs.forEach(({ input, preview }) => {
        handleImageUpload(input, preview);
    });
}

// Tab navigation
function initTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('pageTitle');

    navItems.forEach(item => {
        item.addEventListener('click', function () {
            const tabName = this.getAttribute('data-tab');

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Update active tab content
            tabContents.forEach(tab => tab.classList.remove('active'));
            const activeTab = document.getElementById(`${tabName}Tab`);
            if (activeTab) {
                activeTab.classList.add('active');
            }

            // Update page title
            pageTitle.textContent = this.textContent.trim();
        });
    });
}

// Initialize application
document.addEventListener('DOMContentLoaded', function () {
    const loginScreen = document.getElementById('loginScreen');
    const dashboard = document.getElementById('adminDashboard');
    const loginForm = document.getElementById('loginForm');

    // Check authentication state
    firebaseAuth.onAuthStateChanged(async function (user) {
        if (user) {
            // User is logged in
            loginScreen.classList.add('hidden');
            dashboard.classList.remove('hidden');
            await populateAllForms();
            initTabs();
            initImageUploads();
        } else {
            // User is logged out
            loginScreen.classList.remove('hidden');
            dashboard.classList.add('hidden');
        }
    });

    // Login form submission
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const result = await login(email, password);
        if (!result.success) {
            showToast(result.error || 'Login failed', true);
        }
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Save buttons
    document.querySelectorAll('.save-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const section = this.getAttribute('data-section');
            saveSection(section);
        });
    });

    // Export/Import buttons
    document.getElementById('exportBtn').addEventListener('click', exportData);
    document.getElementById('importBtn').addEventListener('click', function () {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            importData(file);
        }
    });

    // Preview button
    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', async function () {
            const content = await gatherAllFormData();
            localStorage.setItem('babyBloomPreviewData', JSON.stringify(content));
            window.open('../index.html?preview=true', '_blank');
        });
    }

    // Undo button
    const undoBtn = document.getElementById('undoBtn');
    if (undoBtn) {
        undoBtn.addEventListener('click', async function () {
            if (confirm('Are you sure you want to undo the last saved changes? This will restore the previous version.')) {
                await undoChanges();
            }
        });
    }

    // Helper to gather all form data for preview
    async function gatherAllFormData() {
        const content = await loadContent(); // Start with existing content (preserves images)

        // Hero
        content.hero.title = document.getElementById('heroTitle').value;
        content.hero.description = document.getElementById('heroDescription').value;
        content.hero.buttonText = document.getElementById('heroButton').value;

        // About
        content.about.title = document.getElementById('aboutTitle').value;
        content.about.description = document.getElementById('aboutDescription').value;
        content.about.buttonText = document.getElementById('aboutButton').value;

        // Expert
        content.expert.sectionTitle = document.getElementById('expertSectionTitle').value;
        content.expert.name = document.getElementById('expertName').value;
        content.expert.title = document.getElementById('expertTitle').value;
        content.expert.description = document.getElementById('expertDescription').value;
        content.expert.qualifications = [
            document.getElementById('expertQual1').value,
            document.getElementById('expertQual2').value,
            document.getElementById('expertQual3').value
        ];

        // Features
        content.features = [];
        for (let i = 1; i <= 6; i++) {
            content.features.push({
                title: document.getElementById(`feature${i}Title`).value,
                description: document.getElementById(`feature${i}Desc`).value
            });
        }

        // Pricing
        content.pricing.silver.price = document.getElementById('silverPrice').value;
        content.pricing.silver.subtitle = document.getElementById('silverSubtitle').value;
        content.pricing.silver.features = document.getElementById('silverFeatures').value;
        content.pricing.gold.price = document.getElementById('goldPrice').value;
        content.pricing.gold.subtitle = document.getElementById('goldSubtitle').value;
        content.pricing.gold.features = document.getElementById('goldFeatures').value;
        content.pricing.platinum.price = document.getElementById('platinumPrice').value;
        content.pricing.platinum.subtitle = document.getElementById('platinumSubtitle').value;
        content.pricing.platinum.features = document.getElementById('platinumFeatures').value;

        // Testimonials
        content.testimonials = [];
        for (let i = 1; i <= 2; i++) {
            if (document.getElementById(`testimonial${i}Name`)) {
                content.testimonials.push({
                    name: document.getElementById(`testimonial${i}Name`).value,
                    title: document.getElementById(`testimonial${i}Title`).value,
                    text: document.getElementById(`testimonial${i}Text`).value
                });
            }
        }

        // Blog
        content.blog = [];
        for (let i = 1; i <= 3; i++) {
            if (document.getElementById(`blog${i}Title`)) {
                content.blog.push({
                    title: document.getElementById(`blog${i}Title`).value,
                    date: document.getElementById(`blog${i}Date`).value,
                    description: document.getElementById(`blog${i}Desc`).value
                });
            }
        }

        // Contact
        content.contact.phone = document.getElementById('contactPhone').value;
        content.contact.email = document.getElementById('contactEmail').value;
        content.contact.address = document.getElementById('contactAddress').value;
        content.contact.hours = document.getElementById('contactHours').value;

        return content;
    }

    // Reset data button
    document.getElementById('resetDataBtn').addEventListener('click', async function () {
        if (confirm('Are you sure you want to reset all content to default? This cannot be undone!')) {
            const success = await saveContent(DEFAULT_CONTENT);
            if (success) {
                await populateAllForms();
                showToast('Content reset to default');
            }
        }
    });

    // Password change button (Firebase version - updates Firebase Auth, not Firestore)
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', async function () {
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!currentPassword || !newPassword || !confirmPassword) {
                showToast('Please fill in all password fields', true);
                return;
            }

            if (newPassword !== confirmPassword) {
                showToast('New passwords do not match', true);
                return;
            }

            if (newPassword.length < 8) {
                showToast('Password must be at least 8 characters', true);
                return;
            }

            try {
                const user = firebaseAuth.currentUser;
                const email = user.email;

                // Re-authenticate user first (required for sensitive operations)
                const credential = firebase.auth.EmailAuthProvider.credential(email, currentPassword);
                await user.reauthenticateWithCredential(credential);

                // Now update password
                await user.updatePassword(newPassword);

                // Clear form
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';

                showToast('Password changed successfully!');
            } catch (error) {
                console.error('Password change error:', error);
                if (error.code === 'auth/wrong-password') {
                    showToast('Current password is incorrect', true);
                } else {
                    showToast('Error changing password: ' + error.message, true);
                }
            }
        });
    }
});
