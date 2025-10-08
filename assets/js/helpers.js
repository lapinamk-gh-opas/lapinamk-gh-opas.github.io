// Function gets page/file name from URL hash (# part of url)
// (eg. /basics/git-install.html#create-account --> create-account)
// If no hash is found, it sets value of data-page attribute from first link inside div
// with id mainContainer to the URL hash and returns that
export function getPageFromHash() {
  const content = location.hash.substring(1); // gets hash part of URL and removes #
  if (!content) {
    const container = document.getElementById("mainContainer"); // gets main container div
    const first = container.querySelectorAll("[data-page]")[0]; // gets first link with data-page attribute
    if (first) {
      const firstSubContent = first.getAttribute("data-page"); // gets value of data-page attribute
      location.hash = firstSubContent; // sets URL hash to that value
      return firstSubContent; // returns that value
    }
  }
  return content; // returns the hash value if found
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
  const container = document.getElementById("content"); // looks for div by id
  try {
    if (basePath && subContent) {
      const content = await fetch(`${basePath}/${subContent}.html`); // fetches the content to show
      if (!content.ok) throw new Error(content.statusText); // error handling if fetch fails
      container.innerHTML = await content.text(); // sets content to container div
      location.hash = subContent;
    }
    document.dispatchEvent(new Event("links:loaded"));
    document.dispatchEvent(new Event("subContent:loaded"));
  } catch (err) {
    container.innerHTML = `<p>Virhe ladattaessa: ${err}</p>`; // incase of error, show error message
  }
}
