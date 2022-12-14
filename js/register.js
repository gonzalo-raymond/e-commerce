window.addEventListener("load", ()=> {

    
    //Alerta de Datos Correctos.
    function showAlertSuccess() {
        document.getElementById("alert-danger").classList.remove("show");
        document.getElementById("alert-success").classList.add("show");
        setTimeout(()=>{
            document.getElementById("alert-success").classList.remove("show");  
        }, 2500);
    }

    //Alerta de Datos Incorrectos.
    function showAlertError() {
        document.getElementById("alert-success").classList.remove("show");
        document.getElementById("alert-danger").classList.add("show");
        setTimeout(()=>{
            document.getElementById("alert-danger").classList.remove("show");  
        }, 3500);
    }

    //Referenciando los elementos del DOM.
    const nameInput = document.getElementById("nombre");
    const lastNameInput = document.getElementById("apellido");
    const emailInput = document.getElementById("email");
    const passInput = document.getElementById("password1");
    const passConfirmInput = document.getElementById("password2");
    const checkbox = document.getElementById("terminos");
    const regBtn = document.getElementById("regBtn");
    const backBtn = document.getElementById("goBack");


    backBtn.addEventListener("click", () => {

        setTimeout(()=>{
            backBtn.blur();
        }, 200);
        
        replace("login.html");

    });

    //Escuchando Eventos de click y presion de tecla enter
    // que actua sobre el estado del checkbox de terminos y condiciones.
    checkbox.addEventListener("click", ()=> {
        if(checkbox.value === "off"){
            checkbox.value = "on"
        }else{
            checkbox.value = "off"
        }
    })

    checkbox.addEventListener("keypress", (e)=> {
        if(e.key === "Enter"){
            if((checkbox.value === "off") && (!checkbox.checked)){
                checkbox.value = "on";
                checkbox.checked = (!checkbox.checked);
            }else{
                regBtn.click();
            }
        } 
    });

    //Escuchando Evento de click que actua sobre
    //el boton de registro y activa la funci??n de
    //validaci??n de datos adem??s evalua las condiciones
    //que determinan que cartel debe mostrarse.
    regBtn.addEventListener("click", ()=> {

        validateFields();
        if(nameOk && lastNameOk && emailOk && passOk && passConfirmOk && termsOk){

            let sameUserData = window.localStorage.getItem(`userData${emailInput.value}`);

            if(sameUserData === null){


                let userData = {
                    firstName: nameInput.value,
                    secondName: "",
                    lastName: lastNameInput.value,
                    secondLastName: "",
                    email: emailInput.value,
                    contactTelephoneNumber: "",
                    profileImg: "img/img_perfil.png"
                };
              
                window.localStorage.setItem(`userData${emailInput.value}`, JSON.stringify(userData));
                
                showAlertSuccess();
                replace("login.html");
                
            }else{
                showAlertError();
            }

            
        }else{
            showAlertError();
        } 
    });

    //Codigo que permite que al presionar la tecla Enter
    //hacerle focus al siguiente input.
    let inputs = document.getElementsByClassName("trigger-tab");
    let allInputs = document.getElementsByTagName("input");

    for(let n=0; n < inputs.length; n++){
        let target = inputs[n];
        let nextInput = allInputs[n+1];
        
        target.addEventListener("keypress", (e)=>{
            if(e.key === "Enter"){
                e.preventDefault
                nextInput.focus();
            }
        });  
    };

    //Estados de Validaci??n para mostrar 
    //el cartel correspondiente.
    let nameOk = false;
    let lastNameOk = false;
    let emailOk = false;
    let passOk = false;
    let passConfirmOk = false;
    let termsOk = false;

    //Funci??n que actua cuando un campo
    //no es valido.
    const validateFail = (input, msg) => {
        const inputContainer = input.parentElement;
        const notice = inputContainer.querySelector("p");
        notice.innerText = msg
        input.classList.add('is-invalid');
    };

    //Funci??n que actua cuando un campo
    //es valido.
    const validateOk = (input) => {
        const inputContainer = input.parentElement;
        const notice = inputContainer.querySelector("p");
        notice.innerText = "";
        input.classList.remove('is-invalid');
    };

    //Funci??n que valida el email
    //haciendo uso de expresiones
    //regulares.
    const validEmail = (email) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email);
    }
   
    //Funci??n que se activa al hacer click
    //en el boton de registro y valida 
    //los campos del formulario del registro.
    const validateFields = ()=> {

        //Capturando los valores ingresados por el usuario.
        const nameValue = nameInput.value.trim();
        const lastNameValue = lastNameInput.value.trim();
        const emailValue = emailInput.value.trim();
        const passValue = passInput.value.trim();
        const passConfirmValue = passConfirmInput.value.trim();
        const termsValue = checkbox.value;


        //Validando campo Nombre.
        if(!nameValue){
            validateFail(nameInput, "Ingresa tu nombre");
            nameOk = false;
        }else{
            validateOk(nameInput);
            nameOk = true;
        }

        //Validando campo Apellido.
        if(!lastNameValue){
            validateFail(lastNameInput, "Ingresa tu apellido");
            lastNameOk = false;
        }else{
            validateOk(lastNameInput);
            lastNameOk = true;
        }

        //Validando campo Email.
        if(!emailValue){
            validateFail(emailInput, "Ingresa tu e-mail");
            emailOk = false;
        }else if(!validEmail(emailValue)){
            validateFail(emailInput, "El e-mail no es valido el formato debe ser email@dominio.com");
            emailOk = false;
        }else{
            validateOk(emailInput);
            emailOk = true;
        }

        //Validando campo Contrase??a.
        if(!passValue){
            validateFail(passInput, "Ingresa tu contrase??a");
            passOk = false;
        }else if(passValue.length < 6){
            validateFail(passInput, "La contrase??a debe tener m??nimo 6 caracteres");
            passOk = false;
        }else{
            validateOk(passInput);
            passOk = true;
        }

        //Validando campo Repetir Contrase??a.
        if(!passConfirmValue){
            validateFail(passConfirmInput, "Ingresa tu contrase??a nuevamente");
            passConfirmOk = false;
        }else if(passConfirmValue === passValue){
            validateOk(passConfirmInput);
            passConfirmOk = true;
        }else{
            validateFail(passConfirmInput, "La contrase??a ingresada no coincide");
            passConfirmOk = false;
        }

        //Validando Checkbox Terminos.
        if(termsValue === "off"){
            validateFail(checkbox, "Debe aceptar terminos y condiciones para continuar");
            termsOk = false;
        }else{
            validateOk(checkbox);
            termsOk = true;
        } 
    }
})