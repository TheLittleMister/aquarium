function edit() {

    if (document.querySelector("#righttop").style.display === "block") {
        
        document.querySelector("#righttop").style.display = "none";
        document.querySelector("#rightmiddle").style.display = "none";
        document.querySelector("#rightbottom").style.display = "none";
        document.querySelector("#editform").style.display = "block";
        document.querySelector("#option").innerHTML = "Atrás";

    } else {

        document.querySelector("#righttop").style.display = "block";
        document.querySelector("#rightmiddle").style.display = "block";
        document.querySelector("#rightbottom").style.display = "block";
        document.querySelector("#editform").style.display = "none";
        document.querySelector("#option").innerHTML = "Editar Cuenta";
        
    }
    
}