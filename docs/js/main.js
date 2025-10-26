document.addEventListener("DOMContentLoaded", () => {
  // Load all ASCII art from external files
  document.querySelectorAll("pre[data-src]").forEach((element) => {
    const src = element.dataset.src;
    if (src) {
      fetch(src)
        .then((response) => (response.ok ? response.text() : ""))
        .then((art) => {
          if (art.trim().length > 0) {
            element.textContent = art;
          }
        })
        .catch(() => {
          element.textContent = `[ ASCII art unavailable: ${src} ]`;
        });
    }
  });

  const heroAscii = document.querySelector(".hero__ascii--dynamic");
  const heroAsciiCompact = document.querySelector(".hero__ascii--compact");
  const heroCompactQuery = window.matchMedia("(max-width: 47.99rem)");

  const syncHeroAsciiVisibility = (event) => {
    if (!heroAscii || !heroAsciiCompact) {
      return;
    }

    const matches = event.matches;
    if (matches) {
      heroAscii.style.display = "none";
      heroAsciiCompact.style.display = "block";
    } else {
      heroAscii.style.display = "block";
      heroAsciiCompact.style.display = "none";
    }
  };

  if (heroAscii && heroAsciiCompact) {
    syncHeroAsciiVisibility(heroCompactQuery);
    heroCompactQuery.addEventListener("change", syncHeroAsciiVisibility);
  }

  // T045-T051: Mobile Navigation with Focus Trap
  const navToggle = document.querySelector(".primary-nav__toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (navToggle && mobileMenu) {
    // Get all focusable elements in the menu
    const getFocusableElements = () => {
      return mobileMenu.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
    };

    const closeMenu = () => {
      navToggle.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("hidden", "");
      document.body.style.overflow = "";
    };

    const openMenu = () => {
      navToggle.setAttribute("aria-expanded", "true");
      mobileMenu.removeAttribute("hidden");
      document.body.style.overflow = "hidden"; // Prevent body scroll

      // Focus first focusable element
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    };

    // T050: Focus trap - keep focus within menu when open
    const trapFocus = (event) => {
      const isMenuOpen = navToggle.getAttribute("aria-expanded") === "true";
      if (!isMenuOpen) return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Tab key
      if (event.key === "Tab") {
        if (event.shiftKey) {
          // Shift+Tab: if on first element, move to last
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if on last element, move to first
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      if (expanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // T051: Escape key to close menu
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const isMenuOpen = navToggle.getAttribute("aria-expanded") === "true";
        if (isMenuOpen) {
          closeMenu();
          navToggle.focus();
        }
      }
    });

    // Apply focus trap
    mobileMenu.addEventListener("keydown", trapFocus);

    mobileMenu.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.matches("a")) {
        closeMenu();
      }
    });

    const desktopViewport = window.matchMedia("(min-width: 48rem)");
    const handleViewportChange = (event) => {
      if (event.matches) {
        closeMenu();
      }
    };

    handleViewportChange(desktopViewport);
    desktopViewport.addEventListener("change", handleViewportChange);
  }

  // T123-T125: Modal dialog functionality
  document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal-trigger');
      const modal = document.getElementById(modalId);

      if (modal && modal.tagName === 'DIALOG') {
        modal.showModal();

        // Focus first focusable element
        const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) focusable.focus();
      }
    });
  });

  // T124: Escape key and close button for modals
  document.querySelectorAll('dialog.modal').forEach(modal => {
    const closeBtn = modal.querySelector('.modal__close');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.close();
      });
    }

    // Focus trap within modal
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modal.close();
      }
    });
  });

  // T126: Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip if it's just "#" or empty
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();

        // Check for prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });

        // Update focus for accessibility
        target.focus({ preventScroll: true });
      }
    });
  });

  // T128: Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, observerOptions);

  // T114, T130: Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      observer.observe(el);
    });
  } else {
    // Immediately show all elements if motion is reduced
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      el.classList.add('revealed');
    });
  }
});
