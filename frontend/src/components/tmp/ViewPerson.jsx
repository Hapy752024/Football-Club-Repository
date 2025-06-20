import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { Person, Image as ImageIcon } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import axios from 'axios';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ViewPerson = ({ personId, person: initialPerson }) => {
  const [person, setPerson] = useState(initialPerson || null);
  const [loading, setLoading] = useState(!initialPerson);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!initialPerson && personId) {
      fetchPerson();
    }
  }, [personId, initialPerson]);

  const fetchPerson = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`/api/persons/${personId}/`);
      setPerson(response.data);
    } catch (err) {
      console.error('Error fetching person:', err);
      setError('Failed to load person details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading person details...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!person) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">Person not found.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        {/* Header with person info */}
        <Card sx={{ mb: 0 }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Person sx={{ mr: 1, fontSize: 40 }} color="primary" />
              <Typography variant="h3" component="h1">
                {person.name} {person.surname}
              </Typography>
            </Box>
            
            <Typography variant="body1" color="text.secondary">
              Created: {new Date(person.created_at).toLocaleDateString()}
            </Typography>
            
            {person.images && person.images.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <ImageIcon sx={{ mr: 0.5, fontSize: 20 }} color="action" />
                <Typography variant="body2" color="text.secondary">
                  {person.images.length} photo{person.images.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Image Slider */}
        {person.images && person.images.length > 0 ? (
          <Box sx={{ height: '60vh', minHeight: '400px' }}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              style={{ height: '100%' }}
            >
              {person.images.map((image, index) => (
                <SwiperSlide key={image.id || index}>
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'grey.100',
                    }}
                  >
                    <img
                      src={image.image}
                      alt={`${person.name} ${person.surname} - Photo ${index + 1}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        ) : (
          <Box
            sx={{
              height: '40vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.50',
              color: 'text.secondary',
            }}
          >
            <ImageIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h6">No photos available</Typography>
            <Typography variant="body2">
              This person doesn't have any photos yet.
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ViewPerson;