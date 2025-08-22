/**
 * Stripe Integration Script
 * 
 * This script handles the integration with Stripe for payment processing.
 * It dynamically updates the Stripe checkout based on the selected plan.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Stripe with the publishable key
  const stripe = Stripe('pk_live_51RbQe9BMcX9zVrDCSDIqDbdpQ8zIbpo9d4QWT2hyubtqAFBvocnoupXOQbE9cu30AxvWKodzi79ohJVRNFqeGZ5Q00lSG0Cowv');
  
  // Listen for purchase button clicks
  const purchaseButton = document.getElementById('purchase-button');
  if (purchaseButton) {
    purchaseButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the selected plan
      const planSelect = document.getElementById('plan-select');
      if (!planSelect) return;
      
      const selectedPlan = planSelect.value;
      if (!signovaPricing[selectedPlan]) return;
      
      // Get the billing cycle (monthly or annual)
      const billingCycle = document.querySelector('input[name="billing-cycle"]:checked')?.value || 'monthly';
      
      // Get the Stripe price ID based on the selected plan and billing cycle
      const stripePriceId = getStripePriceId(signovaPricing[selectedPlan], billingCycle);
      
      // Create a checkout session
      createCheckoutSession(stripePriceId);
    });
  }
  
  // Function to create a Stripe checkout session
  function createCheckoutSession(stripePriceId) {
    // Show loading state
    if (purchaseButton) {
      purchaseButton.disabled = true;
      purchaseButton.textContent = 'Processing...';
    }
    
    // Make an API call to your backend to create a checkout session
    fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: stripePriceId,
      }),
    })
    .then(response => response.json())
    .then(session => {
      // Redirect to Stripe checkout
      return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(result => {
      if (result.error) {
        // Show error in the UI
        console.error(result.error.message);
        alert('An error occurred. Please try again.');
        
        // Reset button state
        if (purchaseButton) {
          purchaseButton.disabled = false;
          
          // Get the selected plan
          const planSelect = document.getElementById('plan-select');
          if (planSelect) {
            const selectedPlan = planSelect.value;
            if (signovaPricing[selectedPlan]) {
              purchaseButton.textContent = `Complete Purchase - $${signovaPricing[selectedPlan].price}/month`;
            } else {
              purchaseButton.textContent = 'Complete Purchase';
            }
          }
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
      
      // Reset button state
      if (purchaseButton) {
        purchaseButton.disabled = false;
        
        // Get the selected plan
        const planSelect = document.getElementById('plan-select');
        if (planSelect) {
          const selectedPlan = planSelect.value;
          if (signovaPricing[selectedPlan]) {
            purchaseButton.textContent = `Complete Purchase - $${signovaPricing[selectedPlan].price}/month`;
          } else {
            purchaseButton.textContent = 'Complete Purchase';
          }
        }
      }
    });
  }
});
