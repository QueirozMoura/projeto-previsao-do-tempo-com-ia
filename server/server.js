import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // Lê as variáveis do .env

const app = express();
app.use(express.json());

// ================================
// Habilita CORS para permitir acesso do front-end
// ================================
app.use(cors());

// ================================
// Servir arquivos estáticos (caso queira usar pasta public)
// ================================
app.use(express.static('public'));

// ================================
// ROTA RAIZ
// ================================
app.get("/", (req, res) => {
  res.send("API de previsão do tempo com IA rodando 🚀");
});

// ================================
// ENDPOINT: PREVISÃO DO TEMPO
// ================================
app.get("/weather/:cidade", async (req, res) => {
  const cidade = req.params.cidade;
  const chaveWeather = process.env.CHAVE_WEATHER;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chaveWeather}&units=metric&lang=pt_br`;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar a previsão do tempo" });
  }
});

// ================================
// ENDPOINT: IA (SUGESTÃO DE ROUPA)
// ================================
app.post("/ia/roupa", async (req, res) => {
  const { cidade, temperatura, umidade } = req.body;
  const chaveIA = process.env.CHAVE_IA;

  try {
    const resposta = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${chaveIA}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "user",
              content: `
Estou em ${cidade}.
Temperatura: ${temperatura}
Umidade: ${umidade}

Com base nisso, sugira uma roupa adequada para hoje.
`
            }
          ]
        })
      }
    );

    const dados = await resposta.json();
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao gerar sugestão da IA" });
  }
});

// ================================
// INICIAR SERVIDOR
// ================================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
