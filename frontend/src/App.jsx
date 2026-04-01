import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import WateringForm from './pages/WateringForm';
import WateringReport from './pages/WateringReport';

function App() {
  return (
    <Router>
      <div className="d-flex" style={{ minHeight: '100vh' }}>
        {/* Sidebar ตามเกณฑ์  */}
        <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
          <h4>Smart Farm</h4>
          <hr />
          <nav className="nav flex-column">
            <Link to="/" className="nav-link text-white">📝 บันทึกการให้น้ำ</Link>
            <Link to="/report" className="nav-link text-white">📊 รายงานการให้น้ำ</Link>
          </nav>
        </div>

        {/* ส่วนเนื้อหาหลัก */}
        <div className="flex-grow-1 p-4">
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