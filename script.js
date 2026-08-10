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

window.addEventListener('scroll', () => {
  navbar.classList.toggle('is-scrolled', window.scrollY > 650);
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

document.querySelector('.play-button')?.addEventListener('click', (event) => {
  event.preventDefault();
  document.querySelector('#passeios')?.scrollIntoView({ behavior: 'smooth' });
});
