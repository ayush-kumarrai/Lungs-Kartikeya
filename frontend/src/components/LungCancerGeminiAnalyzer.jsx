import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './LungCancerGeminiAnalyzer.css';


const LungCancerGeminiAnalyzer = () => {
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [riskStatus, setRiskStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = 'AIzaSyBMf2LoAeGhHBcWFrEsgg1sdlopHphPmsQ';

  const genAI = new GoogleGenerativeAI(API_KEY);

  const styles = {
    riskButton: {
      padding: '10px 20px',
      borderRadius: '5px',
      border: 'none',
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '15px'
    },
    normalButton: {
      backgroundColor: 'green'
    },
    benignButton: {
      backgroundColor: 'yellow',
      color: 'black'
    },
    malignantButton: {
      backgroundColor: 'red'
    }
  };
  function parseAndHighlight(text) {
    const parts = text.split(/(\*\*.*?\*\*)/); // Split by **...**
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Remove ** and wrap in a styled span
        return (
          <span key={index} style={{ fontWeight: "bold", color: "black" }}>
            {part.slice(2, -2)}
          </span>
        );
      }
      return part; // Regular text
    });
  }
  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Analyze image using Gemini API
  const analyzeImage = async () => {
    if (!image) {
      setError('Please upload an image first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRiskStatus(null);

    try {
      // Remove the data URL prefix for base64
      const base64Image = image.split(',')[1];

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings: [
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          }
        ]
      });

      const prompt = `Analyze this medical image carefully.
      If it appears to be a lung MRI or X-ray or ct scan:
      1.    tell whter its normal, benign or malignant

      Classify the risk as:
      - "Normal" if no significant abnormalities are detected
      - "Benign" if abnormalities are present but do not appear cancerous
      - "Malignant" if there are strong indicators of potential cancer

      There should be no desclaimer of anything.`;

      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [
            { text: prompt },
            { 
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }]
      });

      const response = await result.response;
      const text = await response.text();

      setAnalysis(text);

      // Determine risk status
      if (text.toLowerCase().includes('normal')) {
        setRiskStatus('Normal');
      } else if (text.toLowerCase().includes('benign')) {
        setRiskStatus('Benign');
      } else if (text.toLowerCase().includes('malignant') || text.toLowerCase().includes('cancer')) {
        setRiskStatus('Malignant');
      }

    } catch (err) {
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lung-cancer-analyzer">
      <h2>Lung Cancer Image Analyzer</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
      />

      {image && (
        <div className="image-preview">
          <img
            src={image}
            alt="Uploaded"
            style={{ maxWidth: '300px', maxHeight: '300px' }}
          />
        </div>
      )}

      <button
        onClick={analyzeImage}
        disabled={!image || isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Image'}
      </button>

      {error && (
        <div className="error-message" style={{ color: 'red' }}>
          {error}
        </div>
      )}

      {analysis && (
        <div className="analysis-result">
          <h3>Gemini Analysis:</h3>
          <p>{parseAndHighlight(analysis)}</p>
        </div>
      )}

      {riskStatus && (
        <button 
          style={{
            ...styles.riskButton,
            ...(
              riskStatus === 'Normal' ? styles.normalButton :
              riskStatus === 'Benign' ? styles.benignButton :
              styles.malignantButton
            )
          }}
        >
          {riskStatus}
        </button>
      )}
    </div>
  );
};

export default LungCancerGeminiAnalyzer;