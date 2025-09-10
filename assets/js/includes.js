document.querySelectorAll("[data-include]").forEach(async (el) => {
  const path = el.getAttribute("data-include");
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(res.statusText);
    el.outerHTML = await res.text();
  } catch (err) {
    el.innerHTML = `<p style="color:red">Sisällön lataus epäonnistui: ${path}</p>`;
  }
});
