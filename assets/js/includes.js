// Used to include HTML snippets (eg. nav-bar, footer, sidebar) into the main document
// Example usage on html file:
// <div data-include="/path/to/file.html"></div> looks for file.html and includes its content inside this div
// This enables modularitys to the site by allowing HTML snippets to be reused across multiple pages
let sidebarLoaded = false;
let arrowsLoaded = false;
// Escapes HTML metacharacters in a string
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function(m) {
    switch (m) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return m;
    }
  });
}

document.querySelectorAll("[data-include]").forEach(async (el) => {
  const path = el.getAttribute("data-include"); // gets path from divs data-include attribute

  try {
    const content = await fetch(path); // fetches the content from the path
    if (!content.ok) throw new Error(content.statusText); // trows error if fetch fails

    const html = await content.text(); // gets text from fetched content
    el.outerHTML = html; // sets the content inside the div

    // dispatches event when sidebar is loaded (this is used to launch sidebar.js)
    if (path.includes("/sidebar/sidebar.html")) {
      document.dispatchEvent(new Event("sidebar-component:loaded"));
      sidebarLoaded = true;
    }
    if (path.includes("/arrows/arrows.html")) {
      arrowsLoaded = true;
    }
    if (sidebarLoaded && arrowsLoaded) {
      document.dispatchEvent(new Event("sidebar:loaded"));
    }
  } catch (err) {
    // in case of error, shows error message inside the div
    el.innerHTML = `<p style="color:red">Sisällön lataus epäonnistui: ${escapeHTML(path)}</p>`;
  }
});
