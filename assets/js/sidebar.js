// Sidebar opening and closing functionality
document.querySelectorAll("[data-include]").forEach(async (el) => {
  const path = el.getAttribute("data-include");
  const res = await fetch(path);
  el.outerHTML = await res.text();

  if (path.includes("sidebar/sidebar.html")) {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleBtn");
    const mainContainer = document.getElementById("mainContainer");

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("closed");
        toggleBtn.classList.toggle("closed");
        mainContainer.classList.toggle("shifted");
      });
    }
  }
});

// Sidebar dropdown functionality
document.querySelectorAll("[data-include]").forEach(async (el) => {
  const path = el.getAttribute("data-include");
  const res = await fetch(path);
  el.innerHTML = await res.text();

  if (path.includes("sidebar/sidebar.html")) {
    const listItems = document.querySelectorAll("#sidebar-main-item");
    listItems.forEach((item) => {
      const toggle = item.querySelector(".dropdown-toggle");
      toggle.addEventListener("click", () => {
        toggle.classList.toggle("open");
        item.querySelector(".sidebar-sub-list").classList.toggle("open");
      });
    });
  }
});

// opens the correct sidebar dropdown based on current page
document.querySelectorAll("[data-include]").forEach(async (el) => {
  const path = el.getAttribute("data-include");
  const res = await fetch(path);
  el.innerHTML = await res.text();

  if (path.includes("sidebar/sidebar.html")) {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll(".sidebar-menu a");

    menuItems.forEach((link) => {
      if (link.getAttribute("href") === currentPath) {
        const parentSubList = link.closest("#sidebar-main-item");
        if (parentSubList) {
          parentSubList
            .querySelector(".sidebar-sub-list")
            .classList.toggle("open");
          parentSubList
            .querySelector(".dropdown-toggle")
            .classList.toggle("open");
        }
      }
    });
  }
});
