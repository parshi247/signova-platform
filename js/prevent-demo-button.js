/**
 * Prevent Demo Button Script
 * 
 * This script prevents the Demo button from being added back to the hero header.
 * It runs on page load and periodically checks for the Demo button and removes it if found.
 */

// Function to remove the Demo button
function removeDemoButton() {
  // Look for elements containing "Watch Demo" text
  const elements = document.querySelectorAll('a');
  elements.forEach(element => {
    if (element.textContent.includes('Watch Demo') || 
        element.textContent.includes('Demo') || 
        element.href.includes('demo')) {
      console.log('Found and removed Demo button:', element);
      element.remove();
    }
  });
}

// Run on page load
document.addEventListener('DOMContentLoaded', function() {
  removeDemoButton();
  
  // Also run periodically to catch any dynamically added buttons
  setInterval(removeDemoButton, 1000);
  
  // Monitor DOM changes to catch any dynamically added buttons
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        removeDemoButton();
      }
    });
  });
  
  // Start observing the document body for DOM changes
  observer.observe(document.body, { childList: true, subtree: true });
});
