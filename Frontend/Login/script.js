// This script tag will be replaced with actual scripts.head content
if (window.scripts && window.scripts.head) {
  document.getElementById("header-scripts").outerHTML = window.scripts.head;
}

// render the settings object
//console.log('settings', [object Object]);
document.addEventListener("DOMContentLoaded", function () {
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: "#3B82F6",
            50: "#f8f8f8",
            100: "#e8e8e8",
            200: "#d3d3d3",
            300: "#a3a3a3",
            400: "#737373",
            500: "#525252",
            600: "#404040",
            700: "#262626",
            800: "#171717",
            900: "#0a0a0a",
            950: "#030303",
          },
          secondary: {
            DEFAULT: "#8B5CF6",
            50: "#f8f8f8",
            100: "#e8e8e8",
            200: "#d3d3d3",
            300: "#a3a3a3",
            400: "#737373",
            500: "#525252",
            600: "#404040",
            700: "#262626",
            800: "#171717",
            900: "#0a0a0a",
            950: "#030303",
          },
          accent: {
            DEFAULT: "",
            50: "#f8f8f8",
            100: "#e8e8e8",
            200: "#d3d3d3",
            300: "#a3a3a3",
            400: "#737373",
            500: "#525252",
            600: "#404040",
            700: "#262626",
            800: "#171717",
            900: "#0a0a0a",
            950: "#030303",
          },
        },
        fontFamily: {
          sans: [
            "Sora",
            "Inter",
            "system-ui",
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Helvetica Neue",
            "Arial",
            "sans-serif",
          ],
          heading: ["Inter", "Inter", "system-ui", "sans-serif"],
          body: ["Inter", "Inter", "system-ui", "sans-serif"],
        },
        spacing: {
          18: "4.5rem",
          22: "5.5rem",
          30: "7.5rem",
        },
        maxWidth: {
          "8xl": "88rem",
          "9xl": "96rem",
        },
        animation: {
          "fade-in": "fadeIn 0.5s ease-in",
          "fade-out": "fadeOut 0.5s ease-out",
          "slide-up": "slideUp 0.5s ease-out",
          "slide-down": "slideDown 0.5s ease-out",
          "slide-left": "slideLeft 0.5s ease-out",
          "slide-right": "slideRight 0.5s ease-out",
          "scale-in": "scaleIn 0.5s ease-out",
          "scale-out": "scaleOut 0.5s ease-out",
          "spin-slow": "spin 3s linear infinite",
          "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          "bounce-slow": "bounce 3s infinite",
          float: "float 3s ease-in-out infinite",
        },
        keyframes: {
          fadeIn: {
            "0%": { opacity: "0" },
            "100%": { opacity: "1" },
          },
          fadeOut: {
            "0%": { opacity: "1" },
            "100%": { opacity: "0" },
          },
          slideUp: {
            "0%": { transform: "translateY(20px)", opacity: "0" },
            "100%": { transform: "translateY(0)", opacity: "1" },
          },
          slideDown: {
            "0%": { transform: "translateY(-20px)", opacity: "0" },
            "100%": { transform: "translateY(0)", opacity: "1" },
          },
          slideLeft: {
            "0%": { transform: "translateX(20px)", opacity: "0" },
            "100%": { transform: "translateX(0)", opacity: "1" },
          },
          slideRight: {
            "0%": { transform: "translateX(-20px)", opacity: "0" },
            "100%": { transform: "translateX(0)", opacity: "1" },
          },
          scaleIn: {
            "0%": { transform: "scale(0.9)", opacity: "0" },
            "100%": { transform: "scale(1)", opacity: "1" },
          },
          scaleOut: {
            "0%": { transform: "scale(1.1)", opacity: "0" },
            "100%": { transform: "scale(1)", opacity: "1" },
          },
          float: {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-10px)" },
          },
        },
        aspectRatio: {
          portrait: "3/4",
          landscape: "4/3",
          ultrawide: "21/9",
        },
      },
    },
    variants: {
      extend: {
        opacity: ["disabled"],
        cursor: ["disabled"],
        backgroundColor: ["active", "disabled"],
        textColor: ["active", "disabled"],
      },
    },
  };
});







// Form toggle functionality
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const toggleSignup = document.getElementById("toggle-signup");
  const toggleLogin = document.getElementById("toggle-login");
  const openMenuBtn = document.getElementById('mobile-menu-button');
  const closeMenuBtn = document.getElementById('close-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  openMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden');
  });

  closeMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  });

  // Toggle to signup form
  toggleSignup.addEventListener("click", function () {
    window.location.href = "../Signup/index.html";
  });

  // Toggle to login form
  toggleLogin.addEventListener("click", function () {
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  });

  // Show/hide password functionality
  const togglePasswordButtons = document.querySelectorAll(
    'button[aria-label="Toggle password visibility"]'
  );

  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.previousElementSibling;
      const type =
        input.getAttribute("type") === "password" ? "text" : "password";
      input.setAttribute("type", type);

      // Toggle eye icon
      const svg = this.querySelector("svg");
      if (type === "text") {
        svg.innerHTML = `
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            `;
      } else {
        svg.innerHTML = `
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            `;
      }
    });
  });
});

// Initialize particles background
document.addEventListener("DOMContentLoaded", function () {
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#3b82f6",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
          polygon: {
            nb_sides: 5,
          },
        },
        opacity: {
          value: 0.2,
          random: true,
          anim: {
            enable: true,
            speed: 0.5,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#8b5cf6",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 0.6,
            },
          },
          push: {
            particles_nb: 4,
          },
        },
      },
      retina_detect: true,
    });
  } else {
    console.warn("particles.js not loaded");

    // Fallback animation (if particles.js is not available)
    const particlesEl = document.getElementById("particles-js");
    if (particlesEl) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.classList.add(
          "absolute",
          "rounded-full",
          "bg-blue-500",
          "opacity-10"
        );

        // Random size
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        // Random animation
        particle.style.animation = `float ${Math.random() * 10 + 10
          }s linear infinite`;
        particle.style.animationDelay = `${Math.random() * 5}s`;

        particlesEl.appendChild(particle);
      }
    }
  }
});

// Form validation
document.addEventListener("DOMContentLoaded", function () {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    const emailInputs = form.querySelectorAll('input[type="email"]');
    const passwordInputs = form.querySelectorAll('input[type="password"]');

    emailInputs.forEach((input) => {
      input.addEventListener("blur", function () {
        validateEmail(this);
      });
    });

    passwordInputs.forEach((input) => {
      input.addEventListener("blur", function () {
        if (this.value.length < 8) {
          this.classList.add("border-red-500");
          this.classList.remove("border-neutral-600");
        } else {
          this.classList.remove("border-red-500");
          this.classList.add("border-neutral-600");
        }
      });
    });

    // Check if confirmPassword exists and add validation
    const confirmPassword = form.querySelector("#confirm-password");
    const password = form.querySelector("#signup-password");

    if (confirmPassword && password) {
      confirmPassword.addEventListener("blur", function () {
        if (this.value !== password.value) {
          this.classList.add("border-red-500");
          this.classList.remove("border-neutral-600");
        } else {
          this.classList.remove("border-red-500");
          this.classList.add("border-neutral-600");
        }
      });
    }
  });

  function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value)) {
      input.classList.add("border-red-500");
      input.classList.remove("border-neutral-600");
    } else {
      input.classList.remove("border-red-500");
      input.classList.add("border-neutral-600");
    }
  }
});

// Add glowing input field animations
document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll("input");

  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement
        .querySelector("div.absolute")
        .classList.add("opacity-100");
    });

    input.addEventListener("blur", function () {
      this.parentElement
        .querySelector("div.absolute")
        .classList.remove("opacity-100");
    });
  });
});

// Dark mode toggle
document.addEventListener("DOMContentLoaded", function () {
  const darkModeToggle = document.querySelector(
    "button.absolute.top-6.right-6"
  );
  const html = document.documentElement;

  darkModeToggle.addEventListener("click", function () {
    html.classList.toggle("dark");

    // Update icon
    const svg = this.querySelector("svg");
    if (html.classList.contains("dark")) {
      svg.innerHTML = `
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
          `;
    } else {
      svg.innerHTML = `
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          `;
    }
  });
});
