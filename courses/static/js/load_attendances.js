// var mysite = "http://127.0.0.1:8000";
var mysite = "https://aquariumschool.co";

// START LOAD FUTURE ATTENDANCES

// Start with first future attendance
let studentFutureAttendanceCounter = 0;

// Load 20 future attendances at a time
const studentFutureAttendancesQuantity = 20;

// All future attendances loaded
let allFutureAttendancesLoaded = false;

// When DOM loads, render the first 20 future attendances
document.addEventListener("DOMContentLoaded", load_future_attendaces);

// Function that creates INFINITE SCROLLING for future attendances

$(window).scroll(function () {
	if (
		$(window).scrollTop() + $(window).height() == $(document).height() &&
		allFutureAttendancesLoaded === false
	) {
		load_future_attendances();
	}
});

function activateToolTip() {
	$('[data-toggle="tooltip"]').tooltip();
}

// Load next set of future attendances
function load_future_attendaces() {
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

			document
				.querySelector("#loadFutureAttendances")
				.classList.remove("loader");

			if (response["all_loaded"] === true) {
				allFutureAttendancesLoaded = true;
			}

			for (
				var studentID = 0;
				studentID < response["attendances"].length;
				studentID++
			) {
				let attendanceBtnColor;
				let attendanceStr;
				let quotaBtnColor;
				let cycle = "";
				let day = "";
				let note = "";
				let note_emoji = "-";

				if (response["attendances"][studentID]["attendance"] === true) {
					attendanceBtnColor = "btn-success";
					attendanceStr = "ASISTIÓ";
				} else {
					attendanceBtnColor = "btn-secondary";
					attendanceStr = "PENDIENTE";
				}

				if (response["attendances"][studentID]["quota"] === "PAGO") {
					quotaBtnColor = "btn-success";
				} else {
					quotaBtnColor = "btn-secondary";
				}

				if (response["attendances"][studentID]["cycle"] === true) {
					cycle = "INICIA";
				} else if (response["attendances"][studentID]["end_cycle"] === true) {
					cycle = "TERMINA";
				}

				if (response["attendances"][studentID]["onlyday"] === true) {
					day = "SOLO HOY";
				} else if (response["attendances"][studentID]["recover"] === true) {
					day = "RECUPERA";
				}

				if (
					response["attendances"][studentID]["note"] !== null &&
					response["attendances"][studentID]["note"] !== ""
				) {
					note = response["attendances"][studentID]["note"];
					note_emoji = "📃";
				}

				$("#futureAttendancesTableBody").append(`<tr> \
                                                <td scope="row" data-label="Clase"> \
                                                    <a id="courseName${response["attendances"][studentID]["course__id"]}" href="${mysite}/courses/course/${response["attendances"][studentID]["course__id"]}"></a> <br>\
													<span id="count${response["attendances"][studentID]["course__id"]}" class="badge bg-info" style="font-size: small; color: white;"></span>\
													<span id="today${response["attendances"][studentID]["course__id"]}" class="badge bg-success" style="font-size: small; color: white;"></span>\
													<span id="cycle${response["attendances"][studentID]["id"]}" class="badge bg-warning" style="font-size: small;">${cycle}</span>\
													<span id="day${response["attendances"][studentID]["id"]}" class="badge bg-primary" style="font-size: small; color: white;">${day}</span>\
												</td>\
                                                <td scope="row" data-label="Asistencia">\
                                                    <button id="attendanceButton${response["attendances"][studentID]["id"]}" onclick="changeAttendance(${response["attendances"][studentID]["id"]});" class="btn btn-sm ${attendanceBtnColor}">${attendanceStr}</button>\
                                                </td>\
                                                <td scope="row" data-label="Cupo">\
                                                    <button id="quotaButton${response["attendances"][studentID]["id"]}" onclick="changeQuota(${response["attendances"][studentID]["id"]});" class="btn btn-sm ${quotaBtnColor}">${response["attendances"][studentID]["quota"]}</button>\
                                                </td>\
                                                <td scope="row" data-label="Nota">\
													<span id="note${response["attendances"][studentID]["id"]}"> \
														<span style="font-size: large;" data-toggle="tooltip" title="${note}">${note_emoji}</span> \
													</span> \
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Editar">\
                                                    <button onclick="getAttendanceInfo(${response["attendances"][studentID]["id"]}, ${response["attendances"][studentID]["course__id"]});" class="btn btn-outline-warning" data-bs-toggle="modal" data-bs-target="#modalAttendance">✏️</button>\
                                                </td>\
                                            </tr>`);

				fetch(
					`${mysite}/courses/course_info/${response["attendances"][studentID]["course__id"]}`
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

				activateToolTip();
			}

			$('[data-toggle="tooltip"]').tooltip();
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
	if (
		$(window).scrollTop() + $(window).height() == $(document).height() &&
		allPastAttendancesLoaded === false
	) {
		load_past_attendances();
	}
});

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

			// var count = response["attendances"].length;

			for (
				var studentID = 0;
				studentID < response["attendances"].length;
				studentID++
			) {
				let attendanceBtnColor;
				let attendanceStr;
				let quotaBtnColor;
				let cycle = "";
				let day = "";
				let note = "";
				let note_emoji = "-";

				if (response["attendances"][studentID]["attendance"] === true) {
					attendanceBtnColor = "btn-success";
					attendanceStr = "ASISTIÓ";
				} else {
					attendanceBtnColor = "btn-danger";
					attendanceStr = "NO ASISTIÓ";
				}

				if (response["attendances"][studentID]["quota"] === "PAGO") {
					quotaBtnColor = "btn-success";
				} else {
					quotaBtnColor = "btn-secondary";
				}

				if (response["attendances"][studentID]["cycle"] === true) {
					cycle = "INICIA";
				} else if (response["attendances"][studentID]["end_cycle"] === true) {
					cycle = "TERMINA";
				}

				if (response["attendances"][studentID]["onlyday"] === true) {
					day = "SOLO HOY";
				} else if (response["attendances"][studentID]["recover"] === true) {
					day = "RECUPERA";
				}

				if (
					response["attendances"][studentID]["note"] !== null &&
					response["attendances"][studentID]["note"] !== ""
				) {
					note = response["attendances"][studentID]["note"];
					note_emoji = "📃";
				}

				$("#pastAttendancesTableBody").append(`<tr> \
                                                <td scope="row" data-label="Clase"> \
                                                    <a id="courseName${response["attendances"][studentID]["course__id"]}" href="${mysite}/courses/course/${response["attendances"][studentID]["course__id"]}"></a> <br>\
													<span id="count${response["attendances"][studentID]["course__id"]}" class="badge bg-info" style="font-size: small; color: white;"></span>\
													<span id="cycle${response["attendances"][studentID]["id"]}" class="badge bg-warning" style="font-size: small;">${cycle}</span>\
													<span id="day${response["attendances"][studentID]["id"]}" class="badge bg-primary" style="font-size: small; color: white;">${day}</span>\
												</td>\
                                                <td scope="row" data-label="Asistencia">\
                                                    <button id="attendanceButton${response["attendances"][studentID]["id"]}" onclick="changeAttendance(${response["attendances"][studentID]["id"]});" class="btn btn-sm ${attendanceBtnColor}">${attendanceStr}</button>\
                                                </td>\
                                                <td scope="row" data-label="Cupo">\
                                                    <button id="quotaButton${response["attendances"][studentID]["id"]}" onclick="changeQuota(${response["attendances"][studentID]["id"]});" class="btn btn-sm ${quotaBtnColor}">${response["attendances"][studentID]["quota"]}</button>\
                                                </td>\
                                                <td scope="row" data-label="Nota">\
													<span id="note${response["attendances"][studentID]["id"]}"> \
														<span style="font-size: large;" data-toggle="tooltip" title="${note}">${note_emoji}</span> \
													</span> \
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Editar">\
                                                    <button onclick="getAttendanceInfo(${response["attendances"][studentID]["id"]}, ${response["attendances"][studentID]["course__id"]});" class="btn btn-outline-warning" data-bs-toggle="modal" data-bs-target="#modalAttendance">✏️</button>\
                                                </td>\
                                            </tr>`);

				fetch(
					`${mysite}/courses/course_info/${response["attendances"][studentID]["course__id"]}`
				)
					.then((data) => data.json())
					.then((data) => {
						document.querySelector(
							`#courseName${data["course_id"]}`
						).innerHTML = data["courseStr"];

						document.querySelector(`#count${data["course_id"]}`).innerHTML =
							data["courseCount"];
					});

				activateToolTip();
			}

			$('[data-toggle="tooltip"]').tooltip();
		},
	});
}
