// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const inputs = contactForm.querySelectorAll('input, select, textarea');

    // Add floating label effect
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });

        // Initialize state for pre-filled inputs
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic validation
        let isValid = true;
        inputs.forEach(input => {
            if (input.required && !input.value.trim()) {
                isValid = false;
                showError(input, 'This field is required');
            } else {
                clearError(input);
            }
        });

        // Email validation
        const emailInput = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value && !emailRegex.test(emailInput.value)) {
            isValid = false;
            showError(emailInput, 'Please enter a valid email address');
        }

        if (isValid) {
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            try {
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

                // Simulate form submission (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Show success message
                showMessage('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();

            } catch (error) {
                showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    });
});

// Error handling functions
function showError(input, message) {
    const formGroup = input.parentElement;
    const errorDiv = formGroup.querySelector('.error-message') || document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(errorDiv);
    }
    
    formGroup.classList.add('error');
    input.classList.add('error');
}

function clearError(input) {
    const formGroup = input.parentElement;
    const errorDiv = formGroup.querySelector('.error-message');
    
    if (errorDiv) {
        errorDiv.remove();
    }
    
    formGroup.classList.remove('error');
    input.classList.remove('error');
}

// Message display function
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    const container = document.querySelector('.contact-form-container');
    container.insertBefore(messageDiv, container.firstChild);

    // Auto-remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Add smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}); 