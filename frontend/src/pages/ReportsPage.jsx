import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Paper, List, ListItem, ListItemText,
  ListItemAvatar, Avatar, Chip, Alert, LinearProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';

export default function ReportsPage() {
  const [duties, setDuties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Звук + сповіщення
  const playSound = () => {
    new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-tone-1077.mp3').play().catch(() => {});
  };

  const notify = (title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  // Автоматичне створення нарядів на сьогодні + автодоповідь
  const startAutoReportCycle = async () => {
    setLoading(true);

    // 1. Перевіряємо і створюємо наряди на сьогодні
    const allRes = await axios.get('http://localhost:5000/api/duties');
    const today = new Date().toISOString().split('T')[0];
    const hasToday = allRes.data.some(d => d.date === today);

    if (!hasToday) {
      await axios.post('http://localhost:5000/api/auto-plan', { year: 2025, month: 10 });
    }

    // 2. Отримуємо актуальні наряди
    const res = await axios.get('http://localhost:5000/api/today-duties');
    let currentDuties = res.data.map(d => ({ ...d, reporting: false }));

    setDuties(currentDuties);
    setLoading(false);

    // 3. Запускаємо автоматичну доповідь по черзі
    for (let i = 0; i < currentDuties.length; i++) {
      const duty = currentDuties[i];

      // Початок доповіді
      playSound();
      notify("Прийом доповіді", `${duty.rank} ${duty.personName} доповідає`);

      setDuties(prev => prev.map(d =>
        d.id === duty.id ? { ...d, reporting: true } : d
      ));

      // Затримка — імітація розмови
      await new Promise(resolve => setTimeout(resolve, 4000 + Math.random() * 4000));

      // Приймаємо доповідь
      await axios.post('http://localhost:5000/api/report', { dutyId: duty.id });

      setDuties(prev => prev.map(d =>
        d.id === duty.id ? { ...d, reporting: false, reported: true } : d
      ));

      notify("Доповідь прийнята", `Все гаразд по інституту`);
    }

    // Фінальне повідомлення
    playSound();
    notify("Цикл завершено", "Всі доповіді прийняті");
  };

  useEffect(() => {
    Notification.requestPermission();
    startAutoReportCycle();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
        <Typography mt={2}>Формування нарядів та прийом доповідей...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} color="primary">
          Прийом доповідей чергового інституту
        </Typography>

        <Alert severity="success" sx={{ mb: 3 }}>
          Автоматизований цикл прийому доповідей запущено
        </Alert>

        <Paper elevation={8} sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            {new Date().toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </Typography>

          <List>
            {duties.map((duty) => (
              <motion.div
                key={duty.id}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ListItem
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: duty.reporting ? '#fff8e1' : duty.reported ? '#e8f5e9' : '#ffebee',
                    border: duty.reporting ? '3px solid #ff9800' : duty.reported ? '2px solid #4caf50' : '2px dashed #f44336',
                    animation: duty.reporting ? 'pulse 1.5s infinite' : 'none'
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: duty.reporting ? 'orange' : duty.reported ? 'green' : 'red',
                      animation: duty.reporting ? 'pulse 1s infinite' : 'none'
                    }}>
                      {duty.reporting ? <AccessTimeIcon /> : <CheckCircleIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<strong>{duty.rank} {duty.personName}</strong>}
                    secondary={
                      <>
                        {duty.shift} зміна
                        <br />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PhoneIcon fontSize="small" />
                          <Typography variant="body2">{duty.phone}</Typography>
                        </Box>
                        {duty.reporting && <Typography color="warning.main" fontWeight="bold">→ Доповідає...</Typography>}
                      </>
                    }
                  />
                  <Chip
                    label={duty.reporting ? "В ефірі" : duty.reported ? "Прийнято" : "Очікування"}
                    color={duty.reporting ? "warning" : duty.reported ? "success" : "error"}
                    size="small"
                  />
                </ListItem>
              </motion.div>
            ))}
          </List>
        </Paper>
      </motion.div>

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Box>
  );
}