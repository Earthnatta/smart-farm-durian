import React, { useState } from 'react';
import axios from 'axios';

function WateringForm() {
  const [formData, setFormData] = useState({
    date: '', 
    time: '08:00', 
    duration: '', 
    zone: '', 
    note: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://durian-backend-api.onrender.com/api/watering', formData);
      alert('บันทึกข้อมูลการให้น้ำสำเร็จ! 🌱');
      setFormData({ date: '', time: '08:00', duration: '', zone: '', note: '' });
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการบันทึก!');
    }
  };

  return (
    <div className="card p-4 shadow-sm border-0">
      <h2 className="text-success mb-4 border-bottom pb-2">📝 บันทึกการให้น้ำทุเรียน</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* แถวที่ 1 */}
          <div className="col-md-6">
            <label className="form-label fw-bold">วันที่รดน้ำ</label>
            <input type="date" className="form-control" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">โซนที่รดน้ำ</label>
            <input type="text" className="form-control" placeholder="เช่น โซน A1, โซนเนินเขา" value={formData.zone} onChange={(e) => setFormData({...formData, zone: e.target.value})} required />
          </div>

          {/* แถวที่ 2 (ที่เพิ่มใหม่) */}
          <div className="col-md-6">
            <label className="form-label fw-bold">ระยะเวลา (นาที)</label>
            <input type="number" className="form-control" placeholder="ระบุจำนวนนาที" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} required />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">เวลาที่เริ่มรด</label>
            <input type="time" className="form-control" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
          </div>

          {/* แถวที่ 3 */}
          <div className="col-12">
            <label className="form-label fw-bold">หมายเหตุ</label>
            <textarea className="form-control" rows="2" placeholder="เช่น ผสมปุ๋ยแคลเซียม, ตรวจเช็คหัวสปริงเกอร์" value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})}></textarea>
          </div>

          <div className="col-12 text-end mt-4">
            <button type="submit" className="btn btn-success btn-lg px-5 shadow-sm">บันทึกข้อมูล</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default WateringForm;