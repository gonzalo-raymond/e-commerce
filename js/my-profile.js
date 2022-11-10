const userNameInput = document.querySelector("#nameInput"),
      userSecondNameInput = document.querySelector("#secondNameInput"),
      userLastNameInput = document.querySelector("#lastNameInput"),
      userSecondLastNameInput = document.querySelector("#secondLastNameInput"),
      userEmailInput = document.querySelector("#emailInput"),
      userContactNumberInput = document.querySelector("#contactNumberInput"),
      userImg = document.querySelector("#userImg"),
      saveBtn = document.querySelector("#saveBtn"),
      discardBtn = document.querySelector("#discardBtn");

let sameName = true,
    sameSecondName = true,
    sameLastName = true,
    sameSecondLastName = true,
    sameEmail = true,
    sameContactNumber = true;

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

discardBtn.addEventListener("click", () => {

    location.reload();

});

userNameInput.addEventListener("input", () => {

    if(userData !== null){

        if(userNameInput.value === ""){
            userNameInput.classList.add("is-invalid");
            saveBtn.disabled = true;
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
            
            userData.firstName = userNameValue;
            window.localStorage.setItem(`userData${userDataId}`, JSON.stringify(userData));
            
        }

        if(userData.contactTelephoneNumber !== userContactNumberValue){

            userData.contactTelephoneNumber = userContactNumberValue;
            window.localStorage.setItem(`userData${userDataId}`, JSON.stringify(userData));

        }

        showAlertSuccess();
        saveBtn.disabled = true;

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

    existChanges();

});