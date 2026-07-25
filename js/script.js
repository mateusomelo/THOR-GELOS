(() => {
  'use strict';

  // ---------- Icons ----------
  if (window.lucide) window.lucide.createIcons();

  // ---------- Loader ----------
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) setTimeout(() => loader.classList.add('is-hidden'), 400);
  });

  // ---------- Header scroll effect ----------
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');

    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile menu ----------
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------- Scroll reveal ----------
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // ---------- Hero parallax ----------
  const shards = document.querySelectorAll('[data-parallax]');
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('pointermove', (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5);
      const y = (e.clientY / innerHeight - 0.5);
      shards.forEach((shard) => {
        const depth = parseFloat(shard.dataset.parallax) || 0.1;
        shard.style.transform = `translate(${x * 40 * depth * 10}px, ${y * 40 * depth * 10}px)`;
      });
    });
  }

  // ---------- Ripple effect on buttons ----------
  document.querySelectorAll('.ripple').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--rx', `${e.clientX - rect.left}px`);
      btn.style.setProperty('--ry', `${e.clientY - rect.top}px`);
      btn.classList.remove('is-rippling');
      void btn.offsetWidth;
      btn.classList.add('is-rippling');
    });
  });

  // ---------- Gallery lightbox ----------
  const lightbox = document.getElementById('lightbox');
  const lightboxIcon = document.getElementById('lightboxIcon');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.masonry-item').forEach((item) => {
    item.addEventListener('click', () => {
      lightboxIcon.innerHTML = `<i data-lucide="${item.dataset.icon || 'snowflake'}"></i>`;
      if (window.lucide) window.lucide.createIcons();
      lightboxTitle.textContent = item.dataset.title || '';
      lightboxDesc.textContent = item.dataset.desc || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  };
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ---------- Orçamento modal ----------
  const WHATSAPP_NUMBERS = { primary: '5511985996532', alt: '5511987207700' };
  const orcamentoModal = document.getElementById('orcamentoModal');
  const orcamentoClose = document.getElementById('orcamentoClose');
  const orcamentoForm = document.getElementById('orcamentoForm');
  const orcamentoNome = document.getElementById('orcamentoNome');
  const orcamentoSabor = document.getElementById('orcamentoSabor');
  const orcamentoAlt = document.getElementById('orcamentoAlt');

  const openOrcamentoModal = () => {
    orcamentoModal.classList.add('is-open');
    orcamentoModal.setAttribute('aria-hidden', 'false');
    orcamentoNome.focus();
  };
  const closeOrcamentoModal = () => {
    orcamentoModal.classList.remove('is-open');
    orcamentoModal.setAttribute('aria-hidden', 'true');
  };

  document.querySelectorAll('[data-open-modal="orcamento"]').forEach((trigger) => {
    trigger.addEventListener('click', openOrcamentoModal);
  });
  orcamentoClose.addEventListener('click', closeOrcamentoModal);
  orcamentoModal.addEventListener('click', (e) => {
    if (e.target === orcamentoModal) closeOrcamentoModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOrcamentoModal();
  });

  const buildOrcamentoMessage = () => {
    const nome = orcamentoNome.value.trim();
    const sabor = orcamentoSabor.value;
    return `Olá! Meu nome é ${nome}. Quero fazer um pedido de gelo saborizado: ${sabor}.`;
  };

  const isOrcamentoFormValid = () => {
    const valid = orcamentoForm.checkValidity();
    orcamentoNome.classList.add('is-touched');
    orcamentoSabor.classList.add('is-touched');
    if (!valid) orcamentoForm.reportValidity();
    return valid;
  };

  orcamentoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isOrcamentoFormValid()) return;
    const text = encodeURIComponent(buildOrcamentoMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBERS.primary}?text=${text}`, '_blank', 'noopener');
    closeOrcamentoModal();
  });

  orcamentoAlt.addEventListener('click', () => {
    if (!isOrcamentoFormValid()) return;
    const text = encodeURIComponent(buildOrcamentoMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBERS.alt}?text=${text}`, '_blank', 'noopener');
    closeOrcamentoModal();
  });

  // ---------- Back to top ----------
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- Footer year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
