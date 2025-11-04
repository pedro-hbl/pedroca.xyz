/*
 * Retro Effects and Interactions
 * Windows 95 inspired UI behaviors
 */

(function() {
  'use strict';

  // Theme removed - light mode only

  // Window Chrome Dragging (Optional easter egg)
  function initWindowDragging() {
    const titleBar = document.querySelector('.title-bar');
    const windowChrome = document.querySelector('.window-chrome');

    if (!titleBar || !windowChrome) return;

    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    titleBar.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
      if (e.target.classList.contains('title-text')) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        isDragging = true;
        titleBar.style.cursor = 'grabbing';
      }
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, windowChrome);
      }
    }

    function dragEnd() {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
      titleBar.style.cursor = 'default';
    }

    function setTranslate(xPos, yPos, el) {
      el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
  }

  // Window Control Buttons
  function initWindowControls() {
    const btnMinimize = document.querySelector('.btn-minimize');
    const btnMaximize = document.querySelector('.btn-maximize');
    const btnClose = document.querySelector('.btn-close');
    const windowChrome = document.querySelector('.window-chrome');

    if (btnMinimize) {
      btnMinimize.addEventListener('click', () => {
        windowChrome.style.transition = 'all 0.3s ease';
        windowChrome.style.transform = 'scale(0.1)';
        windowChrome.style.opacity = '0';

        setTimeout(() => {
          windowChrome.style.transform = 'scale(1)';
          windowChrome.style.opacity = '1';
        }, 300);
      });
    }

    if (btnMaximize) {
      let isMaximized = false;
      btnMaximize.addEventListener('click', () => {
        if (!isMaximized) {
          windowChrome.style.maxWidth = '100%';
          windowChrome.style.margin = '0';
          windowChrome.style.borderRadius = '0';
          isMaximized = true;
        } else {
          windowChrome.style.maxWidth = '1400px';
          windowChrome.style.margin = 'var(--space-xl) auto';
          windowChrome.style.borderRadius = 'var(--border-radius-lg)';
          isMaximized = false;
        }
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', () => {
        if (confirm('Are you sure you want to close this window?')) {
          windowChrome.style.transition = 'all 0.3s ease';
          windowChrome.style.transform = 'scale(0)';
          windowChrome.style.opacity = '0';
        }
      });
    }
  }

  // Click Sound Effects (Optional)
  function playClickSound() {
    // Create a subtle click sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  }

  // Add click sounds to buttons (optional, can be enabled via settings)
  function initClickSounds() {
    const buttons = document.querySelectorAll('button, .button, .win95-button');
    const enableSounds = localStorage.getItem('retroSounds') === 'true';

    if (enableSounds) {
      buttons.forEach(button => {
        button.addEventListener('click', playClickSound);
      });
    }
  }

  // Startup Animation
  function initStartupAnimation() {
    const windowChrome = document.querySelector('.window-chrome');
    if (!windowChrome) return;

    windowChrome.style.opacity = '0';
    windowChrome.style.transform = 'scale(0.9)';

    setTimeout(() => {
      windowChrome.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      windowChrome.style.opacity = '1';
      windowChrome.style.transform = 'scale(1)';
    }, 100);
  }

  // CRT Monitor Effect (Scanlines)
  function initCRTEffect() {
    const enableCRT = localStorage.getItem('crtEffect') === 'true';

    if (enableCRT) {
      const scanlines = document.createElement('div');
      scanlines.className = 'crt-scanlines';
      scanlines.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.15),
          rgba(0, 0, 0, 0.15) 1px,
          transparent 1px,
          transparent 2px
        );
        pointer-events: none;
        z-index: 9999;
        opacity: 0.3;
      `;
      document.body.appendChild(scanlines);
    }
  }


  // Smooth Scroll with Retro Feel
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Loading Bar Animation
  function showLoadingBar() {
    const loadingBar = document.createElement('div');
    loadingBar.className = 'win95-progress';
    loadingBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 10000;
    `;

    const progressBar = document.createElement('div');
    progressBar.className = 'win95-progress-bar';
    progressBar.style.width = '0%';

    loadingBar.appendChild(progressBar);
    document.body.appendChild(loadingBar);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          loadingBar.style.opacity = '0';
          setTimeout(() => loadingBar.remove(), 300);
        }, 200);
      }
      progressBar.style.width = progress + '%';
    }, 100);
  }

  // Easter Egg: Konami Code
  function initKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          activateEasterEgg();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    });
  }

  function activateEasterEgg() {
    // Make everything super retro!
    document.body.classList.add('full-retro', 'win95-desktop');
    localStorage.setItem('retroSounds', 'true');
    localStorage.setItem('crtEffect', 'true');

    // Show a retro dialog
    const dialog = document.createElement('div');
    dialog.className = 'win95-dialog';
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10000;
    `;
    dialog.innerHTML = `
      <div class="win95-dialog-title">
        <span>Retro Mode Activated!</span>
        <button onclick="this.parentElement.parentElement.remove()" style="width: 20px; height: 20px;">×</button>
      </div>
      <div class="win95-dialog-content">
        <p>🎮 You've unlocked FULL RETRO MODE!</p>
        <p>Reload the page to see the changes.</p>
      </div>
      <div class="win95-dialog-buttons">
        <button class="win95-button" onclick="location.reload()">OK</button>
        <button class="win95-button" onclick="this.parentElement.parentElement.remove()">Cancel</button>
      </div>
    `;
    document.body.appendChild(dialog);
  }

  // Copy Code Button for code blocks
  function initCodeCopyButtons() {
    document.querySelectorAll('pre code').forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      const button = document.createElement('button');
      button.className = 'curve-button copy-code-btn';
      button.textContent = 'Copy';
      button.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 6px 12px;
        font-size: 0.8rem;
      `;

      pre.style.position = 'relative';

      button.addEventListener('click', async () => {
        const text = codeBlock.textContent;
        try {
          await navigator.clipboard.writeText(text);
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.textContent = 'Copy';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });

      pre.appendChild(button);
    });
  }

  // Initialize all effects when DOM is ready
  function init() {
    initStartupAnimation();
    initWindowControls();
    initSmoothScroll();
    initKonamiCode();
    initCodeCopyButtons();
    initClickSounds();
    initCRTEffect();

    // Optional: Uncomment to enable window dragging
    // initWindowDragging();

    // Show loading bar on page load
    // showLoadingBar();
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
