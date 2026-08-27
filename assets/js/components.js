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
  <button data-search-close class="search-close" aria-label="Close search">✕</button>
  <div class="search-box">
    <input id="searchInput" type="search" class="search-input" placeholder="Search products, ingredients…" autocomplete="off" aria-label="Search products">
    <p class="search-hint">Press Enter to search • Esc to close</p>
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
  <a href="services.html">Services</a>
  <a href="blog.html">Blog</a>
  <a href="contact.html">Contact</a>
  <a href="privacy.html">Privacy Policy</a>
  <a href="terms.html">Terms &amp; Conditions</a>
  <a href="sitemap.html">Sitemap</a>
  <a href="404.html">404</a>
  <a href="maintenance.html">Maintenance</a>
  <div style="margin-top:2rem;display:flex;gap:.75rem;flex-wrap:wrap;">
    <button data-theme-toggle class="btn btn-outline-dark btn-sm" style="border-radius:var(--radius-full)">
      <span data-theme-icon>🌙</span> Mode
    </button>
    <button data-rtl-toggle class="btn btn-outline-dark btn-sm" style="border-radius:var(--radius-full)">
      <span data-rtl-icon>RTL</span>
    </button>
  </div>
</nav>

<!-- Announcement Bar -->
<div class="announcement-bar" role="banner">
  ✦ Free shipping on orders over $75 &nbsp;|&nbsp; ✦ New: Rose Glow Serum — Shop Now &nbsp;|&nbsp; ✦ Complimentary sample with every order
</div>

<!-- Navbar -->
<header id="navbar" class="navbar" role="banner">
  <div class="container">
    <div class="navbar-inner">
      <a href="index.html" class="nav-logo" aria-label="Velour Skin home">Velour<span>Skin</span></a>

      <nav class="nav-menu" role="navigation" aria-label="Primary navigation">
        <div class="nav-item">
          <a href="index.html" class="nav-link">Home</a>
        </div>
        <div class="nav-item">
          <a href="about.html" class="nav-link">About</a>
        </div>
        <div class="nav-item">
          <a href="services.html" class="nav-link">Shop ▾</a>
          <div class="nav-dropdown">
            <a href="services.html#cleansers">Cleansers</a>
            <a href="services.html#serums">Serums</a>
            <a href="services.html#moisturizers">Moisturizers</a>
            <a href="services.html#sunscreens">Sunscreens</a>
            <a href="services.html#masks">Face Masks</a>
            <a href="services.html#bundles">Bundle Deals</a>
          </div>
        </div>
        <div class="nav-item">
          <a href="blog.html" class="nav-link">Journal</a>
        </div>
        <div class="nav-item">
          <a href="contact.html" class="nav-link">Contact</a>
        </div>
        <div class="nav-item">
          <a href="home2.html" class="nav-link">Home 2</a>
        </div>
      </nav>

      <div class="nav-actions">
        <button class="nav-icon-btn" data-search-open aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </button>
        <button class="nav-icon-btn wishlist-icon" data-wishlist="nav" aria-label="Wishlist">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        </button>
        <button class="nav-icon-btn" aria-label="Shopping cart" style="position:relative">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <span class="cart-badge" style="display:none">0</span>
        </button>
        <button class="theme-toggle" data-theme-toggle aria-label="Toggle dark mode">
          <span data-theme-icon>🌙</span>
        </button>
        <button class="rtl-toggle" data-rtl-toggle aria-label="Toggle RTL direction">
          <span data-rtl-icon>RTL</span>
        </button>
        <button id="navHamburger" class="nav-hamburger" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
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
      <div class="footer-brand">
        <a href="index.html" class="nav-logo">Velour<span>Skin</span></a>
        <p style="margin-top:1rem">Luxury skincare rooted in botanical science. Crafted for those who believe beauty is a ritual, not a routine.</p>
        <div class="footer-social">
          <a href="#" class="social-btn" aria-label="Instagram">IG</a>
          <a href="#" class="social-btn" aria-label="Pinterest">Pt</a>
          <a href="#" class="social-btn" aria-label="TikTok">Tk</a>
          <a href="#" class="social-btn" aria-label="YouTube">YT</a>
          <a href="#" class="social-btn" aria-label="Facebook">Fb</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Shop</h4>
        <div class="footer-links">
          <a href="services.html">All Products</a>
          <a href="services.html#cleansers">Cleansers</a>
          <a href="services.html#serums">Serums</a>
          <a href="services.html#moisturizers">Moisturizers</a>
          <a href="services.html#sunscreens">Sunscreens</a>
          <a href="services.html#masks">Face Masks</a>
          <a href="services.html#bundles">Bundle Deals</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <div class="footer-links">
          <a href="about.html">Our Story</a>
          <a href="blog.html">Beauty Journal</a>
          <a href="contact.html">Contact Us</a>
          <a href="sitemap.html">Sitemap</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Support</h4>
        <div class="footer-links">
          <a href="privacy.html">Privacy Policy</a>
          <a href="terms.html">Terms &amp; Conditions</a>
          <a href="contact.html">FAQ</a>
          <a href="contact.html">Shipping Info</a>
          <a href="contact.html">Returns</a>
          <a href="maintenance.html">Status Page</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="footer-copyright">© 2026 VelourSkin. All rights reserved. Made with ✦ for beauty lovers.</p>
      <div class="footer-legal">
        <a href="privacy.html">Privacy</a>
        <a href="terms.html">Terms</a>
        <a href="sitemap.html">Sitemap</a>
      </div>
    </div>
  </div>
</footer>
`;

/* ── Inject Components ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Inject nav before first child of body
  const navMount = document.getElementById('navMount');
  if (navMount) navMount.innerHTML = NAV_HTML;

  const footerMount = document.getElementById('footerMount');
  if (footerMount) footerMount.innerHTML = FOOTER_HTML;
});
