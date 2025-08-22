/**
 * Responsive Menu - Comprehensive Solution
 * 
 * Features:
 * - Works across all devices and screen sizes
 * - Handles orientation changes
 * - Prevents body scrolling when menu is open
 * - Smooth animations and transitions
 * - Accessible (keyboard navigation, ARIA attributes)
 * - Touch-friendly
 */
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeButton = document.querySelector('.mobile-menu-close');
  const menuLinks = document.querySelectorAll('.mobile-menu-nav a');
  const body = document.body;
  
  // Functions
  function openMenu() {
    hamburger.classList.add('active');
    mobileMenu.classList.add('active');
    body.classList.add('menu-open');
    
    // Accessibility
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    
    // Focus trap
    closeButton.focus();
  }
  
  function closeMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    body.classList.remove('menu-open');
    
    // Accessibility
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    
    // Return focus
    hamburger.focus();
  }
  
  // Event Listeners
  if (hamburger && mobileMenu && closeButton) {
    // Initialize ARIA attributes
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'mobile-menu');
    hamburger.setAttribute('aria-label', 'Menu');
    closeButton.setAttribute('aria-label', 'Close menu');
    
    // Open menu when hamburger is clicked
    hamburger.addEventListener('click', function(e) {
      e.preventDefault();
      openMenu();
    });
    
    // Close menu when close button is clicked
    closeButton.addEventListener('click', function(e) {
      e.preventDefault();
      closeMenu();
    });
    
    // Close menu when a menu item is clicked
    menuLinks.forEach(link => {
      link.addEventListener('click', function() {
        closeMenu();
      });
    });
    
    // Close menu when clicking outside
    mobileMenu.addEventListener('click', function(e) {
      if (e.target === mobileMenu) {
        closeMenu();
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
      // Small delay to allow the browser to complete the orientation change
      setTimeout(function() {
        if (mobileMenu.classList.contains('active')) {
          // Adjust menu height and scroll position
          mobileMenu.style.height = window.innerHeight + 'px';
          mobileMenu.scrollTop = 0;
        }
      }, 200);
    });
    
    // Handle resize events
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        // If screen width is greater than 768px and menu is open, close it
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
          closeMenu();
        }
      }, 250);
    });
  }
});
