const from = document.querySelector('form');

const email = document.querySelector('input[name="email"]');

const {success , message} = JSON.parse(window.pageData);

if(message){
    alert(message + (success ? "\n\nRedirecting to Login Page..." : ""));
    if(success){
        setTimeout(()=>{
            window.location.href = "/auth/login";
        } , 1500)
    }
}

from.addEventListener("submit" , (e)=>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.value.trim())) {
        e.preventDefault();
        alert("Please enter a valid email address.");
        email.focus();
        return;
    }
})