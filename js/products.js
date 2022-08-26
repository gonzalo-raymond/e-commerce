//Variables que guardan las url de las distintas categorias
//segun el id de cada categoria que es obtenido desde localstorage. 
let catID = localStorage.getItem("catID");
let url = `${PRODUCTS_URL}${catID}${EXT_TYPE}`;

//Variables que seran utilizadas para filtrado y orden
// de el array de productos.
const ORDER_ASC_BY_PROD_PRICE = "PriceA.";
const ORDER_DESC_BY_PROD_PRICE = "PriceD.";
const ORDER_DESC_BY_PROD_REL = "RelD.";
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minPrice = undefined;
let maxPrice = undefined;


const searchInput = document.getElementById("search-input");
const searchItems = document.getElementsByClassName("search-item");
const searchParams = document.getElementsByClassName("search-param");

searchInput.addEventListener("keyup", (e)=>{

    let searchText = e.target.value;
    let regExp = new RegExp(searchText, "i")

    for(let i=0 ; i < searchItems.length; i++){
       let searchParam = searchParams[i];
       let searchResult = searchItems[i];
       
       if(regExp.test(searchParam.innerText)){
            searchResult.classList.remove("ocultar");
       }else{
            searchResult.classList.add("ocultar");
       }
    }
});




function sortProducts(criteria, array){

    let result = [];
    
    if (criteria === ORDER_ASC_BY_PROD_PRICE){
        result = array.sort(function(a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            /*if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }*/
            return aCost - bCost;
        });
    }else if(criteria === ORDER_DESC_BY_PROD_PRICE){
        result = array.sort(function(a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            /*if ( aCount < bCount ){ return 1; }
            if ( aCount > bCount ){ return -1; }*/
            return bCost - aCost;
        });
    }else if(criteria === ORDER_DESC_BY_PROD_REL){
        result = array.sort(function(a, b) {
            let aSold = parseInt(a.soldCount);
            let bSold = parseInt(b.soldCount);

            /*if ( aCount < bCount ){ return 1; }
            if ( aCount > bCount ){ return -1; }*/
            return bSold - aSold;
        });
    }
    return result
}

function setProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}

//Función que recorre el array de los productos e 
//inyecta en el html un listado de los productos
//pertenecientes a una categoria.
function showProductsList(){

    let htmlContentToAppend = "";
    document.getElementById("cat-name").innerHTML = data.catName;
    for(let i = 0; i < currentProductsArray.length; i++){
        let product = currentProductsArray[i];

        if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.cost) >= minPrice)) &&
            ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.cost) <= maxPrice))){

            htmlContentToAppend += `
            <div onclick="setProdID(${product.id})" class="list-group-item list-group-item-action cursor-active search-item">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <div class="mb-1 search-param">
                                <h4>${product.name} - ${product.currency} ${product.cost}</h4>
                                <p>${product.description}</p>
                            </div>
                            <small class="text-muted">${product.soldCount} vendidos</small>
                        </div>  
                    </div>
                </div>
            </div>
            `
        }

        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowProducts(sortCriteria, productsArray){

    currentSortCriteria = sortCriteria;

    if(productsArray != undefined){
        currentProductsArray = productsArray;
    }

    
    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);
        
   
    //Muestro los productos ordenados.
    showProductsList();
    
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", async ()=>{

    //Condicional que evalua si el usuario no esta logeado y
    //redirecciona a login.html.
    if(loginStatusInfo === "false" || loginStatusInfo === null){
        window.location.replace("login.html");
    }else{
        showProfileMenu();
        logOutEvent();
    }

    const resultObj = await getJSONData(url)
    if (resultObj.status === "ok"){
        data = resultObj;
        currentProductsArray = data.products;
        showProductsList();
    }


    document.getElementById("sortAscByPrice").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_PROD_PRICE);
    });

    document.getElementById("sortDescByPrice").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_PROD_PRICE);
    });

    document.getElementById("sortDescByRel").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_PROD_REL);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterPriceMin").value = "";
        document.getElementById("rangeFilterPriceMax").value = "";

        minPrice = undefined;
        maxPrice = undefined;
  
        showProductsList();
    });

    document.getElementById("rangeFilterPrice").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por precio
        //de productos en la categoría.
        minPrice = document.getElementById("rangeFilterPriceMin").value;
        maxPrice = document.getElementById("rangeFilterPriceMax").value;

        if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0){
            minPrice = parseInt(minPrice);
        }
        else{
            minPrice = undefined;
        }

        if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0){
            maxPrice = parseInt(maxPrice);
        }
        else{
            maxPrice = undefined;
        }

        showProductsList();
    });
});