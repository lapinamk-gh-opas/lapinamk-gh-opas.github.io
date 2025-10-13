// includes.js fires event: "sidebar component:loaded" after sidebar component is loaded to DOM
// and that event is used to launch/run this script.

// 1. Sidebar opening and closing functionality.
document.addEventListener("sidebar-component:loaded", () => {
  const sidebar = document.getElementById("sidebar"); // get sidebat element
  const toggleBtn = document.getElementById("toggleBtn"); // get toggle button element
  const mainContainer = document.getElementById("mainContainer"); // get main container element

  const sidebarState = sessionStorage.getItem("sidebar");

  if (sidebarState === "closed") {
    sidebar.classList.add("closed");
    toggleBtn.classList.add("closed");
    mainContainer.classList.add("shifted");
  } else {
    sidebar.classList.remove("closed");
    toggleBtn.classList.remove("closed");
    mainContainer.classList.remove("shifted");
  }

  // listen click event to toggle button and toggle classes to open/close for selected elements
  if (sidebar && toggleBtn && mainContainer) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("closed");
      toggleBtn.classList.toggle("closed");
      mainContainer.classList.toggle("shifted");

      const isClosed = sidebar.classList.contains("closed");
      sessionStorage.setItem("sidebar", isClosed ? "closed" : "open");
      document.dispatchEvent(new Event("sidebar:changed"));
    });
  }
});

// 2. Sidebar dropdown functionality
document.addEventListener("sidebar-component:loaded", () => {
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
document.addEventListener("sidebar-component:loaded", () => {
  const currentPath = window.location.pathname; // gets current path
  const menuItems = document.querySelectorAll(".sidebar-menu a"); // gets all sidebar menu links

  // loops through all menu links and checks if any matches current path
  menuItems.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      const parentItem = link.closest(".sidebar-main-item");
      if (!parentItem) return;

      const sublist = parentItem.querySelector(".sidebar-sub-list");
      const toggle = parentItem.querySelector(".dropdown-toggle");

      // if match found, adds class open to sub list and toggle button to open the dropdown
      if (sublist) sublist.classList.add("open");
      if (toggle) toggle.classList.add("open");
    }
  });
});

// 4. Sidebar saving a list functionality
// download table as .txt file
function downloadTableAsText(tableSelector, filename, title) {
  const table = document.querySelector(tableSelector);
  if (!table) return;
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  const lines = rows.map((tr) => {
    const cells = Array.from(tr.cells);
    return cells.map(cell => cell.innerText?.trim() ?? "").join(" — ");
  });

  const content = `${title}\n\n${lines.join("\n")}`;

  // downloads the content as a .txt file
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// download buttons for both lists
document.addEventListener("sidebar-component:loaded", () => {
  // command list download button
  const cmdBtn = document.getElementById("downloadListBtn");
  if (cmdBtn) {
    cmdBtn.addEventListener("click", () => {
      downloadTableAsText(".cmd-table", "git-komennot.txt", "Git Komennot");
    });
  }

  // workflow list download button
  const workflowBtn = document.getElementById("downloadWorkflowBtn");
  if (workflowBtn) {
    workflowBtn.addEventListener("click", () => {
      downloadTableAsText(".workflow-table", "git-workflowt.txt", "Git Workflowt");
    });
  }
});

// 5. Sidebar responsiveness functionality

document.addEventListener("sidebar-component:loaded", () => {
  function checkWidth() {
    if (window.innerWidth < 1200) {
      sidebar.classList.remove("closed");
      toggleBtn.classList.remove("closed");
      mainContainer.classList.remove("shifted");
    } else {
      sidebar.classList.remove("closed");
      toggleBtn.classList.remove("closed");
      mainContainer.classList.remove("shifted");
    }
  }

  checkWidth();

  window.addEventListener("resize", checkWidth);
});
