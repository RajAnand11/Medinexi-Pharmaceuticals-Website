document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentStep = 1;
    const totalSteps = 4;
    let appointmentData = {
        service: '',
        doctor: '',
        date: '',
        time: '',
        patientInfo: {}
    };

    // Get DOM elements
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.step-content');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Initialize date picker with more options
    const datePicker = flatpickr("#appointment-date", {
        minDate: "today",
        maxDate: new Date().fp_incr(60), // Allow booking up to 60 days in advance
        disable: [
            function(date) {
                // Disable weekends
                return date.getDay() === 0 || date.getDay() === 6;
            }
        ],
        dateFormat: "Y-m-d",
        onChange: function(selectedDates) {
            appointmentData.date = selectedDates[0].toISOString().split('T')[0];
            generateTimeSlots(selectedDates[0]);
            updateSummary();
        }
    });

    // Service selection with animation
    const serviceCards = document.querySelectorAll('.service-card');
    let selectedService = '';
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            serviceCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            card.style.animation = 'fadeIn 0.5s ease';
            selectedService = card.querySelector('h3').textContent;
            document.getElementById('summary-service').textContent = selectedService;
            updateSummary();
            enableNextButton();
        });
    });

    // Enhanced doctor data with more details
    const doctors = [
        {
            name: "Dr. Sarah Johnson",
            specialty: "General Medicine",
            experience: "15 years experience",
            education: "MD - Johns Hopkins University",
            languages: ["English", "Spanish"],
            image: "https://deadline.com/wp-content/uploads/2024/08/pete-docter-pixar.jpg",
            availability: ["Monday", "Tuesday", "Wednesday"]
        },
        {
            name: "Dr. Michael Chen",
            specialty: "Cardiology",
            experience: "12 years experience",
            education: "MD - Stanford University",
            languages: ["English", "Mandarin"],
            image: "https://caringmagazine.org/wp-content/uploads/2016/08/BobDoctor-Feature.jpg",
            availability: ["Tuesday", "Thursday", "Friday"]
        },
        {
            name: "Dr. Emily Williams",
            specialty: "Pediatrics",
            experience: "10 years experience",
            education: "MD - Harvard Medical School",
            languages: ["English", "French"],
            image: "https://images-prd.deshabhimani.com/docter-1745338992823-ba349574-39bf-412d-b755-09b795a59991-900x506.webp",
            availability: ["Monday", "Wednesday", "Friday"]
        },
        {
            name: "Dr. James Martinez",
            specialty: "Dermatology",
            experience: "8 years experience",
            education: "MD - UCLA Medical School",
            languages: ["English", "Spanish"],
            image: "https://www.future-doctor.de/wp-content/uploads/2024/08/shutterstock_2480850611.jpg",
            availability: ["Tuesday", "Thursday"]
        }
    ];

    // Initialize doctor filter
    const specialtyFilter = document.getElementById('specialty-filter');
    specialtyFilter.addEventListener('change', () => {
        const selectedSpecialty = specialtyFilter.value;
        const filteredDoctors = selectedSpecialty 
            ? doctors.filter(doctor => doctor.specialty === selectedSpecialty)
            : doctors;
        populateDoctorGrid(filteredDoctors);
    });

    // Populate doctor grid with enhanced cards
    function populateDoctorGrid(doctorsToShow) {
        const doctorGrid = document.querySelector('.doctor-grid');
        doctorGrid.innerHTML = '';
        
        doctorsToShow.forEach(doctor => {
            const doctorCard = createDoctorCard(doctor);
            doctorGrid.appendChild(doctorCard);
        });
    }

    // Enhanced doctor card creation
    function createDoctorCard(doctor) {
        const card = document.createElement('div');
        card.className = 'doctor-card';
        card.innerHTML = `
            <img src="${doctor.image}" alt="${doctor.name}" class="doctor-image">
            <div class="doctor-info">
                <h3>${doctor.name}</h3>
                <p><i class="fas fa-stethoscope"></i> ${doctor.specialty}</p>
                <p><i class="fas fa-clock"></i> ${doctor.experience}</p>
                <p><i class="fas fa-graduation-cap"></i> ${doctor.education}</p>
                <p><i class="fas fa-language"></i> ${doctor.languages.join(', ')}</p>
                <p><i class="fas fa-calendar-alt"></i> Available: ${doctor.availability.join(', ')}</p>
            </div>
        `;
        
        card.addEventListener('click', () => {
            document.querySelectorAll('.doctor-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            appointmentData.doctor = doctor.name;
            updateSummary();
            enableNextButton();
        });
        
        return card;
    }

    // Enhanced time slot generation
    function generateTimeSlots(selectedDate) {
        const timeGrid = document.querySelector('.time-grid');
        timeGrid.innerHTML = '';
        
        const dayOfWeek = selectedDate.getDay();
        const startHour = 9; // 9 AM
        const endHour = 17; // 5 PM
        
        for (let hour = startHour; hour < endHour; hour++) {
            for (let minutes of ['00', '30']) {
                const timeSlot = document.createElement('div');
                timeSlot.className = 'time-slot';
                const time = `${hour}:${minutes}`;
                timeSlot.textContent = formatTime(time);
                
                // More realistic slot availability
                const isBooked = Math.random() < 0.3;
                const isPeak = hour >= 11 && hour <= 14;
                const isSelected = appointmentData.time === formatTime(time);
                
                if (isBooked || (isPeak && Math.random() < 0.5)) {
                    timeSlot.classList.add('booked');
                    timeSlot.title = "This slot is already booked";
                } else {
                    timeSlot.addEventListener('click', () => selectTimeSlot(timeSlot, time));
                    if (isSelected) {
                        timeSlot.classList.add('selected');
                    }
                }
                
                timeGrid.appendChild(timeSlot);
            }
        }
    }

    // Improved time slot selection
    function selectTimeSlot(slot, time) {
        if (slot.classList.contains('booked')) return;
        
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        appointmentData.time = formatTime(time);
        updateSummary();
        enableNextButton();
    }

    // Format time with improved handling
    function formatTime(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    }

    // Enhanced step navigation
    function goToStep(step) {
        if (step < 1 || step > totalSteps) return;
        
        currentStep = step;
        
        // Update steps with animation
        steps.forEach((s, index) => {
            if (index + 1 === step) {
                s.classList.add('active');
                s.style.animation = 'fadeIn 0.5s ease';
            } else {
                s.classList.remove('active');
            }
        });
        
        // Update content with animation
        stepContents.forEach((content, index) => {
            if (index + 1 === step) {
                content.classList.add('active');
                content.style.animation = 'fadeIn 0.5s ease';
            } else {
                content.classList.remove('active');
            }
        });
        
        // Update buttons
        prevBtn.disabled = step === 1;
        nextBtn.textContent = step === totalSteps ? 'Confirm Appointment' : 'Next';
        
        // Scroll to top of the step
        document.querySelector('.appointment-main').scrollIntoView({ behavior: 'smooth' });
        
        enableNextButton();
    }

    // Navigation event listeners
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
        } else {
            submitAppointment();
        }
    });

    // Step number clicks with validation
    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            const stepNumber = index + 1;
            if (stepNumber < currentStep || validateStep(currentStep)) {
                goToStep(stepNumber);
            }
        });
    });

    // Enhanced step validation
    function validateStep(step) {
        switch(step) {
            case 1:
                if (!selectedService) {
                    showError(null, 'Please select a service to continue');
                    return false;
                }
                return true;
            case 2:
                if (!appointmentData.doctor) {
                    showError(null, 'Please select a doctor to continue');
                    return false;
                }
                return true;
            case 3:
                if (!appointmentData.date || !appointmentData.time) {
                    showError(null, 'Please select both date and time to continue');
                    return false;
                }
                return true;
            case 4:
                return validateForm();
            default:
                return true;
        }
    }

    // Enable/disable next button with visual feedback
    function enableNextButton() {
        const isValid = validateStep(currentStep);
        nextBtn.disabled = !isValid;
        nextBtn.style.opacity = isValid ? '1' : '0.5';
    }

    // Enhanced form validation
    function validateForm() {
        const form = document.getElementById('appointmentForm');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, 'This field is required');
            } else if (field.pattern && !new RegExp(field.pattern).test(field.value)) {
                isValid = false;
                showError(field, field.title || 'Invalid format');
            } else {
                clearError(field);
            }
        });

        // Validate email format
        const emailField = document.getElementById('email');
        if (emailField.value && !isValidEmail(emailField.value)) {
            isValid = false;
            showError(emailField, 'Please enter a valid email address');
        }

        // Validate phone format
        const phoneField = document.getElementById('phone');
        if (phoneField.value && !isValidPhone(phoneField.value)) {
            isValid = false;
            showError(phoneField, 'Please enter a valid phone number: (XXX) XXX-XXXX');
        }

        return isValid;
    }

    // Email validation
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Phone validation
    function isValidPhone(phone) {
        return /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);
    }

    // Enhanced error handling
    function showError(field, message) {
        if (!field) {
            // Show general error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message general-error';
            errorDiv.textContent = message;
            const currentContent = document.querySelector('.step-content.active');
            if (!currentContent.querySelector('.general-error')) {
                currentContent.insertBefore(errorDiv, currentContent.firstChild);
                setTimeout(() => errorDiv.remove(), 3000);
            }
            return;
        }

        const formGroup = field.parentElement;
        const error = formGroup.querySelector('.error-message') || document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(error);
        }
        field.classList.add('error');
    }

    function clearError(field) {
        const formGroup = field.parentElement;
        const error = formGroup.querySelector('.error-message');
        if (error) {
            error.remove();
        }
        field.classList.remove('error');
    }

    // Enhanced appointment summary
    function updateSummary() {
        document.getElementById('summary-service').textContent = selectedService || 'Not selected';
        document.getElementById('summary-doctor').textContent = appointmentData.doctor || 'Not selected';
        
        const dateTime = appointmentData.date && appointmentData.time 
            ? `${formatDate(appointmentData.date)} at ${appointmentData.time}`
            : 'Not selected';
        document.getElementById('summary-datetime').textContent = dateTime;
    }

    // Format date for display
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Enhanced appointment submission
    async function submitAppointment() {
        if (!validateStep(currentStep)) return;

        const form = document.getElementById('appointmentForm');
        const formData = new FormData(form);
        
        // Collect form data
        appointmentData.patientInfo = Object.fromEntries(formData.entries());
        
        // Show loading state
        nextBtn.disabled = true;
        nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scheduling...';
        
        try {
            const response = await fetch('http://localhost:5000/submit-appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData.patientInfo)
            });

            const result = await response.json();
            
            if (response.ok) {
                // Show success message with animation
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <h3>Appointment Scheduled Successfully!</h3>
                    <p>We've sent a confirmation email to ${appointmentData.patientInfo.email}</p>
                    <p>Appointment Details:</p>
                    <ul>
                        <li>Service: ${selectedService}</li>
                        <li>Doctor: ${appointmentData.doctor}</li>
                        <li>Date & Time: ${formatDate(appointmentData.date)} at ${appointmentData.time}</li>
                    </ul>
                    <button onclick="window.location.reload()" class="btn">Schedule Another Appointment</button>
                `;
                
                const appointmentContent = document.querySelector('.appointment-content');
                appointmentContent.innerHTML = '';
                appointmentContent.appendChild(successMessage);
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth' });

                // Reset form and go back to step 1
                form.reset();
                goToStep(1);
                // Reset summary
                document.getElementById('summary-service').textContent = 'Not selected';
                document.getElementById('summary-doctor').textContent = 'Not selected';
                document.getElementById('summary-datetime').textContent = 'Not selected';
                // Reset selections
                selectedService = '';
                appointmentData.doctor = '';
                appointmentData.date = '';
                appointmentData.time = '';
                serviceCards.forEach(c => c.classList.remove('selected'));
            } else {
                throw new Error(result.error || 'Failed to schedule appointment');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            // Show success message with animation
            nextBtn.disabled = false;
            nextBtn.innerHTML = 'Confirm Appointment';
        }
    }

    // Initialize form field listeners
    const formFields = document.querySelectorAll('#appointmentForm input, #appointmentForm select, #appointmentForm textarea');
    formFields.forEach(field => {
        field.addEventListener('input', () => {
            clearError(field);
            enableNextButton();
        });
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });

    // Initialize the page
    populateDoctorGrid(doctors);
}); 