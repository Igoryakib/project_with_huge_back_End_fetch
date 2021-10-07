import './sass/main.scss';
import './checkbox.js';
import { error, success } from '@pnotify/core';
import { defaults } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import * as basicLightbox from 'basiclightbox';
import './apiFunctions';
defaults.delay = 5000;
const debounce = require('lodash.debounce');
import * as apiFunctions from './apiFunctions.js';
import cardTemplate from './templates/cardTemplate.hbs';
import infoPageTemplate from './templates/infoPageTemplate.hbs';

const getRefs = {
  btnLoadMore: document.querySelector('.js-load_more'),
  body: document.querySelector('body'),
  cardContainer: document.querySelector('.js-card-container'),
};

const verifyDataLength = array => {
  if (array.results.length > 0) {
    success({ text: 'Знайдено декілька фільмів :)!!' });
    return array;
  }
  if (array.results.length === 0) {
    error({ text: 'На жаль ми нічого не знайшли :(' });
    return;
  }
};

const rendersFilm = markups => {
  const makup = cardTemplate(markups);
  getRefs.cardContainer.insertAdjacentHTML('beforeend', makup);
};

apiFunctions.defaultFetchFilm().then(res => rendersFilm(res));

const input = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

const expand = () => {
  searchBtn.classList.toggle('close');
  input.classList.toggle('square');
};

const element = document.querySelector('.js-card-container');

const inputFn = async event => {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
  setTimeout(() => {
    getRefs.cardContainer.innerHTML = '';
    apiFunctions
      .fetchFilmsFn(event.target.value)
      .then(verifyDataLength)
      .then(rendersFilm)
      .catch(err => {
        console.error(err);
        error({ text: 'На жаль у нас помилка. Спробуйте пізніше :(' });
      });
  }, 1000);
};

searchBtn.addEventListener('click', expand);
input.addEventListener(
  'input',
  debounce(event => {
    inputFn(event);
  }, 650),
);

const loadMoreBtn = async () => {
  await apiFunctions.paginationFetchFilms(document.querySelector('.input').value)
    .then(verifyDataLength)
    .then(rendersFilm)
    .catch(err => {
      console.error(err);
      error({ text: 'На жаль у нас помилка. Спробуйте пізніше :(' });
    });
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
};

let modalBasicLightbox;

const onClickCard = async (event) => {
  if (event.target.nodeName === 'UL') return;
  await apiFunctions.fetchInfoFilm(
      +event.target.firstElementChild.textContent
    )
    .then(res => {
      modalBasicLightbox = basicLightbox.create(infoPageTemplate(res));
      modalBasicLightbox.show();
      const closeModal = document.querySelector('#CloseModal');
      closeModal.addEventListener('click', onclose);
      window.addEventListener('keydown', keyCloseModal);
      document.querySelector('.backDropModal').addEventListener('click', clickOnBackdrop);
      setTimeout(() => {
        document.querySelector('.backDropModal').classList.add('opacityBackdrop')
      }, 200)
    })
    .catch(err => {
      console.error(err);
      error({ text: 'На жаль у нас помилка. Спробуйте пізніше :(' });
    });
  await apiFunctions.fetchTrailerFilm(+event.target.firstElementChild.textContent).then(res => {
    if (res.results.length > 0) {
      return document.querySelector('#infoFilmTrailer').setAttribute('src', `https://www.youtube.com/embed/${res.results[0].key}?autoplay=1`);
    }
    if (res.results.length === 0) {
      error({ text: 'На жалль трейлера до фільму немає :(' });
      return document.querySelector('#infoFilmTrailer').remove();
    }
  });
  window.addEventListener('keydown', keyCloseModal);
};

getRefs.btnLoadMore.addEventListener('click', loadMoreBtn);
getRefs.cardContainer.addEventListener('click', onClickCard);
const onclose = () => {
  modalBasicLightbox.close();
  setTimeout(() => {
    document.querySelector('.backDropModal').classList.remove('opacityBackdrop')
  }, 200)
};

const clickOnBackdrop = (event) => {
  if(event.target === event.currentTarget) {
    return onclose();
  }
};

const keyCloseModal = ev => {
  if (ev.code === 'Escape') {
    onclose();
  }
  window.removeEventListener('keydown', keyCloseModal);
};


const popular = document.querySelector('#popular');
const rate = document.querySelector('#rate');
const lastfilm = document.querySelector('#lastfilm');

const button = document.querySelector('#button');
const filters = document.querySelector('#filters');

let check = false;

const filtersButton = () => {
  if(!filters.classList.contains('switcher_on')) {
    filters.classList.add('switcher_on');
  }
    if (check === true) {
        check = false;
        return filters.classList.replace('switcher_on', 'switcher_off');
    }
    else {
        filters.classList.replace('switcher_off', 'switcher_on');
        check = true;
    }
}

button.addEventListener('click', filtersButton);

popular.addEventListener('click', () => {
  getRefs.cardContainer.innerHTML = '';
  apiFunctions.getPopularFilms().then(res => rendersFilm(res));
  filters.classList.replace('switcher_on', 'switcher_off');
  check = false;
});
rate.addEventListener('click', () => {
  getRefs.cardContainer.innerHTML = '';
  apiFunctions.defaultFetchFilm().then(res => rendersFilm(res));
  filters.classList.replace('switcher_on', 'switcher_off');
  check = false;
});
lastfilm.addEventListener('click', () => {
  getRefs.cardContainer.innerHTML = '';
  apiFunctions.getUpcomingFilms().then(res => rendersFilm(res));
  filters.classList.replace('switcher_on', 'switcher_off');
  check = false;
});