#!/usr/bin/env node

/**
 * Admin User Setup Script
 *
 * This script creates an admin user with custom claims for the waitlist manager.
 * It requires Firebase Admin SDK and should be run with Node.js.
 *
 * Usage:
 *   1. Install Firebase Admin SDK: npm install firebase-admin
 *   2. Download your Firebase service account key from:
 *      Firebase Console > Project Settings > Service Accounts > Generate New Private Key
 *   3. Save it as 'serviceAccountKey.json' in the project root
 *   4. Run: node setup-admin.js <email> <password>
 *
 * Example:
 *   node setup-admin.js admin@example.com SecurePassword123!
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Check if service account key exists
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ Error: serviceAccountKey.json not found!');
    console.error('\nPlease follow these steps:');
    console.error('1. Go to Firebase Console > Project Settings > Service Accounts');
    console.error('2. Click "Generate New Private Key"');
    console.error('3. Save the file as "serviceAccountKey.json" in the project root');
    console.error('4. Run this script again\n');
    process.exit(1);
}

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Get command line arguments
const args = process.argv.slice(2);

if (args.length !== 2) {
    console.error('❌ Usage: node setup-admin.js <email> <password>');
    console.error('Example: node setup-admin.js admin@example.com SecurePassword123!');
    process.exit(1);
}

const [email, password] = args;

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
    console.error('❌ Invalid email format');
    process.exit(1);
}

// Validate password strength
if (password.length < 6) {
    console.error('❌ Password must be at least 6 characters long');
    process.exit(1);
}

async function setupAdmin() {
    try {
        console.log('🔄 Creating admin user...');

        // Create the user
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            emailVerified: true,
            disabled: false
        });

        console.log('✅ User created successfully:', userRecord.uid);

        // Set custom admin claim
        await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

        console.log('✅ Admin privileges granted');
        console.log('\n📋 Admin Account Details:');
        console.log('   Email:', email);
        console.log('   UID:', userRecord.uid);
        console.log('   Admin Claim: true');
        console.log('\n🎉 Admin setup complete! You can now login at your admin panel.');
        console.log('\n⚠️  IMPORTANT: Delete or secure the serviceAccountKey.json file!');
        console.log('   Add it to .gitignore to prevent committing it to version control.');

        process.exit(0);
    } catch (error) {
        if (error.code === 'auth/email-already-exists') {
            console.log('⚠️  User already exists. Updating admin privileges...');

            try {
                const userRecord = await admin.auth().getUserByEmail(email);
                await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

                console.log('✅ Admin privileges granted to existing user');
                console.log('\n📋 Admin Account Details:');
                console.log('   Email:', email);
                console.log('   UID:', userRecord.uid);
                console.log('   Admin Claim: true');
                console.log('\n🎉 Admin setup complete!');

                process.exit(0);
            } catch (updateError) {
                console.error('❌ Error updating user:', updateError.message);
                process.exit(1);
            }
        } else {
            console.error('❌ Error:', error.message);
            process.exit(1);
        }
    }
}

setupAdmin();
