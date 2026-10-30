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
    description: 'Conheça quatro destinos incríveis do litoral sul da Paraíba em um passeio repleto de belas paisagens e praias encantadoras. A experiência começa na Barra de Gramame e segue pela Praia do Amor, Tambaba e Coqueirinho, proporcionando momentos de lazer, contato com a natureza e cenários perfeitos para fotos.',
    inclusions: [
      'Guia turístico credenciado.',
      'Translado de ida e volta.',
      'Busca no local de hospedagem do cliente.'
    ],
    images: ['assets/litoral sul.png', 'assets/praia do amor.jpg', 'assets/litoral sul2.webp', 'assets/gramame.webp']
  },
  'litoral-norte-completo': {
    name: 'Litoral Norte Completo',
    category: 'Litoral',
    location: 'João Pessoa, Paraíba',
    duration: 'Aprox. 7 horas',
    price: 'R$ 200 / pessoa',
    fares: createPassengerFares(200),
    description: 'Explore as belezas do litoral norte da Paraíba em um roteiro completo, repleto de história, paisagens encantadoras e experiências inesquecíveis. Conheça a famosa Areia Vermelha, o Dique de Cabedelo, Ponta de Campina e a Fortaleza de Santa Catarina. Para finalizar, desfrute de um lindo pôr do sol na Praia do Jacaré, ao som do tradicional Bolero de Ravel.',
    inclusions: [
      'Guia turístico credenciado.',
      'Translado de ida e volta.',
      'Busca no local de hospedagem do cliente.'
    ],
    images: ['assets/jacaré.jpeg', 'assets/litoral norte4.jpeg', 'assets/norte5.jpeg', 'assets/norte6.png']
  },
  'piscinas-naturais-seixas': {
    name: 'Piscinas Naturais do Seixas',
    category: 'Piscinas naturais',
    location: 'João Pessoa, Paraíba',
    duration: 'Aprox. 3 horas',
    price: 'R$ 100 / pessoa',
    fares: createPassengerFares(100),
    description: 'Descubra as encantadoras piscinas naturais do Seixas, um dos cenários mais bonitos do litoral paraibano. Durante o passeio de catamarã, você poderá contemplar águas cristalinas, observar a vida marinha e aproveitar momentos de lazer em meio à beleza do mar.',
    inclusions: [
      'Passeio de catamarã.',
      'Acesso ao toboágua.',
      'Experiência nas piscinas naturais.'
    ],
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
    description: 'Viva uma experiência inesquecível explorando as belezas do litoral sul da Paraíba a bordo de um buggy privativo! Conheça praias paradisíacas, falésias, mirantes e paisagens incríveis, com liberdade para aproveitar cada parada e registrar momentos especiais. Um passeio exclusivo, ideal para casais, famílias e grupos que desejam conhecer o litoral de uma maneira diferente e emocionante.',
    inclusions: [
      'Buggy privativo.',
      'Bugueiro experiente.',
      'Roteiro pelas praias e paisagens do litoral sul.',
      'Paradas para fotos e contemplação das paisagens.',
      'Experiência exclusiva para você e seu grupo.'
    ],
    images: ['assets/visual buggy.jpeg', 'assets/p4.jpeg', 'assets/buggy norte.jpeg']
  },
  'piscinas-naturais-picaozinho': {
    name: 'Piscinas Naturais de Picãozinho',
    category: 'Piscinas naturais',
    location: 'João Pessoa, Paraíba',
    duration: null,
    price: null,
    fares: createPassengerFares(100),
    description: 'Conheça as famosas piscinas naturais de Picãozinho, um verdadeiro paraíso localizado próximo à orla de João Pessoa. Aproveite as águas claras, os recifes de corais e a oportunidade de observar peixinhos em um ambiente encantador, ideal para relaxar e viver uma experiência especial no mar.',
    inclusions: [
      'Passeio de embarcação.',
      'Visita às piscinas naturais.',
      'Experiência de contato com a vida marinha, conforme as condições da maré.'
    ],
    images: ['assets/img 1.jpeg', 'assets/img 2.jpeg']
  },
  'city-tour-joao-pessoa': {
    name: 'City Tour João Pessoa',
    category: 'Cultura',
    location: 'João Pessoa, Paraíba',
    duration: 'Meio período',
    price: 'R$ 100 / pessoa',
    fares: createPassengerFares(100),
    description: 'Descubra a história, a cultura e os encantos de João Pessoa em um passeio pelos principais pontos turísticos da capital paraibana. Conheça o famoso Farol do Cabo Branco, admire as belezas do litoral e explore o Centro Histórico, com suas construções antigas e monumentos marcantes. Uma experiência ideal para conhecer melhor a cidade, apreciar suas paisagens e registrar momentos especiais.',
    inclusions: [
      'Guia turístico credenciado.',
      'Translado de ida e volta.',
      'Busca no local de hospedagem do cliente.',
      'Visita aos principais pontos turísticos de João Pessoa.'
    ],
    images: ['assets/city1.jpeg', 'assets/city2.jpg', 'assets/city.jpg', 'assets/city 3.jpeg', 'assets/city 4.jpeg', 'assets/city 5.jpeg', 'assets/city 6.jpeg', 'assets/city 7.jpeg']
  },
  'litoral-sul-2': {
    name: 'Litoral Sul 2',
    category: 'Litoral',
    location: 'Paraíba, Brasil',
    duration: 'Consulte a equipe',
    price: 'R$ 150',
    fares: createPassengerFares(150),
    description: 'Conheça três destinos incríveis do litoral sul da Paraíba em um passeio repleto de paisagens paradisíacas e belezas naturais. O roteiro passa por Carapibus, Tabatinga e Praia Bela, proporcionando momentos de lazer, contato com a natureza e cenários encantadores para aproveitar e registrar fotos inesquecíveis.',
    inclusions: [
      'Guia turístico credenciado.',
      'Translado de ida e volta.',
      'Busca no local de hospedagem do cliente.'
    ],
    images: ['assets/sul 2.webp', 'assets/carapibus.png', 'assets/sul 4.jpg']
  },
  'areia-vermelha': {
    name: 'Areia Vermelha',
    category: 'Piscinas naturais',
    location: 'Cabedelo, Paraíba',
    duration: 'Consulte a equipe',
    price: 'R$ 100',
    fares: createPassengerFares(100),
    description: 'Conheça a famosa Ilha de Areia Vermelha, um banco de areia que surge em meio ao mar durante a maré baixa, formando um cenário paradisíaco de águas mornas e cristalinas. Aproveite para relaxar, contemplar a paisagem e viver uma experiência inesquecível em um dos destinos mais conhecidos do litoral paraibano.',
    inclusions: [
      'Passeio de embarcação.',
      'Travessia até Areia Vermelha.',
      'Tempo para aproveitar o banco de areia, conforme as condições da maré.'
    ],
    images: ['assets/vermelha1.png', 'assets/areia vermelha 1.jpeg', 'assets/areia vermelha 2.jpeg', 'assets/areia vermelha 3.jpeg']
  },
  'cabaceiras-roliude': {
    name: 'Cabaceiras Roliúde Nordestina',
    category: 'Cultura',
    location: 'Cabaceiras, Paraíba',
    duration: 'Consulte a equipe',
    price: 'R$ 300',
    fares: createPassengerFares(300),
    description: 'Conheça Cabaceiras, na Paraíba, famosa como a Roliúde Nordestina por ter sido cenário de grandes produções do cinema brasileiro. Explore a cultura e admire as paisagens marcantes do Cariri paraibano e descubra lugares cheios de história, tradição e beleza. Uma experiência única para conhecer as raízes nordestinas, visitar cenários cinematográficos e registrar momentos inesquecíveis com o Imperador do Turismo!',
    inclusions: [
      'Guia turístico credenciado.',
      'Translado de ida e volta.',
      'Busca no local de hospedagem do cliente.',
      'Visita aos principais atrativos turísticos de Cabaceiras.'
    ],
    images: ['assets/cabaceiras4.jpeg', 'assets/cabaceiras.jpeg', 'assets/cabaceiras2.jpeg', 'assets/cabaceiras3.jpeg', 'assets/roli2.jpg', 'assets/roli3.jpg']
  },
  'recife-olinda': {
    name: 'Recife e Olinda',
    category: 'Interestadual',
    location: 'Pernambuco, Brasil',
    duration: 'Consulte a equipe',
    price: 'R$ 160',
    fares: createPassengerFares(160),
    description: 'Explore a história, a cultura e os encantos de Pernambuco em um passeio por duas cidades cheias de tradição. Em Recife, conheça belas paisagens, monumentos históricos e pontos marcantes da capital pernambucana. Em Olinda, encante-se com as ladeiras históricas, as igrejas seculares, a arquitetura colonial e as vistas incríveis. Uma experiência perfeita para conhecer novos lugares, mergulhar na cultura nordestina e guardar recordações especiais.',
    inclusions: [
      'Guia turístico credenciado.',
      'Translado de ida e volta.',
      'Busca no local de hospedagem do cliente.',
      'Visita aos principais pontos turísticos de Recife e Olinda.'
    ],
    images: ['assets/recife1.jpeg', 'assets/recife2.jpg', 'assets/recife3.jpg']
  },
  'porto-de-galinhas': {
    name: 'Porto de Galinhas',
    category: 'Interestadual',
    location: 'Pernambuco, Brasil',
    duration: 'Consulte a equipe',
    price: 'R$ 160',
    fares: createPassengerFares(160),
    description: 'Conheça Porto de Galinhas, um dos destinos mais encantadores do litoral pernambucano! Desfrute de praias paradisíacas, águas cristalinas e paisagens incríveis, perfeitas para relaxar, tirar fotos e viver momentos inesquecíveis. Aproveite o dia para explorar esse paraíso nordestino e se encantar com suas belezas naturais em uma experiência especial com o Imperador do Turismo.',
    inclusions: [
      'Guia turístico credenciado.',
      'Translado de ida e volta.',
      'Busca no local de hospedagem do cliente.',
      'Visita ao destino Porto de Galinhas.'
    ],
    images: ['assets/porto1.jpg', 'assets/porto2.webp', 'assets/porto3.webp']
  },
  'pipa': {
    name: 'Pipa',
    category: 'Interestadual',
    location: 'Rio Grande do Norte, Brasil',
    duration: 'Consulte a equipe',
    price: 'R$ 160',
    fares: createPassengerFares(160),
    description: 'Descubra as belezas da Praia da Pipa, um dos destinos mais encantadores do litoral potiguar! Admire falésias coloridas, praias paradisíacas e paisagens deslumbrantes que tornam esse lugar tão especial. Aproveite para explorar o charme da região, tirar fotos incríveis e viver momentos inesquecíveis em meio à natureza. Uma experiência perfeita para quem deseja conhecer um dos paraísos mais famosos do Nordeste com o Imperador do Turismo.',
    inclusions: [
      'Guia turístico credenciado.',
      'Translado de ida e volta.',
      'Busca no local de hospedagem do cliente.',
      'Visita aos principais atrativos da região de Pipa.'
    ],
    images: ['assets/pipa1.webp', 'assets/pipa2.avif', 'assets/pipa3.jpeg']
  },
  natal: {
    name: 'Natal',
    category: 'Interestadual',
    location: 'Natal, Rio Grande do Norte',
    duration: 'Dia inteiro',
    price: 'R$ 160 / pessoa',
    fares: createPassengerFares(160),
    description: 'Explore os encantos de Natal, a capital potiguar, conhecida por suas dunas impressionantes, praias paradisíacas e paisagens de tirar o fôlego. Descubra as belezas do litoral, conheça os principais pontos turísticos da região e aproveite momentos especiais em um dos destinos mais famosos do Nordeste. Uma experiência repleta de natureza, cultura e cenários incríveis para registrar recordações inesquecíveis com o Imperador do Turismo!',
    inclusions: [
      'Guia turístico credenciado.',
      'Translado de ida e volta.',
      'Busca no local de hospedagem do cliente.',
      'Visita aos principais atrativos turísticos de Natal.'
    ],
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

const inclusionsList = document.querySelector('#tour-inclusions');
inclusionsList.replaceChildren(...tour.inclusions.map((inclusion) => {
  const item = document.createElement('li');
  const check = document.createElement('span');
  check.className = 'tour-inclusion-check';
  check.setAttribute('aria-hidden', 'true');
  check.textContent = '✓';
  const text = document.createElement('span');
  text.textContent = inclusion;
  item.append(check, text);
  return item;
}));

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
