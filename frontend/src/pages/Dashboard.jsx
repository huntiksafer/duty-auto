import { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Grid, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [planned, setPlanned] = useState(0);

  const autoPlan = async () => {
    setLoading(true);
    await axios.post('http://localhost:5000/api/auto-plan', { year: 2025, month: 10 });
    const res = await axios.get('http://localhost:5000/api/duties');
    setPlanned(res.data.length);
    setLoading(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
        <Typography variant="h3" fontWeight="bold" textAlign="center" mb={4} color="primary">
          Підсистема автоматизації управління алгоритмами добового наряду
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Typography variant="h5" gutterBottom>Автопланування</Typography>
              <Button variant="contained" size="large" onClick={autoPlan} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Сформувати наряд на місяць'}
              </Button>
              {planned > 0 && <Typography mt={2} color="success.main">Заплановано: {planned} змін</Typography>}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>Швидкий доступ</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button component={NavLink} to="/calendar" variant="outlined">Календар нарядів</Button>
                <Button component={NavLink} to="/personnel" variant="outlined">Особовий склад</Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}