const form = document.querySelector("form");
const searchInput = document.querySelector('input[name="q"]');

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); 
        form.requestSubmit(); 
    }
});