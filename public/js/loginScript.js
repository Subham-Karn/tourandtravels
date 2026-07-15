const form = document.querySelector("form");

const email = document.querySelector("input[name='email']");
const password = document.querySelector("input[name='password']");

const { success = false, message = null } = JSON.parse(window.pageData);

console.log(success);

// Show server response when page loads
if (message) {
    alert(message);
}

form.addEventListener("submit", (e) => {

    if (!email.value.trim()) {
        e.preventDefault();
        alert("Please enter your email.");
        email.focus();
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.value.trim())) {
        e.preventDefault();
        alert("Please enter a valid email.");
        email.focus();
        return;
    }

    if (!password.value.trim()) {
        e.preventDefault();
        alert("Please enter your password.");
        password.focus();
        return;
    }

    if (password.value.length < 8) {
        e.preventDefault();
        alert("Password must be at least 8 characters.");
        password.focus();
    }
});