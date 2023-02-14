import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33518692-16d0d1fee549af403d2d26411';

export default class ImagesApiService {
    constructor() {
        this.searchImg = '';
        this.page = 1;
    }

    async fetchImages() {
        const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchImg}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

        const response = await axios.get(url);
        this.incrementPage();
        return response.data;
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchImg;
    }

    set query(newImg) {
        this.searchImg = newImg;
    }

}