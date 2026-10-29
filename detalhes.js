const WHATSAPP_NUMBER = '5583998048936';
const createPassengerFares = (adultPrice) => Object.freeze({
  adults: adultPrice,
  children: adultPrice * 0.5,
  babies: 0
});

const tours = {
  'litoral-sul-1': {
    name: 'Litoral Sul 1',
    category: 'Litoral',
    location: 'João Pessoa, Paraíba',
    duration: 'Aprox. 7 horas',
    price: 'R$ 150 / pessoa',
    fares: createPassengerFares(150),
    description: 'Um roteiro pelo litoral sul da Paraíba para conhecer praias, falésias e paisagens que fazem parte da experiência de João Pessoa. A programação e os pontos visitados são confirmados pela equipe antes da reserva.',
    images: ['assets/litoral sul.png', 'assets/praia do amor.jpg', 'assets/litoral sul2.webp', 'assets/gramame.webp']
  },
  'litoral-norte-completo': {
    name: 'Litoral Norte Completo',
    category: 'Litoral',
    location: 'João Pessoa, Paraíba',
    duration: 'Aprox. 7 horas',
    price: 'R$ 200 / pessoa',
    fares: createPassengerFares(200),
    description: 'Um passeio pelo litoral norte para aproveitar diferentes paisagens costeiras e conhecer pontos do roteiro local. A sequência de visitas e os horários são confirmados antes da reserva.',
    images: ['assets/img fortaleza.jpeg', 'assets/litoral norte4.jpeg', 'assets/jacaré.jpeg', 'assets/norte5.jpeg', 'assets/norte6.png']
  },
  'piscinas-naturais-seixas': {
    name: 'Piscinas Naturais do Seixas',
    category: 'Piscinas naturais',
    location: 'João Pessoa, Paraíba',
    duration: 'Aprox. 3 horas',
    price: 'R$ 100 / pessoa',
    fares: createPassengerFares(100),
    description: 'Uma experiência nas Piscinas Naturais do Seixas, com águas cristalinas e contato próximo com o mar paraibano. A realização depende da maré, das condições climáticas e da operação dos parceiros.',
    images: ['assets/seixas 2.jpg', 'assets/seixas 1.png', 'assets/seixas.png', 'assets/seixas 5.jpeg', 'assets/seixas 6.jpeg']
  },
  'buggy-litoral-sul': {
    name: 'Passeio de Buggy',
    category: 'Aventura',
    location: 'João Pessoa, Paraíba',
    duration: 'Aprox. 7 horas',
    price: 'R$ 650 / buggy',
    fixedPrice: 650,
    capacity: 4,
    description: 'Passeio de buggy pelo litoral sul da Paraíba, combinando aventura e paisagens costeiras. O roteiro, os horários e as orientações são confirmados pela equipe antes da reserva.',
    images: ['assets/visual buggy.jpeg', 'assets/buggy norte 2.jpg', 'assets/buggy norte.jpeg']
  },
  'piscinas-naturais-picaozinho': {
    name: 'Piscinas Naturais de Picãozinho',
    category: 'Piscinas naturais',
    location: 'João Pessoa, Paraíba',
    duration: null,
    price: null,
    fares: createPassengerFares(100),
    description: 'Conheça as Piscinas Naturais de Picãozinho em uma experiência no litoral de João Pessoa. A disponibilidade, o roteiro, os horários e as orientações são confirmados pela equipe durante o atendimento.',
    images: ['assets/img 1.jpeg', 'assets/img 2.jpeg']
  },
  'city-tour-joao-pessoa': {
    name: 'City Tour João Pessoa',
    category: 'Cultura',
    location: 'João Pessoa, Paraíba',
    duration: 'Meio período',
    price: 'R$ 100 / pessoa',
    fares: createPassengerFares(100),
    description: 'Um roteiro cultural por João Pessoa para conhecer diferentes pontos da cidade e aproveitar melhor o período do passeio. Os locais visitados e os horários são confirmados antes da reserva.',
    images: ['assets/city1.jpeg', 'assets/city2.jpg', 'assets/city.jpg', 'assets/city 3.jpeg', 'assets/city 4.jpeg', 'assets/city 5.jpeg', 'assets/city 6.jpeg', 'assets/city 7.jpeg']
  },
  'litoral-sul-2': {
    name: 'Litoral Sul 2',
    category: 'Litoral',
    location: 'Paraíba, Brasil',
    duration: 'Consulte a equipe',
    price: 'R$ 150',
    fares: createPassengerFares(150),
    description: 'Praias tranquilas, falésias, mirantes e o encontro do rio com o mar.',
    images: ['assets/sul 2.webp', 'assets/carapibus.png', 'assets/sul 4.jpg']
  },
  'areia-vermelha': {
    name: 'Areia Vermelha',
    category: 'Piscinas naturais',
    location: 'Cabedelo, Paraíba',
    duration: 'Consulte a equipe',
    price: 'R$ 100',
    fares: createPassengerFares(100),
    description: 'Banco de areia com piscinas naturais de águas cristalinas na maré baixa.',
    images: ['assets/vermelha1.png', 'assets/areia vermelha 1.jpeg', 'assets/areia vermelha 2.jpeg', 'assets/areia vermelha 3.jpeg']
  },
  'cabaceiras-roliude': {
    name: 'Cabaceiras Roliúde Nordestina',
    category: 'Cultura',
    location: 'Cabaceiras, Paraíba',
    duration: 'Consulte a equipe',
    price: 'R$ 300',
    fares: createPassengerFares(300),
    description: 'Cenários de cinema, construções históricas e a cultura do Cariri Paraibano.',
    images: ['assets/cabaceiras4.jpeg', 'assets/cabaceiras.jpeg', 'assets/cabaceiras2.jpeg', 'assets/cabaceiras3.jpeg', 'assets/roli2.jpg', 'assets/roli3.jpg']
  },
  'recife-olinda': {
    name: 'Recife e Olinda',
    category: 'Interestadual',
    location: 'Pernambuco, Brasil',
    duration: 'Consulte a equipe',
    price: 'R$ 160',
    fares: createPassengerFares(160),
    description: 'Duas cidades históricas do Nordeste em um único dia de passeio.',
    images: ['assets/recife1.jpeg', 'assets/recife2.jpg', 'assets/recife3.jpg']
  },
  'porto-de-galinhas': {
    name: 'Porto de Galinhas',
    category: 'Interestadual',
    location: 'Pernambuco, Brasil',
    duration: 'Consulte a equipe',
    price: 'R$ 160',
    fares: createPassengerFares(160),
    description: 'Águas cristalinas, piscinas naturais e praias paradisíacas.',
    images: ['assets/porto1.jpg', 'assets/porto2.webp', 'assets/porto3.webp']
  },
  'pipa': {
    name: 'Pipa',
    category: 'Interestadual',
    location: 'Rio Grande do Norte, Brasil',
    duration: 'Consulte a equipe',
    price: 'R$ 160',
    fares: createPassengerFares(160),
    description: 'Falésias, mirantes e mar azul no Rio Grande do Norte.',
    images: ['assets/pipa1.webp', 'assets/pipa2.avif', 'assets/pipa3.jpeg']
  },
  natal: {
    name: 'Natal',
    category: 'Interestadual',
    location: 'Natal, Rio Grande do Norte',
    duration: 'Dia inteiro',
    price: 'R$ 160 / pessoa',
    fares: createPassengerFares(160),
    description: 'Conheça alguns dos principais cenários e atrações da capital potiguar.',
    images: ['assets/natal.jpg', 'assets/natal2.png', 'assets/natal3.jpg']
  }
};

const requestedSlug = new URLSearchParams(window.location.search).get('tour');
const tour = tours[requestedSlug] || tours['litoral-sul-1'];
const passengerCounts = { adults: 1, children: 0, babies: 0 };
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2
});
const fareFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0
});

const setText = (selector, text) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
};

document.title = `${tour.name} | Imperador do Turismo`;
setText('#tour-category', tour.category);
setText('#tour-name', tour.name);
setText('#tour-description', tour.description);

const bookingShortcut = document.querySelector('.booking-shortcut');
const bookingPanel = document.querySelector('#booking-panel');

bookingShortcut.addEventListener('click', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  bookingPanel.scrollIntoView({
    behavior: prefersReducedMotion ? 'instant' : 'smooth',
    block: 'start'
  });
});

const factValues = [
  ['#tour-location', tour.location],
  ['#tour-duration', tour.duration],
  ['#tour-price', tour.price]
];

const visibleFacts = factValues.flatMap(([selector, value]) => {
  const element = document.querySelector(selector);
  const fact = element.closest('.tour-fact');
  fact.hidden = !value;
  if (!value) return [];
  element.textContent = value;
  return fact;
});

const tourFacts = document.querySelector('.tour-facts');
tourFacts.style.gridTemplateColumns = `repeat(${visibleFacts.length}, minmax(0, 1fr))`;
visibleFacts.at(-1)?.classList.add('is-last-visible');

const hasFixedPrice = Number.isFinite(tour.fixedPrice);
const hasConfirmedFares = Boolean(tour.fares);

if (hasFixedPrice) {
  document.querySelector('.passenger-fieldset').remove();
  document.querySelector('.booking-panel').classList.add('is-fixed-price');
  document.querySelector('#booking-price-note').hidden = false;
  setText('.how-it-works > p:not(.eyebrow)', 'Escolha a data e confirme pelo WhatsApp. Nossa equipe verificará a disponibilidade e receberá a quantidade de participantes antes da reserva.');
  setText('.how-it-works li:nth-child(2) strong', 'Informe os participantes pelo WhatsApp');
  setText('.how-it-works li:nth-child(2) p', `O valor é fixo por buggy, com capacidade para até ${tour.capacity} passageiros. Informe à equipe quantas pessoas participarão.`);
}

if (hasConfirmedFares) {
  setText('#adults-description', `12 anos ou mais • ${fareFormatter.format(tour.fares.adults)} por pessoa`);
  setText('#children-description', `6 a 11 anos • ${fareFormatter.format(tour.fares.children)} por pessoa`);
  setText('#babies-description', '0 a 5 anos • Grátis');
} else {
  setText('#adults-description', '12 anos ou mais');
  setText('#children-description', '6 a 11 anos');
  setText('#babies-description', '0 a 5 anos');
}

const mainImage = document.querySelector('#detail-main-image');
const thumbnails = [...document.querySelectorAll('.gallery-thumb')];
const thumbnailsGrid = document.querySelector('.gallery-thumbnails');

const showImage = (index) => {
  mainImage.src = tour.images[index];
  mainImage.alt = `${tour.name}, imagem ${index + 1}`;
  thumbnails.forEach((thumbnail, thumbnailIndex) => {
    thumbnail.classList.toggle('is-active', thumbnailIndex === index);
    thumbnail.setAttribute('aria-pressed', String(thumbnailIndex === index));
  });
};

thumbnailsGrid.style.setProperty('--gallery-columns', tour.images.length);
thumbnailsGrid.classList.toggle('has-more-images', tour.images.length > 4);

thumbnails.forEach((thumbnailButton, index) => {
  const image = tour.images[index];
  thumbnailButton.hidden = !image;
  if (!image) return;

  const thumbnail = thumbnailButton.querySelector('img');
  thumbnail.src = image;
  thumbnail.alt = `${tour.name}, miniatura ${index + 1}`;
});

thumbnails.forEach((thumbnail) => {
  thumbnail.addEventListener('click', () => {
    const imageIndex = Number(thumbnail.dataset.imageIndex);
    if (tour.images[imageIndex]) showImage(imageIndex);
  });
});

showImage(0);

const dateInput = document.querySelector('#tour-date');
const now = new Date();
const minimumDate = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0')
].join('-');
dateInput.min = minimumDate;

const updatePassengerCount = (passenger) => {
  document.querySelector(`#${passenger}-count`).textContent = passengerCounts[passenger];
};

const getTotalPassengers = () =>
  passengerCounts.adults + passengerCounts.children + passengerCounts.babies;

const getTotalPrice = () => hasFixedPrice ? tour.fixedPrice : hasConfirmedFares
  ? Object.entries(passengerCounts).reduce(
      (total, [passenger, count]) => total + (count * tour.fares[passenger]),
      0
    )
  : null;

const updateBookingSummary = () => {
  setText('#booking-total-passengers', hasFixedPrice
    ? `Capacidade: até ${tour.capacity} passageiros`
    : `Total de passageiros: ${getTotalPassengers()}`);
  const bookingPrice = document.querySelector('#booking-tour-price');
  bookingPrice.hidden = !hasFixedPrice && !hasConfirmedFares;
  if (!bookingPrice.hidden) bookingPrice.textContent = currencyFormatter.format(getTotalPrice());
};

updateBookingSummary();

document.querySelectorAll('[data-action][data-passenger]').forEach((button) => {
  button.addEventListener('click', () => {
    const passenger = button.dataset.passenger;
    const minimum = passenger === 'adults' ? 1 : 0;
    const change = button.dataset.action === 'increment' ? 1 : -1;
    passengerCounts[passenger] = Math.max(minimum, passengerCounts[passenger] + change);
    updatePassengerCount(passenger);
    updateBookingSummary();
  });
});

dateInput.addEventListener('input', () => {
  document.querySelector('#booking-error').hidden = true;
});

document.querySelector('#booking-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const error = document.querySelector('#booking-error');
  if (!dateInput.value) {
    error.hidden = false;
    dateInput.focus();
    return;
  }

  error.hidden = true;
  const selectedDate = new Date(`${dateInput.value}T12:00:00`);
  const formattedDate = new Intl.DateTimeFormat('pt-BR').format(selectedDate);
  const totalPriceLine = hasConfirmedFares
    ? `\n\nValor total: ${currencyFormatter.format(getTotalPrice())}`
    : '';
  const message = hasFixedPrice
    ? `Olá! Gostaria de consultar a disponibilidade para o ${tour.name}.

Data desejada: ${formattedDate}

Valor: ${currencyFormatter.format(tour.fixedPrice).replace(/\u00a0/g, ' ')} por buggy

Capacidade: até ${tour.capacity} pessoas

Gostaria de confirmar a disponibilidade e informar a quantidade de participantes.`
    : `Olá! Encontrei o Imperador do Turismo pelo site e gostaria de consultar disponibilidade para o passeio ${tour.name}.

Data desejada: ${formattedDate}

Adultos: ${passengerCounts.adults}
Crianças (6 a 11 anos): ${passengerCounts.children}
Bebês (0 a 5 anos): ${passengerCounts.babies}
Total de passageiros: ${getTotalPassengers()}${totalPriceLine}

Poderia confirmar a disponibilidade e me passar mais informações?`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});
