import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PredictionForm from './components/PredictionForm';
import ReportAnalyzer from './components/ReportAnalyzer';
import './App.css';
import Navbar1 from './components/Navbar1';
import LungCancerGeminiAnalyzer from './components/LungCancerGeminiAnalyzer';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar1/>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<PredictionForm />} />
            <Route path="/report" element={<ReportAnalyzer />} />
            <Route path="/image" element={<LungCancerGeminiAnalyzer/>} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>© 2024 Lung Cancer Chatbot Kartikey</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;