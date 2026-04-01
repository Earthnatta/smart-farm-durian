import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WateringReport() {
  const [waterings, setWaterings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State สำหรับการแก้ไข
  const [editData, setEditData] = useState(null); 

  const fetchWaterings = async () => {
    try {
      const res = await axios.get('https://durian-backend-api.onrender.com/api/watering');
      setWaterings(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterings();
  }, []);

  const deleteRecord = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?')) {
      try {
        await axios.delete(`https://durian-backend-api.onrender.com/api/watering/${id}`);
        fetchWaterings();
      } catch (err) {
        alert('ลบไม่สำเร็จ');
      }
    }
  };

  // --- ส่วนฟังก์ชันแก้ไข ---
  const handleEditClick = (item) => {
    // เก็บข้อมูลแถวที่เลือกไว้ใน State เพื่อเอาไปโชว์ในฟอร์มแก้ไข
    setEditData({ ...item, date: item.date.split('T')[0] }); 
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://durian-backend-api.onrender.com/api/watering/${editData._id}`, editData);
      alert('อัปเดตข้อมูลสำเร็จ! ✨');
      setEditData(null); // ปิดหน้าต่างแก้ไข
      fetchWaterings();  // โหลดข้อมูลใหม่
    } catch (err) {
      alert('อัปเดตไม่สำเร็จ');
    }
  };

  if (loading) return <div className="text-center mt-5">กำลังโหลด...</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="text-primary mb-4">📊 รายงานการให้น้ำ</h2>
        
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>วันที่</th>
                <th>เวลา</th>
                <th>โซน</th>
                <th>ระยะเวลา</th>
                <th>หมายเหตุ</th>
                <th className="text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {waterings.map((item) => (
                <tr key={item._id}>
                  <td>{new Date(item.date).toLocaleDateString('th-TH')}</td>
                  <td className="fw-bold">{item.time}</td>
                  <td><span className="badge bg-info text-dark">{item.zone}</span></td>
                  <td>{item.duration} นาที</td>
                  <td>{item.note}</td>
                  <td className="text-center">
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(item)}>✏️ แก้ไข</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteRecord(item._id)}>🗑️ ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- ส่วนของหน้าต่างแก้ไข (Edit Overlay) --- */}
        {editData && (
          <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-warning">
                  <h5 className="modal-title fw-bold">แก้ไขข้อมูลการให้น้ำ</h5>
                  <button type="button" className="btn-close" onClick={() => setEditData(null)}></button>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">วันที่</label>
                      <input type="date" className="form-control" value={editData.date} onChange={(e) => setEditData({...editData, date: e.target.value})} required />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">เวลา</label>
                        <input type="time" className="form-control" value={editData.time} onChange={(e) => setEditData({...editData, time: e.target.value})} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">ระยะเวลา (นาที)</label>
                        <input type="number" className="form-control" value={editData.duration} onChange={(e) => setEditData({...editData, duration: e.target.value})} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">โซน</label>
                      <input type="text" className="form-control" value={editData.zone} onChange={(e) => setEditData({...editData, zone: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">หมายเหตุ</label>
                      <textarea className="form-control" value={editData.note} onChange={(e) => setEditData({...editData, note: e.target.value})}></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setEditData(null)}>ยกเลิก</button>
                    <button type="submit" className="btn btn-success">บันทึกการแก้ไข</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WateringReport;