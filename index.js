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
    const { nome, valor } = data; // ajuste conforme os dados que você espera
    const linha = `${nome},${valor}\n`;
    fs.appendFile(filePath, linha, (err) => {
        if (err) throw err;
        console.log('Dados salvos na planilha.');
    });
};

app.use(bodyParser.json());

app.post('/postback', (req, res) => {
    const data = req.body;

    // Salvar os dados na planilha
    appendToCSV(data);

    // Responder ao postback
    res.status(200).send('Dados recebidos com sucesso');
});

app.get('/download', (req, res) => {
    res.download(filePath, 'dados.csv');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
