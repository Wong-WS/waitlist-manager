# Claude Code Configuration

## Project: Swim Coach Waitlist Website

### Useful Commands
- `firebase deploy` - Deploy to Firebase hosting (or push to main branch for auto-deploy)
- `firebase deploy --only firestore:rules` - Deploy only Firestore security rules
- `firebase deploy --only hosting` - Deploy only hosting files
- `python3 -m http.server 8000` - Run local development server
- `git push` - Push to GitHub (triggers automatic deployment via GitHub Actions)
- `npm install` - Install Node.js dependencies for admin setup
- `node setup-admin.js <email> <password>` - Create/update admin user

### Project Structure
```
waitlist-manager/
├── index.html                    # Main customer-facing page
├── admin.html                    # Admin panel for managing waitlist
├── 404.html                      # Custom 404 error page
├── css/
│   └── style.css                # All styling
├── js/
│   ├── main.js                  # Customer page functionality
│   ├── admin.js                 # Admin panel functionality (Firebase Auth)
│   ├── firebase-config.js       # Firebase configuration (safe to be public)
│   └── firebase-config.template.js  # Template reference file
├── .github/workflows/           # GitHub Actions for auto-deployment
│   ├── firebase-hosting-merge.yml   # Deploy on PR merge to main
│   └── firebase-hosting-pull-request.yml  # Preview deployments for PRs
├── firebase.json                # Firebase hosting configuration
├── .firebaserc                  # Firebase project configuration
├── firestore.rules              # Firestore security rules (admin auth enforced)
├── firestore.indexes.json       # Firestore database indexes
├── package.json                 # Node.js dependencies
├── setup-admin.js               # Script to create admin users
├── ADMIN_SETUP.md               # Admin authentication setup guide
└── serviceAccountKey.json       # Firebase service account (DO NOT COMMIT!)
```

### Technology Stack
- Frontend: HTML, CSS, JavaScript
- CSS Framework: Tailwind CSS (via CDN)
- Backend: Firebase Firestore (NoSQL database)
- Hosting: Firebase Hosting
- CI/CD: GitHub Actions (automatic deployment)
- Authentication: Firebase Authentication with custom admin claims
- Admin Tools: Node.js (for admin user management)

### Deployment Info
- **Live Site**: https://waitlist-manager-wong.web.app/
- **Admin Panel**: https://waitlist-manager-wong.web.app/admin.html
- **Admin Setup**: See ADMIN_SETUP.md for creating admin users
- **GitHub Repo**: https://github.com/Wong-WS/waitlist-manager
- **Auto-Deploy**: Enabled via GitHub Actions on push to main branch

### Key Features (Completed)
1. ✅ Customer waitlist signup form with validation
2. ✅ Firebase Firestore database integration
3. ✅ Admin panel for managing signups (view, filter, update status, delete)
4. ✅ Mobile-responsive design with Tailwind CSS
5. ✅ Group/Private lesson support with dynamic age fields
6. ✅ Malaysia phone number validation
7. ✅ CSV export functionality
8. ✅ Real-time updates using Firestore snapshots
9. ✅ Automatic deployment via GitHub Actions
10. ✅ Firestore security rules with admin authentication
11. ✅ Firebase Authentication for secure admin access
12. ✅ Custom admin claims for role-based access control

### Firestore Collections
- `waitlist` - Stores customer signup data
  - Fields: name, phone, lessonType, groupSize, ages, location, preferredTime, contactPreference, status, timestamp

### Security Notes
- Firebase config keys in `firebase-config.js` are safe to be public
- Security is enforced through Firestore security rules
- Admin authentication uses Firebase Auth with custom claims (`admin: true`)
- Only authenticated users with admin claim can update/delete waitlist entries
- Service account key (`serviceAccountKey.json`) must NEVER be committed to Git
- Firestore rules do not expire - properly configured for production use

### Future Improvements
- [ ] Add email notifications for new signups
- [ ] Implement advanced search/filter functionality in admin panel
- [ ] Add pagination for large datasets
- [ ] Create custom domain setup
- [ ] Add analytics tracking
- [ ] Implement password reset functionality
- [ ] Add email verification for admin accounts