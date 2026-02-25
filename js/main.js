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

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  /* ---------- Hero Sticky Parallax ---------- */
  const heroWrap = document.querySelector('.hero-wrap');
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero__bg');
  const heroContent = document.querySelector('.hero__content');
  const heroScroll = document.querySelector('.hero__scroll');
  const heroCta = document.querySelector('.hero__cta');

  if (heroWrap && hero) {
    const heroBgImg = heroBg ? heroBg.querySelector('img') : null;
    let heroZoomDone = false;

    // Wait for the CSS zoom-in animation to finish before applying scroll transforms
    if (heroBgImg) {
      heroBgImg.addEventListener('animationend', () => {
        heroZoomDone = true;
      });
      // Fallback in case the event was missed
      setTimeout(() => { heroZoomDone = true; }, 2600);
    }

    const updateHeroParallax = () => {
      const wrapRect = heroWrap.getBoundingClientRect();
      const wrapHeight = heroWrap.offsetHeight;
      const viewH = window.innerHeight;
      const scrolled = Math.max(0, -wrapRect.top);
      const progress = Math.min(1, scrolled / (wrapHeight - viewH));

      if (heroBg) {
        if (heroZoomDone || progress > 0.01) {
          heroBg.style.transform = `translateY(${progress * 40}px) scale(${1 + progress * 0.08})`;
        }
      }
      if (heroContent) {
        // Only override opacity/transform after the intro animation completes
        if (progress > 0.01) {
          heroContent.style.animation = 'none';
          heroContent.style.opacity = 1 - progress * 2.5;
          heroContent.style.transform = `translateY(${progress * -80}px)`;
        }
      }
      if (heroCta) {
        if (progress > 0.01) {
          heroCta.style.animation = 'none';
          heroCta.style.opacity = 1 - progress * 2.5;
          heroCta.style.transform = `translateY(${progress * -60}px)`;
        }
      }
      if (heroScroll) {
        heroScroll.style.opacity = 1 - progress * 4;
      }
    };

    window.addEventListener('scroll', updateHeroParallax, { passive: true });
    updateHeroParallax();
  }

  /* ---------- Staggered Fade-in (Intersection Observer) ---------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.getAttribute('data-fade-delay') || '0', 10);
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    fadeEls.forEach(el => fadeObserver.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Counter Animation ---------- */
  const counterEls = document.querySelectorAll('[data-count-to]');

  if ('IntersectionObserver' in window && counterEls.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterEls.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count-to'), 10);
    const suffix = el.getAttribute('data-count-suffix') || '';
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Repeat counter animation every 8 seconds
  if (counterEls.length > 0) {
    setInterval(() => {
      counterEls.forEach(el => {
        el.textContent = '0' + (el.getAttribute('data-count-suffix') || '');
        animateCounter(el);
      });
    }, 8000);
  }

  /* ---------- Gallery Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const galleryItems = document.querySelectorAll('.gallery__item, .gallery-full__item');
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

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  /* ---------- Countdown Timer ---------- */
  const countdownEl = document.getElementById('countdown');

  if (countdownEl) {
    const targetDate = new Date(countdownEl.getAttribute('data-target-date')).getTime();
    const daysEl = document.getElementById('countDays');
    const hoursEl = document.getElementById('countHours');
    const minutesEl = document.getElementById('countMinutes');
    const secondsEl = document.getElementById('countSeconds');

    function updateCountdown() {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n) => String(n).padStart(2, '0');

      // Tick animation on seconds change
      if (secondsEl.textContent !== pad(seconds)) {
        secondsEl.classList.add('tick');
        setTimeout(() => secondsEl.classList.remove('tick'), 200);
      }

      daysEl.textContent = pad(days);
      hoursEl.textContent = pad(hours);
      minutesEl.textContent = pad(minutes);
      secondsEl.textContent = pad(seconds);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

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

  /* ---------- Marquee pause on hover ---------- */
  document.querySelectorAll('.marquee').forEach(marquee => {
    const track = marquee.querySelector('.marquee__track');
    if (track) {
      marquee.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
      });
      marquee.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
      });
    }
  });

});
