// var mysite = "http://127.0.0.1:8000";
// var mysite = "https://aquariumschool.co";

// ---------THIS FUNCTION DELAYS OUR AJAX DABATASE QUERIES----------
function delay(fn, ms) {
	let timer = 0;
	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(fn.bind(this, ...args), ms || 0);
	};
}

function tConvert(time) {
	// Check correct time format and split into components
	time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

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
		url: `${mysite}/users/create_schedule/`,
		data: {
			userID: user_id,
		},
		beforeSend: function () {
			document.querySelector("#getScheduleButton").style.display = "none";
			document.querySelector("#loadStudentSchedule").classList.add("loader");
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);
			for (var scheduleID = 0; scheduleID < response["schedule"].length; scheduleID++) {
				var DE = tConvert(response["schedule"][scheduleID][0]);
				var A = tConvert(response["schedule"][scheduleID][1]);

				weekdays = {
					2: "LUNES",
					3: "MARTES",
					4: "MIERCOLES",
					5: "JUEVES",
					6: "VIERNES",
					7: "SABADO",
					8: "DOMINGO",
				};

				for (var i = 2; i < response["schedule"][scheduleID].length; i++) {
					if (response["schedule"][scheduleID][i] != "-") {
						$("#modalsDiv").append(`<div class="modal" id="scheduleModal${scheduleID}${i}" tabindex="-1" aria-labelledby="plusStudentModalLabel" aria-hidden="true">\
						<div class="modal-dialog modal-fullscreen-md-down modal-lg modal-dialog-centered modal-dialog-scrollable">\
							<div class="modal-content">\
								<div class="modal-header">\
									<h5 class="modal-title" id="plusStudentModalLabel">${weekdays[i]} DE ${DE} A ${A}</h5>\
									<button type="button" class="btn btn-outline-primary btn-close" data-bs-dismiss="modal" aria-label="Close">\
										&times;\
									</button>\
								</div>\
								<div class="modal-body col-10" style="margin-left: auto; margin-right: auto;">\
									<table>\
										<thead>\
											<tr>\
												<th scope="col">Documento</th>\
												<th scope="col">Nombres</th>\
												<th scope="col">Apellidos</th>\
												<th scope="col">Tel/Cel (1)</th>\
												<th scope="col">Tel/Cel (2)</th>\
												<th scope="col">Profesor</th>\
											</tr>\
										</thead>\
										<tbody id="scheduleModalBody${scheduleID}${i}"></tbody>\
									</table>\
								</div>\
							</div>\
						</div>\
					</div>`);

						for (var objID = 0; objID < response["schedule"][scheduleID][i].length; objID++) {
							$(`#scheduleModalBody${scheduleID}${i}`).append(`<tr> \
                                                <td scope="row" data-label="Documento"> \
                                                    <a href="#" onclick="load_profile_data(${response["schedule"][scheduleID][i][objID]["id"]});" data-bs-toggle="modal" data-bs-target="#profileModal">${response["schedule"][scheduleID][i][objID]["identity_document"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Nombres">\
                                                    <a href="#" onclick="load_profile_data(${response["schedule"][scheduleID][i][objID]["id"]});" data-bs-toggle="modal" data-bs-target="#profileModal">${response["schedule"][scheduleID][i][objID]["first_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Apellidos">\
                                                    <a href="#" onclick="load_profile_data(${response["schedule"][scheduleID][i][objID]["id"]});" data-bs-toggle="modal" data-bs-target="#profileModal">${response["schedule"][scheduleID][i][objID]["last_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (1)">\
                                                    <a href="#" onclick="load_profile_data(${response["schedule"][scheduleID][i][objID]["id"]});" data-bs-toggle="modal" data-bs-target="#profileModal">${response["schedule"][scheduleID][i][objID]["phone_1"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (2)">\
                                                    <a href="#" onclick="load_profile_data(${response["schedule"][scheduleID][i][objID]["id"]});" data-bs-toggle="modal" data-bs-target="#profileModal">${response["schedule"][scheduleID][i][objID]["phone_2"]}</a>\
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue; background-color: ${response["schedule"][scheduleID][i][objID]["teacher__color__hex_code"]};" scope="row" data-label="Profesor">\
                                                    <button class="btn-sm" onclick="changeStudentTeacher(${response["schedule"][scheduleID][i][objID]["id"]});" id="studentTeacherBtn${response["schedule"][scheduleID][i][objID]["id"]}">${
								response["schedule"][scheduleID][i][objID]["teacher__username"] !== null ? response["schedule"][scheduleID][i][objID]["teacher__username"] : "Reclamar"
							}</button>\
                                                </td>\
                                            </tr>`);
						}

						response["schedule"][scheduleID][i] = `<button type="button" class="btn btn-outline-primary rounded-pill" data-bs-toggle="modal" data-bs-target="#scheduleModal${scheduleID}${i}">Ver</button>`;
					}
				}

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
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Domingo">\
                                                    ${response["schedule"][scheduleID][8]}\
                                                </td>\
                                            </tr>`);
			}

			document.querySelector("#showScheduleButton").style.visibility = "visible";

			document.querySelector("#studentSchedule").style.display = "block";
			document.querySelector("#loadStudentSchedule").classList.remove("loader");
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

function changeStudentTeacher(userID) {
	fetch(`${mysite}/users/change_student_teacher/${userID}`)
		.then((response) => response.json())
		.then((response) => {
			document.querySelectorAll(`#studentTeacherBtn${userID}`).forEach(function (button) {
				button.innerHTML = response["teacher"];
				button.parentNode.style.backgroundColor = response["color"];
			});
		});
}

// FUNCTION TO GET STUDENT LEVEL PERCERNTAGE
function getThisPercentage(levelID, studentID) {
	$.ajax({
		type: "GET",
		url: `${mysite}/users/get_this_percentage/`,
		data: {
			levelID: levelID,
			studentID: studentID,
		},
		beforeSend: function () {
			// TODO
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			if (response["is_active"]) {
				document.querySelectorAll(`.thisPercentage${studentID}`).forEach((element) => {
					element.innerHTML = `${response["percentage"]}`;
				});
				if (response["certificate_img"]) {
					document.querySelectorAll(`.thisCertificate${studentID}`).forEach((element) => {
						element.innerHTML = `<button target="_blank" class="btn-sm" onclick="window.open('${mysite + response["certificate_img"]}')">PNG</button><button target="_blank" class="btn-sm" onclick="window.open('${mysite + response["certificate_pdf"]}')">PDF</button>`;
					});
				} else {
					document.querySelectorAll(`.thisCertificate${studentID}`).forEach((element) => {
						element.innerHTML = ``;
					});
				}

				let deliveredBtn;
				let delivered;

				if (response["delivered"]) {
					deliveredBtn = "btn-danger";
					delivered = "NO ENTREGADO";
				} else if (response["delivered"] === false) {
					deliveredBtn = "btn-success";
					delivered = "ENTREGADO";
				} else {
					// null
					deliveredBtn = "btn-secondary";
					delivered = "PENDIENTE";
				}

				document.querySelectorAll(`#btnDelivered${studentID}`).forEach((element) => {
					element.classList.remove("btn-danger");
					element.classList.remove("btn-success");
					element.classList.remove("btn-secondary");
					element.classList.add(deliveredBtn);

					element.innerHTML = delivered;
					element.style.display = "inline-block";
				});
			} else {
				document.querySelectorAll(`.thisPercentage${studentID}`).forEach((element) => {
					element.innerHTML = `Inactivo`;
				});
				document.querySelectorAll(`.thisCertificate${studentID}`).forEach((element) => {
					element.innerHTML = ``;
				});
				document.querySelectorAll(`#btnDelivered${studentID}`).forEach((element) => {
					element.style.display = "none";
				});
			}
		},
	});
}

// FUNCTION TO CHANGE DELIVERED STATUS

function changeDelivered(levelID, studentID) {
	fetch(`${mysite}/users/change_delivered/${levelID}/${studentID}`)
		.then((response) => response.json())
		.then((response) => {
			document.querySelectorAll(`#btnDelivered${studentID}`).forEach((element) => {
				let deliveredBtn;
				let delivered;

				if (response["delivered"]) {
					deliveredBtn = "btn-danger";
					delivered = "NO ENTREGADO";

					element.classList.remove("btn-success");
					element.classList.remove("btn-secondary");
				} else if (response["delivered"] === false) {
					deliveredBtn = "btn-success";
					delivered = "ENTREGADO";

					element.classList.remove("btn-danger");
					element.classList.remove("btn-secondary");
				} else {
					// null
					deliveredBtn = "btn-secondary";
					delivered = "PENDIENTE";

					element.classList.remove("btn-danger");
					element.classList.remove("btn-success");
				}

				element.innerHTML = delivered;
				element.classList.add(deliveredBtn);
			});
		});
}

// LEVEL LOAD FUNCTIONS

// Start first level student
let levelStudentsCounter = 0;

// Load 20 levels students at a time
let levelStudentsQuantity = 20;

// All level students loaded
let allLevelStudentsLoaded = false;

// Save current levelID
let currentLevelID = 0;

function changeThisFilter(filter) {
	setLevel(currentLevelID, filter);
}

function load_students_levels(levelID, filter) {
	// console.log("hi?");
	const start = levelStudentsCounter;
	const end = levelStudentsCounter + levelStudentsQuantity;
	levelStudentsCounter = end + 1;

	if (allLevelStudentsLoaded === false) {
		$.ajax({
			type: "GET",
			url: `${mysite}/users/load_level_students/`,
			data: {
				start: start,
				end: end,
				levelID: levelID,
				filter: filter,
			},
			beforeSend: function () {
				document.querySelector("#loadLevel").classList.add("loader");
				document.querySelector("#loadMoreLevelBtn").style.display = "none";
			},
			error: function (error) {
				console.log("Error!", error);
			},
			success: function (response) {
				// console.log(response);
				document.querySelector("#searchlevelName").innerHTML = response["levelName"];

				if (response["all_loaded"] == true) {
					allLevelStudentsLoaded = true;
				}

				for (var studentsID = 0; studentsID < response["students"].length; studentsID++) {
					let deliveredBtn;
					let delivered;

					if (response["students"][studentsID]["delivered"]) {
						deliveredBtn = "btn btn-sm btn-danger";
						delivered = "NO ENTREGADO";
					} else if (response["students"][studentsID]["delivered"] === false) {
						deliveredBtn = "btn btn-sm btn-success";
						delivered = "ENTREGADO";
					} else {
						// null
						deliveredBtn = "btn btn-sm btn-secondary";
						delivered = "PENDIENTE";
					}

					$(`#levelTableBody`).append(`<tr> \
									<td scope="row" data-label="Profesor" style="background-color: ${response["students"][studentsID]["student__teacher__color__hex_code"]};"> \
										<button onclick="changeStudentTeacher(${response["students"][studentsID]["student__id"]});" id="studentTeacherBtn${response["students"][studentsID]["student__id"]}" class="btn-sm">${response["students"][studentsID]["student__teacher__username"] !== null ? response["students"][studentsID]["student__teacher__username"] : "Reclamar"}</button>\
									</td>\
									<td scope="row" data-label="Documento"> \
										<a href="#" onclick="load_profile_data(${response["students"][studentsID]["student__id"]});" data-bs-toggle="modal" data-bs-target="#profileModal">${response["students"][studentsID]["student__identity_document"]}</a>\
									</td>\
									<td scope="row" data-label="Nombres">\
										<a href="#" onclick="load_profile_data(${response["students"][studentsID]["student__id"]});" data-bs-toggle="modal" data-bs-target="#profileModal">${response["students"][studentsID]["student__first_name"]}</a>\
									</td>\
									<td scope="row" data-label="Apellidos">\
										<a href="#" onclick="load_profile_data(${response["students"][studentsID]["student__id"]});" data-bs-toggle="modal" data-bs-target="#profileModal">${response["students"][studentsID]["student__last_name"]}</a>\
									</td>\
									<td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Certificado">\
										<span style="font-size: medium;" class="thisPercentage${response["students"][studentsID]["student__id"]}"></span> <span class="thisCertificate${response["students"][studentsID]["student__id"]}"></span> <button id="btnDelivered${response["students"][studentsID]["student__id"]}" onclick="changeDelivered(${levelID}, ${
						response["students"][studentsID]["student__id"]
					});" class="${deliveredBtn}">${delivered}</button>\
									</td>\
								</tr>`);

					if (response["students"][studentsID]["certificate_img"]) {
						document.querySelector(`.thisCertificate${response["students"][studentsID]["student__id"]}`).innerHTML = `<button target="_blank" class="btn-sm" onclick="window.open('${mysite + "/media/" + response["students"][studentsID]["certificate_img"]}')">PNG</button><button target="_blank" class="btn-sm" onclick="window.open('${
							mysite + "/media/" + response["students"][studentsID]["certificate_pdf"]
						}')">PDF</button>`;
					}
					getThisPercentage(levelID, response["students"][studentsID]["student__id"]);
				}
				document.querySelector("#loadLevel").classList.remove("loader");
				document.querySelector("#loadMoreLevelBtn").style.display = "block";
			},
		});
	} else {
		document.querySelector("#loadMoreLevelBtn").style.display = "none";
	}
}

// This AJAX function searches Students in a level

$("#levelSearch").keyup(
	delay(function () {
		let levelID = $("#levelSearchValue").val();

		$.ajax({
			type: "GET",
			url: `${mysite}/users/search_level_students/`,
			data: {
				student: $(this).val(),
				levelID: levelID,
			},
			beforeSend: function () {
				document.querySelector("#searchLoadLevel").classList.add("loader");
				document.querySelector("#searchLevelTableBody").innerHTML = "";
			},
			error: function (error) {
				console.log("Error!", error);
			},
			success: function (response) {
				document.querySelector("#searchLevelTable").style.visibility = "visible";

				if (response["students"].length > 0) {
					for (var studentsID = 0; studentsID < response["students"].length; studentsID++) {
						let deliveredBtn;
						let delivered;

						if (response["students"][studentsID]["delivered"]) {
							deliveredBtn = "btn btn-sm btn-danger";
							delivered = "NO ENTREGADO";
						} else if (response["students"][studentsID]["delivered"] === false) {
							deliveredBtn = "btn btn-sm btn-success";
							delivered = "ENTREGADO";
						} else {
							// null
							deliveredBtn = "btn btn-sm btn-secondary";
							delivered = "PENDIENTE";
						}

						$(`#searchLevelTableBody`).append(`<tr> \
									<td scope="row" data-label="Profesor" style="background-color: ${response["students"][studentsID]["student__teacher__color__hex_code"]};"> \
										<button onclick="changeStudentTeacher(${response["students"][studentsID]["student__id"]});" id="studentTeacherBtn${response["students"][studentsID]["student__id"]}" class="btn-sm">${response["students"][studentsID]["student__teacher__username"] !== null ? response["students"][studentsID]["student__teacher__username"] : "Reclamar"}</button>\
									</td>\
									<td scope="row" data-label="Documento"> \
										<a href="#" onclick="load_profile_data(${response["students"][studentsID]["student__id"]});" data-bs-toggle="modal" data-bs-target="#profileModal">${response["students"][studentsID]["student__identity_document"]}</a>\
									</td>\
									<td scope="row" data-label="Nombres">\
										<a href="#" onclick="load_profile_data(${response["students"][studentsID]["student__id"]});" data-bs-toggle="modal" data-bs-target="#profileModal">${response["students"][studentsID]["student__first_name"]}</a>\
									</td>\
									<td scope="row" data-label="Apellidos">\
										<a href="#" onclick="load_profile_data(${response["students"][studentsID]["student__id"]});" data-bs-toggle="modal" data-bs-target="#profileModal">${response["students"][studentsID]["student__last_name"]}</a>\
									</td>\
									<td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Certificado">\
										<span style="font-size: medium;" class="thisPercentage${response["students"][studentsID]["student__id"]}"></span> <span class="thisCertificate${response["students"][studentsID]["student__id"]}"></span> <button id="btnDelivered${response["students"][studentsID]["student__id"]}" onclick="changeDelivered(${levelID}, ${
							response["students"][studentsID]["student__id"]
						});" class="${deliveredBtn}">${delivered}</button>\
									</td>\
								</tr>`);
						if (response["students"][studentsID]["certificate_img"]) {
							document.querySelector(`.thisCertificate${response["students"][studentsID]["student__id"]}`).innerHTML = `<button target="_blank" class="btn-sm" onclick="window.open('${mysite + "/media/" + response["students"][studentsID]["certificate_img"]}')">PNG</button><button target="_blank" class="btn-sm" onclick="window.open('${
								mysite + "/media/" + response["students"][studentsID]["certificate_pdf"]
							}')">PDF</button>`;
						}
						getThisPercentage(levelID, response["students"][studentsID]["student__id"]);
					}
				} else {
					$(`#searchLevelTableBody`).append(`<tr> \
									<td scope="row" data-label="Profesor"> \
										<a href="#">SIN RESULTADOS</a>\
									</td>\
									<td scope="row" data-label="Documento"> \
										<a href="#"></a>\
									</td>\
									<td scope="row" data-label="Nombres">\
										<a href="#">-</a>\
									</td>\
									<td scope="row" data-label="Apellidos">\
										<a href="#">-</a>\
									</td>\
									<td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Certificado">\
										<a href="#">-</a>\
									</td>\
								</tr>`);
				}

				document.querySelector("#searchLoadLevel").classList.remove("loader");
			},
		});
	}, 1000)
);

function setLevel(levelID, filter) {
	// Start first level student
	levelStudentsCounter = 0;

	// Load 20 levels students at a time
	levelStudentsQuantity = 20;

	// All level students loaded
	allLevelStudentsLoaded = false;

	// Set current levelID
	currentLevelID = Number(levelID);

	if (filter === 0) {
		document.querySelector("#fitlerSelection").value = 0;
	}

	document.querySelector("#levelSearchValue").value = levelID;
	document.querySelector("#loadMoreLevelBtn").setAttribute("onClick", `javascript: load_students_levels(${levelID}, ${filter});`);

	document.querySelector("#searchLevelTable").style.visibility = "hidden";
	document.querySelector("#searchLevelTableBody").innerHTML = "";

	document.querySelector("#levelTableBody").innerHTML = "";
	document.querySelector("#loadMoreLevelBtn").style.display = "block";
	document.querySelector("#loadMoreLevelBtn").click();
}

$("#editProfileForm").submit(function (e) {
	e.preventDefault();

	var form = $(this);
	var action = form.attr("action");

	$.ajax({
		type: "POST",
		url: `${mysite}${action}`,
		data: form.serialize(),
		beforeSend: function () {
			document.querySelector("#editProfileButton").style.display = "none";
			document.querySelector("#loadEditProfile").classList.add("loader");
			document.querySelector("#editProfileMessages").classList.remove("alert");

			document.querySelector("#editProfileMessages").classList.remove("alert-danger");

			document.querySelector("#editProfileMessages").innerHTML = "";
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);

			if (response["edited"] !== false) {
				location.reload();
			} else {
				document.querySelector("#loadEditProfile").classList.remove("loader");
				document.querySelector("#editProfileButton").style.display = "block";

				for (messageID in response["messages"]) {
					document.querySelector("#editProfileMessages").classList.add("alert");
					document.querySelector("#editProfileMessages").classList.add("alert-danger");
					$("#editProfileMessages").append(`<li class="ml-2">${response["messages"][messageID]}</li>`);
				}
			}
		},
	});
});

function studentStatistics(user_id) {
	$.ajax({
		type: "GET",
		url: `${mysite}/courses/student_statistics/`,
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
			document.querySelector("#loadStudentStatistics").classList.remove("loader");

			document.querySelector("#showStudentStatisticsButton").style.visibility = "visible";

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
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Puede Recuperar">\
                                                    ${response["can_recover"]}\
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

function prettyDate(time) {
	var date = new Date(time),
		diff = (new Date().getTime() - date.getTime()) / 1000,
		day_diff = Math.floor(diff / 86400);
	var year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate();

	if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) return year.toString() + "-" + (month < 10 ? "0" + month.toString() : month.toString()) + "-" + (day < 10 ? "0" + day.toString() : day.toString());

	var r =
		(day_diff == 0 && ((diff < 60 && "justo ahora") || (diff < 120 && "Hace 1 minuto") || (diff < 3600 && "Hace " + Math.floor(diff / 60) + " minutos") || (diff < 7200 && "Hace 1 hora") || (diff < 86400 && "Hace " + Math.floor(diff / 3600) + " horas"))) ||
		(day_diff == 1 && "Ayer") ||
		(day_diff < 7 && "Hace " + day_diff + " días") ||
		(day_diff < 31 && "Hace " + Math.ceil(day_diff / 7) + " semanas");
	return r;
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
			url: `${mysite}/courses/search_students/`,
			data: {
				student: $(this).val(),
			},
			beforeSend: function () {
				document.querySelector("#resultsSearchStudentsTable").style.visibility = "hidden";
				document.querySelector("#resultsSearchStudentsTableBody").innerHTML = "";

				document.querySelector("#searchStudentsLoader").classList.add("loader");
			},
			error: function (error) {
				console.log("Error!", error);
			},
			success: function (response) {
				document.querySelector("#resultsSearchStudentsTable").style.visibility = "visible";

				document.querySelector("#searchStudentsLoader").classList.remove("loader");

				for (studentID in response["students"]) {
					login = prettyDate(response["students"][studentID]["real_last_login"]);

					login = login !== "1969-12-31" ? login : "-";

					$("#resultsSearchStudentsTableBody").append(`<tr> \
                                                <td scope="row" data-label="Documento"> \
                                                    <a href="#" onclick="load_profile_data(${response["students"][studentID]["id"]});" data-bs-toggle="modal" data-bs-target="#profileModal">${response["students"][studentID]["identity_document"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Nombres">\
                                                    <a href="#" onclick="load_profile_data(${response["students"][studentID]["id"]});" data-bs-toggle="modal" data-bs-target="#profileModal">${response["students"][studentID]["first_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Apellidos">\
                                                    <a href="#" onclick="load_profile_data(${response["students"][studentID]["id"]});" data-bs-toggle="modal" data-bs-target="#profileModal">${response["students"][studentID]["last_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (1)">\
                                                    <a href="#" onclick="load_profile_data(${response["students"][studentID]["id"]});" data-bs-toggle="modal" data-bs-target="#profileModal">${response["students"][studentID]["phone_1"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (2)">\
                                                    <a href="#" onclick="load_profile_data(${response["students"][studentID]["id"]});" data-bs-toggle="modal" data-bs-target="#profileModal">${response["students"][studentID]["phone_2"]}</a>\
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Últ. vez">\
                                                    <a href="#" onclick="load_profile_data(${response["students"][studentID]["id"]});" data-bs-toggle="modal" data-bs-target="#profileModal">${login}</a>\
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
                                                <td scope="row" data-label="Tel/Cel (2)">\
                                                    <a href="#">-</a>\
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Últ. vez">\
                                                    <a href="#">-</a>\
                                                </td>\
                                            </tr>`);
				}
			},
		});
	}, 1000)
);

function showStudentSearch() {
	if (document.querySelector("#studentSearch").style.display === "none") {
		document.querySelector("#studentSearch").style.display = "block";
		document.querySelector("#showStudentSearchButton").innerHTML = "Cerrar";
	} else {
		document.querySelector("#studentSearch").style.display = "none";
		document.querySelector("#showStudentSearchButton").innerHTML = "Abrir";
	}
}
