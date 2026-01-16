import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));

const PORT = process.env.PORT || 3000;

// ===== ПРОВЕРКА РАБОТЫ =====
app.get("/", (req, res) => {
  res.send("ABS AI backend running");
});

// ===== ЧАТ С ЯНДЕКС GPT =====
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: "No messages" });
    }

    const response = await fetch(
      "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
      {
        method: "POST",
        headers: {
          "Authorization": `Api-Key ${process.env.YANDEX_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          modelUri: `gpt://${process.env.YANDEX_FOLDER_ID}/yandexgpt-lite`,
          completionOptions: {
            temperature: 0.7,
            maxTokens: 1000
          },
          messages
        })
      }
    );

    const data = await response.json();

    const answer =
      data.result?.alternatives?.[0]?.message?.text ||
      "Извините, сейчас нет ответа от модели.";

    res.json({ reply: answer });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
});

app.listen(PORT, () => {
  console.log("ABS AI backend running on port", PORT);
});
