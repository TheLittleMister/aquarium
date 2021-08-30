const mysite = "http://127.0.0.1:8000";
// const mysite = "https://aquariumschool.co";

// START GOOGLE
window.dataLayer = window.dataLayer || [];

function gtag() {
	dataLayer.push(arguments);
}
gtag("js", new Date());

gtag("config", "G-XTNLXDS27T");
// END GOOGLE

// ---------THIS FUNCTION DELAYS OUR AJAX DABATASE QUERIES----------
function delay(fn, ms) {
	let timer = 0;
	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(fn.bind(this, ...args), ms || 0);
	};
}

// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(time) {
	const date = new Date(time),
		diff = (new Date().getTime() - date.getTime()) / 1000,
		day_diff = Math.floor(diff / 86400);
	const year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate();

	if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) return year.toString() + "-" + (month < 10 ? "0" + month.toString() : month.toString()) + "-" + (day < 10 ? "0" + day.toString() : day.toString());

	const r =
		(day_diff == 0 && ((diff < 60 && "justo ahora") || (diff < 120 && "Hace 1 minuto") || (diff < 3600 && "Hace " + Math.floor(diff / 60) + " minutos") || (diff < 7200 && "Hace 1 hora") || (diff < 86400 && "Hace " + Math.floor(diff / 3600) + " horas"))) ||
		(day_diff == 1 && "Ayer") ||
		(day_diff < 7 && "Hace " + day_diff + " días") ||
		(day_diff < 31 && "Hace " + Math.ceil(day_diff / 7) + " semanas");
	return r;
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

// THIS FUNCTION ACTIVATES TOOLTIPS
function activateToolTip() {
	$('[data-toggle="tooltip"]').tooltip();
}

if (typeof jQuery != "undefined") {
	jQuery.fn.prettyDate = function () {
		return this.each(function () {
			const date = prettyDate(this.title);
			if (date) jQuery(this).text(date);
		});
	};
}

///////////////////////////////////////////////////////////////////////////

const beforeFunc = function (buttonID = null, loaderID, ulElementID = null, tableBodyID = null) {
	buttonID && (document.getElementById(buttonID).style.display = "none");
	document.getElementById(loaderID).classList.add("loader");

	if (ulElementID) {
		const ulElement = document.getElementById(ulElementID);
		ulElement.classList.remove("alert");
		ulElement.classList.remove("alert-danger");
		ulElement.classList.remove("alert-success");
		ulElement.innerHTML = "";
	}

	if (tableBodyID) document.getElementById(tableBodyID).innerHTML = "";
};

const afterFunc = function (buttonID = null, loaderID, ulElementID = null, messages = null, success = false) {
	if (ulElementID) {
		const ulElement = document.getElementById(ulElementID);
		ulElement.classList.add("alert");

		if (messages.length > 0) {
			if (success) ulElement.classList.add("alert-success");
			else ulElement.classList.add("alert-danger");

			for (let messageID in messages) ulElement.insertAdjacentHTML("afterbegin", `<li class="ml-2">${messages[messageID]}</li>`);
		}
	}

	document.getElementById(loaderID).classList.remove("loader");
	buttonID && (document.getElementById(buttonID).style.display = "inline-block");
};

//
