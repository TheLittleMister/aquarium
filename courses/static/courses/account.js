// AJAX / Check user requests

$(document).ready(function(){
    $("#rcheck").mouseover(function(){
      $("#rcheck").removeClass("badge badge-warning");
      $("#rcheck").addClass("badge badge-success");

    });
    $("#rcheck").mouseout(function(){
      $("#rcheck").removeClass("badge badge-success");
      $("#rcheck").addClass("badge badge-warning");
    });
});

$(document).ready(function(){
    $("#rxcheck").mouseover(function(){
      $("#rxcheck").removeClass("badge badge-warning");
      $("#rxcheck").addClass("badge badge-danger");

    });
    $("#rxcheck").mouseout(function(){
      $("#rxcheck").removeClass("badge badge-danger");
      $("#rxcheck").addClass("badge badge-warning");
    });
});

$(document).ready(function(){
    $("#rcheck1").mouseover(function(){
      $("#rcheck1").removeClass("badge badge-warning");
      $("#rcheck1").addClass("badge badge-success");

    });
    $("#rcheck1").mouseout(function(){
      $("#rcheck1").removeClass("badge badge-success");
      $("#rcheck1").addClass("badge badge-warning");
    });
});

$(document).ready(function(){
    $("#rxcheck1").mouseover(function(){
      $("#rxcheck1").removeClass("badge badge-warning");
      $("#rxcheck1").addClass("badge badge-danger");

    });
    $("#rxcheck1").mouseout(function(){
      $("#rxcheck1").removeClass("badge badge-danger");
      $("#rxcheck1").addClass("badge badge-warning");
    });
});

$(document).ready(function(){
    $("#rcheck2").mouseover(function(){
      $("#rcheck2").removeClass("badge badge-warning");
      $("#rcheck2").addClass("badge badge-success");

    });
    $("#rcheck2").mouseout(function(){
      $("#rcheck2").removeClass("badge badge-success");
      $("#rcheck2").addClass("badge badge-warning");
    });
});

$(document).ready(function(){
    $("#rxcheck2").mouseover(function(){
      $("#rxcheck2").removeClass("badge badge-warning");
      $("#rxcheck2").addClass("badge badge-danger");

    });
    $("#rxcheck2").mouseout(function(){
      $("#rxcheck2").removeClass("badge badge-danger");
      $("#rxcheck2").addClass("badge badge-warning");
    });
});

$(document).ready(function(){
    $("#rcheck3").mouseover(function(){
      $("#rcheck3").removeClass("badge badge-warning");
      $("#rcheck3").addClass("badge badge-success");

    });
    $("#rcheck3").mouseout(function(){
      $("#rcheck3").removeClass("badge badge-success");
      $("#rcheck3").addClass("badge badge-warning");
    });
});

$(document).ready(function(){
    $("#rxcheck3").mouseover(function(){
      $("#rxcheck3").removeClass("badge badge-warning");
      $("#rxcheck3").addClass("badge badge-danger");

    });
    $("#rxcheck3").mouseout(function(){
      $("#rxcheck3").removeClass("badge badge-danger");
      $("#rxcheck3").addClass("badge badge-warning");
    });
});

$(document).ready(function(){
    $("#rcheck4").mouseover(function(){
      $("#rcheck4").removeClass("badge badge-warning");
      $("#rcheck4").addClass("badge badge-success");

    });
    $("#rcheck4").mouseout(function(){
      $("#rcheck4").removeClass("badge badge-success");
      $("#rcheck4").addClass("badge badge-warning");
    });
});

$(document).ready(function(){
    $("#rxcheck4").mouseover(function(){
      $("#rxcheck4").removeClass("badge badge-warning");
      $("#rxcheck4").addClass("badge badge-danger");

    });
    $("#rxcheck4").mouseout(function(){
      $("#rxcheck4").removeClass("badge badge-danger");
      $("#rxcheck4").addClass("badge badge-warning");
    });
});

function edit() {

  if (document.querySelector("#righttop").style.display === "block") {
      
      document.querySelector("#righttop").style.display = "none";
      document.querySelector("#rightmiddle").style.display = "none";
      document.querySelector("#rightbottom").style.display = "none";
      document.querySelector("#editform").style.visibility = "visible";
      document.querySelector("#option").innerHTML = "Atrás";

  } else {

      document.querySelector("#righttop").style.display = "block";
      document.querySelector("#rightmiddle").style.display = "block";
      document.querySelector("#rightbottom").style.display = "block";
      document.querySelector("#editform").style.visibility = "hidden";
      document.querySelector("#option").innerHTML = "Editar Cuenta";
      
  }
  
}

function editcourse() {

  if (document.querySelector("#righttop").style.display === "block") {
      
      document.querySelector("#righttop").style.display = "none";
      document.querySelector("#editform").style.visibility = "visible";
      document.querySelector("#option").innerHTML = "Atrás";

  } else {

      document.querySelector("#righttop").style.display = "block";
      document.querySelector("#editform").style.visibility = "hidden";
      document.querySelector("#option").innerHTML = "Editar Cuenta";
      
  }
  
}

function student_secure_delete() {

  document.querySelector("#editform").style.display = "none";
  document.querySelector("#option").style.visibility = "hidden";
  document.querySelector("#student_secure_delete").style.display = "block";

}

function student_secure_delete_back() {

  document.querySelector("#editform").style.display = "block";
  document.querySelector("#option").style.visibility = "visible";
  document.querySelector("#student_secure_delete").style.display = "none";

}

function course_secure_delete() {

  document.querySelector("#editform").style.display = "none";
  document.querySelector("#option").style.visibility = "hidden";
  document.querySelector("#course_secure_delete").style.display = "block";


}

function course_secure_delete_back() {

  document.querySelector("#editform").style.display = "block";
  document.querySelector("#option").style.visibility = "visible";
  document.querySelector("#course_secure_delete").style.display = "none";

}