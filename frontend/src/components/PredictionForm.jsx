import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import confetti from 'canvas-confetti';

const API_KEY = 'AIzaSyDbc7myFPdKG3LrnUQE6cqQ2TwyDyUT-Xs';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro"});

const PredictionForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    smoking: '',
    yellow_fingers: '',
    anxiety: '',
    peer_pressure: '',
    chronic_disease: '',
    fatigue: '',
    allergy: '',
    wheezing: '',
    alcohol: '',
    coughing: '',
    shortness_of_breath: '',
    swallowing_difficulty: '',
    chest_pain: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentChatInput, setCurrentChatInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateRiskAssessment = async () => {
    try {
      // Construct a detailed prompt for risk assessment
      const prompt = `Perform a lung cancer risk assessment based on the following patient details:
      - Gender: ${formData.gender}
      - Age: ${formData.age}
      - Smoking: ${formData.smoking}
      - Yellow Fingers: ${formData.yellow_fingers}
      - Anxiety: ${formData.anxiety}
      - Peer Pressure: ${formData.peer_pressure}
      - Chronic Disease: ${formData.chronic_disease}
      - Fatigue: ${formData.fatigue}
      - Allergy: ${formData.allergy}
      - Wheezing: ${formData.wheezing}
      - Alcohol: ${formData.alcohol}
      - Coughing: ${formData.coughing}
      - Shortness of Breath: ${formData.shortness_of_breath}
      - Swallowing Difficulty: ${formData.swallowing_difficulty}
      - Chest Pain: ${formData.chest_pain}

      Provide:
      1. An overall risk assessment (Low/Moderate/High)
      2. Probability percentage of lung cancer risk
      3. Brief explanation of key risk factors
      4. Recommended next steps for the patient

      Format the response as:
      Risk Level: [Low/Moderate/High]
      Probability: X%
      Explanation: [Concise explanation]
      Recommendations: [Actionable medical advice]`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      setPrediction(response);
      
      // Initialize chat with risk assessment
      setChatMessages([
        { role: 'system', content: response },
        { role: 'assistant', content: "Based on the risk assessment, I'm here to answer any questions you may have about your lung health." }
      ]);
    } catch (error) {
      console.error('Risk assessment error', error);
      setPrediction("Unable to perform risk assessment. Please consult a healthcare professional.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await generateRiskAssessment();
  };

  const generateChatResponse = async (context) => {
    try {
      const result = await model.generateContent(context);
      return result.response.text();
    } catch (error) {
      console.error('Chat generation error', error);
      return "I'm having trouble generating a response. Could you rephrase your question?";
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!currentChatInput.trim()) return;

    const userMessage = { role: 'user', content: currentChatInput };
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setCurrentChatInput('');
    
    try {
      const chatContext = updatedMessages.map(msg => 
        `${msg.role === 'user' ? 'Patient' : 'Assistant'}: ${msg.content}`
      ).join('\n');
      
      const aiResponse = await generateChatResponse(chatContext);
      setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Chat error', error);
    }
  };

  const handleClick = () => {
    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };


  return (
    <>
    <div className="prediction-form">
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map(field => (
          <div key={field} className="form-group">
            <label>{field.replace(/_/g, ' ')}</label>
            {field === 'age' ? (
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="0"
                max="120"
                required
              />
            ) : field === 'gender' ? (
              <select
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            ) : (
              <select
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="YES">Yes</option>
                <option value="NO">No</option>
              </select>
            )}
          </div>
        ))}
       <button
      type="submit"
      onClick={handleClick}
      className="relative overflow-visible rounded-full hover:-translate-y-1 px-12 shadow-xl bg-background/30 
                 after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-background/40 
                 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0"
    >
      {isLoading ? 'Loading...' : 'Assess Risk'}
    </button>
      </form>

      {prediction && (
        <div className="prediction-result">
          <h2>Risk Assessment</h2>
          <pre>{prediction.replace(/\*/g, '')}</pre>
        </div>
      )}

      {chatMessages.length > 0 && (
        <div className="chat-container">
          <div className="chat-messages">
            {chatMessages.slice(1).map((msg, index) => (
              <div 
                key={index} 
                className={`message ${
                  msg.role === 'user' ? 'user-message' : 'assistant-message'
                }`}
              >
                {msg.content.replace(/\*/g, '')}
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} className="chat-input">
            <input
              type="text"
              value={currentChatInput}
              onChange={(e) => setCurrentChatInput(e.target.value)}
              placeholder="Ask a question..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
    </>
  );
};

export default PredictionForm;