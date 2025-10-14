# Quick Start Guide

Get your Swimming Lessons Waitlist up and running in 5 minutes!

## Step 1: Change Admin Password (1 minute)

⚠️ **DO THIS FIRST!**

1. Open `js/admin.js` in your code editor
2. Go to line 8
3. Change `const ADMIN_PASSWORD = "swim2024";` to your secure password
4. Save the file

Example:
```javascript
const ADMIN_PASSWORD = "MySecurePass123!"; // Your new password
```

## Step 2: Test Locally (2 minutes)

### Test Customer Page
1. Open `index.html` in your browser
2. Fill out the form with test data
3. Click "Join Waitlist"
4. You should see a success message

### Test Admin Panel
1. Open `admin.html` in your browser
2. Enter your admin password
3. You should see:
   - Dashboard with stats
   - Sample entries in the table
   - Your test entry from step 2.1

## Step 3: Customize (2 minutes)

### Update Business Name
1. Open `index.html`
2. Find line 26: `Swimming Lessons`
3. Change to your business name
4. Find line 49: `By Coach Wong`
5. Change "Wong" to your name

### Customize Colors (Optional)
1. Open `css/style.css`
2. Lines 3-6: Change the CSS variables
3. Save and refresh browser

## Step 4: Deploy (Optional)

### Option A: Simple Hosting (Netlify/Vercel)
1. Create account on Netlify.com or Vercel.com
2. Drag and drop your project folder
3. Get your live URL
4. Share with customers!

### Option B: GitHub Pages
1. Push code to GitHub repository
2. Go to Settings > Pages
3. Select branch and folder
4. Get your GitHub Pages URL

### Option C: Local Network
1. Use VS Code Live Server extension
2. Right-click `index.html` > "Open with Live Server"
3. Share the local network URL with your team

## Testing Checklist

Before going live, test these:

- [ ] Customer form submits successfully
- [ ] Admin login works with your password
- [ ] Admin panel shows submitted entries
- [ ] "Mark as Contacted" button works
- [ ] "Remove" button works
- [ ] "Export to CSV" downloads file
- [ ] Works on your phone (mobile responsive)
- [ ] Rate limiting prevents spam (try submitting twice quickly)

## Common Tasks

### Clear All Data
Open browser console (F12) and run:
```javascript
localStorage.clear()
location.reload()
```

### View Stored Data
Open browser console (F12) and run:
```javascript
JSON.parse(localStorage.getItem('waitlistData'))
```

### Change Rate Limit Duration
Edit `js/main.js` line 22:
```javascript
// Change 60000 to your desired milliseconds
if (lastSubmission && (now - parseInt(lastSubmission)) < 60000) {
    // 60000 = 60 seconds
    // 30000 = 30 seconds
    // 120000 = 2 minutes
}
```

## Admin Panel Usage

### Filter Entries
- Click "All" to see everyone
- Click "Waiting" to see only people waiting
- Click "Contacted" to see only contacted people

### Mark as Contacted
1. Find the person in the list
2. Click the green checkmark (✓) icon
3. Entry moves to "Contacted" status

### Remove from Waitlist
1. Find the person in the list
2. Click the red trash (🗑) icon
3. Confirm the removal
4. Entry is deleted

### Export to CSV
1. Click "Export to CSV" button (bottom right)
2. File downloads automatically
3. Open in Excel, Google Sheets, or any spreadsheet app

## Tips for Success

### For Customers
- **Share the Link**: Add the URL to your WhatsApp status, Instagram bio, or Facebook page
- **QR Code**: Generate a QR code for the signup page to use in marketing materials
- **Test First**: Have friends test the form before sharing widely

### For Administrators
- **Regular Checks**: Check the admin panel daily for new signups
- **Export Weekly**: Download CSV backup every week
- **Mark Contacted**: Always mark people as contacted after reaching out
- **Clean Up**: Remove people who are no longer interested

## Need Help?

- Check `README.md` for detailed documentation
- Review `PROJECT_GUIDE.md` for full build guide
- Open browser console (F12) to see error messages
- Verify all files are in the correct folders

## Next Steps

Want to add more features?

1. **Firebase Integration** (Phase 5-6 in PROJECT_GUIDE.md)
   - Real-time database
   - Cloud hosting
   - Better authentication

2. **Email Notifications**
   - Auto-email when someone joins
   - Reminder emails for waiting customers

3. **WhatsApp Integration**
   - Direct WhatsApp links from admin panel
   - Auto-message templates

4. **Analytics**
   - Track conversion rates
   - Monitor signup trends
   - Popular time slots

---

**Ready to launch? You're all set! 🎉**

Just remember to:
1. ✅ Change the admin password
2. ✅ Test everything
3. ✅ Customize your business name
4. ✅ Share the link!
