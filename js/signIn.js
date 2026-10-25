if (localStorage.getItem("sign") == "true"){
    window.location.href = "main.html";
}
let users = JSON.parse(localStorage.getItem("users"));
let emails = JSON.parse(localStorage.getItem("emails"));
let emailId = document.querySelector(".email input");
let passwordId = document.querySelector(".password input");
let sign = document.querySelector(".form .sign");
let user = {};
sign.addEventListener("click", ()=>{
    if (emailId.value == "" || passwordId.value == ""){
        if (emailId.value == ""){
            document.querySelector(".email .error").style.opacity = "1";
        }else{
            document.querySelector(".email .error").style.opacity = "0";
        }
        if (passwordId.value == ""){
            document.querySelector(".password .error").style.opacity = "1";
        }else{
            document.querySelector(".password .error").style.opacity = "0";
        }
        return;
    }else{
        document.querySelector(".email .error").style.opacity = "0";
        document.querySelector(".password .error").style.opacity = "0";
    }
    let user = users.find((user) => user.email === emailId.value.toLowerCase());
    if (!user || user.password !== encrypt(passwordId.value)) {
        document.querySelector(".invalid-error").style.opacity = "1";
        return;
    }else{
        document.querySelector(".invalid-error").style.opacity = "0";
    }
    localStorage.setItem("sign","true");
    localStorage.setItem("user",JSON.stringify(user));
    window.location.href = "main.html";
});
function encrypt(password){
    let result = "";
    let key = 5;
    for (let i = 0; i < password.length; i++){
        result += String.fromCharCode(password.charCodeAt(i) ^ key);
    }
    return result;
}