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

playButton?.addEventListener('click', async () => {
  if (!visualVideo || visualVideo.src) return;

  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  visualVideo.src = isMobile
    ? visualVideo.dataset.mobileSrc
    : visualVideo.dataset.desktopSrc;

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
  if (Number.isNaN(date.getTime())) return 'Avaliação do Google';

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

const createReviewCard = (review, index) => {
  const card = document.createElement('article');
  card.className = `quote-card reveal visible delay-${index + 1}${index === 1 ? ' featured-quote' : ''}`;

  const rating = document.createElement('div');
  rating.className = 'quote-rating';
  rating.setAttribute('aria-label', `${review.starRating} de 5 estrelas`);

  const stars = document.createElement('span');
  stars.setAttribute('aria-hidden', 'true');
  stars.textContent = formatStars(review.starRating);
  rating.append(stars);

  const comment = document.createElement('p');
  comment.textContent = review.comment;

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

  card.append(rating, comment, author);
  return card;
};

const renderGoogleReviews = (data) => {
  const averageRating = Number(data.averageRating);
  const totalReviewCount = Number(data.totalReviewCount);
  const reviews = Array.isArray(data.reviews) ? data.reviews.slice(0, 3) : [];

  if (!Number.isFinite(averageRating) || averageRating <= 0 || !Number.isFinite(totalReviewCount)) {
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

  reviewsList.replaceChildren();
  reviews.forEach((review, index) => reviewsList.append(createReviewCard(review, index)));
  reviewsList.classList.remove('reviews-loading');
  reviewsList.setAttribute('aria-busy', 'false');

  if (reviews.length === 0) {
    const status = document.createElement('span');
    status.className = 'reviews-status';
    status.textContent = 'Nenhuma avaliação com comentário disponível.';
    reviewsList.append(status);
  }
};

const loadGoogleReviews = async () => {
  if (!googleReviewsHero || !reviewsSummary || !reviewsList) return;

  try {
    const response = await fetch('/api/google-reviews', {
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) throw new Error('Reviews request failed');
    renderGoogleReviews(await response.json());
  } catch {
    reviewsList.classList.remove('reviews-loading');
    reviewsList.setAttribute('aria-busy', 'false');
    const status = reviewsList.querySelector('.reviews-status');
    if (status) status.textContent = 'Avaliações do Google temporariamente indisponíveis.';
  }
};

loadGoogleReviews();
