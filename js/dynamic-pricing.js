/**
 * Dynamic Pricing Script
 * 
 * This script automatically updates all pricing elements on the page
 * based on the central pricing configuration.
 */

// Function to update pricing on the pricing page
function updatePricingPage() {
  if (!window.location.pathname.includes('pricing.html')) return;
  
  console.log('Updating pricing page...');
  
  // Update Starter Plan
  document.querySelector('.starter-plan-name').textContent = signovaPricing.starter.name;
  document.querySelector('.starter-plan-price').textContent = '$' + signovaPricing.starter.price;
  document.querySelector('.starter-plan-description').textContent = signovaPricing.starter.description;
  
  // Update Professional Plan
  document.querySelector('.professional-plan-name').textContent = signovaPricing.professional.name;
  document.querySelector('.professional-plan-price').textContent = '$' + signovaPricing.professional.price;
  document.querySelector('.professional-plan-description').textContent = signovaPricing.professional.description;
  
  // Update Business Plan
  document.querySelector('.business-plan-name').textContent = signovaPricing.business.name;
  document.querySelector('.business-plan-price').textContent = '$' + signovaPricing.business.price;
  document.querySelector('.business-plan-description').textContent = signovaPricing.business.description;
  
  // Update Enterprise Plan
  document.querySelector('.enterprise-plan-name').textContent = signovaPricing.enterprise.name;
  document.querySelector('.enterprise-plan-price').textContent = '$' + signovaPricing.enterprise.price;
  document.querySelector('.enterprise-plan-description').textContent = signovaPricing.enterprise.description;
  
  // Update features for each plan
  updatePlanFeatures('starter', signovaPricing.starter.features);
  updatePlanFeatures('professional', signovaPricing.professional.features);
  updatePlanFeatures('business', signovaPricing.business.features);
  updatePlanFeatures('enterprise', signovaPricing.enterprise.features);
}

// Function to update features for a specific plan
function updatePlanFeatures(planType, features) {
  const featuresList = document.querySelector('.' + planType + '-plan-features');
  if (!featuresList) return;
  
  featuresList.innerHTML = '';
  features.forEach(feature => {
    const li = document.createElement('li');
    li.innerHTML = '<span class="feature-check">✓</span> ' + feature;
    featuresList.appendChild(li);
  });
}

// Function to update pricing on the payment form
function updatePaymentForm() {
  if (!window.location.pathname.includes('payment.html')) return;
  
  console.log('Updating payment form...');
  
  // Update the plan dropdown options
  const planSelect = document.getElementById('plan-select');
  if (planSelect) {
    // Clear existing options
    planSelect.innerHTML = '';
    
    // Add options for each plan
    const starterOption = document.createElement('option');
    starterOption.value = 'starter';
    starterOption.textContent = signovaPricing.starter.name + ' - $' + signovaPricing.starter.price + '/month';
    planSelect.appendChild(starterOption);
    
    const professionalOption = document.createElement('option');
    professionalOption.value = 'professional';
    professionalOption.textContent = signovaPricing.professional.name + ' - $' + signovaPricing.professional.price + '/month';
    planSelect.appendChild(professionalOption);
    
    const businessOption = document.createElement('option');
    businessOption.value = 'business';
    businessOption.textContent = signovaPricing.business.name + ' - $' + signovaPricing.business.price + '/month';
    planSelect.appendChild(businessOption);
    
    const enterpriseOption = document.createElement('option');
    enterpriseOption.value = 'enterprise';
    enterpriseOption.textContent = signovaPricing.enterprise.name + ' - $' + signovaPricing.enterprise.price + '/month';
    planSelect.appendChild(enterpriseOption);
  }
  
  // Update the plan details section
  updatePlanDetails('starter');
  
  // Update the purchase button
  updatePurchaseButton('starter');
}

// Function to update plan details on the payment form
function updatePlanDetails(planType) {
  const planDetails = document.querySelector('.plan-details');
  if (!planDetails) return;
  
  const plan = signovaPricing[planType];
  
  // Update plan name
  const planName = planDetails.querySelector('.plan-name');
  if (planName) planName.textContent = plan.name;
  
  // Update plan price
  const planPrice = planDetails.querySelector('.plan-price');
  if (planPrice) planPrice.textContent = '$' + plan.price;
  
  // Update plan features
  const planFeatures = planDetails.querySelector('.plan-features');
  if (planFeatures) {
    planFeatures.innerHTML = '';
    plan.features.forEach(feature => {
      const li = document.createElement('li');
      li.innerHTML = '<span class="feature-check">✓</span> ' + feature;
      planFeatures.appendChild(li);
    });
  }
}

// Function to update the purchase button
function updatePurchaseButton(planType) {
  const purchaseButton = document.querySelector('.purchase-button');
  if (!purchaseButton) return;
  
  const plan = signovaPricing[planType];
  purchaseButton.textContent = 'Complete Purchase - $' + plan.price + '/month';
  purchaseButton.setAttribute('data-plan', planType);
  purchaseButton.setAttribute('data-price-id', plan.stripe_price_id_monthly);
}

// Function to listen for plan changes on the payment form
function listenForPlanChanges() {
  if (!window.location.pathname.includes('payment.html')) return;
  
  const planSelect = document.getElementById('plan-select');
  if (planSelect) {
    planSelect.addEventListener('change', function() {
      const selectedPlan = this.value;
      updatePlanDetails(selectedPlan);
      updatePurchaseButton(selectedPlan);
    });
  }
}

// Initialize pricing updates when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  updatePricingPage();
  updatePaymentForm();
  listenForPlanChanges();
});
