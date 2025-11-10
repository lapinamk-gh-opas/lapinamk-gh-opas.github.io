// Accordion functionality
// Fetches content from external HTML file if data-include attribute is present
document.addEventListener('subContent:loaded', () => {
  document.querySelectorAll('.accordion[data-include]').forEach(async (acc) => {
    const path = acc.dataset.include;
    const placeholder = acc.querySelector('.contentToAccordion');
    const original = placeholder ? placeholder.outerHTML : '';

    try {
      const resp = await fetch(path);
      if (!resp.ok) throw new Error(resp.statusText);

      const html = await resp.text();

      acc.innerHTML = html;

      acc.dataset.originalContent = original;
      document.dispatchEvent(new CustomEvent('accordion:loaded', { detail: acc }));
    } catch (err) {
      acc.innerHTML = `<p style="color:red">Sisällön lataus epäonnistui: ${path}</p>`;
    }
  });
});

// Sets up accordion open/close functionality
// also handles default open state if "open" class is present for accordion element
document.addEventListener('accordion:loaded', (e) => {
  const item = e.detail;
  const buttonArea = item.querySelector('.header-icon');
  const content = item.querySelector('.content');
  const header = item.querySelector('.header');
  const closeButton = item.querySelector('.close-button');
  const title = item.dataset.title;

  if (header && title) header.textContent = title;
  if (content && item.dataset.originalContent) {
    content.innerHTML = item.dataset.originalContent;
  }

  const placeholderDiv = item.querySelector('.contentToAccordion');
  const defaultOpen = placeholderDiv.classList.contains('open');

  const imgOpen = item.querySelector('.bookButton.open');
  const imgClose = item.querySelector('.bookButton.close');

  if (defaultOpen) {
    content.classList.remove('hidden');
    content.style.maxHeight = content.scrollHeight + 'px';
    imgOpen.classList.add('hidden');
    imgClose.classList.remove('hidden');
    if (content.scrollHeight > window.innerHeight) {
      closeButton.classList.toggle('hidden', !hidden);
    }
  }

  buttonArea.onclick = () => {
    defaultOpen && placeholderDiv.classList.remove('open');
    const hidden = content.classList.contains('hidden');

    const transitionTime = 300;

    if (hidden) {
      content.style.maxHeight = content.scrollHeight + 'px';
      content.classList.remove('hidden');

      setTimeout(() => {
        content.style.minHeight = 'fit-content';
      }, transitionTime);
    } else {
      content.style.minHeight = '0px';
      content.style.maxHeight = '0px';
      content.classList.add('hidden');
    }

    content.classList.toggle('hidden', !hidden);
    content.classList.toggle('open', !hidden);
    imgOpen.classList.toggle('hidden', hidden);
    imgClose.classList.toggle('hidden', !hidden);

    if (content.scrollHeight > window.innerHeight) {
      closeButton.classList.toggle('hidden', !hidden);
    }
  };
});

// Image zoom effect specialt tweaks for images that are inside accordion.
// This helpsh keeping other elements in place when image is zoomed.
const initializeAccordionFigures = () => {
  const images = document.querySelectorAll('.accordion figure img');
  let resizeTimeout;

  const updateFigureHeights = () => {
    images.forEach((img) => {
      const figure = img.closest('figure');
      if (figure) {
        figure.dataset.normalHeight = figure.clientHeight;
      }
    });
  };

  images.forEach((img) => {
    img.addEventListener('load', updateFigureHeights);
  });

  const scheduleHeightUpdate = (delay = 150) => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateFigureHeights, delay);
  };

  document.addEventListener('sidebar:changed', () => scheduleHeightUpdate(350));
  window.addEventListener('resize', () => scheduleHeightUpdate(150));

  images.forEach((img) => {
    const figure = img.closest('figure');
    if (!figure) return;

    const lockHeight = () => {
      const height = figure.dataset.normalHeight;
      if (height) figure.style.height = height + 'px';
    };

    const releaseHeight = () => {
      figure.style.height = 'fit-content';
    };

    ['mousedown', 'touchstart'].forEach((evt) =>
      img.addEventListener(evt, lockHeight, { passive: true })
    );
    ['mouseup', 'touchend', 'touchcancel'].forEach((evt) =>
      img.addEventListener(evt, releaseHeight)
    );
  });
};

['accordion:loaded', 'reusedAccordion:loaded'].forEach((eventName) => {
  document.addEventListener(eventName, initializeAccordionFigures);
});

// Close functionality for accordion from bottom button of accordion.
document.addEventListener('accordion:loaded', (e) => {
  const item = e.detail;
  const closeButton = item.querySelector('.close-button');
  const placeholderDiv = item.querySelector('.contentToAccordion');

  const content = item.querySelector('.content');
  const imgOpen = item.querySelector('.bookButton.open');
  const imgClose = item.querySelector('.bookButton.close');

  closeButton.onclick = () => {
    content.style.minHeight = '0px';
    content.style.maxHeight = '0px';
    content.classList.add('hidden');
    content.classList.remove('open');
    imgOpen.classList.toggle('hidden');
    imgClose.classList.toggle('hidden');
    placeholderDiv.classList.remove('open');
    closeButton.classList.add('hidden');

    content.addEventListener('transitionend', function handler() {
      const buttonArea = item.querySelector('.header-icon');
      const rect = buttonArea.getBoundingClientRect();

      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (!isVisible) {
        window.scrollBy({
          top: rect.top - 40,
          behavior: 'smooth',
        });
      } else {
        window.scrollBy({
          top: -10,
          behavior: 'smooth',
        });
      }

      content.removeEventListener('transitionend', handler);
    });
  };
});
