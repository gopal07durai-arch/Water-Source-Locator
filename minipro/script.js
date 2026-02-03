
const loginToggle = document.getElementById('login-toggle');
const registerToggle = document.getElementById('register-toggle');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const switchToRegister = document.getElementById('switch-to-register');
const switchToLogin = document.getElementById('switch-to-login');

function showLoginForm() {
    loginToggle.classList.add('active');
    registerToggle.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
}

function showRegisterForm() {
    registerToggle.classList.add('active');
    loginToggle.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
}

loginToggle.addEventListener('click', showLoginForm);
registerToggle.addEventListener('click', showRegisterForm);
switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterForm();
});
switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

// Form validation and submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (email && password) {
        // Here you would typically send the data to your backend
        alert('Login successful! (This is a demo)');
        // Reset form
        loginForm.reset();
    } else {
        alert('Please fill in all fields');
    }
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (name && email && password && confirmPassword) {
        if (password === confirmPassword) {
            // Here you would typically send the data to your backend
            alert('Registration successful! (This is a demo)');
            // Reset form and switch to login
            registerForm.reset();
            showLoginForm();
        } else {
            alert('Passwords do not match');
        }
    } else {
        alert('Please fill in all fields');
    }
});


document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'translateY(0)';
    });
});
