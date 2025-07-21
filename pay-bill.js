document.addEventListener('DOMContentLoaded', function() {
    // Navbar Functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const scrollProgress = document.querySelector('.scroll-progress-bar');

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');

        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Scroll Progress Indicator
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = `${scrolled}%`;
    });

    // Sticky Navbar with Hide/Show on Scroll
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            // Scroll Down
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            // Scroll Up
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'newsletter-success';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Thank you for subscribing!</p>
            `;
            
            newsletterForm.innerHTML = '';
            newsletterForm.appendChild(successMessage);
        });
    }

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add active class to current nav item
    const currentLocation = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        if (item.getAttribute('href') === currentLocation) {
            item.classList.add('active');
        }
    });

    // Get DOM elements
    const paymentMethods = document.querySelectorAll('.method');
    const quickPayForm = document.getElementById('quickPayForm');
    const cardNumber = document.getElementById('card-number');
    const expiry = document.getElementById('expiry');
    const cvv = document.getElementById('cvv');
    const paymentAmount = document.getElementById('payment-amount');
    const cardName = document.getElementById('card-name');

    // Add input focus effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });

    // Payment method selection with smooth animation
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            const activeMethod = document.querySelector('.method.active');
            if (activeMethod) {
                activeMethod.classList.add('fade-out');
                setTimeout(() => {
                    activeMethod.classList.remove('active', 'fade-out');
                }, 200);
            }
            
            setTimeout(() => {
                method.classList.add('active', 'fade-in');
                setTimeout(() => {
                    method.classList.remove('fade-in');
                }, 200);
            }, 200);
        });
    });

    // Detect card type and show appropriate icon
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = '';
        let cardType = detectCardType(value);
        updateCardIcon(cardType);
        
        for(let i = 0; i < value.length; i++) {
            if(i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue.substring(0, 19);
    });

    function detectCardType(number) {
        const patterns = {
            visa: /^4/,
            mastercard: /^5[1-5]/,
            amex: /^3[47]/,
            discover: /^6(?:011|5)/
        };
        
        for (let card in patterns) {
            if (patterns[card].test(number)) {
                return card;
            }
        }
        return 'unknown';
    }

    function updateCardIcon(cardType) {
        const icons = document.querySelectorAll('.payment-icons i');
        icons.forEach(icon => {
            icon.style.opacity = '0.3';
            if (icon.classList.contains(`fa-cc-${cardType}`)) {
                icon.style.opacity = '1';
                icon.style.transform = 'scale(1.1)';
            }
        });
    }

    // Format expiry date with smooth validation
    expiry.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        
        if(value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        
        e.target.value = value.substring(0, 5);
        validateExpiryDate(e.target);
    });

    function validateExpiryDate(input) {
        const value = input.value;
        if(!/^\d{2}\/\d{2}$/.test(value)) return;

        const [month, year] = value.split('/');
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        if(parseInt(month) > 12 || parseInt(month) < 1) {
            showError(input, 'Invalid month');
        } else if(parseInt(year) < currentYear || 
                (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            showError(input, 'Card has expired');
        } else {
            removeError(input);
        }
    }

    // Enhance CVV input with visual feedback
    cvv.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/gi, '');
        e.target.value = value.substring(0, 4);
        
        if(value.length >= 3) {
            e.target.classList.add('valid');
        } else {
            e.target.classList.remove('valid');
        }
    });

    // Format payment amount with currency symbol
    paymentAmount.addEventListener('input', function(e) {
        let value = e.target.value;
        if(value.includes('.')) {
            let parts = value.split('.');
            if(parts[1].length > 2) {
                e.target.value = parseFloat(value).toFixed(2);
            }
        }
        updatePaymentSummary();
    });

    // Update payment summary in real-time
    function updatePaymentSummary() {
        const amount = parseFloat(paymentAmount.value) || 0;
        const summaryElement = document.querySelector('.payment-info');
        
        if(!document.querySelector('.payment-summary')) {
            const summaryDiv = document.createElement('div');
            summaryDiv.className = 'info-card payment-summary';
            summaryDiv.innerHTML = `
                <h3><i class="fas fa-receipt"></i> Payment Summary</h3>
                <div class="summary-details">
                    <p>Amount: $<span class="amount">0.00</span></p>
                    <p>Processing Fee: $<span class="fee">0.00</span></p>
                    <p class="total">Total: $<span class="total-amount">0.00</span></p>
                </div>
            `;
            summaryElement.insertBefore(summaryDiv, summaryElement.firstChild);
        }

        const fee = amount * 0.029 + 0.30; // Example processing fee
        const total = amount + fee;

        document.querySelector('.amount').textContent = amount.toFixed(2);
        document.querySelector('.fee').textContent = fee.toFixed(2);
        document.querySelector('.total-amount').textContent = total.toFixed(2);
    }

    // Enhanced form submission with loading animation
    quickPayForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if(!validateForm()) {
            shakeForm();
            return;
        }

        const submitButton = quickPayForm.querySelector('.submit-payment');
        const originalButtonText = submitButton.innerHTML;
        
        // Show loading animation
        submitButton.innerHTML = `
            <div class="loader">
                <i class="fas fa-spinner"></i>
                <span>Processing Payment...</span>
            </div>
        `;
        submitButton.disabled = true;
        quickPayForm.classList.add('processing');

        try {
            // Simulate payment processing with steps
            await simulatePaymentSteps();
            
            // Show success message with confetti effect
            showSuccessMessage();
            quickPayForm.reset();
            resetCardIcon();
        } catch(error) {
            showNotification('Payment failed. Please try again.', 'error');
        } finally {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            quickPayForm.classList.remove('processing');
        }
    });

    async function simulatePaymentSteps() {
        const steps = [
            { message: 'Validating card information...', duration: 1000 },
            { message: 'Processing payment...', duration: 1500 },
            { message: 'Finalizing transaction...', duration: 500 }
        ];

        for(const step of steps) {
            await new Promise(resolve => {
                const button = quickPayForm.querySelector('.submit-payment');
                button.innerHTML = `
                    <div class="loader">
                        <i class="fas fa-spinner"></i>
                        <span>${step.message}</span>
                    </div>
                `;
                setTimeout(resolve, step.duration);
            });
        }
    }

    function resetCardIcon() {
        const icons = document.querySelectorAll('.payment-icons i');
        icons.forEach(icon => {
            icon.style.opacity = '1';
            icon.style.transform = 'scale(1)';
        });
    }

    function shakeForm() {
        quickPayForm.classList.add('shake');
        setTimeout(() => {
            quickPayForm.classList.remove('shake');
        }, 500);
    }

    // Enhanced form validation with visual feedback
    function validateForm() {
        let isValid = true;
        const inputs = quickPayForm.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            if(!input.value.trim()) {
                showError(input, 'This field is required');
                isValid = false;
            } else {
                removeError(input);
            }
        });

        // Validate card number with Luhn algorithm
        if(!isValidCardNumber(cardNumber.value.replace(/\s/g, ''))) {
            showError(cardNumber, 'Invalid card number');
            isValid = false;
        }

        // Validate expiry date
        const expiryValue = expiry.value;
        if(!/^\d{2}\/\d{2}$/.test(expiryValue)) {
            showError(expiry, 'Invalid expiry date');
            isValid = false;
        }

        // Validate CVV
        if(cvv.value.length < 3) {
            showError(cvv, 'Invalid CVV');
            isValid = false;
        }

        // Validate payment amount
        if(parseFloat(paymentAmount.value) <= 0) {
            showError(paymentAmount, 'Invalid amount');
            isValid = false;
        }

        // Validate card name
        if(cardName.value.trim().split(' ').length < 2) {
            showError(cardName, 'Please enter full name');
            isValid = false;
        }

        return isValid;
    }

    function isValidCardNumber(number) {
        let sum = 0;
        let isEven = false;
        
        // Loop through values starting from the right
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i));

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return (sum % 10) === 0;
    }

    function showSuccessMessage() {
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Payment Successful!</h3>
                <p>A confirmation email has been sent to your inbox.</p>
            </div>
        `;

        // Add success message to the form
        quickPayForm.innerHTML = '';
        quickPayForm.appendChild(successMessage);

        // Show notification
        showNotification('Payment successful! Thank you for your payment.', 'success');
    }

    // Enhanced error handling functions
    function showError(input, message) {
        removeError(input);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        input.parentNode.appendChild(errorDiv);
        input.classList.add('error');

        // Animate the error message
        errorDiv.style.animation = 'fadeInDown 0.3s ease-out';
    }

    function removeError(input) {
        const existingError = input.parentNode.querySelector('.error-message');
        if(existingError) {
            existingError.remove();
        }
        input.classList.remove('error');
    }

    // Enhanced notification function with icons
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = 'notification ' + type;
        
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 2rem',
            borderRadius: '12px',
            color: '#fff',
            backgroundColor: type === 'success' ? '#2ecc71' : '#e74c3c',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            animation: 'slideIn 0.5s ease-out'
        });

        document.body.appendChild(notification);

        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-out';
            notification.addEventListener('animationend', () => {
                notification.remove();
                style.remove();
            });
        }, 5000);
    }
}); 