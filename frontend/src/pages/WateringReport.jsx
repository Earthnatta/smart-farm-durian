import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WateringReport() {
  const [waterings, setWaterings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- State สำหรับตัวกรอง (Filter) ---
  const [filterType, setFilterType] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  // เพิ่ม State สำหรับเลือกช่วงวันที่ (เพื่อแทนการเลือกสัปดาห์ใดๆ)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
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

  // --- Logic การกรองข้อมูล ---
  const filteredData = waterings.filter(item => {
    const recordDate = new Date(item.date);
    recordDate.setHours(0, 0, 0, 0); // ล้างค่าเวลาออกเพื่อเทียบแค่วันที่

    if (filterType === 'all') return true;

    // เลือกช่วงวันที่ (ใช้แทน "สัปดาห์ไหนก็ได้")
    if (filterType === 'range') {
      if (!startDate || !endDate) return true;
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return recordDate >= start && recordDate <= end;
    }
    
    if (filterType === 'month') {
      return recordDate.getMonth() === parseInt(selectedMonth) && 
             recordDate.getFullYear() === parseInt(selectedYear);
    }
    
    if (filterType === 'year') {
      return recordDate.getFullYear() === parseInt(selectedYear);
    }
    
    return true;
  });

  // ... (ฟังก์ชัน deleteRecord, handleEditClick, handleUpdate เหมือนเดิม) ...
  const deleteRecord = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?')) {
      try {
        await axios.delete(`https://durian-backend-api.onrender.com/api/watering/${id}`);
        fetchWaterings();
      } catch (err) { alert('ลบไม่สำเร็จ'); }
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
    } catch (err) { alert('อัปเดตไม่สำเร็จ'); }
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

        {/* --- ส่วนเลือกตัวกรอง --- */}
        <div className="row mb-4 bg-light p-3 rounded shadow-sm mx-1 border">
          <div className="col-12 d-flex flex-wrap align-items-center gap-2">
            <label className="fw-bold text-secondary">กรองโดย:</label>
            
            <select 
              className="form-select w-auto border-primary" 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">แสดงทั้งหมด</option>
              <option value="range">เลือกช่วงวันที่ (สัปดาห์/ระบุเอง)</option>
              <option value="month">เลือกตามเดือน</option>
              <option value="year">เลือกตามปี</option>
            </select>

            {/* ส่วนเลือกช่วงวันที่ (Range) */}
            {filterType === 'range' && (
              <div className="d-flex align-items-center gap-2">
                <input type="date" className="form-control form-control-sm" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <span>ถึง</span>
                <input type="date" className="form-control form-control-sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            )}

            {/* ส่วนเลือกเดือน */}
            {filterType === 'month' && (
              <select className="form-select w-auto border-info" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                {["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"].map((m, i) => (
                  <option key={i} value={i}>{m}</option>
                ))}
              </select>
            )}

            {/* ส่วนเลือกปี */}
            {(filterType === 'month' || filterType === 'year') && (
              <select className="form-select w-auto border-info" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {[2024, 2025, 2026, 2027].map(y => (
                  <option key={y} value={y}>{y + 543} (พ.ศ.)</option>
                ))}
              </select>
            )}
            
            <div className="ms-auto">
              <span className="badge bg-primary rounded-pill">พบ {filteredData.length} รายการ</span>
            </div>
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
                    <td className="text-start">{item.note || '-'}</td>
                    <td className="text-center">
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(item)}>✏️ แก้ไข</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteRecord(item._id)}>🗑️ ลบ</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-5 text-muted">🚫 ไม่พบข้อมูลในช่วงเวลาที่เลือก</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ... (Modal แก้ไข เหมือนเดิม) ... */}
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