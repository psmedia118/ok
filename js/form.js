// Form Validation and Web3Forms Integration
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
        
        // Field validation function
        function validateField(field) {
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';
            
            // Remove existing error
            const existingError = field.parentElement.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            field.classList.remove('error', 'success');
            
            // Validation rules
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'This field is required';
            } else if (field.type === 'email' && value && !isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            } else if (field.id === 'phone' && value) {
                const phoneRegex = /^[0-9]{10}$/;
                if (!phoneRegex.test(value.replace(/[^0-9]/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid 10-digit phone number';
                }
            } else if (field.id === 'name' && value && value.length < 2) {
                isValid = false;
                errorMessage = 'Please enter your full name';
            }
            
            // Apply styles and show error
            if (!isValid && value !== '') {
                field.classList.add('error');
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.color = '#ff4444';
                errorDiv.style.fontSize = '0.75rem';
                errorDiv.style.marginTop = '0.25rem';
                errorDiv.textContent = errorMessage;
                field.parentElement.appendChild(errorDiv);
            } else if (isValid && value !== '') {
                field.classList.add('success');
                field.style.borderColor = '#4CAF50';
            } else {
                field.style.borderColor = '#E5E5E5';
            }
            
            return isValid;
        }
        
        // Email validation helper
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        // Form submission
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate all required fields
            let isFormValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isFormValid = false;
                }
            });
            
            if (!isFormValid) {
                // Show error summary
                const errorSummary = document.createElement('div');
                errorSummary.className = 'error-summary';
                errorSummary.style.backgroundColor = '#ffebee';
                errorSummary.style.color = '#c62828';
                errorSummary.style.padding = '1rem';
                errorSummary.style.marginBottom = '1rem';
                errorSummary.style.borderRadius = '4px';
                errorSummary.innerHTML = '<strong>Please fix the following errors:</strong><ul>';
                
                const errors = document.querySelectorAll('.error-message');
                errors.forEach(error => {
                    errorSummary.innerHTML += `<li>${error.textContent}</li>`;
                });
                errorSummary.innerHTML += '</ul>';
                
                // Remove existing error summary
                const existingSummary = contactForm.querySelector('.error-summary');
                if (existingSummary) {
                    existingSummary.remove();
                }
                contactForm.insertBefore(errorSummary, contactForm.firstChild);
                
                // Scroll to error summary
                errorSummary.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    errorSummary.style.opacity = '0';
                    setTimeout(() => errorSummary.remove(), 300);
                }, 5000);
                
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            try {
                // Submit to Web3Forms
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success message
                    const successDiv = document.createElement('div');
                    successDiv.className = 'success-message';
                    successDiv.style.backgroundColor = '#e8f5e9';
                    successDiv.style.color = '#2e7d32';
                    successDiv.style.padding = '1rem';
                    successDiv.style.marginBottom = '1rem';
                    successDiv.style.borderRadius = '4px';
                    successDiv.innerHTML = '<strong>✓ Appointment Request Sent!</strong><br>We\'ll contact you within 30 minutes to confirm.';
                    
                    contactForm.insertBefore(successDiv, contactForm.firstChild);
                    contactForm.reset();
                    
                    // Remove success message after 5 seconds
                    setTimeout(() => {
                        successDiv.style.opacity = '0';
                        setTimeout(() => successDiv.remove(), 300);
                    }, 5000);
                    
                    // Optional: Redirect to thank you page
                    const redirectUrl = contactForm.querySelector('input[name="redirect_url"]');
                    if (redirectUrl && redirectUrl.value) {
                        setTimeout(() => {
                            window.location.href = redirectUrl.value;
                        }, 2000);
                    }
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-summary';
                errorDiv.style.backgroundColor = '#ffebee';
                errorDiv.style.color = '#c62828';
                errorDiv.style.padding = '1rem';
                errorDiv.style.marginBottom = '1rem';
                errorDiv.style.borderRadius = '4px';
                errorDiv.innerHTML = '<strong>Submission Failed</strong><br>Please try again or contact us directly via phone.';
                
                contactForm.insertBefore(errorDiv, contactForm.firstChild);
                
                setTimeout(() => {
                    errorDiv.style.opacity = '0';
                    setTimeout(() => errorDiv.remove(), 300);
                }, 5000);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});
