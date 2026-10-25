localStorage.setItem("sign",localStorage.getItem("sign") || "false");
document.querySelector(".logo-sec p").addEventListener("click",()=>{
    window.location.href = "html/main.html";
});
document.querySelector(".signin").addEventListener("click",()=>{
    window.location.href = "html/signIn.html";
});
document.querySelector(".signup").addEventListener("click",()=>{
    window.location.href = "html/signUp.html";
});
document.querySelector(".explore").addEventListener("click",()=>{
    window.location.href = "html/main.html";
});