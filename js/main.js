/* ==========================================================================
   Uroš Ržišnik – Kantavtor | JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navigation: scroll background ---------- */
  const nav = document.getElementById('nav');

  const handleNavScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ---------- Hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  /* ---------- Fade-in on scroll (Intersection Observer) ---------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(el => fadeObserver.observe(el));
  } else {
    // Fallback: show everything
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Gallery Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const galleryItems = document.querySelectorAll('.gallery__item');
  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = index;
    const src = galleryItems[index].getAttribute('data-src');
    lightboxImg.src = src;
    lightboxImg.alt = galleryItems[index].querySelector('img')?.alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(currentIndex);
  };

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox__prev').addEventListener('click', showPrev);
  lightbox.querySelector('.lightbox__next').addEventListener('click', showNext);

  // Close lightbox on overlay click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  /* ---------- Contact form placeholder handler ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn');
      btn.textContent = 'Sporočilo poslano!';
      btn.style.background = '#28a745';
      btn.style.borderColor = '#28a745';
      setTimeout(() => {
        btn.textContent = 'Pošlji sporočilo';
        btn.style.background = '';
        btn.style.borderColor = '';
        contactForm.reset();
      }, 3000);
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('.section[id]');

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = navLinks.querySelector(`a[href="#${id}"]`);

      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.style.color = 'var(--clr-text)';
        } else {
          link.style.color = '';
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

});
