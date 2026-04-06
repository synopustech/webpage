# SynOpusTech Landing Website

Modern one-page website for SynOpusTech showcasing live AI apps, with a Formspree contact section and standalone privacy policy page.

## 🏗️ Project Structure

```
webpage/
├── index.html                # One-page landing (apps + contact)
├── privacy-policy.html       # Privacy policy page
├── css/
│   ├── index.css             # Landing page styles
│   ├── main.css              # Shared styles used by privacy policy page
│   └── privacy-policy.css    # Privacy policy page styles
├── js/
│   ├── index.js              # Landing page interactions
│   └── structured-data.js    # JSON-LD loader
├── data/
│   ├── organization.json     # Organization schema
│   └── website.json          # Website schema
├── images/
│   └── apps/                 # App screenshots used on landing cards
├── favicon.svg               # Site favicon
├── CNAME                     # Domain configuration for GitHub Pages
└── README.md                 # This file
```

## Features

### Landing Page (`index.html`)
- One-page layout with hero, app cards, build approach, and contact form
- Three app showcase cards with live screenshots
- Formspree-powered contact submission
- Responsive design and smooth scrolling/reveal effects

### Privacy Page (`privacy-policy.html`)
- Separate legal/privacy content page
- Links back to home, apps section, and contact section

### SEO
- Optimized meta tags (title, description, keywords)
- Open Graph tags for social media sharing
- JSON-LD structured data for search engines
- Canonical URLs for proper indexing
- Fast loading with minimal dependencies

## Technical Features
- Modern CSS with Grid/Flexbox, custom properties, and responsive layout
- Vanilla JavaScript interactions for reveal animations and form handling
- JSON-LD schema loading from local data files
- Mobile and desktop support

## Deployment

### GitHub Pages (Recommended)
1. **Repository Setup:**
   - Push files to a GitHub repository
   - Enable GitHub Pages in repository settings
   - The `CNAME` file is already configured for custom domains

2. **Custom Domain:**
   - Update `CNAME` file with your domain name
   - Configure DNS settings with your domain provider
   - GitHub Pages will automatically handle SSL certificates

### Alternative Hosting
- **Netlify:** Upload the entire folder including CSS/JS files for instant deployment
- **Vercel:** Connect GitHub repository for automatic deployments with full file structure
- **Traditional Hosting:** Upload all files via FTP to any web server maintaining folder structure
3. **Domain:**
   - Point your custom domain (e.g., `synopustech.com`) to your host

## Best Practices
- Use descriptive alt text for all images
- Test accessibility with screen readers and keyboard navigation
- Keep all dependencies and contact endpoints up to date

---

© 2025 SynOpusTech. All rights reserved.
