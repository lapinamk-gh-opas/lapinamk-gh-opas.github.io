let currentPage = getPageFromHash();
let basePath = getBasePath();
let currentPath = window.location.pathname;
let pageNames = [];
let linkNames = [];
let pageIndex = 0;
let linkIndex = 0;

document.addEventListener("sidebar:loaded", () => {
  currentPath = window.location.pathname;
  const menuItems = document.querySelectorAll(".sidebar-menu a");

  linkNames = Array.from(menuItems).map((el) => el.getAttribute("href"));

  linkIndex = linkNames.indexOf(currentPath);
  document.dispatchEvent(new Event("links:loaded"));
});

document.addEventListener("links:loaded", () => {
  currentPage = getPageFromHash();
  const container = document.getElementById("mainContainer");
  const subContentPages = container.querySelectorAll("[data-page]");

  pageNames = Array.from(subContentPages).map((el) =>
    el.getAttribute("data-page")
  );

  pageIndex = currentPage ? pageNames.indexOf(currentPage) : 0;
  document.dispatchEvent(new Event("pages:loaded"));
});

document.addEventListener("pages:loaded", () => {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (pageIndex === 0 && linkIndex === 0) {
    prevBtn.classList.add("hide");
  }

  if (
    (pageIndex === pageNames.length - 1 || pageIndex === 0) &&
    linkIndex === linkNames.length - 1
  ) {
    nextBtn.classList.add("hide");
  }

  if (prevBtn) {
    prevBtn.onclick = () => {
      if (pageIndex > 0) {
        pageIndex = pageIndex - 1;
        loadPage(pageNames[pageIndex], basePath);
      } else if (pageIndex === 0) {
        window.location.href = linkNames[linkIndex - 1];
      }
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      if (pageIndex < pageNames.length - 1) {
        pageIndex = pageIndex + 1;
        loadPage(pageNames[pageIndex], basePath);
      } else if (pageIndex === pageNames.length - 1 || pageIndex === 0) {
        window.location.href = linkNames[linkIndex + 1];
      }
    };
  }
});
