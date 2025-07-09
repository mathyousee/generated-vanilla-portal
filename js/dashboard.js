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
