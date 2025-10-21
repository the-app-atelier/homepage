// Certificate display script with PDF viewer functionality
const certImages = [
  "assets/certificates/GoogleUX_C1.png",
  "assets/certificates/GoogleUX_C2.png",
];
let currentCertIndex = 0;
const activeCert = document.getElementById("active-cert");

function updateCert(index) {
  currentCertIndex = index;
  activeCert.src = certImages[index];

  // Update pagination dots
  document.querySelectorAll(".cert-dot").forEach((dot, i) => {
    if (i === index) {
      dot.classList.add("cert-dot-active");
    } else {
      dot.classList.remove("cert-dot-active");
    }
  });
}

document
  .querySelector(".cert-arrow-left")
  .addEventListener("click", function () {
    let newIndex = currentCertIndex - 1;
    if (newIndex < 0) newIndex = certImages.length - 1;
    updateCert(newIndex);
  });

document
  .querySelector(".cert-arrow-right")
  .addEventListener("click", function () {
    let newIndex = currentCertIndex + 1;
    if (newIndex >= certImages.length) newIndex = 0;
    updateCert(newIndex);
  });

// Add click handlers for pagination dots
document.querySelectorAll(".cert-dot").forEach((dot) => {
  dot.addEventListener("click", function () {
    updateCert(parseInt(this.dataset.index));
  });
});

// Add click handler to open PDF when certificate is clicked
document.querySelector(".cert-mat").addEventListener("click", function () {
  // Get current image path and convert to PDF path
  const currentImagePath = activeCert.src;
  const pdfPath = currentImagePath.replace(".png", ".pdf");

  // Open PDF in new tab
  window.open(pdfPath, "_blank");
});
