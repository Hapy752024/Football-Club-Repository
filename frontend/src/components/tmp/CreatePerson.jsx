import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Person, Save } from '@mui/icons-material';
import axios from 'axios';
import ImageUpload from './ImageUpload';

const CreatePerson = ({ onPersonCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagesChange = (newImages) => {
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.surname.trim()) {
      setError('Name and surname are required.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('surname', formData.surname.trim());
      
      // Add images to FormData
      images.forEach((image, index) => {
        submitData.append('uploaded_images', image);
      });

      const response = await axios.post('/api/persons/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Person created successfully!');
      
      // Reset form
      setFormData({ name: '', surname: '' });
      setImages([]);
      
      // Notify parent component
      if (onPersonCreated) {
        onPersonCreated(response.data);
      }

    } catch (err) {
      console.error('Error creating person:', err);
      if (err.response?.data) {
        const errorMessages = Object.values(err.response.data).flat().join(' ');
        setError(errorMessages || 'Failed to create person.');
      } else {
        setError('Failed to create person. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Person sx={{ mr: 1, fontSize: 32 }} color="primary" />
          <Typography variant="h4" component="h1">
            Create New Person
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              margin="normal"
              variant="outlined"
            />
            
            <TextField
              fullWidth
              label="Surname"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              required
              margin="normal"
              variant="outlined"
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Photos (Optional)
            </Typography>
            <ImageUpload
              existingImages={[]}
              onImagesChange={handleImagesChange}
              maxImages={5}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            {onCancel && (
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
            
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            >
              {loading ? 'Creating...' : 'Create Person'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreatePerson;