import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, TextField, MenuItem, Select, InputLabel, FormControl, Container, CircularProgress, Box, Button } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, LockReset as LockResetIcon, LockOpen as LockOpenIcon, Logout } from '@mui/icons-material';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function TablePage() {
  // Estado para armazenar o filtro selecionado e o valor do filtro
  const [users, setUsers] = useState([]);
  const [filterField, setFilterField] = useState('login');
  const [filterValue, setFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Função para formatar a data de expiração da senha
  const formatPasswordExpirationDate = (expirationDate) => {
    const date = new Date(expirationDate);
    return date.toLocaleDateString('pt-BR'); // Formato 'dd/mm/aaaa'
  };

  // Função para filtrar os usuários com base no campo e valor selecionados
  const filteredUsers = users.filter((user) => {
    const fieldValue = user[filterField]?.toLowerCase() || ''; // Obtém o valor do campo escolhido
    return fieldValue.includes(filterValue.toLowerCase()); // Filtra pela correspondência do valor
  });

  // Função para lidar com a mudança do campo de filtro
  const handleFilterFieldChange = (event) => {
    setFilterField(event.target.value);
  };

  // Função para lidar com a mudança do valor do filtro
  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };
  function logout(){
    localStorage.removeItem('token')
    navigate(`/login`);
  }

  function getConfig() {
    const token = localStorage.getItem('token'); // Supondo que o token esteja no localStorage

    // Configurando os headers com o token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Adicionando o token no cabeçalho
      },
    };
    return config
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3333/user/${id}`, getConfig());
      fetchUsers();
    } catch (error) {
      alert('unauthorized')
    }
  };

  const handleEdit = (id) => {
    // event.preventDefault();
    navigate(`/edit/${id}`);
  };

  const handleResetPassword = async (id) => {
    try {
      await axios.put(`http://localhost:3333/user/password-reset/${id}`, {}, getConfig())
      fetchUsers();
    } catch (error) {
      alert('unauthorized')
    }
  };

  const handleUnlockAccount = async (id) => {
    try {
      await axios.put(`http://localhost:3333/user/${id}`, { status: 'ativo' }, getConfig())
      fetchUsers();
    } catch (error) {
      alert('unauthorized')
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:3333/user/all', getConfig());
      setUsers(response.data); // Armazena os dados dos usuários
    } catch (error) {
      console.error('Erro ao buscar os usuários:', error);
    }
    setLoading(false)
  };

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token){
      navigate('/login')
    }
    // Função para buscar os usuários
    fetchUsers(); // Chama a função para fazer a requisição
  }, []); // O array vazio garante que o efeito seja executado apenas uma vez, ao montar o componente
  return (
    <Container component="main" maxWidth="xl" sx={{ marginTop: '100px' }} >
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Filtrar por</InputLabel>
              <Select
                value={filterField}
                onChange={handleFilterFieldChange}
                label="Filtrar por"
              >
                <MenuItem value="login">Login</MenuItem>
                <MenuItem value="name">Nome</MenuItem>
                <MenuItem value="email">Email</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Pesquisar"
              variant="outlined"
              value={filterValue}
              onChange={handleFilterValueChange}
              sx={{ marginLeft: '20px' }}
            />
          </div>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de usuários">
              <TableHead>
                <TableRow>
                  <TableCell>Login</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Sobrenome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status da Conta</TableCell>
                  <TableCell>Data de Expiração da Senha</TableCell>
                  <TableCell>Grupo de Acesso</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.login}>
                    <TableCell>{user.login}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>{formatPasswordExpirationDate(user.password_expiration_date)}</TableCell>
                    <TableCell>{user.access_group}</TableCell>
                    <TableCell>
                      <Tooltip title="Deletar Usuário">
                        <IconButton color="error" onClick={() => handleDelete(user.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Atualizar Usuário">
                        <IconButton color="primary" onClick={() => handleEdit(user.id)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Resetar Senha">
                        <IconButton color="secondary" onClick={() => handleResetPassword(user.id)}>
                          <LockResetIcon />
                        </IconButton>
                      </Tooltip>
                      {/* Mostrar o botão de desbloqueio apenas se o status do usuário for 'bloqueado' */}
                      {user.status === 'bloqueado' && (
                        <Tooltip title="Desbloquear Conta">
                          <IconButton color="success" onClick={() => handleUnlockAccount(user.id)}>
                            <LockOpenIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <Button
        sx={{ marginTop: '16px' }}
        onClick={logout}
        variant="contained"
        color="primary"
      >
        Sair
      </Button>
    </Container>
  );
}

export default TablePage;