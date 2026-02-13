const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.generateQuizFromText = async (text) => {
  const response = await genAI.models.generateContent({
    model: "gemini-1.5-flash",
    contents: `
Generate 5 multiple-choice questions from the content below.

Rules:
- 4 options per question
- One correct answer
- Beginner to intermediate level
- Return ONLY valid JSON
- No markdown
- No explanation text

JSON format:
{
  "questions": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "correctIndex": 0
    }
  ]
}

CONTENT:
${text.slice(0, 6000)}
`
  });

  const responseText = response.text;

  console.log("RAW AI RESPONSE:", responseText);

  const cleaned = responseText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini JSON parse failed");
    console.error(cleaned);
    throw new Error("Invalid AI response format");
  }
};