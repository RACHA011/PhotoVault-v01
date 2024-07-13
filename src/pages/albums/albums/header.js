import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, AppBar, Toolbar, Typography } from '@mui/material';
import { fetchDeleteDataWithAuth } from 'client/client';

const Header = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');

  const handleDelete = () => {
    const isConfirmed = window.confirm('Are you sure you want to delete the album');
    if (isConfirmed) {
      fetchDeleteDataWithAuth(`/albums/${id}/delete`).then((res) => {
        console.log(res.data);
        window.location.href = '/';
      });
    }
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ backgroundColor: '#3A3A3A' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Photo Gallery
        </Typography>
        <Button
          color="inherit"
          component={Link}
          variant="contained"
          to={`/album/edit?id=${id}`}
          sx={{ mr: 2, backgroundColor: '#2196F3', '&:hover': { backgroundColor: '#1976D2 ' } }}
        >
          Edit Album
        </Button>
        <Button
          color="inherit"
          component={Link}
          variant="contained"
          to={`/album/upload?id=${id}`}
          sx={{ mr: 2, backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' } }}
        >
          Upload Photo
        </Button>
        <Button
          color="inherit"
          variant="contained"
          onClick={handleDelete}
          sx={{ mr: 2, backgroundColor: '#F44336', '&:hover': { backgroundColor: '#D32F2F' } }}
        >
          Delete Album
        </Button>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
