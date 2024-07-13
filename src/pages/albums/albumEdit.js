import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { fetchGetDataWithAuth, fetchPutDataWithAuth } from 'client/client';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditAlbum = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const album_id = queryParams.get('id');

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token');
    if (!isLoggedIn) {
      navigate('/login');
      window.location.reload();
    }

    const fetchAlbumData = async () => {
      try {
        const res = await fetchGetDataWithAuth('/albums/' + album_id);
        if (res.data) {
          setFormData({
            name: res.data.name || '',
            description: res.data.description || ''
          });
        }
      } catch (error) {
        console.error('Error fetching album data:', error);
      }
    };

    fetchAlbumData();
  }, [album_id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    let isValid = true;
    const newErrors = { name: '', description: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      const payload = {
        name: formData.name,
        description: formData.description
      };

      try {
        await fetchPutDataWithAuth(`/albums/${album_id}/update`, payload);
        navigate('/');
      } catch (error) {
        console.error('Error updating album:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Name"
        variant="outlined"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        error={!!errors.name}
        helperText={errors.name}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Description"
        variant="outlined"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        error={!!errors.description}
        helperText={errors.description}
        multiline
        rows={4}
        margin="normal"
      />

      <Button type="submit" variant="contained" color="primary">
        Edit Album
      </Button>
    </form>
  );
};

export default EditAlbum;
