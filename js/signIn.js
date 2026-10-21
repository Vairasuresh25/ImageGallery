let users = JSON.parse(localStorage.getItem("users"));
let emails = JSON.parse(localStorage.getItem("emails"));
let signUp = document.querySelector(".top-right button");
signUp.addEventListener("click", ()=>{
    window.location.href = "signUp.html";
});
let emailId = document.querySelector(".email input");
let passwordId = document.querySelector(".password input");
let sign = document.querySelector(".form button");
let user = {};
sign.addEventListener("click", ()=>{
    if (!emails.includes(emailId.value)){
        alert("Email does not exist!");
        return;
    }
    let user = users.find((user) => user.email === emailId.value);

    if (!user || user.password !== encrypt(passwordId.value)) {
        alert("Invalid email or password!");
        return;
    }
    localStorage.setItem("sign","true");
    localStorage.setItem("user",JSON.stringify(user));
    window.location.href = "../index.html";
});
function encrypt(password){
    let result = "";
    let key = 5;
    for (let i = 0; i < password.length; i++){
        result += String.fromCharCode(password.charCodeAt(i) ^ key);
    }
    return result;
}
