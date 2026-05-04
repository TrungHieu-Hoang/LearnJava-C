import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { BookOpen, Terminal, Code2, Coffee } from 'lucide-react';
import { tutorialsData } from '../data/tutorialsData';
import './Tutorials.css';

const Tutorials = () => {
  const [activeLang, setActiveLang] = useState('java');
  const [activeDoc, setActiveDoc] = useState(tutorialsData['java'][0]);

  const handleLangChange = (lang) => {
    setActiveLang(lang);
    setActiveDoc(tutorialsData[lang][0]);
  };

  const getLangIcon = (lang) => {
    switch(lang) {
      case 'java': return <Coffee size={18} />;
      case 'cpp': return <Code2 size={18} />;
      case 'c': return <Terminal size={18} />;
      case 'python': return <Terminal size={18} />;
      default: return <BookOpen size={18} />;
    }
  };

  const getLangName = (lang) => {
    switch(lang) {
      case 'java': return 'Java';
      case 'cpp': return 'C++';
      case 'c': return 'C';
      case 'python': return 'Python';
      default: return '';
    }
  };

  return (
    <div className="tutorials-page">
      <Navbar />
      
      <div className="tut-container">
        {/* Lựa chọn ngôn ngữ */}
        <div className="tut-sidebar glass-panel">
          <div className="lang-selector">
            {['java', 'cpp', 'c', 'python'].map(lang => (
              <button 
                key={lang}
                className={`lang-tab ${activeLang === lang ? 'active' : ''}`}
                onClick={() => handleLangChange(lang)}
              >
                {getLangIcon(lang)} {getLangName(lang)}
              </button>
            ))}
          </div>

          {/* Danh sách bài học */}
          <div className="tut-nav">
            <h3>Nội dung bài học</h3>
            <div className="tut-links">
              {tutorialsData[activeLang].map(doc => (
                <button 
                  key={doc.id}
                  className={`tut-link ${activeDoc.id === doc.id ? 'active' : ''}`}
                  onClick={() => setActiveDoc(doc)}
                >
                  {doc.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Nội dung chi tiết */}
        <div className="tut-content glass-panel">
          <div 
            className="tut-article"
            dangerouslySetInnerHTML={{ __html: activeDoc.content }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Tutorials;
