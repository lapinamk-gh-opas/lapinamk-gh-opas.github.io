import { loadHead } from '/assets/js/includeHead.js';

export async function initLoader(pageTitle) {
  const loader = document.getElementById('loader');
  loader.style.display = 'flex';

  await loadHead('/utils/head.html', pageTitle);
  await document.fonts.ready;

  loader.classList.add('fade-out');
  document.dispatchEvent(new Event('content:loaded'));
}
