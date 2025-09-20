// includes.js fires event: "sidebar component:loaded" after sidebar component is loaded to DOM
// and that event is used to launch/run this script.

// 1. Sidebar opening and closing functionality.
document.addEventListener("sidebar component:loaded", () => {
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

// 2. Sidebar dropdown functionality
document.addEventListener("sidebar component:loaded", () => {
  const listItems = document.querySelectorAll(".sidebar-main-item"); // gets sibebars first level list items

  // listens click events to each list items dropdown button and toggles class open for sub list
  listItems.forEach((item) => {
    const toggle = item.querySelector(".dropdown-toggle"); // gets dropdown button
    const sublist = item.querySelector(".sidebar-sub-list"); // gets sub list

        if (!toggle || !sublist) return; // if no toggle button or sub list, skip to next item

    toggle.addEventListener("click", () => { 
      toggle.classList.toggle("open"); 
      sublist.classList.toggle("open"); 
    });
  });
});

// 3. opens the correct sidebar dropdown based on current page
document.addEventListener("sidebar component:loaded", () => {
  const currentPath = window.location.pathname; // gets current path
  const menuItems = document.querySelectorAll(".sidebar-menu a"); // gets all sidebar menu links

  // loops through all menu links and checks if any matches current path
  menuItems.forEach((link) => { 
    if (link.getAttribute("href") === currentPath) { 
      const parentItem = link.closest(".sidebar-main-item"); 
      if (!parentItem) return;

      const sublist = parentItem.querySelector(".sidebar-sub-list"); 
      const toggle  = parentItem.querySelector(".dropdown-toggle");

      // if match found, adds class open to sub list and toggle button to open the dropdown
      if (sublist) sublist.classList.add("open");
      if (toggle)  toggle.classList.add("open");
    }
  });
});
