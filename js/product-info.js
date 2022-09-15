//Variables que guardan las url de los distintos productos
//segun el id de cada producto que es obtenido desde localstorage. 
let prodID = localStorage.getItem("prodID"),
    prodUrl = `${PRODUCT_INFO_URL}${prodID}${EXT_TYPE}`,
    commentsUrl = `${PRODUCT_INFO_COMMENTS_URL}${prodID}${EXT_TYPE}`,

    commentsInfo = [],
    commentsCount = 0,
    totalScoreCount = 0,
    commentStatus = false,
    productCoverImg = ""; 

const productTitle = document.querySelector("#title"),
      productprice = document.querySelector("#price"),
      productdescription = document.querySelector("#description"),

      productCoverImgContainer = document.querySelector("#cover-img-container"),
      productThumbsImgContainer = document.querySelector("#thumbs-img-container"),

      relatedProductsContainer = document.querySelector("#related-prods-container"),
      categoryNameContainer = document.querySelector("#cat-name"),
      avgStarScoreContainer = document.querySelector("#avgStarScore"),
      avgScoreContainer = document.querySelector("#avgScore"),
      avgStarList = avgStarScoreContainer.querySelectorAll("span"),
      soldCountContainer = document.querySelector("#vendidos"),

      productCommentsContainer = document.querySelector("#comments-container"),
      rate1 = document.querySelector("#rate-1"),
      rate2 = document.querySelector("#rate-2"),
      rate3 = document.querySelector("#rate-3"),
      rate4 = document.querySelector("#rate-4"),
      rate5 = document.querySelector("#rate-5"),
      
      userImg = document.querySelector("#commentProfileImg"),
      commentTextArea = document.querySelector("#commentTextArea"),
      sendCommentBtn = document.querySelector("#sendBtn"),

      ORDER_BY_COMMENT_DATE = "dateOrd";

function setProdID(id) {
  localStorage.setItem("prodID", id);
  window.location = "product-info.html"
};

const showProductInfo = () => {

  let {name: name, currency: currency, cost: cost, description: description, category: category, images: images, relatedProducts: relatedProducts, soldCount: unitsSold} = productInfo;

  productTitle.innerText = name;

  productprice.innerText = `${currency} ${cost}`;

  productdescription.innerText = description;

  categoryNameContainer.innerText = category;

  soldCountContainer.innerText = `${unitsSold} vendidos`;

  productCoverImg = images[0];

  productCoverImgContainer.innerHTML = `
    <a data-fslightbox="mygalley" data-type="image" href="#"> 
      <img width="625" src="${productCoverImg}" onclick="fullPicture()" id="bigImg">
    </a>
  `;    

  let productImages = "";

  for(let i=0; i < images.length; i++){

    let productThumbImg = images[i];

    productImages += `
      <a data-fslightbox="mygalley" data-type="image" href="#" class="item-thumb"> 
        <img width="130" src="${productThumbImg}" onclick="doBigger(this)" class="img-thumbnail">
      </a>
    `
  }

  productThumbsImgContainer.innerHTML = productImages;

  let relatedProductsContent = "";

  for(let j=0; j < relatedProducts.length; j++){

    let relatedProduct = relatedProducts[j];

    let {id: relId, name: relName, image: relImage} = relatedProduct;

    relatedProductsContent += `
      <div class="related-card-item">
        <a href="product-info.html" onclick="setProdID(${relId})" class="aside">
          <img src="${relImage}" width="250" height="96" class="img-md img-thumbnail related-img">
        </a>
        <div class="info">
          <a href="product-info.html" onclick="setProdID(${relId})" class="title mb-1 related-text">${relName}</a>
        </div>
      </div>
    `;
  }

  relatedProductsContainer.innerHTML = relatedProductsContent;

    

},

doBigger = (smallImg) =>{
  let bigImg = document.querySelector("#bigImg");
  bigImg.src = smallImg.src;
  productCoverImg = smallImg.src;
},

sortComments = (criteria, array) =>{
  
  let result = [];
  
  if (criteria === ORDER_BY_COMMENT_DATE){
    result = array.sort(function(a, b) {

      let aDate = a.dateTime;
      let bDate = b.dateTime;

      if ( aDate < bDate ){ return -1; }
      if ( aDate > bDate ){ return 1; }

      return 0;
    });
  }
  return result
},

addComment = (array) => {

  let userName = "",
      userImgUrl = "",
      msg = commentTextArea.value,
      score = 0,
      nonFormatDate = new Date(),
      timeOptions = {hour: 'numeric', minute: 'numeric', second: 'numeric'},
      secondDigitMonth = "",
      secondDigitDate = "";

  score = rate1.checked ? score = 1 : rate2.checked ? score = 2 : rate3.checked ? score = 3 : rate4.checked ? score = 4 : rate5.checked ? score = 5 : score = 0;
      
  if(nonFormatDate.getMonth() + 1 < 10 && nonFormatDate.getDate() < 10){
    secondDigitMonth = 0;
    secondDigitDate = 0;
  }else if(nonFormatDate.getMonth() + 1 < 10){
    secondDigitMonth = 0;
  }else if(nonFormatDate.getDate() < 10){
    secondDigitDate = 0;
  }

  let date = `${nonFormatDate.getFullYear()}-${secondDigitMonth}${nonFormatDate.getMonth() + 1}-${secondDigitDate}${nonFormatDate.getDate()} ${new Intl.DateTimeFormat('es-UY', timeOptions).format(nonFormatDate)}`;
     
  if(userDataG != null){
    userName = userDataG.email;
    userImgUrl = userDataG.profileImg;
  }else if(userEmailInfo != null){
    userName = userEmailInfo;
  }

  let newComment = {
    dateTime: date,
    description: msg,
    product: prodID,
    score: score,
    user: userName,
    userImg: userImgUrl
  }

  let newCommentsInfo = array.push(newComment);

  return newCommentsInfo
},

showProductComments = () =>{

  let blockQuote = "";

  commentsCount = commentsInfo.length;
       
  for(let k=0; k < commentsInfo.length; k++){

    let comment = commentsInfo[k],
        
    stars = ["", "", "", "", ""],

    {user: user, dateTime: dateTime, description: msg, score: score = 0, userImg: userImgUrl = "img/img_perfil.png"} = comment;

    for(let z=0; z < score; z++){
      stars[z] = "checked";
    }

    totalScoreCount += score;

    blockQuote += `
      <blockquote class="border-bottom">
        <div class="float-lg-end d-flex mb-3">
          <div class="btn-group d-inline-flex me-2"> 
            <button class="btn btn-light btn-sm float-end" data-bs-toggle="tooltip" data-bs-title="Like">
              <i class="fa fa-thumbs-up"></i>
            </button>
          </div> 
          <button class="btn btn-light btn-sm float-end ">
            <i class="fa fa-ellipsis-v"></i>
          </button>
        </div>
        <div class="icontext">
          <div>
            <img src=${userImgUrl} width="40" height="40" class="img-xs icon rounded-circle userImg">
          </div>
          <div class="text">
            <h6 class="mb-0">${user}</h6>
            <div class="rating-wrap">
              <ul class="rating-stars">
                <li style="width:80%" class="stars-active"> 
                  <span class="fas fa-star ${stars[0]}"></span>
                  <span class="fas fa-star ${stars[1]}"></span>
                  <span class="fas fa-star ${stars[2]}"></span>
                  <span class="fas fa-star ${stars[3]}"></span>
                  <span class="fas fa-star ${stars[4]}"></span> 
                </li>
              </ul> 
              <i class="fas dot text-muted"></i>
              <small class="label-rating text-muted">${dateTime}</small>
            </div>
          </div>
        </div> <!-- icontext.// -->
        <div class="mt-3">
          <p>${msg}</p>
        </div>
      </blockquote>
    `;
  }

  productCommentsContainer.innerHTML = blockQuote; 
  
},

avgProductScore = () =>{

  let avgScore = totalScoreCount / commentsCount,
  
      starsTotal = 5,
   
      starPercentage = (avgScore / starsTotal) * 100,

      starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`,

      twoDigitsAvgScore = avgScore.toFixed(1),

      oneDigitAvgScore = avgScore.toFixed(0);

  if(twoDigitsAvgScore === 0.5){
    starPercentageRounded = "10%";

  }else if(twoDigitsAvgScore >= 0.6 && twoDigitsAvgScore <= 1.4){
    starPercentageRounded = "20%";
    avgScore = oneDigitAvgScore;

  }else if(twoDigitsAvgScore === 1.5){
    starPercentageRounded = "30%";

  }else if(twoDigitsAvgScore >= 1.6 && twoDigitsAvgScore <= 2.4){
    starPercentageRounded = "40%";
    avgScore = oneDigitAvgScore;

  }else if(twoDigitsAvgScore === 2.5){
    starPercentageRounded = "50%";

  }else if(twoDigitsAvgScore >= 2.6 && twoDigitsAvgScore <= 3.4){
    starPercentageRounded = "60%";
    avgScore = oneDigitAvgScore;

  }else if(twoDigitsAvgScore === 3.5){
    starPercentageRounded = "70%";

  }else if(twoDigitsAvgScore >= 3.6 && twoDigitsAvgScore <= 4.4){
    starPercentageRounded = "80%";
    avgScore = oneDigitAvgScore;

  }else if(twoDigitsAvgScore === 4.5){
    starPercentageRounded = "90%";

  }else if(twoDigitsAvgScore >= 4.6){
    starPercentageRounded = "100%";
    avgScore = 5;

  }

  if(commentsCount === 0 || avgScore <= 0.4){

    starPercentageRounded = "0%";
    avgScore = 0;
    avgScoreContainer.innerText = `${avgScore}`;

  }else{

    avgScoreContainer.innerText = `${avgScore}`;

  }

  document.querySelector(".stars-inner").style.width = starPercentageRounded;

};

sendCommentBtn.addEventListener("click", () => {

  commentStatus = true;

  let starsWidget = document.querySelector(".star-widget");

  if(commentTextArea.value && (rate1.checked || rate2.checked || rate3.checked || rate4.checked || rate5.checked)){

    commentTextArea.classList.remove("is-invalid");
    starsWidget.classList.remove("is-invalid");

    totalScoreCount = 0;

    addComment(commentsInfo);
    window.localStorage.setItem(`comments${prodID}`, JSON.stringify(commentsInfo))
    commentsInfo = JSON.parse(localStorage.getItem(`comments${prodID}`));


    commentTextArea.value = "";
    rate1.checked = false;
    rate2.checked = false;
    rate3.checked = false;
    rate4.checked = false;
    rate5.checked = false;

    showProductComments();
    avgProductScore();

  }else if((!commentTextArea.value) && (!rate1.checked && !rate2.checked && !rate3.checked && !rate4.checked && !rate5.checked)){

    commentTextArea.classList.add("is-invalid");
    starsWidget.classList.add("is-invalid");

  }else if ((commentTextArea.value) && (!rate1.checked && !rate2.checked && !rate3.checked && !rate4.checked && !rate5.checked)){

    commentTextArea.classList.remove("is-invalid");
    starsWidget.classList.add("is-invalid");

  }else if((!commentTextArea.value) && (rate1.checked || rate2.checked || rate3.checked || rate4.checked || rate5.checked)){

    commentTextArea.classList.add("is-invalid");
    starsWidget.classList.remove("is-invalid");
  }
 
}),

modal = document.querySelector("#myModal"),
modalImg = document.querySelector("#img01"),

fullPicture = () => {
  modal.style.display = "block";
  modalImg.src = productCoverImg;
  console.log(modalImg.src)
},

pictureClose = () =>{
  modal.style.display = "none";
};

document.addEventListener("DOMContentLoaded", async () => {

  //Condicional que evalua si el usuario no esta logeado y
  //redirecciona a login.html
  if(loginStatusInfo === "false" || loginStatusInfo === null){
    replace("login.html");
  }else{
    showProfileMenu();
    if(userDataG != null){
      userImg.src = userDataG.profileImg;
    }
    logOutEvent();
  }
    
  //Codigo que hace fetch a la url dinamica de un producto.
  const productObj = await getJSONData(prodUrl)
  if (productObj.status === "ok"){
    productInfo = productObj;
    showProductInfo()
  }

  let comments = JSON.parse(localStorage.getItem(`comments${prodID}`));

  //Codigo que hace fetch a la url dinamica de un producto.
  const commentsObj = await getJSONData(commentsUrl)
  if (commentsObj.status === "ok" && comments === null){
    commentsInfo = commentsObj;
    commentsInfo = sortComments(ORDER_BY_COMMENT_DATE, commentsInfo);
    showProductComments();
    avgProductScore();
  }else{
    commentsInfo = comments;
    showProductComments();
    avgProductScore();
  }
});