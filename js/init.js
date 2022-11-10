//Variables con las url de la api de e-mercado.
const EXT_TYPE = `.json`;
const CATEGORIES_URL = `https://japceibal.github.io/emercado-api/cats/cat.json`;
const PUBLISH_PRODUCT_URL = `https://japceibal.github.io/emercado-api/sell/publish.json`;
const PRODUCTS_URL = `https://japceibal.github.io/emercado-api/cats_products/`;
const PRODUCT_INFO_URL = `https://japceibal.github.io/emercado-api/products/`;
const PRODUCT_INFO_COMMENTS_URL = `https://japceibal.github.io/emercado-api/products_comments/`;
const CART_INFO_URL = `https://japceibal.github.io/emercado-api/user_cart/`;
const CART_BUY_URL = `https://japceibal.github.io/emercado-api/cart/buy.json`;

let cartInfo = [];
let cartArticles = [];

let user = "";
let userDataId = localStorage.getItem("userDataEmail");
let userCartId = 25801;

let cartCount = 0;

let cartURL = `${CART_INFO_URL}${userCartId}${EXT_TYPE}`

//Función que le asigna un valor booleano a el status del login.
let loginStatus = (booleano)=>{
  window.localStorage.setItem("loginStatus", booleano)
};

//Variable que lee el valor de login status desde localstorage.
let loginStatusInfo = window.localStorage.getItem("loginStatus");

//Variable que guarda los datos del usuario llamados desde el
//localstorage en formato de objeto.
let userData = JSON.parse(window.localStorage.getItem(`userData${userDataId}`));

let showProfileMenu = ()=>{

  let userMenuTitle = document.getElementById("navbarDarkDropdownMenuLink");
  let userProfileImg = document.getElementById("profile__img");
  
  if(userData != null){
    userMenuTitle.innerText = userData.email;
    user = userData.email;
    userProfileImg.src = userData.profileImg;
  }
}

//Función que elimina los datos del usuario almacenados en
// el localstorage.
let userDataClean = ()=>{ 
  
  let purchaseOrder = JSON.parse(localStorage.getItem(`purchaseOrder${userDataId}`));

  if(purchaseOrder.articles.length === 0){
    localStorage.removeItem(`purchaseOrder${userDataId}`);
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

//Codigo que muestra la animacion de carga de la pagina. 
let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

//Codigo que oculta la animacion de carga de la pagina. 
let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

const cartNotification = () => {

  cartCount = 0;

  let purchaseOrder = JSON.parse(localStorage.getItem(`purchaseOrder${user}`));

  if(purchaseOrder != null && purchaseOrder.articles.length !== 0){

    

    let articles = purchaseOrder.articles;
   
    for(let i=0; i < articles.length; i++){

      let article = articles[i];

      cartCount += article.count;

    }

    document.getElementById("cart-count").innerText = cartCount;

    document.getElementById("cart-btn").classList.remove("visually-hidden-mod");
    document.getElementById("cart-count").classList.remove("visually-hidden");

    

  }else if(purchaseOrder === null || cartCount === 0 || purchaseOrder.articles.length === 0){

    document.getElementById("cart-btn").classList.add("visually-hidden-mod");
    document.getElementById("cart-count").classList.add("visually-hidden");

  }

};

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


document.addEventListener("DOMContentLoaded", async () =>{

  

  if(window.location.pathname.split("/")[1] !== "login.html" && loginStatusInfo === "true"){
    showProfileMenu();
    cartNotification();

    let purchaseOrder = JSON.parse(localStorage.getItem(`purchaseOrder${user}`));
    
    const cartObj = await getJSONData(cartURL);
    if (cartObj.status === "ok" && purchaseOrder === null){

      cartInfo = (({user, articles}) => ({user, articles}))(cartObj);
      cartArticles = cartInfo.articles;
      localStorage.setItem(`purchaseOrder${user}`, JSON.stringify(cartInfo))
      cartNotification();        
    }else{
      cartInfo = purchaseOrder;
      cartArticles = cartInfo.articles
      cartNotification();
    }
  }

});