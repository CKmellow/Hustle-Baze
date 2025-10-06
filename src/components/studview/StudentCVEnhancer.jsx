import React, { useState } from 'react';
import axios from 'axios';
import './StudentCVEnhancer.css';

export default function StudentCVEnhancer() {
  const [cvText, setCvText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [enhancedCV, setEnhancedCV] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnhance = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai-enhance-cv', {
        cvText,
        jobDescription
      });
      setEnhancedCV(res.data.enhancedCV);
    } catch (err) {
      console.error(err);
      setEnhancedCV("Error enhancing CV");
    }
    setLoading(false);
  };

  return (
<div className="cv-enhancer-container">
  <h2 className="cv-title">AI CV Enhancer</h2>

  <textarea
    placeholder="Paste your CV or skill description here..."
    rows={6}
    className="cv-textarea"
    value={cvText}
    onChange={(e) => setCvText(e.target.value)}
  />

  <textarea
    placeholder="Optional: Paste a job/internship description here..."
    rows={4}
    className="cv-textarea"
    value={jobDescription}
    onChange={(e) => setJobDescription(e.target.value)}
  />

  <button
    onClick={handleEnhance}
    className="cv-button"
    disabled={loading}
  >
    {loading ? 'Enhancing...' : 'Revamp CV'}
  </button>

  {enhancedCV && (
    <div className="cv-output">
      <h3 className="cv-output-title">Enhanced CV:</h3>
      <pre className="cv-output-text">{enhancedCV}</pre>
    </div>
  )}
</div>

  );
}
