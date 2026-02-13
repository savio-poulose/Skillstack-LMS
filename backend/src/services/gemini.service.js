const fetch = require("node-fetch");

async function generateQuizFromGemini(course) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
Generate 5 multiple choice questions.

Course Title: ${course.title}
Description: ${course.description}
Difficulty: ${course.level}

Return ONLY valid JSON array like:

[
 {
  "question": "",
  "options": ["","","",""],
  "correctIndex": 0
 }
]

No explanation. No markdown.
`
              }
            ]
          }
        ]
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Gemini API error:", data);
    throw new Error("Gemini request failed");
  }

  const text = data.candidates[0].content.parts[0].text;

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}

module.exports = { generateQuizFromGemini };