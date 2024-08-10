const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configurar o diretório para salvar a planilha
const filePath = path.join(__dirname, 'dados.csv');

// Função para adicionar dados à planilha
const appendToCSV = (data) => {
    const { nome, valor } = data; // Ajuste conforme os dados esperados
    const linha = `${nome},${valor}\n`;
    fs.appendFile(filePath, linha, (err) => {
        if (err) throw err;
        console.log('Dados salvos na planilha.');
    });
};

app.use(bodyParser.json());

// Rota raiz
app.get('/', (req, res) => {
    res.send('Servidor está funcionando. Use /postback para enviar dados e /download para baixar a planilha.');
});

// Endpoint para receber postback
app.post('/postback', (req, res) => {
    console.log('Dados recebidos:', req.body); // Log para depuração

    const data = req.body;

    if (!data.nome || !data.valor) {
        return res.status(400).send('Dados inválidos');
    }

    // Salvar os dados na planilha
    appendToCSV(data);

    // Responder ao postback
    res.status(200).send('Dados recebidos com sucesso');
});

// Endpoint para download da planilha
app.get('/download', (req, res) => {
    res.download(filePath, 'dados.csv');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
