const WHATSAPP_NUMBER = '5583998048936';

const tours = {
  'litoral-sul-1': {
    name: 'Litoral Sul 1',
    category: 'Litoral',
    location: 'João Pessoa, Paraíba',
    duration: 'Aprox. 7 horas',
    price: 'R$ 150 / pessoa',
    description: 'Um roteiro pelo litoral sul da Paraíba para conhecer praias, falésias e paisagens que fazem parte da experiência de João Pessoa. A programação e os pontos visitados são confirmados pela equipe antes da reserva.',
    images: ['assets/litoral sul.jpg', 'assets/litoral sul1.webp', 'assets/litoral sul2.webp']
  },
  'litoral-norte-completo': {
    name: 'Litoral Norte Completo',
    category: 'Litoral',
    location: 'João Pessoa, Paraíba',
    duration: 'Aprox. 7 horas',
    price: 'R$ 200 / pessoa',
    description: 'Um passeio pelo litoral norte para aproveitar diferentes paisagens costeiras e conhecer pontos do roteiro local. A sequência de visitas e os horários são confirmados antes da reserva.',
    images: ['assets/litoral norte.png', 'assets/litoral norte1.png', 'assets/litoral norte2.png']
  },
  'piscinas-naturais-seixas': {
    name: 'Piscinas Naturais do Seixas',
    category: 'Piscinas naturais',
    location: 'João Pessoa, Paraíba',
    duration: 'Aprox. 3 horas',
    price: 'R$ 100 / pessoa',
    description: 'Uma experiência nas Piscinas Naturais do Seixas, com águas cristalinas e contato próximo com o mar paraibano. A realização depende da maré, das condições climáticas e da operação dos parceiros.',
    images: ['assets/seixas 2.jpg', 'assets/seixas 1.png', 'assets/seixas.png']
  },
  'buggy-litoral-sul': {
    name: 'Buggy Litoral Sul',
    category: 'Aventura',
    location: 'João Pessoa, Paraíba',
    duration: 'Aprox. 7 horas',
    price: 'A partir de R$ 600',
    description: 'Passeio de buggy pelo litoral sul da Paraíba, combinando aventura e paisagens costeiras. O roteiro, os horários e as orientações são confirmados pela equipe antes da reserva.',
    images: ['assets/buggy norte 1.jpg', 'assets/buggy norte 2.jpg', 'assets/buggy norte.jpeg']
  },
  'combo-casal-dupla': {
    name: 'Combo Casal ou Dupla',
    category: 'Experiência exclusiva',
    location: 'João Pessoa, Paraíba',
    duration: 'Dia inteiro',
    price: 'R$ 400 / duas pessoas',
    description: 'Uma experiência de dia inteiro pensada para casal ou dupla conhecer paisagens do litoral paraibano com praticidade. A programação completa é confirmada durante o atendimento.',
    images: ['assets/details/tour-combo.webp', 'assets/details/g-tabatinga.webp', 'assets/details/g-carapibus.webp']
  },
  'city-tour-joao-pessoa': {
    name: 'City Tour João Pessoa',
    category: 'Cultura',
    location: 'João Pessoa, Paraíba',
    duration: 'Meio período',
    price: 'R$ 100 / pessoa',
    description: 'Um roteiro cultural por João Pessoa para conhecer diferentes pontos da cidade e aproveitar melhor o período do passeio. Os locais visitados e os horários são confirmados antes da reserva.',
    images: ['assets/city1.jpeg', 'assets/city2.jpg', 'assets/city.jpg']
  },
  'litoral-sul-2': {
    name: 'Litoral Sul 2',
    category: 'Litoral',
    location: 'Paraíba, Brasil',
    duration: 'Consulte a equipe',
    price: 'R$ 150',
    description: 'Praias tranquilas, falésias, mirantes e o encontro do rio com o mar.',
    images: ['assets/sul 2.webp', 'assets/sul 3.jpg', 'assets/sul 4.jpg']
  },
  'areia-vermelha': {
    name: 'Areia Vermelha',
    category: 'Piscinas naturais',
    location: 'Cabedelo, Paraíba',
    duration: 'Consulte a equipe',
    price: 'R$ 100',
    description: 'Banco de areia com piscinas naturais de águas cristalinas na maré baixa.',
    images: ['assets/vermelha1.png', 'assets/vermelha2.jpg', 'assets/vermelha3.jpg']
  },
  'cabaceiras-roliude': {
    name: 'Cabaceiras Roliúde Nordestina',
    category: 'Cultura',
    location: 'Cabaceiras, Paraíba',
    duration: 'Consulte a equipe',
    price: 'R$ 300',
    description: 'Cenários de cinema, construções históricas e a cultura do Cariri Paraibano.',
    images: ['assets/roli1.webp', 'assets/roli2.jpg', 'assets/roli3.jpg']
  },
  'recife-olinda': {
    name: 'Recife e Olinda',
    category: 'Interestadual',
    location: 'Pernambuco, Brasil',
    duration: 'Consulte a equipe',
    price: 'R$ 160',
    description: 'Duas cidades históricas do Nordeste em um único dia de passeio.',
    images: ['assets/details/c-recife-olinda.webp', 'assets/details/c-recife-olinda-2.webp', 'assets/details/c-recife-olinda-3.webp']
  },
  'porto-de-galinhas': {
    name: 'Porto de Galinhas',
    category: 'Interestadual',
    location: 'Pernambuco, Brasil',
    duration: 'Consulte a equipe',
    price: 'R$ 160',
    description: 'Águas cristalinas, piscinas naturais e praias paradisíacas.',
    images: ['assets/details/c-porto-galinhas.webp', 'assets/details/c-porto-galinhas-2.webp', 'assets/details/c-porto-galinhas-3.webp']
  },
  'pipa': {
    name: 'Pipa',
    category: 'Interestadual',
    location: 'Rio Grande do Norte, Brasil',
    duration: 'Consulte a equipe',
    price: 'R$ 160',
    description: 'Falésias, mirantes e mar azul no Rio Grande do Norte.',
    images: ['assets/details/c-pipa.webp', 'assets/details/c-pipa-2.webp', 'assets/details/c-pipa-3.webp']
  }
};

const requestedSlug = new URLSearchParams(window.location.search).get('tour');
const tour = tours[requestedSlug] || tours['litoral-sul-1'];
const passengerCounts = { adults: 1, children: 0, babies: 0 };

const setText = (selector, text) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
};

document.title = `${tour.name} | Imperador do Turismo`;
setText('#tour-category', tour.category);
setText('#tour-name', tour.name);
setText('#tour-location', tour.location);
setText('#tour-duration', tour.duration);
setText('#tour-price', tour.price);
setText('#booking-tour-price', tour.price);
setText('#tour-description', tour.description);

const mainImage = document.querySelector('#detail-main-image');
const thumbnails = [...document.querySelectorAll('.gallery-thumb')];

const showImage = (index) => {
  mainImage.src = tour.images[index];
  mainImage.alt = `${tour.name}, imagem ${index + 1}`;
  thumbnails.forEach((thumbnail, thumbnailIndex) => {
    thumbnail.classList.toggle('is-active', thumbnailIndex === index);
    thumbnail.setAttribute('aria-pressed', String(thumbnailIndex === index));
  });
};

tour.images.forEach((image, index) => {
  const thumbnail = document.querySelector(`#detail-thumb-${index}`);
  thumbnail.src = image;
  thumbnail.alt = `${tour.name}, miniatura ${index + 1}`;
});

thumbnails.forEach((thumbnail) => {
  thumbnail.addEventListener('click', () => showImage(Number(thumbnail.dataset.imageIndex)));
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

document.querySelectorAll('[data-action][data-passenger]').forEach((button) => {
  button.addEventListener('click', () => {
    const passenger = button.dataset.passenger;
    const minimum = passenger === 'adults' ? 1 : 0;
    const change = button.dataset.action === 'increment' ? 1 : -1;
    passengerCounts[passenger] = Math.max(minimum, passengerCounts[passenger] + change);
    updatePassengerCount(passenger);
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
  const message = `Olá! Encontrei o Imperador do Turismo pelo site e gostaria de consultar disponibilidade para o passeio ${tour.name}. Data escolhida: ${formattedDate}. Passageiros: ${passengerCounts.adults} adulto(s), ${passengerCounts.children} criança(s) e ${passengerCounts.babies} bebê(s).`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});
