async function loadPage(page) {
  const container = document.getElementById("content");
  try {
    const res = await fetch(`git-install/${page}.html`);
    if (!res.ok) throw new Error(res.statusText);
    container.innerHTML = await res.text();
  } catch (err) {
    container.innerHTML = `<p>Virhe ladattaessa: ${err}</p>`;
  }
}

function getPageFromHash() {
  // Esim. URL: ...#installing-git
  return location.hash ? location.hash.substring(1) : "installing-git";
}

function updateLinks(page) {
  document.querySelectorAll("[data-page]").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("data-page") === page);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  let page = getPageFromHash(); // Ladataan hashista aloitussivu
  loadPage(page);
  updateLinks(page);

  document.querySelectorAll("[data-page]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      // Päivitä hash
      location.hash = page;
    });
  });

  // Kuunnellaan hashin muutosta, esim. back/forward
  window.addEventListener("hashchange", () => {
    const page = getPageFromHash();
    loadPage(page);
    updateLinks(page);
  });
});
