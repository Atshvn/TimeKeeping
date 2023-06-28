import axios from 'axios';
import queryString from 'query-string';

// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request- config` for the full list of configs
const TimeKeeping = axios.create({
  baseURL: "https://api-mb.vps.vn/api/MB_Officers/MB_OfficerTimekeeping_CheckIn",
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify(params),
});

TimeKeeping.interceptors.request.use(async (config) => {
  return config;
});

TimeKeeping.interceptors.response.use((response) => {
  if (response && response.data) {
    return response.data.res[0].ReturnMes;
  }

  return response;
}, (error) => {
  // Handle errors
  throw error;
});

export default TimeKeeping;