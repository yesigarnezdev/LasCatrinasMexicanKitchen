/* ============================================================
   VIDEOS PAGE — SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── PLAY BUTTONS → MODAL ──────────────────────────── */
  const modal        = document.getElementById('video-modal');
  const modalBd      = document.getElementById('video-modal-backdrop');
  const modalClose   = document.getElementById('video-modal-close');
  const modalVideo   = document.getElementById('modal-video');
  const modalSrc     = document.getElementById('modal-video-source');

  function openModal(src) {
    modalSrc.src = src;
    modalVideo.load();
    modal.classList.add('open');
    modalBd.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Small delay to let it paint before playing
    setTimeout(() => modalVideo.play(), 200);
  }

  function closeModal() {
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modal.classList.remove('open');
    modalBd.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.video;
      if (src) openModal(src);
    });
  });

  modalClose?.addEventListener('click', closeModal);
  modalBd?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal();
  });

  /* ── VIDEO CARD HOVER PREVIEW ──────────────────────── */
  document.querySelectorAll('.video-card').forEach(card => {
    const preview = card.querySelector('.video-bg-preview');
    if (!preview) return;
    card.addEventListener('mouseenter', () => {
      preview.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
      preview.pause();
      preview.currentTime = 0;
    });
  });

  /* ── SCROLL REVEALS (reuse from script.js if needed) ── */
  const reveals = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => obs.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

});
