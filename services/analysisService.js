function extractJsonFromText(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);
  throw new Error("No valid JSON found");
}

async function analyzeResumeText(text) {
  const prompt = `You are an expert recruiter...`; // Gemini prompt
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const textResult = await response.text();
  return extractJsonFromText(textResult);
}

module.exports = { analyzeResumeText };
