import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Avatar, LinearProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

export default function PersonnelPage() {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/personnel')
      .then(res => {
        setPersonnel(res.data);
        setLoading(false);
      });
  }, []);

  const getAvailabilityColor = (days) => {
    const count = days.length;
    if (count >= 6) return 'success';
    if (count >= 4) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 4 }}>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <Typography variant="h4" fontWeight="bold" mb={4} color="primary">
          Особовий склад чергової служби
        </Typography>

        {loading && <LinearProgress />}

        <TableContainer component={Paper} elevation={6}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#0d47a1' }}>
                <TableCell><Typography color="white" fontWeight="bold">№</Typography></TableCell>
                <TableCell><Typography color="white" fontWeight="bold">Військове звання</Typography></TableCell>
                <TableCell><Typography color="white" fontWeight="bold">ПІБ</Typography></TableCell>
                <TableCell align="center"><Typography color="white" fontWeight="bold">Доступність</Typography></TableCell>
                <TableCell align="center"><Typography color="white" fontWeight="bold">Кількість днів</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {personnel.map((person, index) => (
                <motion.tr
                  key={person.id}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  component={TableRow}
                  hover
                >
                  <TableCell>
                    <Avatar sx={{ bgcolor: '#0d47a1' }}>
                      <MilitaryTechIcon />
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">{person.rank}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="bold">{person.name}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    {person.availability.map(day => {
                      const days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
                      return (
                        <Chip
                          key={day}
                          label={days[day]}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ m: 0.3 }}
                        />
                      );
                    })}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={person.availability.length + ' днів'}
                      color={getAvailabilityColor(person.availability)}
                      variant="filled"
                    />
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>
    </Box>
  );
}