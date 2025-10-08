export async function loadHead(path, pageTitle) {
  const res = await fetch(path);
  const html = await res.text();

  const temp = document.createElement("div");
  temp.innerHTML = html;

  // Lisätään <link>, <meta>, <title>
  temp
    .querySelectorAll("link, meta, title")
    .forEach((el) => document.head.appendChild(el));

  // Päivitetään title
  if (pageTitle) {
    const titleEl = document.getElementById("page-title");
    if (titleEl) titleEl.textContent = pageTitle;
  }

  // Ladataan skriptit Promiseilla
  const scripts = Array.from(temp.querySelectorAll("script")).map(
    (oldScript) => {
      return new Promise((resolve, reject) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
        if (oldScript.textContent)
          newScript.textContent = oldScript.textContent;

        newScript.onload = () => resolve();
        newScript.onerror = () => reject();

        document.head.appendChild(newScript);
      });
    }
  );

  // Odotetaan, että kaikki skriptit on ladattu ja suoritettu
  return Promise.all(scripts);
}
