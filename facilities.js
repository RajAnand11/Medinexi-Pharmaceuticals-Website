document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true
    });

    // Virtual Tour Functionality
    const tourBtn = document.getElementById('startTourBtn');
    const facilityCards = document.querySelectorAll('.facility-card');
    let currentTourStep = 0;
    const tourSteps = [
        {
            title: "Emergency Department",
            description: "Our state-of-the-art emergency department is equipped to handle any medical emergency 24/7.",
            position: { x: 0, y: 0 }
        },
        {
            title: "Surgical Suites",
            description: "Modern operating rooms with advanced surgical equipment and monitoring systems.",
            position: { x: 0, y: 0 }
        },
        {
            title: "Diagnostic Center",
            description: "Comprehensive diagnostic services with the latest imaging technology.",
            position: { x: 0, y: 0 }
        },
        {
            title: "Cardiology Department",
            description: "Specialized cardiac care facility with advanced monitoring systems.",
            position: { x: 0, y: 0 }
        }
    ];

    // Initialize Virtual Tour
    if (tourBtn) {
        tourBtn.addEventListener('click', startVirtualTour);
    }

    function startVirtualTour() {
        currentTourStep = 0;
        showTourStep(currentTourStep);
        
        // Change button text and functionality
        tourBtn.innerHTML = '<i class="fas fa-forward"></i> Next Stop';
        tourBtn.removeEventListener('click', startVirtualTour);
        tourBtn.addEventListener('click', nextTourStep);
    }

    function showTourStep(stepIndex) {
        // Remove highlight from all cards
        facilityCards.forEach(card => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });

        // Highlight current facility card
        const currentCard = facilityCards[stepIndex];
        if (currentCard) {
            currentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            currentCard.style.transform = 'scale(1.05)';
            currentCard.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';

            // Show tour information
            showTourInfo(tourSteps[stepIndex]);
        }
    }

    function showTourInfo(stepInfo) {
        // Remove existing tour info
        const existingInfo = document.querySelector('.tour-info');
        if (existingInfo) {
            existingInfo.remove();
        }

        // Create and show new tour info
        const infoBox = document.createElement('div');
        infoBox.className = 'tour-info';
        infoBox.innerHTML = `
            <h3>${stepInfo.title}</h3>
            <p>${stepInfo.description}</p>
        `;

        // Add styles to the tour info box
        Object.assign(infoBox.style, {
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'white',
            padding: '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: '1000',
            maxWidth: '300px',
            animation: 'fadeIn 0.3s ease'
        });

        document.body.appendChild(infoBox);
    }

    function nextTourStep() {
        currentTourStep++;
        if (currentTourStep >= tourSteps.length) {
            // End the tour
            endTour();
            return;
        }
        showTourStep(currentTourStep);
    }

    function endTour() {
        // Remove tour info
        const tourInfo = document.querySelector('.tour-info');
        if (tourInfo) {
            tourInfo.remove();
        }

        // Reset all cards
        facilityCards.forEach(card => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });

        // Reset button
        tourBtn.innerHTML = '<i class="fas fa-vr-cardboard"></i> Start Virtual Tour';
        tourBtn.removeEventListener('click', nextTourStep);
        tourBtn.addEventListener('click', startVirtualTour);
    }

    // Facility Card Hover Effects
    facilityCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!document.querySelector('.tour-info')) { // Only apply if not in tour
                card.style.transform = 'translateY(-10px)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!document.querySelector('.tour-info')) { // Only apply if not in tour
                card.style.transform = '';
            }
        });
    });

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Statistics Counter Animation
    const stats = document.querySelectorAll('.stat-item h3');
    const observerOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                animateValue(target, 0, finalValue, 2000);
                statsObserver.unobserve(target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + (element.textContent.includes('+') ? '+' : '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Add parallax effect to hero section
    const hero = document.querySelector('.facilities-hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        });
    }
}); 