//Variables con las url de la api de e-mercado.
const EXT_TYPE = `.json`;
const CATEGORIES_URL = `https://japceibal.github.io/emercado-api/cats/cat.json`;
const PUBLISH_PRODUCT_URL = `https://japceibal.github.io/emercado-api/sell/publish.json`;
const PRODUCTS_URL = `https://japceibal.github.io/emercado-api/cats_products/`;
const PRODUCT_INFO_URL = `https://japceibal.github.io/emercado-api/products/`;
const PRODUCT_INFO_COMMENTS_URL = `https://japceibal.github.io/emercado-api/products_comments/`;
const CART_INFO_URL = `https://japceibal.github.io/emercado-api/user_cart/`;
const CART_BUY_URL = `https://japceibal.github.io/emercado-api/cart/buy.json`;


//Función que le asugna un valor booleano a el status del login.
let loginStatus = (booleano)=>{
  window.localStorage.setItem("loginStatus", booleano)
};

//Variable que lee el valor de login status desde localstorage.
let loginStatusInfo = window.localStorage.getItem("loginStatus");


//Variable que contiene el email del usuario
let userEmailInfo = window.localStorage.getItem("userEmail");

//Variable que guarda los datos de google del usuario llamados desde el
//localstorage en formato de objeto.
let userDataG = JSON.parse(window.localStorage.getItem("userData"));

let showProfileTitle = ()=>{

  let userMenuTitle = document.getElementById("navbarDarkDropdownMenuLink");
  let userProfileImg = document.getElementById("profile__img");
  
  if(userDataG != null){
    userMenuTitle.innerText = userDataG.email;
    userProfileImg.src = userDataG.profileImg;
  }else if(userEmailInfo != null){
    userMenuTitle.innerText = userEmailInfo;
  }
}

//Función que elimina los datos del usuario almacenados en
// el localstorage.
let userDataClean = ()=>{ 
  
  if(userDataG != null && userEmailInfo != null){
    window.localStorage.removeItem("userData");
    window.localStorage.removeItem("userEmail");
  }else if(userDataG != null){
    window.localStorage.removeItem("userData");
  }else if(userEmailInfo != null){
    window.localStorage.removeItem("userEmail");
  }
}



//Función que cambia el loginStatus a false
//y elimina los datos del usuario del localstorage.
let logOut = ()=>{
  loginStatus(false);
  userDataClean();
}

//Función que añade evento de escucha al boton de logout en el e-mercado
let logOutEvent = ()=>{
  let logOutBtn = document.getElementById("logOutBtn");
  logOutBtn.addEventListener("click", ()=>{
    logOut();
  })
};

//Función que redirecciona a la url que le pase por parametro.
let replace = (url)=>{
  window.location.replace(url);
}

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}


//Función async await que realiza un fetch y devuelve objeto json()
const  getJSONData = async (url) => {
  showSpinner();
  let result = {};
  try{
    
    const response = await fetch(url);

    if (response.ok) {
      result = await response.json();
      result.status = "ok";
      result.response = response;
      hideSpinner();
    }else{
      throw Error(response.statusText);
    }
   
  }catch(error){
    result.status = 'error';
    result.response = error;
    hideSpinner();
  }
  return result;
}