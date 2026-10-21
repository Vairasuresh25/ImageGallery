let user = JSON.parse(localStorage.getItem("user"));
let allImages = JSON.parse(localStorage.getItem(user.email) || "[]");
let favorites = allImages.filter(image => image.favorite);
localStorage.setItem(user.email, JSON.stringify(allImages));
localStorage.setItem(`${user.email}-favorites`,JSON.stringify(favorites));
let sign = document.querySelector(".profile .sign");
sign.addEventListener("click", ()=>{
    localStorage.setItem("sign","false");
    window.location.href = "html/signIn.html";
});
document.querySelector(".profile .user-name").textContent = user.name;
document.querySelector(".profile button").textContent = getFirstLetter(user.name);
function getFirstLetter(name){
    return name[0].toUpperCase();
}
let imageDiv = document.querySelector(".images div");
function saveImages() {
    localStorage.setItem(user.email, JSON.stringify(allImages));
    favorites = allImages.filter(image => image.favorite);
    localStorage.setItem(`${user.email}-favorites`,JSON.stringify(favorites));
}
let previewImgName = document.querySelector(".preview-img-name p");
let lightImgName = document.querySelector(".light-img-name p");
let index = 0;
function showImages(images){
    if (images.length > 0){
        imageDiv.innerHTML = "";
        for (let i = 0; i < images.length; i++){
            let imageBox = document.createElement("div");
            imageBox.classList.add("img");
            imageBox.style.backgroundImage = `url(../users/${user.email}/${images[i].src})`;
            imageBox.addEventListener("mouseover", ()=>{
                btnDiv.style.display = "flex";
            });
            imageBox.addEventListener("mouseleave", ()=>{
                btnDiv.style.display = "none";
            });
            imageBox.addEventListener("click",(event)=>{
                if (event.target.classList.contains("preview-btn")) {
                    document.addEventListener("keydown",keyEvent);
                    let displayImgName = event.currentTarget.querySelector(".display-name").textContent;
                    index = images.findIndex((image)=>image.name == displayImgName);
                    document.querySelector(".preview-box").style.display = "block";
                    previewImgName.textContent = images[i].name;
                    document.querySelector(".preview-img").style.backgroundImage = `url(../users/${user.email}/${images[index].src})`;
                }
                if (event.target.classList.contains("light-box-btn")){
                    document.addEventListener("keydown",lightKeyEvent);
                    let displayImgName = event.currentTarget.querySelector(".display-name").textContent;
                    index = images.findIndex((image)=>image.name == displayImgName);
                    document.querySelector(".light-box-box").style.display = "block";
                    lightImgName.textContent = images[i].name;
                    document.querySelector(".light-img").style.backgroundImage = `url(../users/${user.email}/${images[index].src})`;
                    let bottomBox = document.querySelector(".bottom-box");
                    bottomBox.innerHTML = "";
                    for (let i = 0; i < images.length; i++){
                        let smallBox = document.createElement("div");
                        smallBox.classList.add("small-box");
                        smallBox.style.backgroundImage = `url(../users/${user.email}/${images[i].src})`;
                        bottomBox.append(smallBox);
                    }
                }
            });
            let fav = document.createElement("button");
            fav.innerHTML = "<i class='fa-solid fa-heart'></i>";
            fav.classList.add("fav-btn");
            fav.classList.toggle("fav", images[i].favorite);
            fav.addEventListener("click", ()=>{
                images[i].favorite = !images[i].favorite;
                fav.classList.toggle("fav", images[i].favorite);
                saveImages();
            });
            imageBox.append(fav);
            let btnDiv = document.createElement("div");
            btnDiv.classList.add("btn-div");
            let previewBtn = document.createElement("button");
            previewBtn.classList.add("preview-btn");
            previewBtn.textContent = "Preview";
            btnDiv.append(previewBtn);
            let lightBoxBtn = document.createElement("button");
            lightBoxBtn.classList.add("light-box-btn");
            lightBoxBtn.textContent = "Light Box";
            btnDiv.append(lightBoxBtn);
            imageBox.append(btnDiv);
            let displayNameDiv = document.createElement("div");
            displayNameDiv.classList.add("display-name-div");
            let displayName = document.createElement("p");
            displayName.classList.add("display-name");
            displayName.textContent = images[i].name;
            displayNameDiv.append(displayName);
            imageBox.append(displayNameDiv);
            imageDiv.append(imageBox);
        }
        localStorage.setItem(user.email,JSON.stringify(allImages));
        localStorage.setItem(`${user.email}-favorites`,JSON.stringify(favorites));
    }else{
        imageDiv.innerHTML = "";
        let empty = document.createElement("p");
        empty.classList.add("empty-msg");
        empty.textContent = "Image Not Found";
        imageDiv.append(empty);
    }
}
let previousBtn = document.querySelector(".previous");
previousBtn.addEventListener("click",previous);
function previous(){
    index = index - 1;
    if (index<0){
        index=current.length-1;
    }
    previewImgName.textContent = current[index].name;
    document.querySelector(".preview-img").style.backgroundImage = `url(../users/${user.email}/${current[index].src})`;
}
let nextBtn = document.querySelector(".next");
nextBtn.addEventListener("click",next);
function next(){
    index=index+1;
    if (index>=current.length){
        index=current.length%index;
    }
    previewImgName.textContent = current[index].name;
    document.querySelector(".preview-img").style.backgroundImage = `url(../users/${user.email}/${current[index].src})`;
}
let closeBtn = document.querySelector(".close");
closeBtn.addEventListener("click",()=>{
    document.querySelector(".preview-box").style.display = "none";
    document.removeEventListener("keydown",keyEvent);
});
function keyEvent(event){
    if (event.code == "ArrowLeft"){
        previous();
    }
    if (event.code == "ArrowRight"){
        next();
    }
}
let lightPreviousBtn = document.querySelector(".light-previous");
lightPreviousBtn.addEventListener("click",lightPrevious);
function lightPrevious(){
    index = index - 1;
    if (index<0){
        index=current.length-1;
    }
    lightImgName.textContent = current[index].name;
    document.querySelector(".light-img").style.backgroundImage = `url(../users/${user.email}/${current[index].src})`;
}
let lightNextBtn = document.querySelector(".light-next");
lightNextBtn.addEventListener("click",lightNext);
function lightNext(){
    index=index+1;
    if (index>=current.length){
        index=current.length%index;
    }
    lightImgName.textContent = current[index].name;
    document.querySelector(".light-img").style.backgroundImage = `url(../users/${user.email}/${current[index].src})`;
}
let lightCloseBtn = document.querySelector(".light-close");
lightCloseBtn.addEventListener("click",()=>{
    document.querySelector(".light-box-box").style.display = "none";
    document.removeEventListener("keydown",lightKeyEvent);
});
function lightKeyEvent(event){
    if (event.code == "ArrowLeft"){
        lightPrevious();
    }
    if (event.code == "ArrowRight"){
        lightNext();
    }
}
let current = allImages;
let search = document.querySelector(".search input");
search.addEventListener("input",searchEvent);
let all = document.querySelector(".all");
all.addEventListener("click",()=>{
    if (search.value === ""){
        showImages(allImages);
        current = allImages;
    }else{
        current = allImages;
        searchEvent();
    }
});
let family = document.querySelector(".family");
family.addEventListener("click",()=>{
    let familyImages=images.filter((image)=>image.category == "family");
    if (search.value === ""){
        showImages(familyImages);
        current = familyImages;
    }else{
        current = familyImages;
        searchEvent();
    }
});
let friends = document.querySelector(".friends");
friends.addEventListener("click",()=>{
    let friendsImages=images.filter((image)=>image.category == "friends");
    if (search.value === ""){
        showImages(friendsImages);
        current = friendsImages;
    }else{
        current = friendsImages;
        searchEvent();
    }
});
let nature = document.querySelector(".nature");
nature.addEventListener("click",()=>{
    let natureImages=images.filter((image)=>image.category == "nature");
    if (search.value === ""){
        showImages(natureImages);
        current = natureImages;
    }else{
        current = natureImages;
        searchEvent();
    }
});
let animals = document.querySelector(".animals");
animals.addEventListener("click",()=>{
    let animalsImages=images.filter((image)=>image.category == "animals");
    if (search.value === ""){
        showImages(animalsImages);
        current = animalsImages;
    }else{
        current = animalsImages;
        searchEvent();
    }
});
let birds = document.querySelector(".birds");
birds.addEventListener("click",()=>{
    let birdsImages=images.filter((image)=>image.category == "birds");
    if (search.value === ""){
        showImages(birdsImages);
        current = birdsImages;
    }else{
        current = birdsImages;
        searchEvent();
    }
});
let travel = document.querySelector(".travel");
travel.addEventListener("click",()=>{
    let travelImages=images.filter((image)=>image.category == "travel");
    if (search.value === ""){
        showImages(travelImages);
        current = travelImages;
    }else{
        current = travelImages;
        searchEvent();
    }
});
let food = document.querySelector(".food");
food.addEventListener("click",()=>{
    let foodImages=images.filter((image)=>image.category == "food");
    if (search.value === ""){
        showImages(foodImages);
        current = foodImages;
    }else{
        current = foodImages;
        searchEvent();
    }
});
let technology = document.querySelector(".technology");
technology.addEventListener("click",()=>{
    let technologyImages=images.filter((image)=>image.category == "technology");
    if (search.value === ""){
        showImages(technologyImages);
        current = technologyImages;
    }else{
        current = technologyImages;
        searchEvent();
    }
});
function searchEvent(){
    let matches = current.filter((image)=>image.name.toLowerCase().includes(search.value.toLowerCase()));
    showImages(matches);
}
showImages(allImages);
