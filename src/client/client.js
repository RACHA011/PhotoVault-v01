import axios from 'axios';

const API_version = '/api/v1';

const fetchGetData = (uri) => {
  const url = `${API_version}${uri}`;
  return axios.get(url).catch((error) => {
    // Handle exceptions/errors
    console.error('Error fetching data for URL:', url, 'Error', error.message);
    // You can throw the error again if you want to handle it elsewhere
    throw error;
  });
};

const fetchPostData = (uri, payload) => {
  const url = `${API_version}${uri}`;
  return axios.post(url, payload).catch((error) => {
    // Handle exceptions/errors
    console.error('Error fetching data for URL:', url, 'Error', error.message);
    // You can throw the error again if you want to handle it elsewhere
    throw error;
  });
};

const fetchPostDataWithAuth = async (uri, payload) => {
  const token = localStorage.getItem('token');
  const url = `${API_version}/auth${uri}`;
  const response = await axios
    .post(url, payload, {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    .catch((error) => {
      // Handle exceptions/errors
      console.error('Error fetching data for URL:', url, 'Error', error.message);
      // You can throw the error again if you want to handle it elsewhere
      throw error;
    });
  return response;
};

const fetchPutDataWithAuth = async (uri, payload) => {
  const token = localStorage.getItem('token');
  const url = `${API_version}/auth${uri}`;
  const response = await axios
    .put(url, payload, {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    .catch((error) => {
      // Handle exceptions/errors
      console.error('Error fetching data for URL:', url, 'Error', error.message);
      // You can throw the error again if you want to handle it elsewhere
      throw error;
    });
  return response;
};
const fetchGetDataWithAuth = async (uri) => {
  const token = localStorage.getItem('token');
  const url = `${API_version}/auth${uri}`;
  try {
    const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
    return response;
  } catch (error) {
    // Handle errors if the request fails
    console.error('Error fetching data:', error);
  }
};
const fetchPostFileUpload = async (uri, formData) => {
  const token = localStorage.getItem('token');
  const url = `${API_version}/auth${uri}`;
  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    // Handle errors if the request fails
    console.error('Error fetching data:', error);
  }
};
const fetchGetDataWithArrayBuffer = async (uri) => {
  const token = localStorage.getItem('token');
  const url = `${API_version}/auth${uri}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'arraybuffer'
    });
    return response;
  } catch (error) {
    // Handle errors if the request fails
    console.error('Error fetching data:', error);
  }
};
const fetchDeleteDataWithAuth = async (uri) => {
  const token = localStorage.getItem('token');
  const url = `${API_version}/auth${uri}`;
  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    // Handle errors if the request fails
    console.error('Error fetching data:', error);
  }
};
const fetchGetBlockDataWithAuth = async (uri) => {
  const token = localStorage.getItem('token');
  const url = `${API_version}/auth${uri}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    // Handle errors if the request fails
    console.error('Error fetching data:', error);
  }
};

export default fetchGetData;
export {
  fetchPostData,
  fetchPostDataWithAuth,
  fetchGetDataWithAuth,
  fetchPostFileUpload,
  fetchGetDataWithArrayBuffer,
  fetchPutDataWithAuth,
  fetchDeleteDataWithAuth,
  fetchGetBlockDataWithAuth
};
