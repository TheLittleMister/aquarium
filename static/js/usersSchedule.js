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

function getSchedule(user_id) {
	$.ajax({
		type: "GET",
		url: `${mysite}/courses/create_schedule/`,
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

			for (var scheduleID = 0; scheduleID < response["schedule"].length; scheduleID++) {
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
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Domingo">\
                                                    ${response["schedule"][scheduleID][8]}\
                                                </td>\
                                            </tr>`);
			}

			document.querySelector("#showScheduleButton").style.visibility = "visible";
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
