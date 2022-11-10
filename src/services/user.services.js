import axios from 'axios';
import {API_BASE_URL} from '../config/api';

axios.defaults.baseURL = API_BASE_URL;

// super admin
async function getAllAdmins(token, page = 1, search, limit = 15) {
  const res = await axios.get(`/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      limit,
      search,
    },
  });
  return res.data;
}

async function addAdmin(token, data) {
  const res = await axios.post('/users', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

async function updateAdminById(token, id, update) {
  // console.log(update, id);
  const res = await axios.put(`/users/${id}`, update, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

async function deleteAdminById(token, id) {
  // console.log('dABId', id, token);
  const res = await axios.delete(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

async function getAllAdminsCount(token) {
  const res = await axios.get('/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data.count;
}

// Tehcnologies
async function getTechnologiesCount(token) {
  const res = await axios.get('/technologies', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data.count;
}

async function getTechnologies(token, page = 0, name, limit = 10) {
  const res = await axios.get('/technologies', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      name,
      limit,
    },
  });

  return res.data;
}

async function addTechnology(token, data) {
  const res = await axios.post('/technologies', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

async function getTechnologyById(token, id) {
  const res = await axios.get(`/technologies/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

async function updateTechnologyById(token, id, data) {
  const res = await axios.patch(`/technologies/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

async function deleteTechnologyById(token, id) {
  const res = await axios.delete(`/technologies/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

async function getEmployees(
  token,
  all,
  page = 1,
  search,
  designation,
  technologies,
  limit = 10,
) {
  const res = await axios.get(`/employees`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      all,
      page,
      search,
      designation,
      technologies,
      limit,
    },
  });
  console.log('get employees', res.data);
  return res.data;
}

async function getEmployeesById(token, id) {
  const res = await axios.get(`/employees/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

async function addEmployee(token, data) {
  console.log(data);
  const res = await axios.post(`/employees`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

async function updateEmployeesById(token, id, data) {
  console.log(data);
  const res = await axios.patch(`/employees/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

async function uploadEmployeeCV(token, id, formData) {
  console.log('formData', formData);
  const res = await axios.post(`/employees/cv/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/form-data`,
    },
  });
  return res.data;
}

async function downloadEmployeeCV(token,id){
  const res = await axios.get(`/employees/cv/${id}`,{
    headers:{
      Authorization:`Bearer ${token}`
    }
  });

  return res.data;
}
async function deleteEmployeesById(token, id) {
  const res = await axios.delete(`/employees/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

async function getEmployeesCount(token) {
  const res = await axios.get('/employees', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data.count;
}

async function addRequisition(token, data) {
  console.log('sr', data);
  const res = await axios.post('/requisitions', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

async function getRequisitions(token, page = 1, search, limit = 10) {
  const res = await axios.get('/requisitions', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      search,
      limit,
    },
  });
  return res.data;
}

async function getRequisitionById(token, id) {
  const res = await axios.get(`/requisitions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

async function updateRequisitionById(token, id, data) {
  const res = await axios.put(`/requisitions/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

async function deleteRequisitionById(token, id) {
  const res = await axios.delete(`/requisitions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

async function getRequisitionsCount(token) {
  const res = await axios.get('/requisitions', {
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
  return res.data;
}

async function addDesignation(token, data) {
  const res = await axios.post('/designations', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

async function updateDesignationById(token, id, update) {
  const res = await axios.patch(`/designations/${id}`, update, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

async function deleteDesignationById(token, id) {
  const res = await axios.delete(`/designations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export {
  getDesignationsCount,
  getDesignations,
  addDesignation,
  updateDesignationById,
  deleteDesignationById,
  getEmployees,
  getEmployeesById,
  addEmployee,
  uploadEmployeeCV,
  updateEmployeesById,
  deleteEmployeesById,
  getEmployeesCount,
  addRequisition,
  getRequisitions,
  getRequisitionById,
  updateRequisitionById,
  deleteRequisitionById,
  getRequisitionsCount,
  getTechnologiesCount,
  getTechnologies,
  getTechnologyById,
  updateTechnologyById,
  deleteTechnologyById,
  addTechnology,
  getAllAdmins,
  addAdmin,
  updateAdminById,
  deleteAdminById,
  getAllAdminsCount,
};
