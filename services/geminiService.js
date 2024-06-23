
const { GoogleGenerativeAI } = require('@google/generative-ai');
const apiKey = 'AIzaSyDC87k5wrXs7E-DI2LVqAChK5anDhhapRs'; // Remplacez par votre clé API

let genAI;


try {
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('GoogleGenerativeAI initialized');
} catch (error) {
  console.error('Failed to initialize GoogleGenerativeAI:', error);
}

async function generateContent(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error in generateContent:', error);
    return 'Error occurred during content generation.';
  }
}

async function startChat(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = model.startChat({ history: [] });
    const response = await chat.sendMessage(prompt);

    if (response.response.candidates && response.response.candidates.length > 0) {
      const firstCandidate = response.response.candidates[0];
      if (firstCandidate.content && firstCandidate.content.parts && firstCandidate.content.parts.length > 0) {
        const text = firstCandidate.content.parts.map(part => part.text).join(' ');
        return text;
      }
    }
    return 'No response text found.';
  } catch (error) {
    if (error.response) {
      console.error('Error fetching response:', error.response.data);
      console.error('Status code:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error fetching response: No response received');
      console.error('Request details:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    console.error('Config details:', error.config);
    return 'Error occurred during chat.';
  }
}

module.exports = { generateContent, startChat };