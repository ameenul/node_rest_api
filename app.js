// 1. Load .env
require('./config/dotenv');

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const authRoutes    = require('./routes/authRoutes');
const catatanRoutes = require('./routes/catatanRoutes'); // ← import route baru

const app = express();

// 2. Middleware umum
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Serve folder uploads secara statis
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// 4. Mount routes
app.use('/auth', authRoutes);
app.use('/auth/catatans', catatanRoutes); // ← mount route catatan di bawah /auth/catatans

// 5. (Optional) Global error handler, menangani multer error dsb.
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: err.message });
  }
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// 6. Jalankan server
const port = process.env.server_port || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});








// const express = require('express');
// const app = express();
// const router = express.Router();

// app.use(express.json());

// router.get('/', (req, res) => {
//   res.status(200).send('Hello World!');
// }
// );

// router.post("/calculate", (req, res) => {
//   const { num1, num2 } = req.body;
//   if (typeof num1 !== 'number' || typeof num2 !== 'number') {
//     return res.status(400).send('Invalid input');
//   }
//   const sum = num1 + num2;
//   res.status(200).json({ sum });
// }
// );

// app.use('/', router);

// const port = 3000;
// app.listen(port, () => { 
//   console.log(`Server is running at http://localhost:${port}`);
// }
// );
