// This AJAX function checks username availability
$("#id_username").keyup(
	delay(function () {
		$.ajax({
			type: "GET",
			url: `${mysite}/users/available/`,
			data: {
				username: $(this).val(),
				// csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
			},
			beforeSend: function () {
				if (document.querySelector("#error_1_id_username") !== null) {
					document.querySelector("#error_1_id_username").style.display = "none";
				}

				if (document.querySelector("#username_message") !== null) {
					document.querySelector("#username_message").innerHTML = "";
					document.querySelector("#username_message").classList.add("loader");
				} else {
					$("#div_id_username").append('<div class="loader" id="username_message" style="font-weight: bold; margin-left: auto; margin-right: auto;"></div>');
				}
			},
			error: function (error) {
				console.log("Error!", error);
			},

			success: function (response) {
				document.querySelector("#username_message").classList.remove("loader");

				if (response.username === "Taken") {
					// #div_id_username
					document.querySelector("#username_message").style.color = "#dc3545";
					document.querySelector("#username_message").innerHTML = "Usuario no disponible";
				} else if (response.username === "Not taken") {
					document.querySelector("#username_message").style.color = "green";
					document.querySelector("#username_message").innerHTML = "Usuario disponible";
				} else if (response.username === "Invalid") {
					document.querySelector("#username_message").style.color = "#dc3545";
					document.querySelector("#username_message").innerHTML = "Usuario inválido";
				} else if (response.username === null) {
					// null - username not provided
					document.querySelector("#username_message").style.color = "grey";
					document.querySelector("#username_message").innerHTML = "Proporcione el nombre de usuario";
				} // else - false - dont do anything
			},
		});
	}, 1000)
);

// ---------------THIS AJAX FUNCTION SEARCHES EMAIL AVAILABLE ----------------------
$("#id_email").keyup(
	delay(function () {
		$.ajax({
			type: "GET",
			url: `${mysite}/users/available/`,
			data: {
				email: $(this).val(),
				// csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
			},
			beforeSend: function () {
				if (document.querySelector("#error_1_id_email") !== null) {
					document.querySelector("#error_1_id_email").style.display = "none";
				}

				if (document.querySelector("#email_message") !== null) {
					document.querySelector("#email_message").innerHTML = "";
					document.querySelector("#email_message").classList.add("loader");
				} else {
					$("#div_id_email").append('<div class="loader" id="email_message" style="font-weight: bold; margin-left: auto; margin-right: auto;"></div>');
				}
			},
			error: function (error) {
				console.log("Error!", error);
			},

			success: function (response) {
				document.querySelector("#email_message").classList.remove("loader");

				if (response.email === "Taken") {
					// #div_id_email
					document.querySelector("#email_message").style.color = "#dc3545";
					document.querySelector("#email_message").innerHTML = "Correo no disponible";
				} else if (response.email === "Not taken") {
					document.querySelector("#email_message").style.color = "green";
					document.querySelector("#email_message").innerHTML = "Correo disponible";
				} else if (response.email === "Invalid") {
					document.querySelector("#email_message").style.color = "#dc3545";
					document.querySelector("#email_message").innerHTML = "Correo inválido";
				} else if (response.email == null) {
					// null - email not provided
					document.querySelector("#email_message").style.color = "grey";
					document.querySelector("#email_message").innerHTML = "Proporcione el correo eletrónico";
				}
			},
		});
	}, 1000)
);

// ---------------THIS AJAX FUNCTION SEARCHES NO.DOCUMENT AVAILABLE ----------------------
$("#id_identity_document").keyup(
	delay(function () {
		$.ajax({
			type: "GET",
			url: `${mysite}/users/available/`,
			data: {
				identity_document: $(this).val(),
				// csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
			},
			beforeSend: function () {
				if (document.querySelector("#error_1_id_identity_document") !== null) {
					document.querySelector("#error_1_id_identity_document").style.display = "none";
				}

				if (document.querySelector("#identity_document_message") !== null) {
					document.querySelector("#identity_document_message").innerHTML = "";
					document.querySelector("#identity_document_message").classList.add("loader");
				} else {
					$("#div_id_identity_document").append('<div class="loader" id="identity_document_message" style="font-weight: bold; margin-left: auto; margin-right: auto;"></div>');
				}
			},
			error: function (error) {
				console.log("Error!", error);
			},

			success: function (response) {
				document.querySelector("#identity_document_message").classList.remove("loader");

				if (response.identity_document === "Taken") {
					// #div_id_identity_document
					document.querySelector("#identity_document_message").style.color = "#dc3545";
					document.querySelector("#identity_document_message").innerHTML = "Documento no disponible";
				} else if (response.identity_document === "Not taken") {
					document.querySelector("#identity_document_message").style.color = "green";
					document.querySelector("#identity_document_message").innerHTML = "Documento disponible";
				} else if (response.identity_document === "Invalid") {
					document.querySelector("#identity_document_message").style.color = "#dc3545";
					document.querySelector("#identity_document_message").innerHTML = "Documento inválido";
				}
				// else if (response.identity_document == null) {
				// 	// null - identity_document not provided
				// 	document.querySelector("#identity_document_message").style.color =
				// 		"grey";
				// 	document.querySelector("#identity_document_message").innerHTML =
				// 		"Proporcione el Documento";
				// }
			},
		});
	}, 1000)
);
// ---------------THIS AJAX FUNCTION SEARCHES NO.DOCUMENT AVAILABLE ----------------------
$("#id_identity_document_1").keyup(
	delay(function () {
		$.ajax({
			type: "GET",
			url: `${mysite}/users/available/`,
			data: {
				identity_document: $(this).val(),
				// csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
			},
			beforeSend: function () {
				if (document.querySelector("#error_1_id_identity_document_1") !== null) {
					document.querySelector("#error_1_id_identity_document_1").style.display = "none";
				}

				if (document.querySelector("#identity_document_message") !== null) {
					document.querySelector("#identity_document_message").innerHTML = "";
					document.querySelector("#identity_document_message").classList.add("loader");
				} else {
					$("#div_id_identity_document_1").append('<div class="loader" id="identity_document_message" style="font-weight: bold; margin-left: auto; margin-right: auto;"></div>');
				}
			},
			error: function (error) {
				console.log("Error!", error);
			},

			success: function (response) {
				document.querySelector("#identity_document_message").classList.remove("loader");

				if (response.identity_document === "Taken") {
					// #div_id_identity_document_1
					document.querySelector("#identity_document_message").style.color = "#dc3545";
					document.querySelector("#identity_document_message").innerHTML = "Documento no disponible";
				} else if (response.identity_document === "Not taken") {
					document.querySelector("#identity_document_message").style.color = "green";
					document.querySelector("#identity_document_message").innerHTML = "Documento disponible";
				} else if (response.identity_document === "Invalid") {
					document.querySelector("#identity_document_message").style.color = "#dc3545";
					document.querySelector("#identity_document_message").innerHTML = "Documento inválido";
				}
				// else if (response.identity_document == null) {
				// 	// null - identity_document not provided
				// 	document.querySelector("#identity_document_message").style.color =
				// 		"grey";
				// 	document.querySelector("#identity_document_message").innerHTML =
				// 		"Proporcione el Documento";
				// }
			},
		});
	}, 1000)
);
