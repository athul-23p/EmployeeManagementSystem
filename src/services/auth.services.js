import axios from 'axios';
import {API_BASE_URL} from '../config/api';

axios.defaults.baseURL = API_BASE_URL;

function login(user) {
  // console.log('BASEURL', API_BASE_URL);
  return axios.post(`/users/login`, user);
}

function updateUser(token, update) {
  return axios.post('/users/self', update, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export {login, updateUser};
