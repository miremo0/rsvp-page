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
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button')?.classList.remove('hidden');
    }
}

// Handle the authorization flow
async function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        await listGuests();
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

// Function to read guests from the sheet
async function listGuests() {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Sheet1!A2:F', // Updated to include timestamp column
        });
        const range = response.result;
        if (!range || !range.values || range.values.length == 0) {
            console.log('No data found.');
            return;
        }
        processGuests(range.values);
    } catch (err) {
        console.error(err);
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
    const guests = values.map(row => ({
        name: row[0],        // Column A: Guest Name
        role: row[1],        // Column B: Role
        category: row[2],    // Column C: Category
        rsvpStatus: row[3] || 'Pending',  // Column D: RSVP Status
        accessCode: row[4],  // Column E: Access Code
        timestamp: row[5]    // Column F: Timestamp
    }));
    
    // Store guests in localStorage for easy access
    localStorage.setItem('guestList', JSON.stringify(guests));
    
    // Update UI if on guest list page
    if (window.location.pathname.includes('guests.html')) {
        displayGuestList(guests);
    }
}

// Display guest list in the UI
function displayGuestList(guests) {
    const container = document.getElementById('guestCategories');
    if (!container) return;

    // Group guests by category
    const categories = {};
    guests.forEach(guest => {
        if (!categories[guest.category]) {
            categories[guest.category] = [];
        }
        categories[guest.category].push(guest);
    });

    // Create HTML for each category
    Object.entries(categories).forEach(([category, categoryGuests]) => {
        const categorySection = document.createElement('div');
        categorySection.className = 'guest-category';
        categorySection.innerHTML = `
            <h2>${category}</h2>
            <div class="guest-list">
                ${categoryGuests.map(guest => `
                    <div class="guest-item ${(guest.rsvpStatus || 'Pending').toLowerCase()}">
                        <span class="guest-name">${guest.name}</span>
                        <span class="guest-role">${guest.role}</span>
                        <span class="guest-status">${guest.rsvpStatus || 'Pending'}</span>
                        ${guest.timestamp ? `<span class="guest-timestamp">Updated: ${guest.timestamp}</span>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(categorySection);
    });
} 