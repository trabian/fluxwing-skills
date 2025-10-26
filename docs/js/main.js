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

  // ========================================
  // STICKY NAVIGATION WITH SCROLL DETECTION
  // ========================================
  const nav = document.querySelector('.primary-nav');
  if (nav) {
    let lastScroll = 0;
    const scrollThreshold = 100; // Minimum scroll before hiding nav

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // At top of page
      if (currentScroll <= scrollThreshold) {
        nav.classList.remove('scroll-up', 'scroll-down');
        nav.classList.add('at-top');
        lastScroll = currentScroll;
        return;
      }

      nav.classList.remove('at-top');

      // Scrolling down - hide nav
      if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-up');
        nav.classList.add('scroll-down');
      }
      // Scrolling up - show nav
      else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-down');
        nav.classList.add('scroll-up');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ========================================
  // CURRENT SECTION HIGHLIGHTING
  // ========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.primary-nav__list a[href^="#"], .mobile-nav__list a[href^="#"]');

  if (sections.length > 0 && navLinks.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;

          // Remove active class from all links
          navLinks.forEach(link => {
            link.classList.remove('active');
          });

          // Add active class to matching links
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      root: null,
      rootMargin: '-20% 0px -80% 0px', // Trigger when section is in middle 60% of viewport
      threshold: 0
    });

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }

  // ========================================
  // COPY-TO-CLIPBOARD FUNCTIONALITY
  // ========================================
  function addCopyButtons() {
    // Target code blocks in terminal windows and installation commands
    const codeBlocks = document.querySelectorAll('.terminal-window code, .installation__commands code, pre code');

    codeBlocks.forEach(block => {
      // Skip if already has a copy button
      if (block.parentElement.querySelector('.copy-button')) {
        return;
      }

      // Create copy button
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.textContent = 'Copy';
      button.setAttribute('aria-label', 'Copy code to clipboard');

      // Copy functionality
      button.addEventListener('click', async () => {
        const code = block.textContent;
        try {
          await navigator.clipboard.writeText(code);
          button.textContent = 'Copied!';
          button.classList.add('copied');
          setTimeout(() => {
            button.textContent = 'Copy';
            button.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
          button.textContent = 'Failed';
          setTimeout(() => {
            button.textContent = 'Copy';
          }, 2000);
        }
      });

      // Make parent container position relative if needed
      const container = block.parentElement;
      if (container && window.getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
      }

      container.appendChild(button);
    });
  }

  // Initialize copy buttons
  addCopyButtons();

  // ========================================
  // COMPONENT GALLERY FILTERING
  // ========================================
  function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.showcase__filters button[data-filter]');
    const showcaseCards = document.querySelectorAll('.showcase__card[data-type]');

    if (filterButtons.length === 0 || showcaseCards.length === 0) {
      return;
    }

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');

        // Filter cards with fade animation
        showcaseCards.forEach(card => {
          const cardType = card.getAttribute('data-type');

          if (filter === 'all' || cardType === filter) {
            card.style.display = 'block';
            // Trigger reflow to restart animation
            card.offsetHeight;
            card.classList.add('fade-in');
          } else {
            card.classList.remove('fade-in');
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Initialize gallery filters
  initGalleryFilters();
});
