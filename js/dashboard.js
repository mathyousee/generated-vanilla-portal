// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize dashboard
    initDashboard();
    initNavigation();
    initSessionTimeout();
    loadBillingHistory();
    initAccountDetails();
    
    // Setup logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', logout);
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
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Update active navigation
            document.querySelector('.nav-item.active').classList.remove('active');
            this.parentElement.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetElement = document.getElementById(targetSection + '-section');
            if (targetElement) {
                targetElement.classList.add('active');
            }
            
            // Update URL hash
            window.location.hash = targetSection;
        });
    });
    
    // Handle initial navigation based on hash
    const hash = window.location.hash.substring(1);
    if (hash && ['dashboard', 'account', 'billing'].includes(hash)) {
        const targetLink = document.querySelector(`[data-section="${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
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

function initAccountDetails() {
    loadAccountData();
    setupAccountEventListeners();
}

function loadAccountData() {
    showAccountLoading();
    
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
            })
            .catch(error => {
                console.error('Error loading account data:', error);
                showAccountError();
                hideAccountLoading();
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
    
    // Escape to go back to dashboard
    if (e.key === 'Escape') {
        document.querySelector('[data-section="dashboard"]').click();
    }
});
