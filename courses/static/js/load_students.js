//  START LOAD STUDENTS JS

// Start with first student
let student_counter = 0;

// Load 30 students at a time
const student_quantity = 30;

// All students loaded
let all_students = false;

// When DOM loads, render the first 30 students
document.addEventListener("DOMContentLoaded", load_students);

// Function that creates INIFINE SCROLLING for students

$(window).scroll(function () {
	if (
		$(window).scrollTop() + $(window).height() == $(document).height() &&
		all_students === false
	) {
		load_students();
	}
});

// Load next set of students
function load_students() {
	// Set start and end students numbers, and update counter
	const start = student_counter;
	const end = student_counter + student_quantity;
	student_counter = end + 1;

	// Fetch new students and add them
	$.ajax({
		type: "GET",
		url: `https://www.aquariumschool.co/courses/load_students/`,
		data: {
			start: start,
			end: end,
		},
		beforeSend: function () {
			document.querySelector("#loadStudents").classList.add("loader");
		},
		error: function (error) {
			console.log("Error!", error);
		},
		success: function (response) {
			// console.log(response);
			document.querySelector("#loadStudents").classList.remove("loader");

			if (response["all_loaded"] === true) {
				all_students = true;
			}

			for (
				var studentID = 0;
				studentID < response["students"].length;
				studentID++
			) {
				$("#students_table").append(`<tr> \
                                                <td scope="row" data-label="Documento"> \
                                                    <a href="https://www.aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["identity_document"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Nombres">\
                                                    <a href="https://www.aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["first_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Apellidos">\
                                                    <a href="https://www.aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["last_name"]}</a>\
                                                </td>\
                                                <td scope="row" data-label="Tel/Cel (1)">\
                                                    <a href="https://www.aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["phone_1"]}</a>\
                                                </td>\
                                                <td style="border-bottom: 2px solid steelblue;" scope="row" data-label="Tel/Cel (2)">\
                                                    <a href="https://www.aquariumschool.co/courses/student/${response["students"][studentID]["id"]}">${response["students"][studentID]["phone_2"]}</a>\
                                                </td>\
                                            </tr>`);
			}
		},
	});
}

//  END LOAD STUDENTS JS