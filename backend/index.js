const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let users = [{ id: 1, login: "admin", password: "12345", role: "Начальник чергової служби" }];
let personnel = [
  { id: 1, name: "Іванов І.І.", rank: "підполковник", availability: [1,2,3,4,5], lastDuty: null },
  { id: 2, name: "Петров П.П.", rank: "майор", availability: [0,1,2,3,6], lastDuty: null },
  { id: 3, name: "Сидоров С.С.", rank: "капітан", availability: [2,3,4,5,6], lastDuty: null },
  { id: 4, name: "Коваленко О.В.", rank: "старший лейтенант", availability: [1,3,4,5,6], lastDuty: null },
  { id: 5, name: "Мельник Д.А.", rank: "лейтенант", availability: [0,1,2,4,5], lastDuty: null },
];

let duties = []; 

app.post('/api/login', (req, res) => {
  const { login, password } = req.body;
  const user = users.find(u => u.login === login && u.password === password);
  if (user) {
    res.json({ success: true, user: { id: user.id, name: user.role } });
  } else {
    res.status(401).json({ success: false });
  }
});

app.get('/api/personnel', (req, res) => res.json(personnel));

app.get('/api/duties', (req, res) => res.json(duties));

app.post('/api/auto-plan', (req, res) => {
  const { year, month } = req.body;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const newDuties = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    ['Ранкова', 'Вечірня'].forEach(shift => {
      const person = personnel[(day + shift.length) % personnel.length];
      newDuties.push({
        id: Date.now() + Math.random(),
        date,
        shift,
        personId: person.id,
        personName: person.name,
        rank: person.rank,
        phone: person.phone,
        reported: false,       
        reportTime: null
      });
    });
  }
  duties = newDuties;
  res.json({ success: true, count: newDuties.length });
});

app.listen(5000, () => console.log('Backend: http://localhost:5000'));