/**
 * Central Pricing Configuration
 * 
 * This file serves as the single source of truth for all pricing information.
 * Any changes to pricing should be made here, and they will automatically
 * propagate to all parts of the website.
 */

const signovaPricing = {
  starter: {
    name: "Starter Plan",
    price: 9,
    monthly_price: 9,
    annual_price: 99,
    currency: "USD",
    stripe_price_id_monthly: "price_1RbQe9BMcX9zVrDCSDIqDbdp",
    stripe_price_id_annual: "price_1RbQe9BMcX9zVrDCSDIqDbdp_annual",
    features: [
      "100 documents per month",
      "Basic signatures",
      "Email support",
      "Standard templates",
      "Mobile app access",
      "Basic templates",
      "Standard security"
    ],
    description: "Perfect for individuals and small teams getting started with electronic signatures."
  },
  professional: {
    name: "Professional Plan",
    price: 29,
    monthly_price: 29,
    annual_price: 299,
    currency: "USD",
    stripe_price_id_monthly: "price_1RbQe9BMcX9zVrDCSDIqDbdp_pro",
    stripe_price_id_annual: "price_1RbQe9BMcX9zVrDCSDIqDbdp_pro_annual",
    features: [
      "1,000 documents per month",
      "Advanced signatures & fields",
      "Priority email support",
      "Custom branding",
      "Advanced templates",
      "Bulk sending",
      "API access"
    ],
    description: "Ideal for growing businesses that need advanced features and better support."
  },
  business: {
    name: "Business Plan",
    price: 79,
    monthly_price: 79,
    annual_price: 799,
    currency: "USD",
    stripe_price_id_monthly: "price_1RbQe9BMcX9zVrDCSDIqDbdp_business",
    stripe_price_id_annual: "price_1RbQe9BMcX9zVrDCSDIqDbdp_business_annual",
    features: [
      "10,000 documents per month",
      "All Professional features",
      "Phone & chat support",
      "Advanced integrations",
      "Team management",
      "Advanced analytics",
      "Custom workflows",
      "SSO integration"
    ],
    description: "Comprehensive solution for established businesses with high-volume needs."
  },
  enterprise: {
    name: "Enterprise Plan",
    price: 199,
    monthly_price: 199,
    annual_price: 1999,
    currency: "USD",
    stripe_price_id_monthly: "price_1RbQe9BMcX9zVrDCSDIqDbdp_enterprise",
    stripe_price_id_annual: "price_1RbQe9BMcX9zVrDCSDIqDbdp_enterprise_annual",
    features: [
      "Unlimited documents",
      "All Business features",
      "24/7 dedicated support",
      "Advanced security controls",
      "Custom integrations",
      "Compliance reporting",
      "White-label options",
      "SLA guarantee"
    ],
    description: "Enterprise-grade solution with unlimited documents and premium support."
  }
};

// Make the pricing configuration available globally
if (typeof module !== 'undefined') {
  module.exports = { signovaPricing };
} else {
  // For browser usage
  window.signovaPricing = signovaPricing;
}
