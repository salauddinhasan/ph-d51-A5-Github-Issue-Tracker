//  form select
const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

loginForm.addEventListener('submit', function(e){
    e.preventDefault(); // page reload বন্ধ

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if(username === '' && password === '') {
        message.textContent = "Username and Password cannot be empty!";
    } 
    else if(username !== 'admin') {
        message.textContent = "Username is incorrect!";
    } 
    else if(password === '') {
        message.textContent = "Password cannot be empty!";
    }
    else if(password !== 'admin123') {
        message.textContent = "Password is incorrect!";
    } 
    else {
        // success → redirect
        window.location.href = "home.html";
    }
});