document.addEventListener("subContent:loaded", () => {
  const listItems = document.querySelectorAll(".header-content"); //gets collapsible elemets (accordions)

  // Loops through collasible elements and listens click events of
  // each list items open buttons and close buttons then toggles class hidden for elements accordingly
  if (listItems) {
    listItems.forEach((item) => {
      const toggleOpen = item.querySelector(".bookButton.open"); // gets open button
      const toggleClose = item.querySelector(".bookButton.close"); // gets close button

      toggleOpen.addEventListener("click", () => {
        toggleOpen.classList.add("hidden"); // toggless hidden class for open button
        toggleClose.classList.remove("hidden"); // toggless hidden class for close button
        item.querySelector(".content").classList.remove("hidden"); // toggless hidden class for content div
      });

      toggleClose.addEventListener("click", () => {
        toggleOpen.classList.remove("hidden"); // toggless hidden class for open button
        toggleClose.classList.add("hidden"); // toggless hidden class for close button
        item.querySelector(".content").classList.add("hidden"); // toggless hidden class for content div
      });
    });
  }
});
