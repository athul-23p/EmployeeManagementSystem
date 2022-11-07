import axios from 'axios';
import {API_BASE_URL} from '../config/api';

axios.defaults.baseURL = API_BASE_URL;

function login(user) {
  // console.log('BASEURL', API_BASE_URL);
  return axios.post(`/users/login`, user);
}

function updateUser(token, update) {
  console.log('upUser', update);
  let res = axios.put('/users/self', update, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
}

export {login, updateUser};
