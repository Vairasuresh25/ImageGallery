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
sign.addEventListener("click", async () => {
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
    try {
        const result = await createUserFolder(email.value);
        console.log(result);
        alert("User folder created!");
        emails.push(emailValue);
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("emails", JSON.stringify(emails));
        alert("Account created! Please sign in.");
        window.location.href = "signIn.html";
    } catch (error) {
        console.error(error);
        alert(error.message);
        return;
    }
});

function encrypt(password) {
    let result = "";
    let key = 5;
    for (let i = 0; i < password.length; i++) {
        result += String.fromCharCode(password.charCodeAt(i) ^ key);
    }
    return result;
}
async function createUserFolder(email) {
    const response = await fetch(
        "https://image-gallery-api.vairasuresh25t.workers.dev/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        }
    );
    const result = await response.json();
    console.log("Worker response:", result);
    if (!response.ok) {
        console.error("Worker error:", result);
        console.error("GitHub status:", result.githubStatus);
        console.error("GitHub details:", result.details);
        throw new Error(
            `GitHub status: ${result.githubStatus || response.status}. ` +
            `${result.details || result.error || "Unknown error"}`
        );
    }
    return result;
}
