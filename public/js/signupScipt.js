const form = document.querySelector("form");

const fullName = document.querySelector("#fullname");
const email = document.querySelector("#email");
const age = document.querySelector("#age");
const password = document.querySelector("#password");
const gender = document.querySelectorAll("input[name='gender']");


const { success = false, message = null } = JSON.parse(window.pageData);

if (message) {
    alert(message + (success ? "\n\nRedirecting to Login Page..." : ""));
    if (success) {
        setTimeout(() => {
            window.location.href = "/auth/login";
        }, 1500);
    }
}

form.addEventListener("submit", (e) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/;

    if (fullName.value.trim().length < 3) {
        e.preventDefault();
        alert("Full name must be at least 3 characters.");
        fullName.focus();
        return;
    }

    if (!emailRegex.test(email.value.trim())) {
        e.preventDefault();
        alert("Please enter a valid email address.");
        email.focus();
        return;
    }

    if (+age.value < 18) {
        e.preventDefault();
        alert("Age must be 18 years or above.");
        age.focus();
        return;
    }

    const selectedGender = [...gender].some(g => g.checked);

    if (!selectedGender) {
        e.preventDefault();
        alert("Please select your gender.");
        return;
    }

    if (!passwordRegex.test(password.value)) {
        e.preventDefault();
        alert("Password must contain uppercase, lowercase, number, special character and be at least 8 characters.");
        password.focus();
    }
});