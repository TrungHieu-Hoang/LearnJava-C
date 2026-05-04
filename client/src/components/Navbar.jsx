import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Trophy, User, Terminal } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="nav-brand">
        <Terminal className="nav-logo" size={24} />
        <Link to="/dashboard">CodeCamp</Link>
      </div>

      <div className="nav-menu">
        <Link to="/dashboard" className="nav-item">Học tập</Link>
        <Link to="/leaderboard" className="nav-item">Bảng xếp hạng</Link>
      </div>

      <div className="nav-user">
        <div className="user-stats">
          <Trophy size={16} className="text-warning" />
          <span>{user?.points || 0} điểm</span>
        </div>
        <div className="user-profile">
          <User size={18} />
          <span>{user?.username}</span>
        </div>
        <button onClick={handleLogout} className="btn-icon" title="Đăng xuất">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
