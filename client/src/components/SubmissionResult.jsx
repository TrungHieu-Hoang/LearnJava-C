import React from 'react';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import './SubmissionResult.css';

const SubmissionResult = ({ submission, onBack }) => {
  if (!submission) return null;

  const isAccepted = submission.status === 'accepted';

  return (
    <div className="submission-result glass-panel">
      <div className="sr-header">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={20} /> Quay lại bài tập
        </button>
        <div className="sr-meta">
          <span className={`badge ${isAccepted ? 'badge-success' : 'badge-error'}`}>
            {isAccepted ? '🎉 Accepted' : '❌ Wrong Answer'}
          </span>
          {isAccepted && <span className="badge badge-points">+{submission.points || 0} pts</span>}
        </div>
      </div>

      <div className="sr-content">
        <div className="sr-summary">
          <h2>Kết quả nộp bài</h2>
          <p className="sr-stats">
            Đã vượt qua: <strong>{submission.passedTests} / {submission.totalTests}</strong> test cases.
          </p>
        </div>

        <div className="sr-test-list">
          {submission.testResults && submission.testResults.map((tr, idx) => (
            <div key={idx} className={`sr-test-card ${tr.passed ? 'passed' : 'failed'}`}>
              <div className="sr-test-header">
                <div className="sr-test-title">
                  {tr.passed ? <CheckCircle2 size={18} className="text-success" /> : <XCircle size={18} className="text-error" />}
                  <span>Test Case {idx + 1}</span>
                </div>
                <div className={`sr-test-status ${tr.passed ? 'text-success' : 'text-error'}`}>
                  {tr.passed ? 'Pass' : 'Fail'}
                </div>
              </div>

              {!tr.passed && (
                <div className="sr-test-details">
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmissionResult;
