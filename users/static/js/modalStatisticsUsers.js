function studentStatisticsModal(user_id) {
	$.ajax({
		type: "GET",
		url: `${mysite}/courses/student_statistics/`,
		data: {
			userID: user_id,
		},
		beforeSend: function () {
			document.querySelector("#studentStatisticsModal").style.display = "block";
			document.querySelector("#studentStatisticsButtonModal").style.display = "none";
			document.querySelector("#loadStudentStatisticsModal").classList.add("loader");
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);
			document.querySelector("#loadStudentStatisticsModal").classList.remove("loader");

			document.querySelector("#showStudentStatisticsButtonModal").style.visibility = "visible";

			$("#studentAttendanceStatsBodyModal").append(`<tr> \
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

function showStudentStatisticsModal() {
	if (document.querySelector("#studentStatisticsModal").style.display === "none") {
		document.querySelector("#studentStatisticsModal").style.display = "block";
		document.querySelector("#showStudentStatisticsButtonModal").innerHTML = "Cerrar";
	} else {
		document.querySelector("#studentStatisticsModal").style.display = "none";
		document.querySelector("#showStudentStatisticsButtonModal").innerHTML = "Abrir";
	}
}
