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
    const linha = [
        data.chave_unica || 'N/A',
        (data.produto && data.produto.codigo) || 'N/A',
        (data.produto && data.produto.nome) || 'N/A',
        (data.produto && data.produto.chave) || 'N/A',
        (data.tipoPostback && data.tipoPostback.codigo) || 'N/A',
        (data.tipoPostback && data.tipoPostback.descricao) || 'N/A',
        (data.venda && data.venda.codigo) || 'N/A',
        (data.venda && data.venda.dataInicio) || 'N/A',
        (data.venda && data.venda.dataFinalizada) || 'N/A',
        (data.venda && data.venda.meioPagamento) || 'N/A',
        (data.venda && data.venda.formaPagamento) || 'N/A',
        (data.venda && data.venda.garantiaRestante) || 'N/A',
        (data.venda && data.venda.status) || 'N/A',
        (data.venda && data.venda.valor) || 'N/A',
        (data.venda && data.venda.quantidade) || 'N/A',
        (data.venda && data.venda.tipo_frete) || 'N/A',
        (data.venda && data.venda.frete) || 'N/A',
        (data.venda && data.venda.valorRecebido) || 'N/A',
        (data.venda && data.venda.plano) || 'N/A',
        (data.venda && data.venda.cupom) || 'N/A',
        (data.venda && data.venda.linkBoleto) || 'N/A',
        (data.venda && data.venda.linha_digitavel) || 'N/A',
        (data.venda && data.venda.src) || 'N/A',
        (data.venda && data.venda.onebuyclick) || 'N/A',
        (data.venda && data.venda.venda_upsell) || 'N/A',
        (data.venda && data.venda.idioma) || 'N/A',
        (data.venda && data.venda.moeda) || 'N/A',
        (data.venda && data.venda.pais_origem) || 'N/A',
        (data.plano && data.plano.codigo) || 'N/A',
        (data.plano && data.plano.referencia) || 'N/A',
        (data.plano && data.plano.nome) || 'N/A',
        (data.plano && data.plano.quantidade) || 'N/A',
        (data.plano && data.plano.sku) || 'N/A',
        (data.produtos && data.produtos[0] && data.produtos[0].produto) || 'N/A',
        (data.produtos && data.produtos[0] && data.produtos[0].codPlano) || 'N/A',
        (data.produtos && data.produtos[0] && data.produtos[0].chave) || 'N/A',
        (data.produtos && data.produtos[0] && data.produtos[0].nome) || 'N/A',
        (data.produtos && data.produtos[0] && data.produtos[0].descricao) || 'N/A',
        (data.produtos && data.produtos[0] && data.produtos[0].plano) || 'N/A',
        (data.produtos && data.produtos[0] && data.produtos[0].planoNome) || 'N/A',
        (data.produtos && data.produtos[0] && data.produtos[0].cupom) || 'N/A',
        (data.produtos && data.produtos[0] && data.produtos[0].cupom_descricao) || 'N/A',
        (data.produtos && data.produtos[0] && data.produtos[0].valor) || 'N/A',
        (data.produtos && data.produtos[0] && data.produtos[0].principal) || 'N/A',
        (data.produtos && data.produtos[0] && data.produtos[0].quantidade) || 'N/A',
        (data.produtos && data.produtos[0] && data.produtos[0].formato) || 'N/A',
        (data.produtos && data.produtos[0] && data.produtos[0].categoria) || 'N/A',
        (data.produtos && data.produtos[0] && data.produtos[0].membertizze) || 'N/A',
        (data.produtos && data.produtos[0] && data.produtos[0].sku) || 'N/A',
        (data.comissoes && data.comissoes[0] && data.comissoes[0].nome) || 'N/A',
        (data.comissoes && data.comissoes[0] && data.comissoes[0].tipo_comissao) || 'N/A',
        (data.comissoes && data.comissoes[0] && data.comissoes[0].valor) || 'N/A',
        (data.comissoes && data.comissoes[0] && data.comissoes[0].porcentagem) || 'N/A',
        (data.comissoes && data.comissoes[0] && data.comissoes[0].email) || 'N/A',
        (data.comprador && data.comprador.nome) || 'N/A',
        (data.comprador && data.comprador.email) || 'N/A',
        (data.comprador && data.comprador.data_nascimento) || 'N/A',
        (data.comprador && data.comprador.cnpj_cpf) || 'N/A',
        (data.comprador && data.comprador.telefone) || 'N/A',
        (data.comprador && data.comprador.cep) || 'N/A',
        (data.comprador && data.comprador.endereco) || 'N/A',
        (data.comprador && data.comprador.numero) || 'N/A',
        (data.comprador && data.comprador.complemento) || 'N/A',
        (data.comprador && data.comprador.bairro) || 'N/A',
        (data.comprador && data.comprador.cidade) || 'N/A',
        (data.comprador && data.comprador.estado) || 'N/A',
        (data.comprador && data.comprador.pais) || 'N/A'
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

app.use(bodyParser.json());

app.post('/postback', (req, res) => {
    console.log('Dados recebidos:', req.body);

    const data = req.body;

    appendToGoogleSheet(data);

    res.status(200).send('Dados recebidos com sucesso');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
