const articlesContainer = document.getElementById("articles-container"),
      cartQty = document.getElementById("cart-qty"),
      cartTotalPrice = document.getElementById("cart-total-price"),
      cartNotificationCount = document.getElementById("cart-count"),
      deliverOptions = document.getElementById("deliver-options"),
      deliverCostContainer = document.getElementById("cart-deliver-price"),
      subtotalCostContainer = document.getElementById("cart-subtotal-price");

let totalCost = 0,
    subTotal = 0,
    deliverCostPercentage = 0.05;

    deliverOptions.addEventListener("change", (e) => {
        
        deliverCostPercentage = parseFloat(e.target.value);
        calcTotal()
        
    })

    //onclick="${this.parentNode.querySelector('#qty-input${id}').stepUp()}"

const deleteArticle = (id) =>{

    let purchaseOrder = JSON.parse(localStorage.getItem(`purchaseOrder${user}`));

    let articles = purchaseOrder.articles;

    let sameId = (article) => parseInt(article.id) === parseInt(id);

    let articleIndex = articles.findIndex(sameId);

    articles.splice(articleIndex, 1);

    localStorage.setItem(`purchaseOrder${user}`, JSON.stringify(purchaseOrder));

    if(purchaseOrder.articles.length === 0){
        localStorage.removeItem(`purchaseOrder${user}`);
    }

};

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

const calcTotal = () => {

    prefix = ""

    let totalQty = 0;

    let totalCost = 0;

    let subTotals = document.querySelectorAll(`.subtotal`);

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
    
    for(let i=0; i < subTotals.length; i++){

        let subtotal = subTotals[i];

        prefix = subtotal.innerText.split(subtotal.childNodes[1].innerText)[0];

        let subtotalValue = parseInt(subtotal.childNodes[1].innerText);

        totalCost += subtotalValue;
        
    }

    let deliverCost = Math.round((totalCost * deliverCostPercentage));

    console.log(deliverCostPercentage);
    console.log(deliverCost);

    totalCost = totalCost + deliverCost;

    let subtotalCost = totalCost - deliverCost;

    subtotalCostContainer.innerText = `${prefix} ${subtotalCost}`;

    deliverCostContainer.innerText = `${prefix} ${deliverCost}`;

    cartTotalPrice.innerText = `${prefix} ${totalCost}`;

    if(!isNaN(totalQty)){
        cartQty.innerText = `${totalQty}`;
        cartNotificationCount.innerText = `${totalQty}`;
    }

}

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

}

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

const showCartArticles = () => {

    let articlesContent = "";

    let prefix = "";

    for(let i=0; i < cartArticles.length; i++){

        

        let article = cartArticles[i];

        let {id, name, count, unitCost, currency, image} = article;

        let costPerArticle = parseInt(unitCost) * parseInt(count);

        if(currency === "USD" && currency != "UYU"){
            //totalCost += costPerArticle
            prefix = `USD`
        }else if(currency === "UYU" && currency != "USD"){
            //totalCost += costPerArticle
            prefix = `$`
        }else{
            prefix = ""
            totalCost = "mix de monedas";
        }

        

        

        articlesContent += `
            <div class="row d-flex justify-content-around align-items-center cart-content">
                <div class="col-md-3 col-lg-3 col-xl-3 cart-item">
                    <img src="${image}" width="150" class="img-fluid rounded-3 no-max-width" alt="${name}">
                    <h6 class="text-muted text-correct article-name">${name}</h6>
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

    articlesContainer.innerHTML = articlesContent;

    calcTotal();

};




document.addEventListener("DOMContentLoaded", async () => {

    //Condicional que evalua si el usuario no esta logeado y
    //redirecciona a login.html
    if(loginStatusInfo === "false" || loginStatusInfo === null){
        replace("login.html");
    }else{
        showProfileMenu();
        if(userDataG != null){
            //userImg.src = userDataG.profileImg;
        }
        logOutEvent();
    }

    let purchaseOrder = JSON.parse(localStorage.getItem(`purchaseOrder${user}`));
    
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