# Admin Authentication Setup Guide

This guide will help you set up Firebase Authentication for the admin panel.

## Prerequisites

- Node.js installed on your system
- Firebase CLI installed (`npm install -g firebase-tools`)
- Access to Firebase Console

## Step 1: Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `waitlist-manager-wong`
3. Navigate to **Authentication** in the left sidebar
4. Click on **Get Started** (if not already enabled)
5. Go to the **Sign-in method** tab
6. Enable **Email/Password** authentication:
   - Click on **Email/Password**
   - Toggle the first option to **Enabled**
   - Click **Save**

## Step 2: Get Firebase Service Account Key

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Navigate to the **Service Accounts** tab
3. Click **Generate New Private Key**
4. Save the downloaded JSON file as `serviceAccountKey.json` in your project root
5. **IMPORTANT**: This file contains sensitive credentials. Never commit it to version control!

## Step 3: Install Dependencies

```bash
npm install
```

This will install the `firebase-admin` package needed for the setup script.

## Step 4: Create Admin User

Run the setup script with your desired admin email and password:

```bash
node setup-admin.js admin@example.com YourSecurePassword123!
```

**Password Requirements:**
- Minimum 6 characters
- Should include uppercase, lowercase, numbers, and special characters for security

The script will:
- Create a new Firebase user with the provided email/password
- Set custom admin claims on the user
- Allow the user to access the admin panel

## Step 5: Deploy Security Rules

Deploy the updated Firestore security rules:

```bash
firebase deploy --only firestore:rules
```

## Step 6: Deploy the Application

Deploy the updated application code:

```bash
firebase deploy --only hosting
```

Or simply push to the main branch (GitHub Actions will auto-deploy):

```bash
git add .
git commit -m "Add Firebase Authentication for admin panel"
git push
```

## Step 7: Test the Admin Login

1. Go to your admin panel: https://waitlist-manager-wong.web.app/admin.html
2. Enter the admin email and password you created
3. You should be logged in successfully!

## Security Notes

1. **Service Account Key**:
   - The `serviceAccountKey.json` file is already in `.gitignore`
   - Never share or commit this file
   - Store it securely (password manager, secure vault)

2. **Admin Privileges**:
   - Only users with the `admin: true` custom claim can access the admin panel
   - Regular users (even if authenticated) cannot access admin features

3. **Firestore Rules**:
   - Customers can create waitlist entries (signup)
   - Only authenticated admins can update/delete entries
   - All reads are currently public (can be restricted if needed)

## Updating Existing Users to Admin

If you already have a user and want to grant admin privileges:

```bash
node setup-admin.js existing-user@example.com any-password
```

The script will detect the existing user and just update their admin privileges.

## Troubleshooting

### "serviceAccountKey.json not found"
- Make sure you downloaded the service account key from Firebase Console
- Ensure it's named exactly `serviceAccountKey.json`
- Place it in the project root directory

### "auth/email-already-exists"
- The script will automatically update the existing user with admin privileges
- No action needed

### "Permission denied" on Firestore operations
- Ensure you've deployed the security rules: `firebase deploy --only firestore:rules`
- Make sure the user has the admin custom claim

### Login fails with "You do not have admin privileges"
- Re-run the setup script to ensure admin claims are set
- The user may need to log out and log back in for claims to refresh

## Next Steps

After setup, you can:
- Delete the `serviceAccountKey.json` file (keep a secure backup)
- Remove the `setup-admin.js` and related files if you don't need them anymore
- Set up additional admin users as needed
- Consider implementing password reset functionality
- Add email verification for additional security
