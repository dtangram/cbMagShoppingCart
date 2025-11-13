import axios from 'axios';
import errorLog from 'debug';

const API = axios.create({
  // baseURL: 'https://cbShoppingCart.herokuapp.com/',

  // For localhosting on Port 4000 for database
  baseURL: process.env.API_URL || 'http://localhost:4000',
});

API.interceptors.response.use(
  response => (response ? response.data : {}),
  (error) => {
    errorLog(error);
    return error;
  },
);

// for each api request going out
API.interceptors.request.use(async (config) => {
  // pull the token out of local storage
  const token = localStorage.getItem('token');
  // if there is no token do nothing
  if (!token) return config;
  // if there is a token, set a header for any request that contains the token
  return {
    ...config,
    headers: { common: { token } },
  };
});

export default API;
