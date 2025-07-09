# AI Summary Feature Configuration

## Environment Variables

To enable real Azure OpenAI integration, configure the following environment variables in your Azure Static Web Apps:

### Required Variables

```bash
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name
AZURE_OPENAI_API_KEY=your-api-key
```

### Configuration in Azure Static Web Apps

1. Go to your Azure Static Web App resource in the Azure Portal
2. Navigate to "Configuration" in the left sidebar
3. Click "Application settings"
4. Add the three environment variables above with your Azure OpenAI values

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