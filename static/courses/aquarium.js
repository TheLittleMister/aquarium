document.addEventListener("click", event => {

    const element = event.target;

    if (element.id.slice(0,5) === "check") {

        id = element.id.slice(5,);

        fetch(`/courses/attendance/${id}`)
        .then(response => response.json())
        .then(attendance => {

            element.innerHTML = attendance;

            if (attendance === "ASISTIO") {
                element.className = "badge badge-success";

            } else if (attendance === "NO ASISTIO") {
                element.className = "badge badge-danger";

            } else {
                element.className = "badge badge-secondary";
            }
            
        });

    } else if (element.id.slice(0,3) === "pay") {

        id = element.id.slice(3,);

        fetch(`/courses/pay/${id}`)
        .then(response => response.json())
        .then(pay => {

            element.innerHTML = `CUPO ${pay}`;

            if (pay === "PAGO") {
                element.className = "badge badge-success";

            } else if (pay === "NO PAGO") {
                element.className = "badge badge-danger";

            } else {
                element.className = "badge badge-secondary";
            }

        });

    }
});

document.addEventListener("DOMContentLoaded", () => {

    fetch(`/courses/notifications/`)
    .then(response => response.json())
    .then(count => {

        var notielement = document.querySelector('#notifications');
        notielement.innerHTML = `${count}`;

        if (count > 0) {
            notielement.className = "badge badge-danger";
        }
    });
    
    document.querySelector('#form-date').onsubmit = () => {

        console.log("Hello, World!")

        const date = document.querySelector("#add-date").value;
        const js_date = new Date(date);

        var weekday = {
            0: "Domingo",
            1: "Lunes",
            2: "Martes",
            3: "Miercoles",
            4: "Jueves",
            5: "Viernes",
            6: "Sabado",
        };

        var month = {
            "01": "Enero",
            "02": "Febrero", 
            "03": "Marzo", 
            "04": "Abril", 
            "05": "Mayo", 
            "06": "Junio", 
            "07": "Julio", 
            "08": "Agosto", 
            "09": "Septiembre", 
            "10": "Octubre", 
            "11": "Noviembre", 
            "12": "Diciembre",
        };
    
        var option = document.createElement("option");

        option.value = date;
        option.selected = true;

        if (js_date.getDay() === 6) {
            var theweekday = 0;
        } else {
            var theweekday = js_date.getDay() + 1;
        }

        option.innerHTML = weekday[theweekday] + " " + date.slice(8,10) + " de " + month[date.slice(5,7)] + " del " + date.slice(0,4);
        document.querySelector("#dates").append(option);
    
        return false;

    }
    
});

function quota() {

    document.querySelector("#quota").style.display = "none";
    document.querySelector("#quota-form").style.display = "block"
    
}

function student_edit() {

    document.querySelector("#student-edit").style.display = "none";
    document.querySelector("#student-schedule").style.display = "none";
    document.querySelector("#student-next").style.display = "none";
    document.querySelector("#student-pag").style.display = "none";
    document.querySelector("#warning-message").style.display = "none";

    document.querySelector("#student-delete").style.display = "block";
    document.querySelector("#student-edit-back").style.display = "inline-block";
    document.querySelector("#student-form").style.visibility = "visible";


};

function student_edit_back() {

    document.querySelector("#student-edit").style.display = "inline-block";
    document.querySelector("#student-schedule").style.display = "block";
    document.querySelector("#student-next").style.display = "block";
    document.querySelector("#student-pag").style.display = "block";
    document.querySelector("#warning-message").style.display = "block";

    document.querySelector("#student-delete").style.display = "none";
    document.querySelector("#student-edit-back").style.display = "none";
    document.querySelector("#student-form").style.visibility = "hidden";


};

function course_edit() {
    document.querySelector("#course-students").style.display = "none";
    document.querySelector("#course-edit").style.display = "none";

    document.querySelector("#course-edit-back").style.display = "inline-block";
    document.querySelector("#course-form").style.visibility = "visible";
    document.querySelector("#course-delete").style.display = "block";

}

function course_edit_back() {
    document.querySelector("#course-students").style.display = "block";
    document.querySelector("#course-edit").style.display = "inline-block";

    document.querySelector("#course-edit-back").style.display = "none";
    document.querySelector("#course-form").style.visibility = "hidden";
    document.querySelector("#course-delete").style.display = "none";

}