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
    for (let i = 0; i < 15; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        
        // Randomize starting position and animation
        const startPosition = Math.random() * 100;
        const animationDuration = Math.random() * 1 + 3; // 5-10 seconds
        const animationDelay = Math.random() * 5;
        const rotationDirection = Math.random() > 0.5 ? 1 : -1;
        
        // Apply styles
        Object.assign(leaf.style, {
            left: `${startPosition}%`,
            animationDuration: `${animationDuration}s`,
            animationDelay: `${animationDelay}s`,
            transform: `rotate(${rotationDirection * 360}deg)`
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
let slideInterval;

function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    
    // If there are no slides on this page, return early
    if (!slides.length) return;

    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}

function changeSlide(n) {
    const slides = document.getElementsByClassName("slide");
    if (!slides.length) return;
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    const slides = document.getElementsByClassName("slide");
    if (!slides.length) return;
    showSlides(slideIndex = n);
}

// Initialize slideshow if slides are present
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.getElementsByClassName("slide");
    if (slides.length) {
        showSlides(slideIndex);
        // Auto advance slides every 5 seconds
        slideInterval = setInterval(function() {
            changeSlide(1);
        }, 5000);
    }
});

// Initialize page functionality
document.addEventListener('DOMContentLoaded', () => {
    updatePageContent();
    createFallingLeaves();
    setInterval(createFallingLeaves, 20000); // Recreate leaves every 20 seconds
}); 