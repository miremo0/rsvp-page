// Wedding details (hardcoded)
const weddingDetails = {
    brideAndGroom: "Jaycel & Murphy",
    date: "April 8, 2025",
    venue: "Eden Nature Park & Resort, Toril, Davao City",
    message: "Join us as we celebrate our love amidst the falling autumn leaves"
};

// Guest list (hardcoded)
const guestList = [
    { name: "Murphy John Ong", role: "Groom", category: "Main" },
    { name: "Jaycel Escalera", role: "Bride", category: "Main" },
    { name: "Aurelia Ong", role: "Groom's Mother", category: "Family" },
    { name: "Leonora Escalera", role: "Bride's Mother", category: "Family" },
    { name: "Gilbert Escalera", role: "Bride's Father", category: "Family" },
    { name: "Roger Galido", role: "Ninong", category: "Principal" },
    { name: "Flordelize Galido", role: "Ninang", category: "Principal" },
    { name: "Karen Mendez", role: "Ninang", category: "Principal" },
    { name: "Adonis Diosana", role: "Ninong", category: "Principal" },
    { name: "Cielo Marie Escalera", role: "Maid of Honor", category: "Entourage" },
    { name: "Roxanne Mary Galido-Tan", role: "Bridesmaid", category: "Entourage" },
    { name: "Gerlie Gica", role: "Bridesmaid", category: "Entourage" },
    { name: "Veejay Salonga", role: "Bridesman", category: "Entourage" },
    { name: "Reyante Vizcarra", role: "Bestman", category: "Entourage" },
    { name: "Nicole Alchie Ong", role: "Groomsmen", category: "Entourage" },
    { name: "Erikson Baylon", role: "Groomsmen", category: "Entourage" },
    { name: "Michael Angelo Espanol", role: "Groomsmen", category: "Entourage" },
    { name: "Mary Grace Ong", role: "Ring Bearer", category: "Entourage" },
    { name: "Gilbert Escalera Jr", role: "Bride's Brother", category: "Family" },
    { name: "Kristine Escalera", role: "Bride's Sister In Law", category: "Family" },
    { name: "Norbert Escalera", role: "Bride's Brother", category: "Family" },
    { name: "Noralyn Escalera", role: "Bride's Sister", category: "Family" },
    { name: "Reymund Escalera", role: "Bride's Brother", category: "Family" },
    { name: "Margie Cortez", role: "Bride's Guest", category: "Guest" },
    { name: "Dax Zarex Tumabang", role: "Bride's Guest", category: "Guest" },
    { name: "Mark Stephen Ong", role: "Standing in as Father of the Groom/Groom's Brother", category: "Family" },
    { name: "Rizza Alcantara", role: "Groom's Nephew", category: "Family" },
    { name: "Richard Olivar", role: "Groom's Uncle", category: "Family" },
    { name: "Jopeth Olivar", role: "Groom's Cousin", category: "Family" },
    { name: "Jose Tan Jr", role: "Bride's Cousin", category: "Family" },
    { name: "Karl Gabriel Galido", role: "Bride's Cousin", category: "Family" },
    { name: "Victoria Salonga", role: "Bride's Auntie", category: "Family" },
    { name: "Noriel Jad Cabanilla", role: "Bride's Cousin", category: "Family" },
    { name: "Victor Escalera Jr", role: "Bride's Uncle", category: "Family" },
    { name: "Albar Argente", role: "Bride's Friend", category: "Guest" },
    { name: "Jerson Deparien", role: "Bride's Friend", category: "Guest" },
    { name: "Eddie Boy Piloto", role: "Bride's Friend", category: "Guest" },
    { name: "Asawa ni Ate Karen", role: "Bride's Guest", category: "Guest" },
    { name: "Obing", role: "Groom's Guest", category: "Guest" },
    { name: "Ancheta", role: "Groom's Guest", category: "Guest" },
    { name: "Anchetas Boyfriend", role: "Groom's Guest", category: "Guest" },
    { name: "Kurt", role: "Groom's Highschool Friend", category: "Guest" },
    { name: "RM", role: "Groom's Guest", category: "Guest" },
    { name: "Ate Mariane", role: "Groom's Guest", category: "Guest" },
    { name: "Al IGW", role: "Groom's Guest", category: "Guest" },
    { name: "Mark Batisil", role: "Bride's Guest", category: "Guest" }
];

let selectedGuest = null;

// Slideshow functionality
let slideIndex = 1;

// Initialize slideshow when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize slideshow if we have slides
    if (document.getElementsByClassName("slide").length > 0) {
        showSlides(slideIndex);
    }
});

// Change slide with prev/next buttons
function changeSlide(n) {
    showSlides(slideIndex += n);
}

// Change slide with dots
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    
    // If no slides, return early
    if (slides.length === 0) return;
    
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
    if (dots.length > 0) {
        dots[slideIndex - 1].classList.add("active");
    }
}

// Auto advance slides every 5 seconds (only if slides exist)
if (document.getElementsByClassName("slide").length > 0) {
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

// Update page content with wedding details
function updatePageContent() {
    const elements = {
        coupleNames: weddingDetails.brideAndGroom,
        weddingDate: weddingDetails.date,
        venue: weddingDetails.venue,
        message: weddingDetails.message
    };

    Object.entries(elements).forEach(([id, content]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    });
}

// Handle autocomplete
function setupAutocomplete() {
    const input = document.getElementById('guestName');
    const dropdown = document.getElementById('autocompleteDropdown');
    const guestDetails = document.getElementById('guestDetails');

    if (!input || !dropdown) return;

    input.addEventListener('input', () => {
        const value = input.value.toLowerCase().trim();
        
        // Clear selection when input changes
        if (selectedGuest && selectedGuest.name.toLowerCase() !== value) {
            selectedGuest = null;
            guestDetails?.classList.add('hidden');
        }

        // Show/hide dropdown based on input length
        if (value.length < 1) {
            dropdown.style.display = 'none';
            return;
        }

        // Filter out Bride and Groom, then find matches
        const matches = guestList
            .filter(guest => !['Bride', 'Groom'].includes(guest.role))
            .filter(guest => 
                guest.name.toLowerCase().includes(value) ||
                guest.role.toLowerCase().includes(value)
            );

        if (matches.length > 0) {
            const html = matches.map(guest => `
                <div class="autocomplete-item" data-name="${guest.name}">
                    <div class="name">${highlightMatch(guest.name, value)}</div>
                    <div class="role">${guest.role}</div>
                </div>
            `).join('');
            
            dropdown.innerHTML = html;
            dropdown.style.display = 'block';
        } else {
            dropdown.innerHTML = '<div class="autocomplete-item">No matches found</div>';
            dropdown.style.display = 'block';
        }
    });

    // Handle click on autocomplete item
    dropdown.addEventListener('click', (e) => {
        const item = e.target.closest('.autocomplete-item');
        if (!item) return;

        const guestName = item.dataset.name;
        if (!guestName) return;

        selectedGuest = guestList.find(g => g.name === guestName);
        
        if (selectedGuest) {
            input.value = selectedGuest.name;
            dropdown.style.display = 'none';
            displayGuestDetails(selectedGuest);
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });

    // Handle keyboard navigation
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdown.style.display = 'none';
        }
    });
}

// Display guest details
function displayGuestDetails(guest) {
    const detailsDiv = document.getElementById('guestDetails');
    const roleSpan = document.getElementById('guestRole');
    const categorySpan = document.getElementById('guestCategory');

    if (detailsDiv && roleSpan && categorySpan) {
        roleSpan.textContent = guest.role;
        categorySpan.textContent = guest.category;
        detailsDiv.classList.remove('hidden');
    }
}

// Highlight matching text in autocomplete
function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Get guests from localStorage
function getGuests() {
    try {
        const storedGuests = localStorage.getItem('confirmedGuests');
        return storedGuests ? JSON.parse(storedGuests) : [];
    } catch (error) {
        console.error('Error getting RSVP data:', error);
        return [];
    }
}

// Save guests to localStorage
function saveGuests(guests) {
    try {
        localStorage.setItem('confirmedGuests', JSON.stringify(guests));
        return true;
    } catch (error) {
        console.error('Error saving RSVP data:', error);
        return false;
    }
}

// Handle RSVP form submission
async function handleRSVP() {
    const form = document.getElementById('rsvpForm');
    const submitButton = form?.querySelector('.submit-rsvp');
    if (!form || !submitButton) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!selectedGuest) {
            showMessage('Please select your name from the dropdown list.', 'error');
            return;
        }

        // Disable submit button while processing
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';

        try {
            // Get current guest list
            const existingGuests = getGuests();
            
            // Check if guest has already RSVP'd
            if (existingGuests.some(guest => guest.name.toLowerCase() === selectedGuest.name.toLowerCase())) {
                showMessage("You've already RSVP'd to our wedding!", 'error');
                return;
            }

            // Add new guest with details
            const newGuest = {
                ...selectedGuest,
                status: 'accepted',
                timestamp: new Date().toISOString()
            };
            
            existingGuests.push(newGuest);
            const saved = saveGuests(existingGuests);
            
            if (saved) {
                showMessage('Thank you for accepting our invitation!', 'success');
                form.reset();
                document.getElementById('guestDetails').classList.add('hidden');
                selectedGuest = null;

                // Store the guest name in sessionStorage for the thank you page
                sessionStorage.setItem('rsvpGuest', JSON.stringify(newGuest));

                // After 1 second, redirect to thank you page
                setTimeout(() => {
                    window.location.href = 'thankyou.html';
                }, 1000);
            } else {
                throw new Error('Failed to save RSVP');
            }

        } catch (error) {
            console.error('Error saving RSVP:', error);
            showMessage('There was an error saving your RSVP. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
        }
    });
}

// Display message on RSVP page with auto-hide option
function showMessage(message, type = 'success') {
    const messageElement = document.getElementById('responseMessage');
    if (!messageElement) return;

    messageElement.textContent = message;
    messageElement.className = `response-message ${type}`;
    messageElement.style.display = 'block';

    // For error messages, auto-hide after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

// Display guest list
async function displayGuestList() {
    const categoriesContainer = document.getElementById('guestCategories');
    if (!categoriesContainer) return;

    try {
        const confirmedGuests = getGuests();
        const categories = ['Family', 'Principal', 'Entourage', 'Guest'];
        
        // Create HTML for each category
        const categoriesHTML = categories.map(category => {
            if (category === 'Family') {
                // Separate family members into bride's and groom's sides
                const brideFamily = guestList
                    .filter(guest => 
                        guest.category === 'Family' && 
                        !['Bride', 'Groom'].includes(guest.role) &&
                        (guest.role.toLowerCase().includes('bride') || guest.name.includes('Escalera'))
                    )
                    .map(guest => createGuestCard(guest, confirmedGuests))
                    .join('');

                const groomFamily = guestList
                    .filter(guest => 
                        guest.category === 'Family' && 
                        !['Bride', 'Groom'].includes(guest.role) &&
                        (guest.role.toLowerCase().includes('groom') || guest.name.includes('Ong') || guest.name.includes('Olivar'))
                    )
                    .map(guest => createGuestCard(guest, confirmedGuests))
                    .join('');

                return `
                    <div class="guest-category family-category">
                        <h2 class="category-title">Family</h2>
                        <div class="family-columns">
                            <div class="family-column">
                                <h3 class="family-subtitle">Bride's Family</h3>
                                <div class="guest-grid">
                                    ${brideFamily}
                                </div>
                            </div>
                            <div class="family-column">
                                <h3 class="family-subtitle">Groom's Family</h3>
                                <div class="guest-grid">
                                    ${groomFamily}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }

            if (category === 'Principal') {
                const ninang = guestList
                    .filter(guest => 
                        guest.category === 'Principal' && 
                        guest.role.includes('Ninang')
                    )
                    .map(guest => createGuestCard(guest, confirmedGuests))
                    .join('');

                const ninong = guestList
                    .filter(guest => 
                        guest.category === 'Principal' && 
                        guest.role.includes('Ninong')
                    )
                    .map(guest => createGuestCard(guest, confirmedGuests))
                    .join('');

                return `
                    <div class="guest-category principal-category">
                        <h2 class="category-title">Principal Sponsors</h2>
                        <div class="principal-columns">
                            <div class="principal-column">
                                <h3 class="principal-subtitle">Ninang</h3>
                                <div class="guest-grid">
                                    ${ninang}
                                </div>
                            </div>
                            <div class="principal-column">
                                <h3 class="principal-subtitle">Ninong</h3>
                                <div class="guest-grid">
                                    ${ninong}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }

            if (category === 'Entourage') {
                const brideEntourage = guestList
                    .filter(guest => 
                        guest.category === 'Entourage' && 
                        (guest.role.includes('Maid') || guest.role.includes('Bridesmaid') || guest.role.includes('Bridesman'))
                    )
                    .map(guest => createGuestCard(guest, confirmedGuests))
                    .join('');

                const groomEntourage = guestList
                    .filter(guest => 
                        guest.category === 'Entourage' && 
                        (guest.role.includes('Best') || guest.role.includes('Groomsmen'))
                    )
                    .map(guest => createGuestCard(guest, confirmedGuests))
                    .join('');

                return `
                    <div class="guest-category entourage-category">
                        <h2 class="category-title">Entourage</h2>
                        <div class="entourage-columns">
                            <div class="entourage-column">
                                <h3 class="entourage-subtitle">Bride's Entourage</h3>
                                <div class="guest-grid">
                                    ${brideEntourage}
                                </div>
                            </div>
                            <div class="entourage-column">
                                <h3 class="entourage-subtitle">Groom's Entourage</h3>
                                <div class="guest-grid">
                                    ${groomEntourage}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }

            // Handle Guest category normally
            if (category === 'Guest') {
                const categoryGuests = guestList
                    .filter(guest => guest.category === category)
                    .map(guest => createGuestCard(guest, confirmedGuests))
                    .join('');

                if (categoryGuests) {
                    return `
                        <div class="guest-category">
                            <h2 class="category-title">${category}</h2>
                            <div class="guest-grid">
                                ${categoryGuests}
                            </div>
                        </div>
                    `;
                }
            }
            return '';
        }).join('');

        categoriesContainer.innerHTML = categoriesHTML;
    } catch (error) {
        console.error('Error displaying guest list:', error);
        categoriesContainer.innerHTML = '<p class="error">Error loading guest list. Please try again later.</p>';
    }
}

// Helper function to create guest card HTML
function createGuestCard(guest, confirmedGuests) {
    const hasConfirmed = confirmedGuests.some(g => g.name === guest.name);
    const statusClass = hasConfirmed ? 'status-attending' : 'status-pending';
    const statusText = hasConfirmed ? 'Attending' : 'Pending';
    
    return `
        <div class="guest-card">
            <div class="guest-info">
                <div class="guest-name">${guest.name}</div>
                <div class="guest-role">${guest.role}</div>
            </div>
            <div class="guest-actions">
                <div class="guest-status ${statusClass}">${statusText}</div>
                <button class="generate-link-btn" data-guest="${guest.name}">
                    Generate Link
                </button>
            </div>
        </div>
    `;
}

// Create falling leaves animation
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
        const animationDuration = Math.random() * 5 + 5; // 5-10 seconds
        const animationDelay = Math.random() * 10;
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

// Password protection for guest list
function setupPasswordProtection() {
    const passwordOverlay = document.getElementById('passwordOverlay');
    const mainContent = document.getElementById('mainContent');
    const submitButton = document.getElementById('submitPassword');
    const passwordInput = document.getElementById('guestListPassword');
    const errorDiv = document.getElementById('passwordError');

    if (!passwordOverlay || !mainContent || !submitButton || !passwordInput) return;

    // Check if already authenticated
    if (sessionStorage.getItem('guestListAuthenticated')) {
        passwordOverlay.classList.add('hidden');
        mainContent.classList.remove('hidden');
        displayGuestList();
        return;
    }

    // Simple password check - using base64 to slightly obscure the password
    // The encoded password is 'Morgan0929!'
    const encodedPass = 'TW9yZ2FuMDkyOSE=';
        
    const handlePasswordSubmit = () => {
        const password = passwordInput.value.trim();
        const encodedInput = btoa(password); // Convert input to base64
            
        if (encodedInput === encodedPass) {
            sessionStorage.setItem('guestListAuthenticated', 'true');
            passwordOverlay.classList.add('hidden');
            mainContent.classList.remove('hidden');
            displayGuestList();
        } else {
            errorDiv.textContent = "Incorrect password. Please try again.";
            passwordInput.value = "";
            passwordInput.focus();
        }
    };

    // Handle button click
    submitButton.addEventListener('click', handlePasswordSubmit);

    // Handle enter key
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handlePasswordSubmit();
        }
    });

    // Clear error on input change
    passwordInput.addEventListener('input', () => {
        errorDiv.textContent = "";
    });
}

// Generate a unique access code for a guest
function generateAccessCode(guestName) {
    const timestamp = Date.now().toString(36);
    const nameHash = guestName.split('')
        .reduce((hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0)
        .toString(36);
    return `${nameHash.slice(0, 4)}${timestamp.slice(-4)}`.toUpperCase();
}

// Handle invitation link generation
function setupInvitationLinks() {
    const modal = document.getElementById('linkModal');
    const closeBtn = document.querySelector('.close-modal');
    const copyBtn = document.getElementById('copyLink');
    const linkInput = document.getElementById('invitationLink');
    
    if (!modal || !closeBtn || !copyBtn || !linkInput) return;

    // Close modal when clicking the X or outside the modal
    closeBtn.onclick = () => modal.classList.add('hidden');
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    };

    // Handle generate link button clicks
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('generate-link-btn')) {
            const guestName = e.target.dataset.guest;
            const accessCode = generateAccessCode(guestName);
            
            // Store the access code
            const guestCodes = JSON.parse(localStorage.getItem('guestAccessCodes') || '{}');
            guestCodes[guestName] = accessCode;
            localStorage.setItem('guestAccessCodes', JSON.stringify(guestCodes));

            // Create the invitation link
            const baseUrl = window.location.origin + window.location.pathname.replace('guests.html', 'rsvp.html');
            const inviteLink = `${baseUrl}?guest=${encodeURIComponent(guestName)}&code=${accessCode}`;

            // Update modal content
            document.getElementById('guestNameSpan').textContent = guestName;
            document.getElementById('accessCode').textContent = accessCode;
            linkInput.value = inviteLink;

            // Show modal
            modal.classList.remove('hidden');
        }
    });

    // Handle copy button
    copyBtn.onclick = () => {
        linkInput.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 2000);
    };
}

// Verify guest access code
function verifyGuestAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('guest');
    const accessCode = urlParams.get('code');

    if (guestName && accessCode) {
        const nameInput = document.getElementById('verifyGuestName');
        const codeInput = document.getElementById('verifyAccessCode');
        const verifyBtn = document.getElementById('verifyAccess');
        
        if (nameInput && codeInput && verifyBtn) {
            // Pre-fill the inputs
            nameInput.value = decodeURIComponent(guestName);
            codeInput.value = accessCode;
            
            // Automatically trigger verification
            setTimeout(() => {
                verifyBtn.click();
            }, 100);
        }
    }
}

// Handle RSVP verification
function setupRSVPVerification() {
    const overlay = document.getElementById('accessCodeOverlay');
    const content = document.getElementById('rsvpContent');
    const verifyBtn = document.getElementById('verifyAccess');
    const nameInput = document.getElementById('verifyGuestName');
    const codeInput = document.getElementById('verifyAccessCode');
    const errorDiv = document.getElementById('verifyError');

    if (!overlay || !content || !verifyBtn || !nameInput || !codeInput) return;

    const handleVerification = () => {
        const name = nameInput.value.trim();
        const code = codeInput.value.trim();

        if (!name || !code) {
            errorDiv.textContent = "Please enter both your name and access code.";
            return;
        }

        // Get stored access codes
        const guestCodes = JSON.parse(localStorage.getItem('guestAccessCodes') || '{}');
        const storedCode = guestCodes[name];

        if (storedCode && storedCode === code) {
            // Valid access code
            overlay.classList.add('hidden');
            content.classList.remove('hidden');

            // Pre-fill and lock the guest name
            const rsvpNameInput = document.getElementById('guestName');
            if (rsvpNameInput) {
                rsvpNameInput.value = name;
                rsvpNameInput.readOnly = true;
                
                // Trigger guest details display
                selectedGuest = guestList.find(g => g.name === name);
                if (selectedGuest) {
                    displayGuestDetails(selectedGuest);
                }
            }
        } else {
            errorDiv.textContent = "Invalid name or access code. Please try again.";
            codeInput.value = "";
            codeInput.focus();
        }
    };

    // Handle verify button click
    verifyBtn.addEventListener('click', handleVerification);

    // Handle enter key
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            codeInput.focus();
        }
    });

    codeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleVerification();
        }
    });

    // Clear error on input change
    [nameInput, codeInput].forEach(input => {
        input.addEventListener('input', () => {
            errorDiv.textContent = "";
        });
    });

    // Check URL parameters immediately
    verifyGuestAccess();
}

// Export RSVP status to file
function setupRSVPExportImport() {
    const exportBtn = document.getElementById('exportRSVP');
    const importBtn = document.getElementById('importRSVP');
    const importFile = document.getElementById('importFile');

    if (!exportBtn || !importBtn || !importFile) return;

    // Handle export
    exportBtn.addEventListener('click', () => {
        const confirmedGuests = getGuests();
        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `wedding-rsvp-status-${timestamp}.txt`;

        // Create formatted content
        let content = "Wedding RSVP Status - " + timestamp + "\n\n";
        content += "Total Confirmed Guests: " + confirmedGuests.length + "\n\n";
        content += "=".repeat(50) + "\n\n";

        // Group guests by category
        const categories = ['Family', 'Principal', 'Entourage', 'Guest'];
        categories.forEach(category => {
            const categoryGuests = guestList.filter(guest => 
                guest.category === category && !['Bride', 'Groom'].includes(guest.role)
            );

            if (categoryGuests.length > 0) {
                content += `${category}\n` + "-".repeat(30) + "\n";
                categoryGuests.forEach(guest => {
                    const hasConfirmed = confirmedGuests.some(g => g.name === guest.name);
                    content += `${guest.name} (${guest.role}): ${hasConfirmed ? 'Attending' : 'Pending'}\n`;
                });
                content += "\n";
            }
        });

        // Create and download file
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });

    // Handle import button click
    importBtn.addEventListener('click', () => {
        importFile.click();
    });

    // Handle file selection
    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target.result;
                const guestStatuses = parseRSVPFile(content);
                
                // Update local storage with imported data
                localStorage.setItem('weddingGuests', JSON.stringify(guestStatuses));
                
                // Refresh the display
                displayGuestList();
                
                // Show success message
                alert('RSVP status imported successfully!');
                
            } catch (error) {
                console.error('Error importing RSVP status:', error);
                alert('Error importing RSVP status. Please check the file format.');
            }
        };
        reader.readAsText(file);
    });
}

// Parse imported RSVP file
function parseRSVPFile(content) {
    const lines = content.split('\n');
    const guestStatuses = [];
    
    lines.forEach(line => {
        if (line.includes(':')) {
            const [guestInfo, status] = line.split(':').map(s => s.trim());
            const guestName = guestInfo.split('(')[0].trim();
            
            if (status === 'Attending') {
                const guest = guestList.find(g => g.name === guestName);
                if (guest) {
                    guestStatuses.push({
                        ...guest,
                        status: 'accepted',
                        timestamp: new Date().toISOString()
                    });
                }
            }
        }
    });
    
    return guestStatuses;
}

// Initialize page functionality
document.addEventListener('DOMContentLoaded', () => {
    updatePageContent();
    setupAutocomplete();
    handleRSVP();
    setupPasswordProtection();
    setupInvitationLinks();
    setupRSVPExportImport();
    setupRSVPVerification();
    displayGuestList();
    createFallingLeaves();
    showSlides(slideIndex); // Initialize slideshow
}); 