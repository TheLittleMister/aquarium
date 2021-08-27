function closePastCourses(button, modal = false) {
	if (document.querySelector(`#pastCourses${modal ? "Modal" : ""}`).style.display === "block") {
		document.querySelector(`#pastCourses${modal ? "Modal" : ""}`).style.display = "none";
		button.innerHTML = "Abrir";
	} else {
		document.querySelector(`#pastCourses${modal ? "Modal" : ""}`).style.display = "block";
		button.innerHTML = "Cerrar";
	}
}

function closeFutureCourses(button, modal = false) {
	if (document.querySelector(`#futureCourses${modal ? "Modal" : ""}`).style.display === "block") {
		document.querySelector(`#futureCourses${modal ? "Modal" : ""}`).style.display = "none";
		button.innerHTML = "Abrir";
	} else {
		document.querySelector(`#futureCourses${modal ? "Modal" : ""}`).style.display = "block";
		button.innerHTML = "Cerrar";
	}
}
