import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeResume = async (req, res) => {
  try {
    const filePath = req.file.path;
    const resumeText = fs.readFileSync(filePath, "utf-8");

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are a resume screening assistant. Analyze this resume and return JSON with the following:
{
  "name": "...",
  "email": "...",
  "summary": "...",
  "skills": ["..."],
  "education": ["..."],
  "experience": ["..."]
}
Resume:
${resumeText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let jsonResult;
    try {
      jsonResult = JSON.parse(text);
    } catch (e) {
      return res
        .status(500)
        .json({ error: "Invalid JSON from Gemini response" });
    }

    res.json(jsonResult);
  } catch (error) {
    console.error("Gemini Error:", error);
    res
      .status(500)
      .json({ error: "Something went wrong while analyzing your resume." });
  }
};
