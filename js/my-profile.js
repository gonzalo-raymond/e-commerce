const userName = document.querySelector("#nameInput"),
      userLastName = document.querySelector("#lastNameInput"),
      userEmail = document.querySelector("#emailInput"),
      userImg = document.querySelector("#userImg");


document.addEventListener("DOMContentLoaded", () => {

    //Condicional que evalua si el usuario no esta logeado y
    //redirecciona a login.html
    if(loginStatusInfo === "false" || loginStatusInfo === null){
        replace("login.html");
    }else{
        showProfileMenu();
        logOutEvent();
    }

    if(userDataG !== null){
        userName.value = userDataG.firstName;
        userLastName.value = userDataG.lastName;
        userEmail.value = userDataG.email;
        userImg.src = userDataG.profileImg;
    }else if(userEmailInfo !== null){
        userEmail.value = userEmailInfo;
    }

});