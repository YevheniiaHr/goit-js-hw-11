import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';

const key = '39635848-10cc8cbd77891d85da4020fd9';

async function fetchImages(query, page, perPage) {
  const response = await axios.get(
    `?key=${key}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response.data;
}
export { fetchImages };
