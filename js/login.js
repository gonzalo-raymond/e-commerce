//Referenciando los elementos del DOM.
const loginForm = document.getElementById("login__form");
const warningEmail = document.getElementById("warning__email");
const warningPass = document.getElementById("warning__pass");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("pass");

//Función que actua cuando un campo no es valido.
const validateFail = (input, msg) => {
  const inputContainer = input.parentElement;
  const warning = inputContainer.querySelector("div");
  warning.innerHTML = `<p>${msg}</p>`
  input.classList.add('is-invalid');
};

//Función que actua cuando un campo es valido.
const validateOk = (input) => {
  const inputContainer = input.parentElement;
  const warning = inputContainer.querySelector("div");
  warning.innerHTML = "";
  input.classList.remove('is-invalid');
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

  //Estados de Validación necesarios 
  //para permitir o denegar acceso a la pagina.
  let emailOk = false;
  let passOk = false;
  let loginStatus = false;

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
  }else if(passValue.length < 8){
    validateFail(passInput, "La contraseña debe tener mínimo 8 caracteres");
    passOk = false;
  }else{
    validateOk(passInput);
    passOk = true;
  }
    
  //Codigo que evalua condiciones de acceso
  //y permite o deniega la entrada a la pagina.
  if (emailOk && passOk){
    loginStatus = true;
    window.localStorage.setItem("loginStatus", loginStatus);
    replace("index.html")
  }else{
    loginStatus = false;
    window.localStorage.setItem("loginStatus", loginStatus);
  }  
};

//Escuchando Evento de submit al cargar la pagina 
//que actua sobre el boton de Ingresar y activa la función de
//validación de datos.
window.addEventListener("load", () => {
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

  //Creando objeto que contiene los datos del usuario.
  let userData = {
    id: responsePayload.sub,
    fullName: responsePayload.name,
    firstName: responsePayload.given_name,
    lastName: responsePayload.family_name,
    email: responsePayload.email,
    emailVerified: responsePayload.email_verified,
    profileImg: responsePayload.picture
  };

  //Almacenando los datos del usuario en localstorage.
  window.localStorage.setItem("userData", JSON.stringify(userData));
  
  //Cambiando Status del login y redireccionando a index.html.
  let loginStatus = true;
  window.localStorage.setItem("loginStatus", loginStatus);
  replace("index.html");
};