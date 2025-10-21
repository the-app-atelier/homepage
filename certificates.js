// Certificate display script with PDF viewer functionality and auto-rotation
const certImages = [
  "assets/certificates/GoogleUX_C1.png",
  "assets/certificates/GoogleUX_C2.png",
  "assets/certificates/GoogleUX_C3.png",
];
let currentCertIndex = 0;
const activeCert = document.getElementById("active-cert");
let autoRotateInterval;
let userInteracted = false;
const AUTO_ROTATE_DELAY = 3000; // 3 seconds
const INTERACTION_TIMEOUT = 10000; // Resume auto-rotation after 10 seconds of inactivity

// Add fade transition to the image
activeCert.style.transition = "opacity 0.4s ease-in-out";

function updateCert(index, skipAnimation = false) {
  // Prevent animation on the first load or when skipAnimation is true
  if (skipAnimation) {
    showCert(index);
    return;
  }

  // Fade out
  activeCert.style.opacity = 0;
  
  // Wait for fade out to complete before changing the image
  setTimeout(() => {
    showCert(index);
    
    // Fade in
    activeCert.style.opacity = 1;
  }, 400);
}

function showCert(index) {
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

function startAutoRotate() {
  // Clear any existing interval to prevent multiples
  clearInterval(autoRotateInterval);
  
  // Set new interval for auto rotation
  autoRotateInterval = setInterval(() => {
    if (!userInteracted) {
      let newIndex = currentCertIndex + 1;
      if (newIndex >= certImages.length) newIndex = 0;
      updateCert(newIndex);
    }
  }, AUTO_ROTATE_DELAY);
}

function handleUserInteraction() {
  userInteracted = true;
  clearInterval(autoRotateInterval);
  
  // Resume auto-rotation after a period of inactivity
  clearTimeout(window.resumeTimeout);
  window.resumeTimeout = setTimeout(() => {
    userInteracted = false;
    startAutoRotate();
  }, INTERACTION_TIMEOUT);
}

// Initialize certificate with opacity 1 and start auto-rotation
activeCert.style.opacity = 1;
startAutoRotate();

// Add click listeners and mark them as user interactions
document.querySelector(".cert-arrow-left").addEventListener("click", function () {
  handleUserInteraction();
  let newIndex = currentCertIndex - 1;
  if (newIndex < 0) newIndex = certImages.length - 1;
  updateCert(newIndex);
});

document.querySelector(".cert-arrow-right").addEventListener("click", function () {
  handleUserInteraction();
  let newIndex = currentCertIndex + 1;
  if (newIndex >= certImages.length) newIndex = 0;
  updateCert(newIndex);
});

// Add click handlers for pagination dots
document.querySelectorAll(".cert-dot").forEach((dot) => {
  dot.addEventListener("click", function () {
    handleUserInteraction();
    updateCert(parseInt(this.dataset.index));
  });
});

// Add click handler to open PDF when certificate is clicked
document.querySelector(".cert-mat").addEventListener("click", function () {
  handleUserInteraction();
  
  // Get current image path and convert to PDF path
  const currentImagePath = activeCert.src;
  const pdfPath = currentImagePath.replace(".png", ".pdf");

  // Open PDF in new tab
  window.open(pdfPath, "_blank");
});

// Make sure pagination dots match the number of certificates
document.addEventListener('DOMContentLoaded', () => {
  const paginationContainer = document.querySelector('.cert-pagination');
  
  // Clear existing dots
  paginationContainer.innerHTML = '';
  
  // Create correct number of dots
  certImages.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'cert-dot' + (i === 0 ? ' cert-dot-active' : '');
    dot.dataset.index = i;
    dot.addEventListener('click', function() {
      handleUserInteraction();
      updateCert(parseInt(this.dataset.index));
    });
    paginationContainer.appendChild(dot);
  });
  
  // Ensure first certificate is shown correctly
  updateCert(0, true);
});