
const { GoogleGenerativeAI } = require('@google/generative-ai');
const apiKey = 'ADD API KEY '; 
let genAI;

try {
  genAI = new GoogleGenerativeAI(apiKey); // Initialisation de GoogleGenerativeAI avec la clé API
  console.log('GoogleGenerativeAI initialized');
} catch (error) {
  console.error('Failed to initialize GoogleGenerativeAI:', error);
}

/**
 * Fonction pour générer du contenu basé sur un prompt
 * @param {string} prompt - Le prompt pour générer du contenu
 * @returns {Promise<string>} - Le contenu généré ou un message d'erreur
 */

// async function generateContent(prompt) {
//   if (!genAI) {
//     console.error('GoogleGenerativeAI is not initialized.');
//     return 'Error: AI service is not available.';
//   }
  
//   try {
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Obtention du modèle de génération spécifié
//     const result = await model.generateContent(prompt); // Génération de contenu basé sur le prompt
//     return result.response.text(); // Renvoie le texte généré par le modèle
//   } catch (error) {
//     console.error('Error in generateContent:', error);
//     return 'Error occurred during content generation.';
//   }
// }

/**
 * Fonction pour démarrer un chat basé sur un prompt
 * @param {string} prompt - Le prompt pour démarrer le chat
 * @returns {Promise<string>} - La réponse du chat ou un message d'erreur
 */
async function startChat(prompt) {
  if (!genAI) {
    console.error('GoogleGenerativeAI is not initialized.');
    return 'Error: AI service is not available.';
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Obtention du modèle de génération spécifié
    const chat = model.startChat({ history: [] }); // Démarrage d'un nouveau chat avec historique vide
    const response = await chat.sendMessage(prompt); // Envoi du prompt au chat et attente de la réponse

    if (response.response.candidates && response.response.candidates.length > 0) {
      const firstCandidate = response.response.candidates[0];
      if (firstCandidate.content && firstCandidate.content.parts && firstCandidate.content.parts.length > 0) {
        const text = firstCandidate.content.parts.map(part => part.text).join(' '); // Construction du texte de réponse à partir des parties de contenu
        return text; // Renvoie le texte de réponse du chat
      }
    }
    return 'No response text found.'; // Aucun texte de réponse trouvé dans la réponse du chat
  } catch (error) {
    console.error('Error in startChat:', error);
    return 'Error occurred during chat.'; // Erreur survenue lors du chat
  }
}

module.exports = { startChat }; // Exporte les fonctions pour une utilisation externe
