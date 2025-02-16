import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Container, Box, Card, CardContent, Grid, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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

    // Prepare the new chore with completed: false
    const choreToAdd = { name: newChore, completed: false };

    // Add the new chore to the database
    axios.post('http://localhost:5001/chores', choreToAdd)
      .then((response) => {
        setChores([response.data, ...chores]);
        setNewChore(''); // Clear the input field
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
        completedChore.completedAt = response.data.completedAt;  // Capture the timestamp from the response

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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom align="center" color="primary">
        Chores Tracker
      </Typography>

      {/* Add Chore Input */}
      <Box display="flex" justifyContent="center" mb={3}>
        <TextField
          label="New Chore"
          variant="outlined"
          fullWidth
          value={newChore}
          onChange={(e) => setNewChore(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button
          onClick={handleAddChore}
          variant="contained"
          color="primary"
          sx={{ height: '100%' }}
        >
          Add Chore
        </Button>
      </Box>

      {/* Incomplete Chores Section */}
      <Typography variant="h5" gutterBottom color="primary">
        Incomplete Chores
      </Typography>
      <Grid container spacing={3}>
        {chores.map((chore) => (
          <Grid item xs={12} sm={6} md={4} key={chore.id}>
            <Card sx={{ boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {chore.name}
                </Typography>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleCompleteChore(chore.id)}
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

      <Divider sx={{ my: 5 }} />

      {/* Completed Chores Section */}
      <Typography variant="h5" gutterBottom color="secondary">
        Completed Chores
      </Typography>
      <Grid container spacing={3}>
        {completedChores.map((chore) => (
          <Grid item xs={12} sm={6} md={4} key={chore.id}>
            <Card sx={{ backgroundColor: grey[100], boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ textDecoration: 'line-through', color: grey[500] }}>
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
