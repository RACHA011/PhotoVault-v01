import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { fetchPutDataWithAuth } from 'client/client';
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditPhoto = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const album_id = queryParams.get('album_id');
  const photo_id = queryParams.get('photo_id');
  const photo_name = queryParams.get('photo_name');
  let photo_desc = queryParams.get('photo_desc');
  const photoDescRef = useRef(photo_desc);

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
    if (photoDescRef.current === 'null') {
      photoDescRef.current = ''; // if photo description is null
    }
    const fetchAlbumData = async () => {
      setFormData({
        name: photo_name || '',
        description: photoDescRef.current || ''
      });
    };

    fetchAlbumData();
  }, [navigate, photo_name, photo_desc]);

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
        await fetchPutDataWithAuth(`/albums/${album_id}/photos/${photo_id}/update`, payload);
        navigate(`/album/show?id=${album_id}`);
      } catch (error) {
        console.error('Error updating photo:', error);
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
        Edit Photo
      </Button>
    </form>
  );
};

export default EditPhoto;
