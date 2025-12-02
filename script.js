document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  const closeMobileMenu = () => {
    hamburger?.classList.remove('active');
    mobileMenu?.classList.remove('show');
    hamburger?.setAttribute('aria-expanded', 'false');
    mobileMenu?.setAttribute('aria-hidden', 'true');
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const nextState = !hamburger.classList.contains('active');
      hamburger.classList.toggle('active');
      mobileMenu?.classList.toggle('show');
      hamburger.setAttribute('aria-expanded', String(nextState));
      mobileMenu?.setAttribute('aria-hidden', String(!nextState));
    });
  }

  mobileMenu?.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', closeMobileMenu)
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

  const accordions = document.querySelectorAll('.accordion-item');
  accordions.forEach((item) => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    header?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      accordions.forEach((i) => {
        i.classList.remove('open');
        i.querySelector('.accordion-content').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  const testimonials = document.querySelectorAll('.testimonial');
  if (testimonials.length > 1) {
    let index = 0;
    setInterval(() => {
      testimonials[index].style.opacity = 0.4;
      index = (index + 1) % testimonials.length;
      testimonials[index].style.opacity = 1;
    }, 4000);
  }

  const form = document.querySelector('form[data-contact]');
  const formMessage = document.querySelector('[data-form-message]');
  const submitButton = form?.querySelector('button[type="submit"]');
  const whatsappCode = form?.querySelector('#whatsapp-code');
  const whatsappNumber = form?.querySelector('#whatsapp-number');
  const whatsappFull = form?.querySelector('#whatsapp-full');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);

      const code = whatsappCode?.value.trim();
      const number = whatsappNumber?.value.trim();
      const combined = code && number ? `${code} ${number}` : '';
      if (whatsappFull) {
        whatsappFull.value = combined;
        formData.set('whatsapp', combined);
      }

      try {
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = 'Submitting...';
        }

        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        const result = await response.json();

        if (response.ok) {
          form.reset();
          if (formMessage) {
            formMessage.textContent = 'Thank you for sharing your plans. Our concierge team will reply within 24–48 hours.';
            formMessage.style.display = 'block';
            formMessage.style.color = 'var(--gold)';
          }
        } else if (formMessage) {
          formMessage.textContent = result.message || 'Something went wrong. Please try again or email support@luxesettle.com.';
          formMessage.style.display = 'block';
          formMessage.style.color = '#f87171';
        }
      } catch (error) {
        if (formMessage) {
          formMessage.textContent = 'We could not submit the form right now. Please try again in a moment or email support@luxesettle.com.';
          formMessage.style.display = 'block';
          formMessage.style.color = '#f87171';
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Submit Request';
        }
      }
    });
  }
});
