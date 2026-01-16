import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

/* ===== MIDDLEWARE ===== */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

/* ===== HEALTH CHECK ===== */
app.get("/", (req, res) => {
  res.send("ABS AI backend running");
});

/* ===== CHAT ENDPOINT ===== */
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: "Empty prompt" });
    }

    const response = await fetch(
      "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Api-Key ${process.env.YANDEX_API_KEY}`
        },
        body: JSON.stringify({
          modelUri: `gpt://${process.env.YANDEX_FOLDER_ID}/yandexgpt-lite`,
          completionOptions: {
            stream: false,
            temperature: 0.6,
            maxTokens: 800
          },
          messages: [
            { role: "system", text: "Ты — мощный ИИ ассистент ABS AI. Отвечай чётко и умно." },
            { role: "user", text: prompt }
          ]
        })
      }
    );

    const data = await response.json();

    const answer =
      data?.result?.alternatives?.[0]?.message?.text ||
      "Нет ответа от модели";

    res.json({ answer });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

/* ===== START SERVER ===== */
app.listen(PORT, () => {
  console.log(`ABS AI backend running on port ${PORT}`);
});
