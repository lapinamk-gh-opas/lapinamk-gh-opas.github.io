export async function loadHead(path, pageTitle) {
  const res = await fetch(path);
  const html = await res.text();

  const temp = document.createElement("div");
  temp.innerHTML = html;

  temp
    .querySelectorAll("link, meta, title")
    .forEach((el) => document.head.appendChild(el));

  if (pageTitle) {
    const titleEl = document.getElementById("page-title");
    if (titleEl) titleEl.textContent = pageTitle;
  }

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

  return Promise.all(scripts);
}
