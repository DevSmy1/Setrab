import { criarRequestOptions, fetchJson, modalLoading, urlApi } from "./main.js";

const modalCarregarArquivoSincronizacao = $("#modal-carregar-arquivo-sincronizacao");
const botaoCarregarDados = $("#botao-carregar-dados");
const botaoSincronizarArquivoDados = $("#botao-sincronizar-arquivo-dados");
const inputArquivoSincronizacaoDados = $("#input-arquivo-sincronizacao-dados");

botaoCarregarDados.click(() => {
    modalCarregarArquivoSincronizacao.modal('show');
})

inputArquivoSincronizacaoDados.change(() => {
    if (inputArquivoSincronizacaoDados.val() !== "") {
        botaoSincronizarArquivoDados.hide();
    }
    botaoSincronizarArquivoDados.show();
});


botaoSincronizarArquivoDados.click(async () => {
    try {
        modalLoading.modal('show');
        let formData = new FormData();
        formData.append('arquivo_sincronizacao', inputArquivoSincronizacaoDados.prop('files')[0]);
        let url = urlApi + `setrab/sincronizar/`;
        const options = criarRequestOptions('POST', formData);
        let response = await fetchJson(url, options);
        alert(response.descricao);
        modalCarregarArquivoSincronizacao.modal('hide');
    } catch (error) {
        alert(`Erro ao acessar a API: ${error}`);
    } finally {
        setTimeout(() => {
            modalLoading.modal('hide');
        }, 500);
    }
})

modalCarregarArquivoSincronizacao.on('hidden.bs.modal', () => {
    inputArquivoSincronizacaoDados.val('');
    botaoSincronizarArquivoDados.hide();
})