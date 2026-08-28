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

const getProductImage = (id, name) => {
  const n = (name || id || '').toLowerCase();
  if (n.includes('micellar') || n.includes('rose water') || n.includes('cleanser-2')) return 'assets/images/rose-micellar.jpg';
  if (n.includes('oil balancing') || n.includes('cleanser-3')) return 'assets/images/skincare-routine.jpg';
  if (n.includes('cleanser') || n.includes('foam')) return 'assets/images/cleanser-product.jpg';
  if (n.includes('night') || n.includes('peptide')) return 'assets/images/peptide-night-cream.jpg';
  if (n.includes('moistur') || n.includes('cream') || n.includes('hydrat')) return 'assets/images/moisturizer-product.jpg';
  if (n.includes('24k') || n.includes('gold')) return 'assets/images/gold-24k-mask.jpg';
  if (n.includes('ceramide') || n.includes('sleeping')) return 'assets/images/ceramide-overnight-mask.jpg';
  if (n.includes('mask') || n.includes('clay')) return 'assets/images/facemask-product.jpg';
  if (n.includes('sun') || n.includes('spf') || n.includes('shield')) return 'assets/images/sunscreen-product.jpg';
  if (n.includes('rosehip') || n.includes('oil')) return 'assets/images/rosehip-oil.jpg';
  if (n.includes('routine') || n.includes('bundle') || n.includes('ritual') || n.includes('set')) return 'assets/images/products-flatlay.jpg';
  return 'assets/images/serum-product.jpg';
};

const updateCartBadge = () => {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  $$('.cart-badge').forEach(el => { el.textContent = count; el.style.display = count ? 'flex' : 'none'; });
};

const addToCart = (id, name, price, image) => {
  const imgUrl = image || getProductImage(id, name);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
    if (!existing.image || !existing.image.includes('-product.jpg')) existing.image = imgUrl;
  } else {
    cart.push({ id, name, price: Number(price), image: imgUrl, qty: 1 });
  }
  store.set('velour-cart', cart);
  updateCartBadge();
  showToast(`Added to cart: ${name}`);
};

/* ── Add to Cart Buttons ──────────────────────────────────── */
const initAddToCart = () => {
  on(document, 'click', e => {
    const btn = e.target.closest('[data-add-cart]');
    if (!btn) return;
    e.preventDefault();
    const id    = btn.dataset.addCart;
    const name  = btn.dataset.name  || 'Product';
    const price = btn.dataset.price || '0';
    const image = btn.dataset.image || getProductImage(id, name);
    addToCart(id, name, price, image);
  });
};

/* ── Cart Drawer ─────────────────────────────────────────── */
let cartDrawer, cartOverlay, cartItemsEl, cartFooterEl, cartSubtotalEl, cartCountLabel;

const money = n => '$' + Number(n).toFixed(2);

const openCart = () => {
  if (!cartDrawer) {
    cartDrawer = $('#cartDrawer');
    cartOverlay = $('#cartOverlay');
    cartItemsEl = $('#cartItems');
    cartFooterEl = $('#cartFooter');
    cartSubtotalEl = $('#cartSubtotal');
    cartCountLabel = $('#cartCountLabel');
  }
  renderCart();
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('show');
    cartDrawer.setAttribute('aria-hidden', 'false');
    cartOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
};

const closeCart = () => {
  if (!cartDrawer) return;
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
      <a href="services.html" class="btn btn-outline-dark btn-sm" data-cart-close>Continue Shopping</a>
    </div>`;
    cartFooterEl.style.display = 'none';
    return;
  }
  cartFooterEl.style.display = '';
  cartCountLabel.textContent = `(${cart.reduce((s, i) => s + i.qty, 0)})`;
  cartItemsEl.innerHTML = cart.map(item => {
    let imgPath = item.image;
    if (!imgPath || !imgPath.includes('assets/images/') || imgPath.endsWith('/serum.jpg') || imgPath.endsWith('/cream.jpg') || imgPath.endsWith('/cleanser.jpg')) {
      imgPath = getProductImage(item.id, item.name);
    }
    return `
      <div class="cart-item" data-cart-item="${item.id}" style="display:flex;gap:.85rem;align-items:center;padding:.85rem 0;border-bottom:1px solid var(--border-color)">
        <img src="${imgPath}" alt="${item.name}" style="width:52px;height:52px;border-radius:var(--radius-md);object-fit:cover;flex-shrink:0;border:1px solid var(--border-color);" onerror="this.onerror=null;this.src='assets/images/serum-product.jpg';">
        <div class="cart-item-info" style="flex:1">
          <p class="cart-item-name" style="font-weight:600;font-size:.88rem;margin:0 0 .2rem 0;line-height:1.3">${item.name}</p>
          <p class="cart-item-price" style="font-size:.82rem;color:var(--champagne);margin:0;font-weight:600">${money(item.price)}</p>
        </div>
        <div class="cart-item-actions" style="display:flex;align-items:center;gap:.35rem">
          <div class="qty-control" style="margin:0">
            <button type="button" data-cart-dec aria-label="Decrease">−</button>
            <span class="qty-value">${item.qty}</span>
            <button type="button" data-cart-inc aria-label="Increase">+</button>
          </div>
          <button class="cart-item-remove" data-cart-remove aria-label="Remove item" style="background:none;border:none;color:#E74C3C;cursor:pointer;margin-left:.4rem;padding:2px">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:18px;height:18px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
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
  on(document, 'click', e => { if (e.target.closest('[data-cart-close]')) closeCart(); });
  on(document, 'keydown', e => { if (e.key === 'Escape' && cartDrawer.classList.contains('open')) closeCart(); });

  if (cartItemsEl) {
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
  }

  on(document, 'click', e => {
    const checkoutBtn = e.target.closest('[data-cart-checkout]');
    if (!checkoutBtn) return;
    e.preventDefault();
    const currentCart = store.get('velour-cart') || [];
    if (!currentCart.length) { showToast('Your cart is empty'); return; }
    closeCart();
    window.location.href = 'checkout.html';
  });
};

/* ── Checkout Page Logic ──────────────────────────────────── */
const initCheckout = () => {
  const checkoutForm = $('#checkoutForm');
  if (!checkoutForm) return;

  let appliedDiscountRate = 0;
  let currentShippingCost = 0;

  const renderCheckout = () => {
    const currentCart = store.get('velour-cart') || [];
    const countEl = $('#checkoutCartCount');
    const itemsEl = $('#checkoutCartItems');
    const subtotalEl = $('#summarySubtotal');
    const discountEl = $('#summaryDiscount');
    const discountRow = $('#discountRow');
    const shippingEl = $('#summaryShipping');
    const taxEl = $('#summaryTax');
    const totalEl = $('#summaryTotal');

    const totalCount = currentCart.reduce((sum, item) => sum + item.qty, 0);
    if (countEl) countEl.textContent = totalCount;

    if (!itemsEl) return;

    if (!currentCart.length) {
      itemsEl.innerHTML = `
        <div style="text-align:center;padding:2rem 1rem">
          <p style="color:var(--text-secondary);font-size:.9rem;margin-bottom:1rem">Your cart is empty.</p>
          <a href="services.html" class="btn btn-outline-dark btn-sm">Shop Skincare</a>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '$0.00';
      if (shippingEl) shippingEl.textContent = 'FREE';
      if (taxEl) taxEl.textContent = '$0.00';
      if (totalEl) totalEl.textContent = '$0.00';
      return;
    }

    itemsEl.innerHTML = currentCart.map(item => {
      let imgPath = item.image;
      if (!imgPath || !imgPath.includes('assets/images/') || imgPath.endsWith('/serum.jpg') || imgPath.endsWith('/cream.jpg') || imgPath.endsWith('/cleanser.jpg')) {
        imgPath = getProductImage(item.id, item.name);
      }
      return `
        <div class="checkout-item" data-checkout-id="${item.id}" style="display:flex;align-items:center;gap:1rem;padding-block:.85rem;border-bottom:1px solid var(--border-color)">
          <img src="${imgPath}" alt="${item.name}" class="checkout-item-img" style="width:56px;height:56px;border-radius:var(--radius-md);object-fit:cover;flex-shrink:0;border:1px solid var(--border-color);" onerror="this.onerror=null;this.src='assets/images/serum-product.jpg';">
          <div class="checkout-item-details" style="flex:1">
            <div class="checkout-item-title" style="font-weight:600;font-size:.88rem;margin-bottom:.2rem;line-height:1.3">${item.name}</div>
            <div class="checkout-item-price" style="font-size:.82rem;color:var(--champagne);font-weight:600">$${Number(item.price).toFixed(2)} × ${item.qty}</div>
          </div>
          <div style="font-weight:700;font-size:.95rem;color:var(--text-primary)">$${(Number(item.price) * item.qty).toFixed(2)}</div>
        </div>
      `;
    }).join('');

    const subtotal = currentCart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
    const discount = subtotal * appliedDiscountRate;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * 0.05;
    const grandTotal = taxableAmount + tax + currentShippingCost;

    if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
    if (discountRow) {
      if (appliedDiscountRate > 0) {
        discountRow.style.display = 'flex';
        if (discountEl) discountEl.textContent = '-$' + discount.toFixed(2);
      } else {
        discountRow.style.display = 'none';
      }
    }
    if (shippingEl) {
      shippingEl.textContent = currentShippingCost === 0 ? 'FREE' : '$' + currentShippingCost.toFixed(2);
    }
    if (taxEl) taxEl.textContent = '$' + tax.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + grandTotal.toFixed(2);
  };

  renderCheckout();

  // Shipping Radios
  $$('input[name="shippingMethod"]').forEach(radio => {
    on(radio, 'change', () => {
      $$('.shipping-option-card').forEach(card => card.classList.remove('selected'));
      radio.closest('.shipping-option-card').classList.add('selected');
      currentShippingCost = Number(radio.value);
      renderCheckout();
    });
  });

  // Payment Tabs
  $$('[data-pay-tab]').forEach(tab => {
    on(tab, 'click', () => {
      $$('[data-pay-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const payType = tab.dataset.payTab;
      const cardForm = $('#cardPaymentForm');
      const altNote = $('#altPaymentNote');
      const altName = $('#altPaymentName');
      if (payType === 'card') {
        if (cardForm) cardForm.style.display = 'block';
        if (altNote) altNote.style.display = 'none';
      } else {
        if (cardForm) cardForm.style.display = 'none';
        if (altNote) altNote.style.display = 'block';
        if (altName) altName.textContent = payType === 'paypal' ? 'PayPal' : 'Apple Pay';
      }
    });
  });

  // Promo Code
  const applyPromoBtn = $('#applyPromoBtn');
  if (applyPromoBtn) {
    on(applyPromoBtn, 'click', () => {
      const code = ($('#promoInput').value || '').trim().toUpperCase();
      const msgEl = $('#promoMessage');
      if (code === 'VELOUR10') {
        appliedDiscountRate = 0.10;
        msgEl.style.color = '#27AE60';
        msgEl.textContent = '10% Promo discount applied!';
      } else if (code === 'WELCOME20') {
        appliedDiscountRate = 0.20;
        msgEl.style.color = '#27AE60';
        msgEl.textContent = '20% Welcome discount applied!';
      } else if (code === 'FREESHIP') {
        currentShippingCost = 0;
        msgEl.style.color = '#27AE60';
        msgEl.textContent = 'Free shipping applied!';
      } else {
        appliedDiscountRate = 0;
        msgEl.style.color = '#E74C3C';
        msgEl.textContent = 'Invalid promo code. Try VELOUR10 or WELCOME20';
      }
      renderCheckout();
    });
  }

  // Form Submit / Order Place
  on(checkoutForm, 'submit', e => {
    e.preventDefault();
    const currentCart = store.get('velour-cart') || [];
    if (!currentCart.length) {
      showToast('Your cart is empty. Add products before checking out.');
      return;
    }

    const email = ($('#checkout-email').value || '').trim();
    const fname = ($('#ship-fname').value || '').trim();
    const address = ($('#ship-address').value || '').trim();
    const suite = ($('#ship-suite') ? $('#ship-suite').value : '').trim();
    const city = ($('#ship-city') ? $('#ship-city').value : '').trim();
    const state = ($('#ship-state') ? $('#ship-state').value : '').trim();
    const zip = ($('#ship-zip') ? $('#ship-zip').value : '').trim();

    if (!email || !fname || !address) {
      showToast('Please fill in all required fields.');
      return;
    }

    const fullAddress = [address, suite, city, state, zip].filter(Boolean).join(', ') || address;

    const btn = $('#placeOrderBtn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Processing Order…';
    }

    setTimeout(() => {
      const orderId = 'VS-' + Math.floor(100000 + Math.random() * 900000);
      const modal = $('#orderSuccessModal');
      const totalEl = $('#summaryTotal');

      if ($('#successOrderId')) $('#successOrderId').textContent = '#' + orderId;
      if ($('#successAddress')) $('#successAddress').textContent = fullAddress;
      if ($('#successTotalPaid') && totalEl) $('#successTotalPaid').textContent = totalEl.textContent;

      // Clear cart
      store.set('velour-cart', []);
      cart = [];
      updateCartBadge();

      if (modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
      }

      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Order Placed!';
      }

      showToast(`Order ${orderId} confirmed!`);
    }, 900);
  });
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
  initBlogDetails();
  initCheckout();

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

/* ── Blog Details System ──────────────────────────────────── */
const BLOG_DATA = {
  'morning-skincare-ritual': {
    id: 'morning-skincare-ritual',
    title: 'The Ultimate Morning Skincare Ritual for Radiant, Glowing Skin',
    tag: 'Routines',
    date: 'August 20, 2026',
    readTime: '8 min read',
    author: 'Dr. Elena Rossi',
    authorRole: 'Board-certified dermatologist & Founder',
    authorBio: 'Board-certified dermatologist and VelourSkin founder. PhD in Cosmetic Chemistry, former clinical researcher at the University of Florence Institute of Dermatology.',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    heroImage: 'assets/images/blog-hero.jpg',
    excerpt: 'Your morning routine sets the tone for the entire day. We walk you through the optimal 6-step ritual with our favourite products, layering secrets and pro tips from our Chief Formulator.',
    products: [
      { id: 'cleanser-blog', name: 'Gentle Foam Cleanser', price: 42, image: 'assets/images/cleanser-product.jpg' },
      { id: 'serum-blog', name: 'Vitamin C Serum', price: 68, image: 'assets/images/serum-product.jpg' },
      { id: 'moist-blog', name: 'Hyaluronic Cream', price: 78, image: 'assets/images/moisturizer-product.jpg' },
      { id: 'spf-blog', name: 'Mineral SPF 50', price: 52, image: 'assets/images/sunscreen-product.jpg' }
    ],
    content: `
      <p>Your morning begins before the alarm sounds. Your skin has been working overnight — repairing damage, producing collagen, renewing cells. By the time you wake up, it's primed and ready to receive your skincare ritual.</p>
      <p>But what exactly is the optimal morning ritual? What goes first? Why does the order matter? And which products will genuinely transform your skin versus simply taking up space on your vanity?</p>
      <blockquote>Your morning ritual isn't about vanity — it's about giving your skin the tools it needs to protect you all day long.</blockquote>
      <h2>Step 1: Cleanse — But Gently</h2>
      <p>Unless you've been sweating heavily overnight, your morning cleanse should be gentle. We recommend a foam cleanser with micellar micelles that lift any nighttime product residue without stripping skin's natural oils. Your skin barrier starts here.</p>
      <img src="assets/images/cleanser-product.jpg" alt="Gentle Botanical Foam Cleanser" loading="lazy">
      <p>Lukewarm water only — hot water disrupts the moisture barrier and causes capillary dilation over time. Massage for 60 seconds in circular upward motions. Rinse thoroughly. Pat (never rub) dry.</p>
      <h2>Step 2: Vitamin C Serum — Your Armour</h2>
      <p>Vitamin C in the morning is non-negotiable for anyone serious about skin health. Applied before moisturiser and SPF, it creates an antioxidant shield that neutralises free radicals from UV exposure and environmental pollution throughout the day.</p>
      <img src="assets/images/serum-product.jpg" alt="Vitamin C Brightening Serum" loading="lazy">
      <p>Use 3–4 drops of our Vitamin C Brightening Serum (15% L-Ascorbic Acid). Apply to slightly damp skin — this enhances absorption. Allow 60 seconds to absorb before proceeding. You may feel a slight warmth — that's the Vitamin C activating on contact with skin.</p>
      <h2>Step 3: Hyaluronic Acid — Hydration Lock</h2>
      <p>While skin is still slightly damp, apply your Hyaluronic Acid Serum. HA is a humectant — it draws moisture from the air into the skin. Our multi-weight formula contains three different molecular sizes: low-weight for deep penetration, medium for mid-layers, and high-weight for surface barrier reinforcement.</p>
      <h2>Step 4: Moisturiser — Seal It In</h2>
      <p>A lightweight yet nourishing moisturiser seals in everything you've applied beneath it. Look for ceramides, peptides, and niacinamide in your morning formula. These ingredients support the skin barrier while providing anti-aging and brightening benefits.</p>
      <img src="assets/images/moisturizer-product.jpg" alt="Hyaluronic Hydrating Cream" loading="lazy">
      <h2>Step 5: SPF — The Most Important Step</h2>
      <p>If you do one thing after reading this, make it SPF. Mineral SPF 50 should be the final step in your morning routine, every single day, regardless of weather. UV damage is cumulative, accounts for 80% of visible aging, and is entirely preventable.</p>
      <blockquote>SPF is the best anti-aging product ever created. There is nothing in our entire range that outperforms daily sun protection. — Dr. Elena Rossi</blockquote>
      <h2>Your Complete Morning Ritual Summary</h2>
      <p>To summarise your optimal morning routine: Cleanser → Vitamin C Serum → Hyaluronic Acid → Moisturiser → SPF. This 5-step ritual takes approximately 8 minutes and delivers comprehensive skin protection, hydration, and brightening benefits that compound over weeks and months.</p>
      <p>Consistency is everything. A simple, well-formulated routine performed consistently will always outperform an elaborate routine followed sporadically.</p>
    `
  },
  'vit-c-guide': {
    id: 'vit-c-guide',
    title: 'The Definitive Guide to Vitamin C Serums: Concentrations & Results',
    tag: 'Ingredients',
    date: 'August 15, 2026',
    readTime: '6 min read',
    author: 'Dr. Elena Rossi',
    authorRole: 'Board-certified dermatologist & Founder',
    authorBio: 'Board-certified dermatologist and VelourSkin founder. PhD in Cosmetic Chemistry, former clinical researcher at the University of Florence Institute of Dermatology.',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    heroImage: 'assets/images/serum-product.jpg',
    excerpt: 'Not all Vitamin C is created equal. We break down L-Ascorbic Acid science, stability challenges, and choosing the right formula.',
    products: [
      { id: 'serum-blog', name: 'Vitamin C Brightening Serum', price: 68, image: 'assets/images/serum-product.jpg' },
      { id: 'cleanser-blog', name: 'Gentle Foam Cleanser', price: 42, image: 'assets/images/cleanser-product.jpg' },
      { id: 'spf-blog', name: 'Mineral SPF 50', price: 52, image: 'assets/images/sunscreen-product.jpg' }
    ],
    content: `
      <p>Vitamin C is heralded as the holy grail of skincare ingredients, promised to brighten dull complexions, fade stubborn hyperpigmentation, and stimulate collagen production. But with hundreds of formulations on the market ranging from 5% to 30%, how do you select the right one?</p>
      <p>In this scientific guide, we demystify the biochemistry of topical L-Ascorbic Acid, evaluate popular C derivatives, and show you how to maximize stability and skin bioavailability.</p>
      <blockquote>True Vitamin C efficacy depends on three key formulation factors: acidic pH (below 3.5), optimal concentration (10%-20%), and synergistic antioxidants like Ferulic Acid.</blockquote>
      <h2>L-Ascorbic Acid vs. Vitamin C Derivatives</h2>
      <p>Pure L-Ascorbic Acid is the most biologically active form of Vitamin C. It directly neutralizes reactive oxygen species (ROS) and inhibits tyrosinase, the key enzyme responsible for melanin production. However, L-Ascorbic Acid is notoriously unstable and degrades quickly when exposed to air, light, or water.</p>
      <img src="assets/images/serum-product.jpg" alt="Vitamin C Serum Bio-Availability" loading="lazy">
      <p>Lipid-soluble derivatives such as Tetrahexyldecyl (THD) Ascorbate offer remarkable stability and gentle delivery for reactive skin types. While milder, they convert into active L-Ascorbic Acid within skin cells over time, delivering sustained antioxidant defense.</p>
      <h2>Finding the Golden Concentration Window</h2>
      <p>Dermatological research shows that topical Vitamin C absorption peaks at a 20% concentration. Concentrations below 10% yield significantly slower tone brightening, while concentrations exceeding 20% cause tissue saturation and heightened irritation without boosting results.</p>
      <h2>How to Spot Oxidized Serum & Storage Tips</h2>
      <p>Fresh Vitamin C serum should range from crystal clear to pale champagne in hue. If your serum turns dark amber or brown, it has fully oxidized into Dehydroascorbic Acid and loses its protective potency. Store your bottle in a cool, dark drawer or cosmetic fridge to preserve active potency.</p>
    `
  },
  'hyaluronic-acid-guide': {
    id: 'hyaluronic-acid-guide',
    title: 'Hyaluronic Acid: Why Molecular Weight Matters More Than You Think',
    tag: 'Skin Science',
    date: 'August 10, 2026',
    readTime: '5 min read',
    author: 'Marcus Vance',
    authorRole: 'Lead Formulation Chemist',
    authorBio: 'Lead Formulation Chemist with 14+ years of bio-cosmetic development experience specializing in transdermal hydration delivery.',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    heroImage: 'assets/images/moisturizer-product.jpg',
    excerpt: 'Single-weight HA only scratches the surface. We explain how our multi-weight formula reaches every layer for lasting hydration.',
    products: [
      { id: 'moist-blog', name: 'Hyaluronic Hydrating Cream', price: 78, image: 'assets/images/moisturizer-product.jpg' },
      { id: 'serum-blog', name: 'Vitamin C Serum', price: 68, image: 'assets/images/serum-product.jpg' }
    ],
    content: `
      <p>Hyaluronic Acid (HA) has become a household name in modern skincare, celebrated for its extraordinary capacity to bind up to 1,000 times its weight in water. Yet, many users notice that high-concentration HA serums sometimes leave their skin feeling tighter or drier. Why does this happen?</p>
      <p>The secret lies in molecular weight distribution. Using a single molecular weight of Hyaluronic Acid only hydrates the outermost surface layer, leaving lower epidermal layers parched.</p>
      <blockquote>Applying single-weight high molecular HA in dry ambient air without an occlusive top layer can draw moisture upward out of the dermis, causing paradox rebound dryness.</blockquote>
      <h2>The Three Molecular Tiers of HA</h2>
      <p>Our formulation lab combines three distinct molecular sizes for multi-depth cellular hydration:</p>
      <ul>
        <li><strong>High Molecular Weight (1500+ kDa):</strong> Forms an invisible, breathable matrix over the skin surface to seal moisture and shield against environmental pollutants.</li>
        <li><strong>Medium Molecular Weight (500–1000 kDa):</strong> Penetrates into the upper stratum corneum to instantly smooth fine dehydrations lines and refine texture.</li>
        <li><strong>Micro Molecular Weight (&lt; 50 kDa):</strong> Travels into deeper epidermal layers to boost natural mucopolysaccharides and maintain cellular elasticity.</li>
      </ul>
      <img src="assets/images/moisturizer-product.jpg" alt="Multi-Weight Hyaluronic Acid Technology" loading="lazy">
      <h2>The Golden Rule: Damp Skin Application</h2>
      <p>Hyaluronic Acid acts like a biological sponge. To work effectively, it requires water to pull into the skin. Always apply HA serums immediately after cleansing or misting while skin remains damp. Immediately follow with a lipid cream to lock moisture in place.</p>
    `
  },
  'clay-mask-guide': {
    id: 'clay-mask-guide',
    title: 'How to Use a Clay Mask Without Destroying Your Skin Barrier',
    tag: 'Routines',
    date: 'August 5, 2026',
    readTime: '5 min read',
    author: 'Sophia Lin',
    authorRole: 'Senior Esthetician',
    authorBio: 'Senior Esthetician & Spa Director at VelourSkin Flagship Sanctuary, with expertise in botanical detox treatments.',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    heroImage: 'assets/images/facemask-product.jpg',
    excerpt: 'Clay masks are powerful — but misused, they strip essential moisture. Learn the proper application technique and post-mask care.',
    products: [
      { id: 'mask-blog', name: 'French Pink Clay Detox Mask', price: 58, image: 'assets/images/facemask-product.jpg' },
      { id: 'moist-blog', name: 'Hyaluronic Hydrating Cream', price: 78, image: 'assets/images/moisturizer-product.jpg' },
      { id: 'cleanser-blog', name: 'Gentle Foam Cleanser', price: 42, image: 'assets/images/cleanser-product.jpg' }
    ],
    content: `
      <p>Clay treatments have been used for centuries to detoxify pores, draw out impurities, and balance excess sebum production. However, a major misconception persists: letting clay masks dry completely until they crack and turn powdery white.</p>
      <p>When clay completely dries on skin, it pulls out vital intracellular lipids and water, inducing micro-inflammation and triggering reactive oil production.</p>
      <blockquote>A clay mask should always be rinsed off while it still feels damp and tacky. Never wait until it cracks and flakes!</blockquote>
      <h2>The Three Phases of Clay Masking</h2>
      <p>Mastering the timing of clay application ensures maximum pore detox without compromising barrier integrity:</p>
      <ol>
        <li><strong>Damp Phase:</strong> The skin absorbs essential minerals such as silica, calcium, and magnesium from natural pink kaolin and bentonite.</li>
        <li><strong>Tacky Phase:</strong> The clay gently contracts, drawing out pore congestion and stimulating capillary microcirculation. <em>Rinse off right now!</em></li>
        <li><strong>Bone-Dry Phase:</strong> The clay sucks moisture from deep cellular layers, producing redness and tightness.</li>
      </ol>
      <img src="assets/images/facemask-product.jpg" alt="French Pink Clay Treatment" loading="lazy">
      <h2>Post-Mask Care Routine</h2>
      <p>Rinse gently using lukewarm water and a soft cotton cloth. Follow immediately with a soothing, ceramide-rich moisturizer to replenish lipid levels. Limit clay mask usage to 1–2 times weekly for combination/oily skin, and once bi-weekly for sensitive skin.</p>
    `
  },
  'sunscreen-guide': {
    id: 'sunscreen-guide',
    title: 'Mineral vs. Chemical Sunscreen: Which is Actually Better for You?',
    tag: 'Skin Science',
    date: 'July 28, 2026',
    readTime: '7 min read',
    author: 'Dr. Elena Rossi',
    authorRole: 'Board-certified dermatologist & Founder',
    authorBio: 'Board-certified dermatologist and VelourSkin founder. PhD in Cosmetic Chemistry, former clinical researcher at the University of Florence Institute of Dermatology.',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    heroImage: 'assets/images/sunscreen-product.jpg',
    excerpt: 'We settle the debate once and for all with an evidence-based comparison of ingredients, efficacy, and skin compatibility.',
    products: [
      { id: 'spf-blog', name: 'Mineral SPF 50', price: 52, image: 'assets/images/sunscreen-product.jpg' },
      { id: 'serum-blog', name: 'Vitamin C Brightening Serum', price: 68, image: 'assets/images/serum-product.jpg' }
    ],
    content: `
      <p>Sun protection is non-negotiable for maintaining healthy, youthful skin. Yet consumers are often caught between two distinct technology choices: mineral (physical) sunscreens and chemical (organic) sunscreens.</p>
      <p>Here, we provide an evidence-based comparison of active ingredient mechanisms, UV filter stability, skin sensitivity factors, and environmental safety profiles.</p>
      <blockquote>Mineral sunscreens use non-nano Zinc Oxide to create a physical mirror on top of the skin that immediately reflects broad-spectrum UVA and UVB rays.</blockquote>
      <h2>Understanding Mineral Active Filters</h2>
      <p>Mineral formulas rely on active minerals such as Zinc Oxide and Titanium Dioxide. Sitting on the epidermis, they reflect and scatter ultraviolet rays away from the skin surface instantly upon application without requiring absorption time.</p>
      <img src="assets/images/sunscreen-product.jpg" alt="Mineral Invisible Defense SPF 50" loading="lazy">
      <h2>Understanding Chemical Active Filters</h2>
      <p>Chemical sunscreens utilize organic carbon compounds like Avobenzone, Octisalate, and Homosalate. These ingredients absorb into the top layers of skin, convert incoming UV radiation into heat energy, and dissipate that heat from the body.</p>
      <h2>Which One Is Right For Your Skin?</h2>
      <p>For sensitive, acne-prone, or redness-prone skin, mineral Zinc Oxide is dermatologically superior. Zinc Oxide naturally calms skin inflammation, provides broad-spectrum protection against blue light, and carries zero risk of chemical heat irritation.</p>
    `
  },
  'retinol-guide': {
    id: 'retinol-guide',
    title: 'Retinol for Beginners: Starting Slow, Going Strong',
    tag: 'Ingredients',
    date: 'July 20, 2026',
    readTime: '7 min read',
    author: 'Marcus Vance',
    authorRole: 'Lead Formulation Chemist',
    authorBio: 'Lead Formulation Chemist with 14+ years of bio-cosmetic development experience specializing in transdermal hydration delivery.',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    heroImage: 'assets/images/ingredients-botanical.jpg',
    excerpt: 'Retinol is scientifically proven for anti-aging. But starting incorrectly causes irritation. Here is your fail-proof beginner plan.',
    products: [
      { id: 'retinol-blog', name: 'Encapsulated Night Retinol Elixir', price: 84, image: 'assets/images/ingredients-botanical.jpg' },
      { id: 'moist-blog', name: 'Hyaluronic Hydrating Cream', price: 78, image: 'assets/images/moisturizer-product.jpg' },
      { id: 'cleanser-blog', name: 'Gentle Foam Cleanser', price: 42, image: 'assets/images/cleanser-product.jpg' }
    ],
    content: `
      <p>Retinol remains the gold standard in clinical dermatology for reversing visible signs of aging. Backed by decades of peer-reviewed research, Vitamin A derivatives accelerate cell turnover, boost collagen production, refine pores, and diminish hyperpigmentation.</p>
      <p>However, rushing into high concentrations can trigger redness, flaking, and barrier breakdown — known as retinization. Following a structured introduction protocol ensures smooth, radiant results.</p>
      <blockquote>Patience is paramount. Retinol reorganizes dermal architecture at a cellular level, with optimal visible refinement appearing between 8 to 12 weeks.</blockquote>
      <h2>The "Sandwich Technique" for Sensitive Skin</h2>
      <p>To cushion skin against potential dryness while maintaining full efficacy, adopt the sandwich method:</p>
      <ol>
        <li>Cleanse skin and apply a layer of gentle moisturizer.</li>
        <li>Wait 5 minutes for skin to dry completely, then apply a pea-sized amount of retinol serum.</li>
        <li>Seal with a second layer of nourishing lipid cream.</li>
      </ol>
      <img src="assets/images/ingredients-botanical.jpg" alt="Encapsulated Retinol Delivery" loading="lazy">
      <h2>Gradual Frequency Ramp-Up Schedule</h2>
      <p>Begin by applying retinol once weekly for two weeks. If no redness occurs, progress to twice weekly for weeks three and four. By week five, transition to every other night. Always restrict retinol to night use and apply broad-spectrum SPF 50 daily.</p>
    `
  },
  'evening-ritual-guide': {
    id: 'evening-ritual-guide',
    title: 'The Art of the Evening Ritual: A Sensory Guide to Night Skincare',
    tag: 'Lifestyle',
    date: 'July 15, 2026',
    readTime: '6 min read',
    author: 'Sophia Lin',
    authorRole: 'Senior Esthetician',
    authorBio: 'Senior Esthetician & Spa Director at VelourSkin Flagship Sanctuary, with expertise in botanical detox treatments.',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    heroImage: 'assets/images/skincare-routine.jpg',
    excerpt: 'Your evening routine isn\'t just skincare — it\'s self-care. Transform your nightly ritual into a practice that nourishes mind & skin.',
    products: [
      { id: 'cleanser-blog', name: 'Gentle Foam Cleanser', price: 42, image: 'assets/images/cleanser-product.jpg' },
      { id: 'moist-blog', name: 'Hyaluronic Hydrating Cream', price: 78, image: 'assets/images/moisturizer-product.jpg' },
      { id: 'mask-blog', name: 'French Pink Clay Mask', price: 58, image: 'assets/images/facemask-product.jpg' }
    ],
    content: `
      <p>While morning routines shield skin from daytime environmental aggressors, your evening ritual is dedicated to deep purification, restoration, and circadian repair.</p>
      <p>As you sleep, cutaneous blood flow increases, dermal cell mitosis peaks, and skin barrier permeability elevates. Establishing an intentional night ritual aligns your skincare with your natural sleep cycle.</p>
      <blockquote>Nighttime cellular renewal occurs at double its daytime rate. Your evening ritual maximizes this restorative window.</blockquote>
      <h2>Step 1: The Transformative Double Cleanse</h2>
      <p>Dissolve SPF, excess sebum, and environmental micro-particulates with an oil cleanser or balm, followed by a soothing micellar foam cleanser. This clears pores thoroughly without stripping natural protective moisture.</p>
      <img src="assets/images/skincare-routine.jpg" alt="Sensory Evening Skincare Ritual" loading="lazy">
      <h2>Step 2: Restorative Lymphatic Facial Massage</h2>
      <p>Spend 2 minutes using upward facial massage strokes while applying your evening cream or botanical facial oil. Facial massage relieves jaw tension, promotes lymphatic drainage, and boosts skin oxygenation for a rested morning glow.</p>
    `
  }
};

const initBlogDetails = () => {
  const titleEl = $('#detailTitle');
  if (!titleEl) return;

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id') || 'morning-skincare-ritual';
  const post = BLOG_DATA[postId] || BLOG_DATA['morning-skincare-ritual'];

  // Update Page Title
  document.title = `${post.title} — VelourSkin Journal`;

  // Meta info
  const tagEl = $('#detailTag');
  if (tagEl) tagEl.textContent = post.tag;

  const dateEl = $('#detailDate');
  if (dateEl) dateEl.textContent = post.date;

  const readTimeEl = $('#detailReadTime');
  if (readTimeEl) readTimeEl.textContent = post.readTime;

  // Breadcrumb
  const breadcrumbEl = $('#detailBreadcrumb');
  if (breadcrumbEl) breadcrumbEl.textContent = post.title.split(':')[0] || post.title;

  // Main Title (H1)
  if (titleEl) {
    if (post.title.includes(':')) {
      const parts = post.title.split(':');
      titleEl.innerHTML = `${parts[0]}: <em>${parts.slice(1).join(':')}</em>`;
    } else {
      titleEl.innerHTML = post.title;
    }
  }

  // Hero Author Pill
  const heroAvatar = $('#detailHeroAuthorAvatar');
  if (heroAvatar) {
    heroAvatar.src = post.authorAvatar;
    heroAvatar.alt = post.author;
  }

  const heroAuthorName = $('#detailHeroAuthorName');
  if (heroAuthorName) heroAuthorName.textContent = post.author;

  const heroAuthorRole = $('#detailHeroAuthorRole');
  if (heroAuthorRole) heroAuthorRole.textContent = post.authorRole;

  // Main Content
  const contentEl = $('#detailContent');
  if (contentEl) {
    contentEl.innerHTML = post.content;
  }

  // Author Bio at bottom of article
  const authorAvatarEl = $('#detailAuthorAvatar');
  if (authorAvatarEl) {
    authorAvatarEl.src = post.authorAvatar;
    authorAvatarEl.alt = post.author;
  }

  const authorNameEl = $('#detailAuthorName');
  if (authorNameEl) authorNameEl.textContent = post.author;

  const authorBioEl = $('#detailAuthorBio');
  if (authorBioEl) authorBioEl.textContent = post.authorBio;

  // Sidebar Products ("Shop This Ritual")
  const sidebarProductsEl = $('#detailSidebarProducts');
  if (sidebarProductsEl && post.products) {
    sidebarProductsEl.innerHTML = post.products.map(prod => `
      <div style="display:flex;gap:1rem;align-items:center;">
        <img src="${prod.image}" alt="${prod.name}" style="width:56px;height:56px;border-radius:var(--radius-md);object-fit:cover;flex-shrink:0;">
        <div>
          <div style="font-size:.82rem;font-weight:600;">${prod.name}</div>
          <div style="font-size:.78rem;color:var(--champagne);">$${prod.price}</div>
        </div>
        <button class="btn btn-primary btn-sm" style="margin-left:auto;flex-shrink:0" data-add-cart="${prod.id}" data-name="${prod.name}" data-price="${prod.price}">+</button>
      </div>
    `).join('') + `<a href="services.html" class="btn btn-secondary" style="justify-content:center;margin-top:.5rem">Shop All Products</a>`;
  }

  // Related Articles Sidebar
  const sidebarRelatedEl = $('#detailSidebarRelated');
  if (sidebarRelatedEl) {
    const otherKeys = Object.keys(BLOG_DATA).filter(k => k !== post.id);
    const relatedKeys = otherKeys.slice(0, 3);
    sidebarRelatedEl.innerHTML = relatedKeys.map(k => {
      const rel = BLOG_DATA[k];
      return `
        <a href="blog-details.html?id=${rel.id}" style="display:flex;gap:1rem;align-items:center;transition:opacity .3s" onmouseover="this.style.opacity='.7'" onmouseout="this.style.opacity=''">
          <img src="${rel.heroImage}" alt="${rel.title}" style="width:56px;height:56px;border-radius:var(--radius-md);object-fit:cover;flex-shrink:0;">
          <div>
            <div style="font-size:.82rem;font-weight:600;line-height:1.3">${rel.title}</div>
            <div style="font-size:.72rem;color:var(--text-secondary)">${rel.readTime}</div>
          </div>
        </a>
      `;
    }).join('');
  }

  // Bottom Grid ("More from the Journal")
  const bottomGridEl = $('#detailBottomGrid');
  if (bottomGridEl) {
    const otherKeys = Object.keys(BLOG_DATA).filter(k => k !== post.id);
    const bottomKeys = otherKeys.slice(0, 3);
    bottomGridEl.innerHTML = bottomKeys.map((k, idx) => {
      const bItem = BLOG_DATA[k];
      return `
        <article class="blog-card revealed reveal-delay-${(idx % 3) + 1}">
          <div class="blog-card-image">
            <a href="blog-details.html?id=${bItem.id}">
              <img src="${bItem.heroImage}" alt="${bItem.title}" loading="lazy">
            </a>
          </div>
          <div class="blog-card-body">
            <div class="blog-card-meta"><span class="blog-card-tag">${bItem.tag}</span><span class="blog-card-date">${bItem.date}</span></div>
            <h3 class="blog-card-title"><a href="blog-details.html?id=${bItem.id}">${bItem.title}</a></h3>
            <a href="blog-details.html?id=${bItem.id}" class="blog-card-readmore">Read Story <span>→</span></a>
          </div>
        </article>
      `;
    }).join('');
  }
};

/* ── Expose globals if needed ─────────────────────────────── */
window.VelourSkin = { showToast, addToCart, store, openCart, closeCart, BLOG_DATA, initBlogDetails };


