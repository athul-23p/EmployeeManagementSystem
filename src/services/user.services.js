import axios from 'axios';
import {API_BASE_URL} from '../config/api';

axios.defaults.baseURL = API_BASE_URL;

// super admin
async function getAllAdminsCount(token) {
  const res = await axios.get('/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data.count;
}

async function getDesignationsCount(token) {
  const res = await axios.get('/designations', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data.count;
}

async function getTechnologiesCount(token) {
  const res = await axios.get('/technologies', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data.count;
}

async function getEmployeesCount(token) {
  const res = await axios.get('/employees', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data.count;
}

async function getRequiusitionsCount(token) {
  const res = await axios.get('/requisitions', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data.count;
}

export {
  getDesignationsCount,
  getEmployeesCount,
  getRequiusitionsCount,
  getTechnologiesCount,
  getAllAdminsCount,
};
