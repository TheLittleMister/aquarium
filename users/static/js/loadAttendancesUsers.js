// START LOAD FUTURE ATTENDANCES

// Start with first future attendance
studentFutureAttendanceCounter = 0;

// Load 20 future attendances at a time
studentFutureAttendancesQuantity = 20;

// All future attendances loaded
allFutureAttendancesLoaded = false;

function activateToolTip() {
	$('[data-toggle="tooltip"]').tooltip();
}

// Load next set of future attendances
function load_future_attendances() {
	const start = studentFutureAttendanceCounter;
	const end = studentFutureAttendanceCounter + studentFutureAttendancesQuantity;
	studentFutureAttendanceCounter = end + 1;

	let userID = document.querySelector("#modalUserID").getAttribute("value");

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
			document.querySelector("#loadFutureAttendancesModal").classList.add("loader");
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);

			document.querySelector("#loadFutureAttendancesModal").classList.remove("loader");

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

				$("#futureAttendancesTableBodyModal").append(`<tr> \
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

function activateToolTip() {
	$('[data-toggle="tooltip"]').tooltip();
}

// Load next set of past attendances
function load_past_attendances() {
	const start = studentPastAttendanceCounter;
	const end = studentPastAttendanceCounter + studentPastAttendancesQuantity;
	studentPastAttendanceCounter = end + 1;

	let userID = document.querySelector("#modalUserID").getAttribute("value");

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
			document.querySelector("#loadPastAttendancesModal").classList.add("loader");
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);

			document.querySelector("#loadPastAttendancesModal").classList.remove("loader");

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

				$("#pastAttendancesTableBodyModal").append(`<tr> \
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
                                                <td scope="row" data-label="Clase"> \
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

function closeFutureCoursesModal(button) {
	if (document.querySelector("#futureCoursesModal").style.display === "block") {
		document.querySelector("#futureCoursesModal").style.display = "none";
		button.innerHTML = "Abrir";
	} else {
		document.querySelector("#futureCoursesModal").style.display = "block";
		button.innerHTML = "Cerrar";
	}
}
function closePastCoursesModal(button) {
	if (document.querySelector("#pastCoursesModal").style.display === "block") {
		document.querySelector("#pastCoursesModal").style.display = "none";
		button.innerHTML = "Abrir";
	} else {
		document.querySelector("#pastCoursesModal").style.display = "block";
		button.innerHTML = "Cerrar";
	}
}
