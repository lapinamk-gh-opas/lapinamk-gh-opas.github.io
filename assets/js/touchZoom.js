window.addEventListener("contextmenu", (e) => e.preventDefault(), false);

let images = [];

// Funktio, joka lisää zoom-toiminnon kaikille kuville
function initImageZoom(img) {
  img.setAttribute("draggable", "false");

  let pressTimer;
  let longPressed = false;

  const addZoom = () => {
    img.classList.add("zoomed");
  };

  const removeZoom = () => {
    clearTimeout(pressTimer);
    img.classList.remove("zoomed");
  };

  // Kosketuslaitteet
  img.addEventListener("touchstart", () => {
    longPressed = false;
    pressTimer = setTimeout(() => {
      addZoom();
      longPressed = true;
    }, 100);
  });

  img.addEventListener("touchend", () => {
    setTimeout(removeZoom, longPressed ? 80 : 0);
  });

  img.addEventListener("touchcancel", removeZoom);

  // Hiiri
  img.addEventListener("mousedown", addZoom);
  img.addEventListener("mouseup", removeZoom);
  img.addEventListener("mouseleave", removeZoom);
}

// Funktio, joka hakee uudet kuvat ja lisää niille toiminnon
function updateImages(selector) {
  const newImages = document.querySelectorAll(selector);
  newImages.forEach((img) => {
    if (!images.includes(img)) {
      images.push(img);
      initImageZoom(img);
    }
  });
}

document.addEventListener("subContent:loaded", () => {
  updateImages("img.wide-image:not(.no-zoom)");
});

document.addEventListener("accordion:loaded", () => {
  updateImages(".accordion figure img");
});

document.addEventListener("reusedAccordion:loaded", () => {
  updateImages(".accordion figure img");
});

function updateWideImages() {
  const allImages = document.querySelectorAll(".wide-image");
  const isClosed = sidebar.classList.contains("closed");

  allImages.forEach((image) => {
    image.classList.toggle("sidebar-closed", isClosed);
  });
}

document.addEventListener("sidebar:changed", updateWideImages);
document.addEventListener("accordion:loaded", updateWideImages);
