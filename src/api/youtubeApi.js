import axios from "axios";

let apiKey = '';

export const setApiKey = (newKey) => {
  apiKey = newKey;
};

const youtubeApi = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
});

youtubeApi.interceptors.request.use(config => {
  config.params = config.params || {};
  config.params.key = apiKey;
  return config;
});

export default youtubeApi;
