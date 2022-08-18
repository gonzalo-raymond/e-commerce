//Variables con las url de la api de e-mercado.
const EXT_TYPE = `.json`;
const CATEGORIES_URL = `https://japceibal.github.io/emercado-api/cats/cat.json`;
const PUBLISH_PRODUCT_URL = `https://japceibal.github.io/emercado-api/sell/publish.json`;
const PRODUCTS_URL = `https://japceibal.github.io/emercado-api/cats_products/`;
const PRODUCT_INFO_URL = `https://japceibal.github.io/emercado-api/products/`;
const PRODUCT_INFO_COMMENTS_URL = `https://japceibal.github.io/emercado-api/products_comments/`;
const CART_INFO_URL = `https://japceibal.github.io/emercado-api/user_cart/`;
const CART_BUY_URL = `https://japceibal.github.io/emercado-api/cart/buy.json`;

//Variable que lee el valor de login status desde localstorage.
let loginStatus = window.localStorage.getItem("loginStatus");

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