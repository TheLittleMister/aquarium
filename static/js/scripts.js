/* Template: Aria - Business HTML Landing Page Template
   Author: Inovatik
   Created: Jul 2019
   Description: Custom JS file
*/

(function ($) {
	"use strict";

	/* Preloader */
	$(window).on("load", function () {
		var preloaderFadeOutTime = 500;
		function hidePreloader() {
			var preloader = $(".spinner-wrapper");
			setTimeout(function () {
				preloader.fadeOut(preloaderFadeOutTime);
			}, 500);
		}
		hidePreloader();
	});

	/* Navbar Scripts */
	// jQuery to collapse the navbar on scroll
	$(window).on("scroll load", function () {
		if ($(".navbar").offset().top > 20) {
			$(".fixed-top").addClass("top-nav-collapse");
		} else {
			$(".fixed-top").removeClass("top-nav-collapse");
		}
	});

	// jQuery for page scrolling feature - requires jQuery Easing plugin
	$(function () {
		$(document).on("click", "a.page-scroll", function (event) {
			var $anchor = $(this);
			$("html, body")
				.stop()
				.animate(
					{
						scrollTop: $($anchor.attr("href")).offset().top,
					},
					600,
					"easeInOutExpo"
				);
			event.preventDefault();
		});
	});

	// closes the responsive menu on menu item click
	$(".navbar-nav li a").on("click", function (event) {
		if (!$(this).parent().hasClass("dropdown"))
			$(".navbar-collapse").collapse("hide");
	});

	/* Rotating Text - Morphtext */
	$("#js-rotating").Morphext({
		// The [in] animation type. Refer to Animate.css for a list of available animations.
		animation: "fadeIn",
		// An array of phrases to rotate are created based on this separator. Change it if you wish to separate the phrases differently (e.g. So Simple | Very Doge | Much Wow | Such Cool).
		separator: ",",
		// The delay between the changing of each phrase in milliseconds.
		speed: 2000,
		complete: function () {
			// Called after the entrance animation is executed.
		},
	});

	/* Card Slider - Swiper */
	var cardSlider = new Swiper(".card-slider", {
		autoplay: {
			delay: 4000,
			disableOnInteraction: false,
		},
		loop: true,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		slidesPerView: 3,
		spaceBetween: 20,
		breakpoints: {
			// when window is <= 992px
			992: {
				slidesPerView: 2,
			},
			// when window is <= 768px
			768: {
				slidesPerView: 1,
			},
		},
	});

	/* Lightbox - Magnific Popup */
	$(".popup-with-move-anim").magnificPopup({
		type: "inline",
		fixedContentPos: false /* keep it false to avoid html tag shift with margin-right: 17px */,
		fixedBgPos: true,
		overflowY: "auto",
		closeBtnInside: true,
		preloader: false,
		midClick: true,
		removalDelay: 300,
		mainClass: "my-mfp-slide-bottom",
	});

	/* Filter - Isotope */
	var $grid = $(".grid").isotope({
		// options
		itemSelector: ".element-item",
		layoutMode: "fitRows",
	});

	// filter items on button click
	$(".filters-button-group").on("click", "a", function () {
		var filterValue = $(this).attr("data-filter");
		$grid.isotope({ filter: filterValue });
	});

	// change is-checked class on buttons
	$(".button-group").each(function (i, buttonGroup) {
		var $buttonGroup = $(buttonGroup);
		$buttonGroup.on("click", "a", function () {
			$buttonGroup.find(".is-checked").removeClass("is-checked");
			$(this).addClass("is-checked");
		});
	});

	/* Counter - CountTo */
	var a = 0;
	$(window).scroll(function () {
		if ($("#counter").length) {
			// checking if CountTo section exists in the page, if not it will not run the script and avoid errors
			var oTop = $("#counter").offset().top - window.innerHeight;
			if (a == 0 && $(window).scrollTop() > oTop) {
				$(".counter-value").each(function () {
					var $this = $(this),
						countTo = $this.attr("data-count");
					$({
						countNum: $this.text(),
					}).animate(
						{
							countNum: countTo,
						},
						{
							duration: 2000,
							easing: "swing",
							step: function () {
								$this.text(Math.floor(this.countNum));
							},
							complete: function () {
								$this.text(this.countNum);
								//alert('finished');
							},
						}
					);
				});
				a = 1;
			}
		}
	});

	/* Move Form Fields Label When User Types */
	// for input and textarea fields
	$("input, textarea").keyup(function () {
		if ($(this).val() != "") {
			$(this).addClass("notEmpty");
		} else {
			$(this).removeClass("notEmpty");
		}
	});

	/* Call Me Form */
	$("#callMeForm")
		.validator()
		.on("submit", function (event) {
			if (event.isDefaultPrevented()) {
				// handle the invalid form...
				lformError();
				lsubmitMSG(false, "Please fill all fields!");
			} else {
				// everything looks good!
				event.preventDefault();
				lsubmitForm();
			}
		});

	function lsubmitForm() {
		// initiate variables with form content
		var name = $("#lname").val();
		var phone = $("#lphone").val();
		var email = $("#lemail").val();
		var select = $("#lselect").val();
		var terms = $("#lterms").val();

		$.ajax({
			type: "POST",
			url: "php/callmeform-process.php",
			data:
				"name=" +
				name +
				"&phone=" +
				phone +
				"&email=" +
				email +
				"&select=" +
				select +
				"&terms=" +
				terms,
			success: function (text) {
				if (text == "success") {
					lformSuccess();
				} else {
					lformError();
					lsubmitMSG(false, text);
				}
			},
		});
	}

	function lformSuccess() {
		$("#callMeForm")[0].reset();
		lsubmitMSG(true, "Request Submitted!");
		$("input").removeClass("notEmpty"); // resets the field label after submission
	}

	function lformError() {
		$("#callMeForm")
			.removeClass()
			.addClass("shake animated")
			.one(
				"webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
				function () {
					$(this).removeClass();
				}
			);
	}

	function lsubmitMSG(valid, msg) {
		if (valid) {
			var msgClasses = "h3 text-center tada animated";
		} else {
			var msgClasses = "h3 text-center";
		}
		$("#lmsgSubmit").removeClass().addClass(msgClasses).text(msg);
	}

	/* Contact Form */
	$("#contactForm")
		.validator()
		.on("submit", function (event) {
			if (event.isDefaultPrevented()) {
				// handle the invalid form...
				cformError();
				csubmitMSG(false, "Please fill all fields!");
			} else {
				// everything looks good!
				event.preventDefault();
				csubmitForm();
			}
		});

	function csubmitForm() {
		// initiate variables with form content
		var name = $("#cname").val();
		var email = $("#cemail").val();
		var message = $("#cmessage").val();
		var terms = $("#cterms").val();
		$.ajax({
			type: "POST",
			url: "php/contactform-process.php",
			data:
				"name=" +
				name +
				"&email=" +
				email +
				"&message=" +
				message +
				"&terms=" +
				terms,
			success: function (text) {
				if (text == "success") {
					cformSuccess();
				} else {
					cformError();
					csubmitMSG(false, text);
				}
			},
		});
	}

	function cformSuccess() {
		$("#contactForm")[0].reset();
		csubmitMSG(true, "Message Submitted!");
		$("input").removeClass("notEmpty"); // resets the field label after submission
		$("textarea").removeClass("notEmpty"); // resets the field label after submission
	}

	function cformError() {
		$("#contactForm")
			.removeClass()
			.addClass("shake animated")
			.one(
				"webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
				function () {
					$(this).removeClass();
				}
			);
	}

	function csubmitMSG(valid, msg) {
		if (valid) {
			var msgClasses = "h3 text-center tada animated";
		} else {
			var msgClasses = "h3 text-center";
		}
		$("#cmsgSubmit").removeClass().addClass(msgClasses).text(msg);
	}

	/* Privacy Form */
	$("#privacyForm")
		.validator()
		.on("submit", function (event) {
			if (event.isDefaultPrevented()) {
				// handle the invalid form...
				pformError();
				psubmitMSG(false, "Please fill all fields!");
			} else {
				// everything looks good!
				event.preventDefault();
				psubmitForm();
			}
		});

	function psubmitForm() {
		// initiate variables with form content
		var name = $("#pname").val();
		var email = $("#pemail").val();
		var select = $("#pselect").val();
		var terms = $("#pterms").val();

		$.ajax({
			type: "POST",
			url: "php/privacyform-process.php",
			data:
				"name=" +
				name +
				"&email=" +
				email +
				"&select=" +
				select +
				"&terms=" +
				terms,
			success: function (text) {
				if (text == "success") {
					pformSuccess();
				} else {
					pformError();
					psubmitMSG(false, text);
				}
			},
		});
	}

	function pformSuccess() {
		$("#privacyForm")[0].reset();
		psubmitMSG(true, "Request Submitted!");
		$("input").removeClass("notEmpty"); // resets the field label after submission
	}

	function pformError() {
		$("#privacyForm")
			.removeClass()
			.addClass("shake animated")
			.one(
				"webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
				function () {
					$(this).removeClass();
				}
			);
	}

	function psubmitMSG(valid, msg) {
		if (valid) {
			var msgClasses = "h3 text-center tada animated";
		} else {
			var msgClasses = "h3 text-center";
		}
		$("#pmsgSubmit").removeClass().addClass(msgClasses).text(msg);
	}

	/* Back To Top Button */
	// create the back to top button
	$("body").prepend(
		'<a href="body" class="back-to-top page-scroll">Back to Top</a>'
	);
	var amountScrolled = 700;
	$(window).scroll(function () {
		if ($(window).scrollTop() > amountScrolled) {
			$("a.back-to-top").fadeIn("500");
		} else {
			$("a.back-to-top").fadeOut("500");
		}
	});

	/* Removes Long Focus On Buttons */
	$(".button, a, button").mouseup(function () {
		$(this).blur();
	});
})(jQuery);

//  MY FUNCTIONS

// ---------THIS FUNCTION DELAYS OUR AJAX DABATASE QUERIES----------
function delay(fn, ms) {
	let timer = 0;
	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(fn.bind(this, ...args), ms || 0);
	};
}

// This AJAX function logs in the user
$(document).ready(function () {
	$("#loginForm").submit(function (e) {
		e.preventDefault();
		var form = $(this);

		$.ajax({
			type: "POST",
			url: "https://aquariumschool.co/users/login/",
			data: form.serialize(),
			beforeSend: function () {
				document.querySelector("#loginMessage").innerHTML = "";
			},
			error: function (error) {
				console.error(error);
			},
			success: function (response) {
				if (response["user"] !== null) {
					location.reload();
				} else {
					document.querySelector("#loginMessage").innerHTML =
						"Por favor, introduzca un Usuario y clave correctos. Observe que ambos campos pueden ser sensibles a mayúsculas.";
				}
			},
		});
	});
});

// $(document).ready(function () {
// 	grecaptcha.ready(function () {
// 		$("#loginForm").submit(function (e) {
// 			var form = $(this);
// 			e.preventDefault();
// 			grecaptcha
// 				.execute("6LfvUi4aAAAAAAsmt0oluwusZwigl1lTG87hk9BC", {
// 					action: "{% url 'users:login' %}",
// 				})
// 				.then(function (token) {
// 					$("#recaptcha").val(token);
// 				});

// 			$.ajax({
// 				type: "POST",
// 				url: "https://aquariumschool.co/users/login/",
// 				data: form.serialize(),
// 				beforeSend: function () {
// 					document.querySelector("#loginMessage").innerHTML = "";
// 				},
// 				error: function (error) {
// 					console.error(error);
// 				},
// 				success: function (response) {
// 					if (response["user"] !== null) {
// 						location.reload();
// 					} else {
// 						document.querySelector("#loginMessage").innerHTML =
// 							"Por favor, introduzca un Usuario y clave correctos. Observe que ambos campos pueden ser sensibles a mayúsculas.";
// 					}
// 				},
// 			});
// 		});
// 	});
// });

// This AJAX function checks username availability

$("#id_username").keyup(
	delay(function () {
		$.ajax({
			type: "GET",
			url: "https://aquariumschool.co/users/available/",
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
					$("#div_id_username").append(
						'<div class="loader" id="username_message" style="font-weight: bold; margin-left: auto; margin-right: auto;"></div>'
					);
				}
			},
			error: function (error) {
				console.log("Error!", error);
			},

			success: function (response) {
				document.querySelector("#username_message").classList.remove("loader");

				if (response["username"] === "Taken") {
					// #div_id_username
					document.querySelector("#username_message").style.color = "#dc3545";
					document.querySelector("#username_message").innerHTML =
						"Usuario no disponible";
				} else if (response["username"] === "Not taken") {
					document.querySelector("#username_message").style.color = "green";
					document.querySelector("#username_message").innerHTML =
						"Usuario disponible";
				} else if (response["username"] === "Invalid") {
					document.querySelector("#username_message").style.color = "#dc3545";
					document.querySelector("#username_message").innerHTML =
						"Usuario inválido";
				} else if (response["username"] === null) {
					// null - username not provided
					document.querySelector("#username_message").style.color = "grey";
					document.querySelector("#username_message").innerHTML =
						"Proporcione el nombre de usuario";
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
			url: "https://aquariumschool.co/users/available/",
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
					$("#div_id_email").append(
						'<div class="loader" id="email_message" style="font-weight: bold; margin-left: auto; margin-right: auto;"></div>'
					);
				}
			},
			error: function (error) {
				console.log("Error!", error);
			},

			success: function (response) {
				document.querySelector("#email_message").classList.remove("loader");

				if (response["email"] === "Taken") {
					// #div_id_email
					document.querySelector("#email_message").style.color = "#dc3545";
					document.querySelector("#email_message").innerHTML =
						"Correo no disponible";
				} else if (response["email"] === "Not taken") {
					document.querySelector("#email_message").style.color = "green";
					document.querySelector("#email_message").innerHTML =
						"Correo disponible";
				} else if (response["email"] === "Invalid") {
					document.querySelector("#email_message").style.color = "#dc3545";
					document.querySelector("#email_message").innerHTML =
						"Correo inválido";
				} else if (response["email"] == null) {
					// null - email not provided
					document.querySelector("#email_message").style.color = "grey";
					document.querySelector("#email_message").innerHTML =
						"Proporcione el correo eletrónico";
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
			url: "https://aquariumschool.co/users/available/",
			data: {
				identity_document: $(this).val(),
				// csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
			},
			beforeSend: function () {
				if (document.querySelector("#error_1_id_identity_document") !== null) {
					document.querySelector(
						"#error_1_id_identity_document"
					).style.display = "none";
				}

				if (document.querySelector("#identity_document_message") !== null) {
					document.querySelector("#identity_document_message").innerHTML = "";
					document
						.querySelector("#identity_document_message")
						.classList.add("loader");
				} else {
					$("#div_id_identity_document").append(
						'<div class="loader" id="identity_document_message" style="font-weight: bold; margin-left: auto; margin-right: auto;"></div>'
					);
				}
			},
			error: function (error) {
				console.log("Error!", error);
			},

			success: function (response) {
				document
					.querySelector("#identity_document_message")
					.classList.remove("loader");

				if (response["identity_document"] === "Taken") {
					// #div_id_identity_document
					document.querySelector("#identity_document_message").style.color =
						"#dc3545";
					document.querySelector("#identity_document_message").innerHTML =
						"Documento no disponible";
				} else if (response["identity_document"] === "Not taken") {
					document.querySelector("#identity_document_message").style.color =
						"green";
					document.querySelector("#identity_document_message").innerHTML =
						"Documento disponible";
				} else if (response["identity_document"] === "Invalid") {
					document.querySelector("#identity_document_message").style.color =
						"#dc3545";
					document.querySelector("#identity_document_message").innerHTML =
						"Documento inválido";
				}
				// else if (response["identity_document"] == null) {
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
			url: "https://aquariumschool.co/users/available/",
			data: {
				identity_document: $(this).val(),
				// csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
			},
			beforeSend: function () {
				if (
					document.querySelector("#error_1_id_identity_document_1") !== null
				) {
					document.querySelector(
						"#error_1_id_identity_document_1"
					).style.display = "none";
				}

				if (document.querySelector("#identity_document_message") !== null) {
					document.querySelector("#identity_document_message").innerHTML = "";
					document
						.querySelector("#identity_document_message")
						.classList.add("loader");
				} else {
					$("#div_id_identity_document_1").append(
						'<div class="loader" id="identity_document_message" style="font-weight: bold; margin-left: auto; margin-right: auto;"></div>'
					);
				}
			},
			error: function (error) {
				console.log("Error!", error);
			},

			success: function (response) {
				document
					.querySelector("#identity_document_message")
					.classList.remove("loader");

				if (response["identity_document"] === "Taken") {
					// #div_id_identity_document_1
					document.querySelector("#identity_document_message").style.color =
						"#dc3545";
					document.querySelector("#identity_document_message").innerHTML =
						"Documento no disponible";
				} else if (response["identity_document"] === "Not taken") {
					document.querySelector("#identity_document_message").style.color =
						"green";
					document.querySelector("#identity_document_message").innerHTML =
						"Documento disponible";
				} else if (response["identity_document"] === "Invalid") {
					document.querySelector("#identity_document_message").style.color =
						"#dc3545";
					document.querySelector("#identity_document_message").innerHTML =
						"Documento inválido";
				}
				// else if (response["identity_document"] == null) {
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
