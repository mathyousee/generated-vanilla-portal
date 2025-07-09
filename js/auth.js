// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    // Demo credentials
    const DEMO_CREDENTIALS = {
        email: 'demo@example.com',
        password: 'password123'
    };
    
    // Check if user is already logged in
    if (isLoggedIn()) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Clear previous error messages
        hideError();
        
        // Validate inputs
        if (!email || !password) {
            showError('Please fill in all fields.');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }
        
        // Simulate login process
        showLoading();
        
        setTimeout(() => {
            if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
                // Successful login
                login(email);
                window.location.href = 'dashboard.html';
            } else {
                hideLoading();
                showError('Invalid email or password. Please try again.');
            }
        }, 1000); // Simulate network delay
    });
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    function hideError() {
        errorMessage.style.display = 'none';
    }
    
    function showLoading() {
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Signing In...';
        submitButton.disabled = true;
    }
    
    function hideLoading() {
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Sign In';
        submitButton.disabled = false;
    }
});

// Authentication utility functions
function login(email) {
    const userData = {
        email: email,
        name: 'John Doe',
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Session timeout handling
function initSessionTimeout() {
    const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes
    let timeoutId;
    
    function resetTimeout() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            alert('Your session has expired. You will be redirected to the login page.');
            logout();
        }, TIMEOUT_DURATION);
    }
    
    // Reset timeout on user activity
    document.addEventListener('mousedown', resetTimeout);
    document.addEventListener('mousemove', resetTimeout);
    document.addEventListener('keypress', resetTimeout);
    document.addEventListener('scroll', resetTimeout);
    document.addEventListener('touchstart', resetTimeout);
    
    // Initial timeout set
    resetTimeout();
}
