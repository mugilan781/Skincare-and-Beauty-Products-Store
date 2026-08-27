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
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
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
  if (!track) return;
  const slides = $$('.testimonial-slide', track);
  let current  = 0;

  const goTo = idx => {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    $$('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  };

  on($('#testiPrev'), 'click', () => goTo(current - 1));
  on($('#testiNext'), 'click', () => goTo(current + 1));
  $$('.testi-dot').forEach((d, i) => on(d, 'click', () => goTo(i)));

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

/* ── Wishlist ─────────────────────────────────────────────── */
let wishlist = store.get('velour-wishlist') || [];

const initWishlist = () => {
  $$('[data-wishlist]').forEach(btn => {
    const id = btn.dataset.wishlist;
    if (wishlist.includes(id)) btn.classList.add('active');
    on(btn, 'click', () => {
      if (wishlist.includes(id)) {
        wishlist = wishlist.filter(i => i !== id);
        btn.classList.remove('active');
        showToast('Removed from wishlist');
      } else {
        wishlist.push(id);
        btn.classList.add('active');
        showToast('Saved to wishlist');
      }
      store.set('velour-wishlist', wishlist);
    });
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
  initWishlist();
  initForms();
  initNewsletter();
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

/* ── Expose globals if needed ─────────────────────────────── */
window.VelourSkin = { showToast, addToCart, store };
