const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Watering = require('./models/Watering');

const app = express();
app.use(cors());
app.use(express.json());

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('เชื่อมต่อฐานข้อมูลสวนทุเรียนสำเร็จ!'))
  .catch(err => console.error('Error:', err));

// 1. (CREATE) - บันทึกการให้น้ำใหม่
app.post('/api/watering', async (req, res) => {
  try {
    const newData = new Watering(req.body);
    await newData.save();
    res.status(201).json({ message: 'บันทึกสำเร็จ' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2. (QUERY) - ดึงข้อมูลทั้งหมด (ทำรายงาน)
app.get('/api/watering', async (req, res) => {
  try {
    const data = await Watering.find().sort({ date: -1 }); // เรียงจากล่าสุด
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. (UPDATE) - แก้ไขข้อมูล
app.put('/api/watering/:id', async (req, res) => {
  try {
    await Watering.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'แก้ไขสำเร็จ' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. (DELETE) - ลบข้อมูล
app.delete('/api/watering/:id', async (req, res) => {
  try {
    await Watering.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบสำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server รันที่พอร์ต ${PORT}`));