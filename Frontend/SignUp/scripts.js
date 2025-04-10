// This script tag will be replaced with actual scripts.head content
if (window.scripts && window.scripts.head) {
  document.getElementById('header-scripts').outerHTML = window.scripts.head;
}

// render the settings object
//console.log('settings', [object Object]);
document.addEventListener('DOMContentLoaded', function () {
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#3A86FF',
            50: '#f8f8f8',
            100: '#e8e8e8',
            200: '#d3d3d3',
            300: '#a3a3a3',
            400: '#737373',
            500: '#525252',
            600: '#404040',
            700: '#262626',
            800: '#171717',
            900: '#0a0a0a',
            950: '#030303',
          },
          secondary: {
            DEFAULT: '#8338EC',
            50: '#f8f8f8',
            100: '#e8e8e8',
            200: '#d3d3d3',
            300: '#a3a3a3',
            400: '#737373',
            500: '#525252',
            600: '#404040',
            700: '#262626',
            800: '#171717',
            900: '#0a0a0a',
            950: '#030303',
          },
          accent: {
            DEFAULT: '',
            50: '#f8f8f8',
            100: '#e8e8e8',
            200: '#d3d3d3',
            300: '#a3a3a3',
            400: '#737373',
            500: '#525252',
            600: '#404040',
            700: '#262626',
            800: '#171717',
            900: '#0a0a0a',
            950: '#030303',
          },
        },
        fontFamily: {
          sans: ['Sora', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
          heading: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
          body: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        },
        spacing: {
          '18': '4.5rem',
          '22': '5.5rem',
          '30': '7.5rem',
        },
        maxWidth: {
          '8xl': '88rem',
          '9xl': '96rem',
        },
        aspectRatio: {
          'portrait': '3/4',
          'landscape': '4/3',
          'ultrawide': '21/9',
        },
      },
    },
    variants: {
      extend: {
        opacity: ['disabled'],
        cursor: ['disabled'],
        backgroundColor: ['active', 'disabled'],
        textColor: ['active', 'disabled'],
      },
    },
  }
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenuCloseButton = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', !isHidden);
    document.body.style.overflow = isHidden ? 'hidden' : '';
  };

  // Event listeners for mobile menu buttons
  mobileMenuButton.addEventListener('click', toggleMobileMenu);
  mobileMenuCloseButton.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when clicking outside
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      toggleMobileMenu();
    }
  });

  // Close mobile menu on escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      toggleMobileMenu();
    }
  });
}); 

// Mobile Menu Functionality
const MobileMenu = {
  init() {
    this.mobileMenuButton = document.getElementById('mobile-menu-button');
    this.closeMenuButton = document.getElementById('close-menu-button');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.setupEventListeners();
  },

  setupEventListeners() {
    if (this.mobileMenuButton && this.closeMenuButton && this.mobileMenu) {
      this.mobileMenuButton.addEventListener('click', () => this.toggleMenu(true));
      this.closeMenuButton.addEventListener('click', () => this.toggleMenu(false));
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.mobileMenu.classList.contains('flex') && 
            !this.mobileMenu.contains(e.target) && 
            !this.mobileMenuButton.contains(e.target)) {
          this.toggleMenu(false);
        }
      });

      // Close menu on ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.mobileMenu.classList.contains('flex')) {
          this.toggleMenu(false);
        }
      });
    }
  },

  toggleMenu(show) {
    if (show) {
      this.mobileMenu.classList.remove('hidden');
      this.mobileMenu.classList.add('flex');
      this.mobileMenuButton.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      this.mobileMenu.classList.add('hidden');
      this.mobileMenu.classList.remove('flex');
      this.mobileMenuButton.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }
};

// Initialize mobile menu
document.addEventListener('DOMContentLoaded', () => {
  MobileMenu.init();
});

// Theme switching functionality
const themeToggleBtn = document.getElementById('themeToggle');
const lightIcon = document.getElementById('lightIcon');
const darkIcon = document.getElementById('darkIcon');
const htmlElement = document.documentElement;

let isDarkMode = true; // Starting with dark mode

themeToggleBtn.addEventListener('click', toggleTheme);

function toggleTheme() {
  isDarkMode = !isDarkMode;

  if (isDarkMode) {
    // Switch to dark mode
    htmlElement.classList.add('dark');
    document.getElementById('login').classList.remove('bg-gray-100');
    document.getElementById('login').classList.add('bg-slate-900');
    lightIcon.classList.add('hidden');
    darkIcon.classList.remove('hidden');
  } else {
    // Switch to light mode
    htmlElement.classList.remove('dark');
    document.getElementById('login').classList.remove('bg-slate-900');
    document.getElementById('login').classList.add('bg-gray-100');
    darkIcon.classList.add('hidden');
    lightIcon.classList.remove('hidden');
  }
}

// Role Selection modal handling
const roleSelectionModal = document.getElementById('roleSelectionModal');
const modalContent = document.getElementById('modalContent');

function showRoleSelection() {
  // Get the button that triggered this
  const triggerButton = document.getElementById('signupNavButton');

  // Store reference to the button
  roleSelectionModal.dataset.triggerButton = triggerButton.id;

  // Show the modal
  roleSelectionModal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');

  // Add animation after a small delay
  setTimeout(() => {
    modalContent.classList.remove('opacity-0', 'translate-y-4');
  }, 10);

  // Set focus to the modal
  modalContent.setAttribute('tabindex', '-1');
  modalContent.focus();

  // Add ESC key listener
  document.addEventListener('keydown', handleEscKey);
}

function closeRoleSelection() {
  // Get reference to the button that triggered the modal
  const triggerButtonId = roleSelectionModal.dataset.triggerButton;
  const triggerButton = document.getElementById(triggerButtonId);

  // Start closing animation
  modalContent.classList.add('opacity-0', 'translate-y-4');

  // Hide modal after animation completes
  setTimeout(() => {
    roleSelectionModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');

    // Return focus to the button that opened the modal
    if (triggerButton) {
      triggerButton.focus();
    }
  }, 300);

  // Remove ESC key listener
  document.removeEventListener('keydown', handleEscKey);
}

// Candidate signup modal handling
const candidateSignupModal = document.getElementById('candidateSignupModal');
const candidateModalContent = document.getElementById('candidateModalContent');

function showCandidateSignup() {
  // Close role selection modal
  closeRoleSelection();

  // Store reference to the current modal to return focus appropriately
  candidateSignupModal.dataset.previousModal = 'roleSelectionModal';

  // Show after a small delay to allow previous modal to close
  setTimeout(() => {
    candidateSignupModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    // Add animation
    setTimeout(() => {
      candidateModalContent.classList.remove('opacity-0', 'translate-y-4');
    }, 10);

    // Set focus to the modal
    candidateModalContent.setAttribute('tabindex', '-1');
    candidateModalContent.focus();

    // Add ESC key listener
    document.addEventListener('keydown', handleEscKey);
  }, 300);
}

// Recruiter signup modal handling
const recruiterSignupModal = document.getElementById('recruiterSignupModal');
const recruiterModalContent = document.getElementById('recruiterModalContent');

function showRecruiterSignup() {
  // Close role selection modal
  closeRoleSelection();

  // Store reference to the current modal to return focus appropriately
  recruiterSignupModal.dataset.previousModal = 'roleSelectionModal';

  // Show after a small delay to allow previous modal to close
  setTimeout(() => {
    recruiterSignupModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    // Add animation
    setTimeout(() => {
      recruiterModalContent.classList.remove('opacity-0', 'translate-y-4');
    }, 10);

    // Set focus to the modal
    recruiterModalContent.setAttribute('tabindex', '-1');
    recruiterModalContent.focus();

    // Add ESC key listener
    document.addEventListener('keydown', handleEscKey);
  }, 300);
}

function closeSignupForms() {
  // Close candidate modal if open
  if (!candidateSignupModal.classList.contains('hidden')) {
    candidateModalContent.classList.add('opacity-0', 'translate-y-4');

    setTimeout(() => {
      candidateSignupModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 300);
  }

  // Close recruiter modal if open
  if (!recruiterSignupModal.classList.contains('hidden')) {
    recruiterModalContent.classList.add('opacity-0', 'translate-y-4');

    setTimeout(() => {
      recruiterSignupModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 300);
  }

  // Return focus to login button
  const loginButton = document.getElementById('loginButton');
  if (loginButton) {
    loginButton.focus();
  }

  // Remove ESC key listener
  document.removeEventListener('keydown', handleEscKey);
}

// Handle ESC key press
function handleEscKey(e) {
  if (e.key === 'Escape') {
    // Check which modal is open and close it
    if (!roleSelectionModal.classList.contains('hidden')) {
      closeRoleSelection();
    } else if (!candidateSignupModal.classList.contains('hidden')) {
      closeSignupForms();
    } else if (!recruiterSignupModal.classList.contains('hidden')) {
      closeSignupForms();
    }
  }
}

// Implement focus trap for modals
function trapFocus(element) {
  const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      // If Shift+Tab and on first element, go to last element
      if (e.shiftKey && document.activeElement === firstFocusableElement) {
        e.preventDefault();
        lastFocusableElement.focus();
      }
      // If Tab and on last element, go to first element
      else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
        e.preventDefault();
        firstFocusableElement.focus();
      }
    }
  });
}

// Apply focus trap to all modals
trapFocus(modalContent);
trapFocus(candidateModalContent);
trapFocus(recruiterModalContent);



// Helper function for handling the candidate signup modal
function showCandidateSignup() {
  const candidateSignupModal = document.getElementById('candidateSignupModal');
  const candidateModalContent = document.getElementById('candidateModalContent');
  const candidateSignupBtn = document.getElementById('candidateSignupBtn');

  // Show the modal
  candidateSignupModal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');

  // Store reference to the button that triggered this
  candidateSignupModal.dataset.triggerButton = candidateSignupBtn.id;

  // Add animation after a small delay
  setTimeout(() => {
    candidateModalContent.classList.remove('opacity-0', 'translate-y-4');
  }, 10);

  // Set focus to the modal
  candidateModalContent.setAttribute('tabindex', '-1');
  candidateModalContent.focus();

  // Add ESC key listener
  document.addEventListener('keydown', handleEscKey);
}

// Helper function for handling the recruiter signup modal
function showRecruiterSignup() {
  const recruiterSignupModal = document.getElementById('recruiterSignupModal');
  const recruiterModalContent = document.getElementById('recruiterModalContent');
  const recruiterSignupBtn = document.getElementById('recruiterSignupBtn');

  // Show the modal
  recruiterSignupModal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');

  // Store reference to the button that triggered this
  recruiterSignupModal.dataset.triggerButton = recruiterSignupBtn.id;

  // Add animation after a small delay
  setTimeout(() => {
    recruiterModalContent.classList.remove('opacity-0', 'translate-y-4');
  }, 10);

  // Set focus to the modal
  recruiterModalContent.setAttribute('tabindex', '-1');
  recruiterModalContent.focus();

  // Add ESC key listener
  document.addEventListener('keydown', handleEscKey);
}

// Function to close signup forms
function closeSignupForms() {
  const candidateSignupModal = document.getElementById('candidateSignupModal');
  const candidateModalContent = document.getElementById('candidateModalContent');
  const recruiterSignupModal = document.getElementById('recruiterSignupModal');
  const recruiterModalContent = document.getElementById('recruiterModalContent');

  // Close candidate modal if open
  if (!candidateSignupModal.classList.contains('hidden')) {
    // Get reference to the button that triggered the modal
    const triggerButtonId = candidateSignupModal.dataset.triggerButton;
    const triggerButton = document.getElementById(triggerButtonId);

    // Start closing animation
    candidateModalContent.classList.add('opacity-0', 'translate-y-4');

    // Hide modal after animation completes
    setTimeout(() => {
      candidateSignupModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');

      // Return focus to the button that opened the modal
      if (triggerButton) {
        triggerButton.focus();
      }
    }, 300);
  }

  // Close recruiter modal if open
  if (!recruiterSignupModal.classList.contains('hidden')) {
    // Get reference to the button that triggered the modal
    const triggerButtonId = recruiterSignupModal.dataset.triggerButton;
    const triggerButton = document.getElementById(triggerButtonId);

    // Start closing animation
    recruiterModalContent.classList.add('opacity-0', 'translate-y-4');

    // Hide modal after animation completes
    setTimeout(() => {
      recruiterSignupModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');

      // Return focus to the button that opened the modal
      if (triggerButton) {
        triggerButton.focus();
      }
    }, 300);
  }

  // Remove ESC key listener
  document.removeEventListener('keydown', handleEscKey);
}

// Handle ESC key press
function handleEscKey(e) {
  if (e.key === 'Escape') {
    closeSignupForms();
  }
}

// Function to go back to login
function backToLogin() {
  // This would typically navigate back to the login page
  // For this demo, we'll just console log
  console.log('Navigating back to login page');

  // Close any open modals
  closeSignupForms();

  // In a real app, you might use:
  // window.location.href = 'login.html';
  // or
  // history.back();
}

// Implement focus trap for modals
document.querySelectorAll('#candidateModalContent, #recruiterModalContent').forEach(modal => {
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');

  if (focusableElements.length > 0) {
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        // If Shift+Tab and on first element, go to last element
        if (e.shiftKey && document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement.focus();
        }
        // If Tab and on last element, go to first element
        else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
    });
  }
});

// Set proper aria attributes when modals open/close
function updateAriaAttributes(modalId, isOpen) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.setAttribute('aria-hidden', (!isOpen).toString());
  }
}

// Make sure modals are properly set up on page load
document.addEventListener('DOMContentLoaded', function () {
  updateAriaAttributes('candidateSignupModal', false);
  updateAriaAttributes('recruiterSignupModal', false);
});



// Unified Modal Management System
const ModalManager = {
  activeModal: null,

  setupFocusTrap(modalContent) {
    const focusableElements = modalContent.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      modalContent.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
          // If Shift+Tab and on first element, go to last element
          if (e.shiftKey && document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement.focus();
          }
          // If Tab and on last element, go to first element
          else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement.focus();
          }
        }
      });
    }
  },

  show(modalId, triggerId) {
    const modal = document.getElementById(modalId);
    const modalContent = document.getElementById(`${modalId}Content`);
    const triggerButton = document.getElementById(triggerId);

    if (!modal || !modalContent) return;

    // Store current active modal
    this.activeModal = modalId;

    // Show the modal
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overflow-hidden');

    // Store trigger button reference
    modal.dataset.triggerButton = triggerId;

    // Add animation after a small delay
    setTimeout(() => {
      modalContent.classList.remove('opacity-0', 'translate-y-4');
    }, 10);

    // Set focus to the modal and setup focus trap
    modalContent.setAttribute('tabindex', '-1');
    modalContent.focus();
    this.setupFocusTrap(modalContent);

    // Add ESC key listener
    document.addEventListener('keydown', this.handleEscKey);
  },

  close(modalId) {
    const modal = document.getElementById(modalId);
    const modalContent = document.getElementById(`${modalId}Content`);

    if (!modal || !modalContent) return;

    // Get reference to the button that triggered the modal
    const triggerButtonId = modal.dataset.triggerButton;
    const triggerButton = document.getElementById(triggerButtonId);

    // Start closing animation
    modalContent.classList.add('opacity-0', 'translate-y-4');

    // Hide modal after animation completes
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('overflow-hidden');

      // Return focus to the button that opened the modal
      if (triggerButton) {
        triggerButton.focus();
      }

      // Clear active modal reference
      this.activeModal = null;
    }, 300);

    // Remove ESC key listener
    document.removeEventListener('keydown', this.handleEscKey);
  },

  handleEscKey(e) {
    if (e.key === 'Escape' && ModalManager.activeModal) {
      ModalManager.close(ModalManager.activeModal);
    }
  }
};

// Unified Password Toggle System
const PasswordToggle = {
  init() {
    this.setupToggle('password');
    this.setupToggle('confirmPassword');
  },

  setupToggle(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = document.getElementById(`toggle${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)}`);

    if (!field || !toggle) return;

    toggle.addEventListener('click', () => {
      const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
      field.setAttribute('type', type);

      // Toggle eye icon
      const eyeIcon = toggle.querySelector('svg');
      if (eyeIcon) {
        eyeIcon.innerHTML = type === 'text'
          ? this.getHiddenEyeIcon()
          : this.getVisibleEyeIcon();
      }
    });
  },

  getVisibleEyeIcon() {
    return `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      `;
  },

  getHiddenEyeIcon() {
    return `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      `;
  }
};

// Navigation System
const Navigation = {
  goToLogin() {
    window.location.href = 'login.html';
  },

  goToRoleSelection() {
    window.location.href = 'role-selection.html';
  }
};

// Form Handling System
const FormHandler = {
  init() {
    this.setupForms();
  },

  setupForms() {
    // Setup signup forms
    const forms = {
      'candidateSignupForm': this.handleSignupSubmit,
      'recruiterSignupForm': this.handleSignupSubmit,
      'contactForm': this.handleContactSubmit
    };

    Object.entries(forms).forEach(([formId, handler]) => {
      const form = document.getElementById(formId);
      if (form) {
        form.addEventListener('submit', (e) => handler.call(this, e));
      }
    });
  },

  handleSignupSubmit(e) {
    e.preventDefault();

    // Basic form validation
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Here you would normally submit the form data to your backend
    // For demo purposes, we'll just show the success modal
    ModalManager.show('successModal', 'submitBtn');
  },

  handleContactSubmit(e) {
    e.preventDefault();

    // Here you would normally submit the form data to your backend
    alert('Thank you for your message! Our support team will respond shortly.');
    ModalManager.close('contactModal');

    // Reset form
    e.target.reset();
  }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
  // Initialize systems
  PasswordToggle.init();
  FormHandler.init();

  // Setup modal triggers
  const modalTriggers = {
    'openContactBtn': 'contactModal',
    'candidateSignupBtn': 'candidateSignupModal',
    'recruiterSignupBtn': 'recruiterSignupModal',
    'testimonialsBtn': 'testimonialsModal',
    'moreTestimonialsBtn': 'testimonialsModal'
  };

  Object.entries(modalTriggers).forEach(([triggerId, modalId]) => {
    const trigger = document.getElementById(triggerId);
    if (trigger) {
      trigger.addEventListener('click', () => ModalManager.show(modalId, triggerId));
    }
  });

  // Setup navigation buttons
  const navigationButtons = {
    'backToLoginBtn': Navigation.goToLogin,
    'backToRoleSelectionBtn': Navigation.goToRoleSelection
  };

  Object.entries(navigationButtons).forEach(([buttonId, handler]) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', handler);
    }
  });
});
