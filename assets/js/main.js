/* ============================================================
   VELOUR SKIN — Master JavaScript
   ============================================================ */
'use strict';

/* ── Utility ──────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, cb, opts) => el && el.addEventListener(ev, cb, opts);

/* ── Storage ──────────────────────────────────────────────── */
const store = {
  get: k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

/* ── Page Loader ──────────────────────────────────────────── */
const initLoader = () => {
  const loader = $('#pageLoader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 600);
  });
};

/* ── Theme Toggle ─────────────────────────────────────────── */
const initTheme = () => {
  const saved = store.get('velour-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcons(saved);

  $$('[data-theme-toggle]').forEach(btn => {
    on(btn, 'click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      store.set('velour-theme', next);
      updateThemeIcons(next);
    });
  });
};

const SVG_MOON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;display:block"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const SVG_SUN  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;display:block"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

const updateThemeIcons = theme => {
  $$('[data-theme-icon]').forEach(el => {
    el.innerHTML = theme === 'dark' ? SVG_SUN : SVG_MOON;
    el.style.display = 'inline-flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.width = '18px';
    el.style.height = '18px';
  });
};

/* ── RTL Toggle ───────────────────────────────────────────── */
const initRTL = () => {
  const saved = store.get('velour-dir') || 'ltr';
  document.documentElement.setAttribute('dir', saved);
  updateRTLIcons(saved);

  $$('[data-rtl-toggle]').forEach(btn => {
    on(btn, 'click', () => {
      const current = document.documentElement.getAttribute('dir');
      const next = current === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', next);
      store.set('velour-dir', next);
      updateRTLIcons(next);
    });
  });
};

const updateRTLIcons = dir => {
  $$('[data-rtl-icon]').forEach(el => {
    el.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
  });
};

/* ── Navbar ───────────────────────────────────────────────── */
const initNavbar = () => {
  const navbar = $('#navbar');
  const header = $('#siteHeader');
  if (!navbar) return;

  const hasDarkHero = !!document.querySelector('.hero-slider');
  if (!hasDarkHero) {
    navbar.classList.add('nav-solid-theme');
  }

  const onScroll = () => {
    const isScrolled = window.scrollY > 40;
    navbar.classList.toggle('scrolled', isScrolled);
    if (header) header.classList.toggle('scrolled', isScrolled);
  };
  on(window, 'scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger
  const ham = $('#navHamburger');
  const mobileNav = $('#mobileNav');
  const mobileOverlay = $('#mobileNavOverlay');

  const toggleMobile = open => {
    ham?.classList.toggle('active', open);
    mobileNav?.classList.toggle('open', open);
    mobileOverlay?.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  on(ham, 'click', () => toggleMobile(!mobileNav.classList.contains('open')));
  on(mobileOverlay, 'click', () => toggleMobile(false));
  $$('.mobile-nav a').forEach(a => on(a, 'click', () => toggleMobile(false)));

  // Active link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
};

/* ── Hero Slider ──────────────────────────────────────────── */
const initHeroSlider = () => {
  const slider = $('#heroSlider');
  if (!slider) return;

  const slides = $$('.hero-slide', slider);
  const dots   = $$('.hero-dot',   slider);
  let current  = 0, timer = null;

  const goTo = idx => {
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
  };

  const autoPlay = () => { timer = setInterval(() => goTo(current + 1), 5500); };
  const resetAuto = () => { clearInterval(timer); autoPlay(); };

  dots.forEach((dot, i) => on(dot, 'click', () => { goTo(i); resetAuto(); }));

  on($('#heroPrev'), 'click', () => { goTo(current - 1); resetAuto(); });
  on($('#heroNext'), 'click', () => { goTo(current + 1); resetAuto(); });

  goTo(0);
  autoPlay();

  // Swipe
  let startX = 0;
  on(slider, 'touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  on(slider, 'touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) { goTo(current + (diff > 0 ? 1 : -1)); resetAuto(); }
  }, { passive: true });
};

/* ── Testimonial Slider ───────────────────────────────────── */
const initTestimonialSlider = () => {
  const track = $('#testimonialTrack');
  const slider = $('.testimonial-slider');
  if (!track || !slider) return;
  const slides = $$('.testimonial-slide', track);
  const total = slides.length;
  if (!total) return;
  let current = 0;

  const goTo = idx => {
    current = (idx + total) % total;
    const targetOffset = slides[current] ? slides[current].offsetLeft : 0;
    track.style.transform = `translateX(-${targetOffset}px)`;
    $$('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  };

  on($('#testiPrev'), 'click', () => goTo(current - 1));
  on($('#testiNext'), 'click', () => goTo(current + 1));
  $$('.testi-dot').forEach((d, i) => on(d, 'click', () => goTo(i)));
  on(window, 'resize', () => goTo(current), { passive: true });

  setInterval(() => goTo(current + 1), 6000);
};

/* ── Scroll Reveal ────────────────────────────────────────── */
const initScrollReveal = () => {
  const targets = $$('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(el => observer.observe(el));
};

/* ── FAQ Accordion ────────────────────────────────────────── */
const initFAQ = () => {
  $$('.faq-question').forEach(q => {
    on(q, 'click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      $$('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
};

/* ── Skin Quiz ────────────────────────────────────────────── */
const initQuiz = () => {
  const quiz = $('#skinQuiz');
  if (!quiz) return;

  const steps = $$('.quiz-step', quiz);
  const dots  = $$('.quiz-progress-dot', quiz);
  const counter = $('#quizStepCount');
  let step = 0;
  let answers = {};

  const showStep = idx => {
    steps.forEach((s, i) => s.classList.toggle('active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('done', i < idx));
    if (counter) counter.textContent = `${idx + 1} / ${steps.length}`;
  };

  $$('.quiz-option', quiz).forEach(opt => {
    on(opt, 'click', () => {
      $$('.quiz-option', opt.closest('.quiz-step')).forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      answers[step] = opt.dataset.value;
    });
  });

  on($('#quizNext'), 'click', () => {
    if (step < steps.length - 1) { step++; showStep(step); }
    else { showQuizResult(answers); }
  });

  on($('#quizPrev'), 'click', () => {
    if (step > 0) { step--; showStep(step); }
  });

  showStep(0);
};

const showQuizResult = answers => {
  const resultEl = $('#quizResult');
  if (!resultEl) return;
  resultEl.innerHTML = `
    <div style="text-align:center;color:var(--ivory)">
      <div style="display:flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:50%;background:rgba(201,166,107,.2);margin:0 auto 1.25rem;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:32px;height:32px;color:var(--champagne)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      </div>
      <h3 style="font-family:var(--font-display);font-size:1.8rem;margin-bottom:.75rem">Your Skin Profile is Ready!</h3>
      <p style="color:rgba(251,247,242,.75);margin-bottom:2rem">Based on your answers, we recommend our <strong>Hydrating Glow Collection</strong>.</p>
      <a href="services.html" class="btn btn-secondary">View Recommendations</a>
    </div>
  `;
  resultEl.style.display = 'block';
  $('#skinQuiz').style.display = 'none';
};

/* ── Back to Top ──────────────────────────────────────────── */
const initBackToTop = () => {
  const btn = $('#backToTop');
  if (!btn) return;
  on(window, 'scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

/* ── Search Overlay ───────────────────────────────────────── */
const initSearch = () => {
  const overlay = $('#searchOverlay');
  if (!overlay) return;

  const open  = () => { overlay.classList.add('open'); $('#searchInput')?.focus(); document.body.style.overflow = 'hidden'; };
  const close = () => { overlay.classList.remove('open'); document.body.style.overflow = ''; };

  $$('[data-search-open]').forEach(btn => on(btn, 'click', open));
  $$('[data-search-close]').forEach(btn => on(btn, 'click', close));
  on(overlay, 'click', e => { if (e.target === overlay) close(); });
  on(document, 'keydown', e => { if (e.key === 'Escape') close(); });
};

/* ── Cart ─────────────────────────────────────────────────── */
let cart = store.get('velour-cart') || [];

const updateCartBadge = () => {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  $$('.cart-badge').forEach(el => { el.textContent = count; el.style.display = count ? 'flex' : 'none'; });
};

const addToCart = (id, name, price) => {
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty++; }
  else { cart.push({ id, name, price, qty: 1 }); }
  store.set('velour-cart', cart);
  updateCartBadge();
  showToast(`Added to cart: ${name}`);
};

/* ── Add to Cart Buttons ──────────────────────────────────── */
const initAddToCart = () => {
  $$('[data-add-cart]').forEach(btn => {
    on(btn, 'click', () => {
      const id    = btn.dataset.addCart;
      const name  = btn.dataset.name  || 'Product';
      const price = btn.dataset.price || '0';
      addToCart(id, name, price);
    });
  });
};

/* ── Cart Drawer ─────────────────────────────────────────── */
let cartDrawer, cartOverlay, cartItemsEl, cartFooterEl, cartSubtotalEl, cartCountLabel;

const money = n => '$' + Number(n).toFixed(2);

const openCart = () => {
  renderCart();
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('show');
  cartDrawer.setAttribute('aria-hidden', 'false');
  cartOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeCart = () => {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('show');
  cartDrawer.setAttribute('aria-hidden', 'true');
  cartOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

const renderCart = () => {
  if (!cartItemsEl) return;
  if (!cart.length) {
    cartItemsEl.innerHTML = `<div class="cart-empty">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:42px;height:42px;opacity:.4"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
      <p>Your cart is empty.</p>
      <a href="services.html" class="btn btn-outline-dark btn-sm" data-cart-close>Start Shopping</a>
    </div>`;
    cartFooterEl.style.display = 'none';
    return;
  }
  cartFooterEl.style.display = '';
  cartCountLabel.textContent = `(${cart.reduce((s, i) => s + i.qty, 0)})`;
  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item" data-cart-item="${item.id}">
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">${money(item.price)}</p>
      </div>
      <div class="cart-item-actions">
        <div class="qty-control" style="margin:0">
          <button type="button" data-cart-dec aria-label="Decrease">−</button>
          <span class="qty-value">${item.qty}</span>
          <button type="button" data-cart-inc aria-label="Increase">+</button>
        </div>
        <button class="cart-item-remove" data-cart-remove aria-label="Remove item">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
    </div>
  `).join('');
  const subtotal = cart.reduce((s, i) => s + Number(i.price) * i.qty, 0);
  cartSubtotalEl.textContent = money(subtotal);
};

const changeQty = (id, delta) => {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  store.set('velour-cart', cart);
  updateCartBadge();
  renderCart();
};

const removeFromCart = id => {
  cart = cart.filter(i => i.id !== id);
  store.set('velour-cart', cart);
  updateCartBadge();
  renderCart();
};

const initCartDrawer = () => {
  cartDrawer = $('#cartDrawer');
  cartOverlay = $('#cartOverlay');
  cartItemsEl = $('#cartItems');
  cartFooterEl = $('#cartFooter');
  cartSubtotalEl = $('#cartSubtotal');
  cartCountLabel = $('#cartCountLabel');
  if (!cartDrawer) return;
  on(cartOverlay, 'click', closeCart);
  $$('[data-cart-open]').forEach(btn => on(btn, 'click', openCart));
  on(cartDrawer, 'click', e => { if (e.target.closest('[data-cart-close]')) closeCart(); });
  on(document, 'keydown', e => { if (e.key === 'Escape' && cartDrawer.classList.contains('open')) closeCart(); });

  on(cartItemsEl, 'click', e => {
    const inc = e.target.closest('[data-cart-inc]');
    const dec = e.target.closest('[data-cart-dec]');
    const rem = e.target.closest('[data-cart-remove]');
    const row = e.target.closest('[data-cart-item]');
    if (!row) return;
    const id = row.dataset.cartItem;
    if (inc) changeQty(id, 1);
    else if (dec) changeQty(id, -1);
    else if (rem) removeFromCart(id);
  });

  $$('[data-cart-checkout]').forEach(btn => on(btn, 'click', () => {
    if (!cart.length) { showToast('Your cart is empty'); return; }
    showToast('Proceeding to checkout…');
    setTimeout(closeCart, 400);
  }));
};

/* ── Wishlist System ───────────────────────────────────────── */
let wishlist = store.get('velour-wishlist') || [];

const PRODUCTS_DB = {
  'serum-vitc': { id: 'serum-vitc', name: 'Vitamin C Brightening Serum', price: 68, category: 'Serums', image: 'assets/images/serum-product.jpg' },
  'cleanser-foam': { id: 'cleanser-foam', name: 'Gentle Botanical Foam Cleanser', price: 42, category: 'Cleansers', image: 'assets/images/cleanser-product.jpg' },
  'moisturizer-ha': { id: 'moisturizer-ha', name: 'Hyaluronic Hydrating Cream', price: 78, category: 'Moisturizers', image: 'assets/images/moisturizer-product.jpg' },
  'mask-rose': { id: 'mask-rose', name: 'Rose Kaolin Clay Mask', price: 52, category: 'Face Masks', image: 'assets/images/facemask-product.jpg' },
  'sunscreen-spf50': { id: 'sunscreen-spf50', name: 'Invisible Shield Sunscreen SPF 50+', price: 48, category: 'Sunscreens', image: 'assets/images/sunscreen-product.jpg' },
  'oil-rosehip': { id: 'oil-rosehip', name: 'Rosehip Radiance Facial Oil', price: 74, category: 'Serums', image: 'assets/images/rosehip-oil.jpg' }
};

const SVG_HEART_OUTLINE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const SVG_HEART_FILLED  = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

const updateWishlistBadge = () => {
  const count = wishlist.length;
  $$('.wishlist-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count ? 'flex' : 'none';
  });
  const textEl = $('#wishlistCountText');
  if (textEl) textEl.textContent = `${count} item${count === 1 ? '' : 's'}`;
};

const renderWishlistDrawer = () => {
  const container = $('#wishlistDrawerItems');
  const emptyState = $('#wishlistEmptyState');
  if (!container) return;

  if (!wishlist.length) {
    container.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';

  container.innerHTML = wishlist.map(id => {
    const item = PRODUCTS_DB[id] || { id, name: 'VelourSkin Formula', price: 58, category: 'Skincare', image: 'assets/images/serum-product.jpg' };
    return `
      <div class="wishlist-drawer-item" data-id="${item.id}" style="display:flex;align-items:center;gap:1rem;padding:.75rem 0;border-bottom:1px solid var(--border-color)">
        <img src="${item.image}" alt="${item.name}" style="width:54px;height:54px;object-fit:cover;border-radius:var(--radius-md);flex-shrink:0;">
        <div style="flex:1;min-width:0;">
          <p style="font-size:.72rem;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted);margin:0 0 .2rem;">${item.category}</p>
          <h4 style="font-size:.95rem;margin:0 0 .3rem;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</h4>
          <span style="font-size:.9rem;font-weight:600;color:var(--rosewood);">$${item.price}</span>
        </div>
        <button class="btn btn-secondary btn-sm" data-add-cart="${item.id}" data-name="${item.name}" data-price="${item.price}" style="padding:.4rem .8rem;font-size:.75rem;">Add to Cart</button>
        <button data-remove-wish="${item.id}" aria-label="Remove from wishlist" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:.3rem;transition:color .2s;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;display:block;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `;
  }).join('');
};

const initWishlist = () => {
  updateWishlistBadge();

  // Initialize button icons and click handlers
  $$('[data-wishlist]').forEach(btn => {
    const id = btn.dataset.wishlist;
    if (id === 'nav') return; // Navbar icon is trigger

    const isSaved = wishlist.includes(id);
    btn.classList.toggle('wishlisted', isSaved);
    btn.classList.toggle('active', isSaved);
    btn.innerHTML = isSaved ? SVG_HEART_FILLED : SVG_HEART_OUTLINE;

    on(btn, 'click', e => {
      e.preventDefault();
      e.stopPropagation();
      if (wishlist.includes(id)) {
        wishlist = wishlist.filter(i => i !== id);
        btn.classList.remove('wishlisted', 'active');
        btn.innerHTML = SVG_HEART_OUTLINE;
        showToast('Removed from wishlist');
      } else {
        wishlist.push(id);
        btn.classList.add('wishlisted', 'active');
        btn.innerHTML = SVG_HEART_FILLED;
        showToast('Saved to wishlist');
      }
      store.set('velour-wishlist', wishlist);
      updateWishlistBadge();
      renderWishlistDrawer();
    });
  });

  // Navbar Wishlist Trigger
  const navTrigger = $('[data-wishlist="nav"]');
  const overlay = $('#wishlistOverlay');
  const closeBtn = $('#wishlistClose');

  if (navTrigger && overlay) {
    on(navTrigger, 'click', () => {
      renderWishlistDrawer();
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    on(closeBtn, 'click', () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
    on(overlay, 'click', e => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Remove from Wishlist Drawer Delegation
  on($('#wishlistDrawerItems'), 'click', e => {
    const remBtn = e.target.closest('[data-remove-wish]');
    if (remBtn) {
      const id = remBtn.dataset.removeWish;
      wishlist = wishlist.filter(i => i !== id);
      store.set('velour-wishlist', wishlist);
      updateWishlistBadge();
      renderWishlistDrawer();
      // Update page buttons if present
      $$(`[data-wishlist="${id}"]`).forEach(btn => {
        btn.classList.remove('wishlisted', 'active');
        btn.innerHTML = SVG_HEART_OUTLINE;
      });
    }
  });
};

/* ── Toast ────────────────────────────────────────────────── */
const showToast = (msg, duration = 3000) => {
  let container = $('#toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 350);
  }, duration);
};

/* ── Form Validation ──────────────────────────────────────── */
const initForms = () => {
  $$('form[data-validate]').forEach(form => {
    on(form, 'submit', e => {
      e.preventDefault();
      let valid = true;
      $$('[required]', form).forEach(field => {
        const err = field.parentElement.querySelector('.field-error');
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#E74C3C';
          if (err) err.textContent = 'This field is required';
        } else if (field.type === 'email' && !/\S+@\S+\.\S+/.test(field.value)) {
          valid = false;
          field.style.borderColor = '#E74C3C';
          if (err) err.textContent = 'Please enter a valid email';
        } else {
          field.style.borderColor = '';
          if (err) err.textContent = '';
        }
      });
      if (valid) {
        const submitBtn = $('[type="submit"]', form);
        const origText = submitBtn?.textContent;
        if (submitBtn) { submitBtn.textContent = 'Sending…'; submitBtn.disabled = true; }
        setTimeout(() => {
          showToast('Message sent successfully!');
          form.reset();
          if (submitBtn) { submitBtn.textContent = origText; submitBtn.disabled = false; }
        }, 1500);
      }
    });

    $$('[required]', form).forEach(field => {
      on(field, 'input', () => { field.style.borderColor = ''; });
    });
  });
};

/* ── Newsletter ───────────────────────────────────────────── */
const initNewsletter = () => {
  $$('.newsletter-form').forEach(form => {
    on(form, 'submit', e => {
      e.preventDefault();
      const input = $('input', form);
      if (!input?.value.trim()) return;
      if (!/\S+@\S+\.\S+/.test(input.value)) {
        showToast('Please enter a valid email address');
        return;
      }
      showToast('Thank you for subscribing!');
      input.value = '';
    });
  });
};

/* ── Skin Type Tabs ───────────────────────────────────────── */
const initSkinTabs = () => {
  $$('.skin-tab').forEach(tab => {
    on(tab, 'click', () => {
      const group = tab.closest('[data-tab-group]');
      if (!group) return;
      $$('.skin-tab', group).forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      $$('[data-tab-panel]', group).forEach(panel => {
        panel.style.display = panel.dataset.tabPanel === target ? '' : 'none';
      });
    });
  });
};

/* ── Tabs ─────────────────────────────────────────────────── */
const initTabs = () => {
  $$('.tab-btn').forEach(btn => {
    on(btn, 'click', () => {
      const group = btn.closest('[data-tab-group]');
      if (!group) return;
      $$('.tab-btn', group).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tab;
      $$('.tab-panel', group).forEach(p => p.classList.toggle('active', p.dataset.panel === target));
    });
  });
};

/* ── Sticky progress bar ──────────────────────────────────── */
const initReadProgress = () => {
  const bar = $('#readProgress');
  if (!bar) return;
  on(window, 'scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    bar.style.width = `${(window.scrollY / total) * 100}%`;
  }, { passive: true });
};

/* ── Stats Counter ────────────────────────────────────────── */
const initCounters = () => {
  const counters = $$('[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const tick = () => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
      observer.unobserve(el);
    });
  }, { threshold: .5 });
  counters.forEach(el => observer.observe(el));
};

/* ── Image Zoom / Lightbox ────────────────────────────────── */
const initImageZoom = () => {
  $$('[data-zoom]').forEach(img => {
    on(img, 'click', () => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;`;
      const bigImg = document.createElement('img');
      bigImg.src = img.src;
      bigImg.style.cssText = `max-width:90vw;max-height:90vh;object-fit:contain;border-radius:8px;`;
      overlay.appendChild(bigImg);
      document.body.appendChild(overlay);
      on(overlay, 'click', () => overlay.remove());
      on(document, 'keydown', e => { if (e.key === 'Escape') overlay.remove(); }, { once: true });
    });
  });
};

/* ── Cookie Banner ────────────────────────────────────────── */
const initCookies = () => {
  if (store.get('velour-cookies')) return;
  const banner = $('#cookieBanner');
  if (!banner) return;
  setTimeout(() => banner.classList.add('show'), 2000);
  on($('#cookieAccept'), 'click', () => {
    store.set('velour-cookies', true);
    banner.classList.remove('show');
  });
  on($('#cookieDecline'), 'click', () => { banner.classList.remove('show'); });
};

/* ── Countdown Timer ──────────────────────────────────────── */
const initCountdown = () => {
  const end = new Date();
  end.setDate(end.getDate() + 14);
  const tick = () => {
    const now = new Date();
    const diff = end - now;
    if (diff <= 0) return;
    const d = Math.floor(diff / 864e5);
    const h = Math.floor((diff % 864e5) / 36e5);
    const m = Math.floor((diff % 36e5) / 6e4);
    const s = Math.floor((diff % 6e4) / 1e3);
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = String(v).padStart(2, '0'); };
    set('countDays', d); set('countHours', h); set('countMins', m); set('countSecs', s);
  };
  tick();
  setInterval(tick, 1000);
};

/* ── Smooth Page Transitions ──────────────────────────────── */
const initPageTransitions = () => {
  $$('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('http')) return;
    on(link, 'click', e => {
      e.preventDefault();
      const loader = $('#pageLoader');
      if (loader) { loader.classList.remove('hidden'); }
      setTimeout(() => { window.location.href = href; }, 400);
    });
  });
};

/* ── Hover Parallax ───────────────────────────────────────── */
const initParallax = () => {
  $$('[data-parallax]').forEach(el => {
    on(window, 'scroll', () => {
      const rect = el.getBoundingClientRect();
      const speed = parseFloat(el.dataset.parallax) || .3;
      const offset = (window.innerHeight / 2 - rect.top) * speed;
      el.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  });
};

/* ── Quantity Controls ────────────────────────────────────── */
const initQtyControls = () => {
  $$('.qty-btn').forEach(btn => {
    on(btn, 'click', () => {
      const container = btn.closest('.product-qty');
      const valEl = $('.qty-val', container);
      if (!valEl) return;
      let val = parseInt(valEl.textContent, 10);
      if (btn.dataset.dir === '+') val = Math.min(val + 1, 99);
      else val = Math.max(val - 1, 1);
      valEl.textContent = val;
    });
  });
};

/* ── Product Thumb Switcher ───────────────────────────────── */
const initProductThumbs = () => {
  $$('.product-thumb').forEach(thumb => {
    on(thumb, 'click', () => {
      const container = thumb.closest('.product-images');
      $$('.product-thumb', container).forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const main = $('.product-main-image img', container);
      if (main) main.src = thumb.querySelector('img').src;
    });
  });
};

/* ── Mobile nav active on current page ───────────────────── */
const highlightMobileNav = () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  $$('.mobile-nav a').forEach(a => {
    if ((a.getAttribute('href') || '') === path) {
      a.style.color = 'var(--rosewood)';
      a.style.fontWeight = '700';
    }
  });
};

/* ── Init All ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initRTL();
  initNavbar();
  initHeroSlider();
  initTestimonialSlider();
  initScrollReveal();
  initFAQ();
  initQuiz();
  initBackToTop();
  initSearch();
  initAddToCart();
  initCartDrawer();
  initWishlist();
  initForms();
  initNewsletter();
  initFooterYear();
  initSkinTabs();
  initTabs();
  initReadProgress();
  initCounters();
  initImageZoom();
  initCookies();
  initCountdown();
  initQtyControls();
  initProductThumbs();
  highlightMobileNav();
  updateCartBadge();

  // Delayed parallax (avoid layout thrash)
  setTimeout(initParallax, 300);
  // Page transitions last to avoid blocking
  setTimeout(initPageTransitions, 800);

  // Floating particles (Home 2)
  initParticles();
});

/* ── Particle Background ──────────────────────────────────── */
const initParticles = () => {
  const canvas = $('#particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  on(window, 'resize', resize, { passive: true });

  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - .5) * .4,
      dy: (Math.random() - .5) * .4,
      alpha: Math.random() * .5 + .1,
    });
  }

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,166,107,${p.alpha})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  };
  draw();
};

/* ── Footer Year ──────────────────────────────────────────── */
const initFooterYear = () => {
  const el = $('#footerYear');
  if (el) el.textContent = new Date().getFullYear();
};

/* ── Expose globals if needed ─────────────────────────────── */
window.VelourSkin = { showToast, addToCart, store, openCart, closeCart };
