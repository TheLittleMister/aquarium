// var mysite = "http://127.0.0.1:8000";
var mysite = "https://aquariumschool.co";

// Start with first past course
let pastCourseCounter = 0;

// Load 20 past courses at a time
const pastCoursesQuantity = 30;

// All past courses loaded
let allPastCoursesLoaded = false;

// When DOM loads, render the first 30 past courses
document.addEventListener("DOMContentLoaded", load_past_courses);

// Function the creates INFINITE SCROLLING for past courses

$(window).scroll(function () {
	if (
		$(window).scrollTop() + $(window).height() == $(document).height() &&
		allPastCoursesLoaded === false
	) {
		load_past_courses();
	}
});

// Load next set of past courses

function load_past_courses() {
	// Set start and end past courses numbers, and update counter
	const start = pastCourseCounter;
	const end = pastCourseCounter + pastCoursesQuantity;
	pastCourseCounter = end + 1;

	// Fetch new past courses and add them

	$.ajax({
		type: "GET",
		url: `${mysite}/courses/load_past_courses/`,
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
				allPastCoursesLoaded = true;
			}

			for (
				var courseID = 0;
				courseID < response["courses"].length;
				courseID++
			) {
				$("#pastCoursesTableBody").append(`<tr> \
                                                <td scope="row" data-label="No."> \
                                                    <a id="count${response["courses"][courseID]["id"]}" href="${mysite}/courses/course/${response["courses"][courseID]["id"]}"></a>\
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Clase">\
                                                    <a id="courseName${response["courses"][courseID]["id"]}" href="${mysite}/courses/course/${response["courses"][courseID]["id"]}"></a>\
                                                </td>\
                                            </tr>`);

				fetch(
					`${mysite}/courses/course_info/${response["courses"][courseID]["id"]}`
				)
					.then((data) => data.json())
					.then((data) => {
						document.querySelector(
							`#courseName${data["course_id"]}`
						).innerHTML = data["courseStr"];

						document.querySelector(`#count${data["course_id"]}`).innerHTML =
							data["courseCount"];
					});
			}
		},
	});
}
// Start with first future course
let futureCourseCounter = 0;

// Load 20 future courses at a time
const futureCoursesQuantity = 30;

// All future courses loaded
let allFutureCoursesLoaded = false;

// When DOM loads, render the first 30 future courses
document.addEventListener("DOMContentLoaded", load_future_courses);

// Function the creates INFINITE SCROLLING for future courses

$(window).scroll(function () {
	if (
		$(window).scrollTop() + $(window).height() == $(document).height() &&
		allFutureCoursesLoaded === false
	) {
		load_future_courses();
	}
});

// Load next set of future courses

function load_future_courses() {
	// Set start and end future courses numbers, and update counter
	const start = futureCourseCounter;
	const end = futureCourseCounter + futureCoursesQuantity;
	futureCourseCounter = end + 1;

	// Fetch new future courses and add them

	$.ajax({
		type: "GET",
		url: `${mysite}/courses/load_future_courses/`,
		data: {
			start: start,
			end: end,
		},
		beforeSend: function () {
			document.querySelector("#loadFutureAttendances").classList.add("loader");
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);

			document
				.querySelector("#loadFutureAttendances")
				.classList.remove("loader");

			if (response["all_loaded"] === true) {
				allFutureCoursesLoaded = true;
			}

			for (
				var courseID = 0;
				courseID < response["courses"].length;
				courseID++
			) {
				$("#futureCoursesTableBody").append(`<tr> \
                                                <td scope="row" data-label="No."> \
													<a id="count${response["courses"][courseID]["id"]}" href="${mysite}/courses/course/${response["courses"][courseID]["id"]}"></a>\
													<span id="today${response["courses"][courseID]["id"]}" class="badge bg-success" style="font-size: small; color: white;"></span>\
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Clase">\
                                                    <a id="courseName${response["courses"][courseID]["id"]}" href="${mysite}/courses/course/${response["courses"][courseID]["id"]}"></a>\
                                                </td>\
                                            </tr>`);

				fetch(
					`${mysite}/courses/course_info/${response["courses"][courseID]["id"]}`
				)
					.then((data) => data.json())
					.then((data) => {
						document.querySelector(
							`#courseName${data["course_id"]}`
						).innerHTML = data["courseStr"];

						document.querySelector(`#count${data["course_id"]}`).innerHTML =
							data["courseCount"];

						if (data["today"] == true) {
							document.querySelector(`#today${data["course_id"]}`).innerHTML =
								"HOY";
						}
					});
			}
		},
	});
}

$("#courseSearchForm").submit(function (e) {
	e.preventDefault();

	var form = $(this);

	$.ajax({
		type: "GET",
		url: `${mysite}/courses/search_course/`,
		data: form.serialize(),
		beforeSend: function () {
			document.querySelector("#searchCoursesTableBody").innerHTML = "";
			document.querySelector("#searchDateButton").style.display = "none";
			document.querySelector("#searchDateLoader").classList.add("loader");
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);

			if (response["courses"].length > 0) {
				for (
					var courseID = 0;
					courseID < response["courses"].length;
					courseID++
				) {
					$("#searchCoursesTableBody").append(`<tr> \
                                                <td scope="row" data-label="No."> \
													<a id="count${response["courses"][courseID]["id"]}" href="${mysite}/courses/course/${response["courses"][courseID]["id"]}"></a>\
													<span id="today${response["courses"][courseID]["id"]}" class="badge bg-success" style="font-size: small; color: white;"></span>\
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Clase">\
                                                    <a id="courseName${response["courses"][courseID]["id"]}" href="${mysite}/courses/course/${response["courses"][courseID]["id"]}"></a>\
                                                </td>\
                                            </tr>`);

					fetch(
						`${mysite}/courses/course_info/${response["courses"][courseID]["id"]}`
					)
						.then((data) => data.json())
						.then((data) => {
							document.querySelector(
								`#courseName${data["course_id"]}`
							).innerHTML = data["courseStr"];

							document.querySelector(`#count${data["course_id"]}`).innerHTML =
								data["courseCount"];

							if (data["today"] == true) {
								document.querySelector(`#today${data["course_id"]}`).innerHTML =
									"HOY";
							}
						});
				}
			} else {
				$("#searchCoursesTableBody").append(`<tr> \
                                                <td scope="row" data-label="No.">-</td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Clase">SIN RESULTADOS</td>\
                                            </tr>`);
			}
			document.querySelector("#searchDateLoader").classList.remove("loader");
			document.querySelector("#searchDateButton").style.display = "block";
		},
	});
});

$("#createCoursesForm").submit(function (e) {
	e.preventDefault();

	var form = $(this);
	$("#id_students_to option").prop("selected", true);
	$("#id_teachers_to option").prop("selected", true);

	$.ajax({
		type: "POST",
		url: `${mysite}/courses/create_courses/`,
		data: form.serialize(),
		beforeSend: function () {
			document.querySelector("#createCoursesButton").style.display = "none";
			document.querySelector("#loadCreateCourses").classList.add("loader");
			document
				.querySelector("#createCoursesMessages")
				.classList.remove("alert");

			document
				.querySelector("#createCoursesMessages")
				.classList.remove("alert-danger");

			document.querySelector("#createCoursesMessages").innerHTML = "";
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);

			document.querySelector("#loadCreateCourses").classList.remove("loader");
			document.querySelector("#createCoursesButton").style.display = "block";

			if (response["messages"].length > 0) {
				for (messageID in response["messages"]) {
					document
						.querySelector("#createCoursesMessages")
						.classList.add("alert");
					document
						.querySelector("#createCoursesMessages")
						.classList.add("alert-danger");
					$("#createCoursesMessages").append(
						`<li class="ml-2">${response["messages"][messageID]}</li>`
					);
				}
			} else {
				document.querySelector("#createdCoursesTableBody").innerHTML = "";
				for (
					var courseID = 0;
					courseID < response["courses"].length;
					courseID++
				) {
					$("#createdCoursesTableBody").append(`<tr> \
                                                <td scope="row" data-label="No."> \
													<a id="count${response["courses"][courseID]["id"]}" href="${mysite}/courses/course/${response["courses"][courseID]["id"]}">${response["courses"][courseID]["count"]}</a>\
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Clase">\
                                                    <a id="courseName${response["courses"][courseID]["id"]}" href="${mysite}/courses/course/${response["courses"][courseID]["id"]}">${response["courses"][courseID]["str"]}</a>\
                                                </td>\
                                            </tr>`);
				}

				$("#modalShowCreatedCourse").modal("show");
			}
		},
	});
});

$("#form-date").submit(function (e) {
	e.preventDefault();

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
		10: "Octubre",
		11: "Noviembre",
		12: "Diciembre",
	};

	var option = document.createElement("option");

	option.value = date;
	option.selected = true;

	if (js_date.getDay() === 6) {
		var theweekday = 0;
	} else {
		var theweekday = js_date.getDay() + 1;
	}

	option.innerHTML =
		weekday[theweekday] +
		" " +
		date.slice(8, 10) +
		" de " +
		month[date.slice(5, 7)] +
		" del " +
		date.slice(0, 4);
	document.querySelector("#dates").append(option);
});
