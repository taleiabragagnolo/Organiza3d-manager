// ======================================================
// ORGANIZA 3D MANAGER
// MÓDULO VENDAS
// venda.js
// ======================================================

"use strict";

(function () {

    // ==================================================
    // CHAVES DO LOCALSTORAGE
    // ==================================================

    const CHAVE_VENDAS =
        "organiza3d_vendas";

    const CHAVE_CLIENTES =
        "organiza3d_cliente";

    const CHAVE_PRODUTOS =
        "organiza3d_produtos_produzidos";

    const CHAVE_FINANCEIRO =
        "organiza3d_financeiro";

    // ==================================================
    // LISTAS E CONTROLES
    // ==================================================

    let vendas = [];

    let clientesVenda = [];

    let produtosVenda = [];

    let lancamentosFinanceirosVenda = [];

    let moduloVendaIniciado = false;

    // ==================================================
    // ELEMENTOS DA TELA
    // ==================================================

    let campoClienteVenda = null;

    let campoDataVenda = null;

    let listaItensVenda = null;

    let botaoAdicionarItemVenda = null;

    let campoSubtotalVenda = null;

    let campoDescontoVenda = null;

    let campoFreteVenda = null;

    let campoTotalFinalVenda = null;

    let campoValorPagoVenda = null;

    let campoValorPendenteVenda = null;

    let campoFormaPagamentoVenda = null;

    let campoSituacaoPagamentoVenda = null;

    let campoObservacoesVenda = null;

    let botaoSalvarVenda = null;

    let botaoLimparVenda = null;

    let listaVendas = null;

    let menuVendas = null;

    let resumoTotalVendas = null;

    let resumoUnidadesVenda = null;

    let resumoBrindesVenda = null;

    let resumoValorTotalVenda = null;

    let resumoValorPendenteVenda = null;

    // ==================================================
    // LOCALIZAR ELEMENTOS
    // ==================================================

    function localizarElementosVenda() {

        campoClienteVenda =
            document.getElementById(
                "venda-cliente"
            );

        campoDataVenda =
            document.getElementById(
                "venda-data"
            );

        listaItensVenda =
            document.getElementById(
                "lista-itens-venda"
            );

        botaoAdicionarItemVenda =
            document.getElementById(
                "adicionar-item-venda"
            );

        campoSubtotalVenda =
            document.getElementById(
                "venda-subtotal"
            );

        campoDescontoVenda =
            document.getElementById(
                "venda-desconto"
            );

        campoFreteVenda =
            document.getElementById(
                "venda-frete"
            );

        campoTotalFinalVenda =
            document.getElementById(
                "venda-total-final"
            );

        campoValorPagoVenda =
            document.getElementById(
                "venda-valor-pago"
            );

        campoValorPendenteVenda =
            document.getElementById(
                "venda-valor-pendente"
            );

        campoFormaPagamentoVenda =
            document.getElementById(
                "venda-forma-pagamento"
            );

        campoSituacaoPagamentoVenda =
            document.getElementById(
                "venda-situacao-pagamento"
            );

        campoObservacoesVenda =
            document.getElementById(
                "venda-observacoes"
            );

        botaoSalvarVenda =
            document.getElementById(
                "salvar-venda"
            );

        botaoLimparVenda =
            document.getElementById(
                "limpar-formulario-venda"
            );

        listaVendas =
            document.getElementById(
                "lista-vendas"
            );

        menuVendas =
            document.querySelector(
                '[data-pagina="vendas"]'
            );

        resumoTotalVendas =
            document.getElementById(
                "vendas-total"
            );

        resumoUnidadesVenda =
            document.getElementById(
                "vendas-unidades"
            );

        resumoBrindesVenda =
            document.getElementById(
                "vendas-brindes"
            );

        resumoValorTotalVenda =
            document.getElementById(
                "vendas-valor-total"
            );

        resumoValorPendenteVenda =
            document.getElementById(
                "vendas-valor-pendente"
            );

    }

    // ==================================================
    // FUNÇÕES AUXILIARES
    // ==================================================

    function lerListaVenda(
        chave
    ) {

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
                "Erro ao carregar os dados:",
                chave,
                erro
            );

            return [];

        }

    }

    function salvarListaVenda(
        chave,
        lista
    ) {

        localStorage.setItem(
            chave,
            JSON.stringify(
                lista
            )
        );

    }

    function criarIdVenda() {

        return (
            Date.now() +
            Math.floor(
                Math.random() * 1000
            )
        );

    }

    function numeroVenda(
        valor
    ) {

        if (
            typeof valor === "string"
        ) {

            valor =
                valor
                    .trim()
                    .replace(
                        ",",
                        "."
                    );

        }

        const numero =
            Number(valor);

        return Number.isFinite(numero)
            ? numero
            : 0;

    }

    function numeroPositivoVenda(
        valor
    ) {

        return Math.max(
            0,
            numeroVenda(
                valor
            )
        );

    }

    function formatarDinheiroVenda(
        valor
    ) {

        return numeroVenda(
            valor
        ).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
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

    function formatarDataVenda(
        data
    ) {

        if (!data) {

            return "Não informada";

        }

        const partes =
            String(
                data
            ).split("-");

        if (
            partes.length !== 3
        ) {

            return String(
                data
            );

        }

        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );

    }

    function escaparTextoVenda(
        texto
    ) {

        if (
            texto === null ||
            texto === undefined
        ) {

            return "";

        }

        return String(
            texto
        )
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

    }

    // ==================================================
    // CARREGAR DADOS
    // ==================================================

    function carregarDadosVenda() {

        vendas =
            lerListaVenda(
                CHAVE_VENDAS
            );

        clientesVenda =
            lerListaVenda(
                CHAVE_CLIENTES
            );

        produtosVenda =
            lerListaVenda(
                CHAVE_PRODUTOS
            );

        lancamentosFinanceirosVenda =
            lerListaVenda(
                CHAVE_FINANCEIRO
            );

    }

    // ==================================================
    // LOCALIZAR PRODUTO
    // ==================================================

    function encontrarProdutoVenda(
        produtoId
    ) {

        return produtosVenda.find(
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
    // LOCALIZAR CLIENTE
    // ==================================================

    function encontrarClienteVenda(
        clienteId
    ) {

        return clientesVenda.find(
            function (cliente) {

                return String(
                    cliente.id
                ) ===
                String(
                    clienteId
                );

            }
        ) || null;

    }

    // ==================================================
    // PREENCHER CLIENTES
    // ==================================================

    function carregarClientesVenda() {

        if (!campoClienteVenda) {

            return;

        }

        const clienteSelecionado =
            campoClienteVenda.value;

        campoClienteVenda.innerHTML =
            '<option value="">' +
            "Venda sem cliente vinculado" +
            "</option>";

        [...clientesVenda]
            .sort(
                function (
                    a,
                    b
                ) {

                    return String(
                        a.nome || ""
                    ).localeCompare(
                        String(
                            b.nome || ""
                        ),
                        "pt-BR"
                    );

                }
            )
            .forEach(
                function (cliente) {

                    const opcao =
                        document.createElement(
                            "option"
                        );

                    opcao.value =
                        String(
                            cliente.id
                        );

                    opcao.textContent =
                        cliente.nome ||
                        "Cliente sem nome";

                    opcao.selected =
                        String(
                            clienteSelecionado
                        ) ===
                        String(
                            cliente.id
                        );

                    campoClienteVenda
                        .appendChild(
                            opcao
                        );

                }
            );

    }

    // ==================================================
    // PREENCHER PRODUTOS
    // ==================================================

    function carregarProdutosSelect(
        select
    ) {

        if (!select) {

            return;

        }

        const produtoSelecionado =
            select.value;

        select.innerHTML =
            '<option value="">' +
            "Selecione o produto" +
            "</option>";

        produtosVenda
            .filter(
                function (produto) {

                    return (
                        produto.status !==
                            "Inativo" &&
                        numeroPositivoVenda(
                            produto
                                .quantidadeDisponivel
                        ) > 0
                    );

                }
            )
            .sort(
                function (
                    a,
                    b
                ) {

                    return String(
                        a.nome || ""
                    ).localeCompare(
                        String(
                            b.nome || ""
                        ),
                        "pt-BR"
                    );

                }
            )
            .forEach(
                function (produto) {

                    const opcao =
                        document.createElement(
                            "option"
                        );

                    opcao.value =
                        String(
                            produto.id
                        );

                    opcao.textContent =
                        (
                            produto.nome ||
                            "Produto sem nome"
                        ) +
                        " — " +
                        numeroPositivoVenda(
                            produto
                                .quantidadeDisponivel
                        ) +
                        " disponíveis";

                    opcao.selected =
                        String(
                            produtoSelecionado
                        ) ===
                        String(
                            produto.id
                        );

                    select.appendChild(
                        opcao
                    );

                }
            );

    }
        // ==================================================
    // CRIAR NOVO ITEM DA VENDA
    // ==================================================

    function criarNovoItemVenda() {

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "linha item-venda";

        item.innerHTML = `
            <div class="campo">

                <label>
                    Produto
                </label>

                <select class="venda-item-produto">

                    <option value="">
                        Selecione o produto
                    </option>

                </select>

            </div>

            <div class="campo">

                <label>
                    Estoque disponível
                </label>

                <input
                    type="text"
                    class="venda-item-estoque"
                    value="0 unidades"
                    readonly>

            </div>

            <div class="campo">

                <label>
                    Quantidade
                </label>

                <input
                    type="number"
                    class="venda-item-quantidade"
                    min="1"
                    step="1"
                    value="1">

            </div>

            <div class="campo">

                <label>
                    Valor unitário
                </label>

                <input
                    type="number"
                    class="venda-item-valor-unitario"
                    min="0"
                    step="0.01"
                    placeholder="0,00">

            </div>

            <div class="campo">

                <label>
                    Brinde
                </label>

                <select class="venda-item-brinde">

                    <option value="Não">
                        Não
                    </option>

                    <option value="Sim">
                        Sim
                    </option>

                </select>

            </div>

            <div class="campo">

                <label>
                    Total do item
                </label>

                <input
                    type="text"
                    class="venda-item-total"
                    value="R$ 0,00"
                    readonly>

            </div>

            <div class="campo">

                <label>
                    Ação
                </label>

                <button
                    type="button"
                    class="botao-excluir remover-item-venda">
                    Remover
                </button>

            </div>
        `;

        return item;

    }

    // ==================================================
    // ADICIONAR ITEM
    // ==================================================

    function adicionarItemVenda() {

        if (!listaItensVenda) {

            return;

        }

        const novoItem =
            criarNovoItemVenda();

        listaItensVenda.appendChild(
            novoItem
        );

        const selectProduto =
            novoItem.querySelector(
                ".venda-item-produto"
            );

        carregarProdutosSelect(
            selectProduto
        );

        configurarEventosItemVenda(
            novoItem
        );

        calcularTotaisVenda();

    }

    // ==================================================
    // REMOVER ITEM
    // ==================================================

    function removerItemVenda(
        item
    ) {

        if (
            !listaItensVenda ||
            !item
        ) {

            return;

        }

        const itens =
            listaItensVenda.querySelectorAll(
                ".item-venda"
            );

        if (
            itens.length <= 1
        ) {

            alert(
                "A venda deve possuir pelo menos um produto."
            );

            return;

        }

        item.remove();

        calcularTotaisVenda();

    }

    // ==================================================
    // ATUALIZAR PRODUTO DO ITEM
    // ==================================================

    function atualizarProdutoItemVenda(
        item
    ) {

        if (!item) {

            return;

        }

        const selectProduto =
            item.querySelector(
                ".venda-item-produto"
            );

        const campoEstoque =
            item.querySelector(
                ".venda-item-estoque"
            );

        const campoQuantidade =
            item.querySelector(
                ".venda-item-quantidade"
            );

        const campoValor =
            item.querySelector(
                ".venda-item-valor-unitario"
            );

        const campoBrinde =
            item.querySelector(
                ".venda-item-brinde"
            );

        const produto =
            encontrarProdutoVenda(
                selectProduto
                    ? selectProduto.value
                    : ""
            );

        if (!produto) {

            if (campoEstoque) {

                campoEstoque.value =
                    "0 unidades";

            }

            if (campoQuantidade) {

                campoQuantidade.value =
                    1;

                campoQuantidade.max =
                    "";

            }

            if (campoValor) {

                campoValor.value =
                    "";

            }

            if (campoBrinde) {

                campoBrinde.value =
                    "Não";

            }

            calcularTotaisVenda();

            return;

        }

        const quantidadeDisponivel =
            numeroPositivoVenda(
                produto.quantidadeDisponivel
            );

        const precoVenda =
            numeroPositivoVenda(
                produto.precoVenda
            );

        if (campoEstoque) {

            campoEstoque.value =
                quantidadeDisponivel +
                (
                    quantidadeDisponivel === 1
                        ? " unidade"
                        : " unidades"
                );

        }

        if (campoQuantidade) {

            campoQuantidade.max =
                String(
                    quantidadeDisponivel
                );

            const quantidadeAtual =
                numeroPositivoVenda(
                    campoQuantidade.value
                );

            if (
                quantidadeAtual <= 0 ||
                quantidadeAtual >
                    quantidadeDisponivel
            ) {

                campoQuantidade.value =
                    1;

            }

        }

        if (campoValor) {

            campoValor.value =
                precoVenda.toFixed(2);

        }

        if (
            campoBrinde &&
            campoBrinde.value ===
                "Sim" &&
            campoValor
        ) {

            campoValor.value =
                "0.00";

        }

        calcularTotaisVenda();

    }

    // ==================================================
    // ALTERAR BRINDE
    // ==================================================

    function alterarBrindeItemVenda(
        item
    ) {

        if (!item) {

            return;

        }

        const selectProduto =
            item.querySelector(
                ".venda-item-produto"
            );

        const campoValor =
            item.querySelector(
                ".venda-item-valor-unitario"
            );

        const campoBrinde =
            item.querySelector(
                ".venda-item-brinde"
            );

        if (
            !campoValor ||
            !campoBrinde
        ) {

            return;

        }

        if (
            campoBrinde.value ===
            "Sim"
        ) {

            campoValor.value =
                "0.00";

            campoValor.readOnly =
                true;

        } else {

            const produto =
                encontrarProdutoVenda(
                    selectProduto
                        ? selectProduto.value
                        : ""
                );

            campoValor.readOnly =
                false;

            campoValor.value =
                produto
                    ? numeroPositivoVenda(
                        produto.precoVenda
                    ).toFixed(2)
                    : "";

        }

        calcularTotaisVenda();

    }

    // ==================================================
    // CONFIGURAR EVENTOS DO ITEM
    // ==================================================

    function configurarEventosItemVenda(
        item
    ) {

        if (!item) {

            return;

        }

        const selectProduto =
            item.querySelector(
                ".venda-item-produto"
            );

        const campoQuantidade =
            item.querySelector(
                ".venda-item-quantidade"
            );

        const campoValor =
            item.querySelector(
                ".venda-item-valor-unitario"
            );

        const campoBrinde =
            item.querySelector(
                ".venda-item-brinde"
            );

        const botaoRemover =
            item.querySelector(
                ".remover-item-venda"
            );

        if (selectProduto) {

            selectProduto.addEventListener(
                "change",
                function () {

                    atualizarProdutoItemVenda(
                        item
                    );

                }
            );

        }

        if (campoQuantidade) {

            campoQuantidade.addEventListener(
                "input",
                calcularTotaisVenda
            );

        }

        if (campoValor) {

            campoValor.addEventListener(
                "input",
                calcularTotaisVenda
            );

        }

        if (campoBrinde) {

            campoBrinde.addEventListener(
                "change",
                function () {

                    alterarBrindeItemVenda(
                        item
                    );

                }
            );

        }

        if (botaoRemover) {

            botaoRemover.addEventListener(
                "click",
                function () {

                    removerItemVenda(
                        item
                    );

                }
            );

        }

    }

    // ==================================================
    // CONFIGURAR ITENS EXISTENTES
    // ==================================================

    function configurarItensExistentesVenda() {

        if (!listaItensVenda) {

            return;

        }

        const itens =
            listaItensVenda.querySelectorAll(
                ".item-venda"
            );

        itens.forEach(
            function (item) {

                const selectProduto =
                    item.querySelector(
                        ".venda-item-produto"
                    );

                carregarProdutosSelect(
                    selectProduto
                );

                configurarEventosItemVenda(
                    item
                );

            }
        );

    }

    // ==================================================
    // CALCULAR TOTAIS
    // ==================================================

    function calcularTotaisVenda() {

        if (!listaItensVenda) {

            return;

        }

        let subtotal = 0;

        const itens =
            listaItensVenda.querySelectorAll(
                ".item-venda"
            );

        itens.forEach(
            function (item) {

                const campoQuantidade =
                    item.querySelector(
                        ".venda-item-quantidade"
                    );

                const campoValor =
                    item.querySelector(
                        ".venda-item-valor-unitario"
                    );

                const campoBrinde =
                    item.querySelector(
                        ".venda-item-brinde"
                    );

                const campoTotal =
                    item.querySelector(
                        ".venda-item-total"
                    );

                const quantidade =
                    numeroPositivoVenda(
                        campoQuantidade
                            ? campoQuantidade.value
                            : 0
                    );

                const valorUnitario =
                    numeroPositivoVenda(
                        campoValor
                            ? campoValor.value
                            : 0
                    );

                const brinde =
                    campoBrinde
                        ? campoBrinde.value ===
                            "Sim"
                        : false;

                const totalItem =
                    brinde
                        ? 0
                        : (
                            quantidade *
                            valorUnitario
                        );

                subtotal +=
                    totalItem;

                if (campoTotal) {

                    campoTotal.value =
                        formatarDinheiroVenda(
                            totalItem
                        );

                }

            }
        );

        const desconto =
            numeroPositivoVenda(
                campoDescontoVenda
                    ? campoDescontoVenda.value
                    : 0
            );

        const frete =
            numeroPositivoVenda(
                campoFreteVenda
                    ? campoFreteVenda.value
                    : 0
            );

        const totalFinal =
            Math.max(
                0,
                subtotal -
                desconto +
                frete
            );

        const valorPago =
            numeroPositivoVenda(
                campoValorPagoVenda
                    ? campoValorPagoVenda.value
                    : 0
            );

        const valorPendente =
            Math.max(
                0,
                totalFinal -
                valorPago
            );

        if (campoSubtotalVenda) {

            campoSubtotalVenda.value =
                formatarDinheiroVenda(
                    subtotal
                );

        }

        if (campoTotalFinalVenda) {

            campoTotalFinalVenda.value =
                formatarDinheiroVenda(
                    totalFinal
                );

        }

        if (campoValorPendenteVenda) {

            campoValorPendenteVenda.value =
                formatarDinheiroVenda(
                    valorPendente
                );

        }

    }

    // ==================================================
    // OBTER TOTAIS NUMÉRICOS
    // ==================================================

    function obterTotaisVenda() {

        let subtotal = 0;

        if (listaItensVenda) {

            const itens =
                listaItensVenda.querySelectorAll(
                    ".item-venda"
                );

            itens.forEach(
                function (item) {

                    const quantidade =
                        numeroPositivoVenda(
                            item.querySelector(
                                ".venda-item-quantidade"
                            )?.value
                        );

                    const valorUnitario =
                        numeroPositivoVenda(
                            item.querySelector(
                                ".venda-item-valor-unitario"
                            )?.value
                        );

                    const brinde =
                        item.querySelector(
                            ".venda-item-brinde"
                        )?.value ===
                        "Sim";

                    if (!brinde) {

                        subtotal +=
                            quantidade *
                            valorUnitario;

                    }

                }
            );

        }

        const desconto =
            numeroPositivoVenda(
                campoDescontoVenda
                    ? campoDescontoVenda.value
                    : 0
            );

        const frete =
            numeroPositivoVenda(
                campoFreteVenda
                    ? campoFreteVenda.value
                    : 0
            );

        const total =
            Math.max(
                0,
                subtotal -
                desconto +
                frete
            );

        const valorPago =
            numeroPositivoVenda(
                campoValorPagoVenda
                    ? campoValorPagoVenda.value
                    : 0
            );

        const valorPendente =
            Math.max(
                0,
                total -
                valorPago
            );

        return {

            subtotal:
                subtotal,

            desconto:
                desconto,

            frete:
                frete,

            total:
                total,

            valorPago:
                valorPago,

            valorPendente:
                valorPendente

        };

    }
    // ==================================================
    // OBTER ITENS DA VENDA
    // ==================================================

    function obterItensVenda() {

        const itensVenda = [];

        if (!listaItensVenda) {

            return itensVenda;

        }

        const itens =
            listaItensVenda.querySelectorAll(
                ".item-venda"
            );

        itens.forEach(
            function (item) {

                const selectProduto =
                    item.querySelector(
                        ".venda-item-produto"
                    );

                const campoQuantidade =
                    item.querySelector(
                        ".venda-item-quantidade"
                    );

                const campoValor =
                    item.querySelector(
                        ".venda-item-valor-unitario"
                    );

                const campoBrinde =
                    item.querySelector(
                        ".venda-item-brinde"
                    );

                const produto =
                    encontrarProdutoVenda(
                        selectProduto
                            ? selectProduto.value
                            : ""
                    );

                if (!produto) {

                    return;

                }

                const quantidade =
                    numeroPositivoVenda(
                        campoQuantidade
                            ? campoQuantidade.value
                            : 0
                    );

                const brinde =
                    campoBrinde
                        ? campoBrinde.value ===
                            "Sim"
                        : false;

                const valorUnitario =
                    brinde
                        ? 0
                        : numeroPositivoVenda(
                            campoValor
                                ? campoValor.value
                                : 0
                        );

                itensVenda.push({

                    produtoId:
                        produto.id,

                    nome:
                        produto.nome ||
                        "Produto sem nome",

                    quantidade:
                        quantidade,

                    valorUnitario:
                        valorUnitario,

                    brinde:
                        brinde,

                    total:
                        brinde
                            ? 0
                            : (
                                quantidade *
                                valorUnitario
                            )

                });

            }
        );

        return itensVenda;

    }

    // ==================================================
    // VALIDAR VENDA
    // ==================================================

    function validarVenda() {

        if (!campoDataVenda) {

            alert(
                "Campo de data da venda não encontrado."
            );

            return false;

        }

        if (!campoDataVenda.value) {

            alert(
                "Informe a data da venda."
            );

            return false;

        }

        const itensVenda =
            obterItensVenda();

        if (
            itensVenda.length === 0
        ) {

            alert(
                "Adicione pelo menos um produto à venda."
            );

            return false;

        }

        const produtosUsados =
            new Set();

        for (
            const itemVenda of
            itensVenda
        ) {

            const produto =
                encontrarProdutoVenda(
                    itemVenda.produtoId
                );

            if (!produto) {

                alert(
                    "Um dos produtos selecionados não foi encontrado."
                );

                return false;

            }

            if (
                produtosUsados.has(
                    String(
                        itemVenda.produtoId
                    )
                )
            ) {

                alert(
                    'O produto "' +
                    (
                        produto.nome ||
                        "sem nome"
                    ) +
                    '" foi adicionado mais de uma vez.'
                );

                return false;

            }

            produtosUsados.add(
                String(
                    itemVenda.produtoId
                )
            );

            if (
                itemVenda.quantidade <= 0
            ) {

                alert(
                    'Informe uma quantidade válida para "' +
                    (
                        produto.nome ||
                        "o produto"
                    ) +
                    '".'
                );

                return false;

            }

            const quantidadeDisponivel =
                numeroPositivoVenda(
                    produto.quantidadeDisponivel
                );

            if (
                itemVenda.quantidade >
                quantidadeDisponivel
            ) {

                alert(
                    'A quantidade informada para "' +
                    (
                        produto.nome ||
                        "o produto"
                    ) +
                    '" é maior que o estoque disponível.'
                );

                return false;

            }

            if (
                !itemVenda.brinde &&
                itemVenda.valorUnitario < 0
            ) {

                alert(
                    'Informe um valor válido para "' +
                    (
                        produto.nome ||
                        "o produto"
                    ) +
                    '".'
                );

                return false;

            }

        }

        const totais =
            obterTotaisVenda();

        if (
            totais.desconto >
            (
                totais.subtotal +
                totais.frete
            )
        ) {

            alert(
                "O desconto não pode ser maior que o valor da venda."
            );

            return false;

        }

        if (
    Math.round(totais.valorPago * 100) >
    Math.round(totais.total * 100)
) {

            alert(
                "O valor pago não pode ser maior que o total da venda."
            );

            return false;

        }

        if (
            totais.total > 0 &&
            campoSituacaoPagamentoVenda &&
            campoSituacaoPagamentoVenda.value ===
                "Pago" &&
            Math.round(totais.valorPago * 100) <
    Math.round(totais.total * 100)
        ) {

            alert(
                'Para marcar como "Pago", informe o valor total da venda no campo Valor pago.'
            );

            return false;

        }

        if (
            totais.total > 0 &&
            campoSituacaoPagamentoVenda &&
            campoSituacaoPagamentoVenda.value ===
                "Parcial" &&
            (
                totais.valorPago <= 0 ||
                totais.valorPago >=
                    totais.total
            )
        ) {

            alert(
                'Para marcar como "Parcial", o valor pago deve ser maior que zero e menor que o total.'
            );

            return false;

        }

        if (
            totais.total > 0 &&
            campoSituacaoPagamentoVenda &&
            campoSituacaoPagamentoVenda.value ===
                "Pendente" &&
            totais.valorPago > 0
        ) {

            alert(
                'Uma venda pendente deve ter valor pago igual a zero. Use "Parcial" se houve pagamento.'
            );

            return false;

        }

        if (
            totais.total > 0 &&
            campoFormaPagamentoVenda &&
            !campoFormaPagamentoVenda.value
        ) {

            alert(
                "Selecione a forma de pagamento."
            );

            return false;

        }

        return true;

    }

    // ==================================================
    // CRIAR OBJETO DA VENDA
    // ==================================================

    function criarObjetoVenda() {

        const cliente =
            encontrarClienteVenda(
                campoClienteVenda
                    ? campoClienteVenda.value
                    : ""
            );

        const totais =
            obterTotaisVenda();

        return {

            id:
                criarIdVenda(),

            data:
                campoDataVenda
                    ? campoDataVenda.value
                    : dataHojeVenda(),

            clienteId:
                cliente
                    ? cliente.id
                    : "",

            clienteNome:
                cliente
                    ? (
                        cliente.nome ||
                        "Cliente sem nome"
                    )
                    : "Não vinculado",

            itens:
                obterItensVenda(),

            subtotal:
                totais.subtotal,

            desconto:
                totais.desconto,

            frete:
                totais.frete,

            total:
                totais.total,

            valorPago:
                totais.valorPago,

            valorPendente:
                totais.valorPendente,

            formaPagamento:
                campoFormaPagamentoVenda
                    ? campoFormaPagamentoVenda.value
                    : "",

            situacaoPagamento:
                campoSituacaoPagamentoVenda
                    ? campoSituacaoPagamentoVenda.value
                    : "Pendente",

            observacoes:
                campoObservacoesVenda
                    ? campoObservacoesVenda.value.trim()
                    : "",

            criadoEm:
                new Date().toISOString()

        };

    }

    // ==================================================
    // BAIXAR ESTOQUE
    // ==================================================

    function baixarEstoqueVenda(
    venda
) {

    const textoOriginal =
        localStorage.getItem(
            CHAVE_PRODUTOS
        );

    try {

        const produtosAtuais =
            JSON.parse(
                textoOriginal || "[]"
            );

        if (
            !Array.isArray(
                produtosAtuais
            )
        ) {

            alert(
                "Não foi possível carregar o estoque atual. A venda não foi registrada."
            );

            return false;

        }

        // Soma quantidades quando o mesmo produto
        // aparece mais de uma vez na venda.
        const quantidadesPorProduto = {};

        venda.itens.forEach(
            function (itemVenda) {

                const produtoId =
                    String(
                        itemVenda.produtoId
                    );

                const quantidade =
                    numeroPositivoVenda(
                        itemVenda.quantidade
                    );

                if (
                    !quantidadesPorProduto[
                        produtoId
                    ]
                ) {

                    quantidadesPorProduto[
                        produtoId
                    ] = 0;

                }

                quantidadesPorProduto[
                    produtoId
                ] += quantidade;

            }
        );

        const baixasPreparadas = [];

        const idsProdutos =
            Object.keys(
                quantidadesPorProduto
            );

        // Confere todos os produtos antes
        // de alterar qualquer quantidade.
        for (
            const produtoId of
            idsProdutos
        ) {

            const produto =
                produtosAtuais.find(
                    function (
                        itemProduto
                    ) {

                        return String(
                            itemProduto.id
                        ) ===
                        String(
                            produtoId
                        );

                    }
                );

            if (!produto) {

                alert(
                    "O produto de código " +
                    produtoId +
                    " não foi encontrado no estoque atual.\n\n" +
                    "A venda não foi registrada e nenhuma baixa foi realizada."
                );

                return false;

            }

            const quantidadeAtual =
                numeroPositivoVenda(
                    produto
                        .quantidadeDisponivel
                );

            const quantidadeBaixar =
                numeroPositivoVenda(
                    quantidadesPorProduto[
                        produtoId
                    ]
                );

            if (
                quantidadeBaixar <= 0
            ) {

                alert(
                    'A quantidade informada para "' +
                    (
                        produto.nome ||
                        "Produto sem nome"
                    ) +
                    '" é inválida.\n\n' +
                    "A venda não foi registrada."
                );

                return false;

            }

            if (
                quantidadeBaixar >
                quantidadeAtual
            ) {

                alert(
                    'Estoque insuficiente para "' +
                    (
                        produto.nome ||
                        "Produto sem nome"
                    ) +
                    '".\n\n' +
                    "Disponível: " +
                    quantidadeAtual +
                    "\nQuantidade da venda: " +
                    quantidadeBaixar +
                    "\n\nA venda não foi registrada."
                );

                return false;

            }

            baixasPreparadas.push({

                produto:
                    produto,

                quantidadeAnterior:
                    quantidadeAtual,

                quantidadeBaixar:
                    quantidadeBaixar,

                quantidadeFinal:
                    quantidadeAtual -
                    quantidadeBaixar

            });

        }

        // Executa as baixas somente depois
        // de todas as conferências.
        baixasPreparadas.forEach(
            function (
                baixa
            ) {

                const produto =
                    baixa.produto;

                produto.quantidadeDisponivel =
                    baixa.quantidadeFinal;

                produto.valorTotalEstoque =
                    Number(
                        (
                            baixa.quantidadeFinal *
                            numeroPositivoVenda(
                                produto.precoVenda
                            )
                        ).toFixed(
                            2
                        )
                    );

                produto.status =
                    baixa.quantidadeFinal > 0
                        ? "Ativo"
                        : "Inativo";

                produto.atualizadoEm =
                    new Date()
                        .toISOString();

            }
        );

        salvarListaVenda(
            CHAVE_PRODUTOS,
            produtosAtuais
        );

        // Relê o localStorage e confirma
        // se todas as baixas foram gravadas.
        const produtosConfirmados =
            lerListaVenda(
                CHAVE_PRODUTOS
            );

        const baixaConfirmada =
            baixasPreparadas.every(
                function (
                    baixa
                ) {

                    const produtoGravado =
                        produtosConfirmados.find(
                            function (
                                itemProduto
                            ) {

                                return String(
                                    itemProduto.id
                                ) ===
                                    String(
                                        baixa
                                            .produto
                                            .id
                                    );

                            }
                        );

                    return (
                        produtoGravado &&
                        numeroPositivoVenda(
                            produtoGravado
                                .quantidadeDisponivel
                        ) ===
                            baixa
                                .quantidadeFinal
                    );

                }
            );

        if (
            !baixaConfirmada
        ) {

            if (
                textoOriginal !==
                null
            ) {

                localStorage.setItem(
                    CHAVE_PRODUTOS,
                    textoOriginal
                );

            }

            alert(
                "A baixa do estoque não pôde ser confirmada.\n\n" +
                "O estoque anterior foi restaurado e a venda não foi registrada."
            );

            return false;

        }

        // Atualiza a lista usada pelo módulo
        // com os valores realmente gravados.
        produtosVenda =
            produtosConfirmados;

        return true;

    } catch (
        erro
    ) {

        if (
            textoOriginal !==
            null
        ) {

            localStorage.setItem(
                CHAVE_PRODUTOS,
                textoOriginal
            );

        }

        console.error(
            "Erro ao baixar o estoque da venda:",
            erro
        );

        alert(
            "Ocorreu um erro ao baixar o estoque.\n\n" +
            "Nenhum produto foi alterado e a venda não foi registrada."
        );

        return false;

    }

}

    // ==================================================
    // LANÇAR NO FINANCEIRO
    // ==================================================

    function registrarFinanceiroVenda(
        venda
    ) {

        if (
            numeroPositivoVenda(
                venda.total
            ) <= 0
        ) {

            return;

        }

        const lancamento = {

            id:
                criarIdVenda(),

            tipo:
                "Receita",

            categoria:
                "Venda de produtos",

            descricao:
                "Venda #" +
                venda.id +
                (
                    venda.clienteNome &&
                    venda.clienteNome !==
                        "Não vinculado"
                        ? " — Cliente: " +
                            venda.clienteNome
                        : ""
                ),

            valor:
                venda.total,

            data:
                venda.data,

            formaPagamento:
                venda.formaPagamento,

            situacao:
                venda.situacaoPagamento,

            valorPago:
                venda.valorPago,

            origem:
                "Vendas",

            observacoes:
                venda.observacoes ||
                "Lançamento automático gerado pelo módulo Vendas.",

            automatico:
                true,

            vendaId:
                venda.id

        };

        lancamentosFinanceirosVenda.push(
            lancamento
        );

        salvarListaVenda(
            CHAVE_FINANCEIRO,
            lancamentosFinanceirosVenda
        );

    }
    // ==================================================
    // ESTORNAR VENDA
    // ==================================================

    function estornarVenda(
        vendaId
    ) {

        const venda =
    criarObjetoVenda();

const estoqueBaixado =
    baixarEstoqueVenda(
        venda
    );

if (
    !estoqueBaixado
) {

    return;

}

        const confirmar =
            confirm(
                "Deseja realmente estornar esta venda?\n\n" +
                "Os produtos voltarão ao estoque e o lançamento financeiro da venda será removido."
            );

        if (!confirmar) {

            return;

        }

        // ==============================================
        // DEVOLVER PRODUTOS AO ESTOQUE
        // ==============================================

        if (
            Array.isArray(
                venda.itens
            )
        ) {

            venda.itens.forEach(
                function (itemVenda) {

                    const produto =
                        encontrarProdutoVenda(
                            itemVenda.produtoId
                        );

                    if (!produto) {

                        return;

                    }

                    const quantidadeAtual =
                        numeroPositivoVenda(
                            produto.quantidadeDisponivel
                        );

                    const quantidadeDevolver =
                        numeroPositivoVenda(
                            itemVenda.quantidade
                        );

                    produto.quantidadeDisponivel =
                        quantidadeAtual +
                        quantidadeDevolver;

                    if (
                        produto.quantidadeDisponivel > 0 &&
                        produto.status === "Inativo"
                    ) {

                        produto.status =
                            "Ativo";

                    }

                }
            );

            salvarListaVenda(
                CHAVE_PRODUTOS,
                produtosVenda
            );

        }

        // ==============================================
        // REMOVER LANÇAMENTO FINANCEIRO DA VENDA
        // ==============================================

        lancamentosFinanceirosVenda =
            lancamentosFinanceirosVenda.filter(
                function (lancamento) {

                    return String(
                        lancamento.vendaId
                    ) !==
                    String(
                        venda.id
                    );

                }
            );

        salvarListaVenda(
            CHAVE_FINANCEIRO,
            lancamentosFinanceirosVenda
        );

        // ==============================================
        // REMOVER VENDA
        // ==============================================

        vendas =
            vendas.filter(
                function (item) {

                    return String(
                        item.id
                    ) !==
                    String(
                        venda.id
                    );

                }
            );

        salvarListaVenda(
            CHAVE_VENDAS,
            vendas
        );

        // ==============================================
        // ATUALIZAR TELAS
        // ==============================================

        carregarDadosVenda();

        carregarClientesVenda();

        mostrarVendas();

        if (
            typeof atualizarDashboardCompleto ===
            "function"
        ) {

            atualizarDashboardCompleto();

        }

        if (
            typeof atualizarRelatorios ===
            "function"
        ) {

            atualizarRelatorios();

        }

        if (
            typeof mostrarLancamentosFinanceiros ===
            "function"
        ) {

            mostrarLancamentosFinanceiros();

        }

        alert(
            "Venda estornada com sucesso."
        );

    }
    // ==================================================
    // ATUALIZAR RESUMO
    // ==================================================

    function atualizarResumoVenda() {

        const totalVendas =
            vendas.length;

        const totalUnidades =
            vendas.reduce(
                function (
                    total,
                    venda
                ) {

                    if (
                        !Array.isArray(
                            venda.itens
                        )
                    ) {

                        return total;

                    }

                    return (
                        total +
                        venda.itens.reduce(
                            function (
                                soma,
                                item
                            ) {

                                return item.brinde
                                 ? soma
                                : (
                                    soma +
                                 numeroPositivoVenda(
                               item.quantidade
                          )
                         );

                            },
                            0
                        )
                    );

                },
                0
            );

        const totalBrindes =
            vendas.reduce(
                function (
                    total,
                    venda
                ) {

                    if (
                        !Array.isArray(
                            venda.itens
                        )
                    ) {

                        return total;

                    }

                    return (
                        total +
                        venda.itens.reduce(
                            function (
                                soma,
                                item
                            ) {

                                return item.brinde
                                    ? (
                                        soma +
                                        numeroPositivoVenda(
                                            item.quantidade
                                        )
                                    )
                                    : soma;

                            },
                            0
                        )
                    );

                },
                0
            );

        const valorTotal =
            vendas.reduce(
                function (
                    total,
                    venda
                ) {

                    return (
                        total +
                        numeroPositivoVenda(
                            venda.total
                        )
                    );

                },
                0
            );

        const valorPendente =
            vendas.reduce(
                function (
                    total,
                    venda
                ) {

                    return (
                        total +
                        numeroPositivoVenda(
                            venda.valorPendente
                        )
                    );

                },
                0
            );

        if (resumoTotalVendas) {

            resumoTotalVendas.textContent =
                String(
                    totalVendas
                );

        }

        if (resumoUnidadesVenda) {

            resumoUnidadesVenda.textContent =
                String(
                    totalUnidades
                );

        }

        if (resumoBrindesVenda) {

            resumoBrindesVenda.textContent =
                String(
                    totalBrindes
                );

        }

        if (resumoValorTotalVenda) {

            resumoValorTotalVenda.textContent =
                formatarDinheiroVenda(
                    valorTotal
                );

        }

        if (resumoValorPendenteVenda) {

            resumoValorPendenteVenda.textContent =
                formatarDinheiroVenda(
                    valorPendente
                );

        }

    }

        // ==================================================
    // MOSTRAR VENDAS - FORMATO HORIZONTAL
    // ==================================================

    function mostrarVendas() {

        if (!listaVendas) {
            return;
        }

        if (
            !Array.isArray(vendas) ||
            vendas.length === 0
        ) {

            listaVendas.innerHTML =
                "<p>Nenhuma venda registrada.</p>";

            atualizarResumoVenda();

            return;
        }


        const vendasOrdenadas =
            [...vendas].sort(
                function (a, b) {

                    const dataA =
                        String(a.data || "");

                    const dataB =
                        String(b.data || "");

                    if (dataA !== dataB) {
                        return dataB.localeCompare(dataA);
                    }

                    return (
                        numeroVenda(b.id) -
                        numeroVenda(a.id)
                    );
                }
            );


        const linhasVendas =
            vendasOrdenadas
                .map(
                    function (venda) {

                        const quantidadeItens =
                            Array.isArray(venda.itens)
                                ? venda.itens.reduce(
                                    function (total, item) {

                                        return (
                                            total +
                                            numeroPositivoVenda(
                                                item.quantidade
                                            )
                                        );

                                    },
                                    0
                                )
                                : 0;


                        const classePendente =
                            numeroPositivoVenda(
                                venda.valorPendente
                            ) > 0
                                ? "valor-pendente-destaque"
                                : "";


                        return `
                            <div class="venda-tabela-linha">

                                <div
                                    class="venda-coluna venda-coluna-id"
                                    data-titulo="Venda">

                                    #${escaparTextoVenda(
                                        venda.id
                                    )}

                                </div>


                                <div
                                    class="venda-coluna"
                                    data-titulo="Data">

                                    ${formatarDataVenda(
                                        venda.data
                                    )}

                                </div>


                                <div
                                    class="venda-coluna venda-coluna-cliente"
                                    data-titulo="Cliente">

                                    ${escaparTextoVenda(
                                        venda.clienteNome ||
                                        "Não vinculado"
                                    )}

                                </div>


                                <div
                                    class="venda-coluna"
                                    data-titulo="Produtos">

                                    ${quantidadeItens}
                                    ${
                                        quantidadeItens === 1
                                            ? "item"
                                            : "itens"
                                    }

                                </div>


                                <div
                                    class="venda-coluna"
                                    data-titulo="Subtotal">

                                    ${formatarDinheiroVenda(
                                        venda.subtotal
                                    )}

                                </div>


                                <div
                                    class="venda-coluna"
                                    data-titulo="Desconto">

                                    ${formatarDinheiroVenda(
                                        venda.desconto
                                    )}

                                </div>


                                <div
                                    class="venda-coluna"
                                    data-titulo="Frete">

                                    ${formatarDinheiroVenda(
                                        venda.frete
                                    )}

                                </div>


                                <div
                                    class="venda-coluna venda-coluna-total"
                                    data-titulo="Total">

                                    ${formatarDinheiroVenda(
                                        venda.total
                                    )}

                                </div>


                                <div
                                    class="venda-coluna"
                                    data-titulo="Pago">

                                    ${formatarDinheiroVenda(
                                        venda.valorPago
                                    )}

                                </div>


                                <div
                                    class="venda-coluna ${classePendente}"
                                    data-titulo="Pendente">

                                    ${formatarDinheiroVenda(
                                        venda.valorPendente
                                    )}

                                </div>


                                <div
                                    class="venda-coluna"
                                    data-titulo="Pagamento">

                                    ${escaparTextoVenda(
                                        venda.formaPagamento ||
                                        "Não informado"
                                    )}

                                </div>


                                <div
                                    class="venda-coluna venda-coluna-acoes"
                                    data-titulo="Ações">

                                    <button
                                        type="button"
                                        class="botao-excluir estornar-venda"
                                        data-venda-id="${escaparTextoVenda(
                                            venda.id
                                        )}">

                                        Estornar

                                    </button>

                                </div>

                            </div>
                        `;

                    }
                )
                .join("");


        listaVendas.innerHTML = `

            <div class="vendas-tabela">

                <div class="venda-tabela-cabecalho">

                    <div>Venda</div>
                    <div>Data</div>
                    <div>Cliente</div>
                    <div>Produtos</div>
                    <div>Subtotal</div>
                    <div>Desconto</div>
                    <div>Frete</div>
                    <div>Total</div>
                    <div>Pago</div>
                    <div>Pendente</div>
                    <div>Pagamento</div>
                    <div>Ações</div>

                </div>

                ${linhasVendas}

            </div>
        `;


        atualizarResumoVenda();

    }

    // ==================================================
    // LIMPAR FORMULÁRIO
    // ==================================================

    function limparFormularioVenda() {

        if (campoClienteVenda) {

            campoClienteVenda.value =
                "";

        }

        if (campoDataVenda) {

            campoDataVenda.value =
                dataHojeVenda();

        }

        if (campoDescontoVenda) {

            campoDescontoVenda.value =
                "0";

        }

        if (campoFreteVenda) {

            campoFreteVenda.value =
                "0";

        }

        if (campoValorPagoVenda) {

            campoValorPagoVenda.value =
                "0";

        }

        if (campoFormaPagamentoVenda) {

            campoFormaPagamentoVenda.value =
                "";

        }

        if (campoSituacaoPagamentoVenda) {

            campoSituacaoPagamentoVenda.value =
                "Pendente";

        }

        if (campoObservacoesVenda) {

            campoObservacoesVenda.value =
                "";

        }

        if (listaItensVenda) {

            listaItensVenda.innerHTML =
                "";

            adicionarItemVenda();

        }

        calcularTotaisVenda();

    }

    // ==================================================
    // SALVAR VENDA
    // ==================================================

    function salvarVenda() {

        if (
            !validarVenda()
        ) {

            return;

        }

       const estoqueBaixado =
    baixarEstoqueVenda(
        venda
    );

        if (
            !estoqueBaixado
        ) {

    return;

}

        vendas.push(
            venda
        );

        salvarListaVenda(
            CHAVE_VENDAS,
            vendas
        );

        registrarFinanceiroVenda(
            venda
        );

        carregarDadosVenda();

        carregarClientesVenda();

        mostrarVendas();

        limparFormularioVenda();

        if (
            typeof atualizarDashboardCompleto ===
            "function"
        ) {

            atualizarDashboardCompleto();

        }

        if (
            typeof atualizarRelatorios ===
            "function"
        ) {

            atualizarRelatorios();

        }

        if (
            typeof mostrarLancamentosFinanceiros ===
            "function"
        ) {

            mostrarLancamentosFinanceiros();

        }

        alert(
            "Venda registrada com sucesso."
        );

    }
        // ==================================================
    // ATUALIZAR TELA DE VENDAS
    // ==================================================

    function atualizarTelaVenda() {

        carregarDadosVenda();

        carregarClientesVenda();

        if (listaItensVenda) {

            const selectsProduto =
                listaItensVenda.querySelectorAll(
                    ".venda-item-produto"
                );

            selectsProduto.forEach(
                function (select) {

                    carregarProdutosSelect(
                        select
                    );

                }
            );

        }

        mostrarVendas();

        calcularTotaisVenda();

    }

    // ==================================================
    // CONFIGURAR EVENTOS PRINCIPAIS
    // ==================================================

    function configurarEventosVenda() {

                if (listaVendas) {

            listaVendas.addEventListener(
                "click",
                function (evento) {

                    const botao =
                        evento.target.closest(
                            ".estornar-venda"
                        );

                    if (!botao) {

                        return;

                    }

                    const vendaId =
                        botao.getAttribute(
                            "data-venda-id"
                        );

                    estornarVenda(
                        vendaId
                    );

                }
            );

        }
        
        if (botaoAdicionarItemVenda) {

            botaoAdicionarItemVenda
                .addEventListener(
                    "click",
                    adicionarItemVenda
                );

        }

        if (campoDescontoVenda) {

            campoDescontoVenda
                .addEventListener(
                    "input",
                    calcularTotaisVenda
                );

        }

        if (campoFreteVenda) {

            campoFreteVenda
                .addEventListener(
                    "input",
                    calcularTotaisVenda
                );

        }

        if (campoValorPagoVenda) {

            campoValorPagoVenda
                .addEventListener(
                    "input",
                    calcularTotaisVenda
                );

        }

        if (botaoSalvarVenda) {

            botaoSalvarVenda
                .addEventListener(
                    "click",
                    salvarVenda
                );

        }

        if (botaoLimparVenda) {

            botaoLimparVenda
                .addEventListener(
                    "click",
                    limparFormularioVenda
                );

        }

        if (menuVendas) {

            menuVendas
                .addEventListener(
                    "click",
                    function () {

                        atualizarTelaVenda();

                    }
                );

        }

    }

    // ==================================================
    // INICIAR MÓDULO VENDAS
    // ==================================================

    window.iniciarVenda =
        function () {

            if (
                moduloVendaIniciado
            ) {

                atualizarTelaVenda();

                return;

            }

            localizarElementosVenda();

            if (
                !listaItensVenda ||
                !botaoSalvarVenda
            ) {

                console.error(
                    "Não foi possível iniciar o módulo Vendas. Verifique os elementos do index.html."
                );

                return;

            }

            carregarDadosVenda();

            carregarClientesVenda();

            if (
                campoDataVenda &&
                !campoDataVenda.value
            ) {

                campoDataVenda.value =
                    dataHojeVenda();

            }

            configurarItensExistentesVenda();

            const itensExistentes =
                listaItensVenda.querySelectorAll(
                    ".item-venda"
                );

            if (
                itensExistentes.length === 0
            ) {

                adicionarItemVenda();

            }

            configurarEventosVenda();

            mostrarVendas();

            calcularTotaisVenda();

            moduloVendaIniciado =
                true;

        };

})();