// var mysite = "http://127.0.0.1:8000";
// var mysite = "https://aquariumschool.co";

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
	document.querySelector("#levelsBtn").style.display = "none";
	document.querySelector("#loadStudentLevels").classList.add("loader");

	fetch(`${mysite}/courses/levels/${userID}`)
		.then((response) => response.json())
		.then((response) => {
			// console.log(response);

			for (level in response) {
				if (response[level]["is_active"] === false) {
					document.querySelector(
						`#level${response[level]["levelID"]}`
					).innerHTML = `<div class="w3-white w3-round-xlarge">\
                                    <div class="w3-round-xlarge w3-center w3-orange" style="height:24px;width:0%">0%</div>\
                                </div>`;
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
							// console.log(ajaxResponse["levelID"]);
							// console.log(ajaxResponse["certificate_img"]);
							if (
								ajaxResponse["certificate_img"] !== null &&
								ajaxResponse["certificate_pdf"] !== null
							) {
								document.querySelector(
									`#level${ajaxResponse["levelID"]}`
								).innerHTML = `<a class="btn btn-sm btn-primary mb-2" href="${ajaxResponse["certificate_img"]}">CERTIFICADO PNG</a>\
								<a class="btn btn-sm btn-primary mb-2" href="${ajaxResponse["certificate_pdf"]}">CERTIFICADO PDF</a>\
								<div class="w3-white w3-round-xlarge">\
                                    <div class="w3-round-xlarge w3-center w3-orange" style="height:24px;width:${ajaxResponse["percentage"]}%">${ajaxResponse["percentage"]}%</div>\
                                </div>`;
							} else {
								document.querySelector(
									`#level${ajaxResponse["levelID"]}`
								).innerHTML = `<div class="w3-white w3-round-xlarge">\
                                    <div class="w3-round-xlarge w3-center w3-orange" style="height:24px;width:${ajaxResponse["percentage"]}%">${ajaxResponse["percentage"]}%</div>\
                                </div>`;
							}
						},
					});
				}
			}
			document.querySelector("#loadStudentLevels").classList.remove("loader");
			document.querySelector("#levelsDiv").style.display = "block";
			document.querySelector("#showLevelsBtn").style.visibility = "visible";
		});
}
