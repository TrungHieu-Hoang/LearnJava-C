import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { Trophy, Medal, Star } from 'lucide-react';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboard');
        setLeaderboard(res.data.leaderboard);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="rank-icon gold" size={24} />;
      case 2: return <Medal className="rank-icon silver" size={24} />;
      case 3: return <Medal className="rank-icon bronze" size={24} />;
      default: return <span className="rank-number">{rank}</span>;
    }
  };

  return (
    <div className="leaderboard-page">
      <Navbar />
      
      <div className="leaderboard-container">
        <div className="leaderboard-header glass-panel">
          <Trophy size={48} className="header-icon gold" />
          <h1>Bảng Xếp Hạng CodeCamp</h1>
          <p>Top 50 Coder xuất sắc nhất nền tảng</p>
        </div>

        <div className="leaderboard-list glass-panel">
          {isLoading ? (
            <div className="loading-state">Đang tải bảng xếp hạng...</div>
          ) : (
            <table className="lb-table">
              <thead>
                <tr>
                  <th className="col-rank">Hạng</th>
                  <th className="col-user">Coder</th>
                  <th className="col-solved">Đã giải</th>
                  <th className="col-points">Điểm số</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user) => (
                  <tr key={user._id} className={`lb-row rank-${user.rank}`}>
                    <td className="col-rank">
                      <div className="rank-badge">
                        {getRankIcon(user.rank)}
                      </div>
                    </td>
                    <td className="col-user">
                      <div className="user-info">
                        <div className="avatar">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="username">{user.username}</span>
                        {user.rank <= 3 && <Star size={14} className="star-icon" />}
                      </div>
                    </td>
                    <td className="col-solved">
                      <span className="solved-count">{user.solvedExercises} bài</span>
                    </td>
                    <td className="col-points">
                      <span className="points-count">{user.points} pts</span>
                    </td>
                  </tr>
                ))}
                
                {leaderboard.length === 0 && (
                  <tr>
                    <td colSpan="4" className="empty-lb">Chưa có dữ liệu xếp hạng.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
