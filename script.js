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