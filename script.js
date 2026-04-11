document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });


  navLinks?.querySelectorAll('.nav-link, .btn-order').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let particles = [];
    

    const COLORS = ['#ffa500','#ff8c00','#ff4500','#ffd700','#e67e22'];
    const SHAPES = ['petal', 'circle'];

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H + H;
        this.size = Math.random() * 4 + 1;
        this.speedY = -(Math.random() * 0.6 + 0.2);
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.03;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotSpeed;
        if (this.y < -20) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        if (this.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size * 0.7, this.size * 1.5, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const N = Math.min(60, Math.floor(W * H / 18000));
    for (let i = 0; i < N; i++) {
      const p = new Particle();
      p.y = Math.random() * H; 
      particles.push(p);
    }

    function animateParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }, { passive: true });
  }


  const reveals = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  const dishes = [
    { src: 'assets/img/platillo.jpg',  label: 'Signature Dish'  },
    { src: 'assets/img/platillo1.jpg', label: 'Traditional Plate' },
    { src: 'assets/img/platillo2.jpg', label: 'Fresh & Flavorful' },
    { src: 'assets/img/platillo3.jpg', label: 'Chef\'s Special'   },
    { src: 'assets/img/platillo4.jpg', label: 'House Favorite'   },
    { src: 'assets/img/platillo5.jpg', label: 'Authentic Recipe'  },
    { src: 'assets/img/platillo6.jpg', label: 'Classic Flavor'    },
    { src: 'assets/img/platillo7.jpg', label: 'Fan Favorite'      },
    { src: 'assets/img/platillo8.jpg', label: 'Daily Special'     },
    { src: 'assets/img/platillo9.jpg', label: 'Homemade Goodness' },
    { src: 'assets/img/platillo10.jpg', label: 'Taste of Mexico'  },
    { src: 'assets/img/platillo11.jpg', label: 'Kitchen Pride'    },
  ];

  const track   = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsWrap = document.getElementById('carousel-dots');

  if (track && dishes.length) {

    dishes.forEach((dish, i) => {
      const card = document.createElement('div');
      card.className = 'menu-card';
      card.setAttribute('data-index', i);
      card.innerHTML = `
        <img src="${dish.src}" alt="${dish.label}" class="menu-card-img" loading="lazy" />
        <div class="zoom-hint">🔍</div>
        <div class="menu-card-overlay">
          <span class="menu-card-label">${dish.label}</span>
        </div>
      `;
      track.appendChild(card);
    });


    function getVisible() {
      if (window.innerWidth <= 480) return 1;
      if (window.innerWidth <= 768) return 1.1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    let current = 0;
    const total = dishes.length;

    function getMaxIndex() {
      const vis = Math.round(getVisible());
      return Math.max(0, total - vis);
    }

    function getCardWidth() {
      const card = track.querySelector('.menu-card');
      if (!card) return 0;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap) || 24;
      return card.offsetWidth + gap;
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, getMaxIndex()));
      track.style.transform = `translateX(-${current * getCardWidth()}px)`;
      updateDots();
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current >= getMaxIndex();
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      const count = getMaxIndex() + 1;
      for (let i = 0; i < count; i++) {
        const d = document.createElement('button');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', `Go to slide ${i + 1}`);
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
      }
    }

    function updateDots() {
      dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    buildDots();
    goTo(0);

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 40) dx > 0 ? goTo(current + 1) : goTo(current - 1);
    }, { passive: true });

    window.addEventListener('resize', () => {
      buildDots();
      goTo(Math.min(current, getMaxIndex()));
    }, { passive: true });

    // Auto-play
    let autoplay = setInterval(() => {
      if (current >= getMaxIndex()) goTo(0);
      else goTo(current + 1);
    }, 4000);
    track.addEventListener('mouseenter', () => clearInterval(autoplay));
    track.addEventListener('mouseleave', () => {
      autoplay = setInterval(() => {
        if (current >= getMaxIndex()) goTo(0);
        else goTo(current + 1);
      }, 4000);
    });


    const lightbox   = document.getElementById('lightbox');
    const lbBackdrop = document.getElementById('lightbox-backdrop');
    const lbImg      = document.getElementById('lightbox-img');
    const lbCaption  = document.getElementById('lightbox-caption');
    const lbClose    = document.getElementById('lightbox-close');
    const lbPrev     = document.getElementById('lb-prev');
    const lbNext     = document.getElementById('lb-next');
    let lbIndex = 0;

    function openLightbox(idx) {
      lbIndex = idx;
      updateLightbox();
      lightbox.classList.add('open');
      lbBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lbBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }

    function updateLightbox() {
      const dish = dishes[lbIndex];
      lbImg.src = dish.src;
      lbImg.alt = dish.label;
      lbCaption.textContent = dish.label;
    }

    track.addEventListener('click', e => {
      const card = e.target.closest('.menu-card');
      if (card) openLightbox(parseInt(card.dataset.index));
    });

    
    lbClose?.addEventListener('click', closeLightbox);
    lbBackdrop?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === document.querySelector('.lightbox-img-wrap')) {
        closeLightbox();
      }
    });

    lbPrev?.addEventListener('click', () => {
      lbIndex = (lbIndex - 1 + dishes.length) % dishes.length;
      updateLightbox();
    });
    lbNext?.addEventListener('click', () => {
      lbIndex = (lbIndex + 1) % dishes.length;
      updateLightbox();
    });
    document.addEventListener('keydown', e => {
      if (!lightbox?.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + dishes.length) % dishes.length; updateLightbox(); }
      if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % dishes.length; updateLightbox(); }
    });
  }


  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');

  if (sections.length && navLinkEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinkEls.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(s => io.observe(s));
  }

});