import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, Loader2, TerminalSquare } from 'lucide-react';
import api from '../api';
import './IDEPanel.css';

const IDEPanel = ({ exercise, defaultCode, language }) => {
  const [code, setCode] = useState(defaultCode || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setCode(defaultCode || '');
    setOutput('');
    setTestResults(null);
    setStatus(null);
  }, [exercise, defaultCode, language]);

  const handleRun = async () => {
    if (!code.trim()) return;
    setIsRunning(true);
    setOutput('Đang biên dịch và chạy code...');
    setTestResults(null);
    setStatus(null);
    
    try {
      // Run with first test case input if available
      const input = exercise?.testCases?.[0]?.input || '';
      const res = await api.post('/submissions/run', { code, language, input });
      
      let outText = res.data.output;
      if (res.data.error) {
        outText = res.data.error;
        setStatus('error');
      } else {
        setStatus('success');
      }
      
      if (res.data.timedOut) {
        setStatus('tle');
        outText = 'Time Limit Exceeded (5s)';
      }
      
      setOutput(outText);
    } catch (err) {
      setOutput(err.response?.data?.message || 'Lỗi kết nối máy chủ');
      setStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim() || !exercise) return;
    setIsSubmitting(true);
    setOutput('Đang nộp bài và chấm điểm...');
    setTestResults(null);
    
    try {
      const res = await api.post('/submissions/submit', { 
        code, 
        language, 
        exerciseId: exercise._id 
      });
      
      const sub = res.data.submission;
      setStatus(sub.status);
      setTestResults(sub.testResults);
      
      if (sub.status === 'accepted') {
        setOutput(`🎉 Chúc mừng! Bạn đã giải thành công.\n+${sub.points} điểm.`);
      } else {
        setOutput(`❌ Bài giải chưa chính xác. Đã pass ${sub.passedTests}/${sub.totalTests} test cases.`);
      }
    } catch (err) {
      setOutput(err.response?.data?.message || 'Lỗi khi nộp bài');
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ide-panel glass-panel">
      <div className="ide-header">
        <div className="ide-title">
          <TerminalSquare size={18} /> Code Editor
        </div>
        <div className="ide-actions">
          <button 
            className="btn btn-secondary ide-btn" 
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
          >
            {isRunning ? <Loader2 size={16} className="spin" /> : <Play size={16} />} 
            Chạy thử
          </button>
          
          {exercise && (
            <button 
              className="btn btn-primary ide-btn" 
              onClick={handleSubmit}
              disabled={isRunning || isSubmitting}
            >
              {isSubmitting ? <Loader2 size={16} className="spin" /> : <Send size={16} />} 
              Nộp bài
            </button>
          )}
        </div>
      </div>
      
      <div className="editor-container">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'Fira Code',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            roundedSelection: false,
            padding: { top: 16 }
          }}
        />
      </div>
      
      <div className="console-panel">
        <div className="console-header">Console Output</div>
        <div className={`console-content ${status}`}>
          <pre>{output}</pre>
          
          {testResults && (
            <div className="test-results">
              <h4>Chi tiết Test Cases:</h4>
              {testResults.map((tr, idx) => (
                <div key={idx} className={`test-case-card ${tr.passed ? 'passed' : 'failed'}`}>
                  <div className="test-case-header">
                    Test Case {idx + 1}: {tr.passed ? '✅ Pass' : '❌ Fail'}
                  </div>
                  {!tr.passed && (
                    <div className="test-case-details">
                      <div><strong>Input:</strong> <pre>{tr.input}</pre></div>
                      <div><strong>Expected:</strong> <pre>{tr.expectedOutput}</pre></div>
                      <div><strong>Actual:</strong> <pre>{tr.actualOutput || (tr.error ? 'Error' : '')}</pre></div>
                      {tr.error && <div className="test-error"><pre>{tr.error}</pre></div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDEPanel;
