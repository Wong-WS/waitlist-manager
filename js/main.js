// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get form element
    const form = document.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');

    // Form validation and submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission

        // SPAM PROTECTION: Check honeypot field
        const honeypot = document.getElementById('website').value;
        if (honeypot !== '') {
            // Bot detected - silently fail
            console.log('Spam detected - honeypot field filled');
            return;
        }

        // SPAM PROTECTION: Rate limiting (max 1 submission per 60 seconds)
        const lastSubmission = localStorage.getItem('lastSubmissionTime');
        const now = Date.now();
        if (lastSubmission && (now - parseInt(lastSubmission)) < 60000) {
            const waitTime = Math.ceil((60000 - (now - parseInt(lastSubmission))) / 1000);
            showMessage(`Please wait ${waitTime} seconds before submitting again.`, 'error');
            return;
        }

        // Get form values
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const age = document.getElementById('age').value.trim();
        const location = document.getElementById('location').value.trim();
        const preferredTime = document.getElementById('preferred-time').value.trim();
        const contactPreference = document.querySelector('input[name="contact-preference"]:checked').value;

        // Validation flags
        let isValid = true;
        let errorMessages = [];

        // Validate name (required, min 2 characters)
        if (name.length < 2) {
            isValid = false;
            errorMessages.push('Please enter a valid name (at least 2 characters)');
            highlightError('name');
        } else {
            removeError('name');
        }

        // Validate phone number (required, basic format check)
        // Malaysia format: 01X-XXXXXXX or 01X-XXXXXXXX (10-11 digits total)
        const phonePattern = /^01[0-9]-?\d{7,8}$/; // Malaysia phone format
        if (!phonePattern.test(phone.replace(/\s+/g, ''))) {
            isValid = false;
            errorMessages.push('Please enter a valid Malaysia phone number (e.g., 012-3456789 or 0123456789)');
            highlightError('phone');
        } else {
            removeError('phone');
        }

        // Validate age (required, reasonable range)
        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 3 || ageNum > 100) {
            isValid = false;
            errorMessages.push('Please enter a valid age (3-100)');
            highlightError('age');
        } else {
            removeError('age');
        }

        // If validation fails, show errors and stop
        if (!isValid) {
            showMessage(errorMessages.join('<br>'), 'error');
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        submitButton.classList.add('opacity-50', 'cursor-not-allowed');

        // Save to localStorage (simulating Firebase)
        setTimeout(() => {
            try {
                // Create entry object
                const entry = {
                    id: 'entry_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    name,
                    phone,
                    age: ageNum,
                    location,
                    preferredTime,
                    contactPreference,
                    status: 'waiting',
                    timestamp: new Date().toISOString()
                };

                // Get existing waitlist data
                const savedData = localStorage.getItem('waitlistData');
                let waitlistData = savedData ? JSON.parse(savedData) : [];

                // Add new entry
                waitlistData.push(entry);

                // Save back to localStorage
                localStorage.setItem('waitlistData', JSON.stringify(waitlistData));

                // Update last submission time for rate limiting
                localStorage.setItem('lastSubmissionTime', Date.now().toString());

                // Success! Clear form and show success message
                form.reset();
                submitButton.disabled = false;
                submitButton.textContent = 'Join Waitlist';
                submitButton.classList.remove('opacity-50', 'cursor-not-allowed');

                showMessage(`Thank you, ${name}! You've been added to the waitlist. Coach Wong will contact you soon.`, 'success');

                console.log('Form submitted successfully:', entry);
            } catch (error) {
                // Error handling
                submitButton.disabled = false;
                submitButton.textContent = 'Join Waitlist';
                submitButton.classList.remove('opacity-50', 'cursor-not-allowed');

                showMessage('Sorry, there was an error submitting your form. Please try again.', 'error');
                console.error('Form submission error:', error);
            }
        }, 1000);
    });

    // Helper function to highlight error fields
    function highlightError(fieldId) {
        const field = document.getElementById(fieldId);
        field.classList.add('border-red-500', 'bg-red-50');
        field.classList.remove('border-gray-300');
    }

    // Helper function to remove error highlighting
    function removeError(fieldId) {
        const field = document.getElementById(fieldId);
        field.classList.remove('border-red-500', 'bg-red-50');
        field.classList.add('border-gray-300');
    }

    // Clear error highlighting when user starts typing
    const inputs = form.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            removeError(this.id);
        });
    });

    // Show success/error messages
    function showMessage(message, type) {
        // Remove existing message if any
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-lg shadow-lg z-50 max-w-md text-center transition-all duration-300 ${
            type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
        }`;
        messageDiv.innerHTML = `
            <div class="flex items-center justify-between gap-4">
                <span>${message}</span>
                <button class="close-message text-white hover:text-gray-200 font-bold text-xl">&times;</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(messageDiv);

        // Animate in
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);

        // Close button handler
        messageDiv.querySelector('.close-message').addEventListener('click', () => {
            hideMessage(messageDiv);
        });

        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideMessage(messageDiv);
        }, 5000);
    }

    // Hide message with animation
    function hideMessage(messageDiv) {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }
});
