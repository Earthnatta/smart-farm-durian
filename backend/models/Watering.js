const mongoose = require('mongoose');

const WateringSchema = new mongoose.Schema({
  date: { type: Date, required: true },       // วันที่ให้น้ำ
  time: { type: String, default: "00:00" },   // เปลี่ยนจาก required เป็น default
  duration: { type: Number, default: 0 },     // เปลี่ยนจาก required เป็น default
  zone: { type: String, required: true },     // โซนของสวนทุเรียน
  note: { type: String }                      // หมายเหตุเพิ่มเติม
}, { timestamps: true }); // เก็บเวลาที่กดบันทึกโดยอัตโนมัติ

module.exports = mongoose.model('Watering', WateringSchema);