// This JS file enables functionality to content pages arrow buttons (next/prev).
// user can navigate trugh sub pages and different parts by pressing arrowbuttons.

// Variables
let currentPage = getPageFromHash();
let basePath = getBasePath();
let currentPath = window.location.pathname;
let pageNames = [];
let pageNamesFin = [];
let linkNames = [];
let linkNamesFin = [];
let pageIndex = 0;
let linkIndex = 0;

//Custom event launches this after needed components are loaded
//Here sidebar links are set to variables for later navigational and text rendering purposes.
document.addEventListener("sidebar:loaded", () => {
  currentPath = window.location.pathname; // gets current path from URL
  const menuItems = document.querySelectorAll(".sidebar-menu a"); // gets menu items

  linkNames = Array.from(menuItems).map((el) => el.getAttribute("href")); // makes array of link href atributes

  linkNamesFin = Array.from(menuItems).map((el) => el.textContent); // makes array of links text content

  linkIndex = linkNames.indexOf(currentPath); // gets index of currently active link
  document.dispatchEvent(new Event("links:loaded")); // fires custom event for next phase of script
});

//Custom event launches this after previous phase is ready. Also launces if user navigates from
// top part page navigationla links. In that case custom event launches from includeSubContent.js
// Here sub pages are set to variables for later navigational and text rendering purposes.
document.addEventListener("links:loaded", () => {
  currentPage = getPageFromHash(); // gets current page from URL hash
  const container = document.getElementById("mainContainer"); // gets container of page links
  const subContentPages = container.querySelectorAll("[data-page]"); // get pages from container with data-page attribute

  // makes array of page names from date-page atributes
  pageNames = Array.from(subContentPages).map((el) =>
    el.getAttribute("data-page")
  );

  // makes array of page names from text content atributes
  pageNamesFin = Array.from(subContentPages).map((el) => el.textContent);

  // gets current page index or 0 if there are no sub pages/current page
  pageIndex = currentPage ? pageNames.indexOf(currentPage) : 0;
  document.dispatchEvent(new Event("pages:loaded")); // fires custom event for next phase of script
});

// Custom event launches this after previous phase is ready.
// This script handles button clicks and texts rendered on buttons
document.addEventListener("pages:loaded", () => {
  const prevBtn = document.getElementById("prevBtn"); // gets prev button
  const nextBtn = document.getElementById("nextBtn"); // gets next  button

  // hides prev button if there are no previous links or pages
  if (prevBtn && pageIndex === 0 && linkIndex === 0) {
    prevBtn.classList.add("hide");
  }

  // hides next button if there are no next links or pages
  if (
    nextBtn &&
    (pageIndex === pageNames.length - 1 || pageIndex === 0) &&
    linkIndex === linkNames.length - 1
  ) {
    nextBtn.classList.add("hide");
  }

  // Determines texts that are rendered on prev button if button is active/shown.
  if (prevBtn) {
    const textPrev = document.getElementById("prevText"); // gets main text field
    const additionalTextPrev = document.getElementById("prevPart"); // gets sub text field

    // if there is prev page then main field renders EDELLINEN SIVU and sub field has pages finnish name as text
    // else main fild has text EDELLINEN OSA and subfield renders previous links finnish name
    if (pageIndex > 0) {
      textPrev.textContent = "EDELLINEN SIVU"; // main field is set here
      additionalTextPrev.textContent = pageNamesFin[pageIndex - 1]; // sub field comes dynamically from variable
    } else if (pageIndex === 0) {
      textPrev.textContent = "EDELLINEN OSA"; // main field is set here
      additionalTextPrev.textContent = linkNamesFin[linkIndex - 1]; // sub field comes dynamically from variable
    }
  }

  // Determines texts that are rendered on next button if button is active/shown.
  if (nextBtn) {
    const textNext = document.getElementById("nextText"); // gets main text field
    const additionalTextNext = document.getElementById("nextPart"); // gets sub text field

    // if there is next page then main field renders SEURAAVA SIVU and sub field has pages finnish name as text
    // else main fild has text SEURAAVA OSA and subfield renders next links finnish name
    if (pageIndex < pageNames.length - 1) {
      textNext.textContent = "SEURAAVA SIVU"; // main field is set here
      additionalTextNext.textContent = pageNamesFin[pageIndex + 1]; // sub field comes dynamically from variable
    } else if (pageIndex === pageNames.length - 1 || pageIndex === 0) {
      textNext.textContent = "SEURAAVA OSA"; // main field is set here
      additionalTextNext.textContent = linkNamesFin[linkIndex + 1]; // sub field comes dynamically from variable
    }
  }

  // Functionality of prev button click if button is active/shown.
  // Loads previous page if there is one or else navigates to previous part/link
  if (prevBtn) {
    prevBtn.onclick = () => {
      navPrev();
    };
  }

  // Functionality of next button click if button is active/shown.
  // Loads next page if there is one or else navigates to next part/link
  if (nextBtn) {
    nextBtn.onclick = () => {
      navNext();
    };
  }
});

// helper function that gets and returns parts last subpage
// takes parts path as a parameter
async function getLastSubPageName(sectionPath) {
  try {
    const part = await fetch(sectionPath); //gets part by path given as parameter
    if (!part.ok)
      throw new Error(`Tiedostoa tai polkua: ${sectionPath}, ei löytynyt`); //throws error is part is not found
    const html = await part.text(); //loads temporary html dom from part

    const tmp = document.createElement("div"); //creates temportary div element
    tmp.innerHTML = html; //set loaded dom inside div
    const pages = [...tmp.querySelectorAll("[data-page]")]; //looks for sub pages
    return pages.length ? pages[pages.length - 1].dataset.page : null; // if sub pages exists returns last pages name
  } catch (err) {
    console.error(err); // is there is no part shows error on browser console
  }
}

// Event listener that handles navigating on pages with arrow keys
document.addEventListener("keyup", function (event) {
  switch (event.key) {
    case "ArrowLeft":
      if (pageIndex === 0 && linkIndex === 0) {
        break;
      } else {
        navPrev();
        break;
      }
    case "ArrowRight":
      if (
        (pageIndex === pageNames.length - 1 || pageIndex === 0) &&
        linkIndex === linkNames.length - 1
      ) {
        break;
      } else {
        navNext();
        break;
      }
  }
});

// Function for navigating to next part or subpage
function navNext() {
  console.log("next");
  if (pageIndex < pageNames.length - 1) {
    pageIndex = pageIndex + 1; // sets next page index
    loadPage(pageNames[pageIndex], basePath); // loads next page
  } else if (pageIndex === pageNames.length - 1 || pageIndex === 0) {
    window.location.href = linkNames[linkIndex + 1]; // navigates to next parts
  }
  window.scrollTo(0, 0); //scrolls window to top
}

// Function for navigating to prev part or subpage
async function navPrev() {
  if (pageIndex > 0) {
    pageIndex = pageIndex - 1; // sets previous page index
    await loadPage(pageNames[pageIndex], basePath); // loads previous page
  } else if (pageIndex === 0) {
    const prevPage = await getLastSubPageName(linkNames[linkIndex - 1]); // gets previous parts last subpage

    //if previous part has subpages navigates to last subpare or else navigates to previous part
    if (prevPage) {
      window.location.href = `${linkNames[linkIndex - 1]}#${prevPage}`; // navigates to previous parts last subpage
    } else {
      window.location.href = linkNames[linkIndex - 1]; // navigates to previous parts
    }
  }
  window.scrollTo(0, 0); //scrolls window to top
}
