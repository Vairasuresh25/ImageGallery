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
document.querySelector(".welcome h2 span").textContent = `${user.name}`;
document.querySelector(".top .mail").textContent = user.email;
document.querySelector(".profile .initial").textContent = getFirstLetter(user.name);
function getFirstLetter(name){
    return name[0].toUpperCase();
}
let upload = document.querySelector(".profile .upload");
upload.addEventListener("click", ()=>{
    document.querySelector(".upload-form").style.display = "block";
    document.querySelector("header").style.filter = "blur(10px)";
    document.querySelector("main").style.filter = "blur(10px)";
    document.querySelector("footer").style.filter = "blur(10px)";
});
let cancel = document.querySelector(".cancel");
cancel.addEventListener("click", ()=>{
    document.querySelector(".upload-form").style.display = "none";
    document.querySelector("header").style.filter = "none";
    document.querySelector("main").style.filter = "none";
    document.querySelector("footer").style.filter = "none";
});
let uploadImage = document.querySelector(".image-upload");
const WORKER_URL = "https://image-gallery-api.vairasuresh25t.workers.dev/";
uploadImage.addEventListener("click", async ()=>{
    let imageSrc = document.querySelector(".file input");
    let file = imageSrc.files[0];
    let imageName = document.querySelector(".image-name input");
    let imageCategory = document.querySelector(".category-list select");
    if (imageSrc.value === ""){
        alert("Please select the image!");
        return;
    }
    if (imageName.value === ""){
        alert("Please enter the name!");
        return;
    }
    if (imageCategory.value === ""){
        alert("Please select the catagory!");
        return;
    }
    let image = {
        src : file.name,
        name : imageName.value,
        category : imageCategory.value,
        favorite : false
    };
    try {
        const base64 = await fileToBase64(file);
        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "uploadImage",
                email: user.email,
                fileName: image.src,
                contentBase64: base64
            })
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(
                result.details ||
                result.error ||
                "Could not upload the image."
            );
        }
        allImages.unshift(image);
        localStorage.setItem(user.email,JSON.stringify(allImages));
        imageSrc.value = "";
        imageName.value = "";
        imageCategory.value = "";
        document.querySelector(".upload-form").style.display = "none";
        document.querySelector("header").style.filter = "none";
        document.querySelector("main").style.filter = "none";
        document.querySelector("footer").style.filter = "none";
        showImages(allImages);
    } catch (error) {
        console.error("Image upload failed:", error);
        alert("Upload failed: " + error.message);
    }
});
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const base64 = reader.result.split(",")[1];
            resolve(base64);
        };

        reader.onerror = () => reject(reader.error);

        reader.readAsDataURL(file);
    });
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
            let imageUrl = `https://vairasuresh25.github.io/ImageGallery/users/${encodeURIComponent(user.email)}/${encodeURIComponent(images[i].src)}`;
            imageBox.style.backgroundImage = `url("${imageUrl}")`;
            imageBox.addEventListener("mouseover", ()=>{
                btnDiv.style.opacity = "1";
            });
            imageBox.addEventListener("mouseleave", ()=>{
                btnDiv.style.opacity = "0";
            });
            imageBox.addEventListener("click",(event)=>{
                if (event.target.classList.contains("preview-btn")){
                    document.addEventListener("keydown",keyEvent);
                    let displayImgName = event.currentTarget.querySelector(".display-name").textContent;
                    index = images.findIndex((image)=>image.name == displayImgName);
                    document.querySelector(".preview-box").style.display = "block";
                    previewImgName.textContent = images[i].name;
                    let previewUrl = `https://vairasuresh25.github.io/ImageGallery/users/${encodeURIComponent(user.email)}/${encodeURIComponent(images[index].src)}`;
                    document.querySelector(".preview-img").style.backgroundImage = `url("${previewUrl}")`;
                }
                if (event.target.classList.contains("light-box-btn")){
                    document.addEventListener("keydown",lightKeyEvent);
                    let displayImgName = event.currentTarget.querySelector(".display-name").textContent;
                    index = images.findIndex((image)=>image.name == displayImgName);
                    document.querySelector(".light-box-box").style.display = "block";
                    lightImgName.textContent = images[i].name;
                    let lightUrl = `https://vairasuresh25.github.io/ImageGallery/users/${encodeURIComponent(user.email)}/${encodeURIComponent(images[index].src)}`;
                    document.querySelector(".light-img").style.backgroundImage = `url("${lightUrl}")`;
                    let bottomBox = document.querySelector(".bottom-box");
                    bottomBox.innerHTML = "";
                    for (let i = 0; i < images.length; i++){
                        let smallBox = document.createElement("div");
                        smallBox.classList.add("small-box");
                        let smallUrl = `https://vairasuresh25.github.io/ImageGallery/users/${encodeURIComponent(user.email)}/${encodeURIComponent(images[i].src)}`;
                        smallBox.style.backgroundImage = `url("${smallUrl}")`;
                        bottomBox.append(smallBox);
                    }
                }
                if (event.target.closest(".edit-btn")){
                    document.querySelector(".filter").style.display = "block";
                    document.querySelector("header").style.display = "none";
                    document.querySelector("main").style.display = "none";
                    document.querySelector("footer").style.display = "none";
                    document.querySelector(".filter-img-name").textContent = images[i].name;
                    document.querySelector(".filter-box").style.backgroundImage = `url("${imageUrl}")`;
                    let filtersBox = document.querySelectorAll(".filters div");
                    for (let box of filtersBox){
                        box.style.backgroundImage = `url("${imageUrl}")`;
                        box.addEventListener("click",()=>{
                            for (let bor of filtersBox){
                                bor.style.border = "none";
                            }
                            box.style.border = "2px solid #50d2f7";
                            if (box.classList.contains("filter1")){
                                document.querySelector(".filter-box").style.filter = "blur(2px)";
                            }
                            if (box.classList.contains("filter2")){
                                document.querySelector(".filter-box").style.filter = "grayscale(80%)";
                            }
                            if (box.classList.contains("filter3")){
                                document.querySelector(".filter-box").style.filter = "contrast(200%)";
                            }
                            if (box.classList.contains("filter4")){
                                document.querySelector(".filter-box").style.filter = "invert(75%)";
                            }
                            if (box.classList.contains("filter5")){
                                document.querySelector(".filter-box").style.filter = "saturate(30%)";
                            }
                        });
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
            let edit = document.createElement("button");
            edit.innerHTML = "<i class='fa-solid fa-sliders'></i>";
            edit.classList.add("edit-btn");
            imageBox.append(edit);
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
document.querySelector(".save").addEventListener("click",async ()=>{
    let originalImage = allImages.find(image => image.name === document.querySelector(".filter-img-name").textContent);
    try {
        let imageUrl = `https://vairasuresh25.github.io/ImageGallery/users/${encodeURIComponent(user.email)}/${encodeURIComponent(originalImage.src)}`;
        let img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error("Could not load the original image."));
            img.src = imageUrl;
        });
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.filter = document.querySelector(".filter-box").style.filter;
        ctx.drawImage(img, 0, 0);
        const blob = await new Promise((resolve, reject) => {
            canvas.toBlob(result => {
                if (result) {
                    resolve(result);
                } else {
                    reject(new Error("Could not create filtered image."));
                }
            }, "image/jpeg", 0.95);
        });
        const file = new File(
            [blob],
            `filtered-${originalImage.src}`,
            { type: "image/jpeg" }
        );
        const base64 = await fileToBase64(file);
        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "uploadImage",
                email: user.email,
                fileName: file.name,
                contentBase64: base64
            })
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(
                result.details ||
                result.error ||
                "Could not upload the filtered image."
            );
        }
        let image = {
            src : file.name,
            name : originalImage.name + " Filter",
            category : originalImage.category,
            favorite : false
        };
        allImages.unshift(image);
        localStorage.setItem(user.email,JSON.stringify(allImages));
        showImages(allImages);
        document.querySelector(".filter").style.display = "none";
        document.querySelector("header").style.display = "flex";
        document.querySelector("main").style.display = "block";
        document.querySelector("footer").style.display = "block";
        document.querySelector(".filter-box").style.filter = "none";
    } catch (error) {
        console.error("Image upload failed:", error);
        alert("Upload failed: " + error.message);
    }
});
document.querySelector(".cancel-filter").addEventListener("click",()=>{
    let filtersBox = document.querySelectorAll(".filters div");
    for (let box of filtersBox){
        for (let box of filtersBox){
            box.style.border = "none";
        }
    }
    document.querySelector(".filter").style.display = "none";
    document.querySelector("header").style.display = "flex";
    document.querySelector("main").style.display = "block";
    document.querySelector("footer").style.display = "block";
    document.querySelector(".filter-box").style.filter = "none";
});
let previousBtn = document.querySelector(".previous");
previousBtn.addEventListener("click",previous);
function previous(){
    index = index - 1;
    if (index<0){
        index=current.length-1;
    }
    previewImgName.textContent = current[index].name;
    document.querySelector(".preview-img").style.backgroundImage = `url("https://vairasuresh25.github.io/ImageGallery/users/${encodeURIComponent(user.email)}/${encodeURIComponent(current[index].src)}")`;
}
let nextBtn = document.querySelector(".next");
nextBtn.addEventListener("click",next);
function next(){
    index=index+1;
    if (index>=current.length){
        index=current.length%index;
    }
    previewImgName.textContent = current[index].name;
    document.querySelector(".preview-img").style.backgroundImage = `url("https://vairasuresh25.github.io/ImageGallery/users/${encodeURIComponent(user.email)}/${encodeURIComponent(current[index].src)}")`;
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
let smallImg = document.querySelectorAll(".small-box");
let lightPreviousBtn = document.querySelector(".light-previous");
lightPreviousBtn.addEventListener("click",lightPrevious);
function lightPrevious(){
    index = index - 1;
    if (index<0){
        index=current.length-1;
    }
    lightImgName.textContent = current[index].name;
    document.querySelector(".light-img").style.backgroundImage = `url("https://vairasuresh25.github.io/ImageGallery/users/${encodeURIComponent(user.email)}/${encodeURIComponent(current[index].src)}")`;
}
let lightNextBtn = document.querySelector(".light-next");
lightNextBtn.addEventListener("click",lightNext);
function lightNext(){
    index=index+1;
    if (index>=current.length){
        index=current.length%index;
    }
    lightImgName.textContent = current[index].name;
    document.querySelector(".light-img").style.backgroundImage = `url("https://vairasuresh25.github.io/ImageGallery/users/${encodeURIComponent(user.email)}/${encodeURIComponent(current[index].src)}")`;
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
    let familyImages=allImages.filter((image)=>image.category == "family");
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
    let friendsImages=allImages.filter((image)=>image.category == "friends");
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
    let natureImages=allImages.filter((image)=>image.category == "nature");
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
    let animalsImages=allImages.filter((image)=>image.category == "animals");
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
    let birdsImages=allImages.filter((image)=>image.category == "birds");
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
    let travelImages=allImages.filter((image)=>image.category == "travel");
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
    let foodImages=allImages.filter((image)=>image.category == "food");
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
    let technologyImages=allImages.filter((image)=>image.category == "technology");
    if (search.value === ""){
        showImages(technologyImages);
        current = technologyImages;
    }else{
        current = technologyImages;
        searchEvent();
    }
});
let filters = document.querySelector(".filters-option");
filters.addEventListener("click",()=>{
    let filterImages=allImages.filter((image)=>image.category == "filters");
    if (search.value === ""){
        showImages(filterImages);
        current = filterImages;
    }else{
        current = filterImages;
        searchEvent();
    }
});
let other = document.querySelector(".other");
other.addEventListener("click",()=>{
    let otherImages=allImages.filter((image)=>image.category == "other");
    if (search.value === ""){
        showImages(otherImages);
        current = otherImages;
    }else{
        current = otherImages;
        searchEvent();
    }
});
function searchEvent(){
    let matches = current.filter((image)=>image.name.toLowerCase().includes(search.value.toLowerCase()));
    showImages(matches);
}
showImages(allImages);
