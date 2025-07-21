// Optional for future enhancements like search or dropdowns
console.log("Site loaded.");

// Add smooth scrolling to all links
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

// Add scroll animation to feature cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});

// Add hover effect to navigation items
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.color = '#0077b6';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.color = '#2d3748';
    });
});

// Add search functionality
const searchInput = document.querySelector('.search-container input');
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

function handleSearch() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        // You can implement the actual search functionality here
        console.log('Searching for:', searchTerm);
        // For demo purposes, just clear the input
        searchInput.value = '';
    }
}

// Add a scroll-to-top button
const scrollButton = document.createElement('button');
scrollButton.innerHTML = '↑';
scrollButton.className = 'scroll-to-top';
scrollButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: #0077b6;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
`;

document.body.appendChild(scrollButton);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollButton.style.opacity = '1';
    } else {
        scrollButton.style.opacity = '0';
    }
});

scrollButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Image Slider functionality
document.addEventListener('DOMContentLoaded', function() {
    // Slider functionality
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Handle index wrapping
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        // Add active class to current slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');

        // Ensure image is loaded
        const currentImage = slides[currentSlide].querySelector('img');
        if (currentImage) {
            currentImage.style.opacity = '0';
            currentImage.onload = function() {
                currentImage.style.opacity = '1';
            };
            // Force reload if image is cached
            if (currentImage.complete) {
                currentImage.onload();
            }
        }
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        prevSlide();
        startSlideShow();
    });

    nextBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        nextSlide();
        startSlideShow();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
            startSlideShow();
        });
    });

    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
            clearInterval(slideInterval);
            if (difference > 0) {
                nextSlide(); // Swipe left
            } else {
                prevSlide(); // Swipe right
            }
            startSlideShow();
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            clearInterval(slideInterval);
            prevSlide();
            startSlideShow();
        } else if (e.key === 'ArrowRight') {
            clearInterval(slideInterval);
            nextSlide();
            startSlideShow();
        }
    });

    // Auto slide functionality
    function startSlideShow() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Pause slideshow when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(slideInterval);
        } else {
            startSlideShow();
        }
    });

    // Initialize slider
    showSlide(0);
    startSlideShow();

    // Add CSS transitions after initial load
    setTimeout(() => {
        slides.forEach(slide => {
            slide.style.transition = 'opacity 0.5s ease-in-out';
        });
    }, 100);
});

// Animate statistics when in view
const stats = document.querySelectorAll('.stat-number');
const animateStats = () => {
  stats.forEach(stat => {
    const target = parseInt(stat.textContent);
    let current = 0;
    const increment = target / 50;
    const updateCount = () => {
      if (current < target) {
        current += increment;
        stat.textContent = Math.ceil(current) + '+';
        requestAnimationFrame(updateCount);
      } else {
        stat.textContent = target + '+';
      }
    };
    updateCount();
  });
};

// Intersection Observer for statistics animation
const statsSection = document.querySelector('.stats-container');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStats();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

if (statsSection) {
  statsObserver.observe(statsSection);
}

// Testimonials Slider
const testimonialCards = document.querySelectorAll('.testimonial-card');
let currentTestimonial = 0;

const showTestimonial = (index) => {
  testimonialCards.forEach((card, i) => {
    card.style.display = i === index ? 'block' : 'none';
  });
};

const nextTestimonial = () => {
  currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
  showTestimonial(currentTestimonial);
};

// Initialize testimonials
if (testimonialCards.length > 0) {
  showTestimonial(0);
  setInterval(nextTestimonial, 5000); // Auto-advance every 5 seconds
}

// Smooth scroll for navigation links
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

// Add scroll animations to elements
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.service-item, .news-card, .testimonial-card');
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementBottom = element.getBoundingClientRect().bottom;
    const isVisible = elementTop < window.innerHeight && elementBottom >= 0;
    
    if (isVisible) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
};

// Initialize scroll animations
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Add hover effects for service items
const serviceItems = document.querySelectorAll('.service-item');
serviceItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.transform = 'translateY(-10px)';
  });
  
  item.addEventListener('mouseleave', () => {
    item.style.transform = 'translateY(0)';
  });
});
