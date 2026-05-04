import React from 'react';
import './TheoryPanel.css';

const TheoryPanel = ({ topic }) => {
  if (!topic) return null;

  return (
    <div className="theory-panel glass-panel">
      <div className="theory-header">
        <h2>{topic.title}</h2>
      </div>
      <div 
        className="theory-content"
        dangerouslySetInnerHTML={{ __html: topic.theoryHTML }}
      ></div>
    </div>
  );
};

export default TheoryPanel;
