// var mysite = "http://127.0.0.1:8000";
// var mysite = "https://aquariumschool.co";

// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(time) {
	var date = new Date(time),
		diff = (new Date().getTime() - date.getTime()) / 1000,
		day_diff = Math.floor(diff / 86400);
	var year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate();

	if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31)
		return (
			year.toString() +
			"-" +
			(month < 10 ? "0" + month.toString() : month.toString()) +
			"-" +
			(day < 10 ? "0" + day.toString() : day.toString())
		);

	var r =
		(day_diff == 0 &&
			((diff < 60 && "justo ahora") ||
				(diff < 120 && "Hace 1 minuto") ||
				(diff < 3600 && "Hace " + Math.floor(diff / 60) + " minutos") ||
				(diff < 7200 && "Hace 1 hora") ||
				(diff < 86400 && "Hace " + Math.floor(diff / 3600) + " horas"))) ||
		(day_diff == 1 && "Ayer") ||
		(day_diff < 7 && "Hace " + day_diff + " días") ||
		(day_diff < 31 && "Hace " + Math.ceil(day_diff / 7) + " semanas");
	return r;
}

//  START LOAD STUDENTS JS

// Start with first student
let student_counter = 0;

// Load 30 students at a time
const student_quantity = 30;

// All students loaded
let all_students = false;

// When DOM loads, render the first 30 students
document.addEventListener("DOMContentLoaded", load_students);

// Function that creates INIFINE SCROLLING for students

$(window).scroll(function () {
	if (
		$(window).scrollTop() + $(window).height() >= $(document).height() - 200 &&
		all_students === false
	) {
		load_students();
	}
});

// Load next set of students
function load_students() {
	// Set start and end students numbers, and update counter
	const start = student_counter;
	const end = student_counter + student_quantity;
	student_counter = end + 1;

	// Fetch new students and add them
	$.ajax({
		type: "GET",
		url: `${mysite}/courses/load_students/`,
		data: {
			start: start,
			end: end,
		},
		beforeSend: function () {
			document.querySelector("#loadStudents").classList.add("loader");
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);
			document.querySelector("#loadStudents").classList.remove("loader");

			if (response["all_loaded"] === true) {
				all_students = true;
			}

			for (
				var studentID = 0;
				studentID < response["students"].length;
				studentID++
			) {
				login = prettyDate(response["students"][studentID]["real_last_login"]);
				$("#students_table").append(`<tr> \
                                                <td scope="row" data-label="Documento"> \
                                                    <a href="${mysite}/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["identity_document"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Nombres">\
                                                    <a href="${mysite}/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["first_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Apellidos">\
                                                    <a href="${mysite}/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["last_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (1)">\
                                                    <a href="${mysite}/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["phone_1"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (2)">\
                                                    <a href="${mysite}/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["phone_2"]}</a>\
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Últ. vez">\
                                                    <a href="${mysite}/courses/student/${response["students"][studentID]["id"]}">${login}</a>\
                                                </td>\
                                            </tr>`);
			}
		},
	});
}

//  END LOAD STUDENTS JS
