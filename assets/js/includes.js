document.querySelectorAll("[data-include]").forEach(async (el) => {
  const path = el.getAttribute("data-include");
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(res.statusText);

    const html = await res.text();
    el.innerHTML = html; // <-- nyt korvaa sisällön, ei koko elementtiä
  } catch (err) {
    el.innerHTML = `<p style="color:red">Sisällön lataus epäonnistui: ${path}</p>`;
  }
});
