import React from 'react';
import { Target, CheckCircle } from 'lucide-react';
import './ExerciseList.css';

const getSourceBadgeColor = (source) => {
  const colors = {
    'LeetCode': 'var(--badge-leetcode)',
    'HackerRank': 'var(--badge-hackerrank)',
    'Codeforces': 'var(--badge-codeforces)',
    'VNOJ': 'var(--badge-vnoj)',
    'GeeksforGeeks': 'var(--badge-gfg)'
  };
  return colors[source] || '#ffffff';
};

const getDifficultyColor = (difficulty) => {
  const colors = {
    'easy': 'var(--success)',
    'medium': 'var(--warning)',
    'hard': 'var(--error)'
  };
  return colors[difficulty] || '#ffffff';
};

const ExerciseList = ({ exercises, onSelectExercise }) => {
  return (
    <div className="exercise-list-container">
      <div className="exercise-list-header">
        <h3><Target size={20} /> Danh sách bài tập</h3>
      </div>
      
      <div className="exercises-grid">
        {exercises.map(exercise => (
          <div 
            key={exercise._id} 
            className="exercise-card glass-panel"
            onClick={() => onSelectExercise(exercise)}
          >
            <div className="exercise-card-header">
              <span 
                className="badge badge-source" 
                style={{ backgroundColor: getSourceBadgeColor(exercise.source) }}
              >
                {exercise.source}
              </span>
              <span 
                className="difficulty-dot"
                style={{ backgroundColor: getDifficultyColor(exercise.difficulty) }}
              ></span>
            </div>
            
            <h4 className="exercise-title">{exercise.title}</h4>
            
            <div className="exercise-stats">
              <span className="stat-item">
                <CheckCircle size={14} /> {exercise.acRate}% AC
              </span>
              <span className="stat-item points">
                +{exercise.points} pts
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseList;
