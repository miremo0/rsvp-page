// Password verification and modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Password verification
    document.getElementById('submitPassword')?.addEventListener('click', function() {
        const password = document.getElementById('guestListPassword').value;
        if (password === 'Morgan0929!') {
            document.getElementById('passwordOverlay').classList.add('hidden');
            document.getElementById('mainContent').classList.remove('hidden');
            document.getElementById('authButton').classList.remove('hidden');
        } else {
            document.getElementById('passwordError').textContent = 'Incorrect password';
        }
    });

    // Handle enter key for password
    document.getElementById('guestListPassword')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('submitPassword').click();
        }
    });

    // Modal functionality
    const modal = document.getElementById('linkModal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.classList.add('hidden');
        }
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    }

    // Copy link functionality
    document.getElementById('copyLink')?.addEventListener('click', function() {
        const linkInput = document.getElementById('invitationLink');
        linkInput.select();
        document.execCommand('copy');
        this.textContent = 'Copied!';
        setTimeout(() => {
            this.textContent = 'Copy';
        }, 2000);
    });
});

// Wedding details
const weddingDetails = {
    brideAndGroom: "Jaycel & Murphy",
    date: "April 8, 2025",
    venue: "Eden Nature Park & Resort, Toril, Davao City",
    message: "Join us as we celebrate our love amidst the falling autumn leaves"
};

// Function to create falling leaves animation
function createFallingLeaves() {
    const leavesContainer = document.querySelector('.falling-leaves');
    if (!leavesContainer) return;

    // Clear any existing leaves
    leavesContainer.innerHTML = '';

    // Create leaves with varying properties
    for (let i = 0; i < 25; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        
        // Randomize starting position and animation
        const startPosition = Math.random() * 100;
        const animationDuration = Math.random() * 3 + 5; // 5-8 seconds
        const animationDelay = Math.random() * 5;
        const rotationDirection = Math.random() > 0.5 ? 1 : -1;
        const scale = 0.7 + Math.random() * 0.6; // Random size between 0.7 and 1.3
        
        // Apply styles
        Object.assign(leaf.style, {
            left: `${startPosition}%`,
            animationDuration: `${animationDuration}s`,
            animationDelay: `${animationDelay}s`,
            transform: `rotate(${rotationDirection * 360}deg) scale(${scale})`,
            opacity: (0.6 + Math.random() * 0.4).toString()
        });

        // Add to container
        leavesContainer.appendChild(leaf);
    }
}

// Function to update page content
function updatePageContent() {
    // Update couple names
    const coupleNamesElement = document.getElementById('coupleNames');
    if (coupleNamesElement) {
        coupleNamesElement.textContent = weddingDetails.brideAndGroom;
    }

    // Update wedding date
    const weddingDateElement = document.getElementById('weddingDate');
    if (weddingDateElement) {
        weddingDateElement.textContent = weddingDetails.date;
    }

    // Update venue
    const venueElement = document.getElementById('venue');
    if (venueElement) {
        venueElement.textContent = weddingDetails.venue;
    }

    // Update message
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.textContent = weddingDetails.message;
    }
}

// Slideshow functionality
let slideIndex = 1;
let mainSlideIndex = 1;
let slideInterval;
let mainSlideInterval;

// Change slide with prev/next buttons
function changeSlide(n) {
    if (document.getElementsByClassName("slide").length > 0) {
        showSlides(slideIndex += n);
    }
}

// Change main slideshow with prev/next buttons
function changeMainSlide(n) {
    showMainSlides(mainSlideIndex += n);
}

// Change slide with dots
function currentSlide(n) {
    if (document.getElementsByClassName("slide").length > 0) {
        showSlides(slideIndex = n);
    }
}

// Change main slideshow with dots
function currentMainSlide(n) {
    showMainSlides(mainSlideIndex = n);
}

function showSlides(n) {
    const slides = document.querySelectorAll(".attire-slideshow .slide");
    if (slides.length === 0) return; // Don't proceed if no slides exist
    
    const dots = document.querySelectorAll(".attire-slideshow .dot");
    
    // Handle wrapping around at the ends
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    
    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    // Remove active class from all dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    
    // Show the current slide and activate the corresponding dot
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].classList.add("active");
}

function showMainSlides(n) {
    const slides = document.querySelectorAll(".main-slideshow .slide");
    if (slides.length === 0) return;
    
    const dots = document.querySelectorAll(".main-slideshow .dot");
    
    // Handle wrapping around at the ends
    if (n > slides.length) {
        mainSlideIndex = 1;
    }
    if (n < 1) {
        mainSlideIndex = slides.length;
    }
    
    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    // Remove active class from all dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    
    // Show the current slide and activate the corresponding dot
    slides[mainSlideIndex - 1].style.display = "block";
    dots[mainSlideIndex - 1].classList.add("active");
}

// Initialize page functionality
document.addEventListener('DOMContentLoaded', () => {
    updatePageContent();
    createFallingLeaves();
    setInterval(createFallingLeaves, 15000); // Recreate leaves every 15 seconds
    
    // Initialize main slideshow
    showMainSlides(mainSlideIndex);
    
    // Auto advance main slides every 4 seconds (faster to cycle through more images)
    mainSlideInterval = setInterval(() => {
        changeMainSlide(1);
    }, 4000);
    
    // Only initialize attire slideshow if slides exist
    const attireSlides = document.querySelectorAll(".attire-slideshow .slide");
    if (attireSlides.length > 0) {
        showSlides(slideIndex);
        // Auto advance slides every 5 seconds
        slideInterval = setInterval(() => {
            changeSlide(1);
        }, 5000);
    }
    
    // Add touch swipe support for mobile devices
    const mainSlideshowContainer = document.querySelector('.main-slideshow-container');
    if (mainSlideshowContainer) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        mainSlideshowContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        mainSlideshowContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance required for swipe
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left, show next slide
                changeMainSlide(1);
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right, show previous slide
                changeMainSlide(-1);
            }
        }
    }
    
    // Add touch swipe support for attire slideshow
    const attireSlideshowContainer = document.querySelector('.attire-slideshow .slideshow-container');
    if (attireSlideshowContainer) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        attireSlideshowContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        attireSlideshowContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleAttireSwipe();
        }, false);
        
        function handleAttireSwipe() {
            const swipeThreshold = 50; // Minimum distance required for swipe
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left, show next slide
                changeSlide(1);
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right, show previous slide
                changeSlide(-1);
            }
        }
    }
}); 