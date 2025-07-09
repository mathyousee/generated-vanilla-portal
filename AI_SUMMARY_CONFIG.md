# AI Summary Feature Configuration

## Configuration

To enable real Azure OpenAI integration, you can configure the following variables:

### Required Variables

For client-side configuration, set these as global variables in your application:

```javascript
// Add these to your HTML before loading dashboard.js
window.AZURE_OPENAI_ENDPOINT = 'https://your-resource-name.openai.azure.com';
window.AZURE_OPENAI_DEPLOYMENT_NAME = 'your-deployment-name';
window.AZURE_OPENAI_API_KEY = 'your-api-key';
```

**Security Note**: Since this is a client-side application, API keys will be visible to users. For production use, consider implementing a backend proxy service to securely handle Azure OpenAI API calls.

### Alternative Configuration Methods

1. **Environment Variables (Build Time)**: Configure during build process if using a bundler
2. **Configuration File**: Create a separate config.js file with your settings
3. **Backend Proxy**: Implement a secure backend service to handle API calls

### Demo Mode

When environment variables are not configured, the AI Summary feature operates in demo mode:
- Shows mock summaries with document statistics
- Demonstrates the UI workflow
- Provides keyword extraction from the text

## Supported File Types

- **PDF files**: Text extraction using PDF.js library
- **Image files**: OCR text extraction using Tesseract.js library
  - Supported formats: PNG, JPEG, TIFF, BMP, GIF

## Features

1. **File Upload**: Drag-and-drop or browse to select files
2. **Text Extraction**: Automatic text extraction from PDFs and images
3. **AI Summarization**: Generate summaries using Azure OpenAI
4. **User Interface**: Clean, responsive interface with processing indicators
5. **Copy to Clipboard**: Easy copying of generated summaries
6. **File Validation**: Prevents upload of unsupported file types

## Security Considerations

- API keys are stored securely in Azure Static Web Apps configuration
- File processing happens client-side (no files uploaded to servers)
- Text extraction libraries run in the browser
- Only extracted text is sent to Azure OpenAI (not original files)