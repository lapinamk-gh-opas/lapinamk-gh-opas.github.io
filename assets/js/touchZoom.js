let images = [];

const initImageZoom = img => {
  img.setAttribute('draggable', 'false');
  img.addEventListener('contextmenu', e => e.preventDefault(), false);

  let pressTimer;
  let longPressed = false;
  let noTouchZoom = false;

  const addZoom = (x, y) => {
    // Laske suhteellinen napsautuskohta kuvan sisällä
    const rect = img.getBoundingClientRect();
    const offsetX = ((x - rect.left) / rect.width) * 100;
    const offsetY = ((y - rect.top) / rect.height) * 100;

    // Aseta transform-origin siihen kohtaan
    img.style.transformOrigin = `${offsetX}% ${offsetY}%`;

    img.classList.add('zoomed');
  };

  const removeZoom = () => {
    clearTimeout(pressTimer);
    img.classList.remove('zoomed');
    longPressed = false;
    document.body.style.overflow = '';
    window.removeEventListener('touchmove', preventScroll, { passive: false });
  };

  const preventScroll = e => e.preventDefault();

  window.addEventListener('touchmove', () => {
    noTouchZoom = true;
    pressTimer = setTimeout(() => {
      noTouchZoom = false;
    }, 500);
  });

  img.addEventListener('touchstart', e => {
    longPressed = false;
    const touch = e.touches[0];
    pressTimer = setTimeout(() => {
      if (!noTouchZoom) {
        addZoom(touch.clientX, touch.clientY);
        longPressed = true;
        window.addEventListener('touchmove', preventScroll, { passive: false });
      }
    }, 200);
  });

  img.addEventListener('touchend', removeZoom);
  img.addEventListener('touchcancel', removeZoom);

  img.addEventListener('mousedown', addZoom);
  img.addEventListener('mouseup', removeZoom);
  img.addEventListener('mouseleave', removeZoom);
};

function updateImages(selector) {
  const newImages = document.querySelectorAll(selector);
  newImages.forEach(img => {
    if (!images.includes(img)) {
      images.push(img);
      initImageZoom(img);
    }
  });
}

document.addEventListener('subContent:loaded', () => {
  updateImages('img.wide-image:not(.no-zoom)');
});

document.addEventListener('accordion:loaded', () => {
  updateImages('.accordion figure img');
});

document.addEventListener('reusedAccordion:loaded', () => {
  updateImages('.accordion figure img');
});

function updateWideImages() {
  const allImages = document.querySelectorAll('.wide-image');
  const isClosed = sidebar.classList.contains('closed');

  allImages.forEach(image => {
    image.classList.toggle('sidebar-closed', isClosed);
  });
}

document.addEventListener('sidebar:changed', updateWideImages);
document.addEventListener('accordion:loaded', updateWideImages);
