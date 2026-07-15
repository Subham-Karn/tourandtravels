const from = document.querySelector('form');

const password = document.querySelector('input[name="password"]');
const confirmPassword = document.querySelector('input[name="confirmPassword"]');

const {success , message} = JSON.parse(window.pageData);


if(message){
    alert(message + (success ? "\n\nRedirecting to Profile Page..." : ""));
    if(success){
        setTimeout(()=>{
            window.location.href = "/profile";
        } , 1500)
    }
}

from.addEventListener("submit" , (e)=>{
        const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/;

        if (!passwordRegex.test(password.value)) {
        e.preventDefault();
        alert("Password must contain uppercase, lowercase, number, special character and be at least 8 characters.");
        password.focus();
      }

      if(!password.value === confirmPassword.value){
        e.preventDefault();
        alert("Confirm password must be same as password.");
        confirmPassword.focus();
        return;
      }
  
})