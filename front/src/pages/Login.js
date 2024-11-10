import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography, CircularProgress} from '@mui/material';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:3333/session', {
        login,
        password
      })
      localStorage.setItem('token', response.data.token)
      navigate('/table');
    } catch (error) {
      alert('unauthorized')
      setLoading(false)
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 8,
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h5">Login</Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Login"
            variant="outlined"
            fullWidth
            margin="normal"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled = {loading}
          >
            {loading? <CircularProgress size={24} /> : 'Entrar'}
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;