let cropper;

// Handle file input change
document.getElementById("imageInput").addEventListener("change", function (event) {
  const file = event.target.files[0];
  const cropImage = document.getElementById("cropImage");
  const imageContainer = document.getElementById("imageContainer");
  const cropIcon = document.getElementById("cropIcon");
  const extractBtn = document.getElementById("extractBtn");

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      cropImage.src = e.target.result;
      imageContainer.style.display = "block";
      cropIcon.style.display = "inline-block"; // Show the crop button

      // Disable the extract button until the crop action is complete
      extractBtn.disabled = true;
    };

    reader.readAsDataURL(file);
  } else {
    imageContainer.style.display = "none";
    cropIcon.style.display = "none";
    extractBtn.disabled = true;
  }
});

// Handle crop action
document.getElementById("cropIcon").addEventListener("click", function () {
  const cropImage = document.getElementById("cropImage");
  const extractBtn = document.getElementById("extractBtn");
  const cropIcon = document.getElementById("cropIcon");

  if (cropper) {
    cropper.destroy(); // Destroy any existing instance
  }

  cropper = new Cropper(cropImage, {
    aspectRatio: 0,
    viewMode: 1,
    autoCropArea: 1,
  });

  // Hide the crop button after it's clicked
  cropIcon.style.display = "none";

  extractBtn.disabled = false; // Enable the extract button
});

// Handle text extraction
document.getElementById("extractBtn").addEventListener("click", function () {
  if (!cropper) return;

  const croppedCanvas = cropper.getCroppedCanvas();

  if (!croppedCanvas) {
    alert("Please crop the image before extracting text.");
    return;
  }

  croppedCanvas.toBlob((blob) => {
    const formData = new FormData();
    formData.append("image", blob, "cropped-image.png");

    // Send the cropped image to the server
    fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.imageUrl && data.extractedText) {
          document.getElementById("preview").innerHTML = `
            <img src="${data.imageUrl}" alt="Uploaded Image">
            <p>Extracted Text: ${data.extractedText}</p>
          `;
        } else {
          alert("Failed to upload and extract text.");
        }
      })
      .catch((error) => {
        console.error("Error extracting text:", error);
        alert("An error occurred during text extraction.");
      });
  }, "image/png");
});
