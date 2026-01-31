import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Lê as variáveis do .env

const app = express();
app.use(express.json());

// Endpoint para previsao do tempo
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

// Rodando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
