//Variables que guardan las url de los distintos productos
//segun el id de cada producto que es obtenido desde localstorage. 
let prodID = localStorage.getItem("prodID"),
    prodUrl = `${PRODUCT_INFO_URL}${prodID}${EXT_TYPE}`,
    commentsUrl = `${PRODUCT_INFO_COMMENTS_URL}${prodID}${EXT_TYPE}`;



const productTitle = document.querySelector("#title"),
      productprice = document.querySelector("#price"),
      productdescription = document.querySelector("#description"),
      productCoverImgContainer = document.querySelector("#cover-img-container"),
      productThumbsImgContainer = document.querySelector("#thumbs-img-container"),
      relatedProductsContainer = document.querySelector("#related-prods-container"),
      productCommentsContainer = document.querySelector("#comments-container"),
      categoryNameContainer = document.querySelector("#cat-name");

const showProductInfo = () => {

    productTitle.innerText = productInfo.name;

    productprice.innerText = `${productInfo.currency} ${productInfo.cost}`;

    productdescription.innerText = productInfo.description;

    categoryNameContainer.innerText = productInfo.category;

    let productCoverImg = productInfo.images[0];

    productCoverImgContainer.innerHTML = `<a data-fslightbox="mygalley" data-type="image" href="${productCoverImg}"> 
                                            <img width="625" src="${productCoverImg}"></a>`;    

    let productImages = "";

    for(let i=1; i < productInfo.images.length; i++){
        let productThumbImg = productInfo.images[i];
        productImages += `<a data-fslightbox="mygalley" data-type="image" href="${productThumbImg}" class="item-thumb"> 
                            <img width="90" height="60" src="${productThumbImg}"></a>`
    }

    productThumbsImgContainer.innerHTML = productImages;

    let relatedProducts = "";

    for(let j=0; j < productInfo.relatedProducts.length; j++){
        let relatedProduct = productInfo.relatedProducts[j];
        relatedProducts += `<a href="#" class="aside">
        <img src="${relatedProduct.image}" width="96" height="96" class="img-md img-thumbnail">
      </a>
      <div class="info">
        <a href="#" class="title mb-1">${relatedProduct.name}</a>
      </div>`;
    }

    relatedProductsContainer.innerHTML = relatedProducts;

},
showProductComments = () =>{

    let blockQuote = "";

    for(let k=0; k < commentsInfo.length; k++){

        let comment = commentsInfo[k];

        blockQuote += `<blockquote class="border-bottom">
        <div class="float-lg-end d-flex mb-3">
          <div class="btn-group d-inline-flex me-2"> <button class="btn btn-light btn-sm float-end"
              data-bs-toggle="tooltip" data-bs-title="Like"> <i class="fa fa-thumbs-up"></i> </button>
            <button class="btn btn-light btn-sm float-end" data-bs-toggle="tooltip"
              data-bs-title="Dislike"> <i class="fa fa-thumbs-down"></i> </button> </div> <button
            class="btn btn-light btn-sm float-end "> <i class="fa fa-ellipsis-v"></i> </button>
        </div>
        <div class="icontext"> <img src="img/img_perfil.png" width="40" height="40" class="img-xs icon rounded-circle"></div>
          <div class="text">
            <h6 class="mb-0">${comment.user}</h6>
            <div class="rating-wrap">
              <ul class="rating-stars">
                <li style="width:80%" class="stars-active"> <img
                    src="img/stars-active.svg" alt=""> </li>
                <li> <img src="img/starts-disable.svg" alt=""> </li>
              </ul> <b class="dot"></b> <small class="label-rating text-muted">${comment.dateTime}</small>
            </div>
          </div>
        </div> <!-- icontext.// -->
        <div class="mt-3">
          <p>${comment.description}</p>
        </div>
      </blockquote>`;
    }

    productCommentsContainer.innerHTML += blockQuote;

};

document.addEventListener("DOMContentLoaded", async () => {

    //Condicional que evalua si el usuario no esta logeado y
    //redirecciona a login.html
    if(loginStatusInfo === "false" || loginStatusInfo === null){
        replace("login.html");
    }else{
        showProfileMenu();
        logOutEvent();
    }
    
    //Codigo que hace fetch a la url dinamica de un producto.
    const productObj = await getJSONData(prodUrl)
    if (productObj.status === "ok"){
        productInfo = productObj;
        showProductInfo()
    }

    //Codigo que hace fetch a la url dinamica de un producto.
    const commentsObj = await getJSONData(commentsUrl)
    if (commentsObj.status === "ok"){
        commentsInfo = commentsObj;
        showProductComments()
    }
});