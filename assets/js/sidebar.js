// includes.js fires event: "sidebar component:loaded" after sidebar component is loaded to DOM
// and that event is used to launch/run this script.
var sidebarState = sessionStorage.getItem('sidebar');

// 0. Load table files that are included in sidebar
/**
 * Escape special HTML characters to prevent XSS.
 * @param {string} unsafe
 * @returns {string} Escaped HTML
 */
function escapeHTML(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('sidebar-component:loaded', () => {
  // Process any data-include elements within the sidebar (like table files)
  const sidebarIncludes = document.querySelectorAll('#sidebar [data-include]');
  let loadPromises = [];

  sidebarIncludes.forEach(async (el) => {
    const path = el.getAttribute('data-include');
    const loadPromise = (async () => {
      try {
        const content = await fetch(path);
        if (!content.ok) throw new Error(content.statusText);
        const html = await content.text();
        el.outerHTML = html;
      } catch (err) {
        el.innerHTML = `<p style="color:red">Sisällön lataus epäonnistui: ${escapeHTML(path)}</p>`;
      }
    })();
    loadPromises.push(loadPromise);
  });

  // After all table files are loaded, set up download buttons
  Promise.all(loadPromises).then(() => {
    // Set up download button event listeners
    const cmdBtn = document.getElementById('downloadListBtn');
    if (cmdBtn) {
      cmdBtn.addEventListener('click', () => {
        downloadTableAsText('.cmd-table', 'git-komennot.txt', 'Git Komennot');
      });
    }

    const workflowBtn = document.getElementById('downloadWorkflowBtn');
    if (workflowBtn) {
      workflowBtn.addEventListener('click', () => {
        downloadTableAsText('.workflow-table', 'git-workflowt.txt', 'Git Workflowt');
      });
    }
  });
});

// 1. Sidebar opening and closing functionality.
document.addEventListener('sidebar-component:loaded', () => {
  const sidebar = document.getElementById('sidebar'); // get sidebat element
  const toggleBtn = document.getElementById('toggleBtn'); // get toggle button element
  const mainContainer = document.getElementById('mainContainer'); // get main container element

  if (sidebarState === 'closed') {
    sidebar.classList.add('closed');
    toggleBtn.classList.add('closed');
    mainContainer.classList.add('shifted');
  } else {
    sidebar.classList.remove('closed');
    toggleBtn.classList.remove('closed');
    mainContainer.classList.remove('shifted');
  }

  // listen click event to toggle button and toggle classes to open/close for selected elements
  if (sidebar && toggleBtn && mainContainer) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('closed');
      toggleBtn.classList.toggle('closed');
      mainContainer.classList.toggle('shifted');

      const isClosed = sidebar.classList.contains('closed');
      sessionStorage.setItem('sidebar', isClosed ? 'closed' : 'open');
      sidebarState = isClosed ? 'closed' : 'open';
      document.dispatchEvent(new Event('sidebar:changed'));
    });
  }
});

// 2. Sidebar dropdown functionality
document.addEventListener('sidebar-component:loaded', () => {
  const listItems = document.querySelectorAll('.sidebar-main-item'); // gets sibebars first level list items

  // listens click events to each list items dropdown button and toggles class open for sub list
  listItems.forEach((item) => {
    const toggle = item.querySelector('.dropdown-toggle'); // gets dropdown button
    const sublist = item.querySelector('.sidebar-sub-list'); // gets sub list

    if (!toggle || !sublist) return; // if no toggle button or sub list, skip to next item

    toggle.addEventListener('click', () => {
      let isOpen = item.classList.contains('open');
      toggle.classList.toggle('open');
      sublist.classList.toggle('open');

      isOpen ? item.classList.remove('open') : item.classList.add('open');
    });
  });
});

// Closes notelist items when sidebar is closed by removing the open class from the necessary elements.
document.addEventListener('sidebar:changed', () => {
  // gets sibebars notelist elements
  const listItems = document.querySelectorAll(
    '.sidebar-main-item.commands, .sidebar-main-item.workflow'
  );

  listItems.forEach((item) => {
    let isOpen = item.classList.contains('open'); // check if element is open
    const toggle = item.querySelector('.dropdown-toggle'); // gets dropdown button
    const sublist = item.querySelector('.sidebar-sub-list'); // gets sub list

    if ((!isOpen && !toggle) || !sublist) return; // if elements can't be found or elemet is not open return

    // Remove open class from the necessary elements.
    item.classList.remove('open');
    toggle.classList.remove('open');
    sublist.classList.remove('open');
  });
});

// 3. opens the correct sidebar dropdown based on current page
document.addEventListener('sidebar-component:loaded', () => {
  const currentPath = window.location.pathname; // gets current path
  const menuItems = document.querySelectorAll('.sidebar-menu a'); // gets all sidebar menu links

  // loops through all menu links and checks if any matches current path
  menuItems.forEach((link) => {
    if (link.getAttribute('href') === currentPath) {
      const parentItem = link.closest('.sidebar-main-item');
      if (!parentItem) return;
      parentItem.classList.add('open');

      const sublist = parentItem.querySelector('.sidebar-sub-list');
      const toggle = parentItem.querySelector('.dropdown-toggle');

      // if match found, adds class open to sub list and toggle button to open the dropdown
      if (sublist) sublist.classList.add('open');
      if (toggle) toggle.classList.add('open');
    }
  });
});

// 4. Sidebar saving a list functionality
function downloadTableAsText(tableSelector, filename, title) {
  const table = document.querySelector(tableSelector);
  if (!table) return;
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const lines = rows.map((tr) => {
    const cells = Array.from(tr.cells);
    return cells.map((cell) => cell.innerText?.trim() ?? '').join(' — ');
  });

  const content = `${title}\n\n${lines.join('\n')}`;

  // downloads the content as a .txt file
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// 5. Sidebar responsiveness functionality
// close sidebar if screen changes to less than 1200px
document.addEventListener('sidebar-component:loaded', () => {
  function checkWidth() {
    if (window.innerWidth < 1200) {
      sidebar.classList.remove('closed');
      toggleBtn.classList.remove('closed');
      mainContainer.classList.remove('shifted');
    } else if (sidebarState === 'closed') {
      sidebar.classList.add('closed');
      toggleBtn.classList.add('closed');
      mainContainer.classList.add('shifted');
    } else {
      sidebar.classList.remove('closed');
      toggleBtn.classList.remove('closed');
      mainContainer.classList.remove('shifted');
    }
  }

  checkWidth();

  window.addEventListener('resize', checkWidth);
});
