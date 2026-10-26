localStorage.setItem("users", localStorage.getItem("users") || "[]");
localStorage.setItem("emails", localStorage.getItem("emails") || "[]");
let fullName = document.querySelector(".name input");
let email = document.querySelector(".email input");
let password = document.querySelector(".password input");
let confirmPassword = document.querySelector(".confirm input");
let sign = document.querySelector("form .sign");
sign.addEventListener("click", async () => {
    if (fullName.value == "" || email.value =="" || password.value == "" || confirmPassword.value == ""){
        if (fullName.value == ""){
            document.querySelector(".name .error").textContent = "Please enter the name";
        }else{
            document.querySelector(".name .error").textContent = "";
        }
        if (email.value == ""){
            document.querySelector(".email .error").textContent = "Please enter the email address";
        }else{
            document.querySelector(".email .error").textContent = "";
        }
        if (password.value == ""){
            document.querySelector(".password .error").textContent = "Please enter the password";
        }else{
            document.querySelector(".password .error").textContent = "";
        }
        if (confirmPassword.value == ""){
            document.querySelector(".confirm .error").textContent = "Please enter the confirm password";
        }else{
            document.querySelector(".confirm .error").textContent = "";
        }
        return;
    }else{
        document.querySelector(".name .error").textContent = "";
        document.querySelector(".email .error").textContent = "";
        document.querySelector(".password .error").textContent = "";
        document.querySelector(".confirm .error").textContent = "";
    }
    let reg=/^(?=.*[A-Z]+)(?=.*[a-z]+)(?=.*\d+)(?=.*[@_$]+).{8,}/;
    if (!reg.test(password.value)){
        document.querySelector(".password .error").textContent = "Please enter the strong password";
    }else{
        document.querySelector(".password .error").textContent = "";
    }
    if (password.value !== confirmPassword.value) {
        document.querySelector(".password .error").textContent = "Passwords do not match";
        document.querySelector(".confirm .error").textContent = "Passwords do not match";
        return;
    }else{
        document.querySelector(".password .error").textContent = "";
        document.querySelector(".confirm .error").textContent = "";
    }
    let emailValue = email.value.trim().toLowerCase();
    let emails = JSON.parse(localStorage.getItem("emails")) || [];
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (emails.includes(emailValue)) {
        document.querySelector(".email .error").textContent = "Email already exist";
        return;
    }else{
        document.querySelector(".email .error").textContent = "";
    }
    document.querySelector(".name .error").textContent = "";
    document.querySelector(".email .error").textContent = "";
    document.querySelector(".password .error").textContent = "";
    document.querySelector(".confirm .error").textContent = "";
    let user = {
        name: fullName.value.trim(),
        email: emailValue,
        password: encrypt(password.value)
    };
    try {
        const result = await createUserFolder(email.value);
        emails.push(emailValue);
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("emails", JSON.stringify(emails));
        localStorage.setItem("sign","true");
        window.location.href = "main.html";
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
