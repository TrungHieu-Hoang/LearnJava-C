import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { Search, Filter, PieChart } from 'lucide-react';
import './Submissions.css';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterLang, setFilterLang] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get('/submissions/me');
        setSubmissions(res.data.submissions);
      } catch (err) {
        console.error('Error fetching submissions', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}, ${d.toLocaleDateString()}`;
  };

  const filteredSubs = submissions.filter(s => {
    if (filterLang !== 'All' && s.language !== filterLang) return false;
    if (filterStatus !== 'All' && s.status !== filterStatus) return false;
    return true;
  });

  // Calculate stats for Pie Chart
  const stats = {
    accepted: filteredSubs.filter(s => s.status === 'accepted').length,
    wrong: filteredSubs.filter(s => s.status === 'wrong').length,
    tle: filteredSubs.filter(s => s.status === 'tle').length,
    error: filteredSubs.filter(s => s.status === 'error').length,
  };
  const totalStats = filteredSubs.length || 1;

  const getStatusDisplay = (status, passed, total) => {
    if (status === 'accepted') return { color: 'var(--success)', text: 'AC', bg: 'rgba(34, 197, 94, 0.2)' };
    if (status === 'wrong') return { color: 'var(--error)', text: 'WA', bg: 'rgba(239, 68, 68, 0.2)' };
    if (status === 'tle') return { color: 'var(--warning)', text: 'TLE', bg: 'rgba(245, 158, 11, 0.2)' };
    return { color: 'var(--text-muted)', text: 'ERR', bg: 'rgba(255, 255, 255, 0.1)' };
  };

  const getLanguageLabel = (lang) => {
    const map = { 'java': 'Java', 'cpp': 'C++', 'c': 'C', 'python': 'Py 3' };
    return map[lang] || lang;
  };

  const conicGradient = `conic-gradient(
    var(--success) 0% ${(stats.accepted/totalStats)*100}%,
    var(--error) ${(stats.accepted/totalStats)*100}% ${((stats.accepted+stats.wrong)/totalStats)*100}%,
    var(--warning) ${((stats.accepted+stats.wrong)/totalStats)*100}% ${((stats.accepted+stats.wrong+stats.tle)/totalStats)*100}%,
    gray ${((stats.accepted+stats.wrong+stats.tle)/totalStats)*100}% 100%
  )`;

  return (
    <div className="submissions-page">
      <Navbar />
      
      <div className="submissions-container">
        <div className="submissions-header">
          <h2>All Submissions</h2>
        </div>

        <div className="submissions-layout">
          {/* Main List */}
          <div className="submissions-list glass-panel">
            {isLoading ? (
              <div className="loading-state">Đang tải lịch sử...</div>
            ) : filteredSubs.length === 0 ? (
              <div className="empty-state">Không tìm thấy kết quả nào.</div>
            ) : (
              <table className="dmoj-table">
                <tbody>
                  {filteredSubs.map(sub => {
                    const display = getStatusDisplay(sub.status, sub.passedTests, sub.totalTests);
                    return (
                      <tr key={sub._id} className="dmoj-row">
                        <td className="dmoj-status-box" style={{ backgroundColor: display.bg }}>
                          <div className="dmoj-score" style={{ color: display.color }}>
                            {sub.passedTests} / {sub.totalTests}
                          </div>
                          <div className="dmoj-lang" style={{ color: display.color }}>
                            {display.text} | {getLanguageLabel(sub.language)}
                          </div>
                        </td>
                        <td className="dmoj-info">
                          <div className="dmoj-title">{sub.exerciseId?.title || 'Bài tập đã xóa'}</div>
                          <div className="dmoj-date">{formatDate(sub.executedAt)}</div>
                        </td>
                        <td className="dmoj-perf">
                          <div><strong>+{sub.status === 'accepted' ? sub.exerciseId?.points || 0 : 0}</strong> pts</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Right Sidebar Filters & Stats */}
          <div className="submissions-sidebar">
            <div className="glass-panel sidebar-box">
              <div className="box-header">
                <h3><Filter size={16} /> Filter submissions</h3>
              </div>
              <div className="box-content filter-form">
                <div className="form-group">
                  <label>Status</label>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="dmoj-select">
                    <option value="All">All</option>
                    <option value="accepted">Accepted (AC)</option>
                    <option value="wrong">Wrong Answer (WA)</option>
                    <option value="tle">Time Limit Exceeded (TLE)</option>
                    <option value="error">Runtime Error (ERR)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Language</label>
                  <select value={filterLang} onChange={e => setFilterLang(e.target.value)} className="dmoj-select">
                    <option value="All">All</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                    <option value="python">Python</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="glass-panel sidebar-box">
              <div className="box-header">
                <h3><PieChart size={16} /> Statistics</h3>
              </div>
              <div className="box-content stats-content">
                <div className="dmoj-pie-chart" style={{ background: conicGradient }}></div>
                <div className="pie-legend">
                  <div className="legend-item"><span className="dot ac"></span> AC: {stats.accepted}</div>
                  <div className="legend-item"><span className="dot wa"></span> WA: {stats.wrong}</div>
                  <div className="legend-item"><span className="dot tle"></span> TLE: {stats.tle}</div>
                  <div className="legend-item"><span className="dot err"></span> ERR: {stats.error}</div>
                </div>
                <div className="stats-total">Total: {filteredSubs.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submissions;
