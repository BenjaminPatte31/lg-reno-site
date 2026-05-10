/* ============================================
   LG RENO — Main JavaScript v2
   Speed Dial · Slider Hint · FAQ · Multi-Step
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR SCROLL ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ── MOBILE MENU ──
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('active'))
    );
  }

  // ── SCROLL REVEAL ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── BEFORE / AFTER SLIDER ──
  document.querySelectorAll('.ba-container').forEach(container => {
    const slider = container.querySelector('.ba-slider');
    const after = container.querySelector('.ba-after');
    let isDragging = false;
    let hintPlayed = false;

    function updateSlider(x) {
      const rect = container.getBoundingClientRect();
      let pos = ((x - rect.left) / rect.width) * 100;
      pos = Math.max(5, Math.min(95, pos));
      slider.style.left = pos + '%';
      after.style.clipPath = `inset(0 0 0 ${pos}%)`;
    }

    // Hint animation — auto-slide on first view to show interactivity
    const hintObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hintPlayed) {
          hintPlayed = true;
          hintObserver.unobserve(container);
          setTimeout(() => {
            slider.classList.add('ba-hint');
            after.classList.add('ba-hint-clip');
            setTimeout(() => {
              slider.classList.remove('ba-hint');
              after.classList.remove('ba-hint-clip');
            }, 1600);
          }, 600);
        }
      });
    }, { threshold: 0.5 });
    hintObserver.observe(container);

    slider.addEventListener('mousedown', () => isDragging = true);
    container.addEventListener('mousedown', (e) => { isDragging = true; updateSlider(e.clientX); });
    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('mousemove', (e) => { if (isDragging) updateSlider(e.clientX); });

    // Touch
    slider.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); });
    container.addEventListener('touchstart', (e) => { isDragging = true; updateSlider(e.touches[0].clientX); });
    document.addEventListener('touchend', () => isDragging = false);
    document.addEventListener('touchmove', (e) => { if (isDragging) updateSlider(e.touches[0].clientX); });
  });

  // ── SPEED DIAL (Phone + WhatsApp) ──
  const speedDial = document.getElementById('speedDial');
  const speedToggle = document.getElementById('speedToggle');
  if (speedDial && speedToggle) {
    speedToggle.addEventListener('click', (e) => {
      e.preventDefault();
      speedDial.classList.toggle('open');
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!speedDial.contains(e.target)) speedDial.classList.remove('open');
    });
  }

  // ── FAQ ACCORDIONS ──
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all siblings
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── MULTI-STEP QUOTE FORM ──
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    let currentStep = 1;
    const totalSteps = 3;
    let selectedService = '';
    let selectedDelay = '';

    function showStep(n) {
      quoteForm.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
      const step = quoteForm.querySelector(`.step[data-step="${n}"]`);
      if (step) step.classList.add('active');
      quoteForm.querySelectorAll('.step-dot').forEach((d, i) => {
        d.classList.toggle('active', i < n);
      });
    }

    quoteForm.querySelectorAll('.option-btn[data-service]').forEach(btn => {
      btn.addEventListener('click', () => {
        quoteForm.querySelectorAll('.option-btn[data-service]').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedService = btn.dataset.service;
      });
    });

    quoteForm.querySelectorAll('.option-btn[data-delay]').forEach(btn => {
      btn.addEventListener('click', () => {
        quoteForm.querySelectorAll('.option-btn[data-delay]').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedDelay = btn.dataset.delay;
      });
    });

    quoteForm.querySelectorAll('.btn-step-next').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep === 1 && !selectedService) { alert('Veuillez sélectionner un service.'); return; }
        if (currentStep === 2 && !selectedDelay) { alert('Veuillez sélectionner un délai.'); return; }
        if (currentStep < totalSteps) { currentStep++; showStep(currentStep); }
      });
    });

    quoteForm.querySelectorAll('.btn-step-back').forEach(btn => {
      btn.addEventListener('click', () => { if (currentStep > 1) { currentStep--; showStep(currentStep); } });
    });

    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = quoteForm.querySelector('#q-name')?.value;
      const phone = quoteForm.querySelector('#q-phone')?.value;
      if (!name || !phone) { alert('Veuillez remplir vos coordonnées.'); return; }
      const hiddenService = quoteForm.querySelector('input[name="service"]');
      const hiddenDelay = quoteForm.querySelector('input[name="delai"]');
      if (hiddenService) hiddenService.value = selectedService;
      if (hiddenDelay) hiddenDelay.value = selectedDelay;

      const card = quoteForm.querySelector('.quote-card');
      if (card) {
        card.innerHTML = `
          <div style="text-align:center;padding:40px 20px;">
            <div style="font-size:3rem;margin-bottom:16px;">✅</div>
            <h3 style="color:var(--white);margin-bottom:12px;">Demande envoyée !</h3>
            <p style="color:rgba(255,255,255,0.7);">Merci ${name}. Notre équipe vous rappelle sous 24h pour votre projet <strong>${selectedService}</strong>.</p>
          </div>
        `;
      }
    });

    showStep(1);
  }
});
