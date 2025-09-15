// includes.js fires event: "sidebar component:loaded" after sidebar component is loaded to DOM
// and that event is used to launch/run this script.

document.addEventListener("sidebar component:loaded", () => {
  // 1. Sidebar opening and closing functionality.
  const sidebar = document.getElementById("sidebar"); // get sidebat element
  const toggleBtn = document.getElementById("toggleBtn"); // get toggle button element
  const mainContainer = document.getElementById("mainContainer"); // get main container element

  // listen click event to toggle button and toggle classes to open/close for selected elements
  if (sidebar && toggleBtn && mainContainer) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("closed");
      toggleBtn.classList.toggle("closed");
      mainContainer.classList.toggle("shifted");
    });
  }
});

document.addEventListener("sidebar component:loaded", () => {
  // 2. Sidebar dropdown functionality
  const listItems = document.querySelectorAll(".sidebar-main-item"); // gets sibebars first level list items

  // listens click events to each list items dropdown button and toggles class open for sub list
  listItems.forEach((item) => {
    const toggle = item.querySelector(".dropdown-toggle"); //gets dropdown button
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("open"); // add open class for button
      item.querySelector(".sidebar-sub-list").classList.toggle("open"); // add open class for sub list
    });
  });
});
document.addEventListener("sidebar component:loaded", () => {
  // 3. opens the correct sidebar dropdown based on current page
  const currentPath = window.location.pathname; // gets current path
  const menuItems = document.querySelectorAll(".sidebar-menu a"); // gets all sidebar links

  // loops through links and if links href matches current path, opens the parent dropdown
  menuItems.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      const parentSubList = link.closest(".sidebar-main-item"); // gets parent list item
      if (parentSubList) {
        parentSubList.querySelector(".sidebar-sub-list").classList.add("open"); // adds open class for sidebar-sub-list
        parentSubList.querySelector(".dropdown-toggle").classList.add("open"); // adds open class for dropdown button
      }
    }
  });
});
