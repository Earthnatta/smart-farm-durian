import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar'; // 1. Import มาใช้งาน (เช็ก Path ไฟล์ให้ถูกนะ)
import WateringForm from './pages/WateringForm';
import WateringReport from './pages/WateringReport';

function App() {
  return (
    <Router>
      <div className="d-flex">
        {/* 2. เรียกใช้ Component Sidebar ตรงนี้แทนโค้ดก้อนเดิม */}
        <Sidebar /> 

        {/* ส่วนเนื้อหาหลัก */}
        <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<WateringForm />} />
            <Route path="/report" element={<WateringReport />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;