// Google Sheets API configuration
const CLIENT_ID = '451907525747-8218iur9470jguk7vsgo461jfrssnvam.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBXEyc_rQtTfLOOd-RHA9M3CXv1pON6OcI';
const SHEET_ID = '1WDilDNoQXvt2jsj0M6rFeEQPp75vPc-aeB08_1Eub6s';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// Initialize the Google API client
function gapiLoaded() {
    console.log('🚀 gapiLoaded called');
    try {
        gapi.load('client', initializeGapiClient);
        console.log('✅ gapi.load called successfully');
    } catch (err) {
        console.error('❌ Error in gapiLoaded:', err);
        showError('Error loading Google API client. Please refresh the page.');
    }
}

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
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.textContent = message;
        loadingIndicator.classList.remove('hidden');
        loadingIndicator.style.color = '#B71C1C';
    }
    // Also show error in the auth button area
    const authButton = document.getElementById('authButton');
    if (authButton) {
        const errorDiv = document.createElement('div');
        errorDiv.style.color = '#B71C1C';
        errorDiv.style.marginTop = '10px';
        errorDiv.textContent = message;
        authButton.appendChild(errorDiv);
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

// Function to update RSVP status
async function updateRSVP(row, status) {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `Sheet1!D${row}`, // Column D is RSVP Status
            valueInputOption: 'RAW',
            resource: {
                values: [[status]]
            }
        });
        
        // Update timestamp
        await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `Sheet1!F${row}`, // Column F is Timestamp
            valueInputOption: 'RAW',
            resource: {
                values: [[new Date().toLocaleString()]]
            }
        });
        
        console.log('RSVP updated successfully');
    } catch (err) {
        console.error('Error updating RSVP:', err);
    }
}

// Process the guest list data
function processGuests(values) {
    console.log('🚀 processGuests called with values:', values);
    const guests = values.map(row => ({
        name: row[0],        // Column A: Guest Name
        role: row[1],        // Column B: Role
        category: row[2],    // Column C: Category
        rsvpStatus: row[3] || 'Pending',  // Column D: RSVP Status
        accessCode: row[4],  // Column E: Access Code
        timestamp: row[5]    // Column F: Timestamp
    }));
    
    console.log('📋 Processed guests:', guests);
    
    // Store guests in localStorage for easy access
    localStorage.setItem('guestList', JSON.stringify(guests));
    console.log('💾 Guests stored in localStorage');
    
    // Update UI if on guest list page
    if (window.location.pathname.includes('guests.html')) {
        console.log('🎨 Updating UI with guest list');
        displayGuestList(guests);
    }
}

// Display guest list in the UI
function displayGuestList(guests) {
    console.log('🚀 displayGuestList called with guests:', guests);
    const container = document.getElementById('guestCategories');
    if (!container) {
        console.error('❌ Container element not found');
        return;
    }
    
    console.log('🧹 Clearing existing content');
    container.innerHTML = '';

    // Create HTML for Family category
    const familyGuests = guests.filter(guest => guest.category === 'Family');
    const brideFamily = familyGuests.filter(guest => 
        guest.role.toLowerCase().includes('bride') || 
        guest.name.includes('Escalera')
    );
    const groomFamily = familyGuests.filter(guest => 
        guest.role.toLowerCase().includes('groom') || 
        guest.name.includes('Ong') || 
        guest.name.includes('Olivar')
    );

    // Family Section
    if (familyGuests.length > 0) {
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
    const principalGuests = guests.filter(guest => guest.category === 'Principal');
    if (principalGuests.length > 0) {
        const ninang = principalGuests.filter(guest => guest.role.includes('Ninang'));
        const ninong = principalGuests.filter(guest => guest.role.includes('Ninong'));

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
    const entourageGuests = guests.filter(guest => guest.category === 'Entourage');
    if (entourageGuests.length > 0) {
        const brideEntourage = entourageGuests.filter(guest => 
            guest.role.includes('Maid') || 
            guest.role.includes('Bridesmaid') || 
            guest.role.includes('Bridesman')
        );
        const groomEntourage = entourageGuests.filter(guest => 
            guest.role.includes('Best') || 
            guest.role.includes('Groomsmen')
        );

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
    const regularGuests = guests.filter(guest => guest.category === 'Guest');
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

    console.log('✅ Guest list display complete');
}

// Helper function to create guest card HTML
function createGuestCard(guest) {
    const statusClass = (guest.rsvpStatus || 'Pending').toLowerCase() === 'attending' 
        ? 'status-attending' 
        : 'status-pending';
    
    return `
        <div class="guest-card">
            <div class="guest-info">
                <div class="guest-name">${guest.name}</div>
                <div class="guest-role">${guest.role}</div>
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