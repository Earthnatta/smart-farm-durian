import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WateringReport() {
  const [waterings, setWaterings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // เพิ่ม State สำหรับตัวกรอง
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

  // --- ฟังก์ชันสำหรับกรองข้อมูล (Logic ใหม่) ---
  const filteredData = waterings.filter(item => {
    if (filterType === 'all') return true;
    
    const recordDate = new Date(item.date);
    const now = new Date();

    if (filterType === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return recordDate >= oneWeekAgo;
    }
    if (filterType === 'month') {
      return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
    }
    if (filterType === 'year') {
      return recordDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const deleteRecord = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?')) {
      try {
        // แก้ไข URL ให้มี /api/ ตามที่คุยกัน
        await axios.delete(`https://durian-backend-api.onrender.com/api/watering/${id}`);
        fetchWaterings();
      } catch (err) {
        alert('ลบไม่สำเร็จ');
      }
    }
  };

  const handleEditClick = (item) => {
    setEditData({ ...item, date: item.date.split('T')[0] }); 
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://durian-backend-api.onrender.com/api/watering/${editData._id}`, editData);
      alert('อัปเดตข้อมูลสำเร็จ! ✨');
      setEditData(null);
      fetchWaterings();
    } catch (err) {
      alert('อัปเดตไม่สำเร็จ');
    }
  };

  if (loading) return <div className="text-center mt-5">กำลังโหลด...</div>;

  return (
    <div className="card shadow-sm border-0 mt-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary m-0">📊 รายงานการให้น้ำ</h2>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => window.print()}>
            🖨️ พิมพ์รายงาน (PDF)
          </button>
        </div>

        {/* --- ส่วนเลือกตัวกรอง (UI ใหม่) --- */}
        <div className="row mb-4 bg-light p-3 rounded shadow-sm mx-1">
          <div className="col-md-6 d-flex align-items-center gap-3">
            <label className="fw-bold text-secondary text-nowrap">ช่วงเวลาที่แสดง:</label>
            <select 
              className="form-select border-primary" 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">ทั้งหมด</option>
              <option value="week">สัปดาห์นี้ (7 วันล่าสุด)</option>
              <option value="month">เดือนนี้</option>
              <option value="year">ปีนี้</option>
            </select>
          </div>
          <div className="col-md-6 text-end d-none d-md-block">
            <small className="text-muted">พบทั้งหมด {filteredData.length} รายการ</small>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark text-center">
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
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item._id} className="text-center">
                    <td>{new Date(item.date).toLocaleDateString('th-TH')}</td>
                    <td className="fw-bold">{item.time}</td>
                    <td><span className="badge bg-info text-dark">{item.zone}</span></td>
                    <td>{item.duration} นาที</td>
                    <td className="text-start">{item.note}</td>
                    <td className="text-center">
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(item)}>✏️ แก้ไข</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteRecord(item._id)}>🗑️ ลบ</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">ไม่พบข้อมูลในช่วงเวลานี้</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- Modal แก้ไขคงเดิม --- */}
        {editData && (
          <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-warning">
                  <h5 className="modal-title fw-bold">แก้ไขข้อมูลการให้น้ำ</h5>
                  <button type="button" className="btn-close" onClick={() => setEditData(null)}></button>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-bold">วันที่</label>
                      <input type="date" className="form-control" value={editData.date} onChange={(e) => setEditData({...editData, date: e.target.value})} required />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">เวลา</label>
                        <input type="time" className="form-control" value={editData.time} onChange={(e) => setEditData({...editData, time: e.target.value})} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">ระยะเวลา (นาที)</label>
                        <input type="number" className="form-control" value={editData.duration} onChange={(e) => setEditData({...editData, duration: e.target.value})} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">โซน</label>
                      <input type="text" className="form-control" value={editData.zone} onChange={(e) => setEditData({...editData, zone: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">หมายเหตุ</label>
                      <textarea className="form-control" value={editData.note} onChange={(e) => setEditData({...editData, note: e.target.value})}></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary px-4" onClick={() => setEditData(null)}>ยกเลิก</button>
                    <button type="submit" className="btn btn-success px-4">บันทึกการแก้ไข</button>
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