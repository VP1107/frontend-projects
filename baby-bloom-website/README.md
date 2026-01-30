# Baby Bloom - Garbhasanskar & Prenatal Care

A comprehensive prenatal care website dedicated to Garbhasanskar, helping expectant mothers prepare for a joyful pregnancy through ancient Vedic wisdom and modern science.

🔗 **Live Demo:** [https://vp1107.github.io/frontend-projects/baby-bloom-website/](https://vp1107.github.io/frontend-projects/baby-bloom-website/)

## ✨ Key Features

### Core Features
- **Intro Animation:** Beautiful canvas-based particle animation and multi-stage intro sequence representing the journey of pregnancy (optimized for mobile - 56% faster).
- **Detailed Service Information:** Sections for Garbhasanskar program details, benefits, and expert profiles.
- **Pricing Packages:** Clear display of Silver, Gold, and Platinum care packages with feature comparisons.
- **Testimonials:** Video and text testimonials from happy mothers.
- **Blog Section:** Informative articles on pregnancy wellness, nutrition, and yoga.
- **Community Hub:** Upcoming live events fetched from Google Apps Script and forum discussions.
- **Contact Form:** Integrated inquiry form with Google Apps Script backend integration.
- **Responsive Design:** Fully optimized for desktop, tablet, and mobile devices.

### 🔒 Security & Performance
- **Content Security Policy (CSP):** Protection against XSS attacks and malicious content.
- **Form Rate Limiting:** Prevents spam submissions (60-second cooldown between submissions).
- **Progressive Web App (PWA):** Installable on mobile devices with offline capability.
- **Optimized Mobile Experience:** Touch-friendly buttons (48px minimum tap targets) and faster animations.

### ♿ Accessibility
- **ARIA Labels:** Full screen reader support for interactive elements.
- **Keyboard Navigation:** Complete keyboard accessibility for FAQs and navigation.
- **Focus States:** Clear visual indicators for keyboard users.
- **WCAG 2.1 Compliant:** Touch targets and contrast ratios meet accessibility standards.

### 📈 SEO Optimizations
- **Structured Data:** Schema.org markup for LocalBusiness, Reviews, and BlogPostings.
- **Meta Tags:** Complete Open Graph and Twitter Card support.
- **Semantic HTML:** Proper heading hierarchy and semantic elements.

### 🎨 Firebase Integration
- **Cloud CMS:** Firebase Firestore for content management.
- **Admin Panel:** Real-time content editing at `/admin.html`.
- **Firebase Storage:** Cloud-based image hosting.
- **Authentication:** Secure admin access with Firebase Auth.

## 🛠️ Technologies Used

- **HTML5:** Semantic structure and accessibility.
- **CSS3:** Custom styling, flexbox/grid layouts, and smooth animations.
- **JavaScript (ES6+):** Interactivity, animations, and async operations.
- **Canvas API:** Background particle effects in the intro section.
- **Firebase:** Firestore, Authentication, and Storage.
- **Google Apps Script:** Form submissions and event management.
- **PWA Technologies:** Service worker ready, web manifest configured.

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/vp1107/frontend-projects.git
   ```
2. Navigate to the project directory:
   ```bash
   cd frontend-projects/baby-bloom-website
   ```
3. Open `index.html` in your browser to view the site.

### For Development with Firebase:
1. Update `js/firebase-config.js` with your Firebase credentials
2. Deploy Firebase security rules from `firestore.rules`
3. Access admin panel at `admin.html` (requires authentication)

## 📂 Project Structure

```
baby-bloom-website/
├── index.html              # Main landing page
├── admin.html              # Firebase-powered admin panel
├── garbhasanskar.html      # Dedicated page for Garbhasanskar details
├── manifest.json           # PWA manifest
├── css/
│   └── style.css           # Main stylesheet with responsive design
├── js/
│   ├── script.js           # Main JavaScript (animations, interactions)
│   ├── firebase-config.js  # Firebase configuration
│   └── admin-firebase.js   # Admin panel logic
└── assets/                 # Images and design assets (.webp optimized)
```

## 🎯 Recent Enhancements

- ✅ Progressive Web App (PWA) with offline support
- ✅ Content Security Policy for enhanced security
- ✅ Form rate limiting to prevent spam
- ✅ ARIA labels and keyboard navigation for accessibility
- ✅ Structured data for SEO (reviews, blog posts)
- ✅ Mobile-optimized intro animation (56% faster)
- ✅ Touch-friendly buttons (48px minimum tap targets)
- ✅ Real-time form validation with visual feedback

## 📱 PWA Installation

**Android/Desktop:**
1. Visit the website in Chrome/Edge
2. Look for the "Install" icon in the address bar
3. Click to add to home screen

**iOS:**
1. Open in Safari
2. Tap Share → Add to Home Screen
3. App opens in standalone mode

## 🔐 Security Features

- Content Security Policy (CSP) protection
- Firebase Authentication for admin access
- Password change requires re-authentication
- Rate limiting on form submissions
- Secure Firebase rules configuration

---

<p align="center">
  Designed with ❤️ for expecting families.
</p>
