// This is JS script to dynamically loads sub content into a HTML page based on URL parameters and link clicks.

// imports helper functions
import { getPageFromParam, getBasePath, loadPage } from '/assets/js/navigationHelpers.js';

// This manipulates dom after it has been loaded and uses
// loadPage and getPageFromParam functions to load correct content
// also listens click events to links inside content div and loads correct content
document.addEventListener('content:loaded', async () => {
  const subContent = getPageFromParam(); // on first load and after refresh gets page from hash or first link
  const basePath = getBasePath(); // gets base path from current path
  await loadPage(subContent, basePath); // loads the page using page name and path

  const container = document.getElementById('mainContainer'); // gets main container div

  // listens clicks for links and load new sub content accordingly
  container.querySelectorAll('[data-page]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const subContent = link.getAttribute('data-page');
      loadPage(subContent, basePath);
    });
  });

  document.dispatchEvent(new Event('subContent:loaded'));
});
