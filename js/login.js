//Referenciando los elementos del DOM.
const loginForm = document.getElementById("login__form");
const warningEmail = document.getElementById("warning__email");
const warningPass = document.getElementById("warning__pass");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("pass");
const loginBtn = document.getElementById("btnLogin");
const regBtn = document.getElementById("btnRegister");

regBtn.addEventListener("click", ()=>{

  setTimeout(()=>{
    regBtn.blur();
  }, 100);

  replace("register.html");

});


//Función que actua cuando un campo no es valido.
const validateFail = (input, msg) => {
  const inputContainer = input.parentElement;
  const warning = inputContainer.querySelector("div");
  warning.innerHTML = `<p>${msg}</p>`
  input.classList.add('is-invalid');
  //input.blur();
};

//Función que actua cuando un campo es valido.
const validateOk = (input) => {
  const inputContainer = input.parentElement;
  const warning = inputContainer.querySelector("div");
  warning.innerHTML = ``;
  input.classList.remove('is-invalid');
  input.blur();
};

//Función que valida el email
//haciendo uso de expresiones regulares.
const validateEmail = (email) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email);
}

//Función que se activa al hacer click
//en el boton de Ingresar y valida 
//los campos del formulario de login.
const loginSubmitEvent = (e) => {

  e.preventDefault();

  setTimeout(()=>{
    loginBtn.blur();
  }, 200);

  //Estados de Validación necesarios 
  //para permitir o denegar acceso a la pagina.
  let emailOk = false;
  let passOk = false;
  loginStatus(false);

  //Capturando los valores ingresados por el usuario.
  const emailValue = emailInput.value.trim();
  const passValue = passInput.value.trim();

  //Validando campo Email.
  if(!emailValue){
    validateFail(emailInput, "Ingresa tu e-mail");
    emailOk = false;
  }else if(!validateEmail(emailValue)){
    validateFail(emailInput, "El e-mail no es valido el formato debe ser <b>email@dominio.com</b>");
    emailOk = false;
  }else{
    validateOk(emailInput);
    emailOk = true;
  }

  //Validando campo Contraseña.
  if(!passValue){
    validateFail(passInput, "Ingresa tu contraseña");
    passOk = false;
  }else if(passValue.length < 6){
    validateFail(passInput, "La contraseña debe tener mínimo 6 caracteres");
    passOk = false;
  }else{
    validateOk(passInput);
    passOk = true;
  }
    
  //Codigo que evalua condiciones de acceso
  //y permite o deniega la entrada a la pagina.
  if (emailOk && passOk){
    loginStatus(true);

    let sameUserData = JSON.parse(window.localStorage.getItem(`userData${emailValue}`));

    if(sameUserData === null){

      let userData = {
        firstName: "",
        secondName: "",
        lastName: "",
        secondLastName: "",
        email: emailValue,
        contactTelephoneNumber: "",
        profileImg: "img/img_perfil.png"
      };
  
      window.localStorage.setItem(`userData${emailValue}`, JSON.stringify(userData));
    
    }

    let userDataEmail = JSON.parse(window.localStorage.getItem(`userData${emailValue}`)).email;
    window.localStorage.setItem("userDataEmail", userDataEmail);
 
    replace("index.html")
    
  }else{
    loginStatus(false);
    userDataClean();
  }
};

//Escuchando Evento de submit al cargar la pagina 
//que actua sobre el boton de Ingresar y activa la función de
//validación de datos.
window.addEventListener("load", () => {
  if(loginStatusInfo === "true"){
    replace("index.html");
  }

  loginForm.addEventListener("submit", loginSubmitEvent);
});

//Accediendo a la pagina mediante google login (Desafiate!)

//Función que decodifica el token recibido desde google.
function decodeJwtResponse (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

//Función que devuelve los datos de la cuenta de
// google del usuario. 
globalThis.handleCredentialResponse = async (response) => {
   
  //Decodificando datos.
  let responsePayload = decodeJwtResponse(response.credential);

  let sameUserData = JSON.parse(window.localStorage.getItem(`userData${responsePayload.email}`));

  if(sameUserData === null){

    let userData = {
      firstName: responsePayload.given_name,
      secondName: "",
      lastName: responsePayload.family_name,
      secondLastName: "",
      email: responsePayload.email,
      contactTelephoneNumber: "",
      profileImg: responsePayload.picture
    };
  
    //Almacenando los datos del usuario en localstorage.
    window.localStorage.setItem(`userData${responsePayload.email}`, JSON.stringify(userData));
  
  }

  let userDataEmail = JSON.parse(window.localStorage.getItem(`userData${responsePayload.email}`)).email;
  window.localStorage.setItem("userDataEmail", userDataEmail);

  //Cambiando Status del login y redireccionando a index.html.
  loginStatus(true);
  replace("index.html");
};