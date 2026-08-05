// ======================================================
// ORGANIZA 3D MANAGER
// MÓDULO VENDAS
// venda.js
// ======================================================

"use strict";

function iniciarVenda() {

    // ==================================================
    // CHAVES DO LOCALSTORAGE
    // ==================================================

    const CHAVE_VENDAS =
        "organiza3d_vendas";

    const CHAVE_CLIENTES =
        "organiza3d_cliente";

    const CHAVE_PRODUTOS =
        "organiza3d_produtos_produzidos";

    // ==================================================
    // ELEMENTOS DA TELA
    // ==================================================

    const campoCliente =
        document.getElementById(
            "venda-cliente"
        );

    const campoData =
        document.getElementById(
            "venda-data"
        );

    const campoProduto =
        document.getElementById(
            "venda-produto"
        );

    const campoQuantidade =
        document.getElementById(
            "venda-quantidade"
        );

    const campoEstoqueDisponivel =
        document.getElementById(
            "venda-estoque-disponivel"
        );

    const campoValorUnitario =
        document.getElementById(
            "venda-valor-unitario"
        );

    const campoValorTotal =
        document.getElementById(
            "venda-valor-total"
        );

    const campoValorPago =
        document.getElementById(
            "venda-valor-pago"
        );

    const campoFormaPagamento =
        document.getElementById(
            "venda-forma-pagamento"
        );

    const campoSituacaoPagamento =
        document.getElementById(
            "venda-situacao-pagamento"
        );

    const campoObservacoes =
        document.getElementById(
            "venda-observacoes"
        );

    const botaoSalvar =
        document.getElementById(
            "salvar-venda"
        );

    const botaoLimpar =
        document.getElementById(
            "limpar-formulario-venda"
        );

    const menuVendas =
        document.querySelector(
            '[data-pagina="vendas"]'
        );

    // ==================================================
    // LISTAS EM MEMÓRIA
    // ==================================================

    let vendas = [];

    let clientes = [];

    let produtos = [];

    // ==================================================
    // FUNÇÕES AUXILIARES
    // ==================================================

    function lerLista(chave) {

        try {

            const dados =
                JSON.parse(
                    localStorage.getItem(
                        chave
                    )
                );

            return Array.isArray(dados)
                ? dados
                : [];

        } catch (erro) {

            console.error(
                "Erro ao carregar:",
                chave,
                erro
            );

            return [];

        }

    }

    function carregarDadosVenda() {

        vendas =
            lerLista(
                CHAVE_VENDAS
            );

        clientes =
            lerLista(
                CHAVE_CLIENTES
            );

        produtos =
            lerLista(
                CHAVE_PRODUTOS
            );

    }

    function dataHojeVenda() {

        const data =
            new Date();

        const ano =
            data.getFullYear();

        const mes =
            String(
                data.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const dia =
            String(
                data.getDate()
            ).padStart(
                2,
                "0"
            );

        return (
            ano +
            "-" +
            mes +
            "-" +
            dia
        );

    }

    // ==================================================
    // PREENCHER CLIENTES
    // ==================================================

    function preencherClientesVenda() {

        if (!campoCliente) {
            return;
        }

        const clienteSelecionado =
            campoCliente.value;

        campoCliente.innerHTML =
            '<option value="">' +
            "Venda balcão — cliente não informado" +
            "</option>";

        clientes.forEach(
            function (cliente) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    String(
                        cliente.id
                    );

                option.textContent =
                    cliente.nome ||
                    "Cliente sem nome";

                option.selected =
                    String(
                        clienteSelecionado
                    ) ===
                    String(
                        cliente.id
                    );

                campoCliente.appendChild(
                    option
                );

            }
        );

    }

    // ==================================================
    // PREENCHER PRODUTOS
    // ==================================================

    function preencherProdutosVenda() {

        if (!campoProduto) {
            return;
        }

        const produtoSelecionado =
            campoProduto.value;

        campoProduto.innerHTML =
            '<option value="">' +
            "Selecione o produto" +
            "</option>";

        produtos
            .filter(
                function (produto) {

                    return Number(
                        produto
                            .quantidadeDisponivel ||
                        0
                    ) > 0;

                }
            )
            .forEach(
                function (produto) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        String(
                            produto.id
                        );

                    option.textContent =
                        (
                            produto.nome ||
                            "Produto sem nome"
                        ) +
                        " — " +
                        Number(
                            produto
                                .quantidadeDisponivel ||
                            0
                        ) +
                        " disponíveis";

                    option.selected =
                        String(
                            produtoSelecionado
                        ) ===
                        String(
                            produto.id
                        );

                    campoProduto.appendChild(
                        option
                    );

                }
            );

    }

    // ==================================================
    // ATUALIZAR OPÇÕES
    // ==================================================

    function atualizarOpcoesVenda() {

        carregarDadosVenda();

        preencherClientesVenda();

        preencherProdutosVenda();

    }

    // ==================================================
    // LIMPAR FORMULÁRIO
    // ==================================================

    function limparFormularioVenda() {

        if (campoCliente) {
            campoCliente.value = "";
        }

        if (campoData) {
            campoData.value =
                dataHojeVenda();
        }

        if (campoProduto) {
            campoProduto.value = "";
        }

        if (campoQuantidade) {
            campoQuantidade.value = 1;
        }

        if (campoEstoqueDisponivel) {
            campoEstoqueDisponivel.value =
                "0 unidades";
        }

        if (campoValorUnitario) {
            campoValorUnitario.value =
                "R$ 0,00";
        }

        if (campoValorTotal) {
            campoValorTotal.value =
                "R$ 0,00";
        }

        if (campoValorPago) {
            campoValorPago.value = "";
        }

        if (campoFormaPagamento) {
            campoFormaPagamento.value = "";
        }

        if (campoSituacaoPagamento) {
            campoSituacaoPagamento.value =
                "Pendente";
        }

        if (campoObservacoes) {
            campoObservacoes.value = "";
        }

    }
// ==================================================
// ENCONTRAR PRODUTO
// ==================================================

function encontrarProdutoVenda(
    produtoId
) {

    return produtos.find(
        function (produto) {

            return String(
                produto.id
            ) ===
            String(
                produtoId
            );

        }
    ) || null;

}

// ==================================================
// ATUALIZAR CÁLCULOS DA VENDA
// ==================================================

function atualizarCalculosVenda() {

    if (
        !campoProduto ||
        !campoQuantidade
    ) {
        return;
    }

    const produto =
        encontrarProdutoVenda(
            campoProduto.value
        );

    const quantidade =
        Number(
            campoQuantidade.value
        ) || 0;

    if (!produto) {

        if (campoEstoqueDisponivel) {
            campoEstoqueDisponivel.value =
                "0 unidades";
        }

        if (campoValorUnitario) {
            campoValorUnitario.value =
                "R$ 0,00";
        }

        if (campoValorTotal) {
            campoValorTotal.value =
                "R$ 0,00";
        }

        return;

    }

    const estoqueDisponivel =
        Number(
            produto.quantidadeDisponivel ||
            0
        );

    const valorUnitario =
        Number(
            produto.preco ||
            produto.precoVenda ||
            0
        );

    const valorTotal =
        valorUnitario *
        quantidade;

    if (campoEstoqueDisponivel) {

        campoEstoqueDisponivel.value =
            estoqueDisponivel +
            (
                estoqueDisponivel === 1
                    ? " unidade"
                    : " unidades"
            );

    }

    if (campoValorUnitario) {

        campoValorUnitario.value =
            formatarDinheiro(
                valorUnitario
            );

    }

    if (campoValorTotal) {

        campoValorTotal.value =
            formatarDinheiro(
                valorTotal
            );

    }

}
    // ==================================================
    // EVENTOS
    // ==================================================

    if (menuVendas) {

        menuVendas.addEventListener(
            "click",
            function () {

                atualizarOpcoesVenda();

            }
        );

    }

    if (botaoLimpar) {

        botaoLimpar.addEventListener(
            "click",
            limparFormularioVenda
        );

    }

    if (botaoSalvar) {

        botaoSalvar.addEventListener(
            "click",
            function () {

                alert(
                    "A função de salvar será adicionada na próxima etapa."
                );

            }
        );

    }
if (campoProduto) {

    campoProduto.addEventListener(
        "change",
        atualizarCalculosVenda
    );

}

if (campoQuantidade) {

    campoQuantidade.addEventListener(
        "input",
        atualizarCalculosVenda
    );

}
    // ==================================================
    // INICIALIZAÇÃO
    // ==================================================

    atualizarOpcoesVenda();

    limparFormularioVenda();

}
