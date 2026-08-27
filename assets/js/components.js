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
          <button class="nav-icon-btn wishlist-icon" data-wishlist="nav" aria-label="Wishlist">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
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
      <p class="footer-copyright">© 2026 VelourSkin. All rights reserved. Made with care for beauty lovers.</p>
      <div class="footer-legal">
        <a href="privacy.html">Privacy</a>
        <a href="terms.html">Terms</a>
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
    <button class="btn btn-outline-dark btn-sm" style="width:100%;justify-content:center;margin-top:.6rem" data-cart-close>Continue Shopping</button>
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
});
