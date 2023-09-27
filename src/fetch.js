import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
import Notiflix from 'notiflix';
const key = '39635848-10cc8cbd77891d85da4020fd9';
axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    Notiflix.Notify.failure("Something went wrong.Try again later.")
    return Promise.reject(error);
  });

async function fetchImages(searchQuery, page, perPage) {
  const response = await axios.get(
    `?key=${key}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page${page}&per_page${perPage}`
   
  );
  return response.data;
}
export { fetchImages };



