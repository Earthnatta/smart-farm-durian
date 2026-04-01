import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
      <h4 className="text-center py-3">🌿 Smart Farm</h4>
      <hr />
      <nav className="nav flex-column gap-2">
        <Link to="/" className="nav-link text-white hover-effect">
          📝 บันทึกการให้น้ำ
        </Link>
        <Link to="/report" className="nav-link text-white hover-effect">
          📊 รายงานการให้น้ำ
        </Link>
      </nav>
      
      <style>{`
        .nav-link:hover {
          background-color: #495057;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
}

export default Sidebar;