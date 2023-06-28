import axios from "axios";
import queryString from "query-string";

// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request- config` for the full list of configs
const axiosClient = axios.create({
  baseURL: "https://outsourcing-api.vps.vn/api/ApiMain",
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (
      response &&
      response?.data &&
      response.data !== "The apikey is wrong!"
    ) {
      return JSON.parse(response.data);
    }

    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);

export default axiosClient;
