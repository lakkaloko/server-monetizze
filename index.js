const { google } = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Chave única da Monetizze definida como variável de ambiente
const MONETIZZE_KEY = process.env.MONETIZZE_KEY;

// Autenticação com a Service Account usando a variável de ambiente GOOGLE_CREDENTIALS
const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Carregar o ID da planilha da variável de ambiente
const spreadsheetId = process.env.SPREADSHEET_ID;

// Função para adicionar uma linha na planilha do Google Sheets
const appendToGoogleSheet = async (data) => {
    const linha = [
        data.chave_unica || 'N/A',  // Adiciona a chave única na primeira coluna
        data.venda?.codigo || 'N/A',
        data.venda?.valor || 'N/A',
        data.venda?.dataInicio || 'N/A',
        data.venda?.dataFinalizada || 'N/A',
        data.venda?.status || 'N/A',
        data.venda?.meioPagamento || 'N/A',
        data.venda?.formaPagamento || 'N/A',
        data.produto?.codigo || 'N/A',
        data.produto?.nome || 'N/A',
        data.produto?.chave || 'N/A',
        data.comprador?.nome || 'N/A',
        data.comprador?.email || 'N/A',
        data.comprador?.cpf || 'N/A',
        data.comprador?.telefone || 'N/A',
        data.plano?.codigo || 'N/A',
        data.plano?.nome || 'N/A',
        data.plano?.valor || 'N/A'
    ];

    const request = {
        spreadsheetId: spreadsheetId,
        range: 'Sheet1', // Nome da aba da planilha
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [linha],
        },
        auth: auth,
    };

    try {
        const response = await sheets.spreadsheets.values.append(request);
        console.log(`${response.data.updates.updatedCells} células atualizadas.`);
    } catch (err) {
        console.error('Erro ao inserir dados na planilha do Google:', err);
    }
};

// Middleware para analisar o corpo das requisições como JSON
app.use(bodyParser.json());

// Rota para receber os postbacks
app.post('/postback', (req, res) => {
    console.log('Método da requisição:', req.method);
    console.log('Cabeçalhos da requisição:', req.headers);
    console.log('Dados recebidos:', JSON.stringify(req.body, null, 2));

    const data = req.body;

    // Verificar se a chave única no postback corresponde à chave configurada
    if (data.chave_unica !== MONETIZZE_KEY) {
        console.error('Chave única inválida!');
        return res.status(403).send('Forbidden: Chave única inválida');
    }

    if (!data || Object.keys(data).length === 0) {
        console.error('Corpo da requisição está vazio ou não foi processado corretamente.');
        return res.status(400).send('Bad Request: Corpo da requisição vazio');
    }

    appendToGoogleSheet(data);

    res.status(200).send('Dados recebidos com sucesso');
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
