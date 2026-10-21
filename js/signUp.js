localStorage.setItem("users", localStorage.getItem("users") || "[]");
localStorage.setItem("emails", localStorage.getItem("emails") || "[]");
let signIn = document.querySelector(".top-right button");
signIn.addEventListener("click", () => {
    window.location.href = "signIn.html";
});
let fullName = document.querySelector(".name input");
let email = document.querySelector(".email input");
let password = document.querySelector(".password input");
let confirmPassword = document.querySelector(".confirm input");
let sign = document.querySelector("form button");
sign.addEventListener("click", () => {
    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match!");
        return;
    }
    let emailValue = email.value.trim().toLowerCase();
    let emails = JSON.parse(localStorage.getItem("emails")) || [];
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (emails.includes(emailValue)) {
        alert("Email already exists!");
        return;
    }
    let user = {
        name: fullName.value.trim(),
        email: emailValue,
        password: encrypt(password.value)
    };
    emails.push(emailValue);
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("emails", JSON.stringify(emails));
    alert("Account created! Please sign in.");
    window.location.href = "signIn.html";
});

function encrypt(password) {
    let result = "";
    let key = 5;
    for (let i = 0; i < password.length; i++) {
        result += String.fromCharCode(password.charCodeAt(i) ^ key);
    }
    return result;
}
