// Mobile Device Detection and Redirect Script for Signova
// Automatically redirects mobile users to mobile-optimized interface

(function() {
    'use strict';
    
    // Mobile device detection function
    function isMobileDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Check for mobile devices
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;
        
        // Check screen size as additional indicator
        const isSmallScreen = window.innerWidth <= 768 || window.innerHeight <= 768;
        
        // Check for touch capability
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        return mobileRegex.test(userAgent) || (isSmallScreen && isTouchDevice);
    }
    
    // Check if already on mobile page
    function isOnMobilePage() {
        return window.location.pathname.includes('/mobile.html') || 
               window.location.hostname.includes('mobile.');
    }
    
    // Redirect to mobile version
    function redirectToMobile() {
        // Prevent redirect loops
        if (isOnMobilePage()) {
            return;
        }
        
        // Set a flag to prevent multiple redirects
        if (sessionStorage.getItem('mobile_redirect_attempted')) {
            return;
        }
        
        sessionStorage.setItem('mobile_redirect_attempted', 'true');
        
        // Redirect to mobile version
        const currentUrl = window.location.href;
        const mobileUrl = currentUrl.replace(window.location.pathname, '/mobile.html');
        
        // Smooth redirect with loading indicator
        document.body.style.opacity = '0.7';
        document.body.innerHTML = '<div style="text-align:center;padding:50px;font-family:Arial,sans-serif;"><h2>🔄 Redirecting to Mobile Version...</h2><p>Optimizing your experience for mobile devices</p></div>';
        
        setTimeout(() => {
            window.location.href = mobileUrl;
        }, 1000);
    }
    
    // Initialize mobile detection and redirect
    function initMobileRedirect() {
        // Only redirect if on main page and using mobile device
        if (isMobileDevice() && (window.location.pathname === '/' || window.location.pathname === '/index.html')) {
            redirectToMobile();
        }
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileRedirect);
    } else {
        initMobileRedirect();
    }
    
    // Also run on window resize (orientation change)
    window.addEventListener('resize', function() {
        setTimeout(initMobileRedirect, 500);
    });
    
})();

