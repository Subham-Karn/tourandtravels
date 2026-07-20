document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.querySelector('input[name="packageImage"]');
    if (fileInput) {
        fileInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const existingImg = document.querySelector('.form-group.full img');
                    if (existingImg) {
                        existingImg.src = e.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
});