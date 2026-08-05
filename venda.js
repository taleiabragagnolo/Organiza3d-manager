// ======================================================
// ORGANIZA 3D MANAGER
// MÓDULO VENDAS
// venda.js
// ======================================================

"use strict";

// ======================================================
// CHAVES DO LOCALSTORAGE
// ======================================================

const CHAVE_VENDAS =
    "organiza3d_vendas";

const CHAVE_CLIENTES =
    "organiza3d_cliente";

const CHAVE_PRODUTOS =
    "organiza3d_produtos_produzidos";

const CHAVE_FINANCEIRO =
    "organiza3d_financeiro";

// ======================================================
// LISTAS EM MEMÓRIA
// ======================================================

let vendas = [];

let clientesVenda = [];

let produtosVenda = [];

let lancamentosFinanceirosVenda = [];

// ======================================================
// ELEMENTOS PRINCIPAIS DA TELA
// ======================================================

const campoClienteVenda =
    document.getElementById(
        "venda-cliente"
    );

const campoDataVenda =
    document.getElementById(
        "venda-data"
    );

const listaItensVenda =
    document.getElementById(
        "lista-itens-venda"
    );

const botaoAdicionarItemVenda =
    document.getElementById(
        "adicionar-item-venda"
    );

const campoSubtotalVenda =
    document.getElementById(
        "venda-subtotal"
    );

const campoDescontoVenda =
    document.getElementById(
        "venda-desconto"
    );

const campoFreteVenda =
    document.getElementById(
        "venda-frete"
    );

const campoTotalFinalVenda =
    document.getElementById(
        "venda-total-final"
    );

const campoValorPagoVenda =
    document.getElementById(
        "venda-valor-pago"
    );

const campoValorPendenteVenda =
    document.getElementById(
        "venda-valor-pendente"
    );

const campoFormaPagamentoVenda =
    document.getElementById(
        "venda-forma-pagamento"
    );

const campoSituacaoPagamentoVenda =
    document.getElementById(
        "venda-situacao-pagamento"
    );

const campoObservacoesVenda =
    document.getElementById(
        "venda-observacoes"
    );

const botaoSalvarVenda =
    document.getElementById(
        "salvar-venda"
    );

const botaoLimparVenda =
    document.getElementById(
        "limpar-formulario-venda"
    );

const listaVendas =
    document.getElementById(
        "lista-vendas"
    );

const menuVendas =
    document.querySelector(
        '[data-pagina="vendas"]'
    );

// ======================================================
// CAMPOS DO RESUMO
// ======================================================

const resumoTotalVendas =
    document.getElementById(
        "vendas-total"
    );

const resumoUnidadesVenda =
    document.getElementById(
        "vendas-unidades"
    );

const resumoBrindesVenda =
    document.getElementById(
        "vendas-brindes"
    );

const resumoValorTotalVenda =
    document.getElementById(
        "vendas-valor-total"
    );

const resumoValorPendenteVenda =
    document.getElementById(
        "vendas-valor-pendente"
    );

// ======================================================
// INICIALIZAÇÃO DO MÓDULO
// ======================================================

// ======================================================
// INICIALIZAÇÃO
// ======================================================

function iniciarVenda() {

    carregarDadosVenda();

    carregarClientesVenda();

    if (campoDataVenda) {

        campoDataVenda.value =
            dataHojeVenda();

    }

    const primeiroItem =
        listaItensVenda
            ? listaItensVenda.querySelector(
                ".item-venda"
            )
            : null;

    if (primeiroItem) {

        carregarProdutosSelect(

            primeiroItem.querySelector(
                ".venda-item-produto"
            )

        );

        configurarEventosItemVenda(
            primeiroItem
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

    calcularTotaisVenda();

}
// ======================================================
// FUNÇÕES AUXILIARES
// ======================================================

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
// ======================================================
// CARREGAMENTO DOS DADOS
// ======================================================

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
        ).filter(
            function (
                produto
            ) {

                return (
                    produto.status !==
                        "Inativo" &&
                    Number(
                        produto.quantidadeDisponivel || 0
                    ) > 0
                );

            }
        );

    lancamentosFinanceirosVenda =
        lerListaVenda(
            CHAVE_FINANCEIRO
        );

}

// ======================================================
// PREENCHER CLIENTES
// ======================================================

function carregarClientesVenda() {

    if (!campoClienteVenda) {
        return;
    }

    campoClienteVenda.innerHTML =
        '<option value="">Venda sem cliente vinculado</option>';

    clientesVenda
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
            function (
                cliente
            ) {

                const opcao =
                    document.createElement(
                        "option"
                    );

                opcao.value =
                    cliente.id;

                opcao.textContent =
                    cliente.nome;

                campoClienteVenda.appendChild(
                    opcao
                );

            }
        );

}

// ======================================================
// PREENCHER PRODUTOS
// ======================================================

function carregarProdutosSelect(
    select
) {

    if (!select) {
        return;
    }

    select.innerHTML =
        '<option value="">Selecione o produto</option>';

    produtosVenda
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
            function (
                produto
            ) {

                const opcao =
                    document.createElement(
                        "option"
                    );

                opcao.value =
                    produto.id;

                opcao.textContent =
                    produto.nome;

                select.appendChild(
                    opcao
                );

            }
        );

}
// ======================================================
// CARREGAMENTO DOS DADOS
// ======================================================

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
        ).filter(
            function (
                produto
            ) {

                return (
                    produto.status !==
                        "Inativo" &&
                    Number(
                        produto.quantidadeDisponivel || 0
                    ) > 0
                );

            }
        );

    lancamentosFinanceirosVenda =
        lerListaVenda(
            CHAVE_FINANCEIRO
        );

}

// ======================================================
// PREENCHER CLIENTES
// ======================================================

function carregarClientesVenda() {

    if (!campoClienteVenda) {
        return;
    }

    campoClienteVenda.innerHTML =
        '<option value="">Venda sem cliente vinculado</option>';

    clientesVenda
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
            function (
                cliente
            ) {

                const opcao =
                    document.createElement(
                        "option"
                    );

                opcao.value =
                    cliente.id;

                opcao.textContent =
                    cliente.nome;

                campoClienteVenda.appendChild(
                    opcao
                );

            }
        );

}

// ======================================================
// PREENCHER PRODUTOS
// ======================================================

function carregarProdutosSelect(
    select
) {

    if (!select) {
        return;
    }

    select.innerHTML =
        '<option value="">Selecione o produto</option>';

    produtosVenda
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
            function (
                produto
            ) {

                const opcao =
                    document.createElement(
                        "option"
                    );

                opcao.value =
                    produto.id;

                opcao.textContent =
                    produto.nome;

                select.appendChild(
                    opcao
                );

            }
        );

}
// ======================================================
// CÁLCULOS DA VENDA
// ======================================================

function atualizarProdutoItem(
    item
) {

    const selectProduto =
        item.querySelector(
            ".venda-item-produto"
        );

    const campoEstoque =
        item.querySelector(
            ".venda-item-estoque"
        );

    const campoValor =
        item.querySelector(
            ".venda-item-valor-unitario"
        );

    const produto =
        produtosVenda.find(
            function (itemProduto) {

                return (
                    itemProduto.id ==
                    selectProduto.value
                );

            }
        );

    if (!produto) {

        campoEstoque.value =
            "0 unidades";

        campoValor.value = "";

        calcularTotaisVenda();

        return;

    }

    campoEstoque.value =
        Number(
            produto.quantidadeDisponivel || 0
        ) +
        " unidades";

    campoValor.value =
        numeroPositivoVenda(
            produto.precoVenda ||
            produto.valorVenda ||
            produto.valor ||
            0
        ).toFixed(2);

    calcularTotaisVenda();

}

// ======================================================

function calcularTotaisVenda() {

    let subtotal = 0;

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
                    ).value

                );

            const valorUnitario =
                numeroPositivoVenda(

                    item.querySelector(
                        ".venda-item-valor-unitario"
                    ).value

                );

            const brinde =
                item.querySelector(
                    ".venda-item-brinde"
                ).value === "Sim";

            let totalItem =
                quantidade *
                valorUnitario;

            if (brinde) {

                totalItem = 0;

            }

            item.querySelector(
                ".venda-item-total"
            ).value =
                formatarDinheiroVenda(
                    totalItem
                );

            subtotal += totalItem;

        }
    );

    const desconto =
        numeroPositivoVenda(
            campoDescontoVenda.value
        );

    const frete =
        numeroPositivoVenda(
            campoFreteVenda.value
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
            campoValorPagoVenda.value
        );

    const pendente =
        Math.max(
            0,
            totalFinal -
            valorPago
        );

    campoSubtotalVenda.value =
        formatarDinheiroVenda(
            subtotal
        );

    campoTotalFinalVenda.value =
        formatarDinheiroVenda(
            totalFinal
        );

    campoValorPendenteVenda.value =
        formatarDinheiroVenda(
            pendente
        );

}
// ======================================================
// VALIDAR VENDA
// ======================================================

function validarVenda() {

    const itens =
        listaItensVenda.querySelectorAll(
            ".item-venda"
        );

    if (itens.length === 0) {

        alert(
            "Adicione pelo menos um produto."
        );

        return false;

    }

    let possuiProduto = false;

    for (const item of itens) {

        const produtoId =
            item.querySelector(
                ".venda-item-produto"
            ).value;

        const quantidade =
            numeroPositivoVenda(
                item.querySelector(
                    ".venda-item-quantidade"
                ).value
            );

        if (!produtoId) {

            alert(
                "Selecione um produto."
            );

            return false;

        }

        if (quantidade <= 0) {

            alert(
                "Quantidade inválida."
            );

            return false;

        }

        possuiProduto = true;

    }

    return possuiProduto;

}

// ======================================================
// CRIAR OBJETO DA VENDA
// ======================================================

function criarObjetoVenda() {

    const itens = [];

    listaItensVenda
        .querySelectorAll(
            ".item-venda"
        )
        .forEach(
            function (item) {

                const produtoId =
                    item.querySelector(
                        ".venda-item-produto"
                    ).value;

                const produto =
                    produtosVenda.find(
                        function (produtoLista) {

                            return (
                                produtoLista.id ==
                                produtoId
                            );

                        }
                    );

                if (!produto) {
                    return;
                }

                itens.push({

                    produtoId:
                        produto.id,

                    nome:
                        produto.nome,

                    quantidade:
                        numeroPositivoVenda(

                            item.querySelector(
                                ".venda-item-quantidade"
                            ).value

                        ),

                    valorUnitario:
                        numeroPositivoVenda(

                            item.querySelector(
                                ".venda-item-valor-unitario"
                            ).value

                        ),

                    brinde:

                        item.querySelector(
                            ".venda-item-brinde"
                        ).value ===
                        "Sim"

                });

            }
        );

    return {

        id:
            criarIdVenda(),

        data:
            campoDataVenda.value,

        clienteId:
            campoClienteVenda.value,

        itens:
            itens,

        desconto:
            numeroPositivoVenda(
                campoDescontoVenda.value
            ),

        frete:
            numeroPositivoVenda(
                campoFreteVenda.value
            ),

        total:

            numeroPositivoVenda(

                campoTotalFinalVenda.value
                    .replace(
                        /[^0-9,.-]/g,
                        ""
                    )
                    .replace(
                        ".",
                        ""
                    )
                    .replace(
                        ",",
                        "."
                    )

            ),

        valorPago:
            numeroPositivoVenda(
                campoValorPagoVenda.value
            ),

        formaPagamento:
            campoFormaPagamentoVenda.value,

        situacaoPagamento:
            campoSituacaoPagamentoVenda.value,

        observacoes:
            campoObservacoesVenda.value.trim()

    };

}

// ======================================================
// BAIXAR ESTOQUE
// ======================================================

function baixarEstoqueVenda(
    venda
) {

    venda.itens.forEach(

        function (itemVenda) {

            const produto =
                produtosVenda.find(

                    function (produtoLista) {

                        return (
                            produtoLista.id ==
                            itemVenda.produtoId
                        );

                    }

                );

            if (!produto) {
                return;
            }

            produto.quantidadeDisponivel -=
                itemVenda.quantidade;

            if (
                produto.quantidadeDisponivel < 0
            ) {

                produto.quantidadeDisponivel = 0;

            }

            if (
                produto.quantidadeDisponivel === 0
            ) {

                produto.status =
                    "Inativo";

            }

        }

    );

    salvarListaVenda(
        CHAVE_PRODUTOS,
        produtosVenda
    );

}

// ======================================================
// SALVAR VENDA
// ======================================================

function salvarVenda() {

    if (
        !validarVenda()
    ) {

        return;

    }

    const venda =
        criarObjetoVenda();

    baixarEstoqueVenda(
        venda
    );

    vendas.push(
        venda
    );

    salvarListaVenda(
        CHAVE_VENDAS,
        vendas
    );

    alert(
        "Venda registrada com sucesso."
    );

}
