import axios from 'axios';
const baseURL = 'https://pixabay.com/api/';
axios.defaults.headers.common['key'] = '39635848-10cc8cbd77891d85da4020fd9';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetch';
import simpleLightbox from 'simplelightbox';
let searchQuery = '';
let page = 1;
let perPage = 40;

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', onFormSearch);

async function onFormSearch(event) {
  event.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  const searchQuery = event.target.searchQuery.value;

  if (searchQuery.trim() === '') {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }

  fetchImages(searchQuery, page, perPage)
    .then(data => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderImage(data.hits);
        let simpleLightbox = new SimpleLightbox('.gallery a').refresh();
        Notiflix.Notify.success('Hooray! We found ${data.totalHits} images.');
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      form.reset();
    });
}

function renderImage(images) {
  if (!gallery) {
    return;
  }
  const markup = images
    .map(image => {
      const {
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `<a class="gallery-link href="${largeImageURL}">
        <div class="photo-card" id="${id}">
        <img class="gallery-img"src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>${likes}
          </p>
          <p class="info-item">
            <b>Views</b>${views}
          </p>
          <p class="info-item">
            <b>Comments</b>${comments}
          </p>
          <p class="info-item">${downloads}
            <b>Downloads</b>
          </p>
        </div>
      </div>
      </a>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  console.log(markup);
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
