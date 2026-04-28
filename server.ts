import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/analyze", async (req, res) => {
    const { achievements } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "AI API key missing" });
    }

    const prompt = `
      Analyze the following student achievements and provide a summary of their core strengths, 
      suggested skill levels (0-100), and top 3 career path recommendations.
      
      Achievements:
      ${achievements.map((a: any) => `- ${a.title}: ${a.description} (${a.category})`).join('\n')}
      
      Format the response as a clear, encouraging analysis for the student using Markdown.
    `;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      res.json({ analysis: result.response.text() });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "AI Analysis failed" });
    }
  });

  app.post("/api/verify-document", async (req, res) => {
    const { fileData, fileName, mimeType, achievementTitle } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "AI API key missing" });
    }

    const prompt = `
      You are an academic verification assistant. 
      Analyze this document and determine if it matches the claim: "${achievementTitle}".
      
      Extract the following information:
      1. Recipient Name
      2. Institution Name
      3. Date of Award/Completion
      4. Title of the Achievement
      
      Does it match the claim? (Yes/No)
      Provide a brief justification for your decision.
      
      Format your response as JSON:
      {
        "matches": boolean,
        "extractedInfo": { "name": string, "institution": string, "date": string, "title": string },
        "justification": string
      }
    `;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const part = {
        inlineData: {
          data: fileData,
          mimeType: mimeType
        }
      };

      const result = await model.generateContent([prompt, part]);
      const text = result.response.text();
      
      // Attempt to parse JSON from Markdown response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const verificationResult = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse AI response" };
      
      res.json(verificationResult);
    } catch (error) {
      console.error("Gemini Verification Error:", error);
      res.status(500).json({ error: "AI Verification failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
