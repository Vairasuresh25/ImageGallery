if (localStorage.getItem("sign") == "false"){
    window.location.href = "signIn.html";
}
let user = JSON.parse(localStorage.getItem("user"));
let allImages = JSON.parse(localStorage.getItem(user.email) || "[]");
let favorites = allImages.filter(image => image.favorite);
localStorage.setItem(user.email, JSON.stringify(allImages));
localStorage.setItem(`${user.email}-favorites`,JSON.stringify(favorites));
let sign = document.querySelector(".profile .sign");
sign.addEventListener("click", ()=>{
    document.querySelector(".logout-confirm").style.top = "20px";
});
document.querySelector(".logout-confirm .logout").addEventListener("click",()=>{
    localStorage.setItem("sign","false");
    window.location.href = "signIn.html";
});
document.querySelector(".logout-confirm .logout-cancel").addEventListener("click",()=>{
    document.querySelector(".logout-confirm").style.top = "-200px";
});
document.querySelector(".home").addEventListener("click",()=>{
    window.location.href = "main.html";
});
document.querySelector(".my-gallery").addEventListener("click",()=>{
    window.location.href = "myGallery.html";
});
document.querySelector(".favorite").addEventListener("click",()=>{
    window.location.href = "favorites.html";
});
document.querySelector(".my-profile").addEventListener("click",()=>{
    window.location.href = "myProfile.html";
});
document.querySelector(".profile .user-name").textContent = user.name;
document.querySelector(".welcome h2").textContent = `${user.name}`;
document.querySelector(".top .mail").textContent = user.email;
document.querySelector(".profile button").textContent = getFirstLetter(user.name);
function getFirstLetter(name){
    return name[0].toUpperCase();
}
document.querySelector(".photos span").textContent = `${allImages.length}`;
document.querySelector(".favorite span").textContent = `${favorites.length}`;
document.querySelector(".personal .name input").value = `${user.name}`;
document.querySelector(".personal .email input").value = `${user.email}`;