// This script enables zoom-on-hold for images (mouse and touch).

let images = []; // array to track images that have zoom functionality initialized

// Initializes zoom functionality for a given image
const initImageZoom = (img) => {
  // Prevents default dragging and context menu on image
  img.setAttribute('draggable', 'false');
  img.addEventListener('contextmenu', (e) => e.preventDefault(), false);

  // Function to prevent scrolling during touch zoom
  const preventScroll = (e) => e.preventDefault();

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
    img.classList.add('zoomed');
  };

  // Function to remove zoom effect
  const removeZoom = () => {
    // clears timer that determines if touch was long and intended for zoom functionality
    clearTimeout(pressTimer);

    img.classList.remove('zoomed'); // Remove zoom class
    longPressed = false; // reset long press flag that tracks if touch zoom was activated
    document.body.style.overflow = ''; // Re-enable scrolling
    window.removeEventListener('touchmove', preventScroll, { passive: false }); // Remove scroll prevention for touch
  };

  // Prevents unwanted zoom if finger is moved during touch
  window.addEventListener('touchmove', () => {
    noTouchZoom = true;
    pressTimer = setTimeout(() => {
      noTouchZoom = false;
    }, 500);
  });

  // Touch event listeners for touch zoom functionality
  img.addEventListener(
    'touchstart',
    (e) => {
      // reset timer and touch point
      longPressed = false;
      const touch = e.touches[0];

      // starts timer to determine if touch is long enough for zoom functionality
      pressTimer = setTimeout(() => {
        // finger has been held long enough, add zoom if touch hasn't moved
        if (!noTouchZoom) {
          addZoom(touch.clientX, touch.clientY); // zoom in at touch point with addZoom function
          longPressed = true; // set flag to indicate long press zoom is active
          window.addEventListener('touchmove', preventScroll, { passive: false }); // Prevent scrolling when zoomed
        }
      }, 200);
    },
    { passive: true } // passive true to allow scrolling unless prevented
  );

  img.addEventListener('touchend', removeZoom); // remove zoom on touch end with removeZoom function
  img.addEventListener('touchcancel', removeZoom); // remove zoom on touch cancel with removeZoom function

  img.addEventListener('mousedown', addZoom); // add zoom on mouse down (centered, because no coordinates provided)
  img.addEventListener('mouseup', removeZoom); // remove zoom on mouse up
  img.addEventListener('mouseleave', removeZoom); // remove zoom on mouse leave
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

//Zooming tweaks for wide images when sidebar is opened or closed
function updateWideImages() {
  const isClosed = sidebar.classList.contains('closed');

  images.forEach((image) => {
    image.classList.toggle('sidebar-closed', isClosed); // Toggles class to images if sidebar is closed or open
  });
}

document.addEventListener('sidebar:changed', updateWideImages); // Update images on sidebar change
document.addEventListener('accordion:loaded', updateWideImages); // Update images on accordion load so that wide images inside accordion get correct class on refresh
document.addEventListener('reusedAccordion:loaded', updateWideImages); // Update images on accordion load so that wide images inside reused accordion get correct class on refresh
