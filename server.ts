import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  const DB_FILE = path.join(process.cwd(), "db.json");

  // Load store data
  app.get("/api/data", (req, res) => {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, "utf-8");
        return res.json(JSON.parse(content));
      }
      return res.json({ activeStoreId: "seasons-village", stores: {} });
    } catch (e: any) {
      console.error("Error reading db.json", e);
      res.status(500).json({ error: e.message });
    }
  });

  // Save store data
  app.post("/api/data", (req, res) => {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(req.body, null, 2), "utf-8");
      res.json({ success: true });
    } catch (e: any) {
      console.error("Error writing db.json", e);
      res.status(500).json({ error: e.message });
    }
  });

  // Initialize server-side Gemini API client
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  }) : null;

  // API Route for Gemini advisor / strategic generator
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const { prompt, type } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      if (!ai) {
        return res.status(500).json({ 
          error: "Gemini API Key is not configured. Please add GEMINI_API_KEY to secrets." 
        });
      }

      // Format beautiful context based on type or just direct prompt
      let systemInstruction = "You are a senior luxury retail strategist and brand advisor representing PASAYA, a renowned premium curtain, home textile, and high-fashion bedding brand based in Thailand, famous for formaldehyde-free, sanitary, and ultra-high-quality fabrics. You speak eloquently, professionally, and in a polished, luxury-brand tone. Answer in Thai unless requested otherwise. Use clear bullet points and elegant headings to present your ideas.";
      
      if (type === "proposal") {
        systemInstruction += " Write a highly professional, persuasive business partnership or rental proposal tailored for luxury mall management or B2B partners.";
      } else if (type === "marketing") {
        systemInstruction += " Develop an innovative, premium local marketing or social media campaign targeting affluent residents of luxury housing projects (10M+ Baht) in the Ratchaphruek-Nonthaburi area.";
      } else if (type === "story") {
        systemInstruction += " Craft a compelling, emotional story or customer journey about upgrading home interiors, emphasizing health (formaldehyde-free, sanitised protection), cooling features, and luxury lifestyle.";
      } else if (type === "b2b") {
        systemInstruction += " Write a highly professional presentation script or pitch targeted at elite architects, interior designers, and project developers to encourage them to specify PASAYA in their premium projects.";
      }

      // Try to generate content with retries and fallback models to handle 503 spikes gracefully
      const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
      let response = null;
      let lastError = null;

      for (const model of modelsToTry) {
        let attempts = 0;
        const maxAttempts = 2;
        while (attempts < maxAttempts) {
          try {
            console.log(`Attempting generation using model ${model} (attempt ${attempts + 1}/${maxAttempts})...`);
            response = await ai.models.generateContent({
              model: model,
              contents: prompt,
              config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
              }
            });
            if (response && response.text) {
              break;
            }
          } catch (err: any) {
            attempts++;
            lastError = err;
            console.warn(`Model ${model} failed on attempt ${attempts}:`, err.message || err);
            if (attempts < maxAttempts) {
              // Wait 1 second before retrying this model
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }
        if (response && response.text) {
          break;
        }
      }

      if (!response || !response.text) {
        return res.status(503).json({
          error: "ขณะนี้ระบบ AI ของ Google มีผู้ใช้งานหนาแน่นเป็นพิเศษ (Spikes in demand) กรุณารอสักครู่แล้วกดปุ่มเพื่อเริ่มใหม่อีกครั้ง หรือหากปัญหายังคงอยู่ คุณสามารถสลับใช้โมเดลสำรองได้อัตโนมัติ"
        });
      }

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "An error occurred with Gemini API" });
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

startServer();
