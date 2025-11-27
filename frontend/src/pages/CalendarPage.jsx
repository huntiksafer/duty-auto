import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import ukLocale from '@fullcalendar/core/locales/uk';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/duties').then(res => {
      setEvents(res.data.map(d => ({
        title: `${d.shift} – ${d.personName || 'Вільно'}`,
        date: d.date,
        backgroundColor: d.personName ? '#1b5e20' : '#b71c1c'
      })));
    });
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>Календар добового наряду</Typography>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        locale={ukLocale}
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        height="80vh"
      />
    </Box>
  );
}