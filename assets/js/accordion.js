document.addEventListener("subContent:loaded", () => {
  const listItems = document.querySelectorAll(".header-content"); //gets collapsible elemets (accordions)

  // Loops through collasible elements and listens click events of
  // each list items open buttons and close buttons then toggles class hidden for elements accordingly
  if (listItems) {
    listItems.forEach((item) => {
      const imgBookOpen = item.querySelector(".bookButton.open"); // gets open book img
      const imgBookClosed = item.querySelector(".bookButton.close"); // gets closed book img
      const content = item.querySelector(".content"); // gets content div

      item.onclick = () => {
        const isHidden = content.classList.contains("hidden"); // is content hidden

        content.classList.toggle("hidden", !isHidden); // Toggle content class hidden
        imgBookOpen.classList.toggle("hidden", isHidden); // Toggle open book img class hidden
        imgBookClosed.classList.toggle("hidden", !isHidden); // Toggle closed book img class hidden
      };
    });
  }
});
