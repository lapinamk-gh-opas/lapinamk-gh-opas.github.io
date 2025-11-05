document.addEventListener('subContent:loaded', () => {
  enableCodeCopy();
});
document.addEventListener('pages:loaded', () => {
  enableCodeCopy();
});

const enableCodeCopy = () => {
  document.querySelectorAll('code').forEach((codeElement) => {
    codeElement.style.cursor = 'pointer';
    codeElement.title = 'Kopioi 📋';

    codeElement.addEventListener('click', () => {
      const code = codeElement.textContent;
      navigator.clipboard
        .writeText(code)
        .then(() => showNotification('kopioitu leikepöydälle ✅', code))
        .catch((err) => showNotification('Kopiointi epäonnistui ❌', err));
    });
  });
};

const showNotification = (message, code) => {
  const notification = document.querySelector('.notification');
  const notificationText = notification.querySelector('.notification-text');
  const notificationCode = notification.querySelector('.notification-code');

  notificationText.textContent = message;
  notificationCode.textContent = code;
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 1500);
};
