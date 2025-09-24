document.addEventListener("subContent:loaded", () => {
  document.querySelectorAll(".accordion[data-include]").forEach(async (acc) => {
    const path = acc.dataset.include;
    const placeholder = acc.querySelector(".contentToAccordion");
    const original = placeholder ? placeholder.outerHTML : "";

    try {
      const resp = await fetch(path);
      if (!resp.ok) throw new Error(resp.statusText);

      const html = await resp.text();

      acc.innerHTML = html;

      acc.dataset.originalContent = original;
      document.dispatchEvent(
        new CustomEvent("accordion:loaded", { detail: acc })
      );
    } catch (err) {
      acc.innerHTML = `<p style="color:red">Sisällön lataus epäonnistui: ${path}</p>`;
    }
  });
});

document.addEventListener("accordion:loaded", (e) => {
  const item = e.detail;
  const content = item.querySelector(".content");
  const header = item.querySelector(".header");
  const title = item.dataset.title;

  if (header && title) header.textContent = title;
  if (content && item.dataset.originalContent) {
    content.innerHTML = item.dataset.originalContent;
  }

  const placeholderDiv = item.querySelector(".contentToAccordion");
  const defaultOpen = placeholderDiv.classList.contains("open");
  console.log("default open: ", defaultOpen);

  const imgOpen = item.querySelector(".bookButton.open");
  const imgClose = item.querySelector(".bookButton.close");

  if (defaultOpen) {
    content.classList.remove("hidden");
    content.style.maxHeight = content.scrollHeight + "px";
    imgOpen.classList.add("hidden");
    imgClose.classList.remove("hidden");
  }

  item.onclick = () => {
    defaultOpen && placeholderDiv.classList.remove("open");
    const hidden = content.classList.contains("hidden");

    hidden
      ? (content.style.maxHeight = content.scrollHeight + "px")
      : (content.style.maxHeight = "0px");

    content.classList.toggle("hidden", !hidden);
    imgOpen.classList.toggle("hidden", hidden);
    imgClose.classList.toggle("hidden", !hidden);
  };
});
