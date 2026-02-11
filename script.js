(function() {
  'use strict';

  const MobileMenu = {
    init() {
      this.toggler = document.querySelector('.navbar-toggler');
      this.collapse = document.querySelector('.navbar-collapse');
      
      if (!this.toggler || !this.collapse) return;
      
      this.toggler.addEventListener('click', () => this.toggle());
      
      document.addEventListener('click', (e) => {
        if (this.collapse.classList.contains('show') && 
            !this.collapse.contains(e.target) && 
            !this.toggler.contains(e.target)) {
          this.close();
        }
      });
      
      this.collapse.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => this.close());
      });
    },
    
    toggle() {
      if (this.collapse.classList.contains('show')) {
        this.close();
      } else {
        this.open();
      }
    },
    
    open() {
      this.collapse.classList.add('show');
      this.toggler.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    },
    
    close() {
      this.collapse.classList.remove('show');
      this.toggler.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  const ScrollSpy = {
    init() {
      this.sections = document.querySelectorAll('section[id]');
      this.navLinks = document.querySelectorAll('.nav-link[href^="#"]');
      
      if (!this.sections.length || !this.navLinks.length) return;
      
      window.addEventListener('scroll', () => this.update());
      this.update();
    },
    
    update() {
      const scrollY = window.pageYOffset;
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
      
      this.sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
          this.navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
              link.setAttribute('aria-current', 'page');
            }
          });
        }
      });
    }
  };

  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href === '#' || href === '#!') return;
          
          const target = document.querySelector(href);
          if (!target) return;
          
          e.preventDefault();
          
          const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          if (MobileMenu.collapse && MobileMenu.collapse.classList.contains('show')) {
            MobileMenu.close();
          }
        });
      });
    }
  };

  const FormValidation = {
    init() {
      this.forms = document.querySelectorAll('.c-form');
      
      this.forms.forEach(form => {
        form.addEventListener('submit', (e) => this.handleSubmit(e, form));
      });
    },
    
    handleSubmit(e, form) {
      e.preventDefault();
      
      this.clearErrors(form);
      
      const isValid = this.validateForm(form);
      
      if (isValid) {
        this.submitForm(form);
      }
    },
    
    validateForm(form) {
      let isValid = true;
      
      const nameField = form.querySelector('#contactName');
      if (nameField) {
        const name = nameField.value.trim();
        if (name === '') {
          this.showError(nameField, 'Naam is verplicht');
          isValid = false;
        } else if (name.length < 2) {
          this.showError(nameField, 'Naam moet minimaal 2 tekens bevatten');
          isValid = false;
        }
      }
      
      const emailField = form.querySelector('#contactEmail');
      if (emailField) {
        const email = emailField.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
          this.showError(emailField, 'E-mail is verplicht');
          isValid = false;
        } else if (!emailRegex.test(email)) {
          this.showError(emailField, 'Voer een geldig e-mailadres in');
          isValid = false;
        }
      }
      
      const phoneField = form.querySelector('#contactPhone');
      if (phoneField) {
        const phone = phoneField.value.trim();
        const phoneRegex = /^[\d\s\+\-\(\)]{10,20}$/;
        if (phone === '') {
          this.showError(phoneField, 'Telefoonnummer is verplicht');
          isValid = false;
        } else if (!phoneRegex.test(phone)) {
          this.showError(phoneField, 'Voer een geldig telefoonnummer in');
          isValid = false;
        }
      }
      
      const subjectField = form.querySelector('#contactSubject');
      if (subjectField) {
        const subject = subjectField.value.trim();
        if (subject === '') {
          this.showError(subjectField, 'Onderwerp is verplicht');
          isValid = false;
        }
      }
      
      const messageField = form.querySelector('#contactMessage');
      if (messageField) {
        const message = messageField.value.trim();
        if (message === '') {
          this.showError(messageField, 'Bericht is verplicht');
          isValid = false;
        } else if (message.length < 10) {
          this.showError(messageField, 'Bericht moet minimaal 10 tekens bevatten');
          isValid = false;
        }
      }
      
      const privacyField = form.querySelector('#contactPrivacy');
      if (privacyField) {
        if (!privacyField.checked) {
          this.showError(privacyField, 'U moet akkoord gaan met het privacybeleid');
          isValid = false;
        }
      }
      
      return isValid;
    },
    
    showError(field, message) {
      const group = field.closest('.c-form__group') || field.closest('.form-check');
      if (!group) return;
      
      group.classList.add('has-error');
      
      let errorElement = group.querySelector('.c-form__error, .invalid-feedback');
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = field.type === 'checkbox' ? 'invalid-feedback' : 'c-form__error';
        group.appendChild(errorElement);
      }
      
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    },
    
    clearErrors(form) {
      form.querySelectorAll('.has-error').forEach(group => {
        group.classList.remove('has-error');
      });
      
      form.querySelectorAll('.c-form__error, .invalid-feedback').forEach(error => {
        error.style.display = 'none';
        error.textContent = '';
      });
    },
    
    submitForm(form) {
      const submitButton = form.querySelector('button[type="submit"]');
      if (!submitButton) return;
      
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Verzenden...';
      submitButton.disabled = true;
      
      setTimeout(() => {
        window.location.href = 'thank_you.html';
      }, 800);
    }
  };

  const Accordion = {
    init() {
      this.buttons = document.querySelectorAll('.accordion-button');
      
      this.buttons.forEach(button => {
        button.addEventListener('click', () => this.toggle(button));
      });
    },
    
    toggle(button) {
      const target = button.getAttribute('data-bs-target');
      const collapse = document.querySelector(target);
      
      if (!collapse) return;
      
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        this.close(button, collapse);
      } else {
        const parent = button.closest('[data-bs-parent]');
        if (parent) {
          const parentId = button.getAttribute('data-bs-parent');
          if (parentId) {
            const siblings = document.querySelectorAll(`${parentId} .accordion-collapse.show`);
            siblings.forEach(sibling => {
              const siblingButton = document.querySelector(`[data-bs-target="#${sibling.id}"]`);
              if (siblingButton && siblingButton !== button) {
                this.close(siblingButton, sibling);
              }
            });
          }
        }
        
        this.open(button, collapse);
      }
    },
    
    open(button, collapse) {
      button.setAttribute('aria-expanded', 'true');
      button.classList.remove('collapsed');
      collapse.classList.add('show');
    },
    
    close(button, collapse) {
      button.setAttribute('aria-expanded', 'false');
      button.classList.add('collapsed');
      collapse.classList.remove('show');
    }
  };

  const ScrollToTop = {
    init() {
      this.button = document.querySelector('[href="#top"], .scroll-to-top');
      
      if (!this.button) return;
      
      this.button.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  const CountUp = {
    init() {
      this.counters = document.querySelectorAll('[data-count]');
      
      if (!this.counters.length) return;
      
      this.counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count')) || 0;
        const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !counter.classList.contains('counted')) {
              counter.classList.add('counted');
              this.animate(counter, target, duration);
              observer.unobserve(counter);
            }
          });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
      });
    },
    
    animate(element, target, duration) {
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target;
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current);
        }
      }, 16);
    }
  };

  const Modal = {
    init() {
      this.triggers = document.querySelectorAll('[data-bs-toggle="modal"]');
      this.activeModal = null;
      
      this.triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          const target = trigger.getAttribute('data-bs-target') || trigger.getAttribute('href');
          this.open(target);
        });
      });
      
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') || e.target.closest('[data-bs-dismiss="modal"]')) {
          this.close();
        }
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.activeModal) {
          this.close();
        }
      });
    },
    
    open(selector) {
      const modal = document.querySelector(selector);
      if (!modal) return;
      
      this.activeModal = modal;
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      document.body.appendChild(backdrop);
    },
    
    close() {
      if (!this.activeModal) return;
      
      this.activeModal.classList.remove('show');
      this.activeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
      
      this.activeModal = null;
    }
  };

  const Carousel = {
    init() {
      this.carousels = document.querySelectorAll('[data-bs-ride="carousel"]');
      
      this.carousels.forEach(carousel => {
        const interval = parseInt(carousel.getAttribute('data-bs-interval')) || 5000;
        const items = carousel.querySelectorAll('.carousel-item');
        const indicators = carousel.querySelectorAll('[data-bs-slide-to]');
        const prevBtn = carousel.querySelector('[data-bs-slide="prev"]');
        const nextBtn = carousel.querySelector('[data-bs-slide="next"]');
        
        let currentIndex = 0;
        let autoplayTimer = null;
        
        const showSlide = (index) => {
          items.forEach(item => item.classList.remove('active'));
          indicators.forEach(indicator => {
            indicator.classList.remove('active');
            indicator.removeAttribute('aria-current');
          });
          
          items[index].classList.add('active');
          if (indicators[index]) {
            indicators[index].classList.add('active');
            indicators[index].setAttribute('aria-current', 'true');
          }
          
          currentIndex = index;
        };
        
        const next = () => {
          const nextIndex = (currentIndex + 1) % items.length;
          showSlide(nextIndex);
        };
        
        const prev = () => {
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          showSlide(prevIndex);
        };
        
        const startAutoplay = () => {
          autoplayTimer = setInterval(next, interval);
        };
        
        const stopAutoplay = () => {
          if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
          }
        };
        
        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            stopAutoplay();
            next();
            startAutoplay();
          });
        }
        
        if (prevBtn) {
          prevBtn.addEventListener('click', () => {
            stopAutoplay();
            prev();
            startAutoplay();
          });
        }
        
        indicators.forEach((indicator, index) => {
          indicator.addEventListener('click', () => {
            stopAutoplay();
            showSlide(index);
            startAutoplay();
          });
        });
        
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        
        startAutoplay();
      });
    }
  };

  const PrivacyModal = {
    init() {
      const privacyLinks = document.querySelectorAll('a[href*="privacy"]');
      
      privacyLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          if (window.location.pathname.includes('privacy')) return;
          
          const href = link.getAttribute('href');
          if (href.endsWith('.html') || href.startsWith('/')) return;
        });
      });
    }
  };

  const NetworkStatus = {
    init() {
      window.addEventListener('offline', () => {
        this.showNotification('Geen internetverbinding. Controleer uw netwerk.', 'error');
      });
      
      window.addEventListener('online', () => {
        this.showNotification('Verbinding hersteld.', 'success');
      });
    },
    
    showNotification(message, type) {
      const existing = document.querySelector('.network-notification');
      if (existing) existing.remove();
      
      const notification = document.createElement('div');
      notification.className = `network-notification alert alert-${type === 'error' ? 'warning' : 'info'}`;
      notification.textContent = message;
      notification.style.cssText = 'position:fixed;top:80px;right:20px;z-index:9999;min-width:250px;';
      
      document.body.appendChild(notification);
      
      setTimeout(() => notification.remove(), 4000);
    }
  };

  const ButtonRipple = {
    init() {
      const buttons = document.querySelectorAll('.c-button, .btn');
      
      buttons.forEach(button => {
        button.addEventListener('mousedown', (e) => {
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          button.classList.add('ripple-active');
          
          setTimeout(() => {
            button.classList.remove('ripple-active');
          }, 600);
        });
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    MobileMenu.init();
    ScrollSpy.init();
    SmoothScroll.init();
    FormValidation.init();
    Accordion.init();
    ScrollToTop.init();
    CountUp.init();
    Modal.init();
    Carousel.init();
    PrivacyModal.init();
    NetworkStatus.init();
    ButtonRipple.init();
  });

})();
