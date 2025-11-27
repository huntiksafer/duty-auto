const express = require('express');
const cors = require('cors');

const app = express();

// Дозволяємо запити з будь-якого джерела (для Render це важливо)
app.use(cors());
app.use(express.json());

// ==========================================
// 🗄️ ФЕЙКОВА БАЗА ДАНИХ (В пам'яті)
// ==========================================
let EVENTS_DB = [
  {
    _id: '1',
    title: 'Урочиста присяга курсантів',
    description: 'Присяга курсантів 1-го курсу на вірність народу України. Збір на плацу о 09:00. Форма одягу: парадна.',
    date: '2025-11-28T09:00:00.000Z',
    type: 'News',
    isTopNews: true,
    image: 'https://placehold.co/600x400/4B5320/white?text=Oath' // Або шлях до твого фото
  },
  {
    _id: '2',
    title: 'Вогнева підготовка (Полігон)',
    description: 'Практичні стрільби зі стрілецької зброї (АК-74). Виїзд о 06:00. Інструктаж з техніки безпеки обов\'язковий.',
    date: '2025-11-30T06:00:00.000Z',
    type: 'Schedule',
    isTopNews: false,
    image: 'https://placehold.co/600x400/5D5A46/white?text=Shooting'
  },
  {
    _id: '3',
    title: 'Лекція: Кібербезпека',
    description: 'Тема: "Захист інформації в телекомунікаційних системах". Аудиторія 305. Доповідач: полковник Іваненко.',
    date: '2025-12-01T10:00:00.000Z',
    type: 'Schedule',
    isTopNews: false,
    image: 'https://placehold.co/600x400/2F3318/white?text=Cyber+Lecture'
  },
  {
    _id: '4',
    title: 'День Збройних Сил України',
    description: 'Святковий концерт та нагородження кращих військовослужбовців.',
    date: '2025-12-06T14:00:00.000Z',
    type: 'News',
    isTopNews: true,
    image: 'https://placehold.co/600x400/3B3C36/white?text=Armed+Forces+Day'
  },
  {
    _id: '5',
    title: 'Стройовий огляд',
    description: 'Перевірка зовнішнього вигляду та наявності посвідчень. Форма одягу: польова (сезонна).',
    date: '2025-12-08T08:00:00.000Z',
    type: 'Schedule',
    isTopNews: false,
    image: 'https://placehold.co/600x400/4B5320/white?text=Drill'
  }
];

// ==========================================
// 🛣️ МАРШРУТИ (API)
// ==========================================

// 1. Отримати всі події
app.get('/api/events', (req, res) => {
  console.log('GET /api/events - sending data...');
  res.json(EVENTS_DB);
});

// 2. Логін (Імітація)
// Якщо логін містить слово "admin" - даємо права адміна
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  console.log(`Login attempt: ${username}`);

  const role = username.toLowerCase().includes('admin') ? 'admin' : 'user';

  res.json({
    token: 'fake-jwt-token-1234567890', // Фейковий токен
    role: role,
    username: username
  });
});

// 3. Реєстрація (Імітація)
app.post('/api/register', (req, res) => {
  res.json({ message: 'User registered successfully' });
});

// 4. Додавання події (Тільки в пам'ять)
app.post('/api/events', (req, res) => {
  const newEvent = {
    _id: Date.now().toString(), // Генеруємо ID
    ...req.body
  };
  EVENTS_DB.unshift(newEvent); // Додаємо на початок списку
  console.log('New event added:', newEvent.title);
  res.json(newEvent);
});

// 5. Видалення події
app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  EVENTS_DB = EVENTS_DB.filter(event => event._id !== id);
  console.log(`Event deleted: ${id}`);
  res.json({ message: 'Event deleted successfully' });
});

// ==========================================
// 🚀 ЗАПУСК СЕРВЕРА
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Mock Server running on port ${PORT}`);
  console.log(`📡 Ready to handle requests without MongoDB`);
});