// var mysite = "http://127.0.0.1:8000";
var mysite = "https://aquariumschool.co";

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
			for (
				var scheduleID = 0;
				scheduleID < response["schedule"].length;
				scheduleID++
			) {
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
					if (response["schedule"][scheduleID][i] !== ["-"]) {
						$("#modalsDiv")
							.append(`<div class="modal" id="scheduleModal${scheduleID}${i}" tabindex="-1" aria-labelledby="plusStudentModalLabel" aria-hidden="true">\
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
												<th scope="col">Color</th>\
											</tr>\
										</thead>\
										<tbody id="scheduleModalBody${scheduleID}${i}"></tbody>\
									</table>\
								</div>\
							</div>\
						</div>\
					</div>`);

						for (
							var objID = 0;
							objID < response["schedule"][scheduleID][i].length;
							objID++
						) {
							var color = "lightgrey";

							if (
								response["schedule"][scheduleID][i][objID][
									"color__hex_code"
								] !== null
							) {
								color =
									response["schedule"][scheduleID][i][objID]["color__hex_code"];
							}
							// console.log(response["schedule"][scheduleID][i][objID]);
							$(`#scheduleModalBody${scheduleID}${i}`).append(`<tr> \
                                                <td scope="row" data-label="Documento"> \
                                                    <a href="${mysite}/users/profile/${response["schedule"][scheduleID][i][objID]["id"]}">${response["schedule"][scheduleID][i][objID]["identity_document"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Nombres">\
                                                    <a href="${mysite}/users/profile/${response["schedule"][scheduleID][i][objID]["id"]}">${response["schedule"][scheduleID][i][objID]["first_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Apellidos">\
                                                    <a href="${mysite}/users/profile/${response["schedule"][scheduleID][i][objID]["id"]}">${response["schedule"][scheduleID][i][objID]["last_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (1)">\
                                                    <a href="${mysite}/users/profile/${response["schedule"][scheduleID][i][objID]["id"]}">${response["schedule"][scheduleID][i][objID]["phone_1"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (2)">\
                                                    <a href="${mysite}/users/profile/${response["schedule"][scheduleID][i][objID]["id"]}">${response["schedule"][scheduleID][i][objID]["phone_2"]}</a>\
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Color">\
                                                    <button onclick="changeStudentColor(${response["schedule"][scheduleID][i][objID]["id"]});" id="studentColorBtn${response["schedule"][scheduleID][i][objID]["id"]}" class="btn btn-lg" style="background-color: ${color};"></button>\
                                                </td>\
                                            </tr>`);
						}

						response["schedule"][scheduleID][
							i
						] = `<button type="button" class="btn btn-outline-primary rounded-pill" data-bs-toggle="modal" data-bs-target="#scheduleModal${scheduleID}${i}">Ver</button>`;
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

			document.querySelector("#showScheduleButton").style.visibility =
				"visible";

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

function changeStudentColor(userID) {
	fetch(`${mysite}/users/change_student_color/${userID}`)
		.then((response) => response.json())
		.then((response) => {
			document
				.querySelectorAll(`#studentColorBtn${userID}`)
				.forEach(function (button) {
					button.style.backgroundColor = response["color"];
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

function load_students_levels(levelID) {
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
			},
			beforeSend: function () {
				document.querySelector("#loadLevel").classList.add("loader");
				document.querySelector("#loadMoreLevelBtn").style.display = "none";
			},
			error: function (error) {
				console.log("Error!", error);
			},
			success: function (response) {
				document.querySelector("#searchlevelName").innerHTML =
					response["levelName"];

				if (response["all_loaded"] == true) {
					allLevelStudentsLoaded = true;
				}

				for (
					var studentsID = 0;
					studentsID < response["students"].length;
					studentsID++
				) {
					$(`#levelTableBody`).append(`<tr> \
									<td scope="row" data-label="Documento"> \
										<a href="${mysite}/users/profile/${response["students"][studentsID]["student__id"]}">${response["students"][studentsID]["student__identity_document"]}</a>\
									</td>\
									<td scope="row" data-label="Nombres">\
										<a href="${mysite}/users/profile/${response["students"][studentsID]["student__id"]}">${response["students"][studentsID]["student__first_name"]}</a>\
									</td>\
									<td scope="row" data-label="Apellidos">\
										<a href="${mysite}/users/profile/${response["students"][studentsID]["student__id"]}">${response["students"][studentsID]["student__last_name"]}</a>\
									</td>\
									<td scope="row" data-label="Tel/Cel (1)">\
										<a href="${mysite}/users/profile/${response["students"][studentsID]["student__id"]}">${response["students"][studentsID]["student__phone_1"]}</a>\
									</td>\
									<td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Tel/Cel (2)">\
										<a href="${mysite}/users/profile/${response["students"][studentsID]["student__id"]}">${response["students"][studentsID]["student__phone_2"]}</a>\
									</td>\
								</tr>`);
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
				document.querySelector("#searchLevelTable").style.visibility =
					"visible";

				if (response["students"].length > 0) {
					for (
						var studentsID = 0;
						studentsID < response["students"].length;
						studentsID++
					) {
						$(`#searchLevelTableBody`).append(`<tr> \
									<td scope="row" data-label="Documento"> \
										<a href="${mysite}/users/profile/${response["students"][studentsID]["student__id"]}">${response["students"][studentsID]["student__identity_document"]}</a>\
									</td>\
									<td scope="row" data-label="Nombres">\
										<a href="${mysite}/users/profile/${response["students"][studentsID]["student__id"]}">${response["students"][studentsID]["student__first_name"]}</a>\
									</td>\
									<td scope="row" data-label="Apellidos">\
										<a href="${mysite}/users/profile/${response["students"][studentsID]["student__id"]}">${response["students"][studentsID]["student__last_name"]}</a>\
									</td>\
									<td scope="row" data-label="Tel/Cel (1)">\
										<a href="${mysite}/users/profile/${response["students"][studentsID]["student__id"]}">${response["students"][studentsID]["student__phone_1"]}</a>\
									</td>\
									<td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Tel/Cel (2)">\
										<a href="${mysite}/users/profile/${response["students"][studentsID]["student__id"]}">${response["students"][studentsID]["student__phone_2"]}</a>\
									</td>\
								</tr>`);
					}
				} else {
					$(`#searchLevelTableBody`).append(`<tr> \
									<td scope="row" data-label="Documento"> \
										<a href="#">SIN RESULTADOS</a>\
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

				document.querySelector("#searchLoadLevel").classList.remove("loader");
			},
		});
	}, 1000)
);

function setLevel(levelID) {
	// Start first level student
	levelStudentsCounter = 0;

	// Load 20 levels students at a time
	levelStudentsQuantity = 20;

	// All level students loaded
	allLevelStudentsLoaded = false;

	document.querySelector("#levelSearchValue").value = levelID;
	document
		.querySelector("#loadMoreLevelBtn")
		.setAttribute("onClick", `javascript: load_students_levels(${levelID});`);

	document.querySelector("#searchLevelTable").style.visibility = "hidden";

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

			document
				.querySelector("#editProfileMessages")
				.classList.remove("alert-danger");

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
					document
						.querySelector("#editProfileMessages")
						.classList.add("alert-danger");
					$("#editProfileMessages").append(
						`<li class="ml-2">${response["messages"][messageID]}</li>`
					);
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
