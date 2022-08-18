document.addEventListener("DOMContentLoaded", function(){

    //Condicional que evalua si el usuario no esta logeado y
    //redirecciona a login.html
    if(loginStatus === "false"){
        window.location.replace("login.html");
    }
    

    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });

    //Variable que guarda los datos del usuario llamados desde el
    //localstorage en formato de objeto.
    let user = JSON.parse(window.localStorage.getItem("userData"));
    
    console.log(loginStatus);
    console.log(user.fullName);
});