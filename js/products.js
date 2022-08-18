//Variables que guardan las url de las distintas categorias
//segun el id de cada categoria que es obtenido desde localstorage. 
let catID = localStorage.getItem("catID");
let url = `${PRODUCTS_URL}${catID}${EXT_TYPE}`;

//Función que recorre el array de los productos e 
//inyecta en el html un listado de los productos
//pertenecientes a una categoria.
function showProductsList(array){
    let htmlContentToAppend = "";
    document.getElementById("cat-name").innerHTML = data.catName;

    for(let i = 0; i < array.length; i++){ 
        let product = array[i];
        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="${product.image}" alt="product image" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <div class="mb-1">
                        <h4>${product.name} - ${product.currency} ${product.cost}</h4> 
                        <p>${product.description}</p> 
                        </div>
                        <small class="text-muted">${product.soldCount} vendidos</small> 
                    </div>

                </div>
            </div>
        </div>
        `
        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend; 

        
        
        
    }
}

//Evento de escucha de la carga de los elementos del DOM
//que realiza un fetch y trae un array de objetos con los datos
//de los productos de una categoria.
document.addEventListener("DOMContentLoaded", async ()=>{

    const resultObj = await getJSONData(url)
    if (resultObj.status === "ok"){
        data = resultObj;
        productsArray = data.products
        showProductsList(productsArray);
    }  
});