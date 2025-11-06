// function to enable click-to-copy functionality on all <code> elements
const enableCodeCopy = async () => {
  const codeElements = document.querySelectorAll('code'); // looks for all code elements

  // loops through each code element and adds click event listener
  codeElements.forEach((codeElement) => {
    // adds styles and title to indicate copy functionality
    codeElement.style.cursor = 'pointer';
    codeElement.title = 'Kopioi 📋';

    // adds click event listener to copy code content to clipboard
    // and calls showNotification function to show feedback to user.
    codeElement.addEventListener('click', () => {
      const code = codeElement.textContent;
      navigator.clipboard
        .writeText(code)
        .then(() => showNotification('kopioitu leikepöydälle ✅', code))
        .catch((err) => showNotification('Kopiointi epäonnistui ❌', err));
    });
  });
};

// function to show notification message for copy action feedback
const showNotification = (message, code) => {
  const notification = document.querySelector('.notification');
  const notificationText = notification.querySelector('.notification-text');
  const notificationCode = notification.querySelector('.notification-code');

  notificationText.textContent = message;
  notificationCode.textContent = code;
  notification.classList.add('show');

  // uses timeout to hide notification after 1.5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 1500);
};

// uses MutationObserver to watch for changes in the DOM
// and re-applies copy functionality to newly added code elements.
// This way there is no need to use custom events to trigger the function because it
// automatically detects added elements.
const observer = new MutationObserver(() => {
  enableCodeCopy();
});

// starts observing the document body for added elements
observer.observe(document.body, { childList: true, subtree: true });
