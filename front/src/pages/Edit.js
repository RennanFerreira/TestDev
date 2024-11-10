import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress, Box, Stack } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditPage() {
  const [user, setUser] = useState({
    login: '',
    name: '',
    last_name: '',
    email: '',
    status: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Obtém o id do parâmetro da URL
  const back = () => {
    navigate('/table')
  }

  // Função para buscar os dados do usuário a partir do id
  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token){
      navigate('/login')
    }
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3333/user/get-by-id/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data); // Preenche os dados do usuário no estado
      } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error);
        navigate('/table'); // Redireciona para a página de tabela caso ocorra um erro
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, navigate]);

  // Função para lidar com a submissão do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3333/user/${id}`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/table'); // Redireciona para a página de tabela após a atualização
    } catch (error) {
      console.error('Erro ao atualizar o usuário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  return (
    <div>
      <h2>Editar Usuário</h2>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            maxWidth={500}
            margin="0 auto"
            padding={3}
            component="div"
          >
            {/* Login */}
            <TextField
              label="Login"
              name="login"
              value={user.login}
              onChange={handleChange}
              fullWidth
              disabled
            />

            {/* Nome */}
            <TextField
              label="Nome"
              name="name"
              value={user.name}
              onChange={handleChange}
              fullWidth
              required
            />

            {/* Sobrenome */}
            <TextField
              label="Sobrenome"
              name="last_name"
              value={user.last_name}
              onChange={handleChange}
              fullWidth
              required
            />

            {/* Email */}
            <TextField
              label="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              fullWidth
              required
              type="email"
            />

            {/* Status */}
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="status"
                value={user.status}
                onChange={handleChange}
              >
                <MenuItem value="ativo">Ativo</MenuItem>
                <MenuItem value="inativo">Inativo</MenuItem>
                <MenuItem value="bloqueado">Bloqueado</MenuItem>
              </Select>
            </FormControl>

            {/* Senha */}
            <TextField
              label="Senha"
              name="password"
              value={user.password}
              onChange={handleChange}
              fullWidth
              type="password"
            />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Atualizando...' : 'Atualizar Usuário'}
            </Button>
            <Button
              onClick={back}
              variant="contained"
              color="primary"
            >
              Voltar
            </Button>
          </Box>
        </form>
      )}
    </div>
  );
}

export default EditPage;