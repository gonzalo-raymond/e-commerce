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

//DESAFIATE!
//Elementos del DOM necesarios para el funcionamiento de la barra de busqueda. 
const searchInput = document.getElementById("search-input");
const searchItems = document.getElementsByClassName("search-item");
const searchParams = document.getElementsByClassName("search-param");

//Evento de tipo keyup (presionar tecla) sobre el input de la busqueda.
searchInput.addEventListener("keyup", (e)=>{

    //Variable que guarda el valor de las teclas presionadas
    let searchText = e.target.value;

    //Variable que guarda las expresiones regulares que usaremos
    // para filtrar coincidencias en la busqueda y admitan
    // minusculas y mayusculas indistintamente.
    let regExp = new RegExp(searchText, "i")

    //Ciclo for que recorre el array de elementos en la busqueda,
    //y a cada uno lo somete a una prueba haciendo uso de expresiones regulares.
    //Si no pasa la prueba se añade una clase de CSS que oculta el elemento,
    //mostrando solo los que coinciden con los parametros ingresados por el usuario.
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



//Función que toma un array de productos y un criterio como parametros
// y devuelve un array ordenado segun el criterio determinado haciendo uso
//del metodo sort().
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

//Función que guarda en localstorage con la palabra clave prodID
//un número de identificación unico para cada producto.
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

//Función que recibe un criterio de orden como parametro para luego llamar en su interior
//a la función de sortProducts() a la que le pasamos por parametros el criterio de orden antes mencionado
//y el array de productos que nos devuelve el fetch. Dando como resultado un array ordenado y a ese array
//le asigna la variable que usamos en la función de showProductsList() para luego llamar a esa misma función
//y que se muestre el listado de productos ordenados en nuestro html de productos.
function sortAndShowProducts(sortCriteria){

    currentSortCriteria = sortCriteria;

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

    //Codigo que hace fetch a la url dinamica de productos.
    const resultObj = await getJSONData(url)
    if (resultObj.status === "ok"){
        data = resultObj;
        currentProductsArray = data.products;
        showProductsList();
    }


    //Evento de tipo click que ordena y muestra la lista de productos
    //segun criterio de precio de producto en orden ascendente.
    document.getElementById("sortAscByPrice").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_PROD_PRICE);
    });

    //Evento de tipo click que ordena y muestra la lista de productos
    //segun criterio de precio de producto en orden descendente.
    document.getElementById("sortDescByPrice").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_PROD_PRICE);
    });

    //Evento de tipo click que ordena y muestra la lista de productos
    //segun criterio de relevancia de producto (cantidad vendida) en 
    //orden descendente.
    document.getElementById("sortDescByRel").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_PROD_REL);
    });

    //Evento de tipo click que le hace reset al filtro de rango de precio y
    //muestra la lista de productos completa.
    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterPriceMin").value = "";
        document.getElementById("rangeFilterPriceMax").value = "";

        minPrice = undefined;
        maxPrice = undefined;
  
        showProductsList();
    });

    //Evento de tipo click que muestra la lista de productos que cumplen con un
    //valor del precio dentro de un rango minimo - maximo.
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