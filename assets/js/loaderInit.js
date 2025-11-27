// This JS file loads external HTML file into the document head.
// It is used to include common meta tags, link tags, css tags and scripts all pages
// from one head content that is stored in html-file in utils/head.html

// With help of this arrangement we can easily update head content in one place.
// HTML files that needs head tags just needs to call this function to load head
// to the page like this in their HTML code:
//  <head>
//    <link rel="stylesheet" href="/assets/css/loading.css" />
//    <script type="module">
//      import { initLoader } from '/assets/js/loaderInit.js';
//      initLoader('Etusivu');
//    </script>
//  </head>
// Give page title as parameter to initLoader function if you want to set custom title for the page.
// Otherwise title Lapin AMK Git-opas from head.html will be used.

// imports loadHead functions that does the actual loading of head content
import { loadHead } from '/assets/js/includeHead.js';

// This function is used to determine if head content is loaded and fonts are ready
// before showing the page content to user. This one needs to be exported and called
// from HTML file.
let loaderDelay = false;

export async function initLoader(pageTitle) {
  const loader = document.getElementById('loader');
  loader.style.display = 'flex';

  try {
    await loadHead(pageTitle);
  } catch (err) {
    loader.innerHTML += `<p style="color:red">Virhe sivun latauksessa: ${err.message}</p>`;
    return;
  }

  await document.fonts.ready;
  document.dispatchEvent(new Event('content:loaded'));
}

document.addEventListener('subContent:loaded', async () => {
  clearTimeout(loaderDelay);
  loaderDelay = setTimeout(() => {
    loader.classList.add('fade-out');
  }, 50);
});
