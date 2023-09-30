import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchImages } from './fetch';

let query = '';
let page = 1;
let perPage = 40;
let simpleLightbox;
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', onFormSearch);

function onFormSearch(event) {
  event.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  query = event.target.searchQuery.value.trim();

  if (query === '') {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }

  fetchImages(query, page, perPage)
    .then(data => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderImage(data.hits);
        simpleLightbox = new SimpleLightbox('.gallery a').refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
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
        <div class="gallery-item" id="${id}">
        <img class="gallery-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${likes}
          </p>
          <p class="info-item">
            <b>Views</b> ${views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${comments}
          </p>
          <p class="info-item"> 
            <b>Downloads</b> ${downloads}
          </p>
        </div>
      </div>
      </a>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function endOfPage() {
  page += 1;
  simpleLightbox.refresh();
  fetchImages(query, page, perPage)
    .then(data => {
      renderImage(data.hits);
      simpleLightbox = new SimpleLightbox('.gallery a').refresh();
      const totalPage = Math.ceil(data.totalHits / perPage);
      if (page > totalPage) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}
function checkPage() {
  return (
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
  );
}
window.addEventListener('scroll', loadMore);

function loadMore() {
  if (checkPage()) {
    endOfPage();
  }
}
arrowTop.onclick = function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.addEventListener('scroll', function () {
  arrowTop.hidden = scrollY < document.documentElement.clientHeight;
});
