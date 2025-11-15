# Document Retention Policy Manager

A React-based web application for managing legal document retention policies in GCC High environments. This tool enables paralegals and legal staff to track, manage, and search document retention policies without requiring administrative rights.

## Features

- **View All Policies**: Display a comprehensive list of all retention policies
- **Add New Policies**: Create new retention policies with detailed information
- **Edit Existing Policies**: Update policy details as regulations change
- **Delete Policies**: Remove outdated or invalid policies
- **Search & Filter**: Quickly find policies by document type, citation, period, or action
- **GCC High Compliant**: Uses Firestore with GCC High endpoints
- **No Admin Rights Required**: Designed for non-administrative users

## Data Structure

Each retention policy contains:
- **Document Type/Category**: e.g., "Contracts", "Employee Records", "Financial Audits"
- **Retention Period**: e.g., "7 years", "3 years", "Permanent"
- **Disposition Action**: e.g., "Securely Destroy", "Archive", "Review"
- **Authority/Citation**: e.g., "SOX", "HIPAA", "Internal Policy 301.A"

## Firebase Configuration

### GCC High Setup

1. Create a Firebase project in your GCC High environment
2. Enable Firestore Database
3. Update the Firebase configuration in `retention-policy-manager.html`:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_GCC_HIGH_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-gcc-high-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### Firestore Data Path

Data is stored at: `/artifacts/{appId}/public/data/retentionPolicies`

The default `appId` is set to `"legal-retention-policies"`, but you can change this:

```javascript
const APP_ID = "your-app-id-here";
```

### Firestore Security Rules

For a shared department-wide policy list, use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/retentionPolicies/{document} {
      // Allow authenticated users to read
      allow read: if request.auth != null;

      // Allow authenticated users to create, update, delete
      // You may want to restrict this to specific roles
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

For more restrictive access (e.g., only specific users can edit):

```javascript
match /artifacts/{appId}/public/data/retentionPolicies/{document} {
  allow read: if request.auth != null;
  allow create, update, delete: if request.auth != null &&
    request.auth.token.email in ['paralegal@company.com', 'legal@company.com'];
}
```

## Usage

### Opening the Application

Simply open `retention-policy-manager.html` in a modern web browser. The application works entirely client-side and requires no server setup.

### Demo Mode

If Firebase is not configured, the application runs in **demo mode** with sample data. Changes are stored in browser memory only and will be lost on page refresh.

To use demo mode for testing:
1. Open the file without configuring Firebase
2. You'll see a yellow warning banner indicating demo mode
3. All CRUD operations work locally but won't persist

### Adding a Policy

1. Click the **"+ Add New Policy"** button
2. Fill in all required fields:
   - Document Type/Category
   - Retention Period
   - Disposition Action (select from dropdown)
   - Authority/Citation
3. Click **"Create Policy"**

### Editing a Policy

1. Find the policy in the list
2. Click the **"Edit"** button
3. Update any fields as needed
4. Click **"Update Policy"**

### Deleting a Policy

1. Find the policy in the list
2. Click the **"Delete"** button
3. Confirm the deletion in the popup dialog

### Searching Policies

Use the search bar to filter policies by:
- Document type
- Authority/citation
- Retention period
- Disposition action

The search is case-insensitive and searches across all fields.

## Technical Details

### Technologies Used

- **React 18**: UI framework
- **Tailwind CSS**: Styling and responsive design
- **Firebase/Firestore**: Data persistence
- **Babel Standalone**: JSX compilation in-browser

### Browser Compatibility

- Chrome/Edge: Latest version
- Firefox: Latest version
- Safari: Latest version

### No Build Process Required

This is a single-file application that runs entirely in the browser. No npm, webpack, or build tools needed.

## GCC High Considerations

### Endpoints

When using Firebase in GCC High, ensure you're using the correct endpoints:
- Authentication: `https://login.microsoftonline.us`
- Graph API: `https://graph.microsoft.us`
- SharePoint: `https://{tenant}.sharepoint.us`

### Compliance

This application:
- Does **not** require admin rights
- Stores data in Firestore (configurable for GCC High)
- Uses client-side authentication
- Supports role-based access control via Firestore rules

### Data Sovereignty

All data is stored in your configured Firebase/Firestore instance, which should be configured to meet your organization's GCC High requirements.

## Customization

### Changing Disposition Actions

Edit the dropdown options in the modal section (around line 350):

```javascript
<option value="Your Custom Action">Your Custom Action</option>
```

### Styling

The application uses Tailwind CSS. You can customize colors by modifying the class names:
- Primary color: `teal-*` (can be changed to `blue-*`, `purple-*`, etc.)
- Background: `gray-900`, `gray-800`, `gray-700`

### Collection Path

To change the Firestore path, update:

```javascript
const APP_ID = "your-custom-app-id";
const COLLECTION_PATH = `your/custom/path/retentionPolicies`;
```

## Troubleshooting

### "Firestore not initialized" Error

- Check that your Firebase config is correct
- Verify your project ID and API key
- Check browser console for detailed errors
- The app will fall back to demo mode with sample data

### Policies Not Persisting

- Ensure Firebase is properly configured
- Check Firestore security rules
- Verify you're authenticated (if required)
- Check browser console for permission errors

### Search Not Working

- Clear your search term and try again
- Check for typos in your search
- Remember that search is case-insensitive but must match partial text

## Security Best Practices

1. **Never commit your API keys**: Keep Firebase config out of version control
2. **Use environment-specific configs**: Different configs for dev/staging/prod
3. **Implement proper Firestore rules**: Restrict access based on user roles
4. **Enable Firebase Authentication**: Don't allow anonymous access in production
5. **Audit access logs**: Regularly review who's accessing/modifying policies

## Future Enhancements

Potential features to add:
- Export policies to CSV/PDF
- Import policies from spreadsheet
- Audit trail (who modified what and when)
- Email notifications for policy expiration
- Integration with document management systems
- Bulk edit capabilities
- Policy templates

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify Firebase configuration
3. Review Firestore security rules
4. Check network connectivity to Firebase services

## License

This application is provided as-is for use within your organization.
