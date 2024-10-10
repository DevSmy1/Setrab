// Importações
import { buscarArquivosImportados } from "./arquivoImportacao.js";
import { criarRequestOptions, fetchJson, modalLoading, urlApi } from "./main.js";

// Elementos do DOM
const modalImportarArquivo = $('#modal-importar-arquivo');
const botaoImportarArquivo = $('#botao-importar-arquivo');
const botaoSincronizarArquivo = $('#botao-sincronizar-arquivo');
const inputArquivoImportacao = $('#input-arquivo-importacao');
const inputDataImportacao = $('#input-data-importacao');
const divTabelaFeedback = $('#div-tabela-feedback');

const botaoAdmissao = $('#botao-admissao');
const botaoDemissao = $('#botao-demissao');
const botaoTransferencia = $('#botao-transferencia');
const botaoMudancaFuncao = $('#botao-mudanca-funcao');

let dadosSincronizar= [];

const tituloModal = $('#titulo-modal-importar');


// Constantes 
const NOME_TABELA = "tabela-feedback";
let TIPO_ARQUIVO = '';

// Tabela
const tabela = $(`#${NOME_TABELA}`).DataTable({
    language: {
        url: "https://cdn.datatables.net/plug-ins/2.1.3/i18n/pt-BR.json",
        paginate: {
            first: "<<",
            last: ">>",
            next: ">",
            previous: "<",
        },
    },
});


// Eventos
botaoImportarArquivo.click(async () => {
    try {
        if (validarCampos()) {
            modalLoading.modal('show');
            let formData = new FormData();
            let dataFiltro = `?data_filtro=${inputDataImportacao.val()}-01`
            let url = urlApi + `setrab/importar/`;
            if (TIPO_ARQUIVO == 'A') {
                url += `admissao/${dataFiltro}`;
                formData.append('arquivo_admissao', inputArquivoImportacao.prop('files')[0]);
            } else if (TIPO_ARQUIVO == 'D') {
                url += `demissao/${dataFiltro}`;
                formData.append('arquivo_demissao', inputArquivoImportacao.prop('files')[0]);
            } else if (TIPO_ARQUIVO == 'T') {
                url += `transferencia/${dataFiltro}`;
                formData.append('arquivo_transferencia', inputArquivoImportacao.prop('files')[0]);
            } else if (TIPO_ARQUIVO == 'MF') {
                url += `mudFuncao/${dataFiltro}`;
                formData.append('arquivo_mudanca_funcao', inputArquivoImportacao.prop('files')[0])
            }
        
            const options = criarRequestOptions('POST', formData);
            let response = await fetchJson(url, options);
            dadosSincronizar = response;
            tabela.clear().draw();
            response.forEach(element => {
                tabela.row.add([
                    element.id_empresa_rh,
                    element.nome,
                    element.id_funcionario,
                    element.erro_sistema != null ? 'Erro' : 'OK',
                    element.erro_sistema != null ? element.erro_sistema : 'Sem erro',
                ]).draw();
            });
            divTabelaFeedback.show();
            botaoSincronizarArquivo.show();
        }
    } catch (error) {
        alert(`Erro ao acessar a API: ${error}`);
        modalLoading.modal('hide');
    } finally{
        setTimeout(() => {
            modalLoading.modal('hide');
        }, 500);
    }
})

botaoSincronizarArquivo.click(async () => {
    try {
        modalLoading.modal('show');
        let data = {
            "dados" : dadosSincronizar,
            "nome_arquivo" : inputArquivoImportacao.prop('files')[0].name,
            "mes" : `${inputDataImportacao.val()}-01`,
        }
        let url = urlApi + `setrab/sincronizar/`;
        if (TIPO_ARQUIVO == 'A') {
            url += `admissao/`;
        } else if (TIPO_ARQUIVO == 'D') {
            url += `demissao/`;
        } else if (TIPO_ARQUIVO == 'T') {
            url += `transferencia/`;
        } else if (TIPO_ARQUIVO == 'MF') {
            url += `mudFuncao/`;
        }
        const options = criarRequestOptions('POST', data);
        let response = await fetchJson(url, options);
        alert(response.descricao);
        modalImportarArquivo.modal('hide');
    } catch (error) {
        alert(`Erro ao acessar a API: ${error}`);
    } finally{
        setTimeout(() => {
            modalLoading.modal('hide');
        }, 500);
    }
});

botaoAdmissao.click(() => {
    modalImportarArquivo.modal('show');
    tituloModal.text('Admissão');
    TIPO_ARQUIVO = "A"
});

botaoDemissao.click(() => {
    modalImportarArquivo.modal('show');
    tituloModal.text('Demissão');
    TIPO_ARQUIVO = "D";
});

botaoTransferencia.click(() => {
    modalImportarArquivo.modal('show');
    tituloModal.text('Transferência');
    TIPO_ARQUIVO = "T";
});

botaoMudancaFuncao.click(() => {
    modalImportarArquivo.modal('show');
    tituloModal.text('Mudança de Função');
    TIPO_ARQUIVO = "MF";
})




modalImportarArquivo.on('hidden.bs.modal', () => {
    divTabelaFeedback.hide();
    botaoSincronizarArquivo.hide();
    inputArquivoImportacao.val('');
    inputDataImportacao.val('');
    tabela.clear().draw();
    buscarArquivosImportados();
});

// Funções
const validarCampos = () => {
    if (inputArquivoImportacao.val() === '') {
        alert('Selecione um arquivo');
        return false;
    }
    if (inputDataImportacao.val() === '') {
        alert('Selecione uma data');
        return false;
    }
    return true;
}

