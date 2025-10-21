// Certificate display script with PDF viewer functionality, auto-rotation, and dynamic colors
const certImages = [
  "assets/certificates/GoogleUX_C1.png",
  "assets/certificates/GoogleUX_C2.png",
  "assets/certificates/GoogleUX_C3.png",
  "assets/certificates/Colorado_IIoT_S.png",
  "assets/certificates/DJ4E_S.png",
  "assets/certificates/Meta_MobileDev_C1.png",
  "assets/certificates/Meta_MobileDev_C2.png",
  "assets/certificates/py4e_C1.png",
  "assets/certificates/py4e_C2.png"
];
let currentCertIndex = 0;
const activeCert = document.getElementById("active-cert");
const certFrame = document.querySelector(".cert-frame");
let autoRotateInterval;
let userInteracted = false;
const AUTO_ROTATE_DELAY = 2500; // 3 seconds
const INTERACTION_TIMEOUT = 10000; // Resume auto-rotation after 10 seconds of inactivity

// Add transitions to both the image and the frame
activeCert.style.transition = "opacity 0.4s ease-in-out";
certFrame.style.transition = "border-color 0.8s ease, box-shadow 0.8s ease, background-color 0.8s ease";

// Color mapping for different certificate prefixes
const prefixColorMap = {
  "Googl": { 
    border: "#4285F4", 
    shadow: "#4285F4", 
    background: "#f8f9fa" 
  },
  "Color": { 
    border: "#8a3324", 
    shadow: "#8a3324", 
    background: "#f9f2e8" 
  },
  "DJ4E_": { 
    border: "#2e7d32", 
    shadow: "#2e7d32", 
    background: "#f1f8e9" 
  },
  "Meta_": { 
    border: "#1877f2", 
    shadow: "#1877f2", 
    background: "#f0f2f5" 
  },
  "py4e_": { 
    border: "#a59435ff", 
    shadow: "#3572A5", 
    background: "#f5faff" 
  },
  // Default color if no match is found
  "default": { 
    border: "#8a6d3b", 
    shadow: "#a58b57", 
    background: "#f8f5f0" 
  }
};

function getFilePrefix(filepath) {
  // Extract just the filename from the path
  const filename = filepath.split('/').pop();
  // Return first 5 characters of the filename
  return filename.substring(0, 5);
}

function updateFrameColor(prefix) {
  // Get color settings for this prefix or use default
  const colorSettings = prefixColorMap[prefix] || prefixColorMap["default"];
  
  // Update the frame styling
  certFrame.style.borderColor = colorSettings.border;
  certFrame.style.backgroundColor = colorSettings.background;
  certFrame.style.boxShadow = 
    `0 0 0 1px ${colorSettings.border}33, 
     0 0 0 15px ${colorSettings.shadow}66, 
     5px 5px 20px rgba(0, 0, 0, 0.2)`;
}

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
    
    // Get prefix from the new certificate and update frame color
    const prefix = getFilePrefix(certImages[index]);
    updateFrameColor(prefix);
    
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
  
  // Set initial frame color based on the first certificate
  const initialPrefix = getFilePrefix(certImages[0]);
  updateFrameColor(initialPrefix);
  
  // Ensure first certificate is shown correctly
  updateCert(0, true);
});