const menuButton = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const toursGrid = document.querySelector('.tours-grid');
const toursToggle = document.querySelector('#tours-toggle');
const additionalToursGroup = document.querySelector('#additional-tours');
const additionalTours = [...document.querySelectorAll('.additional-tour')];

let toursExpanded = false;
let toursCollapseTimer;

const WHATSAPP_NUMBER = '5583998048936';

const whatsappLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

document.querySelectorAll('[data-whatsapp-message]').forEach((link) => {
  link.href = whatsappLink(link.dataset.whatsappMessage);
});

document.querySelectorAll('[data-tour-url]').forEach((card) => {
  const openDetails = () => {
    window.location.href = card.dataset.tourUrl;
  };

  card.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) return;
    openDetails();
  });

  card.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('a, button')) {
      event.preventDefault();
      openDetails();
    }
  });
});

menuButton?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  document.body.classList.toggle('menu-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

let navbarScrollFrame;

const updateNavbarScrollState = () => {
  navbar.classList.toggle('is-scrolled', window.scrollY > 650);
  navbarScrollFrame = null;
};

window.addEventListener('scroll', () => {
  if (navbarScrollFrame) return;
  navbarScrollFrame = requestAnimationFrame(updateNavbarScrollState);
}, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const setToursExpanded = (expanded) => {
  toursExpanded = expanded;
  clearTimeout(toursCollapseTimer);

  toursToggle.setAttribute('aria-expanded', String(expanded));
  toursToggle.textContent = expanded ? 'Ver menos' : 'Ver mais passeios';

  if (expanded) {
    additionalToursGroup.hidden = false;
    toursGrid.classList.add('is-expanded');
    requestAnimationFrame(() => {
      additionalTours.forEach((card) => card.classList.add('is-visible'));
    });
    return;
  }

  toursGrid.classList.remove('is-expanded');
  additionalTours.forEach((card) => card.classList.remove('is-visible'));
  toursCollapseTimer = setTimeout(() => {
    if (!toursExpanded) additionalToursGroup.hidden = true;
  }, 500);
};

toursToggle?.addEventListener('click', () => {
  setToursExpanded(!toursExpanded);
});

const visualCard = document.querySelector('.visual-card');
const visualVideo = visualCard?.querySelector('.visual-video');
const playButton = visualCard?.querySelector('.play-button');
const visualPlayer = visualCard?.querySelector('.visual-player');
const rotateHint = visualCard?.querySelector('.video-rotate-hint');
const fullscreenButton = visualCard?.querySelector('.video-fullscreen');
const exitImmersiveButton = visualCard?.querySelector('.video-exit-immersive');
const videoPortrait = window.matchMedia('(orientation: portrait)');
const videoLandscape = window.matchMedia('(orientation: landscape) and (max-width: 1100px) and (hover: none) and (pointer: coarse)');
// A secondary touchscreen on a desktop must not enable the mobile player.
const videoTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)');
let rotateHintShown = false;
let rotateHintTimer;
let videoPlaybackStarted = false;
let immersiveDismissed = false;
let videoWasFullscreen = false;

const isVideoFullscreen = () => Boolean(
  (document.fullscreenElement && visualPlayer?.contains(document.fullscreenElement)) ||
  visualVideo?.webkitDisplayingFullscreen
);

const canFullscreenVideo = () => Boolean(
  (document.fullscreenEnabled && visualVideo?.requestFullscreen) ||
  visualVideo?.webkitEnterFullscreen
);

const hideRotateHint = () => {
  clearTimeout(rotateHintTimer);
  if (rotateHint) rotateHint.hidden = true;
};

const updateVideoOrientation = () => {
  if (videoPortrait.matches) immersiveDismissed = false;
  if (!videoTouchDevice.matches || !videoPortrait.matches || isVideoFullscreen()) hideRotateHint();
  if (fullscreenButton) {
    fullscreenButton.hidden = !videoTouchDevice.matches || !canFullscreenVideo() || isVideoFullscreen();
  }
  visualCard?.classList.toggle('is-landscape-player',
    videoTouchDevice.matches && videoLandscape.matches && videoPlaybackStarted &&
    !immersiveDismissed && !isVideoFullscreen());
};

// matchMedia also handles iOS, without requiring orientation locking or a new video element.
[videoPortrait, videoLandscape, videoTouchDevice].forEach((query) => {
  if (query.addEventListener) query.addEventListener('change', updateVideoOrientation);
  else query.addListener(updateVideoOrientation);
});

visualVideo?.addEventListener('playing', () => {
  videoPlaybackStarted = true;
  updateVideoOrientation();
  if (!rotateHintShown && videoTouchDevice.matches && videoPortrait.matches && rotateHint) {
    rotateHintShown = true;
    rotateHint.hidden = false;
    rotateHintTimer = setTimeout(hideRotateHint, 4000);
  }
});

visualVideo?.addEventListener('ended', () => {
  videoPlaybackStarted = false;
  rotateHintShown = false;
  immersiveDismissed = false;
  hideRotateHint();
  updateVideoOrientation();
});

exitImmersiveButton?.addEventListener('click', () => {
  immersiveDismissed = true;
  updateVideoOrientation();
});

// Keep native and mobile controls on the same fullscreen element. Fullscreening
// the wrapper would leave it expanded after the native video control exits.
const syncVideoFullscreen = () => {
  const fullscreen = isVideoFullscreen();
  if (videoWasFullscreen && !fullscreen) immersiveDismissed = true;
  videoWasFullscreen = fullscreen;
  updateVideoOrientation();
};

document.addEventListener('fullscreenchange', syncVideoFullscreen);
visualVideo?.addEventListener('webkitbeginfullscreen', syncVideoFullscreen);
visualVideo?.addEventListener('webkitendfullscreen', syncVideoFullscreen);

fullscreenButton?.addEventListener('click', async () => {
  if (!videoTouchDevice.matches || !visualVideo) return;
  hideRotateHint();
  try {
    if (document.fullscreenElement && visualPlayer?.contains(document.fullscreenElement)) {
      await document.exitFullscreen();
    } else if (visualVideo.webkitDisplayingFullscreen) {
      visualVideo.webkitExitFullscreen();
    } else if (document.fullscreenEnabled && visualVideo.requestFullscreen) {
      await visualVideo.requestFullscreen();
    } else if (visualVideo.webkitEnterFullscreen) {
      visualVideo.webkitEnterFullscreen();
    }
  } catch {
    // Native video controls remain available if fullscreen is refused.
  }
  syncVideoFullscreen();
});

updateVideoOrientation();

playButton?.addEventListener('click', async () => {
  if (!visualVideo || visualVideo.src) return;

  visualVideo.src = visualVideo.dataset.src;

  visualCard.classList.add('is-video-active');
  visualVideo.load();

  try {
    await visualVideo.play();
  } catch {
    // Os controles permanecem disponíveis caso o navegador exija um novo toque.
  }
});

const googleReviewsHero = document.querySelector('[data-google-reviews]');
const reviewsSummary = document.querySelector('[data-reviews-summary]');
const reviewsList = document.querySelector('[data-reviews-list]');

const formatRating = (rating) =>
  new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(rating);

const formatReviewCount = (count) =>
  `${new Intl.NumberFormat('pt-BR').format(count)} ${count === 1 ? 'avaliação' : 'avaliações'} no Google`;

const formatStars = (rating) => {
  const filledStars = Math.max(0, Math.min(5, Math.round(rating)));
  return `${'★'.repeat(filledStars)}${'☆'.repeat(5 - filledStars)}`;
};

const formatReviewDate = (value) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return 'Avaliação do Google';

  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric'
  }).format(date);
};

const createReviewerAvatar = (review) => {
  if (review.profilePhotoUrl) {
    const image = document.createElement('img');
    image.src = review.profilePhotoUrl;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.referrerPolicy = 'no-referrer';
    image.addEventListener('error', () => image.replaceWith(createReviewerFallback(review.displayName)), { once: true });
    return image;
  }

  return createReviewerFallback(review.displayName);
};

const createReviewerFallback = (displayName) => {
  const fallback = document.createElement('span');
  fallback.setAttribute('aria-hidden', 'true');
  fallback.textContent = (displayName || '?').trim().charAt(0).toLocaleUpperCase('pt-BR') || '?';
  return fallback;
};

const reviewsPanel = document.querySelector('[data-reviews-panel]');
const reviewsDialog = document.querySelector('[data-reviews-dialog]');
const reviewsFull = document.querySelector('[data-reviews-full]');
const reviewsMobile = window.matchMedia('(max-width: 760px)');
const reviewsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Leave the source text intact; discard only Google's appended translation.
const originalReviewComment = (comment) => comment.split('(Translated by Google)')[0].trim();

const createReviewCard = (review, index, { decorative = false, full = false } = {}) => {
  const card = document.createElement('article');
  card.className = `quote-card${index % 3 === 1 ? ' featured-quote' : ''}`;
  card.dataset.reviewIndex = index;
  if (decorative) {
    card.dataset.reviewCopy = '';
    card.setAttribute('aria-hidden', 'true');
    card.setAttribute('inert', '');
  }

  const rating = document.createElement('div');
  rating.className = 'quote-rating';
  if (Number.isInteger(review.starRating) && review.starRating >= 1 && review.starRating <= 5) {
    rating.setAttribute('aria-label', `${review.starRating} de 5 estrelas`);
    const stars = document.createElement('span');
    stars.setAttribute('aria-hidden', 'true');
    stars.textContent = formatStars(review.starRating);
    rating.append(stars);
  }

  const comment = document.createElement('p');
  comment.className = 'review-comment';
  comment.textContent = originalReviewComment(review.comment);

  const author = document.createElement('div');
  author.className = 'author';
  author.append(createReviewerAvatar(review));
  const authorDetails = document.createElement('div');
  const name = document.createElement('strong');
  name.textContent = review.displayName;
  const date = document.createElement('small');
  date.textContent = formatReviewDate(review.createTime);
  authorDetails.append(name, date);
  author.append(authorDetails);
  card.append(author, rating, comment);

  if (!decorative && !full) {
    const expand = document.createElement('button');
    expand.type = 'button';
    expand.className = 'review-expand';
    expand.textContent = 'Ler comentário completo';
    expand.setAttribute('aria-label', `Ler comentário completo de ${review.displayName}`);
    expand.setAttribute('aria-haspopup', 'dialog');
    expand.hidden = true;
    expand.addEventListener('click', () => openFullReviews(index));
    card.append(expand);
  }
  return card;
};

let loadedGoogleReviews = [];
let reviewsResumeTimer;
let reviewsInView = false;
let reviewsHovered = false;
let reviewsInteracting = false;
let reviewsLayoutFrame;
let reviewsMobileCarousel;

const reviewsCanMove = () => loadedGoogleReviews.length > 1 && reviewsInView &&
  !document.hidden && !reviewsReducedMotion.matches &&
  !reviewsHovered && !reviewsInteracting && !reviewsDialog.open &&
  (!reviewsPanel.contains(document.activeElement) ||
    (reviewsMobile.matches && !document.activeElement.matches(':focus-visible')));

const syncReviewsMotion = () => {
  const moving = reviewsCanMove();
  reviewsList.classList.toggle('is-paused', !moving);
  // Keyboard users can read every original card in a static, unclipped list.
  reviewsList.classList.toggle('reviews-keyboard', reviewsPanel.contains(document.activeElement) &&
    document.activeElement.matches(':focus-visible'));
  if (reviewsMobileCarousel) {
    clearTimeout(reviewsMobileCarousel.timer);
    reviewsMobileCarousel.timer = null;
    if (moving && !reviewsMobileCarousel.animations.length) {
      // Start the reading interval only after the previous card has settled.
      reviewsMobileCarousel.timer = setTimeout(advanceMobileReview, 6000);
    }
  }
};

const pauseReviewsInteraction = () => {
  reviewsInteracting = true;
  clearTimeout(reviewsResumeTimer);
  syncReviewsMotion();
};

const resumeReviewsAfterInteraction = () => {
  clearTimeout(reviewsResumeTimer);
  if (reviewsMobile.matches) {
    reviewsInteracting = false;
    syncReviewsMotion();
    return;
  }
  reviewsResumeTimer = setTimeout(() => {
    reviewsInteracting = false;
    syncReviewsMotion();
  }, 6000);
};

const openFullReviews = (index) => {
  reviewsFull.replaceChildren(...loadedGoogleReviews.map((review, reviewIndex) =>
    createReviewCard(review, reviewIndex, { full: true })));
  reviewsDialog.showModal();
  syncReviewsMotion();
  if (Number.isInteger(index)) {
    reviewsFull.children[index]?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  } else {
    reviewsDialog.scrollTop = 0;
  }
};

const balanceReviewHeights = () => {
  if (reviewsMobile.matches) return;
  let height = reviewsMobile.matches ? 280 : 210;
  reviewsList.querySelectorAll('.quote-card:not([data-review-copy])').forEach((card) => {
    const comment = card.querySelector('.review-comment');
    const style = getComputedStyle(card);
    const lineHeight = parseFloat(getComputedStyle(comment).lineHeight);
    const textHeight = Math.min(comment.scrollHeight, lineHeight * (reviewsMobile.matches ? 7 : 5));
    const authorHeight = card.querySelector('.author').getBoundingClientRect().height;
    height = Math.max(height, Math.ceil(textHeight + authorHeight +
      parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + 42 + 32));
  });
  reviewsList.style.setProperty(reviewsMobile.matches ? '--review-mobile-height' : '--review-card-height', `${height}px`);
};

const measureReviewComments = () => {
  reviewsList.querySelectorAll('.quote-card:not([data-review-copy])').forEach((card) => {
    const comment = card.querySelector('.review-comment');
    const expand = card.querySelector('.review-expand');
    if (expand) expand.hidden = comment.scrollHeight <= comment.clientHeight + 1;
  });
};

const settleMobileReview = (carousel, index) => {
  carousel.index = index % carousel.heights.length;
  carousel.track.style.transform = `translate3d(0, -${carousel.offsets[carousel.index]}px, 0)`;
  reviewsList.style.setProperty('--review-mobile-height', `${carousel.heights[carousel.index]}px`);
};

const advanceMobileReview = () => {
  const carousel = reviewsMobileCarousel;
  if (!carousel || !reviewsCanMove() || carousel.animations.length) return;
  carousel.timer = null;
  const next = carousel.index + 1;
  const timing = { duration: 600, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' };
  carousel.animations = [
    carousel.track.animate([
      { transform: `translate3d(0, -${carousel.offsets[carousel.index]}px, 0)` },
      { transform: `translate3d(0, -${carousel.offsets[next]}px, 0)` }
    ], timing),
    reviewsList.animate([
      { height: `${carousel.heights[carousel.index]}px` },
      { height: `${carousel.heights[next % carousel.heights.length]}px` }
    ], timing)
  ];
  carousel.animations[0].onfinish = () => {
    if (reviewsMobileCarousel !== carousel) return;
    // The final slide is a decorative copy of the first. Restore its identical
    // original position before painting, then give it a full reading interval.
    settleMobileReview(carousel, next);
    carousel.animations.forEach((animation) => {
      animation.onfinish = null;
      animation.cancel();
    });
    carousel.animations = [];
    syncReviewsMotion();
  };
};

const setupMobileReviews = (track, initialIndex) => {
  const heights = Array.from(track.firstElementChild.children,
    (card) => card.getBoundingClientRect().height);
  const offsets = [0];
  heights.forEach((height) => offsets.push(offsets[offsets.length - 1] + height));
  reviewsMobileCarousel = { track, heights, offsets, index: 0, timer: null, animations: [] };
  settleMobileReview(reviewsMobileCarousel, initialIndex);
};

const buildReviewsLayout = () => {
  const mobileIndex = reviewsMobileCarousel?.index || 0;
  if (reviewsMobileCarousel) {
    clearTimeout(reviewsMobileCarousel.timer);
    reviewsMobileCarousel.animations.forEach((animation) => {
      animation.onfinish = null;
      animation.cancel();
    });
    reviewsMobileCarousel = null;
  }
  const isStatic = reviewsReducedMotion.matches ||
    loadedGoogleReviews.length < (reviewsMobile.matches ? 2 : 3);
  reviewsList.replaceChildren();
  reviewsList.classList.toggle('reviews-mobile', reviewsMobile.matches);
  reviewsList.classList.toggle('reviews-static', isStatic);
  reviewsList.id = 'reviews-viewport';
  reviewsList.tabIndex = 0;
  const columns = reviewsMobile.matches ? 1 : Math.min(3, loadedGoogleReviews.length);
  reviewsList.style.setProperty('--review-columns', Math.max(1, columns));

  if (loadedGoogleReviews.length === 0) {
    const status = document.createElement('p');
    status.className = 'reviews-status';
    status.textContent = 'Nenhuma avaliação com comentário disponível.';
    reviewsList.append(status);
  } else {
    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
      const column = document.createElement('div');
      column.className = 'reviews-column';
      const track = document.createElement('div');
      track.className = 'reviews-column-track';
      const group = document.createElement('div');
      group.className = 'reviews-group';
      loadedGoogleReviews.forEach((review, index) => {
        if (index % columns === columnIndex) group.append(createReviewCard(review, index));
      });
      track.append(group);
      column.append(track);
      reviewsList.append(column);
    }

    balanceReviewHeights();
    measureReviewComments();
    if (!isStatic) {
      reviewsList.querySelectorAll('.reviews-column-track').forEach((track) => {
        const group = track.firstElementChild;
        // Fill each half before cloning, including when Google returns only three reviews.
        // Copies are purely visual; every real review remains accessible exactly once.
        let repetitions = 0;
        const columnIndex = Array.from(reviewsList.children).indexOf(track.parentElement);
        while (!reviewsMobile.matches && group.offsetHeight < reviewsList.clientHeight + 40 && repetitions < 8) {
          const index = (columnIndex + group.children.length) % loadedGoogleReviews.length;
          group.append(createReviewCard(loadedGoogleReviews[index], index, { decorative: true }));
          repetitions++;
        }
        const copy = group.cloneNode(true);
        copy.dataset.reviewCopy = '';
        copy.setAttribute('aria-hidden', 'true');
        copy.setAttribute('inert', '');
        copy.querySelectorAll('.quote-card').forEach((card) => { card.dataset.reviewCopy = ''; });
        track.append(copy);
        // Two identical halves make -50% and 0 visually identical at the loop boundary.
        if (reviewsMobile.matches) setupMobileReviews(track, mobileIndex);
        else track.style.setProperty('--review-duration', `${Math.max(48, group.offsetHeight / 18)}s`);
      });
    }
  }
  syncReviewsMotion();
};

const renderGoogleReviews = (data) => {
  const averageRating = Number(data.averageRating);
  const totalReviewCount = Number(data.totalReviewCount);
  const reviews = Array.isArray(data.reviews) ? data.reviews.filter((review) =>
    typeof review.comment === 'string' && originalReviewComment(review.comment)).slice(0, 9) : [];

  if (!Number.isFinite(averageRating) || averageRating < 0 || averageRating > 5 ||
      !Number.isInteger(totalReviewCount) || totalReviewCount < 0) {
    throw new Error('Invalid reviews response');
  }
  const ratingLabel = `${formatRating(averageRating)} de 5 estrelas. ${formatReviewCount(totalReviewCount)}`;
  const averageStars = formatStars(averageRating);
  googleReviewsHero.querySelector('[data-google-rating-stars]').textContent = `${formatRating(averageRating)} ${averageStars}`;
  googleReviewsHero.querySelector('[data-google-reviews-label]').textContent = formatReviewCount(totalReviewCount);
  googleReviewsHero.setAttribute('aria-label', ratingLabel);
  reviewsSummary.querySelector('[data-average-rating]').textContent = formatRating(averageRating);
  reviewsSummary.querySelector('[data-average-stars]').textContent = averageStars;
  reviewsSummary.querySelector('[data-total-reviews]').textContent = formatReviewCount(totalReviewCount);
  reviewsSummary.setAttribute('aria-label', ratingLabel);
  loadedGoogleReviews = reviews;
  reviewsList.classList.remove('reviews-loading');
  reviewsList.setAttribute('aria-busy', 'false');
  buildReviewsLayout();
};

const loadGoogleReviews = async () => {
  if (!googleReviewsHero || !reviewsSummary || !reviewsList) return;
  try {
    const response = await fetch('/api/google-reviews', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Reviews request failed');
    renderGoogleReviews(await response.json());
  } catch {
    reviewsList.classList.remove('reviews-loading');
    reviewsList.setAttribute('aria-busy', 'false');
    const status = document.createElement('p');
    status.className = 'reviews-status';
    status.setAttribute('role', 'status');
    status.textContent = 'Avaliações do Google temporariamente indisponíveis.';
    reviewsList.replaceChildren(status);
  }
};

if (reviewsPanel) {
  const replaceFailedReviewPhoto = (event) => {
    if (event.target.matches('.author img')) {
      event.target.replaceWith(createReviewerFallback(event.target.closest('.author').querySelector('strong').textContent));
    }
  };
  reviewsList.addEventListener('error', replaceFailedReviewPhoto, true);
  reviewsDialog.addEventListener('error', replaceFailedReviewPhoto, true);
  reviewsDialog.addEventListener('close', () => {
    resumeReviewsAfterInteraction();
    syncReviewsMotion();
  });
  reviewsPanel.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse') return;
    reviewsHovered = true; syncReviewsMotion();
  });
  reviewsPanel.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    reviewsHovered = false; syncReviewsMotion();
  });
  reviewsPanel.addEventListener('focusin', syncReviewsMotion);
  reviewsPanel.addEventListener('focusout', () => requestAnimationFrame(syncReviewsMotion));
  document.addEventListener('visibilitychange', syncReviewsMotion);
  const onReviewsMediaChange = () => { if (loadedGoogleReviews.length) buildReviewsLayout(); };
  // addListener supports older Safari installations as well.
  [reviewsMobile, reviewsReducedMotion].forEach((query) => {
    if (query.addEventListener) query.addEventListener('change', onReviewsMediaChange);
    else query.addListener(onReviewsMediaChange);
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      reviewsInView = entry.isIntersecting;
      syncReviewsMotion();
    }, { threshold: 0.1 }).observe(reviewsPanel);
  } else {
    reviewsInView = true;
  }
  if ('ResizeObserver' in window) {
    let lastWidth = 0;
    new ResizeObserver(([entry]) => {
      if (Math.abs(entry.contentRect.width - lastWidth) < 1) return;
      lastWidth = entry.contentRect.width;
      cancelAnimationFrame(reviewsLayoutFrame);
      reviewsLayoutFrame = requestAnimationFrame(() => {
        if (loadedGoogleReviews.length) buildReviewsLayout();
      });
    }).observe(reviewsList);
  }
  document.fonts?.ready.then(() => { if (loadedGoogleReviews.length) buildReviewsLayout(); });

  reviewsList.addEventListener('touchstart', () => {
    if (reviewsMobile.matches) pauseReviewsInteraction();
  }, { passive: true });
  const finishReviewsTouch = (event) => {
    if (reviewsMobile.matches && event.touches.length === 0) resumeReviewsAfterInteraction();
  };
  reviewsList.addEventListener('touchend', finishReviewsTouch, { passive: true });
  reviewsList.addEventListener('touchcancel', finishReviewsTouch, { passive: true });
}

loadGoogleReviews();
