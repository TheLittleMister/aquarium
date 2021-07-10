// var mysite = "http://127.0.0.1:8000";
// var mysite = "https://aquariumschool.co";

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

function getScheduleModal(user_id) {
	$.ajax({
		type: "GET",
		url: `${mysite}/courses/create_schedule/`,
		data: {
			userID: user_id,
		},
		beforeSend: function () {
			document.querySelector("#studentScheduleModal").style.display = "block";
			document.querySelector("#getScheduleButtonModal").style.display = "none";
			document.querySelector("#loadStudentScheduleModal").classList.add("loader");
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			document.querySelector("#loadStudentScheduleModal").classList.remove("loader");

			for (var scheduleID = 0; scheduleID < response["schedule"].length; scheduleID++) {
				var DE = tConvert(response["schedule"][scheduleID][0]);
				var A = tConvert(response["schedule"][scheduleID][1]);

				$("#studentScheduleBodyModal").append(`<tr> \
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

			document.querySelector("#showScheduleButtonModal").style.visibility = "visible";
		},
	});
}

function showScheduleModal() {
	if (document.querySelector("#studentScheduleModal").style.display === "none") {
		document.querySelector("#studentScheduleModal").style.display = "block";
		document.querySelector("#showScheduleButtonModal").innerHTML = "Cerrar";
	} else {
		document.querySelector("#studentScheduleModal").style.display = "none";
		document.querySelector("#showScheduleButtonModal").innerHTML = "Abrir";
	}
}

function levelsModal(userID) {
	// console.log(userID);

	document.querySelector("#levelsBtnModal").style.display = "none";
	document.querySelector("#loadStudentLevelsModal").classList.add("loader");

	fetch(`${mysite}/courses/levels/${userID}`)
		.then((response) => response.json())
		.then((response) => {
			// console.log(response);

			for (level in response) {
				if (response[level]["is_active"] === false) {
					document.querySelector(`#level${response[level]["levelID"]}Modal`).innerHTML = `<button onclick="editLevel(${response[level]["studentLevelID"]});" type="button" class="btn btn-outline-primary rounded-pill" data-bs-toggle="modal" data-bs-target="#modalLevel">Activar</button>`;
				} else {
					$.ajax({
						type: "GET",
						url: `${mysite}/courses/date_attendances/`,
						data: {
							date: response[level]["date"],
							userID: userID,
							studentLevelID: response[level]["studentLevelID"],
							levelID: response[level]["levelID"],
							levelAttendances: response[level]["attendances"],
						},
						beforeSend: function () {
							// TODO
						},
						error: function (error) {
							console.log("Error!", error);
						},
						success: function (ajaxResponse) {
							let deliveredBtn;
							let delivered;

							// console.log(ajaxResponse);
							if (ajaxResponse["delivered"]) {
								deliveredBtn = "btn btn-sm btn-danger";
								delivered = "NO ENTREGADO";
							} else if (ajaxResponse["delivered"] === false) {
								deliveredBtn = "btn btn-sm btn-success";
								delivered = "ENTREGADO";
							} else {
								// null
								deliveredBtn = "btn btn-sm btn-secondary";
								delivered = "PENDIENTE";
							}

							if (ajaxResponse["certificate_img"] !== null && ajaxResponse["certificate_pdf"] !== null) {
								document.querySelector(`#level${ajaxResponse["levelID"]}Modal`).innerHTML = `<div> \
                                    <button onclick="editLevel(${ajaxResponse["studentLevelID"]});" class="btn btn-sm btn-outline-primary mb-2" style="float: right;" data-bs-toggle="modal" data-bs-target="#modalLevel">EDITAR</button>\
                                    <strong>Desde:</strong> ${ajaxResponse["date"]}\
                                    <br>\
                                    <strong>Asistencias:</strong> ${ajaxResponse["attendances_count"]}/${ajaxResponse["levelAttendances"]}\
                                </div>\
								<button id="btnDelivered${userID}${ajaxResponse["levelID"]}Modal" onclick="changeThisDelivered(${ajaxResponse["levelID"]}, ${userID});" class="${deliveredBtn}">${delivered}</button><br><br>\
								<a class="btn btn-sm btn-primary mb-2" href="${ajaxResponse["certificate_img"]}">CERTIFICADO PNG</a>\
								<a class="btn btn-sm btn-primary mb-2" href="${ajaxResponse["certificate_pdf"]}">CERTIFICADO PDF</a>\
                                <br>\
								<button onclick="this.style.display='none'; deleteCertificate(${ajaxResponse["studentLevelID"]});" class="btn btn-sm btn-danger mb-2" href="#">BORRAR CERTIFICADO</button>\
                                <br>\
                                <div class="w3-white w3-round-xlarge">\
                                    <div class="w3-round-xlarge w3-center w3-orange" style="height:24px;width:${ajaxResponse["percentage"]}%">${ajaxResponse["percentage"]}%</div>\
                                </div>`;
							} else {
								document.querySelector(`#level${ajaxResponse["levelID"]}Modal`).innerHTML = `<div> \
                                    <button onclick="editLevel(${ajaxResponse["studentLevelID"]});" class="btn btn-sm btn-outline-primary mb-2" style="float: right;" data-bs-toggle="modal" data-bs-target="#modalLevel">EDITAR</button>\
                                    <strong>Desde:</strong> ${ajaxResponse["date"]}\
                                    <br>\
                                    <strong>Asistencias:</strong> ${ajaxResponse["attendances_count"]}/${ajaxResponse["levelAttendances"]}\
                                </div>\
								<button id="btnDelivered${userID}${ajaxResponse["levelID"]}Modal" onclick="changeThisDelivered(${ajaxResponse["levelID"]}, ${userID});" class="${deliveredBtn}">${delivered}</button><br><br>\
								<button onclick="this.style.display='none'; generateCertificate(${ajaxResponse["studentLevelID"]});" class="btn btn-sm btn-warning mb-2" href="#">GENERAR CERTIFICADO</button>\
                                <br>\
                                <div class="w3-white w3-round-xlarge">\
                                    <div class="w3-round-xlarge w3-center w3-orange" style="height:24px;width:${ajaxResponse["percentage"]}%">${ajaxResponse["percentage"]}%</div>\
                                </div>`;
							}

							try {
								getThisPercentage(ajaxResponse["levelID"], userID);
							} catch (error) {
								console.log("Error!", error);
							}
						},
					});
				}
			}

			document.querySelector("#loadStudentLevelsModal").classList.remove("loader");
			document.querySelector("#levelsDivModal").style.display = "block";
			document.querySelector("#showLevelsBtnModal").style.visibility = "visible";
		})
		.catch((error) => {
			document.querySelector("#loadStudentLevelsModal").classList.remove("loader");
		});
}

function showlevelsModal() {
	if (document.querySelector("#levelsDivModal").style.display === "none") {
		document.querySelector("#levelsDivModal").style.display = "block";
		document.querySelector("#showLevelsBtnModal").innerHTML = "Cerrar";
	} else {
		document.querySelector("#levelsDivModal").style.display = "none";
		document.querySelector("#showLevelsBtnModal").innerHTML = "Abrir";
	}
}
