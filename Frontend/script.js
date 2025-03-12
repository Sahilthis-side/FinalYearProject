
        // This script tag will be replaced with actual scripts.head content
        if (window.scripts && window.scripts.head) {
          document.getElementById('header-scripts').outerHTML = window.scripts.head;
        }
      

      // render the settings object
      //console.log('settings', [object Object]);
      document.addEventListener('DOMContentLoaded', function() {
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                primary: {
                  DEFAULT: '#1E88E5',
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
                  DEFAULT: '#0D47A1',
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
                sans: ['Poppins, sans-serif', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
                heading: ['Inter, sans-serif', 'Inter', 'system-ui', 'sans-serif'],
                body: ['Inter, sans-serif', 'Inter', 'system-ui', 'sans-serif'],
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
              animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'fade-out': 'fadeOut 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
                'slide-left': 'slideLeft 0.5s ease-out',
                'slide-right': 'slideRight 0.5s ease-out',
                'scale-in': 'scaleIn 0.5s ease-out',
                'scale-out': 'scaleOut 0.5s ease-out',
                'spin-slow': 'spin 3s linear infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 3s infinite',
                'float': 'float 3s ease-in-out infinite',
              },
              keyframes: {
                fadeIn: {
                  '0%': { opacity: '0' },
                  '100%': { opacity: '1' },
                },
                fadeOut: {
                  '0%': { opacity: '1' },
                  '100%': { opacity: '0' },
                },
                slideUp: {
                  '0%': { transform: 'translateY(20px)', opacity: '0' },
                  '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                  '0%': { transform: 'translateY(-20px)', opacity: '0' },
                  '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideLeft: {
                  '0%': { transform: 'translateX(20px)', opacity: '0' },
                  '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideRight: {
                  '0%': { transform: 'translateX(-20px)', opacity: '0' },
                  '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                scaleIn: {
                  '0%': { transform: 'scale(0.9)', opacity: '0' },
                  '100%': { transform: 'scale(1)', opacity: '1' },
                },
                scaleOut: {
                  '0%': { transform: 'scale(1.1)', opacity: '0' },
                  '100%': { transform: 'scale(1)', opacity: '1' },
                },
                float: {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-10px)' },
                },
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
      

    document.addEventListener('DOMContentLoaded', function() {
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      const closeMenuButton = document.getElementById('close-menu-button');
      const mobileMenu = document.getElementById('mobile-menu');
      const mobileMenuLinks = mobileMenu.querySelectorAll('a');
      
      // Function to toggle mobile menu
      function toggleMobileMenu() {
        if (mobileMenu.classList.contains('translate-x-full')) {
          mobileMenu.classList.remove('translate-x-full');
          mobileMenu.classList.add('translate-x-0');
        } else {
          mobileMenu.classList.remove('translate-x-0');
          mobileMenu.classList.add('translate-x-full');
        }
      }
      
      // Event listeners
      mobileMenuButton.addEventListener('click', toggleMobileMenu);
      closeMenuButton.addEventListener('click', toggleMobileMenu);
      
      // Close mobile menu when a link is clicked
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', toggleMobileMenu);
      });
      
      // Add event listener for scroll to make navbar background opaque when scrolled
      window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 10) {
          header.classList.add('bg-opacity-95', 'shadow-lg');
        } else {
          header.classList.remove('bg-opacity-95', 'shadow-lg');
        }
      });
    });
  

        document.addEventListener('DOMContentLoaded', function() {
          // Animate the scanner line effect
          function scannerAnimation() {
            const scannerLine = document.getElementById('scanner-line');
            
            if (scannerLine) {
              scannerLine.style.opacity = '1';
              scannerLine.style.transition = 'transform 1.5s ease-in-out';
              scannerLine.style.transform = 'translateY(10px)';
              
              setTimeout(() => {
                scannerLine.style.opacity = '0';
                scannerLine.style.transform = 'translateY(0)';
                
                setTimeout(scannerAnimation, 3000);
              }, 1500);
            }
          }
          
          // Animate question bubbles
          function questionBubbleAnimation() {
            const bubble1 = document.getElementById('question-bubble-1');
            const bubble2 = document.getElementById('question-bubble-2');
            
            if (bubble1 && bubble2) {
              // Animate bubble 1
              bubble1.style.opacity = '1';
              bubble1.style.transition = 'all 1s ease-out';
              bubble1.style.transform = 'translate(15px, -15px)';
              
              // Animate bubble 2 with delay
              setTimeout(() => {
                bubble2.style.opacity = '1';
                bubble2.style.transition = 'all 1s ease-out';
                bubble2.style.transform = 'translate(-15px, -10px)';
                
                // Reset after animation completes
                setTimeout(() => {
                  bubble1.style.opacity = '0';
                  bubble1.style.transform = 'translate(0, 0)';
                  bubble2.style.opacity = '0';
                  bubble2.style.transform = 'translate(0, 0)';
                  
                  // Restart animation
                  setTimeout(questionBubbleAnimation, 1000);
                }, 2000);
              }, 500);
            }
          }
          
          // Animate meter gauge
          function meterAnimation() {
            const gauge = document.getElementById('meter-gauge');
            
            if (gauge) {
              gauge.style.transition = 'transform 2s ease-in-out';
              gauge.style.transform = 'rotate(270deg)';
              
              setTimeout(() => {
                gauge.style.transform = 'rotate(0deg)';
                
                setTimeout(meterAnimation, 3000);
              }, 2000);
            }
          }
          
          // Animate email notification
          function emailNotificationAnimation() {
            const notification = document.getElementById('email-notification');
            
            if (notification) {
              notification.style.opacity = '1';
              notification.style.transition = 'all 0.5s ease-in-out';
              notification.style.transform = 'scale(1.2)';
              
              setTimeout(() => {
                notification.style.transform = 'scale(1)';
                
                setTimeout(() => {
                  notification.style.opacity = '0';
                  
                  setTimeout(emailNotificationAnimation, 3000);
                }, 1000);
              }, 500);
            }
          }
          
          // Animate stats with count up
          function animateStats() {
            const targets = [
              { id: 'stat-1', target: 42 },
              { id: 'stat-2', target: 68 },
              { id: 'stat-3', target: 1200 },
              { id: 'stat-4', target: 50000 }
            ];
            
            targets.forEach(item => {
              const element = document.getElementById(item.id);
              if (!element) return;
              
              let current = 0;
              const target = item.target;
              const increment = Math.ceil(target / 40);
              const duration = 2000;
              const stepTime = Math.floor(duration / (target / increment));
              
              const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                  element.textContent = item.id === 'stat-2' ? target + '%' : target.toLocaleString();
                  clearInterval(counter);
                } else {
                  element.textContent = item.id === 'stat-2' ? current + '%' : current.toLocaleString();
                }
              }, stepTime);
            });
          }
          
          // Create network grid animation
          function createNetworkGrid() {
            const container = document.getElementById('network-grid');
            if (!container) return;
            
            // Creating SVG for network grid
            container.innerHTML = `
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59, 130, 246, 0.2)" stroke-width="0.5"></path>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                <circle id="node1" cx="10%" cy="20%" r="2" fill="#3B82F6" opacity="0.7" />
                <circle id="node2" cx="30%" cy="50%" r="2" fill="#3B82F6" opacity="0.7" />
                <circle id="node3" cx="50%" cy="30%" r="2" fill="#3B82F6" opacity="0.7" />
                <circle id="node4" cx="70%" cy="60%" r="2" fill="#3B82F6" opacity="0.7" />
                <circle id="node5" cx="85%" cy="25%" r="2" fill="#3B82F6" opacity="0.7" />
                
                <line id="line1-2" x1="10%" y1="20%" x2="30%" y2="50%" stroke="#3B82F6" stroke-width="0.5" opacity="0" />
                <line id="line2-3" x1="30%" y1="50%" x2="50%" y2="30%" stroke="#3B82F6" stroke-width="0.5" opacity="0" />
                <line id="line3-4" x1="50%" y1="30%" x2="70%" y2="60%" stroke="#3B82F6" stroke-width="0.5" opacity="0" />
                <line id="line4-5" x1="70%" y1="60%" x2="85%" y2="25%" stroke="#3B82F6" stroke-width="0.5" opacity="0" />
                <line id="line5-1" x1="85%" y1="25%" x2="10%" y2="20%" stroke="#3B82F6" stroke-width="0.5" opacity="0" />
              </svg>
            `;
            
            // Animate network lines
            function animateNetworkLines() {
              const lines = ['line1-2', 'line2-3', 'line3-4', 'line4-5', 'line5-1'];
              
              lines.forEach((lineId, index) => {
                setTimeout(() => {
                  const line = document.getElementById(lineId);
                  if (line) {
                    line.style.opacity = '0.5';
                    line.style.transition = 'opacity 1s ease-in-out';
                    
                    // Reset after all lines are shown
                    if (index === lines.length - 1) {
                      setTimeout(() => {
                        lines.forEach(id => {
                          const resetLine = document.getElementById(id);
                          if (resetLine) resetLine.style.opacity = '0';
                        });
                        
                        setTimeout(animateNetworkLines, 1000);
                      }, 2000);
                    }
                  }
                }, index * 500);
              });
            }
            
            animateNetworkLines();
          }
          
          // Start all animations
          scannerAnimation();
          questionBubbleAnimation();
          meterAnimation();
          emailNotificationAnimation();
          createNetworkGrid();
          
          // Initialize intersection observer for stats animation
          const statsSection = document.querySelector('#features .mt-20');
          if (statsSection) {
            const observer = new IntersectionObserver(
              (entries) => {
                if (entries[0].isIntersecting) {
                  animateStats();
                  observer.disconnect();
                }
              },
              { threshold: 0.2 }
            );
            
            observer.observe(statsSection);
          }
        });
      

        document.addEventListener('DOMContentLoaded', function() {
          // Create grid pattern for background
          function createGridPattern() {
            const container = document.getElementById('grid-pattern');
            if (!container) return;
            
            // Creating SVG for grid pattern
            container.innerHTML = `
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 255, 255, 0.05)" stroke-width="0.5"></path>
                  </pattern>
                  <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <rect width="100" height="100" fill="url(#smallGrid)"></rect>
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1"></path>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            `;
          }
          
          createGridPattern();
          
          // Animation for scan line
          function scanLineAnimation() {
            const scanLine = document.getElementById('scan-line-1');
            if (!scanLine) return;
            
            scanLine.style.opacity = '1';
            scanLine.style.transition = 'top 2s linear, opacity 0.5s ease-in-out';
            scanLine.style.top = '100%';
            
            setTimeout(() => {
              scanLine.style.opacity = '0';
              setTimeout(() => {
                scanLine.style.transition = 'none';
                scanLine.style.top = '0';
                setTimeout(scanLineAnimation, 500);
              }, 500);
            }, 2000);
          }
          
          // Animation for match bar
          function animateMatchBar() {
            const matchBar = document.getElementById('match-bar-1');
            const matchScore = document.getElementById('match-score-1');
            if (!matchBar || !matchScore) return;
            
            let width = 0;
            const targetWidth = 85;
            const interval = setInterval(() => {
              if (width >= targetWidth) {
                clearInterval(interval);
              } else {
                width += 1;
                matchBar.style.width = width + '%';
                matchScore.textContent = width + '%';
              }
            }, 20);
          }
          
          // Animation for question generation
          function animateQuestionGeneration() {
            const questions = [
              document.getElementById('question-1'),
              document.getElementById('question-2'),
              document.getElementById('question-3')
            ];
            
            const genBar = document.getElementById('gen-bar');
            const genProgress = document.getElementById('gen-progress');
            
            if (!questions[0] || !genBar || !genProgress) return;
            
            let currentQuestion = 0;
            let width = 0;
            
            const barInterval = setInterval(() => {
              if (width >= 100) {
                clearInterval(barInterval);
              } else {
                width += 5;
                genBar.style.width = width + '%';
                
                if (width % 20 === 0 && currentQuestion < questions.length) {
                  questions[currentQuestion].style.transition = 'all 0.5s ease-in-out';
                  questions[currentQuestion].style.opacity = '1';
                  questions[currentQuestion].style.transform = 'translateY(0)';
                  
                  genProgress.textContent = (currentQuestion + 1) + '/5';
                  
                  currentQuestion++;
                }
              }
            }, 200);
          }
          
          // Typing animation
          function typingAnimation() {
            const typingText = document.getElementById('typing-text');
            const typingCursor = document.getElementById('typing-cursor');
            if (!typingText || !typingCursor) return;
            
            const text = "I have 3+ years of experience implementing machine learning models using TensorFlow and PyTorch in production environments...";
            let charIndex = 0;
            
            typingCursor.style.animation = 'blink 1s step-end infinite';
            
            const interval = setInterval(() => {
              if (charIndex < text.length) {
                typingText.textContent += text.charAt(charIndex);
                charIndex++;
                typingCursor.style.left = `${typingText.offsetWidth + 16}px`;
              } else {
                clearInterval(interval);
              }
            }, 50);
          }
          
          // Score animation
          function animateScores() {
            const technicalScore = document.getElementById('technical-score');
            const softScore = document.getElementById('soft-score');
            const technicalText = document.getElementById('technical-score-text');
            const softText = document.getElementById('soft-score-text');
            
            if (!technicalScore || !softScore || !technicalText || !softText) return;
            
            let techWidth = 0;
            let softWidth = 0;
            const techTarget = 92;
            const softTarget = 85;
            
            const techInterval = setInterval(() => {
              if (techWidth >= techTarget) {
                clearInterval(techInterval);
              } else {
                techWidth += 1;
                technicalScore.style.width = techWidth + '%';
                technicalText.textContent = techWidth + '%';
              }
            }, 20);
            
            const softInterval = setInterval(() => {
              if (softWidth >= softTarget) {
                clearInterval(softInterval);
              } else {
                softWidth += 1;
                softScore.style.width = softWidth + '%';
                softText.textContent = softWidth + '%';
              }
            }, 20);
          }
          
          // Animate AI insights
          function animateInsights() {
            const insightsContainer = document.getElementById('insights-container');
            if (!insightsContainer) return;
            
            setTimeout(() => {
              insightsContainer.innerHTML = `
                <div class="text-xs text-white">• Strong problem-solving skills demonstrated in algorithm question</div>
                <div class="text-xs text-white">• Excellent understanding of system architecture concepts</div>
                <div class="text-xs text-white">• Consider further assessment of team collaboration approach</div>
              `;
            }, 2000);
          }
          
          // Animate candidate rankings
          function animateCandidateRankings() {
            const rankings = document.querySelectorAll('#candidate-rankings > div');
            
            rankings.forEach((ranking, index) => {
              setTimeout(() => {
                ranking.style.transition = 'all 0.5s ease-in-out';
                ranking.style.opacity = '1';
                ranking.style.transform = 'translateY(0)';
              }, 500 * index);
            });
          }
          
          // Animate AI recommendation typing effect
          function animateRecommendation() {
            const recommendation = document.getElementById('ai-recommendation');
            if (!recommendation) return;
            
            const text = recommendation.textContent;
            recommendation.textContent = '';
            
            let charIndex = 0;
            const interval = setInterval(() => {
              if (charIndex < text.length) {
                recommendation.textContent += text.charAt(charIndex);
                charIndex++;
              } else {
                clearInterval(interval);
              }
            }, 30);
          }
          
          // Set up intersection observers for step animations
          function setupObservers() {
            const step1 = document.getElementById('step-1');
            const step2 = document.getElementById('step-2');
            const step3 = document.getElementById('step-3');
            const step4 = document.getElementById('step-4');
            const step5 = document.getElementById('step-5');
            
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  if (entry.target.id === 'step-1') {
                    scanLineAnimation();
                    setTimeout(animateMatchBar, 2000);
                  } else if (entry.target.id === 'step-2') {
                    animateQuestionGeneration();
                  } else if (entry.target.id === 'step-3') {
                    typingAnimation();
                  } else if (entry.target.id === 'step-4') {
                    animateScores();
                    animateInsights();
                  } else if (entry.target.id === 'step-5') {
                    animateCandidateRankings();
                    setTimeout(animateRecommendation, 1500);
                  }
                  observer.unobserve(entry.target);
                }
              });
            }, { threshold: 0.2 });
            
            if (step1) observer.observe(step1);
            if (step2) observer.observe(step2);
            if (step3) observer.observe(step3);
            if (step4) observer.observe(step4);
            if (step5) observer.observe(step5);
          }
          
          // Add pulse animation
          const style = document.createElement('style');
          style.textContent = `
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
            
            .pulse-animation {
              animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            
            @keyframes pulse {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.1; }
            }
          `;
          document.head.appendChild(style);
          
          // Start the animations based on scroll position
          setupObservers();
        });
      

        document.addEventListener('DOMContentLoaded', function() {
          // Create particles for background
          function createParticles() {
            const container = document.getElementById('particles-container');
            if (!container) return;
            
            // Create particles
            for (let i = 0; i < 50; i++) {
              const particle = document.createElement('div');
              
              // Random size
              const size = Math.random() * 4 + 1;
              
              // Random position
              const posX = Math.random() * 100;
              const posY = Math.random() * 100;
              
              // Random color - blues and purples
              const colors = ['bg-blue-400', 'bg-blue-500', 'bg-purple-400', 'bg-purple-500', 'bg-indigo-400'];
              const color = colors[Math.floor(Math.random() * colors.length)];
              
              // Random opacity
              const opacity = (Math.random() * 50 + 10) / 100;
              
              // Set particle styles
              particle.className = `absolute rounded-full ${color} opacity-${Math.round(opacity * 100)}`;
              particle.style.width = `${size}px`;
              particle.style.height = `${size}px`;
              particle.style.left = `${posX}%`;
              particle.style.top = `${posY}%`;
              particle.style.boxShadow = `0 0 ${size * 2}px rgba(${color === 'bg-blue-400' || color === 'bg-blue-500' ? '59, 130, 246' : '139, 92, 246'}, ${opacity})`;
              
              // Add animation data
              particle.dataset.speedX = Math.random() * 0.5 - 0.25;
              particle.dataset.speedY = Math.random() * 0.5 - 0.25;
              particle.dataset.x = posX;
              particle.dataset.y = posY;
              
              container.appendChild(particle);
            }
            
            animateParticles();
          }
          
          // Animate particles
          function animateParticles() {
            const particles = document.querySelectorAll('#particles-container > div');
            
            particles.forEach(particle => {
              let x = parseFloat(particle.dataset.x);
              let y = parseFloat(particle.dataset.y);
              const speedX = parseFloat(particle.dataset.speedX);
              const speedY = parseFloat(particle.dataset.speedY);
              
              x += speedX;
              y += speedY;
              
              // Boundary check
              if (x < 0) x = 100;
              if (x > 100) x = 0;
              if (y < 0) y = 100;
              if (y > 100) y = 0;
              
              particle.dataset.x = x;
              particle.dataset.y = y;
              
              particle.style.left = `${x}%`;
              particle.style.top = `${y}%`;
            });
            
            requestAnimationFrame(animateParticles);
          }
          
          // Animate moving dots along SVG paths
          function animateCircuitDots() {
            const dot1 = document.getElementById('moving-dot-1');
            const dot2 = document.getElementById('moving-dot-2');
            
            if (!dot1 || !dot2) return;
            
            // Path 1: M0,30 Q30,30 30,50 T60,70 T100,50
            // Path 2: M0,70 Q40,70 40,50 T70,30 T100,50
            
            let progress1 = 0;
            let progress2 = 0;
            
            function updateDot1Position() {
              // This is a simplified path calculation
              const t = progress1 / 100;
              
              // Bezier curve approximation
              let x, y;
              if (t < 0.33) {
                // First segment
                const segmentT = t * 3;
                x = segmentT * 30;
                y = 30;
              } else if (t < 0.66) {
                // Second segment
                const segmentT = (t - 0.33) * 3;
                x = 30 + segmentT * 30;
                y = 50 + segmentT * 20;
              } else {
                // Third segment
                const segmentT = (t - 0.66) * 3;
                x = 60 + segmentT * 40;
                y = 70 - segmentT * 20;
              }
              
              dot1.style.left = `${x}%`;
              dot1.style.top = `${y}%`;
              
              progress1 = (progress1 + 0.5) % 100;
              requestAnimationFrame(updateDot1Position);
            }
            
            function updateDot2Position() {
              // This is a simplified path calculation
              const t = progress2 / 100;
              
              // Bezier curve approximation
              let x, y;
              if (t < 0.33) {
                // First segment
                const segmentT = t * 3;
                x = segmentT * 40;
                y = 70;
              } else if (t < 0.66) {
                // Second segment
                const segmentT = (t - 0.33) * 3;
                x = 40 + segmentT * 30;
                y = 50 - segmentT * 20;
              } else {
                // Third segment
                const segmentT = (t - 0.66) * 3;
                x = 70 + segmentT * 30;
                y = 30 + segmentT * 20;
              }
              
              dot2.style.left = `${x}%`;
              dot2.style.top = `${y}%`;
              
              progress2 = (progress2 + 0.5) % 100;
              requestAnimationFrame(updateDot2Position);
            }
            
            updateDot1Position();
            updateDot2Position();
          }
          
          // Email input micro-animation
          function setupEmailAnimation() {
            const input = document.querySelector('#cta input');
            const pulse = document.getElementById('email-pulse');
            
            if (!input || !pulse) return;
            
            input.addEventListener('focus', () => {
              pulse.style.opacity = '1';
              pulse.style.animation = 'pulse 1.5s infinite';
            });
            
            input.addEventListener('blur', () => {
              pulse.style.opacity = '0';
              pulse.style.animation = 'none';
            });
            
            // Add keypress animation
            input.addEventListener('input', () => {
              pulse.style.transform = 'translate(-50%, -50%) scale(1.5)';
              setTimeout(() => {
                pulse.style.transform = 'translate(-50%, -50%) scale(1)';
              }, 100);
            });
          }
          
          // Button ripple effect
          function setupButtonRipple() {
            const button = document.getElementById('cta-button');
            const ripple = document.getElementById('button-ripple');
            
            if (!button || !ripple) return;
            
            button.addEventListener('click', () => {
              // Trigger ripple animation
              ripple.style.width = '300px';
              ripple.style.height = '300px';
              ripple.style.opacity = '0.3';
              ripple.style.transition = 'all 0.6s ease-out';
              
              setTimeout(() => {
                ripple.style.width = '0';
                ripple.style.height = '0';
                ripple.style.opacity = '0';
                ripple.style.transition = 'opacity 0.3s ease-out';
              }, 600);
              
              // Simulate form submission
              const input = document.querySelector('#cta input');
              if (input && input.value) {
                button.innerHTML = '<span class="flex items-center justify-center"><svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...</span>';
                
                setTimeout(() => {
                  button.innerHTML = '<span class="flex items-center justify-center"><svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>Thank you!</span>';
                }, 1500);
              }
            });
          }
          
          // Add pulse animation
          const style = document.createElement('style');
          style.textContent = `
            @keyframes pulse {
              0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
              50% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
            }
          `;
          document.head.appendChild(style);
          
          // Initialize animations
          createParticles();
          animateCircuitDots();
          setupEmailAnimation();
          setupButtonRipple();
        });
      

    document.addEventListener('DOMContentLoaded', function() {
      // FAQ Accordion Functionality
      const faqToggles = document.querySelectorAll('.faq-toggle');
      
      faqToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
          const content = this.nextElementSibling;
          const icon = this.querySelector('.faq-icon');
          const isExpanded = this.getAttribute('aria-expanded') === 'true';
          
          // Close all other FAQs
          faqToggles.forEach(otherToggle => {
            if (otherToggle !== toggle) {
              const otherContent = otherToggle.nextElementSibling;
              const otherIcon = otherToggle.querySelector('.faq-icon');
              
              otherToggle.setAttribute('aria-expanded', 'false');
              otherContent.classList.add('hidden');
              otherIcon.classList.remove('rotate-180');
            }
          });
          
          // Toggle current FAQ
          if (isExpanded) {
            this.setAttribute('aria-expanded', 'false');
            content.classList.add('hidden');
            icon.classList.remove('rotate-180');
          } else {
            this.setAttribute('aria-expanded', 'true');
            content.classList.remove('hidden');
            icon.classList.add('rotate-180');
          }
        });
      });
      
      // Optional: Open first FAQ by default
      // if (faqToggles.length > 0) {
      //   const firstToggle = faqToggles[0];
      //   const firstContent = firstToggle.nextElementSibling;
      //   const firstIcon = firstToggle.querySelector('.faq-icon');
        
      //   firstToggle.setAttribute('aria-expanded', 'true');
      //   firstContent.classList.remove('hidden');
      //   firstIcon.classList.add('rotate-180');
      // }
      
      // Intersection Observer for animations
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate__animated');
            entry.target.classList.add('animate__fadeInUp');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      document.querySelectorAll('.faq-toggle').forEach(toggle => {
        observer.observe(toggle.parentElement);
      });
    });
  

    document.addEventListener('DOMContentLoaded', function() {
      // Back to Top Button
      const backToTopButton = document.getElementById('back-to-top');
      
      window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
          backToTopButton.classList.remove('opacity-0', 'invisible');
          backToTopButton.classList.add('opacity-100', 'visible');
        } else {
          backToTopButton.classList.remove('opacity-100', 'visible');
          backToTopButton.classList.add('opacity-0', 'invisible');
        }
      });
      
      backToTopButton.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
      
      // Current Year for Copyright
      const yearSpan = document.querySelector('.copyright-year');
      if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
      }
    });
  