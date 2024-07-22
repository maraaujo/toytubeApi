import axios from "axios";

const Key = '';

const youtubeApi = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
    params: {
        key: Key
    }
});

export default youtubeApi;