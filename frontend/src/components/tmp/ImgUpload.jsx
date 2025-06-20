import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Grid,
  Card,
  CardMedia,
  CardActions,
  Alert,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Image as ImageIcon,
} from '@mui/icons-material';

const ImageUpload = ({ 
  existingImages = [], 
  onImagesChange, 
  onDeleteImage, 
  maxImages = 5 
}) => {
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    setError('');
    
    const totalImages = existingImages.length + newImages.length + acceptedFiles.length;
    
    if (totalImages > maxImages) {
      setError(`Maximum ${maxImages} images allowed. You can upload ${maxImages - existingImages.length - newImages.length} more.`);
      return;
    }

    const validFiles = acceptedFiles.filter(file => {
      const isValid = file.type.startsWith('image/');
      if (!isValid) {
        setError('Please upload only image files.');
      }
      return isValid;
    });

    if (validFiles.length > 0) {
      const imageObjects = validFiles.map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        preview: URL.createObjectURL(file)
      }));

      const updatedImages = [...newImages, ...imageObjects];
      setNewImages(updatedImages);
      onImagesChange(updatedImages.map(img => img.file));
    }
  }, [existingImages.length, newImages.length, maxImages, onImagesChange, newImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: true
  });

  const handleDeleteNew = (imageId) => {
    const updatedImages = newImages.filter(img => img.id !== imageId);
    setNewImages(updatedImages);
    onImagesChange(updatedImages.map(img => img.file));
    setError('');
  };

  const handleDeleteExisting = (imageId) => {
    onDeleteImage(imageId);
    setError('');
  };

  const canUploadMore = existingImages.length + newImages.length < maxImages;

  return (
    <Box>
      {/* Drag and Drop Area */}
      {canUploadMore && (
        <Paper
          {...getRootProps()}
          sx={{
            p: 3,
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
            cursor: 'pointer',
            textAlign: 'center',
            mb: 2,
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to select files (max {maxImages} images)
          </Typography>
        </Paper>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Image Thumbnails */}
      {(existingImages.length > 0 || newImages.length > 0) && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <ImageIcon sx={{ mr: 1 }} />
            Images ({existingImages.length + newImages.length}/{maxImages})
          </Typography>
          
          <Grid container spacing={2}>
            {/* Existing Images */}
            {existingImages.map((image) => (
              <Grid item xs={6} sm={4} md={2.4} key={image.id}>
                <Card sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={image.image}
                    alt="Person image"
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardActions sx={{ position: 'absolute', top: 0, right: 0, p: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteExisting(image.id)}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                      }}
                    >
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}

            {/* New Images */}
            {newImages.map((image) => (
              <Grid item xs={6} sm={4} md={2.4} key={image.id}>
                <Card sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={image.preview}
                    alt="New image"
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardActions sx={{ position: 'absolute', top: 0, right: 0, p: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteNew(image.id)}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                      }}
                    >
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;