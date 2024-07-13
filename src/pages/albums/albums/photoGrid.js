import { Card, CardContent, CardMedia, Grid, Tooltip, Typography } from '@mui/material';
import { Buffer } from 'buffer';
import { fetchDeleteDataWithAuth, fetchGetBlockDataWithAuth, fetchGetDataWithArrayBuffer, fetchGetDataWithAuth } from 'client/client';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

const userStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalMain: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '10px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: '95%',
    maxWidth: '95%',
    overflow: 'auto'
  },
  closeButton: {
    marginLeft: 'auto'
  }
}));

const PhotoGrid = () => {
  const [photos, setPhotos] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const album_id = queryParams.get('id');
  const [albumInfo, setAlbumInfo] = useState({});
  const classes = userStyles();
  const [open, setOpen] = useState(false);
  const [PhotoContent, setPhotoContent] = useState(null);
  const [PhotoDesc, setPhotoDesc] = useState(null);
  const [DownloadLink, setDownloadLink] = useState(null);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleView = async (download_link, description) => {
    const response = await fetchGetDataWithArrayBuffer(download_link);
    const buffer = Buffer.from(response.data, 'binary').toString('base64');
    setPhotoContent(buffer);
    setPhotoDesc(description);
    setDownloadLink(download_link);
    handleOpen();
  };

  const handleDownload = async (download_link) => {
    fetchGetBlockDataWithAuth(download_link).then((response) => {
      try {
        const disposition = response.headers.get('content-disposition');
        const match = /filename="(.*)"/.exec(disposition);
        const filename = match ? match[1] : 'downloadedFile';
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error('Error downloading photo:', error);
      }
    });
  };
  const handleDelete = (photo_id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete');
    if (isConfirmed) {
      fetchDeleteDataWithAuth(`/albums/${album_id}/photos/${photo_id}/delete`).then((res) => {
        console.log(res.data);
        window.location.reload();
      });
    }
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetchGetDataWithAuth('/albums/' + album_id);
        setAlbumInfo(res.data);
        const photoList = res.data.photos;

        const photoPromises = photoList.map(async (photo) => {
          try {
            let thumbnails = photo.download_link.replace('/download-photo', '/download-thumbnails');
            const response = await fetchGetDataWithArrayBuffer(thumbnails);
            const albumPhotoID = 'album_' + album_id + '_photo' + photo.id;
            const buffer = Buffer.from(response.data, 'binary').toString('base64');
            return {
              album_id: album_id,
              photo_id: photo.id,
              name: photo.name,
              description: photo.description,
              content: buffer,
              id: albumPhotoID,
              download_link: photo.download_link
            };
          } catch (error) {
            console.error(`Error fetching photo ${photo.id}:`, error);
            return null; // Return null in case of error
          }
        });

        const photosData = await Promise.all(photoPromises);
        const validPhotos = photosData.filter((photo) => photo !== null); // Filter out failed fetches
        const photosObject = validPhotos.reduce((acc, photo) => {
          acc[photo.id] = photo;
          return acc;
        }, {});

        setPhotos(photosObject);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, [album_id]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className={classes.modal}
      >
        <div className={classes.modalMain}>
          <img src={'data:image/jpeg;base64,' + PhotoContent} alt={PhotoDesc} style={{ width: '100%', height: 'auto' }} />
          <Button onClick={() => handleDownload(DownloadLink)}>Download Photo</Button>
          <Button onClick={handleClose} className={classes.closeButton}>
            Close
          </Button>
        </div>
      </Modal>

      <Typography variant="h4" gutterBottom>
        {albumInfo.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {albumInfo.description}
      </Typography>
      <Grid container spacing={2}>
        {Object.keys(photos).map((key) => (
          <Grid item key={key} xs={12} sm={6} md={4} lg={3}>
            <Card>
              <Tooltip title={photos[key].description}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`data:image/jpeg;base64,${photos[key].content}`}
                  alt={photos[key].name}
                  style={{ cursor: 'pointer' }}
                />
              </Tooltip>
              <CardContent>
                <Tooltip title={photos[key].description}>
                  <Typography variant="subtitle1">{photos[key].name}</Typography>
                </Tooltip>
                <a href={`#`} onClick={() => handleView(photos[key]['download_link'], photos[key]['description'])}>
                  View
                </a>{' '}
                <a
                  href={`/photo/edit?album_id=${album_id}&photo_id=${photos[key]['photo_id']}&photo_name=${photos[key]['name']}&photo_desc=${photos[key].description}`}
                >
                  Edit
                </a>{' '}
                <a href="#" onClick={() => handleDownload(photos[key]['download_link'])}>
                  Download
                </a>{' '}
                <a href="#" onClick={() => handleDelete(photos[key]['photo_id'])}>
                  Delete
                </a>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default PhotoGrid;
