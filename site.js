const year = document.querySelector('#year');
year.textContent = new Date().getFullYear();

const mediaDialog = document.querySelector('#media-dialog');
const mediaContent = document.querySelector('#media-content');
const mediaTitle = document.querySelector('#media-title');
const videoFallback = document.querySelector('#video-fallback');

// The original image and YouTube links remain usable without JavaScript.
if (typeof mediaDialog.showModal === 'function') {
  document.querySelectorAll('[data-video], [data-lightbox]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      mediaContent.replaceChildren();
      videoFallback.hidden = true;

      if (link.dataset.video) {
        mediaTitle.textContent = link.dataset.title;
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${link.dataset.video}?autoplay=1&rel=0`;
        iframe.title = link.dataset.title;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        mediaContent.append(iframe);
        videoFallback.querySelector('a').href = link.href;
        videoFallback.hidden = false;
      } else {
        mediaTitle.textContent = link.dataset.caption;
        const image = document.createElement('img');
        image.src = link.href;
        image.alt = link.querySelector('img').alt;
        mediaContent.append(image);
      }
      mediaDialog.showModal();
    });
  });

  mediaDialog.querySelector('.dialog-close').addEventListener('click', () => mediaDialog.close());
  mediaDialog.addEventListener('click', (event) => {
    if (event.target !== mediaDialog) return;
    const bounds = mediaDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) mediaDialog.close();
  });
  // Removing the iframe also stops playback when Escape or Close dismisses it.
  mediaDialog.addEventListener('close', () => mediaContent.replaceChildren());
}
