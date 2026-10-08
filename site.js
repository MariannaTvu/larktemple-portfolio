const year = document.querySelector('#year');
year.textContent = new Date().getFullYear();

const mediaDialog = document.querySelector('#media-dialog');
const mediaContent = document.querySelector('#media-content');
const mediaTitle = document.querySelector('#media-title');
const videoFallback = document.querySelector('#video-fallback');

// Load visible loops without clearing the still image while they download.
const animations = [...document.querySelectorAll('[data-animation]')];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const animationState = new Map();

function setAnimationPlayback(frame, playing) {
  const state = animationState.get(frame);
  if (state.playing === playing) return;
  state.playing = playing;
  const revision = ++state.revision;
  const button = frame.querySelector('.motion-toggle');
  const image = frame.querySelector('img');
  const label = `${playing ? 'Pause' : 'Play'} ${frame.dataset.label}`;
  frame.dataset.playing = String(playing);
  button.setAttribute('aria-label', label);
  button.title = label;
  button.setAttribute('aria-pressed', String(playing));
  button.setAttribute('aria-busy', String(playing));
  if (!playing) {
    if (image.getAttribute('src') !== frame.dataset.poster) image.src = frame.dataset.poster;
    return;
  }
  if (!state.decoded) {
    const preload = new Image();
    preload.src = frame.dataset.animation;
    state.decoded = preload.decode();
  }
  state.decoded.then(() => {
    if (!state.playing || state.revision !== revision) return;
    image.src = frame.dataset.animation;
    button.setAttribute('aria-busy', 'false');
  }).catch(() => {
    state.decoded = null;
    if (!state.playing || state.revision !== revision) return;
    state.manual = false;
    setAnimationPlayback(frame, false);
  });
}

function refreshAnimation(frame) {
  const state = animationState.get(frame);
  const automatic = !motionPreference.matches && !navigator.connection?.saveData;
  const requested = state.manual === true || (state.manual !== false && automatic);
  setAnimationPlayback(frame, requested && state.visible && !document.hidden && !mediaDialog.open);
}

function refreshAnimations() { animations.forEach(refreshAnimation); }

animations.forEach((frame) => {
  const state = { playing: false, visible: false, manual: null, revision: 0, decoded: null };
  animationState.set(frame, state);
  frame.dataset.playing = 'false';
  const button = frame.querySelector('.motion-toggle');
  button.hidden = false;
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    state.manual = !state.playing;
    state.visible = true;
    refreshAnimation(frame);
  });
});

if ('IntersectionObserver' in window) {
  const visibility = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      animationState.get(entry.target).visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
      refreshAnimation(entry.target);
    });
  }, { threshold: [0, 0.15] });
  animations.forEach((frame) => visibility.observe(frame));
}
document.addEventListener('visibilitychange', refreshAnimations);
motionPreference.addEventListener('change', refreshAnimations);

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
      refreshAnimations();
    });
  });

  mediaDialog.querySelector('.dialog-close').addEventListener('click', () => mediaDialog.close());
  mediaDialog.addEventListener('click', (event) => {
    if (event.target !== mediaDialog) return;
    const bounds = mediaDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) mediaDialog.close();
  });
  // Removing the iframe also stops playback when Escape or Close dismisses it.
  mediaDialog.addEventListener('close', () => {
    mediaContent.replaceChildren();
    refreshAnimations();
  });
}
