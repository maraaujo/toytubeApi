import axios from "axios";

const Key = 'AIzaSyCFAIpEKHjpgKXBqCwgLlYLEEyWICSTDG4';

const youtubeApi = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
    params: {
        key: Key
    }
});

export default youtubeApi;
