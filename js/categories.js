const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_ASC_BY_PROD_COUNT = "CantA.";
const ORDER_DESC_BY_PROD_COUNT = "CantD.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_ASC_BY_PROD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            /*if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }*/
            return aCount - bCount;
        });
    }else if(criteria === ORDER_DESC_BY_PROD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            /*if ( aCount < bCount ){ return 1; }
            if ( aCount > bCount ){ return -1; }*/
            return bCount - aCount;
        });
    }

    return result
}

document.getElementById("rangeFilterCountMin").addEventListener("input", () => {

    if(document.getElementById("rangeFilterCountMin").value === ""){
        document.getElementById("rangeFilterCountMin").blur();
    }

});


document.getElementById("rangeFilterCountMax").addEventListener("input", () => {

    if(document.getElementById("rangeFilterCountMax").value === ""){
        document.getElementById("rangeFilterCountMax").blur();
    }

});

function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html"
}

function showCategoriesList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentCategoriesArray.length; i++){
        let category = currentCategoriesArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))){

            htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${category.name}</h4>
                            <small class="text-muted">${category.productCount} art??culos</small>
                        </div>
                        <p class="mb-1">${category.description}</p>
                    </div>
                </div>
            </div>
            `
        }

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    //Muestro las categor??as ordenadas
    showCategoriesList();
}

//Funci??n que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", async ()=>{

    //Condicional que evalua si el usuario no esta logeado y
    //redirecciona a login.html
    if(loginStatusInfo === "false" || loginStatusInfo === null){
        window.location.replace("login.html");
    }else{
        showProfileMenu();
        logOutEvent();
    }

    const resultObj = await getJSONData(CATEGORIES_URL)
    if (resultObj.status === "ok"){
        currentCategoriesArray = resultObj
        showCategoriesList()
        //sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
    }
    

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_ASC_BY_NAME);

        setTimeout(()=>{
            document.getElementById("sortAsc").blur();
        }, 200);

    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_DESC_BY_NAME);

        setTimeout(()=>{
            document.getElementById("sortDesc").blur();
        }, 200);

    });

    document.getElementById("sortAscByCount").addEventListener("click", function(){
        sortAndShowCategories(ORDER_ASC_BY_PROD_COUNT);

        setTimeout(()=>{
            document.getElementById("sortAscByCount").blur();
        }, 200);

    });

    document.getElementById("sortDescByCount").addEventListener("click", function(){
        sortAndShowCategories(ORDER_DESC_BY_PROD_COUNT);

        setTimeout(()=>{
            document.getElementById("sortDescByCount").blur();
        }, 200);

    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showCategoriesList();

        setTimeout(()=>{
            document.getElementById("clearRangeFilter").blur();
        }, 200);

    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el m??nimo y m??ximo de los intervalos para filtrar por cantidad
        //de productos por categor??a.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        showCategoriesList();

        setTimeout(()=>{
            document.getElementById("rangeFilterCount").blur();
        }, 200);
        
    });
});