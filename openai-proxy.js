
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY. Set it in your environment.");
}

app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: `Tu es un guide officiel de la médina de Fès.\nRéponds clairement et utilement.\n\nQuestion: ${question}`
          }
        ]
      })
    });
    const data = await response.json();
    let reply = "";
    if (data.output_text) {
      reply = data.output_text;
    } else if (data.output && data.output.length > 0) {
      reply = data.output[0].content?.[0]?.text || "";
    }
    res.json({ reply, raw: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`OpenAI proxy backend running on port ${PORT}`);
});
