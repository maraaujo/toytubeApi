import axios from "axios";

const Key = 'AIzaSyALZFEUNqUHmMXXybjcbDdYb0m4GsqXnY0';

const youtubeApi = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
    params: {
        key: Key
    }
});

export default youtubeApi;