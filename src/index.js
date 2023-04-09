// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import axios from 'axios';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;

form.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', handleLoadMoreClick);

function handleFormSubmit(event) {
  event.preventDefault();
  const searchQuery = event.target.searchQuery.value.trim();
  if (!searchQuery) {
    return;
  }
  page = 1;
  clearGallery();
  fetchImages(searchQuery);
}

function clearGallery() {
  gallery.innerHTML = '';
}
function handleLoadMoreClick() {
  const searchQuery = form.elements.searchQuery.value;
  if (!searchQuery) {
    return;
  }
  page += 1;
  fetchImages(searchQuery);
}

async function fetchImages(searchQuery) {
  const apiKey = '35236732-55b424ac23a8ae37de1125bbb';
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    handleImageFetch(data);
  } catch (error) {
    console.error(error);
  }
}

async function handleImageFetch(data) {
  try {
    if (data.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    const images = data.hits.map((hit) => ({
      webformatURL: hit.webformatURL,
      largeImageURL: hit.largeImageURL,
      tags: hit.tags,
      likes: hit.likes,
      views: hit.views,
      comments: hit.comments,
      downloads: hit.downloads,
    }));

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    addImages(images);

    if (data.totalHits <= page * 40) {
      hideLoadMoreBtn();
    } else {
      showLoadMoreBtn();
    }
  } catch (error) {
    console.error(error);
  }
}

function hideLoadMoreBtn() {
  loadMoreBtn.classList.add('is-hidden');
}

function showLoadMoreBtn() {
  loadMoreBtn.classList.remove('is-hidden');
}

function addImages(images) {
  const imageCards = images.map(
    (image) => `
    <div class="photo-card">
      <a href="${image.largeImageURL}" class="gallery-link">
        <img src="${image.webformatURL}" alt="${image.tags}" class="gallery-img" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    </div>
  `
  );
  gallery.insertAdjacentHTML('beforeend', imageCards.join(''));
  
  const lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}
