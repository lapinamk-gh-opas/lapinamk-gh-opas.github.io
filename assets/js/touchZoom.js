// This script enables zoom-on-hold for images (mouse and touch).

let images = []; // array to track images that have zoom functionality initialized

// Initializes zoom functionality for a given image
const initImageZoom = (img) => {
  // Prevents default dragging and context menu on image
  img.setAttribute('draggable', 'false');
  img.addEventListener('contextmenu', (e) => e.preventDefault(), false);

  // Variables for touch zoom handling
  let pressTimer; // timer for long press detection
  let longPressed = false; // flag to track if long press zoom is active
  let noTouchZoom = false; // flag to prevent zoom if touch is moving

  // Function to add zoom effect
  // x and y are client coordinates of the touch event.
  // touch events gives these coordinates, so that on small screens zoomin happens where finger is touching.
  // on mouse events these coordinates are not provided, so zoom happens from center of image.
  const addZoom = (x, y) => {
    // For touch events, use the first touch point
    const rect = img.getBoundingClientRect();

    // Calculate offset percentages (for touch zoom)
    const offsetX = ((x - rect.left) / rect.width) * 100;
    const offsetY = ((y - rect.top) / rect.height) * 100;

    // set offset so that zooming happens from touch point
    img.style.transformOrigin = `${offsetX}% ${offsetY}%`;

    // Apply zoom class, zoom amount is handled in CSS
    if (!img.classList.contains('zoomed')) {
      img.classList.add('zoomed');
    }
  };

  // Function to remove zoom effect
  const removeZoom = () => {
    clearTimeout(pressTimer);
    clearTimeout(dragBlockTimer);

    longPressed = false;
    noTouchZoom = false;

    img.classList.remove('zoomed');
    img.style.transformOrigin = 'center center';
  };

  // Prevents unwanted zoom if finger is moved during touch
  let dragBlockTimer;

  window.addEventListener('touchmove', () => {
    noTouchZoom = true;
    clearTimeout(dragBlockTimer);
    dragBlockTimer = setTimeout(() => {
      noTouchZoom = false;
    }, 150);
  });

  let isDragging = false;
  // Touch event listeners for touch zoom functionality
  img.addEventListener(
    'touchstart',
    (e) => {
      longPressed = false;
      noTouchZoom = false;

      const touch = e.touches[0];

      clearTimeout(pressTimer);
      pressTimer = setTimeout(() => {
        if (!noTouchZoom) {
          e.preventDefault();
          longPressed = true;
          addZoom(touch.clientX, touch.clientY);
        }
      }, 150);
    },
    { passive: false }
  );

  img.addEventListener(
    'touchmove',
    (e) => {
      if (!longPressed) return;

      e.preventDefault();
      const touch = e.touches[0];
      addZoom(touch.clientX, touch.clientY);
    },
    { passive: false }
  );

  // remove zoom on touch end with removeZoom function
  img.addEventListener('touchend', () => {
    removeZoom();
  });

  // remove zoom on touch cancel with removeZoom function
  img.addEventListener('touchcancel', () => {
    removeZoom();
  });

  // add zoom on mouse down
  img.addEventListener('mousedown', (e) => {
    addZoom(e.clientX, e.clientY);
    isDragging = true;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    addZoom(e.clientX, e.clientY);
  });

  // remove zoom on mouse up
  window.addEventListener('mouseup', () => {
    isDragging = false;
    removeZoom();
  });

  // remove zoom on mouse leave
  window.addEventListener('mouseleave', () => {
    isDragging = false;
    removeZoom();
  });
};

// function for looking for images in the document and initializing zoom functionality for those images
function updateImages(selector) {
  const newImages = document.querySelectorAll(selector);
  newImages.forEach((img) => {
    if (!images.includes(img)) {
      images.push(img);
      initImageZoom(img);
    }
  });
}

// Go through images in document and initialize zoom when sub content is loaded
document.addEventListener('subContent:loaded', () => {
  updateImages('img.wide-image:not(.no-zoom)');
});

// Go through images in document and initialize zoom when accordions are loaded
document.addEventListener('accordion:loaded', () => {
  updateImages('.accordion figure img');
});

// Go through images in document and initialize zoom when reused accordions are loaded
document.addEventListener('reusedAccordion:loaded', () => {
  updateImages('.accordion figure img');
});
