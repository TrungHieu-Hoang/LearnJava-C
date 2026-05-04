import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TheoryPanel from '../components/TheoryPanel';
import ExerciseList from '../components/ExerciseList';
import ExerciseDetail from '../components/ExerciseDetail';
import IDEPanel from '../components/IDEPanel';
import api from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const [language, setLanguage] = useState('java');
  const [topics, setTopics] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeExercise, setActiveExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get(`/topics?lang=${language}`);
        setTopics(res.data.topics);
        if (res.data.topics.length > 0) {
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

  // Fetch exercises based on language
  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/exercises?lang=${language}`);
        setExercises(res.data.exercises);
      } catch (err) {
        console.error('Error fetching exercises:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExercises();
    setActiveExercise(null); // Reset when language changes
  }, [language]);

  const fetchTopicDetail = async (topicId) => {
    try {
      const res = await api.get(`/topics/${topicId}`);
      setActiveTopic(res.data.topic);
      setActiveExercise(null); // Back to theory when changing topic
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
    } catch (err) {
      console.error('Error fetching exercise detail:', err);
    }
  };

  const handleBackToExercises = () => {
    setActiveExercise(null);
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-layout">
        {/* Left Column: Sidebar */}
        <div className="col-sidebar">
          <Sidebar 
            language={language} 
            setLanguage={setLanguage}
            topics={topics}
            activeTopic={activeTopic}
            setActiveTopic={handleTopicSelect}
          />
        </div>

        {/* Middle Column: Theory / Exercises */}
        <div className="col-content">
          {activeExercise ? (
            <ExerciseDetail 
              exercise={activeExercise} 
              onBack={handleBackToExercises} 
            />
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

        {/* Right Column: IDE */}
        <div className="col-ide">
          <IDEPanel 
            exercise={activeExercise} 
            defaultCode={activeExercise ? activeExercise.starterCode : activeTopic?.defaultCode}
            language={language}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
