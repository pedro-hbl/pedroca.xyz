/*
 * Main JavaScript - Core functionality
 */

(function() {
  'use strict';

  // Mobile Navigation Toggle
  function initMobileNav() {
    const nav = document.querySelector('nav, .menu-bar');
    if (!nav) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'mobile-nav-toggle';
    toggleBtn.innerHTML = '☰';
    toggleBtn.style.cssText = `
      display: none;
      @media (max-width: 768px) {
        display: block;
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 1001;
        background: var(--glass-bg-strong);
        backdrop-filter: blur(8px);
        border: 2px solid var(--glass-border);
        padding: 12px 16px;
        border-radius: 8px;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
      }
    `;

    document.body.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
      toggleBtn.innerHTML = nav.classList.contains('mobile-open') ? '×' : '☰';
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggleBtn.contains(e.target)) {
        nav.classList.remove('mobile-open');
        toggleBtn.innerHTML = '☰';
      }
    });
  }

  // Search Enhancement - Search by title, description, and tags
  function initSearch() {
    const searchInput = document.querySelector('input[type="search"], #search');
    if (!searchInput) return;

    searchInput.addEventListener('input', debounce((e) => {
      const query = e.target.value.toLowerCase().trim();
      const posts = document.querySelectorAll('.post-card');

      // If query is empty, show all posts
      if (!query) {
        posts.forEach(post => {
          post.style.display = '';
          post.classList.remove('search-match');
        });
        return;
      }

      posts.forEach(post => {
        // Get title
        const titleElement = post.querySelector('h2 a, h3 a, h2, h3');
        const title = titleElement?.textContent.toLowerCase() || '';

        // Get description/excerpt
        const descElement = post.querySelector('p');
        const description = descElement?.textContent.toLowerCase() || '';

        // Get tags
        const tagElements = post.querySelectorAll('.post-tags .retro-badge');
        const tags = Array.from(tagElements).map(tag => tag.textContent.toLowerCase()).join(' ');

        // Search in title, description, and tags
        if (title.includes(query) || description.includes(query) || tags.includes(query)) {
          post.style.display = '';
          post.classList.add('search-match');
        } else {
          post.style.display = 'none';
          post.classList.remove('search-match');
        }
      });
    }, 300));
  }

  // Debounce utility
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Image Lightbox
  function initLightbox() {
    const images = document.querySelectorAll('article img, .post-content img');

    images.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          cursor: zoom-out;
        `;

        const lightboxImg = document.createElement('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.style.cssText = `
          max-width: 90%;
          max-height: 90%;
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        `;

        lightbox.appendChild(lightboxImg);
        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', () => {
          lightbox.style.opacity = '0';
          setTimeout(() => lightbox.remove(), 300);
        });

        // Add fade-in animation
        setTimeout(() => {
          lightbox.style.transition = 'opacity 0.3s ease';
          lightbox.style.opacity = '1';
        }, 10);
      });
    });
  }

  // Reading Progress Bar
  function initReadingProgress() {
    const article = document.querySelector('article, .post-content');
    if (!article) return;

    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: var(--gradient-retro);
      z-index: 9999;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

      progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    });
  }

  // Table of Contents (Auto-generate)
  function initTOC() {
    const article = document.querySelector('article, .post-content');
    if (!article) return;

    const headings = article.querySelectorAll('h2, h3');
    if (headings.length < 3) return; // Only show TOC if there are at least 3 headings

    const toc = document.createElement('div');
    toc.className = 'curve-card toc';
    toc.style.cssText = `
      position: sticky;
      top: 24px;
      margin-bottom: 32px;
      padding: 24px;
    `;

    const tocTitle = document.createElement('h3');
    tocTitle.textContent = 'Table of Contents';
    tocTitle.style.marginBottom = '16px';
    toc.appendChild(tocTitle);

    const tocList = document.createElement('ul');
    tocList.style.cssText = `
      list-style: none;
      margin-left: 0;
    `;

    headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;

      const li = document.createElement('li');
      li.style.cssText = `
        margin-bottom: 8px;
        padding-left: ${heading.tagName === 'H3' ? '16px' : '0'};
      `;

      const link = document.createElement('a');
      link.href = `#${id}`;
      link.textContent = heading.textContent;
      link.style.cssText = `
        color: var(--text-secondary);
        text-decoration: none;
        transition: color 0.2s ease;
      `;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth' });
      });

      li.appendChild(link);
      tocList.appendChild(li);
    });

    toc.appendChild(tocList);
    article.insertBefore(toc, article.firstChild);
  }

  // Back to Top Button
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'curve-fab back-to-top';
    btn.innerHTML = '↑';
    btn.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 24px;
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    `;
    btn.title = 'Back to Top';

    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'all';
      } else {
        btn.style.opacity = '0';
        btn.style.pointerEvents = 'none';
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // External Links Open in New Tab
  function initExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
      if (!link.href.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  // Code Syntax Highlighting Enhancement
  function initSyntaxHighlighting() {
    document.querySelectorAll('pre code').forEach((block) => {
      // Add line numbers
      const lines = block.textContent.split('\n');
      if (lines.length > 1) {
        const lineNumbers = document.createElement('span');
        lineNumbers.className = 'line-numbers';
        lineNumbers.style.cssText = `
          position: absolute;
          left: 0;
          top: 0;
          padding: var(--space-lg);
          color: rgba(255, 255, 255, 0.3);
          user-select: none;
          line-height: 1.5;
        `;
        lineNumbers.innerHTML = lines.map((_, i) => i + 1).join('<br>');

        const pre = block.parentElement;
        pre.style.position = 'relative';
        pre.style.paddingLeft = '60px';
        pre.insertBefore(lineNumbers, block);
      }
    });
  }

  // Lazy Loading Images
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Performance: Prefetch Links on Hover
  function initLinkPrefetch() {
    const links = document.querySelectorAll('a[href]');

    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const url = link.href;
        if (!url.includes('#') && !url.includes('javascript:')) {
          const prefetch = document.createElement('link');
          prefetch.rel = 'prefetch';
          prefetch.href = url;
          document.head.appendChild(prefetch);
        }
      });
    });
  }

  // Dark Mode Time-based Auto-switching
  function initAutoDarkMode() {
    const hour = new Date().getHours();
    // Enable "night mode" between 8 PM and 6 AM
    if (hour >= 20 || hour < 6) {
      document.body.classList.add('night-mode');
    }
  }

  // Analytics (Placeholder for privacy-friendly analytics)
  function initAnalytics() {
    // Add your privacy-friendly analytics here (e.g., Plausible, Umami)
    console.log('Page view tracked');
  }

  // Initialize all features
  function init() {
    initMobileNav();
    initSearch();
    initLightbox();
    initReadingProgress();
    initBackToTop();
    initExternalLinks();
    initSyntaxHighlighting();
    initLazyLoading();
    initLinkPrefetch();
    initAnalytics();

    // Optional TOC (uncomment if needed)
    // initTOC();

    // Optional auto dark mode
    // initAutoDarkMode();
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
