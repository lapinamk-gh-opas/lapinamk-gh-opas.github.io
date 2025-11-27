// Escapes HTML metacharacters in a string
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function (m) {
    switch (m) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return m;
    }
  });
}

// Function gets page/file name from URL hash (?section= part of url)
// (eg. /basics/git-install.html?section=create-account --> create-account)
// If no hash is found, it sets value of data-page attribute from first link inside div
// with id mainContainer to the URL hash and returns that
export function getPageFromParam() {
  const params = new URLSearchParams(location.search);
  const section = params.get('section');

  if (!section) {
    const container = document.getElementById('mainContainer');
    const first = container.querySelector('[data-page]');
    if (first) {
      const firstSection = first.getAttribute('data-page');
      const newUrl = `${location.pathname}?section=${firstSection}`;
      history.replaceState(null, '', newUrl);
      return firstSection;
    }
    return null;
  }

  return section;
}

// Function gets path from URL hash
// (eg. /basics/git-install.html#create-account --> /basics/git-install)
export function getBasePath() {
  const params = window.location.pathname; // gets current path
  const basePath = params.substring(0, params.length - 5); // removes last 5 chars (.html) to get base path
  return basePath;
}

// For this to work, the HTML file must have a div with id "content" and
// inside that links with data-page attributes
// Example: <div id="content"><a href="#" data-page="installing-git">Installing Git</a></div>

// This loads pages sub content into the div with id content
// Function gets two parameters:
// ** 1. subContent is content to show (eg. installing-git.html)
// ** 2. basePath is folder where content can be found (eg. git-install)
export async function loadPage(subContent, basePath) {
  const container = document.getElementById('content'); // looks for div by id
  try {
    if (basePath && subContent) {
      const response = await fetch(`${basePath}/${subContent}.html`);
      if (!response.ok) throw new Error(response.statusText);

      container.innerHTML = await response.text();

      const params = new URLSearchParams(location.search);
      params.set('section', subContent);
      const newUrl = `${location.pathname}?${params.toString()}`;
      history.replaceState(null, '', newUrl);
    }

    // Adds pages title from h1 tag inside content div to page title in head
    const header = document.querySelector('#content h1');

    if (header) {
      const titleEl = document.getElementById('page-title');
      const text = header.textContent.trim();

      if (titleEl) titleEl.textContent = `${text} | Git ja GitHub Opiskelijan opas`;
    }
    document.dispatchEvent(new Event('links:loaded'));
    document.dispatchEvent(new Event('subContent:loaded'));
  } catch (err) {
    container.innerHTML = `<p>Virhe ladattaessa:  ${escapeHTML(err)}</p>`; // in case of error, show error message
  }
}
