const { google } = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Autenticação com a Service Account usando a variável de ambiente GOOGLE_CREDENTIALS
const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Carregar o ID da planilha da variável de ambiente
const spreadsheetId = process.env.SPREADSHEET_ID;

const appendToGoogleSheet = async (data) => {
    const nomeComprador = data.comprador.nome || 'N/A';
    const valorVenda = data.venda.valor || '0.00';
    const produtoNome = data.produto.nome || 'Produto Desconhecido';

    const request = {
        spreadsheetId: spreadsheetId,
        range: 'Sheet1!A:C', // Substitua pelo intervalo que deseja atualizar
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [
                [nomeComprador, valorVenda, produtoNome],
            ],
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

app.use(bodyParser.json());

app.post('/postback', (req, res) => {
    console.log('Dados recebidos:', req.body);

    const data = req.body;

    // Enviar os dados para o Google Sheets
    appendToGoogleSheet(data);

    res.status(200).send('Dados recebidos com sucesso');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
