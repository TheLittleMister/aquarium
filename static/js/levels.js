function showlevels() {
	if (document.querySelector("#levelsDiv").style.display === "none") {
		document.querySelector("#levelsDiv").style.display = "block";
		document.querySelector("#showLevelsBtn").innerHTML = "Cerrar";
	} else {
		document.querySelector("#levelsDiv").style.display = "none";
		document.querySelector("#showLevelsBtn").innerHTML = "Abrir";
	}
}

function levels(userID) {
	// console.log(userID);

	document.querySelector("#levelsDiv").style.display = "block";
	document.querySelector("#levelsBtn").style.display = "none";
	document.querySelector("#showLevelsBtn").style.visibility = "visible";

	fetch(`https://aquariumschool.co/courses/levels/${userID}`)
		.then((response) => response.json())
		.then((response) => {
			// console.log(response);

			for (level in response) {
				if (response[level]["is_active"] === false) {
					document.querySelector(
						`#level${response[level]["levelID"]}`
					).innerHTML = `<button onclick="editLevel(${response[level]["studentLevelID"]});" type="button" class="btn btn-outline-primary rounded-pill" data-bs-toggle="modal" data-bs-target="#modalLevel">Activar</button>`;
				} else {
					$.ajax({
						type: "GET",
						url: "https://aquariumschool.co/courses/date_attendances/",
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
							if (
								ajaxResponse["certificate_img"] !== null &&
								ajaxResponse["certificate_pdf"] !== null
							) {
								document.querySelector(
									`#level${ajaxResponse["levelID"]}`
								).innerHTML = `<div> \
                                    <button onclick="editLevel(${ajaxResponse["studentLevelID"]});" class="btn btn-sm btn-outline-primary mb-2" style="float: right;" data-bs-toggle="modal" data-bs-target="#modalLevel">EDITAR</button>\
                                    <strong>Desde:</strong> ${ajaxResponse["date"]}\
                                    <br>\
                                    <strong>Asistencias:</strong> ${ajaxResponse["attendances_count"]}/${ajaxResponse["levelAttendances"]}\
                                </div>\
								<a class="btn btn-sm btn-primary mb-2" href="${ajaxResponse["certificate_img"]}">CERTIFICADO PNG</a>\
								<a class="btn btn-sm btn-primary mb-2" href="${ajaxResponse["certificate_pdf"]}">CERTIFICADO PDF</a>\
                                <br>\
								<button onclick="deleteCertificate(${ajaxResponse["studentLevelID"]});" class="btn btn-sm btn-danger mb-2" href="#">BORRAR CERTIFICADO</button>\
                                <br>\
                                <div class="w3-white w3-round-xlarge">\
                                    <div class="w3-round-xlarge w3-center w3-orange" style="height:24px;width:${ajaxResponse["percentage"]}%">${ajaxResponse["percentage"]}%</div>\
                                </div>`;
							} else {
								document.querySelector(
									`#level${ajaxResponse["levelID"]}`
								).innerHTML = `<div> \
                                    <button onclick="editLevel(${ajaxResponse["studentLevelID"]});" class="btn btn-sm btn-outline-primary mb-2" style="float: right;" data-bs-toggle="modal" data-bs-target="#modalLevel">EDITAR</button>\
                                    <strong>Desde:</strong> ${ajaxResponse["date"]}\
                                    <br>\
                                    <strong>Asistencias:</strong> ${ajaxResponse["attendances_count"]}/${ajaxResponse["levelAttendances"]}\
                                </div>\
								<button onclick="generateCertificate(${ajaxResponse["studentLevelID"]});" class="btn btn-sm btn-warning mb-2" href="#">GENERAR CERTIFICADO</button>\
                                <br>\
                                <div class="w3-white w3-round-xlarge">\
                                    <div class="w3-round-xlarge w3-center w3-orange" style="height:24px;width:${ajaxResponse["percentage"]}%">${ajaxResponse["percentage"]}%</div>\
                                </div>`;
							}
						},
					});
				}
			}
		});
}

function editLevel(studentLevelID) {
	fetch(`https://aquariumschool.co/courses/level_info/${studentLevelID}`)
		.then((response) => response.json())
		.then((response) => {
			document.querySelector("#levelFormMessages").classList.remove("alert");

			document
				.querySelector("#levelFormMessages")
				.classList.remove("alert-danger");

			document.querySelector("#levelFormMessages").innerHTML = "";

			document.querySelector("#levelName").innerHTML = `${response["name"]}`;
			document
				.querySelector("#deactivateLevel")
				.setAttribute(
					"onClick",
					`javascript: deactivateLevel(${studentLevelID});`
				);

			$("#levelFormDiv").html(response["form"]);
			$("#levelForm").attr("action", `/courses/edit_level/${studentLevelID}`);
			$("#levelFormDiv").append(
				`<button id="btnLevelSubmit" class="btn btn-secondary" type="submit">Guardar</button> \
				<div id="btnLevelLoader"></div>`
			);
		});
}

$("#levelForm").submit(function (e) {
	e.preventDefault();

	var form = $(this);
	var action = form.attr("action");

	$.ajax({
		type: "POST",
		url: `https://aquariumschool.co${action}`,
		data: form.serialize(),
		beforeSend: function () {
			document.querySelector("#btnLevelSubmit").style.display = "none";
			document.querySelector("#btnLevelLoader").classList.add("loader");
			document.querySelector("#levelFormMessages").classList.remove("alert");

			document
				.querySelector("#levelFormMessages")
				.classList.remove("alert-danger");

			document.querySelector("#levelFormMessages").innerHTML = "";
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);

			levels(response["userID"]);

			if (response["edited"] === true) {
				document.querySelector("#btnLevelLoader").classList.remove("loader");
				document.querySelector("#btnLevelSubmit").style.display = "block";

				document.querySelector("#levelFormMessages").classList.add("alert");
				document
					.querySelector("#levelFormMessages")
					.classList.add("alert-success");

				$("#levelFormMessages").append(
					`<li class="ml-2">Cambios Guardados!</li>`
				);
			} else {
				document.querySelector("#btnLevelLoader").classList.remove("loader");
				document.querySelector("#btnLevelSubmit").style.display = "block";

				document.querySelector("#levelFormMessages").classList.add("alert");
				document
					.querySelector("#levelFormMessages")
					.classList.add("alert-danger");

				for (messageID in response["messages"]) {
					$("#levelFormMessages").append(
						`<li class="ml-2">${response["messages"][messageID]}</li>`
					);
				}
			}
		},
	});
});

function deactivateLevel(studentLevelID) {
	fetch(
		`https://aquariumschool.co/courses/deactivate_level/${studentLevelID}`
	)
		.then((response) => response.json())
		.then((response) => {
			levels(response["userID"]);
		});
}

function generateCertificate(studentLevelID) {
	fetch(
		`https://aquariumschool.co/courses/generate_certificate/${studentLevelID}`
	)
		.then((response) => response.json())
		.then((response) => {
			levels(response["userID"]);
		});
}

function deleteCertificate(studentLevelID) {
	fetch(
		`https://aquariumschool.co/courses/delete_certificate/${studentLevelID}`
	)
		.then((response) => response.json())
		.then((response) => {
			levels(response["userID"]);
		});
}
