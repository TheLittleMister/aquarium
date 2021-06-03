// ---------THIS FUNCTION DELAYS OUR AJAX DABATASE QUERIES----------
function delay(fn, ms) {
	let timer = 0;
	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(fn.bind(this, ...args), ms || 0);
	};
}
// THIS FUNCTION ACTIVATES TOOLTIPS

function activateToolTip() {
	$('[data-toggle="tooltip"]').tooltip();
}

// This AJAX function searches for students
$("#searchStudents").keyup(
	delay(function () {
		$.ajax({
			type: "GET",
			url: "https://aquariumschool.co/courses/search_students/",
			data: {
				student: $(this).val(),
			},
			beforeSend: function () {
				document.querySelector("#resultsStudentsTable").style.visibility =
					"hidden";
				document.querySelector("#resultsStudentsTableBody").innerHTML = "";

				document.querySelector("#searchStudentsLoader").classList.add("loader");
			},
			error: function (error) {
				console.log("Error!", error);
			},
			success: function (response) {
				// console.log(response);

				document.querySelector("#resultsStudentsTable").style.visibility =
					"visible";

				document
					.querySelector("#searchStudentsLoader")
					.classList.remove("loader");

				for (studentID in response["students"]) {
					$("#resultsStudentsTableBody").append(`<tr> \
                                                <td scope="row" data-label="Documento"> \
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["identity_document"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Nombres">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["first_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Apellidos">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["last_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (1)">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["phone_1"]}</a>\
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Tel/Cel (2)">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["phone_2"]}</a>\
                                                </td>\
                                            </tr>`);
				}

				if (response["students"].length === 0) {
					$("#resultsStudentsTableBody").append(`<tr> \
                                                <td scope="row" data-label="Documento"> \
                                                    <a href="#">Sin Resultados</a>\
                                                </td>\
                                                <td scope="row" data-label="Nombres">\
                                                    <a href="#">-</a>\
                                                </td>\
                                                <td scope="row" data-label="Apellidos">\
                                                    <a href="#">-</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (1)">\
                                                    <a href="#">-</a>\
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Tel/Cel (2)">\
                                                    <a href="#">-</a>\
                                                </td>\
                                            </tr>`);
				}
			},
		});
	}, 1000)
);

// This AJAX function creates a Student
$("#createStudentForm").submit(function (e) {
	e.preventDefault();

	var form = $(this);

	$.ajax({
		type: "POST",
		url: "https://aquariumschool.co/courses/create_student/",
		data: form.serialize(),
		beforeSend: function () {
			document.querySelector("#createStudentButton").style.display = "none";
			document.querySelector("#loadCreateStudent").classList.add("loader");
			document
				.querySelector("#createStudentMessages")
				.classList.remove("alert");

			document
				.querySelector("#createStudentMessages")
				.classList.remove("alert-danger");

			document.querySelector("#createStudentMessages").innerHTML = "";
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);

			if (response["userID"] !== null) {
				window.location.replace(
					`https://aquariumschool.co/courses/student/${response["userID"]}`
				);
			} else {
				document.querySelector("#loadCreateStudent").classList.remove("loader");
				document.querySelector("#createStudentButton").style.display = "block";

				for (messageID in response["messages"]) {
					document
						.querySelector("#createStudentMessages")
						.classList.add("alert");
					document
						.querySelector("#createStudentMessages")
						.classList.add("alert-danger");
					$("#createStudentMessages").append(
						`<li class="ml-2">${response["messages"][messageID]}</li>`
					);
				}
			}
		},
	});
});

$("#editStudentForm").submit(function (e) {
	e.preventDefault();

	var form = $(this);
	var action = form.attr("action");

	$.ajax({
		type: "POST",
		url: `https://aquariumschool.co${action}`,
		data: form.serialize(),
		beforeSend: function () {
			document.querySelector("#editStudentButton").style.display = "none";
			document.querySelector("#loadEditStudent").classList.add("loader");
			document.querySelector("#editStudentMessages").classList.remove("alert");

			document
				.querySelector("#editStudentMessages")
				.classList.remove("alert-danger");

			document.querySelector("#editStudentMessages").innerHTML = "";
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);

			if (response["edited"] !== false) {
				location.reload();
			} else {
				document.querySelector("#loadEditStudent").classList.remove("loader");
				document.querySelector("#editStudentButton").style.display = "block";

				for (messageID in response["messages"]) {
					document.querySelector("#editStudentMessages").classList.add("alert");
					document
						.querySelector("#editStudentMessages")
						.classList.add("alert-danger");
					$("#editStudentMessages").append(
						`<li class="ml-2">${response["messages"][messageID]}</li>`
					);
				}
			}
		},
	});
});

function changeAttendance(attendanceID) {
	fetch(`https://aquariumschool.co/courses/change_attendance/${attendanceID}`)
		.then((response) => response.json())
		.then((response) => {
			// console.log(response);

			if (document.querySelector(`#attendanceButton${attendanceID}`) !== null) {
				if (response["attendance"] === true) {
					document
						.querySelector(`#attendanceButton${attendanceID}`)
						.classList.remove("btn-danger");
					document
						.querySelector(`#attendanceButton${attendanceID}`)
						.classList.add("btn-success");
					document.querySelector(`#attendanceButton${attendanceID}`).innerHTML =
						"ASISTIÓ";
				} else {
					document
						.querySelector(`#attendanceButton${attendanceID}`)
						.classList.remove("btn-success");

					if (response["past"] === true) {
						document
							.querySelector(`#attendanceButton${attendanceID}`)
							.classList.add("btn-danger");
						document.querySelector(
							`#attendanceButton${attendanceID}`
						).innerHTML = "NO ASISTIÓ";
					} else {
						document
							.querySelector(`#attendanceButton${attendanceID}`)
							.classList.add("btn-secondary");
						document.querySelector(
							`#attendanceButton${attendanceID}`
						).innerHTML = "PENDIENTE";
					}
				}
			}

			if (
				document.querySelector(`#attendanceButtonSearch${attendanceID}`) !==
				null
			) {
				if (response["attendance"] === true) {
					document
						.querySelector(`#attendanceButtonSearch${attendanceID}`)
						.classList.remove("btn-danger");
					document
						.querySelector(`#attendanceButtonSearch${attendanceID}`)
						.classList.add("btn-success");
					document.querySelector(
						`#attendanceButtonSearch${attendanceID}`
					).innerHTML = "ASISTIÓ";
				} else {
					document
						.querySelector(`#attendanceButtonSearch${attendanceID}`)
						.classList.remove("btn-success");

					if (response["past"] === true) {
						document
							.querySelector(`#attendanceButtonSearch${attendanceID}`)
							.classList.add("btn-danger");
						document.querySelector(
							`#attendanceButtonSearch${attendanceID}`
						).innerHTML = "NO ASISTIÓ";
					} else {
						document
							.querySelector(`#attendanceButtonSearch${attendanceID}`)
							.classList.add("btn-secondary");
						document.querySelector(
							`#attendanceButtonSearch${attendanceID}`
						).innerHTML = "PENDIENTE";
					}
				}
			}
		});
}

function changeQuota(attendanceID) {
	fetch(`https://aquariumschool.co/courses/change_quota/${attendanceID}`)
		.then((response) => response.json())
		.then((response) => {
			// console.log(response);

			if (document.querySelector(`#quotaButton${attendanceID}`) !== null) {
				if (response["quota"] === "PAGO") {
					document
						.querySelector(`#quotaButton${attendanceID}`)
						.classList.remove("btn-secondary");
					document
						.querySelector(`#quotaButton${attendanceID}`)
						.classList.add("btn-success");
					document.querySelector(`#quotaButton${attendanceID}`).innerHTML =
						response["quota"];
				} else {
					document
						.querySelector(`#quotaButton${attendanceID}`)
						.classList.remove("btn-success");
					document
						.querySelector(`#quotaButton${attendanceID}`)
						.classList.add("btn-secondary");
					document.querySelector(`#quotaButton${attendanceID}`).innerHTML =
						response["quota"];
				}
			}

			if (
				document.querySelector(`#quotaButtonSearch${attendanceID}`) !== null
			) {
				if (response["quota"] === "PAGO") {
					document
						.querySelector(`#quotaButtonSearch${attendanceID}`)
						.classList.remove("btn-secondary");
					document
						.querySelector(`#quotaButtonSearch${attendanceID}`)
						.classList.add("btn-success");
					document.querySelector(
						`#quotaButtonSearch${attendanceID}`
					).innerHTML = response["quota"];
				} else {
					document
						.querySelector(`#quotaButtonSearch${attendanceID}`)
						.classList.remove("btn-success");
					document
						.querySelector(`#quotaButtonSearch${attendanceID}`)
						.classList.add("btn-secondary");
					document.querySelector(
						`#quotaButtonSearch${attendanceID}`
					).innerHTML = response["quota"];
				}
			}
		});
}

function getAttendanceInfo(attendanceID, courseID) {
	document.querySelector("#attendanceCourse").innerHTML = "";
	document.querySelector("#attendanceStudent").innerHTML = "";
	document.querySelector("#attendanceCycle").innerHTML = "";
	document.querySelector("#attendanceDay").innerHTML = "";

	// GET COURSE AND STUDENT NAME

	if (document.querySelector(`#courseName${courseID}`) !== null) {
		document.querySelector("#attendanceCourse").innerHTML =
			document.querySelector(`#courseName${courseID}`).innerHTML;
	} else {
		document.querySelector("#attendanceCourse").innerHTML =
			document.querySelector(`#courseName`).innerHTML;
	}

	if (document.querySelector("#studentName") !== null) {
		document.querySelector("#attendanceStudent").innerHTML =
			document.querySelector("#studentName").innerHTML;
	} else {
		document.querySelector("#attendanceStudent").innerHTML =
			document.querySelector(`#studentName${attendanceID}`).innerHTML;
	}

	document.querySelector("#attendanceFormMessages").classList.remove("alert");

	document
		.querySelector("#attendanceFormMessages")
		.classList.remove("alert-danger");
	document
		.querySelector("#attendanceFormMessages")
		.classList.remove("alert-success");

	document.querySelector("#attendanceFormMessages").innerHTML = "";

	fetch(`https://aquariumschool.co/courses/attendance_info/${attendanceID}`)
		.then((response) => response.json())
		.then((response) => {
			// console.log(response);

			$("#attendanceFormDiv").html(response["form"]);
			$("#attendanceForm").attr(
				"action",
				`/courses/edit_attendance/${attendanceID}`
			);
			$("#attendanceFormDiv").append(
				`<button id="btnAttendanceSubmit" class="btn btn-secondary" type="submit">Guardar</button> \
				<div id="btnAttendanceLoader"></div>`
			);

			let cycle = response["attendance"][0]["cycle"];
			let end_cycle = response["attendance"][0]["end_cycle"];
			let onlyday = response["attendance"][0]["onlyday"];
			let recover = response["attendance"][0]["recover"];
			let note = response["attendance"][0]["note"];
			let image =
				"https://aquariumschool.co/media/" + response["attendance"][0]["image"];

			if (cycle === true && end_cycle === false) {
				document
					.querySelector("#attendanceCycle")
					.classList.remove("btn-secondary");

				document.querySelector("#attendanceCycle").classList.add("btn-warning");
				document.querySelector("#attendanceCycle").innerHTML = "INICIA";
			} else if (cycle === false && end_cycle === true) {
				document
					.querySelector("#attendanceCycle")
					.classList.remove("btn-secondary");

				document.querySelector("#attendanceCycle").classList.add("btn-warning");
				document.querySelector("#attendanceCycle").innerHTML = "TERMINA";
			} else {
				document
					.querySelector("#attendanceCycle")
					.classList.remove("btn-warning");

				document
					.querySelector("#attendanceCycle")
					.classList.add("btn-secondary");
				document.querySelector("#attendanceCycle").innerHTML = "SIN DEFINIR";
			}

			document
				.getElementById("attendanceCycle")
				.setAttribute("onClick", `javascript: changeCycle(${attendanceID});`);

			if (onlyday === true && recover === false) {
				document
					.querySelector("#attendanceDay")
					.classList.remove("btn-secondary");

				document.querySelector("#attendanceDay").classList.add("btn-primary");
				document.querySelector("#attendanceDay").innerHTML = "SOLO HOY";
			} else if (onlyday === false && recover === true) {
				document
					.querySelector("#attendanceDay")
					.classList.remove("btn-secondary");

				document.querySelector("#attendanceDay").classList.add("btn-primary");
				document.querySelector("#attendanceDay").innerHTML = "RECUPERA";
			} else {
				document
					.querySelector("#attendanceDay")
					.classList.remove("btn-primary");

				document.querySelector("#attendanceDay").classList.add("btn-secondary");
				document.querySelector("#attendanceDay").innerHTML = "SIN DEFINIR";
			}

			document
				.getElementById("attendanceDay")
				.setAttribute("onClick", `javascript: changeDay(${attendanceID});`);
		});
}

function changeCycle(attendanceID) {
	fetch(`https://aquariumschool.co/courses/change_cycle/${attendanceID}`)
		.then((response) => response.json())
		.then((response) => {
			// console.log(response);

			let cycle = response["cycle"];
			let end_cycle = response["end_cycle"];

			if (cycle === true && end_cycle === false) {
				document
					.querySelector("#attendanceCycle")
					.classList.remove("btn-secondary");

				document.querySelector("#attendanceCycle").classList.add("btn-warning");
				document.querySelector("#attendanceCycle").innerHTML = "INICIA";

				if (document.querySelector(`#cycle${attendanceID}`) !== null) {
					document.querySelector(`#cycle${attendanceID}`).innerHTML = "INICIA";
				}

				if (document.querySelector(`#cycleSearch${attendanceID}`) !== null) {
					document.querySelector(`#cycleSearch${attendanceID}`).innerHTML =
						"INICIA";
				}
			} else if (cycle === false && end_cycle === true) {
				document
					.querySelector("#attendanceCycle")
					.classList.remove("btn-secondary");

				document.querySelector("#attendanceCycle").classList.add("btn-warning");
				document.querySelector("#attendanceCycle").innerHTML = "TERMINA";

				if (document.querySelector(`#cycle${attendanceID}`) !== null) {
					document.querySelector(`#cycle${attendanceID}`).innerHTML = "TERMINA";
				}

				if (document.querySelector(`#cycleSearch${attendanceID}`) !== null) {
					document.querySelector(`#cycleSearch${attendanceID}`).innerHTML =
						"TERMINA";
				}
			} else {
				document
					.querySelector("#attendanceCycle")
					.classList.remove("btn-warning");

				document
					.querySelector("#attendanceCycle")
					.classList.add("btn-secondary");
				document.querySelector("#attendanceCycle").innerHTML = "SIN DEFINIR";
				if (document.querySelector(`#cycle${attendanceID}`) !== null) {
					document.querySelector(`#cycle${attendanceID}`).innerHTML = "";
				}

				if (document.querySelector(`#cycleSearch${attendanceID}`) !== null) {
					document.querySelector(`#cycleSearch${attendanceID}`).innerHTML = "";
				}
			}
		});
}

function changeDay(attendanceID) {
	fetch(`https://aquariumschool.co/courses/change_day/${attendanceID}`)
		.then((response) => response.json())
		.then((response) => {
			// console.log(response);

			let onlyday = response["onlyday"];
			let recover = response["recover"];

			if (onlyday === true && recover === false) {
				document
					.querySelector("#attendanceDay")
					.classList.remove("btn-secondary");

				document.querySelector("#attendanceDay").classList.add("btn-primary");
				document.querySelector("#attendanceDay").innerHTML = "SOLO HOY";

				if (document.querySelector(`#day${attendanceID}`) !== null) {
					document.querySelector(`#day${attendanceID}`).innerHTML = "SOLO HOY";
				}

				if (document.querySelector(`#daySearch${attendanceID}`) !== null) {
					document.querySelector(`#daySearch${attendanceID}`).innerHTML =
						"SOLO HOY";
				}
			} else if (onlyday === false && recover === true) {
				document
					.querySelector("#attendanceDay")
					.classList.remove("btn-secondary");

				document.querySelector("#attendanceDay").classList.add("btn-primary");
				document.querySelector("#attendanceDay").innerHTML = "RECUPERA";
				if (document.querySelector(`#day${attendanceID}`) !== null) {
					document.querySelector(`#day${attendanceID}`).innerHTML = "RECUPERA";
				}

				if (document.querySelector(`#daySearch${attendanceID}`) !== null) {
					document.querySelector(`#daySearch${attendanceID}`).innerHTML =
						"RECUPERA";
				}
			} else {
				document
					.querySelector("#attendanceDay")
					.classList.remove("btn-primary");

				document.querySelector("#attendanceDay").classList.add("btn-secondary");
				document.querySelector("#attendanceDay").innerHTML = "SIN DEFINIR";

				if (document.querySelector(`#day${attendanceID}`) !== null) {
					document.querySelector(`#day${attendanceID}`).innerHTML = "";
				}

				if (document.querySelector(`#daySearch${attendanceID}`) !== null) {
					document.querySelector(`#daySearch${attendanceID}`).innerHTML = "";
				}
			}
		});
}

$("#attendanceForm").submit(function (e) {
	e.preventDefault();

	var form = $(this);
	var action = form.attr("action");
	form = new FormData($(this)[0]);

	$.ajax({
		type: "POST",
		url: `https://aquariumschool.co${action}`,
		data: form,
		// cache: false,
		contentType: false,
		processData: false,
		beforeSend: function () {
			document.querySelector("#btnAttendanceSubmit").style.display = "none";
			document.querySelector("#btnAttendanceLoader").classList.add("loader");
			document
				.querySelector("#attendanceFormMessages")
				.classList.remove("alert");

			document
				.querySelector("#attendanceFormMessages")
				.classList.remove("alert-danger");

			document.querySelector("#attendanceFormMessages").innerHTML = "";
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);

			if (response["edited"] === true) {
				$("#attendanceFormDiv").html(response["form"]);
				$("#attendanceForm").attr(
					"action",
					`/courses/edit_attendance/${response["attendanceID"]}`
				);
				$("#attendanceFormDiv").append(
					`<button id="btnAttendanceSubmit" class="btn btn-secondary" type="submit">Guardar</button> \
				<div id="btnAttendanceLoader"></div>`
				);

				// console.log(response["note"]);

				if (response["note"] !== null) {
					if (
						document.querySelector(`#note${response["attendanceID"]}`) !== null
					) {
						document.querySelector(
							`#note${response["attendanceID"]}`
						).innerHTML = "";

						$(`#note${response["attendanceID"]}`).append(
							`<span style="font-size: large;" data-toggle="tooltip" title="${response["note"]}">📃</span>`
						);
					}

					if (
						document.querySelector(`#noteSearch${response["attendanceID"]}`) !==
						null
					) {
						document.querySelector(
							`#noteSearch${response["attendanceID"]}`
						).innerHTML = "";

						$(`#noteSearch${response["attendanceID"]}`).append(
							`<span style="font-size: large;" data-toggle="tooltip" title="${response["note"]}">📃</span>`
						);
					}
					activateToolTip();
				} else {
					if (
						document.querySelector(`#note${response["attendanceID"]}`) !== null
					) {
						document.querySelector(
							`#note${response["attendanceID"]}`
						).innerHTML = "-";
					}

					if (
						document.querySelector(`#noteSearch${response["attendanceID"]}`) !==
						null
					) {
						document.querySelector(
							`#noteSearch${response["attendanceID"]}`
						).innerHTML = "-";
					}
				}

				document
					.querySelector("#attendanceFormMessages")
					.classList.add("alert");
				document
					.querySelector("#attendanceFormMessages")
					.classList.add("alert-success");

				$("#attendanceFormMessages").append("Cambios Guardados!");
			} else {
				document
					.querySelector("#btnAttendanceLoader")
					.classList.remove("loader");
				document.querySelector("#btnAttendanceSubmit").style.display = "block";

				for (messageID in response["messages"]) {
					document
						.querySelector("#attendanceFormMessages")
						.classList.add("alert");
					document
						.querySelector("#attendanceFormMessages")
						.classList.add("alert-danger");
					$("#attendanceFormMessages").append(
						`<li class="ml-2">${response["messages"][messageID]}</li>`
					);
				}
			}
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

$("#attendanceSearchForm").submit(function (e) {
	e.preventDefault();

	var form = $(this);

	$.ajax({
		type: "GET",
		url: "https://aquariumschool.co/courses/search_attendance/",
		data: form.serialize(),
		beforeSend: function () {
			document.querySelector("#searchAttendancesTableBody").innerHTML = "";
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);

			if (response["attendances"].length > 0) {
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
						if (response["past"] == true) {
							attendanceBtnColor = "btn-danger";
							attendanceStr = "NO ASISTIÓ";
						} else {
							attendanceBtnColor = "btn-secondary";
							attendanceStr = "PENDIENTE";
						}
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

					$("#searchAttendancesTableBody").append(`<tr> \
                                                <td scope="row" data-label="Clase"> \
                                                    <a id="courseNameSearch${response["attendances"][studentID]["course__id"]}" href=""></a> <br>\
													<span id="todaySearch${response["attendances"][studentID]["course__id"]}" class="badge bg-success" style="font-size: small; color: white;"></span>\
													<span id="countSearch${response["attendances"][studentID]["course__id"]}" class="badge bg-info" style="font-size: small; color: white;"></span>\
													<span id="cycleSearch${response["attendances"][studentID]["id"]}" class="badge bg-warning" style="font-size: small;">${cycle}</span>\
													<span id="daySearch${response["attendances"][studentID]["id"]}" class="badge bg-primary" style="font-size: small; color: white;">${day}</span>\
												</td>\
                                                <td scope="row" data-label="Asistencia">\
                                                    <button id="attendanceButtonSearch${response["attendances"][studentID]["id"]}" onclick="changeAttendance(${response["attendances"][studentID]["id"]});" class="btn btn-sm ${attendanceBtnColor}">${attendanceStr}</button>\
                                                </td>\
                                                <td scope="row" data-label="Cupo">\
                                                    <button id="quotaButtonSearch${response["attendances"][studentID]["id"]}" onclick="changeQuota(${response["attendances"][studentID]["id"]});" class="btn btn-sm ${quotaBtnColor}">${response["attendances"][studentID]["quota"]}</button>\
                                                </td>\
                                                <td scope="row" data-label="Nota">\
													<span id="noteSearch${response["attendances"][studentID]["id"]}"> \
														<span style="font-size: large;" data-toggle="tooltip" title="${note}">${note_emoji}</span> \
													</span> \
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Editar">\
                                                    <button onclick="getAttendanceInfo(${response["attendances"][studentID]["id"]}, ${response["attendances"][studentID]["course__id"]});" class="btn btn-outline-warning" data-bs-toggle="modal" data-bs-target="#modalAttendance">✏️</button>\
                                                </td>\
                                            </tr>`);

					fetch(
						`https://aquariumschool.co/courses/course_info/${response["attendances"][studentID]["course__id"]}`
					)
						.then((data) => data.json())
						.then((data) => {
							document.querySelector(
								`#courseNameSearch${data["course_id"]}`
							).innerHTML = data["courseStr"];

							document.querySelector(
								`#countSearch${data["course_id"]}`
							).innerHTML = data["courseCount"];

							if (data["today"] == true) {
								document.querySelector(
									`#todaySearch${data["course_id"]}`
								).innerHTML = "HOY";
							}
						});

					activateToolTip();
				}

				$('[data-toggle="tooltip"]').tooltip();
			} else {
				$("#searchAttendancesTableBody").append(`<tr> \
                                                <td scope="row" data-label="Clase"> \
                                                    SIN RESULTADOS\
												</td>\
                                                <td scope="row" data-label="Asistencia">-</td>\
                                                <td scope="row" data-label="Cupo">-\
                                                </td>\
                                                <td scope="row" data-label="Nota">-\
                                                </td>\
                                                <td scope="row" data-label="Editar">-</td>\
                                            </tr>`);
			}
		},
	});
});

$("#editCourseForm").submit(function (e) {
	e.preventDefault();

	var form = $(this);
	var action = form.attr("action");
	$("#id_students_to option").prop("selected", true);
	$("#id_teachers_to option").prop("selected", true);

	$.ajax({
		type: "POST",
		url: `https://aquariumschool.co${action}`,
		data: form.serialize(),
		beforeSend: function () {
			document.querySelector("#editCourseFormButton").style.display = "none";
			document.querySelector("#loadEditCourseForm").classList.add("loader");
			document
				.querySelector("#editCourseFormMessages")
				.classList.remove("alert");

			document
				.querySelector("#editCourseFormMessages")
				.classList.remove("alert-danger");

			document.querySelector("#editCourseFormMessages").innerHTML = "";
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			document.querySelector("#loadEditCourseForm").classList.remove("loader");
			document.querySelector("#editCourseFormButton").style.display = "block";

			if (response["edited"] === false) {
				for (messageID in response["messages"]) {
					document
						.querySelector("#editCourseFormMessages")
						.classList.add("alert");
					document
						.querySelector("#editCourseFormMessages")
						.classList.add("alert-danger");
					$("#editCourseFormMessages").append(
						`<li class="ml-2">${response["messages"][messageID]}</li>`
					);
				}
			} else {
				location.reload();
			}
		},
	});
});

function tConvert(time) {
	// Check correct time format and split into components
	time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
		time,
	];

	if (time.length > 1) {
		// If time format correct
		time = time.slice(1); // Remove full string match value
		time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
		time[0] = +time[0] % 12 || 12; // Adjust hours
	}
	return time.join(""); // return adjusted time or original string
}

function getSchedule(user_id) {
	$.ajax({
		type: "GET",
		url: "https://aquariumschool.co/courses/create_schedule/",
		data: {
			userID: user_id,
		},
		beforeSend: function () {
			document.querySelector("#studentSchedule").style.display = "block";
			document.querySelector("#getScheduleButton").style.display = "none";
			document.querySelector("#loadStudentSchedule").classList.add("loader");
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			document.querySelector("#loadStudentSchedule").classList.remove("loader");

			for (
				var scheduleID = 0;
				scheduleID < response["schedule"].length;
				scheduleID++
			) {
				var DE = tConvert(response["schedule"][scheduleID][0]);
				var A = tConvert(response["schedule"][scheduleID][1]);

				$("#studentScheduleBody").append(`<tr> \
                                                <td scope="row" data-label="Hora"> \
                                                    DE ${DE}\
                                                    A ${A}\
                                                </td>\
                                                <td scope="row" data-label="Lunes">\
                                                    ${response["schedule"][scheduleID][2]}\
                                                </td>\
                                                <td scope="row" data-label="Martes">\
                                                    ${response["schedule"][scheduleID][3]}\
                                                </td>\
                                                <td scope="row" data-label="Miercoles">\
                                                    ${response["schedule"][scheduleID][4]}\
                                                </td>\
                                                <td scope="row" data-label="Jueves">\
                                                    ${response["schedule"][scheduleID][5]}\
                                                </td>\
                                                <td scope="row" data-label="Viernes">\
                                                    ${response["schedule"][scheduleID][6]}\
                                                </td>\
                                                <td scope="row" data-label="Sábado">\
                                                    ${response["schedule"][scheduleID][7]}\
                                                </td>\
                                                <td scope="row" data-label="Domingo">\
                                                    ${response["schedule"][scheduleID][8]}\
                                                </td>\
                                            </tr>`);
			}

			document.querySelector("#showScheduleButton").style.visibility =
				"visible";
		},
	});
}

function showSchedule() {
	if (document.querySelector("#studentSchedule").style.display === "none") {
		document.querySelector("#studentSchedule").style.display = "block";
		document.querySelector("#showScheduleButton").innerHTML = "Cerrar";
	} else {
		document.querySelector("#studentSchedule").style.display = "none";
		document.querySelector("#showScheduleButton").innerHTML = "Abrir";
	}
}
function studentStatistics(user_id) {
	$.ajax({
		type: "GET",
		url: "https://aquariumschool.co/courses/student_statistics/",
		data: {
			userID: user_id,
		},
		beforeSend: function () {
			document.querySelector("#studentStatistics").style.display = "block";
			document.querySelector("#studentStatisticsButton").style.display = "none";
			document.querySelector("#loadStudentStatistics").classList.add("loader");
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);
			document
				.querySelector("#loadStudentStatistics")
				.classList.remove("loader");

			document.querySelector("#showStudentStatisticsButton").style.visibility =
				"visible";

			$("#studentAttendanceStatsBody").append(`<tr> \
                                                <td scope="row" data-label="Asistió"> \
                                                    ${response["attended"]}\
                                                </td>\
                                                <td scope="row" data-label="Faltó">\
                                                    ${response["failed"]}\
                                                </td>\
                                                <td scope="row" data-label="Recuperó">\
                                                    ${response["recovered"]}\
                                                </td>\
                                                <td scope="row" data-label="Puede Recuperar">\
                                                    ${response["can_recover"]}\
                                                </td>\
                                            </tr>`);

			$("#studentPaymentStatsBody").append(`<tr> \
                                                <td scope="row" data-label="Pago"> \
                                                    ${response["paid"]}\
                                                </td>\
                                                <td scope="row" data-label="Pago Día">\
                                                    ${response["onlyday"]}\
                                                </td>\
                                                <td scope="row" data-label="No pago">\
                                                    ${response["n_paid"]}\
                                                </td>\
                                                <td scope="row" data-label="Separado">\
                                                    ${response["sep"]}\
                                                </td>\
                                                <td scope="row" data-label="Total">\
                                                    ${response["total"]}\
                                                </td>\
                                            </tr>`);
		},
	});
}

function showStudentStatistics() {
	if (document.querySelector("#studentStatistics").style.display === "none") {
		document.querySelector("#studentStatistics").style.display = "block";
		document.querySelector("#showStudentStatisticsButton").innerHTML = "Cerrar";
	} else {
		document.querySelector("#studentStatistics").style.display = "none";
		document.querySelector("#showStudentStatisticsButton").innerHTML = "Abrir";
	}
}

let inconsistencies_loaded = false;

function get_inconsistencies() {
	if (inconsistencies_loaded == false) {
		fetch("https://aquariumschool.co/courses/inconsistencies/")
			.then((response) => response.json())
			.then((response) => {
				inconsistencies_loaded = true;

				for (
					var studentID = 0;
					studentID < response["students"].length;
					studentID++
				) {
					let btnException;
					let btnExceptionClass;

					if (response["students"][studentID]["exception"] === false) {
						btnException = "NO";
						btnExceptionClass = "btn-danger";
					} else {
						btnException = "SI";
						btnExceptionClass = "btn-success";
					}
					$("#inconsistenciesTableBody").append(`<tr> \
                                                <td scope="row" data-label="Documento"> \
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["document"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Nombres">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["first_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Apellidos">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["last_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (1)">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["phone_1"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (2)">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["phone_2"]}</a>\
                                                </td>\
                                                <td id="tdException${response["students"][studentID]["id"]}" scope="row" data-label="Excepción">\
                                                    <button onclick="changeException(${response["students"][studentID]["id"]});" class="btn btn-sm ${btnExceptionClass}">${btnException}</button>\
                                                </td>\
                                            </tr>`);
				}
			});
	}
}

function changeException(userID) {
	fetch(`https://aquariumschool.co/courses/change_exception/${userID}`)
		.then((response) => response.json())
		.then((response) => {
			if (response["exception"] == true) {
				document.querySelector(
					`#tdException${userID}`
				).innerHTML = `<button onclick='changeException(${userID});' class='btn btn-sm btn-success'>SI</button>`;
			} else {
				document.querySelector(
					`#tdException${userID}`
				).innerHTML = `<button onclick='changeException(${userID});' class='btn btn-sm btn-danger'>NO</button>`;
			}
		});
}

let plus_loaded = false;

function get_plus() {
	if (plus_loaded == false) {
		fetch("https://aquariumschool.co/courses/plus/")
			.then((response) => response.json())
			.then((response) => {
				plus_loaded = true;

				for (
					var studentID = 0;
					studentID < response["students"].length;
					studentID++
				) {
					$("#plusTableBody").append(`<tr> \
                                                <td scope="row" data-label="Documento"> \
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["document"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Nombres">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["first_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Apellidos">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["last_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (1)">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["phone_1"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (2)">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["phone_2"]}</a>\
                                                </td>\
                                            </tr>`);
				}
			});
	}
}

function showStudentOptions() {
	if (document.querySelector("#studentOptions").style.display === "none") {
		document.querySelector("#studentOptions").style.display = "block";
		document.querySelector("#showStudentOptionsButton").innerHTML = "Cerrar";
	} else {
		document.querySelector("#studentOptions").style.display = "none";
		document.querySelector("#showStudentOptionsButton").innerHTML = "Abrir";
	}
}

let change_loaded = false;

function get_change() {
	if (change_loaded == false) {
		fetch("https://aquariumschool.co/courses/change/")
			.then((response) => response.json())
			.then((response) => {
				change_loaded = true;

				for (
					var studentID = 0;
					studentID < response["students"].length;
					studentID++
				) {
					$("#changeTableBody").append(`<tr> \
                                                <td scope="row" data-label="Documento"> \
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["identity_document"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Nombres">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["first_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Apellidos">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["last_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (1)">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["phone_1"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (2)">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["phone_2"]}</a>\
                                                </td>\
                                            </tr>`);
				}
			});
	}
}

let teachers_loaded = false;

function get_teachers() {
	if (teachers_loaded == false) {
		fetch("https://aquariumschool.co/courses/teachers/")
			.then((response) => response.json())
			.then((response) => {
				teachers_loaded = true;

				for (
					var studentID = 0;
					studentID < response["students"].length;
					studentID++
				) {
					$("#teachersTableBody").append(`<tr> \
                                                <td scope="row" data-label="Documento"> \
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["identity_document"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Nombres">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["first_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Apellidos">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["last_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (1)">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["phone_1"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (2)">\
                                                    <a href="https://aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["phone_2"]}</a>\
                                                </td>\
                                            </tr>`);
				}
			});
	}
}

function setDefaultPassword() {
	$("#id_password1").val("AquariumSchool");
	$("#id_password2").val("AquariumSchool");
}
