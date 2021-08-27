$(function () {
	/* SCRIPT TO OPEN THE MODAL WITH THE PREVIEW */
	$("#id_file").change(function () {
		if (this.files && this.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$("#image").attr("src", e.target.result);
				$("#modalCrop").modal("show");
			};
			reader.readAsDataURL(this.files[0]);
		}
	});

	/* SCRIPTS TO HANDLE THE CROPPER BOX */
	var $image = $("#image");
	var cropBoxData;
	var canvasData;
	$("#modalCrop")
		.on("shown.bs.modal", function () {
			$image.cropper({
				viewMode: 1,
				aspectRatio: 1 / 1,
				maxCropBoxWidth: 500,
				maxCropBoxHeight: 500,
				ready: function () {
					$image.cropper("setCanvasData", canvasData);
					$image.cropper("setCropBoxData", cropBoxData);
				},
			});
		})
		.on("hidden.bs.modal", function () {
			cropBoxData = $image.cropper("getCropBoxData");
			canvasData = $image.cropper("getCanvasData");
			$image.cropper("destroy");
		});

	$(".js-zoom-in").click(function () {
		$image.cropper("zoom", 0.1);
	});

	$(".js-zoom-out").click(function () {
		$image.cropper("zoom", -0.1);
	});

	/* SCRIPT TO COLLECT THE DATA AND POST TO THE SERVER */
	$(".js-crop-and-upload").click(function () {
		var cropData = $image.cropper("getData");
		$("#id_x").val(cropData["x"]);
		$("#id_y").val(cropData["y"]);
		$("#id_height").val(cropData["height"]);
		$("#id_width").val(cropData["width"]);
		$("#formUpload").submit();
	});
});
