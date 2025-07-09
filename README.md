# Customer Portal - Azure Static Web Apps

A secure, responsive customer portal built with vanilla HTML, CSS, and JavaScript, designed for deployment on Azure Static Web Apps.

## Features

- **Secure Authentication**: Demo login system with form validation
- **Responsive Dashboard**: Overview of account status and recent activity  
- **Account Management**: View personal information and subscription details
- **Billing History**: Comprehensive transaction history with download functionality
- **Mobile-First Design**: Fully responsive across all device sizes
- **Accessibility**: WCAG AA compliant with keyboard navigation support

## Demo Credentials

- **Email**: demo@example.com
- **Password**: password123

## Local Development

1. Clone the repository
2. Open `index.html` in your browser or serve with a local web server
3. For best experience, use a local server like Live Server in VS Code

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

## Project Structure

```
├── index.html              # Login page
├── dashboard.html          # Main dashboard
├── css/
│   ├── styles.css          # Base styles and design system
│   ├── login.css           # Login page specific styles
│   └── dashboard.css       # Dashboard specific styles
├── js/
│   ├── auth.js             # Authentication logic
│   └── dashboard.js        # Dashboard functionality
├── staticwebapp.config.json # Azure Static Web Apps configuration
└── README.md
```

## Design System

### Colors
- **Primary**: Deep blue (#1a365d) - Trust and security
- **Secondary**: Lighter blues for supporting elements
- **Accent**: Teal (#319795) - Modern highlights and CTAs
- **Background**: Light neutral tones for clarity

### Typography
- **Headings**: Inter font family for professional appearance
- **Body**: Roboto for optimal readability
- **Hierarchy**: 1.25 ratio scaling between text levels

### Components
- Card-based layout with subtle shadows
- Consistent 4px spacing system
- Rounded corners (medium radius)
- Smooth transitions (200-300ms)

## Azure Static Web Apps Deployment

### Option 1: GitHub Actions (Recommended)

1. **Fork or clone this repository to your GitHub account**

2. **Create an Azure Static Web App resource**:
   - Go to [Azure Portal](https://portal.azure.com)
   - Create a new "Static Web App" resource
   - Connect to your GitHub repository
   - Set build details:
     - **App location**: `/`
     - **API location**: (leave empty)
     - **Output location**: (leave empty)

3. **Azure will automatically**:
   - Create a GitHub Actions workflow
   - Deploy your app
   - Provide a live URL

### Option 2: Azure CLI

```bash
# Install Azure CLI and login
az login

# Create resource group
az group create --name myResourceGroup --location "East US"

# Create static web app
az staticwebapp create \
  --name myCustomerPortal \
  --resource-group myResourceGroup \
  --source https://github.com/yourusername/customer-portal \
  --location "East US" \
  --branch main \
  --app-location "/" \
  --login-with-github
```

### Option 3: Manual Upload

1. Create an Azure Static Web App resource in the portal
2. Get the deployment token from the resource
3. Use the Azure CLI to deploy:

```bash
az staticwebapp environment set-config \
  --name myCustomerPortal \
  --environment-name default \
  --source .
```

## Configuration

The `staticwebapp.config.json` file includes:

- **Routing**: Proper navigation between pages
- **Security Headers**: XSS protection, content type sniffing prevention
- **MIME Types**: Correct content-type headers
- **Fallback**: SPA-style routing fallback

## Security Features

- **Input Validation**: Email format and required field validation
- **Session Management**: Local storage with timeout handling
- **Security Headers**: Applied via Static Web Apps configuration
- **HTTPS**: Enforced by Azure Static Web Apps by default

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Features Used**: CSS Grid, Flexbox, localStorage, ES6+

## Performance Optimizations

- **Critical CSS**: Inlined base styles
- **Font Loading**: Preconnect to Google Fonts
- **Images**: SVG icons for crisp rendering at any size
- **JavaScript**: Vanilla JS for minimal bundle size
- **Caching**: Configured through Azure Static Web Apps

## Customization

### Colors
Update the CSS custom properties in `css/styles.css`:

```css
:root {
  --color-primary: oklch(0.48 0.1 245);
  --color-accent: oklch(0.65 0.15 200);
  /* ... other colors */
}
```

### Branding
1. Replace the logo SVG in the header sections
2. Update the page titles and meta tags
3. Modify the color scheme to match your brand

### Functionality
- **API Integration**: Replace demo data with real API calls
- **Authentication**: Integrate with Azure AD, Auth0, or custom auth
- **Features**: Add payment processing, document management, etc.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different browsers and devices
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For deployment issues:
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure Support](https://azure.microsoft.com/en-us/support/options/)

For application issues:
- Create an issue in this repository
- Review the browser console for error messages
