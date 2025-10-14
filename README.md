# Swimming Lessons Waitlist Manager

A modern, clean waitlist management system for swim coaching businesses. Built with HTML, CSS, and JavaScript with localStorage for data persistence (ready for Firebase integration).

## Features

### Customer-Facing Features
- **Clean, Modern UI**: Minimalist pool-themed design with smooth animations
- **Mobile Responsive**: Works perfectly on all devices
- **Form Validation**: Real-time validation with helpful error messages
- **Malaysia Phone Format**: Validates Malaysia mobile numbers (01X-XXXXXXX)
- **Spam Protection**: Honeypot field and rate limiting (1 submission per 60 seconds)
- **Contact Preferences**: Users can choose to be contacted for any slot or preferred time only

### Admin Panel Features
- **Password Protection**: Simple password-based authentication
- **Dashboard Stats**: View total waiting, contacted, and total signups
- **Filter System**: Filter entries by all, waiting, or contacted
- **Entry Management**:
  - Mark entries as contacted
  - Mark entries as waiting
  - Remove entries from waitlist
- **CSV Export**: Export entire waitlist to CSV file
- **Real-time Updates**: Changes reflect immediately
- **Session Persistence**: Stay logged in during browser session

## Project Structure

```
waitlist-manager/
├── index.html          # Customer-facing waitlist signup page
├── admin.html          # Admin panel for managing waitlist
├── css/
│   └── style.css       # All styling and animations
├── js/
│   ├── main.js         # Customer page functionality
│   └── admin.js        # Admin panel functionality
├── assets/             # Images and logos (if any)
├── README.md           # This file
├── PROJECT_GUIDE.md    # Complete build guide
└── CLAUDE.md           # Project configuration
```

## Getting Started

### 1. Setup

1. Clone or download this project
2. Open the project folder in your code editor
3. No build process required - just open `index.html` in a browser!

### 2. Testing Locally

**Customer Page:**
```bash
# Simply open index.html in your browser
open index.html
```

**Admin Panel:**
```bash
# Open admin.html in your browser
open admin.html
```

### 3. Admin Access

**Default Admin Password:** `swim2024`

⚠️ **IMPORTANT**: Change the admin password before deploying!

To change the password:
1. Open `js/admin.js`
2. Find line 8: `const ADMIN_PASSWORD = "swim2024";`
3. Change `"swim2024"` to your secure password
4. Save the file

## How to Use

### For Customers

1. Visit the website (index.html)
2. Fill out the form with:
   - Name (required)
   - Phone number in Malaysia format (required)
   - Age (required)
   - Location (optional)
   - Preferred day & time (optional)
   - Contact preference (required)
3. Click "Join Waitlist"
4. See confirmation message

### For Administrators

1. Visit the admin panel (admin.html)
2. Enter the admin password
3. View the dashboard with statistics
4. Filter entries by status (All, Waiting, Contacted)
5. Manage entries:
   - **Mark as Contacted**: Click the green checkmark icon
   - **Mark as Waiting**: Click the yellow clock icon
   - **Remove**: Click the red trash icon
6. Export data:
   - Click "Export to CSV" to download all entries

## Data Storage

Currently, the app uses **localStorage** to store data:
- Data persists across browser sessions
- Data is stored locally in the user's browser
- No server or database required
- Perfect for testing and demonstration

### localStorage Keys Used:
- `waitlistData`: Array of all waitlist entries
- `lastSubmissionTime`: Timestamp for rate limiting
- `adminAuthenticated`: Admin session status

## Security Features

### Spam Protection
1. **Honeypot Field**: Hidden field that bots typically fill out
2. **Rate Limiting**: Max 1 submission per 60 seconds per browser
3. **Form Validation**: Strict validation on all required fields

### Admin Security
- **Password Protection**: Simple password-based access
- **Session Storage**: Authentication persists only during browser session
- **No Default Access**: Must login to view any data

⚠️ **Note**: This is basic security suitable for low-traffic personal use. For production, integrate Firebase Authentication.

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Changing Colors

Edit `css/style.css` and update CSS variables:

```css
:root {
  --primary-color: #3b82f6;  /* Blue */
  --text-color: #1f2937;     /* Dark gray */
  --background: #ffffff;      /* White */
  --border-radius: 8px;       /* Rounded corners */
}
```

### Changing Business Name

Edit `index.html`:
- Line 24: Update "Swimming Lessons"
- Line 49: Update "By Coach Wong"

### Changing Form Fields

1. Add HTML input in `index.html`
2. Add validation in `js/main.js`
3. Update admin table in `admin.html`
4. Update rendering in `js/admin.js`

## Firebase Integration (Future)

This project is structured to easily integrate with Firebase:

1. **Firestore Database**: Replace localStorage with Firestore
2. **Firebase Authentication**: Replace hardcoded password
3. **Firebase Hosting**: Deploy to Firebase
4. **Cloud Functions**: Add email notifications

See Phase 5-6 in PROJECT_GUIDE.md for detailed Firebase setup instructions.

## Troubleshooting

### Form Won't Submit
- Check browser console for errors
- Ensure all required fields are filled
- Check if rate limiting is blocking (wait 60 seconds)
- Clear localStorage: `localStorage.clear()`

### Admin Panel Won't Login
- Verify password is correct (default: `swim2024`)
- Check browser console for errors
- Try clearing session storage

### Data Not Persisting
- Ensure browser allows localStorage
- Check browser's storage quota
- Try different browser

### CSV Export Not Working
- Ensure browser allows downloads
- Check browser's download settings
- Try different browser

## Development

### Adding New Features

1. Plan the feature
2. Update HTML structure if needed
3. Add JavaScript functionality
4. Style with CSS
5. Test thoroughly
6. Update documentation

### Testing Checklist

- [ ] Form validation works for all fields
- [ ] Spam protection prevents rapid submissions
- [ ] Admin login works
- [ ] All admin actions work (mark contacted, remove, export)
- [ ] Responsive on mobile devices
- [ ] Works in different browsers
- [ ] localStorage persists correctly

## Support

For issues or questions:
1. Check the PROJECT_GUIDE.md for detailed instructions
2. Review browser console for error messages
3. Verify all files are in correct locations
4. Test in different browser

## License

This project is provided as-is for personal and commercial use.

## Credits

Built with:
- HTML5
- CSS3 (with Tailwind CSS via CDN)
- Vanilla JavaScript
- Inter Font (Google Fonts)

---

**Version**: 1.0.0
**Last Updated**: January 2025
**Status**: Production Ready (without Firebase)
