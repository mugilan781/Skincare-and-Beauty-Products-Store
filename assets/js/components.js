/* ============================================================
   VELOUR SKIN — Shared HTML Components (Navbar + Footer)
   ============================================================ */
'use strict';

const NAV_HTML = `
<!-- Page Loader -->
<div id="pageLoader" class="page-loader">
  <div class="loader-logo">Velour<span>Skin</span></div>
</div>

<!-- Search Overlay -->
<div id="searchOverlay" class="search-overlay" role="dialog" aria-label="Search" aria-modal="true">
  <button data-search-close class="search-close" aria-label="Close search">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;display:block;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
  <div class="search-box">
    <input id="searchInput" type="search" class="search-input" placeholder="Search products, ingredients…" autocomplete="off" aria-label="Search products">
    <p class="search-hint">Press Enter to search • Esc to close</p>
  </div>
</div>

<!-- Wishlist Drawer Overlay -->
<div id="wishlistOverlay" class="search-overlay" role="dialog" aria-label="Wishlist" aria-modal="true">
  <button id="wishlistClose" class="search-close" aria-label="Close wishlist">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;display:block;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
  <div class="search-box" style="max-width:540px;text-align:left;background:var(--bg-primary);padding:2.5rem 2rem;border-radius:var(--radius-xl);position:relative;border:1px solid var(--border-color);box-shadow:var(--shadow-xl)">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid var(--border-color)">
      <h3 style="font-family:var(--font-display);font-size:1.6rem;margin:0;color:var(--text-primary)">Your Saved Wishlist</h3>
      <span id="wishlistCountText" style="font-size:.85rem;color:var(--text-secondary)">0 items</span>
    </div>
    <div id="wishlistDrawerItems" style="max-height:380px;overflow-y:auto;display:flex;flex-direction:column;gap:1.2rem;margin-bottom:1.5rem;padding-right:.5rem"></div>
    <div id="wishlistEmptyState" style="text-align:center;padding:2rem 0;color:var(--text-secondary);display:none">
      <p style="margin-bottom:1.2rem;font-size:.95rem">Your wishlist is currently empty.</p>
      <a href="services.html" class="btn btn-secondary btn-sm" onclick="document.getElementById('wishlistOverlay').classList.remove('open')">Explore Products</a>
    </div>
  </div>
</div>

<!-- Mobile Nav Overlay -->
<div id="mobileNavOverlay" class="mobile-nav-overlay"></div>

<!-- Mobile Nav -->
<nav id="mobileNav" class="mobile-nav" aria-label="Mobile navigation">
  <a href="index.html" class="mobile-nav-logo">Velour<span>Skin</span></a>
  <a href="index.html">Home</a>
  <a href="home2.html">Home 2</a>
  <a href="about.html">About</a>
  <a href="services.html">Shop</a>
  <a href="blog.html">Blog</a>
  <a href="contact.html">Contact</a>
  <a href="privacy.html">Privacy Policy</a>
  <a href="terms.html">Terms &amp; Conditions</a>
  <a href="sitemap.html">Sitemap</a>
  <a href="404.html">404</a>
  <a href="maintenance.html">Maintenance</a>
  <div style="margin-top:2rem;display:flex;gap:.75rem;flex-wrap:wrap;">
    <button data-theme-toggle class="btn btn-outline-dark btn-sm" style="border-radius:var(--radius-full);display:inline-flex;align-items:center;gap:.4rem;">
      <span data-theme-icon style="display:inline-flex;width:16px;height:16px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-moon" style="width:16px;height:16px;display:block"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </span> Mode
    </button>
    <button data-rtl-toggle class="btn btn-outline-dark btn-sm" style="border-radius:var(--radius-full);display:inline-flex;align-items:center;gap:.4rem;">
      <span data-rtl-icon style="font-size:.72rem;font-weight:700;letter-spacing:.05em;">RTL</span>
    </button>
  </div>
</nav>

<!-- Site Header (Unified Header Container) -->
<header id="siteHeader" class="site-header" role="banner">
  <!-- Announcement Bar -->
  <div class="announcement-bar">
    Free shipping on orders over $75 &nbsp;|&nbsp; New: Rose Glow Serum — Shop Now &nbsp;|&nbsp; Complimentary sample with every order
  </div>

  <!-- Navbar -->
  <div id="navbar" class="navbar">
    <div class="container">
      <div class="navbar-inner">
        <a href="index.html" class="nav-logo" aria-label="Velour Skin home">Velour<span>Skin</span></a>

        <nav class="nav-menu" role="navigation" aria-label="Primary navigation">
          <div class="nav-item">
            <a href="index.html" class="nav-link">Home</a>
          </div>
          <div class="nav-item">
            <a href="home2.html" class="nav-link">Home 2</a>
          </div>
          <div class="nav-item">
            <a href="about.html" class="nav-link">About</a>
          </div>
          <div class="nav-item">
            <a href="services.html" class="nav-link">Shop</a>
          </div>
          <div class="nav-item">
            <a href="blog.html" class="nav-link">Blog</a>
          </div>
          <div class="nav-item">
            <a href="contact.html" class="nav-link">Contact</a>
          </div>
        </nav>

        <div class="nav-actions">
          <button class="nav-icon-btn wishlist-icon" data-wishlist="nav" aria-label="Wishlist" style="position:relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            <span class="wishlist-badge" style="display:none">0</span>
          </button>
          <button class="nav-icon-btn" data-cart-open aria-label="Shopping cart" style="position:relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <span class="cart-badge" style="display:none">0</span>
          </button>
          <button class="theme-toggle" data-theme-toggle aria-label="Toggle dark mode">
            <span data-theme-icon style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;display:block"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </span>
          </button>
          <button class="rtl-toggle" data-rtl-toggle aria-label="Toggle RTL direction">
            <span data-rtl-icon style="font-size:.65rem;font-weight:800;letter-spacing:.08em;">RTL</span>
          </button>
          <button id="navHamburger" class="nav-hamburger" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</header>
`;

const FOOTER_HTML = `
<!-- Cookie Banner -->
<div id="cookieBanner" class="cookie-banner" role="dialog" aria-label="Cookie consent">
  <p class="cookie-text">We use cookies to enhance your experience. By continuing, you agree to our <a href="privacy.html">Privacy Policy</a>.</p>
  <div class="cookie-actions">
    <button id="cookieDecline" class="btn btn-outline-dark btn-sm">Decline</button>
    <button id="cookieAccept" class="btn btn-primary btn-sm">Accept All</button>
  </div>
</div>

<!-- Back to Top -->
<button id="backToTop" class="back-to-top" aria-label="Back to top">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
</button>

<!-- Footer -->
<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer-grid">

      <!-- Column 1: Company -->
      <div class="footer-brand">
        <a href="index.html" class="nav-logo">Velour<span>Skin</span></a>
        <p class="footer-desc">Luxury skincare rooted in botanical science. We craft clean, high-performance formulas for those who believe beauty is a ritual, not a routine.</p>
        <div class="footer-social">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener" class="social-btn" aria-label="VelourSkin on Instagram">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.8c-3.15 0-3.52.01-4.76.07-.9.04-1.38.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.33-.28.81-.32 1.71C3.17 8.65 3.16 9.02 3.16 12s.01 3.35.07 4.59c.04.9.19 1.38.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.33.13.81.28 1.71.32 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c.9-.04 1.38-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.33.28-.81.32-1.71.06-1.24.07-1.61.07-4.59s-.01-3.35-.07-4.59c-.04-.9-.19-1.38-.32-1.71-.17-.43-.37-.74-.69-1.06-.32-.32-.63-.52-1.06-.69-.33-.13-.81-.28-1.71-.32C15.52 3.97 15.15 3.96 12 3.96zm0 3.06A5 5 0 1 1 12 17a5 5 0 0 1 0-9.98zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zm5.15-2.55a1.17 1.17 0 1 1-2.34 0 1.17 1.17 0 0 1 2.34 0z"/></svg>
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener" class="social-btn" aria-label="VelourSkin on Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z"/></svg>
          </a>
          <a href="https://www.pinterest.com/" target="_blank" rel="noopener" class="social-btn" aria-label="VelourSkin on Pinterest">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C24.002 5.367 18.624 0 12.017 0z"/></svg>
          </a>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener" class="social-btn" aria-label="VelourSkin on YouTube">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.53A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12c1.88.53 9.38.53 9.38.53s7.5 0 9.38-.53a3 3 0 0 0 2.12-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12z"/></svg>
          </a>
        </div>
      </div>

      <!-- Column 2: Quick Links -->
      <div class="footer-col">
        <h4>Quick Links</h4>
        <div class="footer-links">
          <a href="index.html">Home</a>
          <a href="home2.html">Home 2</a>
          <a href="about.html">About</a>
          <a href="services.html">Shop</a>
          <a href="blog.html">Blog</a>
          <a href="contact.html">Contact</a>
        </div>
      </div>

      <!-- Column 3: Contact Us -->
      <div class="footer-col">
        <h4>Contact Us</h4>
        <ul class="footer-contact">
          <li>
            <span class="footer-contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg></span>
            <a href="mailto:hello@velourskin.com">hello@velourskin.com</a>
          </li>
          <li>
            <span class="footer-contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
            <a href="tel:+18001234567">+1 (800) 123-4567</a>
          </li>
          <li>
            <span class="footer-contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
            <a href="https://www.google.com/maps/search/?api=1&amp;query=128+Rue+de+la+Beaut%C3%A9+Florence+Italy" target="_blank" rel="noopener">128 Rue de la Beauté<br>Florence, Tuscany, IT 50122</a>
          </li>
          <li>
            <span class="footer-contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span>
            <span>Mon–Fri: 9am–6pm EST</span>
          </li>
        </ul>
      </div>

      <!-- Column 4: Newsletter -->
      <div class="footer-col footer-newsletter">
        <h4>Newsletter</h4>
        <p class="footer-newsletter-desc">Subscribe for new launches, beauty rituals and exclusive offers — straight to your inbox.</p>
        <form class="newsletter-form" novalidate>
          <input type="email" class="newsletter-input" placeholder="Your email address" aria-label="Email address for newsletter" required>
          <button type="submit" class="btn btn-primary">Subscribe</button>
        </form>
      </div>

    </div>

    <div class="footer-bottom">
      <p class="footer-copyright">© <span id="footerYear">2026</span> VelourSkin. All rights reserved.</p>
      <div class="footer-legal">
        <a href="privacy.html">Privacy Policy</a>
        <span class="footer-legal-sep" aria-hidden="true">|</span>
        <a href="terms.html">Terms &amp; Conditions</a>
        <span class="footer-legal-sep" aria-hidden="true">|</span>
        <a href="sitemap.html">Sitemap</a>
      </div>
    </div>
  </div>
</footer>
`;

/* ── Cart Drawer ─────────────────────────────────────────── */
const CART_HTML = `
<!-- Cart Drawer -->
<div id="cartOverlay" class="cart-overlay" aria-hidden="true"></div>
<aside id="cartDrawer" class="cart-drawer" aria-hidden="true" aria-label="Shopping cart" role="dialog">
  <div class="cart-drawer-header">
    <h3 class="cart-drawer-title">Your Cart <span class="cart-drawer-count" id="cartCountLabel"></span></h3>
    <button class="cart-drawer-close" data-cart-close aria-label="Close cart">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
  </div>
  <div class="cart-drawer-body" id="cartItems"></div>
  <div class="cart-drawer-footer" id="cartFooter">
    <div class="cart-subtotal">
      <span>Subtotal</span>
      <strong id="cartSubtotal">$0.00</strong>
    </div>
    <button class="btn btn-primary" style="width:100%;justify-content:center" data-cart-checkout>Checkout</button>
    <a href="services.html" class="btn btn-outline-dark btn-sm" style="width:100%;justify-content:center;margin-top:.6rem" data-cart-close>Continue Shopping</a>
  </div>
</aside>
`;

/* ── Inject Components ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Inject nav before first child of body
  const navMount = document.getElementById('navMount');
  if (navMount) navMount.innerHTML = NAV_HTML;

  const footerMount = document.getElementById('footerMount');
  if (footerMount) footerMount.innerHTML = FOOTER_HTML;

  const bodyMount = document.createElement('div');
  bodyMount.innerHTML = CART_HTML;
  while (bodyMount.firstChild) document.body.appendChild(bodyMount.firstChild);

  if (window.initNavbar) window.initNavbar();
});
