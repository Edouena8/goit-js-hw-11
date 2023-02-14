import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import ImagesApiService from "./new-images";
import LoadMoreBtn from "./load-more-btn";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
}

const loadMoreBtn = new LoadMoreBtn({
  selector:'.load-more',
  hidden: true,
});

const imagesApiService = new ImagesApiService();
const gallery = new SimpleLightbox('.gallery a');

loadMoreBtn.enable();

refs.form.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(evt) {
    evt.preventDefault();

    imagesApiService.query = evt.currentTarget.elements.searchQuery.value;

    loadMoreBtn.show();
    imagesApiService.resetPage();
    clearImagesMarkup();
    fetchImages();
};

async function fetchImages() {
  loadMoreBtn.disable();

  try{
    const data = await imagesApiService.fetchImages();

    if(data.hits.length === 0) throw new Error('No data');

    appendImagesMarkup(data.hits);
    toScroll();
    gallery.refresh();
    loadMoreBtn.enable();
    Notify.success(`Hooray! We found ${data.totalHits} images.`);

  } catch(err) {
    onError(err);
  }
}

async function onLoadMore() {
  loadMoreBtn.disable();
  
  

  const data = await imagesApiService.fetchImages();

  let currentPage = data.hits.length * imagesApiService.page;
 
  if(currentPage > data.totalHits) {
    loadMoreBtn.hide();
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  appendImagesMarkup(data.hits);
  toScroll();
  gallery.refresh();
  loadMoreBtn.enable();
}

function appendImagesMarkup(images) {
  const markup = createImageMarkup(images);
  refs.gallery.insertAdjacentHTML('beforeend', markup);

}

function createImageMarkup(images) {
    return images.map(image => {
        const {webformatURL, largeImageURL, tags, likes, views, comments, downloads} = image;
        return `
        <div class="photo-card">
          <a href="${largeImageURL}" class="gallery__item">
            <img src="${webformatURL}" alt="${tags}" class="gallery__image" loading="lazy" />
          </a>
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                <span class="info-item-text">${likes}</span>
              </p>
              <p class="info-item">
                <b>Views</b>
                <span class="info-item-text">${views}</span>
              </p>
              <p class="info-item">
                <b>Comments</b>
                <span class="info-item-text">${comments}</span>
              </p>
              <p class="info-item">
                <b>Downloads</b>
                <span class="info-item-text">${downloads}</span>
              </p>
            </div>
        </div>`
    }).join('');
}

function clearImagesMarkup() {
    refs.gallery.innerHTML = '';
}

function onError(err) {
  console.log(err);
  Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  loadMoreBtn.hide();
}

function toScroll() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}