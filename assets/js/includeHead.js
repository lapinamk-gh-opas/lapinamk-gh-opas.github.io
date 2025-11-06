// This function loads external HTML file into document head.
// Function intiLoader calls this function. initLoader is called from HTML file.
// Parameter pageTitle is optional. If given, it sets the page title to
// that value other wise it uses default title from head.html file.
export async function loadHead(pageTitle) {
  const res = await fetch('/utils/head.html'); // fetches head content.
  if (!res.ok) {
    throw new Error(`Headin lataus epäonnistui: ${res.status} ${res.statusText}`);
  }

  const html = await res.text(); // gets text from fetched content.

  const temp = document.createElement('div'); // creates temporary div element.
  temp.innerHTML = html; // sets fetched head content inside temporary div.

  // Moves link, meta and title elements from temporary div to document head.
  temp.querySelectorAll('link, meta, title').forEach((el) => document.head.appendChild(el));

  // Sets custom page title if given as parameter.
  if (pageTitle) {
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = pageTitle;
  }

  // Loads and appends scripts to document head to ensure they are executed.
  const scripts = Array.from(temp.querySelectorAll('script')).map((oldScript) => {
    return new Promise((resolve, reject) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      if (oldScript.textContent) newScript.textContent = oldScript.textContent;

      newScript.onload = () => resolve();
      newScript.onerror = () => reject();

      document.head.appendChild(newScript);
    });
  });

  return Promise.all(scripts);
}
