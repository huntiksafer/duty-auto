import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [login, setLogin] = useState('admin');
  const [password, setPassword] = useState('12345');
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const success = await authLogin(login, password);
    if (success) navigate('/');
    else setError('Невірний логін або пароль');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#0d47a1', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <motion.div 
        initial={{ y: -100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ type: "spring", stiffness: 120 }}
      >
        <Paper sx={{ 
          p: 6, 
          width: 420, 
          textAlign: 'center', 
          bgcolor: 'rgba(255,255,255,0.97)',
          borderRadius: 3,
          boxShadow: '0 15px 35px rgba(0,0,0,0.3)'
        }}>
          <Typography variant="h4" fontWeight="bold" color="#0d47a1" mb={4}>
            Логін
          </Typography>

          <TextField 
            fullWidth 
            label="Логін" 
            value={login} 
            onChange={e => setLogin(e.target.value)} 
            margin="normal"
            InputProps={{
              style: { color: '#0d47a1', fontWeight: 500 }
            }}
            InputLabelProps={{
              style: { color: '#0d47a1' }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#0d47a1' },
                '&:hover fieldset': { borderColor: '#1976d2' },
                '&.Mui-focused fieldset': { borderColor: '#0d47a1', borderWidth: 2 }
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#0d47a1' }
            }}
          />

          <TextField 
            fullWidth 
            label="Пароль" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            margin="normal"
            InputProps={{
              style: { color: '#0d47a1', fontWeight: 500 }
            }}
            InputLabelProps={{
              style: { color: '#0d47a1' }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#0d47a1' },
                '&:hover fieldset': { borderColor: '#1976d2' },
                '&.Mui-focused fieldset': { borderColor: '#0d47a1', borderWidth: 2 }
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#0d47a1' }
            }}
          />

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Button 
            variant="contained" 
            size="large" 
            fullWidth 
            onClick={handleLogin}
            sx={{ 
              mt: 4, 
              py: 1.8, 
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #0d47a1, #1976d2)',
              '&:hover': { background: '#1565c0' }
            }}
          >
            УВІЙТИ В СИСТЕМУ
          </Button>

        </Paper>
      </motion.div>
    </Box>
  );
}