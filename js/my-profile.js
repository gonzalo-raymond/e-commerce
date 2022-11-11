const userNameInput = document.querySelector("#nameInput"),
      userSecondNameInput = document.querySelector("#secondNameInput"),
      userLastNameInput = document.querySelector("#lastNameInput"),
      userSecondLastNameInput = document.querySelector("#secondLastNameInput"),
      userEmailInput = document.querySelector("#emailInput"),
      userContactNumberInput = document.querySelector("#contactNumberInput"),
      userImg = document.querySelector("#userImg"),
      saveBtn = document.querySelector("#saveBtn"),
      discardBtn = document.querySelector("#discardBtn"),
      uploadImgBtn = document.querySelector("#uploadImgBtn"),
      uploadImgInput = document.querySelector("#uploadProfileImg"),
      deleteProfileImgBtn = document.querySelector("#deleteImg"),
      triggerEnterTargets = document.querySelectorAll(".trigger-enter");



let sameName = true,
    sameSecondName = true,
    sameLastName = true,
    sameSecondLastName = true,
    sameEmail = true,
    sameContactNumber = true;

for(let target of triggerEnterTargets){

    target.addEventListener("keypress", (e) => {

        if(e.key === "Enter"){

            if(saveBtn.disabled === false){
                target.blur();
            }

            saveBtn.click();
            
        }

    });

};

function showAlertSuccess() {
    document.getElementById("alert-success").classList.remove("alert-hide");
    document.getElementById("alert-success").classList.add("show");
    setTimeout(()=>{
        document.getElementById("alert-success").classList.remove("show"); 
    }, 2500);

    setTimeout(()=>{
        document.getElementById("alert-success").classList.add("alert-hide"); 
    }, 3000);

};


uploadImgBtn.addEventListener("click", () => {

    uploadImgInput.click();

    setTimeout(()=>{
        uploadImgBtn.blur();
    }, 200);

});

uploadImgInput.addEventListener("change", () => {

    const fileTypes = [
        "image/apng",
        "image/bmp",
        "image/gif",
        "image/jpeg",
        "image/pjpeg",
        "image/png",
        "image/svg+xml",
        "image/tiff",
        "image/webp",
        "image/x-icon"
    ];

    function validFileType(file) {
        return fileTypes.includes(file.type);
    }

    if(validFileType(uploadImgInput.files[0])){

        uploadImgInput.classList.remove("is-invalid");

        const fr = new FileReader();

        fr.readAsDataURL(uploadImgInput.files[0]);

        fr.addEventListener("load", () => {

            const profileImgUrl = fr.result;
        
            if(userData !== null){

                userData.profileImg = profileImgUrl;

                window.localStorage.setItem(`userData${userDataId}`, JSON.stringify(userData));

                location.reload();

            }

        });
        
    }else{
       
        uploadImgInput.classList.add("is-invalid");

    }

    

});

deleteProfileImgBtn.addEventListener("click", () => {

    if(userData !== null && userData.profileImg !== "img/img_perfil.png"){

        userData.profileImg = "img/img_perfil.png";

        window.localStorage.setItem(`userData${userDataId}`, JSON.stringify(userData));

        location.reload();

    }

    setTimeout(()=>{
        deleteProfileImgBtn.blur();
    }, 200);

});

discardBtn.addEventListener("click", () => {

    location.reload();

});

userNameInput.addEventListener("input", () => {

    if(userData !== null){

        if(userNameInput.value === ""){
            userNameInput.classList.add("is-invalid");
        }else{
            userNameInput.classList.remove("is-invalid"); 
        }

        if(userData.firstName === userNameInput.value){
            sameName = true;
        }else{
            sameName = false;
        }
       
    }

    existChanges();

});

userSecondNameInput.addEventListener("input", () => {

    if(userData !== null){

        if(userData.secondName === userSecondNameInput.value){
            sameSecondName = true;
        }else{
            sameSecondName = false;
        }

    }

    existChanges();

});

userLastNameInput.addEventListener("input", () => {

    if(userData !== null){

        if(userLastNameInput.value === ""){
            userLastNameInput.classList.add("is-invalid");
        }else{
            userLastNameInput.classList.remove("is-invalid"); 
        }
    
        if(userData.lastName === userLastNameInput.value){
            sameLastName = true;
        }else{
            sameLastName = false;
        }
    
    }

    existChanges();

});

userSecondLastNameInput.addEventListener("input", () => {

    if(userData !== null){

        if(userData.secondLastName === userSecondLastNameInput.value){
            sameSecondLastName = true;
        }else{
            sameSecondLastName = false;
        }

    }

    existChanges();

});

userEmailInput.addEventListener("input", () => {

    if(userData !== null){

        if(userEmailInput.value === ""){
            userEmailInput.classList.add("is-invalid");
        }else{
            userEmailInput.classList.remove("is-invalid");  
        }
        
        if(userData.email === userEmailInput.value){
            sameEmail = true;
        }else{
            sameEmail = false;
        }

    }

    existChanges();

});

userContactNumberInput.addEventListener("input", () => {

    if(userData !== null){

        if(userData.contactTelephoneNumber === userContactNumberInput.value){
            sameContactNumber = true;
        }else{
            sameContactNumber = false;
        }

    }

    existChanges();

});

const validateRequiredFields = () => {

    if(userData != null){

        if(userData.firstName === "" && userData.lastName === ""){

            userNameInput.classList.add("is-invalid");
            userLastNameInput.classList.add("is-invalid");
            
        }else if(userData.firstName === ""){

            userNameInput.classList.add("is-invalid");
            userLastNameInput.classList.remove("is-invalid");
                
        }else if(userData.lastName === ""){

            userNameInput.classList.remove("is-invalid");
            userLastNameInput.classList.add("is-invalid");
              
        }else{

            userNameInput.classList.remove("is-invalid");
            userLastNameInput.classList.remove("is-invalid");

        }

    }

};

const existChanges = () => {

    if(sameName && 
        sameSecondName && 
        sameLastName && 
        sameSecondLastName && 
        sameEmail && 
        sameContactNumber ||
        userNameInput.value === "" ||
        userLastNameInput.value === "" ||
        userEmailInput.value === ""){
     
        saveBtn.disabled = true;
        
        if(userNameInput.value === "" ||
           userLastNameInput.value === "" ||
           userEmailInput.value === ""){

            discardBtn.disabled = false;

        }else{
            discardBtn.disabled = true;
        }
     
    }else{
     
        saveBtn.disabled = false;
        discardBtn.disabled = false;
     
    }

};


saveBtn.addEventListener("click", () => {

    if(userData !== null){

        let userNameValue = userNameInput.value;
        let userSecondNameValue = userSecondNameInput.value;
        let userLastNameValue = userLastNameInput.value;
        let userSecondLastNameValue = userSecondLastNameInput.value;
        let userEmailValue = userEmailInput.value;
        let userContactNumberValue = userContactNumberInput.value;

        if(userNameValue && userData.firstName !== userNameValue){

            userData.firstName = userNameValue;
            window.localStorage.setItem(`userData${userDataId}`, JSON.stringify(userData));
            
        }

        if(userData.secondName !== userSecondNameValue){
            userData.secondName = userSecondNameValue;
            window.localStorage.setItem(`userData${userDataId}`, JSON.stringify(userData));
        }

        if(userLastNameValue && userData.lastName !== userLastNameValue){
            
            userData.lastName = userLastNameValue;
            window.localStorage.setItem(`userData${userDataId}`, JSON.stringify(userData));
             
        }

        if(userData.secondLastName !== userSecondLastNameValue){
            userData.secondLastName = userSecondLastNameValue;
            window.localStorage.setItem(`userData${userDataId}`, JSON.stringify(userData));
        }

        if(userEmailValue && userData.email !== userEmailValue){

            let purchaseOrder = JSON.parse(localStorage.getItem(`purchaseOrder${userDataId}`));

            let oldId = userDataId;

            userData.email = userEmailValue;
            userDataId = userEmailValue;

            window.localStorage.setItem(`userData${userDataId}`, JSON.stringify(userData));
            window.localStorage.setItem(`purchaseOrder${userDataId}`, JSON.stringify(purchaseOrder));

            window.localStorage.removeItem(`userData${oldId}`);
            window.localStorage.removeItem(`purchaseOrder${oldId}`);

            window.localStorage.setItem("loginStatus", false);
            location.reload();
 
        }

        if(userData.contactTelephoneNumber !== userContactNumberValue){

            userData.contactTelephoneNumber = userContactNumberValue;
            window.localStorage.setItem(`userData${userDataId}`, JSON.stringify(userData));

        }

        showAlertSuccess();
        saveBtn.disabled = true;
        discardBtn.disabled = true;

    }

   
});

document.addEventListener("DOMContentLoaded", () => {

    //Condicional que evalua si el usuario no esta logeado y
    //redirecciona a login.html
    if(loginStatusInfo === "false" || loginStatusInfo === null){
        replace("login.html");
    }else{
        showProfileMenu();
        logOutEvent();
    }

    if(userData !== null){
 
        userNameInput.value = userData.firstName;
        userSecondNameInput.value = userData.secondName;
        userLastNameInput.value = userData.lastName;
        userSecondLastNameInput.value = userData.secondLastName;
        userEmailInput.value = userData.email;
        userContactNumberInput.value = userData.contactTelephoneNumber;
        userImg.src = userData.profileImg;

        validateRequiredFields();

    }

});