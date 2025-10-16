# Claude Code Configuration

## Project: Swim Coach Waitlist Website

### Useful Commands
- `firebase deploy` - Deploy to Firebase hosting (or push to main branch for auto-deploy)
- `firebase deploy --only firestore:rules` - Deploy only Firestore security rules
- `firebase deploy --only hosting` - Deploy only hosting files
- `python3 -m http.server 8000` - Run local development server
- `git push` - Push to GitHub (triggers automatic deployment via GitHub Actions)

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
│   ├── admin.js                 # Admin panel functionality
│   ├── firebase-config.js       # Firebase configuration (safe to be public)
│   └── firebase-config.template.js  # Template reference file
├── .github/workflows/           # GitHub Actions for auto-deployment
│   ├── firebase-hosting-merge.yml   # Deploy on PR merge to main
│   └── firebase-hosting-pull-request.yml  # Preview deployments for PRs
├── firebase.json                # Firebase hosting configuration
├── .firebaserc                  # Firebase project configuration
├── firestore.rules              # Firestore security rules
└── firestore.indexes.json       # Firestore database indexes
```

### Technology Stack
- Frontend: HTML, CSS, JavaScript
- CSS Framework: Tailwind CSS (via CDN)
- Backend: Firebase Firestore (NoSQL database)
- Hosting: Firebase Hosting
- CI/CD: GitHub Actions (automatic deployment)
- Authentication: Simple password-based admin access (to be upgraded to Firebase Auth)

### Deployment Info
- **Live Site**: https://waitlist-manager-wong.web.app/
- **Admin Panel**: https://waitlist-manager-wong.web.app/admin.html
- **Admin Password**: swim2024 (stored in js/admin.js:8)
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
10. ✅ Firestore security rules deployed

### Firestore Collections
- `waitlist` - Stores customer signup data
  - Fields: name, phone, lessonType, groupSize, ages, location, preferredTime, contactPreference, status, timestamp

### Security Notes
- Firebase config keys in `firebase-config.js` are safe to be public
- Security is enforced through Firestore security rules
- Admin password is currently client-side only (should upgrade to Firebase Authentication)
- Firestore rules expire on 2025-11-15 (update before expiration)

### Future Improvements
- [ ] Implement proper Firebase Authentication for admin access
- [ ] Add email notifications for new signups
- [ ] Implement search/filter functionality in admin panel
- [ ] Add pagination for large datasets
- [ ] Create custom domain setup
- [ ] Add analytics tracking