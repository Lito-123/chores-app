import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, TextField, Typography, Container, Box, Card, CardContent,
  Grid, IconButton, Divider, Fab, Paper, Switch, FormControlLabel
} from '@mui/material';
import { Delete as DeleteIcon, CheckCircle as CheckCircleIcon, Add as AddIcon } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

function App() {
  const [chores, setChores] = useState([]);
  const [completedChores, setCompletedChores] = useState([]);
  const [newChore, setNewChore] = useState('');
  const [filter, setFilter] = useState('all'); // To filter tasks

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
    if (newChore.trim() === '') return; // Don't add an empty task

    const choreToAdd = { name: newChore, completed: false };

    axios.post('http://localhost:5001/chores', choreToAdd)
      .then((response) => {
        // Add the newly added chore to the list of incomplete chores
        setChores([response.data, ...chores]);
        setNewChore(''); // Clear the input field after adding
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

  // Filter chores based on selected filter
  const filteredChores = (filter === 'all') 
    ? [...chores, ...completedChores] 
    : (filter === 'open' ? chores : completedChores);

  return (
    <Container maxWidth="sm" sx={{
      mt: 4,
      backgroundColor: 'white',
      padding: 3,
      borderRadius: 5,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Typography variant="h4" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
        Today’s Tasks
      </Typography>

      {/* Date Display */}
      <Typography variant="subtitle1" gutterBottom align="center" sx={{ color: grey[600] }}>
        Wednesday, 11 May
      </Typography>

      {/* New Task Input and Button */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={3} width="100%">
        {/* Text input for new chore */}
        <TextField
          fullWidth
          label="New Task"
          variant="outlined"
          value={newChore}
          onChange={(e) => setNewChore(e.target.value)} // Update the state as the user types
          sx={{ marginBottom: 2 }}
        />
        {/* New Task Button */}
        <Fab color="primary" onClick={handleAddChore}>
          <AddIcon />
        </Fab>
      </Box>

   {/* Filter Switch */}
<Box display="flex" justifyContent="center" mb={2}>
  <FormControlLabel
    control={
      <Switch
        checked={filter === 'completed'} // Check if the filter is set to 'completed'
        onChange={() => setFilter(filter === 'completed' ? 'open' : 'completed')} // Toggle between 'open' and 'completed'
      />
    }
    label={filter === 'completed' ? 'Show Open Tasks' : 'Show Completed Tasks'} // Change label based on the filter
  />
</Box>


      {/* Task List */}
      <Box width="100%" sx={{ mb: 4 }}>
        {filteredChores.map((chore) => (
          <Card key={chore.id} sx={{
            boxShadow: 3,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: 3,
            transition: 'transform 0.3s',
            '&:hover': { transform: 'scale(1.05)', backgroundColor: 'rgba(255, 255, 255, 0.8)' },
            padding: 2,
            marginBottom: 2,
          }}>
            <CardContent>
              <Typography variant="h6" sx={{
                textDecoration: chore.completed ? 'line-through' : 'none',
                color: chore.completed ? grey[500] : 'inherit',
              }}>
                {chore.name}
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                {chore.completed && (
                  <Typography variant="body2" color="textSecondary">
                    Completed on: {formatTimestamp(chore.completedAt)}
                  </Typography>
                )}
                <Box>
                  {!chore.completed && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleCompleteChore(chore.id)}
                      sx={{ borderRadius: 3, backgroundColor: '#28a745' }}
                    >
                      Complete
                    </Button>
                  )}
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteChore(chore.id)}
                    sx={{ marginLeft: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

export default App;
