import React from 'react';
import { ArrowLeft, Tag } from 'lucide-react';
import './ExerciseDetail.css';

const ExerciseDetail = ({ exercise, onBack }) => {
  if (!exercise) return null;

  return (
    <div className="exercise-detail glass-panel">
      <div className="exercise-detail-header">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={20} /> Quay lại
        </button>
        <div className="exercise-meta">
          <span className="badge badge-source">{exercise.source}</span>
          <span className="badge badge-points">+{exercise.points} pts</span>
        </div>
      </div>

      <div className="exercise-detail-content">
        <h2>{exercise.title}</h2>
        
        <div className="exercise-tags">
          {exercise.tags && exercise.tags.map((tag, idx) => (
            <span key={idx} className="tag">
              <Tag size={12} /> {tag}
            </span>
          ))}
        </div>

        <div 
          className="exercise-desc"
          dangerouslySetInnerHTML={{ __html: exercise.description }}
        ></div>

        <div className="test-cases-preview">
          <h3>Test Cases Mẫu</h3>
          {exercise.testCases && exercise.testCases.map((tc, idx) => (
            <div key={idx} className="tc-preview-card">
              <div className="tc-label">Test Case {idx + 1}</div>
              <div className="tc-data">
                <div className="tc-col">
                  <strong>Input:</strong>
                  <pre>{tc.input}</pre>
                </div>
                <div className="tc-col">
                  <strong>Expected Output:</strong>
                  <pre>{tc.expectedOutput}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;
