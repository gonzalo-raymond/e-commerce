// Elementos del DOM necesarios.
const articlesContainer = document.getElementById("articles-container"),
      cartQty = document.getElementById("cart-qty"),
      cartTotalPrice = document.getElementById("cart-total-price"),
      cartNotificationCount = document.getElementById("cart-count"),
      deliverOptions = document.getElementById("deliver-options"),
      deliverCostContainer = document.getElementById("cart-deliver-price"),
      subtotalCostContainer = document.getElementById("cart-subtotal-price"),
      moneyOptions = document.getElementById("money-options"),
      buyBtn = document.getElementById("buyBtn"),
      cancelBtn = document.getElementById("cancel-btn"),
      cardOption = document.getElementById("card-option"),
      bankOption = document.getElementById("bank-option"),
      payBtn = document.getElementById("pay-btn");

// Variables globales necesarias.
let totalCost = 0,
    subTotal = 0,
    deliverCostPercentage = 0.05,
    moneyOption = 1,
    mixedMoney = false,
    allDolar = false,
    allPesos = false,
    msg = "";


function setProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
};


// Evento de tipo change que actua al cambiar las opciones de envio y calcula
// el costo de envio y el total de compra dependiendo la opcion de envio seleccionada. 
deliverOptions.addEventListener("change", (e) => {
        
    deliverCostPercentage = parseFloat(e.target.value);
    calcTotal()
        
})


//Evento de tipo change que actua al cambiar las opciones de moneda predeterminada y hace las
//conversiones de divisa necesarias para visualizar el subtotal, el coste de envio, y el total
//en la divisa determinada.
moneyOptions.addEventListener("change", (e) => {

    moneyOptions.classList.remove("is-invalid");
    moneyOption = parseInt(e.target.value);
    calcTotal()

});

//Evento de tipo click que actua sobre la opcion de pago con tarjeta de credito.
cardOption.addEventListener("click", () => {

    cardOption.classList.remove("is-invalid");
    bankOption.classList.remove("is-invalid");

    const cardArea = document.getElementById("card-area");

    const bankArea = document.getElementById("bank-area");

    const cardHoldersNameInput = document.getElementById("typeName");

    const cardNumberInput = document.getElementById("card-number");

    const cardExpInput = document.getElementById("typeExp");

    const cardCvvInput = document.getElementById("security-numbers");

    const bankAccountInput = document.getElementById("bank-account");

    bankAccountInput.value = "";

    bankAccountInput.classList.remove("is-invalid");
    bankAccountInput.classList.remove("is-valid");

    cardArea.classList.remove("unselected");

    bankArea.classList.add("unselected");

    cardHoldersNameInput.disabled = false;

    cardNumberInput.disabled = false;

    cardExpInput.disabled = false;

    cardCvvInput.disabled = false;

    bankAccountInput.disabled = true;

});

////Evento de tipo click que actua sobre la opcion de pago con transferencia bancaria.
bankOption.addEventListener("click", () => {

    cardOption.classList.remove("is-invalid");
    bankOption.classList.remove("is-invalid");

    const bankArea = document.getElementById("bank-area");

    const cardArea = document.getElementById("card-area");

    const bankAccountInput = document.getElementById("bank-account");

    const cardHoldersNameInput = document.getElementById("typeName");

    const cardNumberInput = document.getElementById("card-number");

    const cardExpInput = document.getElementById("typeExp");

    const cardCvvInput = document.getElementById("security-numbers");

    cardHoldersNameInput.value = "";
    cardNumberInput.value = "";
    cardExpInput.value = "";
    cardCvvInput.value = "";

    cardHoldersNameInput.classList.remove("is-invalid");
    cardHoldersNameInput.classList.remove("is-valid");
    cardNumberInput.classList.remove("is-invalid");
    cardNumberInput.classList.remove("is-valid");
    cardExpInput.classList.remove("is-invalid");
    cardExpInput.classList.remove("is-valid");
    cardCvvInput.classList.remove("is-invalid");
    cardCvvInput.classList.remove("is-valid");

    bankArea.classList.remove("unselected");

    cardArea.classList.add("unselected");

    bankAccountInput.disabled = false;

    cardHoldersNameInput.disabled = true;

    cardNumberInput.disabled = true;

    cardExpInput.disabled = true;

    cardCvvInput.disabled = true;

});

//Evento de tipo click que actua sobre el boton de cancelar compra.
cancelBtn.addEventListener("click", () => {

    const bankArea = document.getElementById("bank-area");
    const cardArea = document.getElementById("card-area");

    const adressStreetInput = document.getElementById("calle");
    const adressNumberInput = document.getElementById("número");
    const adressCornerInput = document.getElementById("esquina");

    const bankAccountInput = document.getElementById("bank-account");
    const cardHoldersNameInput = document.getElementById("typeName");
    const cardNumberInput = document.getElementById("card-number");
    const cardExpInput = document.getElementById("typeExp");
    const cardCvvInput = document.getElementById("security-numbers");

    bankAccountInput.value = "";
    cardHoldersNameInput.value = "";
    cardNumberInput.value = "";
    cardExpInput.value = "";
    cardCvvInput.value = "";

    bankAccountInput.classList.remove("is-valid");
    cardHoldersNameInput.classList.remove("is-valid");
    cardNumberInput.classList.remove("is-valid");
    cardExpInput.classList.remove("is-valid");
    cardCvvInput.classList.remove("is-valid");

    bankAccountInput.classList.remove("is-invalid");
    cardHoldersNameInput.classList.remove("is-invalid");
    cardNumberInput.classList.remove("is-invalid");
    cardExpInput.classList.remove("is-invalid");
    cardCvvInput.classList.remove("is-invalid");
    
    adressStreetInput.classList.remove("is-valid");  
    adressNumberInput.classList.remove("is-valid");
    adressCornerInput.classList.remove("is-valid");   
    moneyOptions.classList.remove("is-valid");

    bankAccountInput.disabled = true;
    cardHoldersNameInput.disabled = true;
    cardNumberInput.disabled = true;
    cardExpInput.disabled = true;
    cardCvvInput.disabled = true;

    cardOption.classList.remove("is-invalid");
    bankOption.classList.remove("is-invalid");

    cardOption.checked = false;
    bankOption.checked = false;
    
    cardArea.classList.add("unselected");
    bankArea.classList.add("unselected");
       
    buyBtn.setAttribute("data-bs-toggle", "");

});


//Función que despliega un cartel que notifica cuando la compra se realizo correctamente.
const showBuySuccess = () => {
    document.getElementById("msg-container").innerText = msg;
    document.getElementById("buy-success").classList.add("show");
    setTimeout(()=>{
        document.getElementById("buy-success").classList.remove("show");  
    }, 2500);
};

//Función que valida los datos de pago.
const validatePay = () =>{

    const cardHoldersNameInput = document.getElementById("typeName");

    const cardNumberInput = document.getElementById("card-number");

    const cardExpInput = document.getElementById("typeExp");

    const cardCvvInput = document.getElementById("security-numbers");

    const bankAccountInput = document.getElementById("bank-account");

    let cardHoldersName = cardHoldersNameInput.value;

    let cardNumber = cardNumberInput.value;

    let cardExp = cardExpInput.value;

    let cardCvv = cardCvvInput.value;

    let bankAccount = bankAccountInput.value;

    if(cardOption.checked){

        if(cardHoldersName != "" &&
           cardNumber != "" &&
           cardExp != "" &&
           cardCvv != ""){

            cardHoldersNameInput.classList.remove("is-invalid");
            cardHoldersNameInput.classList.add("is-valid");
            cardNumberInput.classList.remove("is-invalid");
            cardNumberInput.classList.add("is-valid");
            cardExpInput.classList.remove("is-invalid");
            cardExpInput.classList.add("is-valid");
            cardCvvInput.classList.remove("is-invalid");
            cardCvvInput.classList.add("is-valid");

            cancelBtn.click();
            showBuySuccess();

        }else{

            if(!cardHoldersName){
                cardHoldersNameInput.classList.remove("is-valid");
                cardHoldersNameInput.classList.add("is-invalid");
            }else{
                cardHoldersNameInput.classList.remove("is-invalid");
                cardHoldersNameInput.classList.add("is-valid");
            }

            if(!cardNumber){
                cardNumberInput.classList.remove("is-valid");
                cardNumberInput.classList.add("is-invalid");
            }else{
                cardNumberInput.classList.remove("is-invalid");
                cardNumberInput.classList.add("is-valid");
            }

            if(!cardExp){
                cardExpInput.classList.remove("is-valid");
                cardExpInput.classList.add("is-invalid");
            }else{
                cardExpInput.classList.remove("is-invalid");
                cardExpInput.classList.add("is-valid");
            }

            if(!cardCvv){
                cardCvvInput.classList.remove("is-valid");
                cardCvvInput.classList.add("is-invalid");
            }else{
                cardCvvInput.classList.remove("is-invalid");
                cardCvvInput.classList.add("is-valid");
            }

        }


    }else if(bankOption.checked){

        if(bankAccount != ""){
            bankAccountInput.classList.remove("is-invalid");
            bankAccountInput.classList.add("is-valid");
            cancelBtn.click();
            showBuySuccess();
        }else{
            bankAccountInput.classList.remove("is-valid");
            bankAccountInput.classList.add("is-invalid");
        }

    }else{
        cardOption.classList.add("is-invalid");
        bankOption.classList.add("is-invalid");
    }

};

//Evento de tipo click que actua sobre el boton de confirmacion de pago y
//ejecuta la funcion que valida los datos de pago y si son correctos
//cierra el modal y ejecuta la funcion que muestra un cartel que
//notifica al usuario que la compra fue concretada.
payBtn.addEventListener("click", validatePay);


//Función que valida los datos de compra.
const validateBuy = () =>{

    const moneyOptions = document.getElementById("money-options");

    const defaultOption = document.getElementById("default");

    let defaultSelected = defaultOption.selected;

    const adressStreetInput = document.getElementById("calle");

    const adressNumberInput = document.getElementById("número");

    const adressCornerInput = document.getElementById("esquina");

    const adressStreet = adressStreetInput.value.trim();

    const adressNumber = adressNumberInput.value.trim();

    const adressCorner = adressCornerInput.value.trim();

    const subtotal = document.getElementById("cart-subtotal-price").innerText;

    const deliverCost = document.getElementById("cart-deliver-price").innerText;

    const total = document.getElementById("cart-total-price").innerText;

    const modalSubtotal = document.getElementById("modal-subtotal");

    const modalDeliver = document.getElementById("modal-deliver");

    const modalTotal = document.getElementById("modal-total");

    const profileImg = document.getElementById("profile__img").src;

    const modalProfile = document.getElementById("modal-profile");

    let qty = parseInt(cartQty.innerText);  

    if(adressStreet !== "" &&
       adressNumber !== "" &&
       adressNumber != 0 &&
       adressCorner !== "" && 
       !defaultSelected &&
       qty !== 0){

        adressStreetInput.classList.remove("is-invalid");
        adressStreetInput.classList.add("is-valid");
        adressNumberInput.classList.remove("is-invalid");
        adressNumberInput.classList.add("is-valid");
        adressCornerInput.classList.remove("is-invalid");
        adressCornerInput.classList.add("is-valid");
        moneyOptions.classList.remove("is-invalid");
        moneyOptions.classList.add("is-valid");

        buyBtn.setAttribute("data-bs-toggle", "modal");
        modalProfile.src = profileImg;
        modalSubtotal.innerText = subtotal;
        modalDeliver.innerText = deliverCost;
        modalTotal.innerText = total;
        buyBtn.click();
  
    }else if(qty !== 0){

        if(!adressStreet){
            adressStreetInput.classList.remove("is-valid");
            adressStreetInput.classList.add("is-invalid");
        }else{
            adressStreetInput.classList.remove("is-invalid");
            adressStreetInput.classList.add("is-valid"); 
        }

        if(!adressNumber){
            adressNumberInput.classList.remove("is-valid");
            adressNumberInput.classList.add("is-invalid");
        }else{
            adressNumberInput.classList.remove("is-invalid");
            adressNumberInput.classList.add("is-valid"); 
        }

        if(!adressCorner){
            adressCornerInput.classList.remove("is-valid");
            adressCornerInput.classList.add("is-invalid");
        }else{
            adressCornerInput.classList.remove("is-invalid");
            adressCornerInput.classList.add("is-valid");
        }

        if(defaultSelected){
            moneyOptions.classList.remove("is-valid");
            moneyOptions.classList.add("is-invalid");
        }else{
            moneyOptions.classList.remove("is-invalid");
            moneyOptions.classList.add("is-valid");
        }

    }

};

//Evento de tipo click sobre el boton de compra que
//ejecuta la funcíon que valida los datos de compra
//y si son correctos despliega el modal de confirmacion.
buyBtn.addEventListener("click", validateBuy);

//Función que elimina el articulo con el id que le pasamos por parametro del carrito.
const deleteArticle = (id) =>{

    let purchaseOrder = JSON.parse(localStorage.getItem(`purchaseOrder${user}`));

    let articles = purchaseOrder.articles;

    let sameId = (article) => parseInt(article.id) === parseInt(id);

    let articleIndex = articles.findIndex(sameId);

    articles.splice(articleIndex, 1);

    localStorage.setItem(`purchaseOrder${user}`, JSON.stringify(purchaseOrder));

};


//Función que toma un id y un nuevo valor de Count y modifica el contador
//de un articulo de determinado id.
const updateArticleCount = (id, newCount) => {

    let purchaseOrder = JSON.parse(localStorage.getItem(`purchaseOrder${user}`));

    let articles = purchaseOrder.articles;

    let sameId = (article) => parseInt(article.id) === parseInt(id);

    let articleIndex = articles.findIndex(sameId);

    let article = articles[articleIndex];
    
    newCount = parseInt(newCount);

    if(isNaN(newCount)){
        newCount = 1;
    }

    article.count = newCount;

    localStorage.setItem(`purchaseOrder${user}`, JSON.stringify(purchaseOrder));

};


//Función que calcula el subtotal general, el costo de envio y el total a pagar
//y muestra los datos expresados en determinada divisa en pantalla. 
const calcTotal = () => {

    const defaultOption = document.getElementById("default");

    let defaultSelected = defaultOption.selected;

    let totalQty = 0;

    let qtyInputs = document.getElementsByClassName("qty-input");

    for(let i=0; i < qtyInputs.length; i++){

        let qty = 1;
        let qtyInput = qtyInputs[i];
        let qtyValue = qtyInput.value;
        if(qtyValue != "" && qtyValue != 0){
            qty = parseInt(qtyValue)
        }else{
            qtyInput.value = 1;
        }

        if(qty != NaN){
            totalQty += qty;
        }

    }
        
    

    if(defaultSelected){

        subtotalCostContainer.innerText = `--`;

        deliverCostContainer.innerText = `--`;

        cartTotalPrice.innerText = `--`;

    }else{

        prefix = ""

        let dolarCount = 0;

        let dolarMont = 0;

        let pesosMont = 0;

        let pesosCount = 0;

        let totalCost = 0;

        let subTotals = document.querySelectorAll(`.subtotal`);
  
        for(let i=0; i < subTotals.length; i++){

            let subtotal = subTotals[i];

            prefix = subtotal.innerText.split(subtotal.childNodes[1].innerText)[0];

            let subtotalValue = parseInt(subtotal.childNodes[1].innerText);
           
            if(prefix === "USD "){
                dolarCount += 1
                dolarMont += subtotalValue;
            }else if(prefix === "$ "){
                pesosCount += 1
                pesosMont += subtotalValue;
            }

        }

        if(dolarCount === subTotals.length){
            allDolar = true;
            totalCost = dolarMont;
        }else if(pesosCount === subTotals.length){
            allPesos = true;
            totalCost = pesosMont;
        }else if(dolarCount + pesosCount === subTotals.length){
            mixedMoney = true;
        }

        if(allDolar && moneyOption === 1){
            prefix = "USD ";
            totalCost = totalCost * moneyOption;  
        }else if(allDolar && moneyOption === 40){
            prefix = "$ ";
            totalCost = totalCost * moneyOption;
        }else if(allPesos && moneyOption === 40){
            prefix = "$ ";
            totalCost = totalCost * 1;
        }else if(allPesos && moneyOption === 1){
            prefix = "USD ";
            totalCost = Math.round(totalCost / 40);
        }else if(mixedMoney){

            if(moneyOption === 1){
                prefix = "USD ";
                let dolarConverted = Math.round(pesosMont / 40);
                totalCost = dolarMont + dolarConverted;
            }else if(moneyOption === 40){
                prefix = "$ ";
                let pesosConverted = dolarMont * 40;
                totalCost = pesosMont + pesosConverted;
            }
        }
    
        let deliverCost = Math.round((totalCost * deliverCostPercentage));

        totalCost = totalCost + deliverCost;

        let subtotalCost = totalCost - deliverCost;

        subtotalCostContainer.innerText = `${prefix} ${subtotalCost}`;

        deliverCostContainer.innerText = `${prefix} ${deliverCost}`;

        cartTotalPrice.innerText = `${prefix} ${totalCost}`;

    }

    if(!isNaN(totalQty)){
        cartQty.innerText = `${totalQty}`;
        cartNotificationCount.innerText = `${totalQty}`;
    }
}


//Función que calcula el subtotal individual para cada articulo en base a su id
//multiplicando su precio unitario por la cantidad deseada de este articulo.
const calcSubtotal = (price, id) =>{

    subTotal = parseInt(price);

    let subtotalContainer = document.getElementById(`subtotal${id}`);

    let qty = document.getElementById(`qty-input${id}`).value;

    if(qty != "" && parseInt(qty) != 0 ){
        subTotal = parseInt(qty) * parseInt(price);
    }else{
        subTotal = parseInt(price);
    }

    subtotalContainer.innerHTML = `${subTotal}`;

    calcTotal();

    updateArticleCount(id, qty);

};


//Función que aumenta la cantidad deseada de un articulo y calcula el subtotal
//correspondiente para ese mismo articulo.
const changeSubtotalPlus = (id, price) =>{

    subTotal = parseInt(price);

    let subtotalContainer = document.getElementById(`subtotal${id}`);

    let qtyInput = document.getElementById(`qty-input${id}`);

    let qtyValue = qtyInput.value;

    qtyValue = parseInt(qtyValue) + 1;

    qtyInput.value = qtyValue;

    if(qtyValue != "" && parseInt(qtyValue) != 0 ){
        subTotal = parseInt(qtyValue) * parseInt(price);
    }else{
        subTotal = parseInt(price);
    }

    subtotalContainer.innerHTML = `${subTotal}`;

    calcTotal();

    updateArticleCount(id, qtyValue);
};


//Función que disminuye la cantidad deseada de un articulo y calcula el subtotal
//correspondiente para ese mismo articulo.
const changeSubtotalMinus = (id, price) =>{

    subTotal = parseInt(price);

    let subtotalContainer = document.getElementById(`subtotal${id}`);

    let qtyInput = document.getElementById(`qty-input${id}`);

    let qtyValue = qtyInput.value;

    if(qtyValue > 1){
        qtyValue = parseInt(qtyValue) - 1;
    }

    qtyInput.value = qtyValue;

    if(qtyValue != "" && parseInt(qtyValue) != 0 ){
        subTotal = parseInt(qtyValue) * parseInt(price);
    }else{
        subTotal = parseInt(price);
    }

    subtotalContainer.innerHTML = `${subTotal}`;

    calcTotal();

    updateArticleCount(id, qtyValue);
};

//Función que muestra los articulos existentes en nuestro carrito en pantalla con toda
//la información necesaria de el mismo.
const showCartArticles = () => {

    let dolarsCount = 0;

    let uyPesosCount = 0;

    let allDolars = false;

    let allUyPesos = false;

    let articlesContent = "";

    let prefix = "";

    let first= "";

    if(cartArticles.length == 0){
        articlesContent =  `
            <div class="row mb-4 d-flex justify-content-center text-center">
                <h1 id="empty-cart-text">Su carrito esta vacio! &#128532;</h1>
            </div>
        `
        const adressStreetInput = document.getElementById("calle");
        const adressNumberInput = document.getElementById("número");
        const adressCornerInput = document.getElementById("esquina");
        const moneyOptions = document.getElementById("money-options");

        document.getElementById("deliver-options").disabled = true;
        adressStreetInput.disabled = true;
        adressNumberInput.disabled = true;
        adressCornerInput.disabled = true;
        moneyOptions.classList.remove("is-invalid");
        moneyOptions.disabled = true;
        document.getElementById("codigo-descuento").disabled = true;
        buyBtn.disabled = true;

    }

    for(let i=0; i < cartArticles.length; i++){

        let article = cartArticles[i];

        let {id, name, count, unitCost, currency, image} = article;

        let costPerArticle = parseInt(unitCost) * parseInt(count);

        if(currency === "USD" && currency != "UYU"){
            dolarsCount += 1;
            prefix = `USD`;
        }else if(currency === "UYU" && currency != "USD"){
            uyPesosCount += 1;
            prefix = `$`;
        }

        if(i===0){
            first = "first";
        }else{
            first = "";
        }

        articlesContent += `
            <div class="row d-flex justify-content-around align-items-center cart-content ${first}">
                <div onclick="setProdID(${id})" class="col-md-3 col-lg-3 col-xl-3 cart-item">
                    <img src="${image}" width="150" class="img-fluid rounded-3 no-max-width" alt="${name}">
                    <h6 class="text-correct article-name">${name}</h6>
                </div>

                <div class="col-md-2 col-lg-2 col-xl-2">
                    <h6 class="mb-0">${prefix} ${unitCost}</h6>
                </div>
                          
                <div class="col-md-2 col-lg-2 col-xl-2 d-flex qty-control">
                    <button id="minus-${id}" class="btn btn-link px-1 minus-btn" onclick="changeSubtotalMinus(${id}, ${unitCost})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input id="qty-input${id}" min="1" name="quantity" value="${count}" oninput="calcSubtotal(${unitCost}, ${id})" type="number" class="form-control form-control-sm qty-input" />
                    <button id="plus-${id}" class="btn btn-link px-1 plus-btn" onclick="changeSubtotalPlus(${id}, ${unitCost})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>

                <div class="col-md-2 col-lg-2 col-xl-2 offset-lg-12 d-flex ml-0 justify-content-between">
                    <h6 class="mb-0 subtotal">${prefix} <span id="subtotal${id}">${costPerArticle}</span></h6>
                    <a href="cart.html" class="text-muted delete-article" onclick="deleteArticle(${id})"><i class="fas fa-times"></i></a>
                </div>
                
            </div>

            <hr class="my-4">
      
        `

    }

    if(dolarsCount === cartArticles.length && dolarsCount !== 0){
        allDolars = true;
    }else{
        allDolars = false;
    }

    if(uyPesosCount === cartArticles.length && uyPesosCount !== 0){
        allUyPesos = true;
    }else{
        allUyPesos = false;
    }

    if(allDolars){
        
        document.getElementById("dolar").selected = true;
        moneyOptions.classList.remove("is-invalid");
        moneyOption = parseInt(document.getElementById("dolar").value)

    }else if(allUyPesos){
        
        document.getElementById("peso").selected = true;
        moneyOptions.classList.remove("is-invalid");
        moneyOption = parseInt(document.getElementById("peso").value)
    }

    articlesContainer.innerHTML = articlesContent;

    calcTotal();

};



//Evento async de tipo carga que actua luego de cargar todos los elementos del DOM. 
document.addEventListener("DOMContentLoaded", async () => {

    //Condicional que evalua si el usuario no esta logeado y
    //redirecciona a login.html
    if(loginStatusInfo === "false" || loginStatusInfo === null){
        replace("login.html");
    }else{
        showProfileMenu();
        if(userData != null){
            //userImg.src = userDataG.profileImg;
        }
        logOutEvent();
    }

    //Fetch al mensaje de compra almacenado en la api de JAP
    const buyMsjObj = await getJSONData(CART_BUY_URL)
    if (buyMsjObj.status === "ok"){
        msg = buyMsjObj.msg;
    }

    let purchaseOrder = JSON.parse(localStorage.getItem(`purchaseOrder${user}`));

    //Fetch al objeto del articulo precargado en nuestro carrito
    //almacenado en la api de JAP.
    const cartObj = await getJSONData(cartURL);
    if(cartObj.status === "ok" && purchaseOrder === null){
        cartInfo = (({user, articles}) => ({user, articles}))(cartObj);
        cartArticles = cartInfo.articles;
        localStorage.setItem(`purchaseOrder${user}`, JSON.stringify(cartInfo));
        cartNotification();
        showCartArticles();    
    }else{
        cartInfo = purchaseOrder;
        cartArticles = cartInfo.articles
        cartNotification();
        showCartArticles();
    }
});