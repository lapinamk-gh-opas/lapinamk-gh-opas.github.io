// Helper to escape HTML meta-characters in strings
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

document.addEventListener("accordion:loaded", () => {
  const reusedAccordion = document.querySelectorAll(".reused-accordion");

  // listens clicks for links and load new sub content accordingly
  reusedAccordion.forEach(async (accordion) => {
    const path = accordion.getAttribute("data-include");
    try {
      const reusedContent = await fetch(path); // fetches the content from the path
      if (!reusedContent.ok) throw new Error(reusedContent.statusText); // trows error if fetch fails

      const html = await reusedContent.text(); // gets text from fetched content
      accordion.outerHTML = html; // sets the content inside the div
      document.dispatchEvent(new Event("reusedAccordion:loaded"));
    } catch (err) {
      // in case of error, shows error message inside the div
      accordion.innerHTML = `<p style="color:red">Sisällön lataus epäonnistui: ${escapeHTML(
        path
      )}</p>`;
    }
  });
});
