import React, { useState, useEffect } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TheoryPanel from '../components/TheoryPanel';
import ExerciseList from '../components/ExerciseList';
import ExerciseDetail from '../components/ExerciseDetail';
import SubmissionResult from '../components/SubmissionResult';
import IDEPanel from '../components/IDEPanel';
import api from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const [language, setLanguage] = useState(() => localStorage.getItem('cc_lang') || 'java');
  const [topics, setTopics] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeExercise, setActiveExercise] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [exerciseTab, setExerciseTab] = useState('description');
  const [isLoading, setIsLoading] = useState(true);
  const [ideWidth, setIdeWidth] = useState(600); // Chiều rộng mặc định của IDE
  const [isResizing, setIsResizing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Xử lý kéo thả để resize IDE
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX - 16; // 16px là padding container
      if (newWidth > 350 && newWidth < window.innerWidth - 300) {
        setIdeWidth(newWidth);
      }
    };

    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const startResize = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  // Fetch topics
  useEffect(() => {
    localStorage.setItem('cc_lang', language);
    const fetchTopics = async () => {
      try {
        const res = await api.get(`/topics?lang=${language}`);
        setTopics(res.data.topics);
        
        const savedTopicId = localStorage.getItem('cc_topic');
        const savedExerciseId = localStorage.getItem('cc_exercise');

        if (savedTopicId && res.data.topics.some(t => t._id === savedTopicId)) {
          fetchTopicDetail(savedTopicId, savedExerciseId);
        } else if (res.data.topics.length > 0) {
          fetchTopicDetail(res.data.topics[0]._id);
        } else {
          setActiveTopic(null);
        }
      } catch (err) {
        console.error('Error fetching topics:', err);
      }
    };
    fetchTopics();
  }, [language]);

  const fetchExercises = async () => {
    setIsLoading(true);
    try {
      if (!activeTopic) return;
      const res = await api.get(`/exercises?topicId=${activeTopic._id}`);
      setExercises(res.data.exercises);
    } catch (err) {
      console.error('Error fetching exercises:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch exercises based on active topic
  useEffect(() => {
    if (activeTopic) {
      localStorage.setItem('cc_topic', activeTopic._id);
      fetchExercises();
    } else {
      localStorage.removeItem('cc_topic');
      setExercises([]);
    }
  }, [activeTopic]);

  useEffect(() => {
    if (activeExercise) {
      localStorage.setItem('cc_exercise', activeExercise._id);
    } else {
      localStorage.removeItem('cc_exercise');
    }
  }, [activeExercise]);

  const fetchTopicDetail = async (topicId, exerciseIdToRestore = null) => {
    try {
      const res = await api.get(`/topics/${topicId}`);
      setActiveTopic(res.data.topic);
      
      if (exerciseIdToRestore) {
        const exRes = await api.get(`/exercises/${exerciseIdToRestore}`);
        setActiveExercise(exRes.data.exercise);
        setExerciseTab('description');
      } else {
        setActiveExercise(null);
      }
      setSubmissionResult(null);
    } catch (err) {
      console.error('Error fetching topic detail:', err);
    }
  };

  const handleTopicSelect = (topic) => {
    fetchTopicDetail(topic._id);
  };

  const handleExerciseSelect = async (exercise) => {
    try {
      // Fetch full exercise details including test cases
      const res = await api.get(`/exercises/${exercise._id}`);
      setActiveExercise(res.data.exercise);
      setSubmissionResult(null);
      setExerciseTab('description');
    } catch (err) {
      console.error('Error fetching exercise detail:', err);
    }
  };

  const handleBackToExercises = () => {
    setActiveExercise(null);
    setSubmissionResult(null);
  };

  const handleSubmissionComplete = (result) => {
    setSubmissionResult(result);
    setExerciseTab('result'); // Tự động chuyển sang tab kết quả
    // Refresh exercises to update AC rate and stats
    if (activeTopic) {
      fetchExercises();
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className={`dashboard-layout ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        {/* Left Column: Sidebar */}
        {isSidebarOpen && (
          <div className="col-sidebar">
            <Sidebar 
              language={language} 
              setLanguage={setLanguage}
              topics={topics}
              activeTopic={activeTopic}
              setActiveTopic={handleTopicSelect}
            />
          </div>
        )}

        {/* Middle Column: Theory / Exercises */}
        <div className="col-content">
          <button 
            className={`sidebar-toggle-btn ${!isSidebarOpen ? 'closed' : ''}`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title={isSidebarOpen ? "Ẩn Lộ trình học" : "Hiện Lộ trình học"}
          >
            {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>

          {activeExercise ? (
            <div className="exercise-workspace">
              <div className="workspace-tabs">
                <button 
                  className={`workspace-tab ${exerciseTab === 'description' ? 'active' : ''}`}
                  onClick={() => setExerciseTab('description')}
                >
                  📝 Đề bài
                </button>
                <button 
                  className={`workspace-tab ${exerciseTab === 'result' ? 'active' : ''}`}
                  onClick={() => setExerciseTab('result')}
                  disabled={!submissionResult}
                >
                  ✅ Kết quả nộp
                </button>
              </div>
              
              <div className="workspace-content">
                {exerciseTab === 'description' && (
                  <ExerciseDetail 
                    exercise={activeExercise} 
                    onBack={handleBackToExercises} 
                  />
                )}
                {exerciseTab === 'result' && submissionResult && (
                  <SubmissionResult 
                    submission={submissionResult} 
                    exercise={activeExercise}
                    onBack={() => setExerciseTab('description')} 
                  />
                )}
              </div>
            </div>
          ) : activeTopic ? (
            <div className="theory-exercise-split">
              <TheoryPanel topic={activeTopic} />
              {!isLoading && (
                <ExerciseList 
                  exercises={exercises} 
                  onSelectExercise={handleExerciseSelect} 
                />
              )}
            </div>
          ) : (
            <div className="empty-state glass-panel">
              <p>Chưa có dữ liệu cho ngôn ngữ này.</p>
            </div>
          )}
        </div>

        {/* Resizer Handle */}
        <div 
          className={`layout-resizer ${isResizing ? 'resizing' : ''}`} 
          onMouseDown={startResize}
        >
          <div className="resizer-dots"></div>
        </div>

        {/* Right Column: IDE */}
        <div className="col-ide" style={{ '--ide-width': `${ideWidth}px` }}>
          <IDEPanel 
            exercise={activeExercise} 
            defaultCode={activeExercise ? activeExercise.starterCode : activeTopic?.defaultCode}
            language={language}
            onSubmissionComplete={handleSubmissionComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
