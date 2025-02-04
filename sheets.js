// Google Sheets API configuration
const API_KEY = 'AIzaSyBXEyc_rQtTfLOOd-RHA9M3CXv1pON6OcI';
const SHEET_ID = '1WDilDNoQXvt2jsj0M6rFeEQPp75vPc-aeB08_1Eub6s';

// Function to fetch guest data without authentication
async function fetchGuestData() {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A:F?key=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.values;
    } catch (error) {
        console.error('Error fetching guest data:', error);
        throw error;
    }
}

// Function to verify guest access
async function verifyGuestAccess(guestName, accessCode) {
    try {
        const guestData = await fetchGuestData();
        if (!guestData) return null;

        const guestRow = guestData.find(row => 
            row[0].toLowerCase() === guestName.toLowerCase() && 
            row[4] === accessCode
        );

        if (!guestRow) return null;

        return {
            name: guestRow[0],
            role: guestRow[1],
            category: guestRow[2],
            rsvpStatus: guestRow[3],
            accessCode: guestRow[4]
        };
    } catch (error) {
        console.error('Error verifying guest:', error);
        throw error;
    }
}

// Function to update RSVP status using Google Apps Script Web App
async function updateRSVPStatus(guestName, accessCode, status) {
    try {
        const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec';
        
        const response = await fetch(WEBAPP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                guestName: guestName,
                accessCode: accessCode,
                status: status,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok && response.status !== 0) { // status 0 is expected with no-cors
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Error updating RSVP status:', error);
        throw error;
    }
}

// Helper function to show errors
function showError(message) {
    console.error('❌ Error:', message);
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.textContent = message;
        loadingIndicator.classList.remove('hidden');
        loadingIndicator.style.color = '#B71C1C';
    }
    
    const container = document.getElementById('guestCategories');
    if (container) {
        container.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

// Process and display guest list
async function listGuests() {
    console.log('🚀 listGuests called');
    try {
        const guestData = await fetchGuestData();
        if (!guestData || guestData.length === 0) {
            showError('No data found in the sheet.');
            return false;
        }
        
        // Remove header row if it exists
        const values = guestData[0][0].toLowerCase() === 'name' ? guestData.slice(1) : guestData;
        processGuests(values);
        return true;
    } catch (err) {
        console.error('❌ Error reading sheet:', err);
        showError('Error loading guest list. Please try again.');
        return false;
    }
}

// Process the guest list data
function processGuests(values) {
    console.log('🚀 processGuests called with values:', values);
    try {
        if (!values || !Array.isArray(values)) {
            console.error('❌ Invalid values received:', values);
            showError('Invalid data format received');
            return;
        }

        const guests = values.map((row, index) => {
            if (!row || !Array.isArray(row)) {
                console.warn(`⚠️ Invalid row at index ${index}:`, row);
                return null;
            }
            return {
                name: row[0] || '',        // Column A: Guest Name
                role: row[1] || '',        // Column B: Role
                category: row[2] || '',    // Column C: Category
                rsvpStatus: row[3] || 'Pending',  // Column D: RSVP Status
                accessCode: row[4] || '',  // Column E: Access Code
                timestamp: row[5] || ''    // Column F: Timestamp
            };
        }).filter(guest => guest !== null && guest.name);

        console.log('📋 Processed guests:', guests);
        displayGuestList(guests);
    } catch (err) {
        console.error('❌ Error processing guests:', err);
        showError('Error processing guest list data');
    }
}

// Helper function to create guest card HTML
function createGuestCard(guest) {
    if (!guest || !guest.name) {
        console.warn('⚠️ Invalid guest data:', guest);
        return '';
    }

    const statusClass = (guest.rsvpStatus || 'Pending').toLowerCase() === 'attending' 
        ? 'status-attending' 
        : 'status-pending';
    
    return `
        <div class="guest-card">
            <div class="guest-info">
                <div class="guest-name">${guest.name || 'Unknown Guest'}</div>
                <div class="guest-role">${guest.role || 'Guest'}</div>
            </div>
            <div class="guest-actions">
                <div class="guest-status ${statusClass}">
                    ${guest.rsvpStatus || 'Pending'}
                </div>
                <button class="generate-link-btn" data-guest="${guest.name}">
                    Generate Link
                </button>
            </div>
        </div>
    `;
}

// Display guest list in the UI
function displayGuestList(guests) {
    console.log('🚀 displayGuestList called with guests:', guests);
    const container = document.getElementById('guestCategories');
    if (!container) {
        console.error('❌ Container element not found');
        showError('Error: Guest list container not found');
        return;
    }
    
    try {
        container.innerHTML = '';

        if (!guests || !Array.isArray(guests) || guests.length === 0) {
            console.warn('⚠️ No guests data available');
            container.innerHTML = '<div class="no-guests">No guests found in the list.</div>';
            return;
        }

        // Family Section
        const familyGuests = guests.filter(guest => 
            guest.category && guest.category.toLowerCase() === 'family'
        );
        
        if (familyGuests.length > 0) {
            const familySection = document.createElement('div');
            familySection.className = 'guest-category family-category';
            familySection.innerHTML = `
                <h2 class="category-title">Family</h2>
                <div class="guest-grid">
                    ${familyGuests.map(guest => createGuestCard(guest)).join('')}
                </div>
            `;
            container.appendChild(familySection);
        }

        // Principal Sponsors Section
        const principalGuests = guests.filter(guest => 
            guest.category && guest.category.toLowerCase() === 'principal'
        );
        
        if (principalGuests.length > 0) {
            const principalSection = document.createElement('div');
            principalSection.className = 'guest-category principal-category';
            principalSection.innerHTML = `
                <h2 class="category-title">Principal Sponsors</h2>
                <div class="guest-grid">
                    ${principalGuests.map(guest => createGuestCard(guest)).join('')}
                </div>
            `;
            container.appendChild(principalSection);
        }

        // Entourage Section
        const entourageGuests = guests.filter(guest => 
            guest.category && guest.category.toLowerCase() === 'entourage'
        );
        
        if (entourageGuests.length > 0) {
            const entourageSection = document.createElement('div');
            entourageSection.className = 'guest-category entourage-category';
            entourageSection.innerHTML = `
                <h2 class="category-title">Entourage</h2>
                <div class="guest-grid">
                    ${entourageGuests.map(guest => createGuestCard(guest)).join('')}
                </div>
            `;
            container.appendChild(entourageSection);
        }

        // Regular Guests Section
        const regularGuests = guests.filter(guest => 
            !guest.category || guest.category.toLowerCase() === 'guest'
        );
        
        if (regularGuests.length > 0) {
            const guestsSection = document.createElement('div');
            guestsSection.className = 'guest-category';
            guestsSection.innerHTML = `
                <h2 class="category-title">Guests</h2>
                <div class="guest-grid">
                    ${regularGuests.map(guest => createGuestCard(guest)).join('')}
                </div>
            `;
            container.appendChild(guestsSection);
        }

        // Add event listeners for generate link buttons
        document.querySelectorAll('.generate-link-btn').forEach(button => {
            button.addEventListener('click', function() {
                const guestName = this.getAttribute('data-guest');
                const guest = guests.find(g => g.name === guestName);
                if (guest) {
                    generateInvitationLink(guest);
                }
            });
        });

    } catch (err) {
        console.error('❌ Error displaying guest list:', err);
        showError('Error displaying guest list');
    }
}

// Function to generate and display invitation link
function generateInvitationLink(guest) {
    console.log('🔗 Generating link for guest:', guest.name);
    
    try {
        // Get the modal elements
        const modal = document.getElementById('linkModal');
        const guestNameSpan = document.getElementById('guestNameSpan');
        const invitationLinkInput = document.getElementById('invitationLink');
        const accessCodeSpan = document.getElementById('accessCode');
        const closeBtn = modal.querySelector('.close-modal');
        const copyBtn = document.getElementById('copyLink');

        // Create the invitation link
        const baseUrl = window.location.origin + window.location.pathname.replace('guests.html', 'rsvp.html');
        const invitationLink = `${baseUrl}?guest=${encodeURIComponent(guest.name)}&code=${encodeURIComponent(guest.accessCode)}`;

        // Update modal content
        guestNameSpan.textContent = guest.name;
        invitationLinkInput.value = invitationLink;
        accessCodeSpan.textContent = guest.accessCode;

        // Show the modal
        modal.classList.remove('hidden');

        // Copy button functionality
        copyBtn.addEventListener('click', function() {
            invitationLinkInput.select();
            document.execCommand('copy');
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
            }, 2000);
        });

        // Close button functionality
        closeBtn.addEventListener('click', function() {
            modal.classList.add('hidden');
        });

        // Close on outside click
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });

    } catch (err) {
        console.error('❌ Error generating link:', err);
        showError('Error generating invitation link');
    }
}

// Initialize guest list if on guests.html
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('guests.html')) {
        listGuests();
    }
}); 