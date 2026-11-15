const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORTA = 3000;
const ARQUIVO_DADOS = path.join(__dirname, 'leads.json');

app.use(express.json());
app.use(express.static('public'));

if (!fs.existsSync(ARQUIVO_DADOS)) {
  fs.writeFileSync(ARQUIVO_DADOS, '[]');
}

app.get('/api/leads', (req, res) => {
  const dados = JSON.parse(fs.readFileSync(ARQUIVO_DADOS, 'utf8'));
  res.json(dados);
});

app.post('/api/leads', (req, res) => {
  const { nome, whatsapp, interesse } = req.body;
  if (!nome || !whatsapp) {
    return res.status(400).json({ erro: 'Nome e WhatsApp são obrigatórios.' });
  }

  const dados = JSON.parse(fs.readFileSync(ARQUIVO_DADOS, 'utf8'));
  const novoLead = {
    id: Date.now(),
    nome,
    whatsapp,
    interesse: interesse || 'Landing Page',
    data: new Date().toLocaleDateString('pt-BR')
  };

  dados.push(novoLead);
  fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(dados, null, 2));
  res.status(201).json(novoLead);
});

app.listen(PORTA, () => {
  console.log(`🚀 Servidor da Nascimento Solutions rodando em: http://localhost:${PORTA}`);
});
