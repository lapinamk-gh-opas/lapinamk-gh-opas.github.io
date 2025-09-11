document.querySelectorAll("[data-include]").forEach(async (el) => {
  const path = el.getAttribute("data-include");
  const res = await fetch(path);
  el.outerHTML = await res.text();

  if (path.includes("sidebar/sidebar.html")) {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleBtn");
    const mainContainer = document.getElementById("mainContainer");

    console.log("Sidebar script loaded", { sidebar, toggleBtn, mainContainer });

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        console.log("Toggle sidebar");
        sidebar.classList.toggle("closed");
        toggleBtn.classList.toggle("closed");
        mainContainer.classList.toggle("shifted");
      });
    }
  }
});
