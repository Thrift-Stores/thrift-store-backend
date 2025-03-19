require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.clear(); 
  console.log(`🚀😌 Server running on port ${PORT}`);
});
