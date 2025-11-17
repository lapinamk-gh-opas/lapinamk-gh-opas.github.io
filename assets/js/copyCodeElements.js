let notificationTimeout = null;

// show notification with message and code content
function showNotification(message, code) {
  const notification = document.querySelector('.notification');
  if (!notification) return; // if no notification element, do nothing

  const textEl = notification.querySelector('.notification-text');
  const codeEl = notification.querySelector('.notification-code');

  if (textEl) textEl.textContent = message;
  if (codeEl) codeEl.textContent = code;

  // perutaan edellinen timeout
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    notificationTimeout = null;
  }

  // restart CSS-animation
  notification.classList.remove('show');
  void notification.offsetWidth; // force reflow
  notification.classList.add('show');

  notificationTimeout = setTimeout(() => {
    notification.classList.remove('show');
    notificationTimeout = null;
  }, 1500);
}

// handles click on a single code element
function handleCodeClick(codeElement) {
  // set style and tooltip once
  if (!codeElement.dataset.copyInit) {
    codeElement.style.cursor = 'pointer';
    codeElement.title = 'Kopioi 📋';
    codeElement.dataset.copyInit = 'true';
  }

  // debounce clicks
  const now = Date.now();
  const last = Number(codeElement.dataset.lastCopyTs || 0);

  // if less than 300 ms since last click, do nothing
  if (now - last < 300) {
    return;
  }
  codeElement.dataset.lastCopyTs = String(now);

  const code = codeElement.textContent || '';

  navigator.clipboard
    .writeText(code)
    .then(() => {
      showNotification('kopioitu leikepöydälle ✅', code);
    })
    .catch((err) => {
      showNotification('Kopiointi epäonnistui ❌', String(err));
    });
}

// global click listener for the whole page
document.addEventListener('click', (event) => {
  const codeElement = event.target.closest('code');
  if (!codeElement) return;

  handleCodeClick(codeElement);
});

// clean up notification and timeout when leaving the page
window.addEventListener('beforeunload', () => {
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    notificationTimeout = null;
  }
  const notification = document.querySelector('.notification');
  if (notification) {
    notification.classList.remove('show');
  }
});
