import { buscarArquivosImportados } from "./arquivoImportacao.js";
import { criarRequestOptions, fetchJson, modalLoading, urlApi } from "./main.js";

const modalArquivoErro = $('#modal-arquivo-erro');
const listaErrosModal = $('#lista-erros-modal');

export const abrirModalArquivoErro = async (arquivoErro) => {
    try {
        modalLoading.modal('show');
        let url = urlApi + `setrab/errosTxt?caminho=${arquivoErro}`;
        const options = criarRequestOptions('GET');
        const response = await fetch(url, options);
        const arquivo =  await response.text();
        const listaArquivos = await JSON.parse(arquivo);
        listaArquivos.forEach(item => {
            listaErrosModal.append(`
                <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                    <div class="fw-bold">${item.Funcionario}</div>
                        ${item.Erro}
                    </div>
                </li>
                `);
        });
        modalArquivoErro.modal('show');
    } catch (error) {
        alert(`Erro ao acessar a API: ${error}`);
    } finally {
        setTimeout(() => {
            modalLoading.modal('hide');
        }, 500);
    }
}

modalArquivoErro.on('hidden.bs.modal', () => {
    listaErrosModal.empty();
    buscarArquivosImportados();
});
