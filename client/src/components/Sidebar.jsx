import React from 'react';
import { BookOpen, Code2 } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ language, setLanguage, topics, activeTopic, setActiveTopic }) => {
  return (
    <aside className="sidebar glass-panel">
      <div className="language-selector" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
        <button 
          className={`lang-btn ${language === 'java' ? 'active' : ''}`}
          onClick={() => setLanguage('java')}
        >
          Java
        </button>
        <button 
          className={`lang-btn ${language === 'cpp' ? 'active' : ''}`}
          onClick={() => setLanguage('cpp')}
        >
          C++
        </button>
        <button 
          className={`lang-btn ${language === 'c' ? 'active' : ''}`}
          onClick={() => setLanguage('c')}
        >
          C
        </button>
        <button 
          className={`lang-btn ${language === 'python' ? 'active' : ''}`}
          onClick={() => setLanguage('python')}
        >
          Python
        </button>
      </div>

      <div className="topics-list">
        <h3 className="sidebar-title">
          <BookOpen size={18} /> Lộ trình học
        </h3>
        
        <div className="topics-scroll">
          {topics.map((topic, index) => (
            <button
              key={topic._id}
              className={`topic-item ${activeTopic?._id === topic._id ? 'active' : ''}`}
              onClick={() => setActiveTopic(topic)}
            >
              <div className="topic-number">{index + 1}</div>
              <div className="topic-content">
                <div className="topic-title">{topic.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
