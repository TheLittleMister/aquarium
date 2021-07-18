// var mysite = "http://127.0.0.1:8000";
// var mysite = "https://aquariumschool.co";

// START LOAD FUTURE ATTENDANCES

// Start with first future attendance
let studentFutureAttendanceCounter = 0;

// Load 20 future attendances at a time
const studentFutureAttendancesQuantity = 20;

// All future attendances loaded
let allFutureAttendancesLoaded = false;

// When DOM loads, render the first 20 future attendances
document.addEventListener("DOMContentLoaded", load_future_attendances);

// Function that creates INFINITE SCROLLING for future attendances

$(window).scroll(function () {
	if ($(window).scrollTop() + $(window).height() >= $(document).height() - 200 && allFutureAttendancesLoaded === false) {
		load_future_attendances();
	}
});

function activateToolTip() {
	$('[data-toggle="tooltip"]').tooltip();
}

// Load next set of future attendances
function load_future_attendances() {
	const start = studentFutureAttendanceCounter;
	const end = studentFutureAttendanceCounter + studentFutureAttendancesQuantity;
	studentFutureAttendanceCounter = end + 1;

	let userID = document.querySelector("#userID").getAttribute("value");

	// Fetch new future attendances and add them
	$.ajax({
		type: "GET",
		url: `${mysite}/courses/load_future_attendances/`,
		data: {
			start: start,
			end: end,
			userID: userID,
		},
		beforeSend: function () {
			document.querySelector("#loadFutureAttendances").classList.add("loader");
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);

			document.querySelector("#loadFutureAttendances").classList.remove("loader");

			if (response["all_loaded"] === true) {
				allFutureAttendancesLoaded = true;
			}

			for (var studentID = 0; studentID < response["attendances"].length; studentID++) {
				let attendanceBtnColor;
				let attendanceStr;
				let day = "";

				if (response["attendances"][studentID]["attendance"] === true) {
					attendanceBtnColor = "btn-success";
					attendanceStr = "ASISTIÓ";
				} else {
					attendanceBtnColor = "btn-secondary";
					attendanceStr = "PENDIENTE";
				}

				if (response["attendances"][studentID]["onlyday"] === true) {
					day = "SOLO HOY";
				} else if (response["attendances"][studentID]["recover"] === true) {
					day = "RECUPERA";
				}

				$("#futureAttendancesTableBody").append(`<tr> \
                                                <td scope="row" data-label="Asistencia">\
                                                    <button id="attendanceButton${response["attendances"][studentID]["id"]}" class="btn btn-sm ${attendanceBtnColor}">${attendanceStr}</button>\
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Clase"> \
                                                    <a id="courseName${response["attendances"][studentID]["course__id"]}" href="#"></a> <br>\
													<span id="today${response["attendances"][studentID]["course__id"]}" class="badge bg-success" style="font-size: small; color: white;"></span>\
													<span id="day${response["attendances"][studentID]["id"]}" class="badge bg-primary" style="font-size: small; color: white;">${day}</span>\

												</td>\
                                            </tr>`);

				fetch(`${mysite}/courses/course_info/${response["attendances"][studentID]["course__id"]}`)
					.then((data) => data.json())
					.then((data) => {
						document.querySelector(`#courseName${data["course_id"]}`).innerHTML = data["courseStr"];

						if (data["today"] == true) {
							document.querySelector(`#today${data["course_id"]}`).innerHTML = "HOY";
						}
					});
			}
		},
	});
}
// START LOAD PAST ATTENDANCES

// Start with first past attendance
let studentPastAttendanceCounter = 0;

// Load 20 past attendances at a time
const studentPastAttendancesQuantity = 20;

// All past attendances loaded
let allPastAttendancesLoaded = false;

// When DOM loads, render the first 20 past attendances
document.addEventListener("DOMContentLoaded", load_past_attendances);

// Function that creates INFINITE SCROLLING for past attendances

$(window).scroll(function () {
	if ($(window).scrollTop() + $(window).height() >= $(document).height() - 200 && allPastAttendancesLoaded === false) {
		load_past_attendances();
	}
});

function activateToolTip() {
	$('[data-toggle="tooltip"]').tooltip();
}

// Load next set of past attendances
function load_past_attendances() {
	const start = studentPastAttendanceCounter;
	const end = studentPastAttendanceCounter + studentPastAttendancesQuantity;
	studentPastAttendanceCounter = end + 1;

	let userID = document.querySelector("#userID").getAttribute("value");

	// Fetch new past attendances and add them
	$.ajax({
		type: "GET",
		url: `${mysite}/courses/load_past_attendances/`,
		data: {
			start: start,
			end: end,
			userID: userID,
		},
		beforeSend: function () {
			document.querySelector("#loadPastAttendances").classList.add("loader");
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);

			document.querySelector("#loadPastAttendances").classList.remove("loader");

			if (response["all_loaded"] === true) {
				allPastAttendancesLoaded = true;
			}

			for (var studentID = 0; studentID < response["attendances"].length; studentID++) {
				let attendanceBtnColor;
				let attendanceStr;
				let day = "";

				if (response["attendances"][studentID]["attendance"] === true) {
					attendanceBtnColor = "btn-success";
					attendanceStr = "ASISTIÓ";
				} else {
					attendanceBtnColor = "btn-danger";
					attendanceStr = "NO ASISTIÓ";
				}

				if (response["attendances"][studentID]["onlyday"] === true) {
					day = "SOLO HOY";
				} else if (response["attendances"][studentID]["recover"] === true) {
					day = "RECUPERA";
				}

				$("#pastAttendancesTableBody").append(`<tr> \
                                                <td scope="row" data-label="Asistencia">\
                                                    <button id="attendanceButton${response["attendances"][studentID]["id"]}" class="btn btn-sm ${attendanceBtnColor}">${attendanceStr}</button>\
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Clase"> \
                                                    <a id="courseName${response["attendances"][studentID]["course__id"]}" href="#"></a> <br>\
													<span id="today${response["attendances"][studentID]["course__id"]}" class="badge bg-success" style="font-size: small; color: white;"></span>\
													<span id="day${response["attendances"][studentID]["id"]}" class="badge bg-primary" style="font-size: small; color: white;">${day}</span>\
												</td>\
                                            </tr>`);

				fetch(`${mysite}/courses/course_info/${response["attendances"][studentID]["course__id"]}`)
					.then((data) => data.json())
					.then((data) => {
						document.querySelector(`#courseName${data["course_id"]}`).innerHTML = data["courseStr"];

						if (data["today"] == true) {
							document.querySelector(`#today${data["course_id"]}`).innerHTML = "HOY";
						}
					});
			}
		},
	});
}

$("#attendanceSearchForm").submit(function (e) {
	e.preventDefault();

	var form = $(this);

	$.ajax({
		type: "GET",
		url: `${mysite}/courses/search_attendance/`,
		data: form.serialize(),
		beforeSend: function () {
			document.querySelector("#searchAttendancesTableBody").innerHTML = "";
			document.querySelector("#searchDateButton").style.display = "none";
			document.querySelector("#searchDateLoader").classList.add("loader");
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);

			if (response["attendances"].length > 0) {
				for (var studentID = 0; studentID < response["attendances"].length; studentID++) {
					let attendanceBtnColor;
					let attendanceStr;
					let day = "";

					if (response["attendances"][studentID]["attendance"] === true) {
						attendanceBtnColor = "btn-success";
						attendanceStr = "ASISTIÓ";
					} else {
						if (response["past"] == true) {
							attendanceBtnColor = "btn-danger";
							attendanceStr = "NO ASISTIÓ";
						} else {
							attendanceBtnColor = "btn-secondary";
							attendanceStr = "PENDIENTE";
						}
					}

					if (response["attendances"][studentID]["onlyday"] === true) {
						day = "SOLO HOY";
					} else if (response["attendances"][studentID]["recover"] === true) {
						day = "RECUPERA";
					}

					$("#searchAttendancesTableBody").append(`<tr> \
					                            <td scope="row" data-label="Asistencia">\
                                                    <button id="attendanceButtonSearch${response["attendances"][studentID]["id"]}" class="btn btn-sm ${attendanceBtnColor}">${attendanceStr}</button>\
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Clase"> \
                                                    <a id="courseNameSearch${response["attendances"][studentID]["course__id"]}" href="#"></a> <br>\
													<span id="today${response["attendances"][studentID]["course__id"]}" class="badge bg-success" style="font-size: small; color: white;"></span>\
													<span id="daySearch${response["attendances"][studentID]["id"]}" class="badge bg-primary" style="font-size: small; color: white;">${day}</span>\
												</td>\

                                            </tr>`);

					fetch(`${mysite}/courses/course_info/${response["attendances"][studentID]["course__id"]}`)
						.then((data) => data.json())
						.then((data) => {
							document.querySelector(`#courseNameSearch${data["course_id"]}`).innerHTML = data["courseStr"];

							if (data["today"] == true) {
								document.querySelector(`#today${data["course_id"]}`).innerHTML = "HOY";
							}
						});
				}
			} else {
				$("#searchAttendancesTableBody").append(`<tr> \
												<td scope="row" data-label="Asistencia">-</td>\
                                                <td scope="row" data-label="Clase"> \
                                                    SIN RESULTADOS\
												</td>\
                                            </tr>`);
			}
			document.querySelector("#searchDateLoader").classList.remove("loader");
			document.querySelector("#searchDateButton").style.display = "block";
		},
	});
});

function closeFutureCourses(button) {
	if (document.querySelector("#futureCourses").style.display === "block") {
		document.querySelector("#futureCourses").style.display = "none";
		button.innerHTML = "Abrir";
	} else {
		document.querySelector("#futureCourses").style.display = "block";
		button.innerHTML = "Cerrar";
	}
}
function closePastCourses(button) {
	if (document.querySelector("#pastCourses").style.display === "block") {
		document.querySelector("#pastCourses").style.display = "none";
		button.innerHTML = "Abrir";
	} else {
		document.querySelector("#pastCourses").style.display = "block";
		button.innerHTML = "Cerrar";
	}
}
