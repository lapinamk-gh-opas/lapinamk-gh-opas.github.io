document.addEventListener("subContent:loaded", () => {
  const listItems = document.querySelectorAll(".header-content"); // gets sibebars first level list items

  // listens click events to each list items dropdown button and toggles class open for sub list
  if (listItems) {
    listItems.forEach((item) => {
      const toggleOpen = item.querySelector(".bookButton.open"); //gets dropdown button
      const toggleClose = item.querySelector(".bookButton.close");

      toggleOpen.addEventListener("click", () => {
        toggleOpen.classList.toggle("hidden"); // add open class for button
        toggleClose.classList.toggle("hidden"); // add open class for button
        item.querySelector(".content").classList.toggle("hidden"); // add open class for sub list
      });

      toggleClose.addEventListener("click", () => {
        toggleOpen.classList.toggle("hidden"); // add open class for button
        toggleClose.classList.toggle("hidden"); // add open class for button
        item.querySelector(".content").classList.toggle("hidden"); // add open class for sub list
      });
    });
  }
});
