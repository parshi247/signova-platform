// Signova Frontend Integration - Connect Trial Form to Backend API
// This script connects the trial registration form to the live backend API

const BACKEND_API_URL = 'https://g8h3ilcvlyzo.manus.space';

// Enhanced trial form functionality
class SignovaTrialForm {
    constructor() {
        this.isSubmitting = false;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Find all "Start Free Trial" buttons
        const trialButtons = document.querySelectorAll('[onclick*="openTrialModal"], .trial-btn, .start-trial-btn');
        trialButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openTrialModal();
            });
        });

        // Handle form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'trial-form' || e.target.classList.contains('trial-form')) {
                e.preventDefault();
                this.handleTrialSubmission(e.target);
            }
        });

        // Create trial modal if it doesn't exist
        this.createTrialModal();
    }

    createTrialModal() {
        // Check if modal already exists
        if (document.getElementById('trial-modal')) {
            return;
        }

        const modalHTML = `
            <div id="trial-modal" class="trial-modal" style="display: none;">
                <div class="trial-modal-overlay" onclick="closeTrialModal()"></div>
                <div class="trial-modal-content">
                    <div class="trial-modal-header">
                        <h2>Start Your Free Enterprise Trial</h2>
                        <button class="trial-modal-close" onclick="closeTrialModal()">&times;</button>
                    </div>
                    
                    <div class="trial-modal-body">
                        <form id="trial-form" class="trial-form">
                            <div class="form-group">
                                <label for="company_name">Company Name *</label>
                                <input type="text" id="company_name" name="company_name" required 
                                       placeholder="Enter your company name">
                            </div>
                            
                            <div class="form-group">
                                <label for="full_name">Full Name *</label>
                                <input type="text" id="full_name" name="full_name" required 
                                       placeholder="Enter your full name">
                            </div>
                            
                            <div class="form-group">
                                <label for="business_email">Business Email *</label>
                                <input type="email" id="business_email" name="business_email" required 
                                       placeholder="Enter your business email">
                            </div>
                            
                            <div class="form-group">
                                <label for="phone_number">Phone Number *</label>
                                <input type="tel" id="phone_number" name="phone_number" required 
                                       placeholder="Enter your phone number">
                            </div>
                            
                            <div class="form-group">
                                <label for="plan">Select Plan *</label>
                                <select id="plan" name="plan" required>
                                    <option value="">Choose a plan</option>
                                    <option value="Professional">Professional - $15/user/month</option>
                                    <option value="Enterprise">Enterprise - $35/user/month (Most Popular)</option>
                                    <option value="Enterprise Plus">Enterprise Plus - $65/user/month</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="users">Number of Users *</label>
                                <select id="users" name="users" required>
                                    <option value="">Select number of users</option>
                                    <option value="1">1-5 users</option>
                                    <option value="10">6-10 users</option>
                                    <option value="25">11-25 users</option>
                                    <option value="50">26-50 users</option>
                                    <option value="100">51-100 users</option>
                                    <option value="250">101-250 users</option>
                                    <option value="500">251-500 users</option>
                                    <option value="1000">500+ users</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="terms" name="terms" required>
                                    I agree to the <a href="/terms" target="_blank">Terms of Service</a> and 
                                    <a href="/privacy" target="_blank">Privacy Policy</a>
                                </label>
                            </div>
                            
                            <div class="form-group">
                                <button type="submit" class="trial-submit-btn" id="trial-submit-btn">
                                    <span class="btn-text">Start Free Trial - No Credit Card Required</span>
                                    <span class="btn-loading" style="display: none;">Creating Your Account...</span>
                                </button>
                            </div>
                            
                            <div class="trial-benefits">
                                <h4>Your 30-Day Free Trial Includes:</h4>
                                <ul>
                                    <li>✓ Unlimited document signatures</li>
                                    <li>✓ Advanced security features</li>
                                    <li>✓ Professional templates</li>
                                    <li>✓ Mobile app access</li>
                                    <li>✓ Email support</li>
                                    <li>✓ No setup fees</li>
                                </ul>
                            </div>
                        </form>
                        
                        <div id="trial-success" class="trial-success" style="display: none;">
                            <div class="success-icon">✓</div>
                            <h3>Welcome to Signova!</h3>
                            <p>Your enterprise trial account has been created successfully.</p>
                            <div class="success-details">
                                <p><strong>Next Steps:</strong></p>
                                <ol>
                                    <li>Check your email for login credentials</li>
                                    <li>Access your dashboard to start uploading documents</li>
                                    <li>Explore our professional templates</li>
                                    <li>Invite team members to collaborate</li>
                                </ol>
                            </div>
                            <button class="success-btn" onclick="window.location.href='https://user.signova.ai'">
                                Access Your Dashboard
                            </button>
                        </div>
                        
                        <div id="trial-error" class="trial-error" style="display: none;">
                            <div class="error-icon">⚠</div>
                            <h3>Registration Error</h3>
                            <p id="error-message">Something went wrong. Please try again.</p>
                            <button class="error-btn" onclick="this.parentElement.style.display='none'; document.getElementById('trial-form').style.display='block';">
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add modal styles
        this.addModalStyles();
    }

    addModalStyles() {
        const styles = `
            <style>
                .trial-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .trial-modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                }
                
                .trial-modal-content {
                    position: relative;
                    background: white;
                    border-radius: 12px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }
                
                .trial-modal-header {
                    padding: 24px 24px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #e5e7eb;
                    margin-bottom: 24px;
                }
                
                .trial-modal-header h2 {
                    margin: 0;
                    color: #1f2937;
                    font-size: 24px;
                    font-weight: 600;
                }
                
                .trial-modal-close {
                    background: none;
                    border: none;
                    font-size: 28px;
                    cursor: pointer;
                    color: #6b7280;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .trial-modal-body {
                    padding: 0 24px 24px;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 500;
                    color: #374151;
                }
                
                .form-group input,
                .form-group select {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: border-color 0.2s;
                    box-sizing: border-box;
                }
                
                .form-group input:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: #3b82f6;
                }
                
                .checkbox-label {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    font-size: 14px;
                    line-height: 1.5;
                }
                
                .checkbox-label input[type="checkbox"] {
                    width: auto;
                    margin: 0;
                    margin-top: 2px;
                }
                
                .trial-submit-btn {
                    width: 100%;
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    color: white;
                    border: none;
                    padding: 16px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                }
                
                .trial-submit-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
                }
                
                .trial-submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .btn-loading {
                    display: none;
                }
                
                .trial-benefits {
                    margin-top: 24px;
                    padding: 20px;
                    background: #f8fafc;
                    border-radius: 8px;
                }
                
                .trial-benefits h4 {
                    margin: 0 0 12px 0;
                    color: #1f2937;
                    font-size: 16px;
                }
                
                .trial-benefits ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }
                
                .trial-benefits li {
                    padding: 4px 0;
                    color: #4b5563;
                    font-size: 14px;
                }
                
                .trial-success,
                .trial-error {
                    text-align: center;
                    padding: 40px 20px;
                }
                
                .success-icon,
                .error-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                }
                
                .success-icon {
                    color: #10b981;
                }
                
                .error-icon {
                    color: #ef4444;
                }
                
                .trial-success h3,
                .trial-error h3 {
                    margin: 0 0 12px 0;
                    font-size: 24px;
                }
                
                .success-details {
                    margin: 24px 0;
                    text-align: left;
                    background: #f0f9ff;
                    padding: 20px;
                    border-radius: 8px;
                }
                
                .success-btn,
                .error-btn {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 16px;
                }
                
                @media (max-width: 768px) {
                    .trial-modal-content {
                        width: 95%;
                        margin: 20px;
                    }
                    
                    .trial-modal-header {
                        padding: 16px 16px 0;
                    }
                    
                    .trial-modal-body {
                        padding: 0 16px 16px;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    openTrialModal() {
        const modal = document.getElementById('trial-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Reset form state
            document.getElementById('trial-form').style.display = 'block';
            document.getElementById('trial-success').style.display = 'none';
            document.getElementById('trial-error').style.display = 'none';
        }
    }

    closeTrialModal() {
        const modal = document.getElementById('trial-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    async handleTrialSubmission(form) {
        if (this.isSubmitting) return;

        this.isSubmitting = true;
        const submitBtn = document.getElementById('trial-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        try {
            // Collect form data
            const formData = new FormData(form);
            const data = {
                company_name: formData.get('company_name'),
                full_name: formData.get('full_name'),
                business_email: formData.get('business_email'),
                phone_number: formData.get('phone_number'),
                plan: formData.get('plan'),
                users: parseInt(formData.get('users')) || 1
            };

            // Validate required fields
            const requiredFields = ['company_name', 'full_name', 'business_email', 'phone_number', 'plan'];
            for (const field of requiredFields) {
                if (!data[field] || data[field].trim() === '') {
                    throw new Error(`${field.replace('_', ' ')} is required`);
                }
            }

            // Submit to backend API
            const response = await fetch(`${BACKEND_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Show success message
                document.getElementById('trial-form').style.display = 'none';
                document.getElementById('trial-success').style.display = 'block';

                // Track conversion
                this.trackConversion(data);

                // Optional: Auto-redirect after delay
                setTimeout(() => {
                    window.location.href = 'https://user.signova.ai';
                }, 5000);

            } else {
                throw new Error(result.error || 'Registration failed');
            }

        } catch (error) {
            console.error('Trial registration error:', error);
            
            // Show error message
            document.getElementById('trial-form').style.display = 'none';
            document.getElementById('trial-error').style.display = 'block';
            document.getElementById('error-message').textContent = error.message;

        } finally {
            // Reset button state
            this.isSubmitting = false;
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    trackConversion(data) {
        // Track successful trial registration
        try {
            // Google Analytics (if available)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'trial_registration', {
                    event_category: 'conversion',
                    event_label: data.plan,
                    value: data.users
                });
            }

            // Facebook Pixel (if available)
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: 'Enterprise Trial',
                    content_category: data.plan,
                    value: data.users
                });
            }

            console.log('Trial registration tracked:', data.company_name, data.plan);
        } catch (error) {
            console.log('Tracking error:', error);
        }
    }
}

// Global functions for backward compatibility
function openTrialModal() {
    if (window.signovaTrialForm) {
        window.signovaTrialForm.openTrialModal();
    }
}

function closeTrialModal() {
    if (window.signovaTrialForm) {
        window.signovaTrialForm.closeTrialModal();
    }
}

// Initialize when script loads
window.signovaTrialForm = new SignovaTrialForm();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SignovaTrialForm;
}

