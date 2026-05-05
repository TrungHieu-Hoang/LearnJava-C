import React, { useState } from 'react';
import { ArrowLeft, Check, X, ChevronRight, ChevronDown } from 'lucide-react';
import './SubmissionResult.css';

const SubmissionResult = ({ submission, onBack, exercise }) => {
  const [expandedTests, setExpandedTests] = useState({});

  if (!submission) return null;

  const isAccepted = submission.status === 'accepted';

  const toggleTest = (idx) => {
    setExpandedTests(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="submission-result glass-panel">
      <div className="sr-header">
        <div className="sr-title">
          <h2>Submission of {exercise ? exercise.title : 'Bài tập'}</h2>
        </div>
      </div>

      <div className="sr-content">
        <h3 className="execution-results-title">Execution Results</h3>
        
        <div className="sr-global-status">
          {isAccepted ? (
            <span className="status-accepted-large"><Check size={24} /> ×{submission.totalTests}</span>
          ) : (
            <span className="status-failed-large"><X size={24} /> {submission.passedTests}/{submission.totalTests} Passed</span>
          )}
        </div>

        <div className="dmoj-test-list">
          {submission.testResults && submission.testResults.map((tr, idx) => {
            const isExpanded = !!expandedTests[idx];
            return (
              <div key={idx} className="dmoj-test-item">
                <div 
                  className="dmoj-test-header" 
                  onClick={() => toggleTest(idx)}
                >
                  <span className="dmoj-chevron">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                  <span className="dmoj-test-name">
                    <strong>Test case #{idx + 1}:</strong> 
                  </span>
                  <span className={`dmoj-test-status ${tr.passed ? 'text-success' : 'text-error'}`}>
                    {tr.passed ? 'Accepted' : 'Wrong Answer'}
                  </span>
                </div>

                {isExpanded && (
                  <div className="dmoj-test-details">
                    <div className="sr-detail-row">
                      <strong>Input:</strong>
                      <pre>{tr.input}</pre>
                    </div>
                    <div className="sr-detail-row">
                      <strong>Expected Output:</strong>
                      <pre>{tr.expectedOutput}</pre>
                    </div>
                    <div className="sr-detail-row">
                      <strong>Your Output:</strong>
                      <pre>{tr.actualOutput || (tr.error ? 'Error' : '')}</pre>
                    </div>
                    {tr.error && (
                      <div className="sr-detail-row sr-error">
                        <strong>Runtime Error:</strong>
                        <pre>{tr.error}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="dmoj-summary">
          <div><strong>Final score:</strong> {submission.passedTests}/{submission.totalTests}</div>
          {isAccepted && <div><strong>Points earned:</strong> {submission.points || 0}</div>}
        </div>
      </div>
    </div>
  );
};

export default SubmissionResult;
