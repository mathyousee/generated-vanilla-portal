// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard page loaded at:', new Date().toISOString());
    
    // Add a small delay to ensure localStorage is ready
    setTimeout(() => {
        // Check if user is logged in
        if (!isLoggedIn()) {
            console.log('User not logged in, redirecting to index.html');
            window.location.href = 'index.html';
            return;
        }
        
        console.log('User is logged in, initializing dashboard...');
        
        // Initialize dashboard
        initDashboard();
        initNavigation();
        initSessionTimeout();
        loadBillingHistory();
        initAccountDetails();
        initAISummary();
        
        // Setup logout functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
        
        console.log('Dashboard initialization complete');
    }, 10);
});

function initDashboard() {
    const user = getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.name;
    }
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    let isNavigating = false;
    
    function showSection(targetSection) {
        if (isNavigating) return;
        isNavigating = true;
        
        // Update active navigation
        const currentActive = document.querySelector('.nav-item.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }
        
        const targetLink = document.querySelector(`[data-section="${targetSection}"]`);
        if (targetLink) {
            targetLink.parentElement.classList.add('active');
        }
        
        // Show target section
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetElement = document.getElementById(targetSection + '-section');
        if (targetElement) {
            targetElement.classList.add('active');
        }
        
        // Update URL hash without triggering navigation
        if (window.location.hash !== '#' + targetSection) {
            history.replaceState(null, null, '#' + targetSection);
        }
        
        isNavigating = false;
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            showSection(targetSection);
        });
    });
    
    // Handle initial navigation based on hash - only once
    const hash = window.location.hash.substring(1);
    if (hash && ['dashboard', 'account', 'billing', 'ai-summary'].includes(hash)) {
        showSection(hash);
    }
}

function loadBillingHistory() {
    const billingData = [
        {
            date: '2025-06-09',
            description: 'Premium Plan - Monthly Subscription',
            amount: '$29.99',
            status: 'paid',
            invoice: 'INV-2025-0609'
        },
        {
            date: '2025-05-09',
            description: 'Premium Plan - Monthly Subscription',
            amount: '$29.99',
            status: 'paid',
            invoice: 'INV-2025-0509'
        },
        {
            date: '2025-04-09',
            description: 'Premium Plan - Monthly Subscription',
            amount: '$29.99',
            status: 'paid',
            invoice: 'INV-2025-0409'
        },
        {
            date: '2025-03-09',
            description: 'Premium Plan - Monthly Subscription',
            amount: '$29.99',
            status: 'paid',
            invoice: 'INV-2025-0309'
        },
        {
            date: '2025-02-09',
            description: 'Premium Plan - Monthly Subscription',
            amount: '$29.99',
            status: 'paid',
            invoice: 'INV-2025-0209'
        },
        {
            date: '2025-01-09',
            description: 'Premium Plan - Initial Setup',
            amount: '$29.99',
            status: 'paid',
            invoice: 'INV-2025-0109'
        }
    ];
    
    const tableBody = document.getElementById('billingTableBody');
    
    billingData.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.description}</td>
            <td>${transaction.amount}</td>
            <td><span class="table-status ${transaction.status}">${transaction.status}</span></td>
            <td><a href="#" class="download-link" onclick="downloadInvoice('${transaction.invoice}')">Download</a></td>
        `;
        tableBody.appendChild(row);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function downloadInvoice(invoiceId) {
    // Simulate invoice download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${invoiceId}.pdf`;
    
    // Show a message since this is a demo
    alert(`In a real application, this would download invoice ${invoiceId}.pdf`);
    
    // In a real application, you would:
    // 1. Make an API call to generate/fetch the invoice
    // 2. Create a blob with the PDF data
    // 3. Create a download link
    // Example:
    // fetch(`/api/invoices/${invoiceId}/download`)
    //   .then(response => response.blob())
    //   .then(blob => {
    //     const url = window.URL.createObjectURL(blob);
    //     link.href = url;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     window.URL.revokeObjectURL(url);
    //   });
}

// Utility functions for smooth animations
function animateValue(element, start, end, duration) {
    const startTimestamp = performance.now();
    
    function step(timestamp) {
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (end - start) * easeOutCubic(progress);
        element.textContent = Math.floor(current);
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Account Details Management
let accountData = {};
let isAccountInitialized = false;

function initAccountDetails() {
    // Prevent multiple initializations
    if (isAccountInitialized) {
        return;
    }
    isAccountInitialized = true;
    
    loadAccountData();
    setupAccountEventListeners();
}

function loadAccountData() {
    showAccountLoading();
    
    // Prevent multiple simultaneous loads
    if (loadAccountData.isLoading) {
        return;
    }
    loadAccountData.isLoading = true;
    
    // Simulate API call delay
    setTimeout(() => {
        fetch('data/account.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load account data');
                }
                return response.json();
            })
            .then(data => {
                accountData = data;
                displayAccountData();
                hideAccountLoading();
                loadAccountData.isLoading = false;
            })
            .catch(error => {
                console.error('Error loading account data:', error);
                showAccountError();
                hideAccountLoading();
                loadAccountData.isLoading = false;
            });
    }, 500);
}

function displayAccountData() {
    // Display personal info
    document.getElementById('display-fullName').textContent = accountData.personalInfo.fullName;
    document.getElementById('display-email').textContent = accountData.personalInfo.email;
    document.getElementById('display-phone').textContent = accountData.personalInfo.phone;
    
    // Display subscription info
    document.getElementById('display-planType').textContent = accountData.subscription.planType;
    document.getElementById('display-nextBillingDate').textContent = accountData.subscription.nextBillingDate;
    document.getElementById('display-monthlyCost').textContent = accountData.subscription.monthlyCost;
}

function setupAccountEventListeners() {
    // Personal info edit buttons
    document.getElementById('edit-personal-btn').addEventListener('click', () => editPersonalInfo());
    document.getElementById('save-personal-btn').addEventListener('click', () => savePersonalInfo());
    document.getElementById('cancel-personal-btn').addEventListener('click', () => cancelPersonalEdit());
    
    // Subscription edit buttons
    document.getElementById('edit-subscription-btn').addEventListener('click', () => editSubscriptionInfo());
    document.getElementById('save-subscription-btn').addEventListener('click', () => saveSubscriptionInfo());
    document.getElementById('cancel-subscription-btn').addEventListener('click', () => cancelSubscriptionEdit());
}

function editPersonalInfo() {
    // Populate form with current data
    document.getElementById('edit-fullName').value = accountData.personalInfo.fullName;
    document.getElementById('edit-email').value = accountData.personalInfo.email;
    document.getElementById('edit-phone').value = accountData.personalInfo.phone;
    
    // Toggle view
    document.getElementById('personal-info-view').style.display = 'none';
    document.getElementById('personal-info-edit').style.display = 'block';
    document.getElementById('edit-personal-btn').style.display = 'none';
}

function savePersonalInfo() {
    // Get form values
    const fullName = document.getElementById('edit-fullName').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    
    // Validate
    if (!validatePersonalInfo(fullName, email, phone)) {
        return;
    }
    
    // Update local data
    accountData.personalInfo.fullName = fullName;
    accountData.personalInfo.email = email;
    accountData.personalInfo.phone = phone;
    
    // Update display
    displayAccountData();
    
    // Toggle view back
    cancelPersonalEdit();
    
    // Show success message
    showSuccessMessage('Personal information updated successfully!');
}

function validatePersonalInfo(fullName, email, phone) {
    // Clear previous errors
    clearFormErrors();
    
    let isValid = true;
    
    if (!fullName || fullName.length < 2) {
        showFieldError('edit-fullName', 'Full name must be at least 2 characters long');
        isValid = false;
    }
    
    if (!email || !isValidEmail(email)) {
        showFieldError('edit-email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!phone || !isValidPhone(phone)) {
        showFieldError('edit-phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)\.]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
}

function cancelPersonalEdit() {
    document.getElementById('personal-info-view').style.display = 'block';
    document.getElementById('personal-info-edit').style.display = 'none';
    document.getElementById('edit-personal-btn').style.display = 'inline-block';
    clearFormErrors();
}

function editSubscriptionInfo() {
    // Populate form with current data
    document.getElementById('edit-planType').value = accountData.subscription.planType;
    
    // Convert date format for input
    const nextBillingDate = convertDateForInput(accountData.subscription.nextBillingDate);
    document.getElementById('edit-nextBillingDate').value = nextBillingDate;
    
    document.getElementById('edit-monthlyCost').value = accountData.subscription.monthlyCost;
    
    // Toggle view
    document.getElementById('subscription-info-view').style.display = 'none';
    document.getElementById('subscription-info-edit').style.display = 'block';
    document.getElementById('edit-subscription-btn').style.display = 'none';
}

function saveSubscriptionInfo() {
    // Get form values
    const planType = document.getElementById('edit-planType').value;
    const nextBillingDate = document.getElementById('edit-nextBillingDate').value;
    const monthlyCost = document.getElementById('edit-monthlyCost').value.trim();
    
    // Validate
    if (!validateSubscriptionInfo(planType, nextBillingDate, monthlyCost)) {
        return;
    }
    
    // Update local data
    accountData.subscription.planType = planType;
    accountData.subscription.nextBillingDate = convertDateForDisplay(nextBillingDate);
    accountData.subscription.monthlyCost = monthlyCost;
    
    // Update display
    displayAccountData();
    
    // Toggle view back
    cancelSubscriptionEdit();
    
    // Show success message
    showSuccessMessage('Subscription information updated successfully!');
}

function validateSubscriptionInfo(planType, nextBillingDate, monthlyCost) {
    // Clear previous errors
    clearFormErrors();
    
    let isValid = true;
    
    if (!planType) {
        showFieldError('edit-planType', 'Please select a plan type');
        isValid = false;
    }
    
    if (!nextBillingDate) {
        showFieldError('edit-nextBillingDate', 'Please select a billing date');
        isValid = false;
    }
    
    if (!monthlyCost || !isValidMonthlyCost(monthlyCost)) {
        showFieldError('edit-monthlyCost', 'Please enter a valid amount (e.g., $29.99)');
        isValid = false;
    }
    
    return isValid;
}

function isValidMonthlyCost(cost) {
    const costRegex = /^\$\d+\.\d{2}$/;
    return costRegex.test(cost);
}

function convertDateForInput(displayDate) {
    // Convert "August 9, 2025" to "2025-08-09"
    const date = new Date(displayDate);
    if (isNaN(date.getTime())) {
        return '';
    }
    return date.toISOString().split('T')[0];
}

function convertDateForDisplay(inputDate) {
    // Convert "2025-08-09" to "August 9, 2025"
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) {
        return inputDate;
    }
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function cancelSubscriptionEdit() {
    document.getElementById('subscription-info-view').style.display = 'block';
    document.getElementById('subscription-info-edit').style.display = 'none';
    document.getElementById('edit-subscription-btn').style.display = 'inline-block';
    clearFormErrors();
}

function showAccountLoading() {
    document.getElementById('account-loading').style.display = 'block';
    document.getElementById('account-content').style.display = 'none';
    document.getElementById('account-error').style.display = 'none';
    document.getElementById('account-success').style.display = 'none';
}

function hideAccountLoading() {
    document.getElementById('account-loading').style.display = 'none';
    document.getElementById('account-content').style.display = 'block';
}

function showAccountError() {
    document.getElementById('account-error').style.display = 'block';
    document.getElementById('account-success').style.display = 'none';
}

function showSuccessMessage(message) {
    const successElement = document.getElementById('account-success');
    successElement.querySelector('p').textContent = message;
    successElement.style.display = 'block';
    document.getElementById('account-error').style.display = 'none';
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        successElement.style.display = 'none';
    }, 5000);
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    let errorElement = field.nextElementSibling;
    
    if (!errorElement || !errorElement.classList.contains('field-error')) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.color = 'var(--color-error)';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    field.style.borderColor = 'var(--color-error)';
}

function clearFormErrors() {
    // Remove all field error messages
    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(element => element.remove());
    
    // Reset field border colors
    const fields = document.querySelectorAll('#account-section input, #account-section select');
    fields.forEach(field => {
        field.style.borderColor = '';
    });
}

// Enhanced error handling for the dashboard
window.addEventListener('error', function(e) {
    console.error('Dashboard Error:', e.error);
    
    // In a production app, you might want to:
    // 1. Log errors to a service
    // 2. Show user-friendly error messages
    // 3. Provide fallback UI
});

// Handle network connectivity
window.addEventListener('online', function() {
    console.log('Connection restored');
    // In a real app, you might want to sync any pending data
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
    // In a real app, you might want to show an offline indicator
});

// Keyboard shortcuts for better accessibility
document.addEventListener('keydown', function(e) {
    // Alt + D for Dashboard
    if (e.altKey && e.key === 'd') {
        e.preventDefault();
        document.querySelector('[data-section="dashboard"]').click();
    }
    
    // Alt + A for Account
    if (e.altKey && e.key === 'a') {
        e.preventDefault();
        document.querySelector('[data-section="account"]').click();
    }
    
    // Alt + B for Billing
    if (e.altKey && e.key === 'b') {
        e.preventDefault();
        document.querySelector('[data-section="billing"]').click();
    }
    
    // Alt + S for AI Summary
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        document.querySelector('[data-section="ai-summary"]').click();
    }
    
    // Escape to go back to dashboard
    if (e.key === 'Escape') {
        document.querySelector('[data-section="dashboard"]').click();
    }
});

// AI Summary Functionality
function initAISummary() {
    // Configure PDF.js worker
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    const fileInfo = document.getElementById('file-info');
    const processBtn = document.getElementById('process-btn');
    const clearBtn = document.getElementById('clear-btn');
    const processingCard = document.getElementById('processing-card');
    const extractedTextCard = document.getElementById('extracted-text-card');
    const summaryCard = document.getElementById('summary-card');
    
    let selectedFile = null;
    
    // Initialize AI Summary when section is accessed
    if (uploadArea && fileInput) {
        setupFileUpload();
    }
    
    function setupFileUpload() {
        // Click to browse
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelect(files[0]);
            }
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });
        
        // Process button
        processBtn.addEventListener('click', processFile);
        
        // Clear button
        clearBtn.addEventListener('click', clearFile);
        
        // Summarize button
        document.getElementById('summarize-btn').addEventListener('click', generateSummary);
        
        // Copy summary button
        document.getElementById('copy-summary-btn').addEventListener('click', copySummary);
        
        // New file button
        document.getElementById('new-file-btn').addEventListener('click', resetAISummary);
    }
    
    function handleFileSelect(file) {
        if (!file.type.includes('pdf') && !file.type.includes('image')) {
            alert('Please select a PDF or image file.');
            return;
        }
        
        selectedFile = file;
        document.getElementById('file-name').textContent = file.name;
        document.getElementById('file-size').textContent = formatFileSize(file.size);
        
        uploadArea.style.display = 'none';
        fileInfo.style.display = 'block';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    function clearFile() {
        selectedFile = null;
        fileInput.value = '';
        uploadArea.style.display = 'block';
        fileInfo.style.display = 'none';
        hideProcessingCards();
    }
    
    function hideProcessingCards() {
        processingCard.style.display = 'none';
        extractedTextCard.style.display = 'none';
        summaryCard.style.display = 'none';
    }
    
    async function processFile() {
        if (!selectedFile) return;
        
        showProcessing('Extracting text from your file...');
        
        try {
            let extractedText = '';
            
            if (selectedFile.type.includes('pdf')) {
                extractedText = await extractTextFromPDF(selectedFile);
            } else if (selectedFile.type.includes('image')) {
                extractedText = await extractTextFromImage(selectedFile);
            }
            
            if (extractedText.trim()) {
                document.getElementById('extracted-text').value = extractedText;
                processingCard.style.display = 'none';
                extractedTextCard.style.display = 'block';
            } else {
                alert('No text could be extracted from the file.');
                processingCard.style.display = 'none';
            }
        } catch (error) {
            console.error('Error processing file:', error);
            alert('Error processing file. Please try again.');
            processingCard.style.display = 'none';
        }
    }
    
    function showProcessing(message) {
        document.getElementById('processing-message').textContent = message;
        processingCard.style.display = 'block';
        extractedTextCard.style.display = 'none';
        summaryCard.style.display = 'none';
    }
    
    async function extractTextFromPDF(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const typedArray = new Uint8Array(e.target.result);
                    const pdf = await pdfjsLib.getDocument(typedArray).promise;
                    let fullText = '';
                    
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += pageText + '\\n';
                    }
                    
                    resolve(fullText);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }
    
    async function extractTextFromImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const result = await Tesseract.recognize(e.target.result, 'eng', {
                        logger: m => {
                            if (m.status === 'recognizing text') {
                                const progress = Math.round(m.progress * 100);
                                document.getElementById('processing-message').textContent = 
                                    `Extracting text from image... ${progress}%`;
                            }
                        }
                    });
                    resolve(result.data.text);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    
    async function generateSummary() {
        const extractedText = document.getElementById('extracted-text').value;
        if (!extractedText.trim()) {
            alert('No text to summarize.');
            return;
        }
        
        showProcessing('Generating AI summary...');
        
        try {
            const summary = await callAzureOpenAI(extractedText);
            document.getElementById('summary-text').innerHTML = formatSummary(summary);
            processingCard.style.display = 'none';
            summaryCard.style.display = 'block';
        } catch (error) {
            console.error('Error generating summary:', error);
            alert('Error generating summary. Please check your Azure OpenAI configuration.');
            processingCard.style.display = 'none';
        }
    }
    
    async function callAzureOpenAI(text) {
        // Get Azure OpenAI configuration from environment variables
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT || 'your-azure-openai-endpoint';
        const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'your-deployment-name';
        const apiKey = process.env.AZURE_OPENAI_API_KEY || 'your-api-key';
        
        // For demo purposes, return a mock summary if no real configuration
        if (!endpoint || endpoint === 'your-azure-openai-endpoint' || !apiKey || apiKey === 'your-api-key') {
            return generateMockSummary(text);
        }
        
        const response = await fetch(`${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2023-05-15`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that creates concise, well-structured summaries of text documents. Focus on the key points and main ideas.'
                    },
                    {
                        role: 'user',
                        content: `Please summarize the following text in a clear, concise manner with key points and main ideas:\\n\\n${text}`
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`Azure OpenAI API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    function generateMockSummary(text) {
        // Generate a mock summary for demo purposes
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const wordCount = text.split(/\\s+/).length;
        
        return `**Summary** (Demo Mode - Configure Azure OpenAI for real summarization)
        
**Key Points:**
• Document contains approximately ${wordCount} words
• ${sentences.length} sentences detected
• Main topics appear to focus on ${extractKeywords(text).slice(0, 3).join(', ')}

**Overview:**
${sentences.slice(0, 3).join('. ')}.

*Note: This is a demo summary. Please configure Azure OpenAI environment variables for AI-powered summarization.*`;
    }
    
    function extractKeywords(text) {
        const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
        const words = text.toLowerCase().match(/\\b\\w+\\b/g) || [];
        const wordCount = {};
        
        words.forEach(word => {
            if (word.length > 3 && !commonWords.includes(word)) {
                wordCount[word] = (wordCount[word] || 0) + 1;
            }
        });
        
        return Object.entries(wordCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word]) => word);
    }
    
    function formatSummary(summary) {
        return summary
            .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
            .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
            .replace(/\\n/g, '<br>')
            .replace(/•/g, '•');
    }
    
    function copySummary() {
        const summaryText = document.getElementById('summary-text').innerText;
        navigator.clipboard.writeText(summaryText).then(() => {
            const btn = document.getElementById('copy-summary-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    }
    
    function resetAISummary() {
        clearFile();
        hideProcessingCards();
    }
}
