// Admin Panel JavaScript
// This manages authentication and waitlist display/management

// Waitlist data cache
let waitlistData = [];

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function() {
    // Check authentication state
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            verifyAdminAndShowPanel(user);
        } else {
            // User is signed out
            showLoginSection();
        }
    });

    // Login form handler
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", handleLogin);

    // Logout button handler
    const logoutBtn = document.getElementById("logout-btn");
    logoutBtn.addEventListener("click", handleLogout);

    // Filter tabs
    const filterTabs = document.querySelectorAll(".filter-tab");
    filterTabs.forEach(tab => {
        tab.addEventListener("click", function() {
            const filter = this.getAttribute("data-filter");
            setActiveTab(this);
            filterWaitlist(filter);
        });
    });

    // Export CSV button
    const exportBtn = document.getElementById("export-csv-btn");
    exportBtn.addEventListener("click", exportToCSV);
});

// Verify user is admin and show panel
async function verifyAdminAndShowPanel(user) {
    try {
        // Get the user's ID token to check custom claims
        const idTokenResult = await user.getIdTokenResult();

        if (idTokenResult.claims.admin === true) {
            // User is admin, show admin panel
            showAdminSection();
        } else {
            // User is not admin
            showLoginError('You do not have admin privileges.');
            await auth.signOut();
            showLoginSection();
        }
    } catch (error) {
        console.error("Error verifying admin status:", error);
        showLoginError('Error verifying admin status.');
        showLoginSection();
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const errorDiv = document.getElementById('login-error');

    try {
        // Sign in with email and password
        await auth.signInWithEmailAndPassword(email, password);
        // Success - onAuthStateChanged will handle the rest
        errorDiv.classList.add('hidden');
    } catch (error) {
        console.error("Login error:", error);
        let errorMessage = 'Login failed. Please check your credentials.';

        if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password. Please try again.';
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = 'No admin account found with this email.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many failed attempts. Please try again later.';
        }

        showLoginError(errorMessage);
        document.getElementById('admin-password').value = '';
    }
}

// Handle logout
async function handleLogout() {
    try {
        await auth.signOut();
        showLoginSection();
        showToast('Logged out successfully', 'success');
    } catch (error) {
        console.error("Logout error:", error);
        showToast('Error logging out', 'error');
    }
}

// Show login error
function showLoginError(message) {
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

// Show login section
function showLoginSection() {
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('admin-section').classList.add('hidden');
    document.getElementById('admin-email').value = '';
    document.getElementById('admin-password').value = '';
}

// Show admin section
function showAdminSection() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('admin-section').classList.remove('hidden');
    loadWaitlist();
}

// Load waitlist data from Firestore
function loadWaitlist() {
    db.collection("waitlist")
        .onSnapshot((snapshot) => {
            waitlistData = [];
            snapshot.forEach((doc) => {
                waitlistData.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            renderWaitlist('all');
            updateStats();
        }, (error) => {
            console.error("Error loading waitlist: ", error);
            showToast("Error loading waitlist data", "error");
        });
}

// Render waitlist entries
function renderWaitlist(filter = 'all') {
    const tbody = document.getElementById('waitlist-body');
    const emptyState = document.getElementById('empty-state');

    let filteredData = waitlistData;
    if (filter === 'waiting') {
        filteredData = waitlistData.filter(entry => entry.status === 'waiting');
    } else if (filter === 'contacted') {
        filteredData = waitlistData.filter(entry => entry.status === 'contacted');
    }

    if (filteredData.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    } else {
        emptyState.classList.add('hidden');
    }

    filteredData.sort((a, b) => {
        const aTime = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const bTime = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return aTime - bTime;
    });

    tbody.innerHTML = filteredData.map(entry => {
        const date = entry.timestamp?.toDate ? entry.timestamp.toDate() : new Date(entry.timestamp);
        const formattedDate = date.toLocaleDateString('en-MY', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const statusBadge = entry.status === 'waiting'
            ? '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Waiting</span>'
            : '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Contacted</span>';

        const contactPrefText = entry.contactPreference === 'any-available' ? 'Any slot' : 'Preferred only';

        // Handle lesson type and ages (with backwards compatibility)
        let lessonTypeBadge, agesDisplay;
        if (entry.lessonType) {
            // New format
            if (entry.lessonType === 'private') {
                lessonTypeBadge = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Private</span>';
            } else {
                lessonTypeBadge = `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Group of ${entry.groupSize}</span>`;
            }
            agesDisplay = entry.ages.join(', ');
        } else {
            // Old format (backwards compatibility)
            lessonTypeBadge = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Private</span>';
            agesDisplay = entry.age || '-';
        }

        return `
            <tr class="hover:bg-gray-50" data-id="${entry.id}">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formattedDate}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${entry.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <a href="tel:${entry.phone}" class="text-blue-600 hover:text-blue-800">${entry.phone}</a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">${lessonTypeBadge}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${agesDisplay}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${entry.location || '-'}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${entry.preferredTime || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${contactPrefText}</td>
                <td class="px-6 py-4 whitespace-nowrap">${statusBadge}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                        ${entry.status === 'waiting' ? `
                            <button onclick="markAsContacted('${entry.id}')" class="text-green-600 hover:text-green-900" title="Mark as contacted">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            </button>
                        ` : `
                            <button onclick="markAsWaiting('${entry.id}')" class="text-yellow-600 hover:text-yellow-900" title="Mark as waiting">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </button>
                        `}
                        <button onclick="removeEntry('${entry.id}')" class="text-red-600 hover:text-red-900" title="Remove from waitlist">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Update statistics
function updateStats() {
    const waiting = waitlistData.filter(e => e.status === 'waiting').length;
    const contacted = waitlistData.filter(e => e.status === 'contacted').length;
    const total = waitlistData.length;

    document.getElementById('stat-waiting').textContent = waiting;
    document.getElementById('stat-contacted').textContent = contacted;
    document.getElementById('stat-total').textContent = total;
    document.getElementById('count-all').textContent = total;
    document.getElementById('count-waiting').textContent = waiting;
    document.getElementById('count-contacted').textContent = contacted;
}

// Set active tab
function setActiveTab(clickedTab) {
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active', 'border-blue-600', 'text-blue-600');
        tab.classList.add('border-transparent', 'text-gray-600');
    });
    clickedTab.classList.add('active', 'border-blue-600', 'text-blue-600');
    clickedTab.classList.remove('border-transparent', 'text-gray-600');
}

// Filter waitlist
function filterWaitlist(filter) {
    renderWaitlist(filter);
}

// Mark entry as contacted
window.markAsContacted = function(id) {
    const entry = waitlistData.find(e => e.id === id);
    if (entry) {
        db.collection("waitlist").doc(id).update({
            status: 'contacted',
            contactedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            showToast(`${entry.name} marked as contacted`, 'success');
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
            showToast("Error updating status", "error");
        });
    }
};

// Mark entry as waiting
window.markAsWaiting = function(id) {
    const entry = waitlistData.find(e => e.id === id);
    if (entry) {
        db.collection("waitlist").doc(id).update({
            status: 'waiting',
            contactedAt: firebase.firestore.FieldValue.delete()
        })
        .then(() => {
            showToast(`${entry.name} marked as waiting`, 'success');
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
            showToast("Error updating status", "error");
        });
    }
};

// Remove entry from waitlist
window.removeEntry = function(id) {
    const entry = waitlistData.find(e => e.id === id);
    if (entry && confirm(`Are you sure you want to remove ${entry.name} from the waitlist?`)) {
        db.collection("waitlist").doc(id).delete()
            .then(() => {
                showToast(`${entry.name} removed from waitlist`, 'success');
            })
            .catch((error) => {
                console.error("Error removing document: ", error);
                showToast("Error removing entry", "error");
            });
    }
};

// Export to CSV
function exportToCSV() {
    if (waitlistData.length === 0) {
        showToast('No data to export', 'error');
        return;
    }

    const headers = ['Date Added', 'Name', 'Phone', 'Lesson Type', 'Group Size', 'Ages', 'Location', 'Preferred Time', 'Contact Preference', 'Status'];
    const rows = waitlistData.map(entry => {
        const date = entry.timestamp?.toDate ? entry.timestamp.toDate().toLocaleDateString('en-MY') : new Date(entry.timestamp).toLocaleDateString('en-MY');
        const contactPref = entry.contactPreference === 'any-available' ? 'Any slot' : 'Preferred only';

        // Handle new and old data formats
        let lessonType, groupSize, ages;
        if (entry.lessonType) {
            lessonType = entry.lessonType === 'private' ? 'Private' : 'Group';
            groupSize = entry.groupSize || 1;
            ages = entry.ages.join(', ');
        } else {
            // Old format backwards compatibility
            lessonType = 'Private';
            groupSize = 1;
            ages = entry.age || '';
        }

        return [date, entry.name, entry.phone, lessonType, groupSize, ages, entry.location || '', entry.preferredTime || '', contactPref, entry.status];
    });

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `waitlist_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Waitlist exported successfully', 'success');
}

// Show toast notification
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    toast.textContent = message;
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Load sample data (no longer needed with Firebase, keeping for backwards compatibility)
function loadSampleData() {
    // Sample data is no longer needed with Firebase
    // All data is now stored in Firestore
}
