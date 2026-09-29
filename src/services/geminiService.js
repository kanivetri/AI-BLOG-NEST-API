const { GoogleGenerativeAI } = require('@google/generative-ai');

const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const delays = [2000, 5000, 10000];

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Invalid Gemini response');
      }

      return text;

    } catch (error) {
      const message = error.message || '';

      if (!message.includes('503') || attempt === delays.length) {
        console.error("Gemini API Error:", message);
        throw error;
      }

      console.log(
        `Gemini temporarily unavailable. Retrying in ${delays[attempt] / 1000}s...`
      );

      await new Promise(resolve =>
        setTimeout(resolve, delays[attempt])
      );
    }
  }
};

module.exports = {
  callGemini,
};