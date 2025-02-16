import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, TextField, Typography, Container, Box, Card, CardContent,
  Grid, IconButton, Divider, Fab
} from '@mui/material';
import { Delete as DeleteIcon, CheckCircle as CheckCircleIcon, Add as AddIcon } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

function App() {
  const [chores, setChores] = useState([]);
  const [completedChores, setCompletedChores] = useState([]);
  const [newChore, setNewChore] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/chores')
      .then((response) => {
        const incompleteChores = response.data.filter(chore => !chore.completed);
        const completedChores = response.data.filter(chore => chore.completed);
        setChores(incompleteChores);
        setCompletedChores(completedChores);
      })
      .catch((error) => {
        console.error('There was an error fetching the chores!', error);
      });
  }, []);

  const handleAddChore = () => {
    if (newChore.trim() === '') return;

    const choreToAdd = { name: newChore, completed: false };

    axios.post('http://localhost:5001/chores', choreToAdd)
      .then((response) => {
        setChores([response.data, ...chores]);
        setNewChore('');
      })
      .catch((error) => {
        console.error('Error adding new chore!', error);
      });
  };

  const handleCompleteChore = (id) => {
    axios.put(`http://localhost:5001/chores/${id}`, { completed: true })
      .then((response) => {
        const updatedChores = chores.filter(chore => chore.id !== id);
        const completedChore = chores.find(chore => chore.id === id);
        completedChore.completed = true;
        completedChore.completedAt = response.data.completedAt;

        setChores(updatedChores);
        setCompletedChores([completedChore, ...completedChores]);
      })
      .catch((error) => {
        console.error('Error marking chore as completed!', error);
      });
  };

  const handleDeleteChore = (id) => {
    axios.delete(`http://localhost:5001/chores/${id}`)
      .then(() => {
        setChores(chores.filter(chore => chore.id !== id));
        setCompletedChores(completedChores.filter(chore => chore.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting chore!', error);
      });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Format it to a readable string like "2/16/2025, 10:45:30 AM"
  };

  return (
    <Container maxWidth="sm" sx={{
      mt: 0,
      backgroundColor: 'white',
      padding: 3,
      borderRadius: 5,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Typography variant="h4" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
        Chores Tracker
      </Typography>

      {/* Add Chore Input */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        <TextField
          label="New Chore"
          variant="outlined"
          fullWidth
          value={newChore}
          onChange={(e) => setNewChore(e.target.value)}
          sx={{
            mb: 2,
            borderRadius: 3,
            backgroundColor: grey[100],
            '&:hover': { backgroundColor: grey[200] },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: grey[400],
              },
            },
          }}
        />
        <Button
          onClick={handleAddChore}
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            height: '48px',
            borderRadius: 3,
            backgroundColor: '#FF6F61', // Light coral tint
            '&:hover': {
              backgroundColor: '#FF4C3B',
            },
          }}
        >
          Add Chore
        </Button>
      </Box>

      {/* Incomplete Chores Section */}
      <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
        Incomplete Chores
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {chores.map((chore) => (
          <Grid item xs={12} key={chore.id}>
            <Card sx={{
              boxShadow: 3,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.5)', // Glassmorphism effect
              borderRadius: 3,
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.05)', backgroundColor: 'rgba(255, 255, 255, 0.8)' },
              padding: 2,
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                  {chore.name}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleCompleteChore(chore.id)}
                    sx={{
                      borderRadius: 3,
                      backgroundColor: '#28a745',
                      '&:hover': {
                        backgroundColor: '#218838',
                      },
                    }}
                  >
                    Complete
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteChore(chore.id)}
                    sx={{ marginLeft: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Completed Chores Section */}
      <Typography variant="h6" gutterBottom color="secondary" sx={{ fontWeight: 'bold' }}>
        Completed Chores
      </Typography>
      <Grid container spacing={3}>
        {completedChores.map((chore) => (
          <Grid item xs={12} key={chore.id}>
            <Card sx={{
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.5)', // Glassmorphism effect
              borderRadius: 3,
              boxShadow: 3,
              padding: 2,
            }}>
              <CardContent>
                <Typography variant="h6" sx={{
                  textDecoration: 'line-through',
                  color: grey[500],
                  fontWeight: 'bold',
                }}>
                  {chore.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" mt={1}>
                  Completed on: {formatTimestamp(chore.completedAt)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;
