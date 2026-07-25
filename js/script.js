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

  // ---------- Orçamento modal ----------
  const WHATSAPP_NUMBERS = { primary: '5511985996532', alt: '5511987207700' };
  const UNIT_PRICE = 1.20;
  const BULK_UNIT_PRICE = 1.00;
  const BULK_THRESHOLD = 70;

  const orcamentoModal = document.getElementById('orcamentoModal');
  const orcamentoClose = document.getElementById('orcamentoClose');
  const orcamentoForm = document.getElementById('orcamentoForm');
  const orcamentoNome = document.getElementById('orcamentoNome');
  const orcamentoItens = document.getElementById('orcamentoItens');
  const orcamentoAddSabor = document.getElementById('orcamentoAddSabor');
  const orcamentoTotalValor = document.getElementById('orcamentoTotalValor');
  const orcamentoTotalHint = document.getElementById('orcamentoTotalHint');
  const orcamentoAlt = document.getElementById('orcamentoAlt');

  const formatBRL = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  const getItemRows = () => Array.from(orcamentoItens.querySelectorAll('.orcamento-item'));

  const recalcOrcamentoTotal = () => {
    const totalQty = getItemRows().reduce((sum, row) => {
      const qty = parseInt(row.querySelector('.item-quantidade').value, 10);
      return sum + (Number.isFinite(qty) && qty > 0 ? qty : 0);
    }, 0);

    if (totalQty <= 0) {
      orcamentoTotalValor.textContent = formatBRL(0);
      orcamentoTotalHint.textContent = 'Preencha a quantidade';
      return;
    }

    const unitPrice = totalQty > BULK_THRESHOLD ? BULK_UNIT_PRICE : UNIT_PRICE;
    const total = totalQty * unitPrice;
    orcamentoTotalValor.textContent = formatBRL(total);
    orcamentoTotalHint.textContent = totalQty > BULK_THRESHOLD
      ? `${totalQty} un. × ${formatBRL(unitPrice)} (preço por volume)`
      : `${totalQty} un. × ${formatBRL(unitPrice)}`;
  };

  const addOrcamentoItem = () => {
    const template = orcamentoItens.querySelector('.orcamento-item');
    const row = template.cloneNode(true);
    row.querySelector('.item-sabor').selectedIndex = 0;
    row.querySelector('.item-quantidade').value = '';
    row.querySelector('.item-remove').hidden = false;
    orcamentoItens.appendChild(row);
    if (window.lucide) window.lucide.createIcons();
    recalcOrcamentoTotal();
    row.querySelector('.item-sabor').focus();
  };

  orcamentoAddSabor.addEventListener('click', addOrcamentoItem);

  orcamentoItens.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.item-remove');
    if (!removeBtn || removeBtn.hidden) return;
    removeBtn.closest('.orcamento-item').remove();
    recalcOrcamentoTotal();
  });

  orcamentoItens.addEventListener('input', (e) => {
    if (e.target.classList.contains('item-quantidade')) recalcOrcamentoTotal();
  });

  const resetOrcamentoForm = () => {
    getItemRows().slice(1).forEach((row) => row.remove());
    orcamentoForm.reset();
    orcamentoForm.querySelectorAll('.is-touched').forEach((el) => el.classList.remove('is-touched'));
    recalcOrcamentoTotal();
  };

  const openOrcamentoModal = () => {
    orcamentoModal.classList.add('is-open');
    orcamentoModal.setAttribute('aria-hidden', 'false');
    orcamentoNome.focus();
  };
  const closeOrcamentoModal = () => {
    orcamentoModal.classList.remove('is-open');
    orcamentoModal.setAttribute('aria-hidden', 'true');
    resetOrcamentoForm();
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
    const rows = getItemRows();
    const totalQty = rows.reduce((sum, row) => sum + (parseInt(row.querySelector('.item-quantidade').value, 10) || 0), 0);
    const unitPrice = totalQty > BULK_THRESHOLD ? BULK_UNIT_PRICE : UNIT_PRICE;
    const total = totalQty * unitPrice;

    const itensTexto = rows
      .map((row) => {
        const sabor = row.querySelector('.item-sabor').value;
        const qty = row.querySelector('.item-quantidade').value;
        return `- ${sabor}: ${qty} un.`;
      })
      .join('\n');

    return `Olá! Meu nome é ${nome}. Quero fazer um pedido de gelo saborizado:\n${itensTexto}\nTotal: ${totalQty} unidades — ${formatBRL(total)}`;
  };

  const isOrcamentoFormValid = () => {
    const valid = orcamentoForm.checkValidity();
    orcamentoNome.classList.add('is-touched');
    orcamentoForm.querySelectorAll('.item-sabor, .item-quantidade').forEach((el) => el.classList.add('is-touched'));
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
