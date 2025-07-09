# Customer Portal - Deployment Guide

## Quick Start

1. **Test locally**:
   ```bash
   npm install
   npm start
   ```

2. **Deploy to Azure**:
   - Fork this repository
   - Create Azure Static Web App
   - Connect to your GitHub repo
   - Deploy automatically via GitHub Actions

## Production Checklist

- [ ] Update demo credentials in production
- [ ] Configure real authentication system
- [ ] Set up API endpoints for data
- [ ] Add monitoring and analytics
- [ ] Test on all target browsers
- [ ] Verify accessibility compliance
- [ ] Set up custom domain (optional)
- [ ] Configure CDN (optional)

## Environment Variables

For production deployment, consider these configurations:

```json
{
  "AUTH_PROVIDER": "azure-ad",
  "API_BASE_URL": "https://your-api.azurewebsites.net",
  "ENVIRONMENT": "production"
}
```

## Security Considerations

1. **Authentication**: Replace demo login with real auth
2. **API Security**: Implement proper API authentication
3. **Data Validation**: Add server-side validation
4. **Rate Limiting**: Implement request throttling
5. **HTTPS**: Ensure all traffic is encrypted (automatic with Azure Static Web Apps)

## Performance Optimization

1. **Images**: Add optimized images/icons
2. **Fonts**: Consider self-hosting fonts
3. **Caching**: Configure appropriate cache headers
4. **Compression**: Enable gzip compression
5. **Monitoring**: Set up Application Insights
