// Google Sheets API configuration
const API_KEY = 'AIzaSyBXEyc_rQtTfLOOd-RHA9M3CXv1pON6OcI';
const SHEET_ID = '1WDilDNoQXvt2jsj0M6rFeEQPp75vPc-aeB08_1Eub6s';

// Function to fetch guest data without authentication
async function fetchGuestData() {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A:F?key=${API_KEY}`
        );
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
        // Replace this URL with your Google Apps Script Web App URL
        const WEBAPP_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL';
        
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
                timestamp: new Date().toLocaleString()
            })
        });

        return true;
    } catch (error) {
        console.error('Error updating RSVP status:', error);
        throw error;
    }
}

let tokenClient;
let gapiInited = false;
let gisInited = false;

// Initialize the Google API client
function gapiLoaded() {
    console.log('🚀 gapiLoaded called');
    gapi.load('client', initializeGapiClient);
}

// Initialize the Google API client library
async function initializeGapiClient() {
    console.log('🚀 initializeGapiClient called');
    try {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });
        console.log('✅ gapi.client initialized');
        gapiInited = true;
        maybeEnableButtons();
        
        // Check if we have a stored token
        const storedToken = localStorage.getItem('gapi_token');
        console.log('📝 Stored token exists:', !!storedToken);
        
        if (storedToken) {
            try {
                console.log('🔄 Attempting to set stored token');
                gapi.client.setToken(JSON.parse(storedToken));
                console.log('✅ Token set successfully');
                
                // Hide auth button
                document.getElementById('authButton')?.classList.add('hidden');
                console.log('🔒 Auth button hidden');
                
                // Show loading indicator
                const loadingIndicator = document.getElementById('loadingIndicator');
                if (loadingIndicator) {
                    loadingIndicator.textContent = 'Loading guest list...';
                    loadingIndicator.classList.remove('hidden');
                    console.log('⌛ Loading indicator shown');
                }
                
                // Try to load guests
                console.log('📋 Attempting to load guest list');
                const success = await listGuests();
                console.log('✅ listGuests result:', success);
                
                // Hide loading indicator
                loadingIndicator?.classList.add('hidden');
                console.log('✅ Loading complete');
            } catch (tokenErr) {
                console.error('❌ Error with stored token:', tokenErr);
                localStorage.removeItem('gapi_token');
                document.getElementById('authButton')?.classList.remove('hidden');
                showError('Session expired. Please reconnect to the guest list.');
            }
        }
    } catch (err) {
        console.error('❌ Error in initializeGapiClient:', err);
        showError('Error initializing Google Sheets API. Please try again later.');
    }
}

function gisLoaded() {
    try {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: '', // defined later
            error_callback: (err) => {
                showError('Authentication failed. Please make sure you are using an authorized email.');
                console.error('Auth error:', err);
                // Clear stored token on error
                localStorage.removeItem('gapi_token');
                document.getElementById('authButton')?.classList.remove('hidden');
            }
        });
        gisInited = true;
        maybeEnableButtons();
    } catch (err) {
        showError('Error initializing authentication. Please try again later.');
        console.error('Error in gisLoaded:', err);
    }
}

function showError(message) {
    console.error('❌ Error:', message);
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.textContent = message;
        loadingIndicator.classList.remove('hidden');
        loadingIndicator.style.color = '#B71C1C';
    }
    
    // Also show error in a more visible way
    const container = document.getElementById('guestCategories');
    if (container) {
        container.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        const authButton = document.getElementById('authButton');
        if (authButton && !gapi.client.getToken()) {
            authButton.classList.remove('hidden');
        }
    }
}

// Handle the authorization flow
async function handleAuthClick() {
    try {
        const loadingIndicator = document.getElementById('loadingIndicator');
        loadingIndicator.classList.remove('hidden');
        loadingIndicator.textContent = 'Connecting to Google Sheets...';
        
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                showError('Authentication failed. Please try again.');
                console.error('Auth error:', resp);
                return;
            }
            try {
                // Store the token in localStorage instead of sessionStorage
                localStorage.setItem('gapi_token', JSON.stringify(gapi.client.getToken()));
                // Hide auth button
                document.getElementById('authButton').classList.add('hidden');
                await listGuests();
                loadingIndicator.classList.add('hidden');
            } catch (err) {
                showError('Error loading guest list. Please try again.');
                console.error('Error in callback:', err);
                // Clear stored token on error
                localStorage.removeItem('gapi_token');
                document.getElementById('authButton').classList.remove('hidden');
            }
        };

        if (gapi.client.getToken() === null) {
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            tokenClient.requestAccessToken({ prompt: '' });
        }
    } catch (err) {
        showError('Error during authentication. Please try again.');
        console.error('Error in handleAuthClick:', err);
    }
}

// Function to read guests from the sheet
async function listGuests() {
    console.log('🚀 listGuests called');
    try {
        console.log('📊 Fetching data from sheet:', SHEET_ID);
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Sheet1!A2:F',
        });
        console.log('📝 Sheet response:', response);
        
        const range = response.result;
        if (!range || !range.values || range.values.length == 0) {
            console.warn('⚠️ No data found in sheet');
            showError('No data found in the sheet.');
            return false;
        }
        
        console.log('✅ Data found in sheet:', range.values);
        processGuests(range.values);
        return true;
    } catch (err) {
        console.error('❌ Error reading sheet:', err);
        // If error is due to invalid credentials, clear token and show auth button
        if (err.status === 401 || err.status === 403) {
            console.log('🔑 Authentication error, clearing token');
            localStorage.removeItem('gapi_token');
            document.getElementById('authButton')?.classList.remove('hidden');
            showError('Session expired. Please reconnect to the guest list.');
        } else {
            showError('Error loading guest list. Please try again.');
        }
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
            console.log(`Processing row ${index + 1}:`, row);
            if (!row || !Array.isArray(row)) {
                console.warn(`⚠️ Invalid row at index ${index}:`, row);
                return null;
            }
            return {
                name: row[0] || '',        // Column A: Guest Name
                role: row[1] || '',        // Column B: Role
                category: row[2] || '',    // Column C: Category (Family, Principal, Entourage, Guest)
                rsvpStatus: row[3] || 'Pending',  // Column D: RSVP Status
                accessCode: row[4] || '',  // Column E: Access Code
                timestamp: row[5] || ''    // Column F: Timestamp
            };
        }).filter(guest => guest !== null && guest.name); // Remove invalid entries
        
        console.log('📋 Processed guests:', guests);
        
        // Store guests in localStorage for easy access
        localStorage.setItem('guestList', JSON.stringify(guests));
        console.log('💾 Guests stored in localStorage');
        
        // Update UI if on guest list page
        if (window.location.pathname.includes('guests.html')) {
            console.log('🎨 Updating UI with guest list');
            displayGuestList(guests);
        }
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

    console.log('🎴 Creating card for guest:', guest.name);
    
    const statusClass = (guest.rsvpStatus || 'Pending').toLowerCase() === 'attending' 
        ? 'status-attending' 
        : 'status-pending';
    
    const cardHtml = `
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
    
    console.log('✅ Card created for:', guest.name);
    return cardHtml;
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
        console.log('🧹 Clearing existing content');
        container.innerHTML = '';

        if (!guests || !Array.isArray(guests) || guests.length === 0) {
            console.warn('⚠️ No guests data available');
            container.innerHTML = '<div class="no-guests">No guests found in the list.</div>';
            return;
        }

        // Create HTML for Family category
        const familyGuests = guests.filter(guest => 
            guest.category && guest.category.toLowerCase() === 'family'
        );
        console.log('👨‍👩‍👧‍👦 Family guests:', familyGuests);
        
        const brideFamily = familyGuests.filter(guest => 
            guest.role.toLowerCase().includes('bride') || 
            guest.name.toLowerCase().includes('escalera')
        );
        console.log('👰 Bride family:', brideFamily);
        
        const groomFamily = familyGuests.filter(guest => 
            guest.role.toLowerCase().includes('groom') || 
            guest.name.toLowerCase().includes('ong') || 
            guest.name.toLowerCase().includes('olivar')
        );
        console.log('🤵 Groom family:', groomFamily);

        // Family Section
        if (familyGuests.length > 0) {
            console.log('Creating family section');
            const familySection = document.createElement('div');
            familySection.className = 'guest-category family-category';
            familySection.innerHTML = `
                <h2 class="category-title">Family</h2>
                <div class="family-columns">
                    <div class="family-column">
                        <h3 class="family-subtitle">Bride's Family</h3>
                        <div class="guest-grid">
                            ${brideFamily.map(guest => createGuestCard(guest)).join('')}
                        </div>
                    </div>
                    <div class="family-column">
                        <h3 class="family-subtitle">Groom's Family</h3>
                        <div class="guest-grid">
                            ${groomFamily.map(guest => createGuestCard(guest)).join('')}
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(familySection);
        }

        // Principal Sponsors Section
        const principalGuests = guests.filter(guest => guest.category.toLowerCase() === 'principal');
        console.log('🎖️ Principal guests:', principalGuests);
        
        if (principalGuests.length > 0) {
            const ninang = principalGuests.filter(guest => guest.role.toLowerCase().includes('ninang'));
            const ninong = principalGuests.filter(guest => guest.role.toLowerCase().includes('ninong'));
            console.log('Ninang:', ninang, 'Ninong:', ninong);

            const principalSection = document.createElement('div');
            principalSection.className = 'guest-category principal-category';
            principalSection.innerHTML = `
                <h2 class="category-title">Principal Sponsors</h2>
                <div class="principal-columns">
                    <div class="principal-column">
                        <h3 class="principal-subtitle">Ninang</h3>
                        <div class="guest-grid">
                            ${ninang.map(guest => createGuestCard(guest)).join('')}
                        </div>
                    </div>
                    <div class="principal-column">
                        <h3 class="principal-subtitle">Ninong</h3>
                        <div class="guest-grid">
                            ${ninong.map(guest => createGuestCard(guest)).join('')}
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(principalSection);
        }

        // Entourage Section
        const entourageGuests = guests.filter(guest => guest.category.toLowerCase() === 'entourage');
        console.log('👥 Entourage guests:', entourageGuests);
        
        if (entourageGuests.length > 0) {
            const brideEntourage = entourageGuests.filter(guest => 
                guest.role.toLowerCase().includes('maid') || 
                guest.role.toLowerCase().includes('bridesmaid') || 
                guest.role.toLowerCase().includes('bridesman')
            );
            const groomEntourage = entourageGuests.filter(guest => 
                guest.role.toLowerCase().includes('best') || 
                guest.role.toLowerCase().includes('groomsmen')
            );
            console.log('Bride entourage:', brideEntourage, 'Groom entourage:', groomEntourage);

            const entourageSection = document.createElement('div');
            entourageSection.className = 'guest-category entourage-category';
            entourageSection.innerHTML = `
                <h2 class="category-title">Entourage</h2>
                <div class="entourage-columns">
                    <div class="entourage-column">
                        <h3 class="entourage-subtitle">Bride's Entourage</h3>
                        <div class="guest-grid">
                            ${brideEntourage.map(guest => createGuestCard(guest)).join('')}
                        </div>
                    </div>
                    <div class="entourage-column">
                        <h3 class="entourage-subtitle">Groom's Entourage</h3>
                        <div class="guest-grid">
                            ${groomEntourage.map(guest => createGuestCard(guest)).join('')}
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(entourageSection);
        }

        // Guests Section
        const regularGuests = guests.filter(guest => guest.category.toLowerCase() === 'guest');
        console.log('👥 Regular guests:', regularGuests);
        
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

        // Add event listeners for generate link buttons after displaying the list
        console.log('🔗 Adding event listeners to generate link buttons');
        document.querySelectorAll('.generate-link-btn').forEach(button => {
            button.addEventListener('click', function() {
                const guestName = this.getAttribute('data-guest');
                const guest = guests.find(g => g.name === guestName);
                if (guest) {
                    generateInvitationLink(guest);
                }
            });
        });

        console.log('✅ Guest list display complete');
    } catch (err) {
        console.error('❌ Error displaying guest list:', err);
        showError('Error displaying guest list');
        container.innerHTML = '<div class="error-message">Error displaying guest list. Please try refreshing the page.</div>';
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

        // Generate or use existing access code
        let accessCode = guest.accessCode;
        if (!accessCode) {
            accessCode = generateAccessCode();
            // Save the access code back to the sheet
            saveAccessCode(guest.name, accessCode);
        }

        // Create the invitation link with both name and access code
        const baseUrl = window.location.origin + window.location.pathname.replace('guests.html', 'rsvp.html');
        const invitationLink = `${baseUrl}?guest=${encodeURIComponent(guest.name)}&code=${encodeURIComponent(accessCode)}`;

        // Update modal content
        guestNameSpan.textContent = guest.name;
        invitationLinkInput.value = invitationLink;
        accessCodeSpan.textContent = accessCode;

        // Show the modal
        modal.classList.remove('hidden');

        // Add copy button functionality
        copyBtn.addEventListener('click', function() {
            invitationLinkInput.select();
            document.execCommand('copy');
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
            }, 2000);
        });

        // Add close button functionality
        closeBtn.addEventListener('click', function() {
            modal.classList.add('hidden');
        });

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });

        console.log('✅ Link generated successfully with access code');
    } catch (err) {
        console.error('❌ Error generating link:', err);
        showError('Error generating invitation link');
    }
}

// Function to generate a random access code
function generateAccessCode() {
    const length = 6;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

// Function to save access code back to the sheet
async function saveAccessCode(guestName, accessCode) {
    console.log('💾 Saving access code for guest:', guestName);
    try {
        // Get the current values to find the guest's row
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Sheet1!A:E',
        });

        const rows = response.result.values;
        const rowIndex = rows.findIndex(row => row[0] === guestName);

        if (rowIndex !== -1) {
            // Update the access code in column E
            await gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: SHEET_ID,
                range: `Sheet1!E${rowIndex + 1}`,
                valueInputOption: 'RAW',
                resource: {
                    values: [[accessCode]]
                }
            });
            console.log('✅ Access code saved successfully');
        } else {
            console.error('❌ Guest not found in sheet');
        }
    } catch (err) {
        console.error('❌ Error saving access code:', err);
    }
} 