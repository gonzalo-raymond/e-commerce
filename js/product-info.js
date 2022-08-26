//Variables que guardan las url de los distintos productos
//segun el id de cada producto que es obtenido desde localstorage. 
let prodID = localStorage.getItem("prodID");
let url = `${PRODUCT_INFO_URL}${prodID}${EXT_TYPE}`;
console.log(url);