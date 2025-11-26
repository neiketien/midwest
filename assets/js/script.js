(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });
  
  // --- Community Page Logic ---

  // 1. Post Submission
  const postForm = document.getElementById('createPostForm');
  if (postForm) {
    postForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const title = document.getElementById('postTitle').value;
      const content = document.getElementById('postContent').value;
      const container = document.getElementById('new-posts-container');
      
      // Get Modal Instance to hide it
      const modalEl = document.getElementById('newPostModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      
      // Create HTML Structure for new post
      const newPostHTML = `
        <div class="card border-0 shadow-sm mb-4 rounded-4" data-aos="fade-up">
            <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                    <div class="avatar bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px; font-size: 20px;">
                        <i class="bi bi-person-fill"></i>
                    </div>
                    <div>
                        <h6 class="fw-bold mb-0">Guest User</h6>
                        <span class="text-muted small">Just now • General</span>
                    </div>
                </div>
                <h5 class="fw-bold">${title}</h5>
                <p class="card-text">${content}</p>
                <div class="d-flex gap-4 pt-2 border-top">
                    <button class="btn btn-link text-decoration-none text-muted p-0 like-btn"><i class="bi bi-heart"></i> <span class="count">0</span> Likes</button>
                    <button class="btn btn-link text-decoration-none text-muted p-0"><i class="bi bi-chat"></i> 0 Comments</button>
                </div>
            </div>
        </div>
      `;

      // Prepend to feed
      container.insertAdjacentHTML('afterbegin', newPostHTML);
      
      // Reset and Close
      postForm.reset();
      modal.hide();

      // Show Success Toast
      const toast = document.getElementById('success-notification');
      toast.querySelector('.message-text').textContent = "Post Published!";
      toast.classList.add('active');
      setTimeout(() => { toast.classList.remove('active'); }, 3000);
    });
  }

  // 2. Like Button Logic (Delegation for dynamic content)
  document.addEventListener('click', function(e) {
    if (e.target.closest('.like-btn')) {
      const btn = e.target.closest('.like-btn');
      const icon = btn.querySelector('i');
      const countSpan = btn.querySelector('.count');
      let count = parseInt(countSpan.textContent);

      if (btn.classList.contains('liked')) {
        btn.classList.remove('liked');
        icon.classList.remove('bi-heart-fill');
        icon.classList.add('bi-heart');
        countSpan.textContent = count - 1;
      } else {
        btn.classList.add('liked');
        icon.classList.remove('bi-heart');
        icon.classList.add('bi-heart-fill');
        countSpan.textContent = count + 1;
      }
    }

    // 3. Toggle Comments Logic
    if (e.target.closest('.toggle-comments')) {
        const btn = e.target.closest('.toggle-comments');
        // Find the closest card body, then find the .comments-section within it
        const cardBody = btn.closest('.card-body');
        const commentSection = cardBody.querySelector('.comments-section');
        
        if(commentSection) {
            if (commentSection.style.display === "none") {
                commentSection.style.display = "block";
            } else {
                commentSection.style.display = "none";
            }
        }
    }
  });

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });
  
  document.addEventListener('DOMContentLoaded', function() {
  
  // --- 1. Contact Form Logic ---
  const contactForm = document.getElementById('custom-contact-form');
  const toast = document.getElementById('success-notification');
  const closeToast = document.getElementById('close-toast');

  if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const inputs = this.querySelectorAll('.form-control');
      const btn = document.getElementById('contact-btn');
      const btnText = btn.querySelector('.btn-text');
      const loader = btn.querySelector('.loader');

      // Validate Inputs
      inputs.forEach(input => {
        const errorMsg = input.nextElementSibling; 
        if (!input.value.trim()) {
          input.classList.add('is-invalid');
          if(errorMsg) errorMsg.style.display = 'block';
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
          if(errorMsg) errorMsg.style.display = 'none';
        }
      });

      if (isValid) {
        // Show Loader
        btnText.style.display = 'none';
        loader.style.display = 'flex';
        btn.disabled = true;

        // Simulate sending
        setTimeout(() => {
          // Reset Button
          loader.style.display = 'none';
          btnText.style.display = 'block';
          btn.disabled = false;
          contactForm.reset(); 

          // SHOW TOAST
          toast.classList.add('active');

          // Hide after 3 seconds
          setTimeout(() => {
            toast.classList.remove('active');
          }, 3000);

        }, 2000);
      }
    });
  }

  // Close Toast manually
  if(closeToast) {
    closeToast.addEventListener('click', () => {
      toast.classList.remove('active');
    });
  }

  // --- 2. Newsletter Form Logic ---
  const newsBtn = document.getElementById('newsletter-btn');
  const newsInput = document.getElementById('newsletter-email');
  const newsError = document.getElementById('newsletter-error');
  const newsLabel = newsBtn.querySelector('.btn-label');

  if(newsBtn && newsInput) {
    newsBtn.addEventListener('click', function() {
      const email = newsInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailPattern.test(email)) {
        // Error State
        newsInput.classList.add('is-invalid');
        newsError.style.display = 'block';
      } else {
        // Success State
        newsInput.classList.remove('is-invalid');
        newsError.style.display = 'none';

        // 1. Trigger Jello Animation (handled by hover css usually, we force focus/active or just let it happen if mouse is there, 
        // but here we just change text as requested)
        
        // 2. Change Text
        newsLabel.textContent = "Subscribed";
        newsBtn.style.backgroundColor = "#20c997"; // Optional: Change color to green for feedback

        // 3. Revert after 3 seconds
        setTimeout(() => {
          newsLabel.textContent = "Subscribe";
          newsBtn.style.backgroundColor = ""; // Revert color
          newsInput.value = ""; // Clear input
        }, 3000);
      }
    });
  }

});

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();
