/* ═══════════════════════════════════════════════════════════════
   LA CHINAMPA MEXICAN FOOD – script.js
   ══════════════════════════════════════════════════════════════ */

/* ─── LANGUAGE SYSTEM ─────────────────────────────────────────── */
let currentLang = 'en';

function toggleLang() {
  currentLang = currentLang === 'en' ? 'es' : 'en';
  const btn = document.getElementById('lang-label');
  btn.textContent = currentLang === 'en' ? '🌐 ES' : '🌐 EN';
  applyLang(currentLang);
}

function applyLang(lang) {
  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang) || el.textContent;
  });
  // Update html lang attribute
  document.documentElement.lang = lang;
}

/* ─── NAV SCROLL ──────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

/* ─── MOBILE MENU ─────────────────────────────────────────────── */
function toggleMenu() {
  const links = document.getElementById('nav-links');
  const burger = document.getElementById('burger');
  links.classList.toggle('open');
  burger.classList.toggle('open');
}

function closeMenu() {
  document.getElementById('nav-links').classList.remove('open');
  document.getElementById('burger').classList.remove('open');
}

/* Close menu when clicking outside */
document.addEventListener('click', (e) => {
  const nav = document.getElementById('nav-links');
  const burger = document.getElementById('burger');
  if (nav.classList.contains('open') && !nav.contains(e.target) && !burger.contains(e.target)) {
    closeMenu();
  }
});

/* ─── AUDIO PLAYER ────────────────────────────────────────────── */
let audioPlaying = false;

function toggleAudio() {
  const audio = document.getElementById('bg-audio');
  const icon = document.getElementById('audio-icon');
  if (audioPlaying) {
    audio.pause();
    icon.className = 'fas fa-music';
    audioPlaying = false;
  } else {
    audio.play().catch(() => {
      console.log('Audio autoplay blocked by browser. User interaction required.');
    });
    icon.className = 'fas fa-pause';
    audioPlaying = true;
  }
}

/* ─── CAROUSEL ────────────────────────────────────────────────── */
const TOTAL_SLIDES = 6;
let currentSlide = 0;
let autoPlayInterval = null;

function updateCarousel() {
  const track = document.getElementById('carousel-track');
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  // Update dots
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % TOTAL_SLIDES;
  updateCarousel();
  resetAutoPlay();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + TOTAL_SLIDES) % TOTAL_SLIDES;
  updateCarousel();
  resetAutoPlay();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
  resetAutoPlay();
}

function startAutoPlay() {
  autoPlayInterval = setInterval(nextSlide, 4000);
}

function resetAutoPlay() {
  if (autoPlayInterval) clearInterval(autoPlayInterval);
  startAutoPlay();
}

function buildDots() {
  const dotsContainer = document.getElementById('carousel-dots');
  for (let i = 0; i < TOTAL_SLIDES; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  }
}

/* Touch / swipe support */
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('DOMContentLoaded', () => {
  buildDots();
  startAutoPlay();

  const carousel = document.getElementById('main-carousel');
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (document.getElementById('lightbox').classList.contains('open')) {
      if (e.key === 'ArrowRight') lightboxNext();
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'Escape') closeLightbox();
    }
  });
});

/* ─── LIGHTBOX ────────────────────────────────────────────────── */
const lightboxImages = [
  { src: 'assets/img/coco.jpg',    caption: 'The Spirit of La Chinampa' },
  { src: 'assets/img/fachada.jpeg', caption: 'Our Restaurant' },
  { src: 'assets/img/food1.jpeg',   caption: 'Traditional Flavors' },
  { src: 'assets/img/food2.jpeg',   caption: 'Fresh Ingredients' },
  { src: 'assets/img/food3.jpeg',   caption: 'Made with Love' },
  { src: 'assets/img/food4.jpeg',   caption: 'Authentic Cuisine' },
];
const lightboxCaptionsES = [
  'El Espíritu de La Chinampa',
  'Nuestro Restaurante',
  'Sabores Tradicionales',
  'Ingredientes Frescos',
  'Hecho con Amor',
  'Cocina Auténtica',
];

let lightboxIndex = 0;

function openLightbox(index) {
  lightboxIndex = index;
  updateLightbox();
  const lb = document.getElementById('lightbox');
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  img.src = lightboxImages[lightboxIndex].src;
  img.alt = lightboxImages[lightboxIndex].caption;
  cap.textContent = currentLang === 'es'
    ? lightboxCaptionsES[lightboxIndex]
    : lightboxImages[lightboxIndex].caption;
}

function lightboxNext() {
  lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
  updateLightbox();
}

function lightboxPrev() {
  lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  updateLightbox();
}

/* ─── SCROLL REVEAL ───────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.addEventListener('DOMContentLoaded', () => {
  // Add reveal class to key elements
  const revealTargets = [
    '.about-grid', '.location-card', '.order-card',
    '.video-card', '.contact-card', '.section-header',
    '.about-stats', '.footer-logo'
  ];
  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.08}s`;
      revealObserver.observe(el);
    });
  });
});

/* ─── SMOOTH ACTIVE NAV ───────────────────────────────────────── */
const sections = ['hero', 'about', 'gallery', 'locations', 'order', 'videos', 'contact'];

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (!section) return;
    const { offsetTop, offsetHeight } = section;
    if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.style.color = '';
      });
      const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (activeLink) activeLink.style.color = 'var(--pink)';
    }
  });
}, { passive: true });

/* ─── PARTICLES ───────────────────────────────────────────────── */
function createParticles() {
  const container = document.getElementById('particles');
  const emojis = ['🌸', '🌼', '💀', '✨', '🌟', '🍀'];
  const count = 18;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    p.textContent = emoji;
    p.style.cssText = `
      position: absolute;
      font-size: ${Math.random() * 18 + 10}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.18 + 0.04};
      animation: floatParticle ${Math.random() * 14 + 10}s ease-in-out infinite alternate;
      animation-delay: ${Math.random() * -12}s;
      pointer-events: none;
      user-select: none;
    `;
    container.appendChild(p);
  }

  // Inject keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatParticle {
      from { transform: translate(0, 0) rotate(0deg); }
      to   { transform: translate(${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random()*60+20)}px, ${Math.floor(Math.random()*60+20)}px) rotate(${Math.floor(Math.random()*30+10)}deg); }
    }
  `;
  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', createParticles);
