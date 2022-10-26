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
// get list of designations
/**
 * limit : per_page_limit
 * page : offset
 *
 */
async function getDesignations(token, page = 0, name, limit = 15) {
  const res = await axios.get('/designations', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      name,
      limit,
      page,
    },
  });
  return res.data.data;
}

async function addDesignation(token, name) {
  const res = await axios.post(
    '/designations',
    {name},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data.data;
}

async function updateDesignationById(token, id, update) {
  const res = await axios.patch(`/designations/${id}`, update, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
}

async function deleteDesignationById(token, id) {
  const res = await axios.delete(`/designations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
}

export {
  getDesignationsCount,
  getDesignations,
  addDesignation,
  updateDesignationById,
  deleteDesignationById,
  getEmployeesCount,
  getRequiusitionsCount,
  getTechnologiesCount,
  getAllAdminsCount,
};
