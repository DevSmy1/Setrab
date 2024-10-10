import { criarRequestOptions, fetchJson, urlApi } from "./main.js";
import { abrirModalArquivoErro } from "./modalArquivoErro.js";

const NOME_TABELA = "tabela-historico";


let tabela = $(`#${NOME_TABELA}`).DataTable({
    language: {
        url: "https://cdn.datatables.net/plug-ins/2.1.3/i18n/pt-BR.json",
        paginate: {
            first: "<<",
            last: ">>",
            next: ">",
            previous: "<",
        },
    },
    select: {
        style: 'os',
        items: 'cell',
        selector: 'td:nth-child(5)',
        className: 'selected',
    },
    order: [[5, "desc"]],
    columnDefs: [
        {
            targets: [5],
            render: DataTable.render.datetime(),
            width: "15%",
            orderable: true,
        },
        {
            targets: [2,4],
            width: "25%",
        },
        {
            targets: [6],
            visible: false,
        }
    ],
});

tabela.on('select', function (e, dt, type, indexes) {
        if (indexes[0].column !== 4) {
            return;
        }
        let rowData = tabela
            .rows(indexes[0].row)
            .data()
            .toArray();
        let linha = rowData[0];
        
        abrirModalArquivoErro(linha[6]);
        
    })


export async function buscarArquivosImportados() {
    try {
        const api = urlApi + "setrab/importacoes";
        const options = criarRequestOptions("GET");
        const response = await fetchJson(api, options);
        tabela.clear().draw();
        response.forEach((item) => {
            tabela.row.add([
                item.nome_arquivo,
                item.mes,
                item.usuario_criacao,
                item.status,
                item.resposta_servidor,
                item.data_criacao,
                item.arquivo_erro,
            ]).draw();
        });
    } catch (error) {
        alert(`Erro ao acessar a API: ${error}`);
    }
}

buscarArquivosImportados();