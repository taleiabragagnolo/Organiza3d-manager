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

ffunction carregarDadosVenda() {

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
                        produto.quantidadeDisponivel
                    ) > 0
                );

            }
        )
        .sort(
            function (a, b) {

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
                        produto.quantidadeDisponivel
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

    alert(
        "Venda registrada com sucesso."
    );

}

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
                        produto.quantidadeDisponivel
                    ) > 0
                );

            }
        )
        .sort(
            function (a, b) {

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
                        produto.quantidadeDisponivel
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
// ======================================================
// LOCALIZAR CLIENTE
// ======================================================

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

// ======================================================
// LANÇAR VENDA NO FINANCEIRO
// ======================================================

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

    const cliente =
        encontrarClienteVenda(
            venda.clienteId
        );

    const descricaoCliente =
        cliente
            ? " — Cliente: " +
                (
                    cliente.nome ||
                    "Não informado"
                )
            : "";

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
            descricaoCliente,

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

        encomendaId:
            "",

        encomendaDescricao:
            "",

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
// ======================================================
// ATUALIZAR RESUMO DAS VENDAS
// ======================================================

function atualizarResumoVenda() {

    const totalVendas =
        vendas.length;

    const totalUnidades =
        vendas.reduce(
            function (
                total,
                venda
            ) {

                const unidadesVenda =
                    Array.isArray(
                        venda.itens
                    )
                        ? venda.itens.reduce(
                            function (
                                soma,
                                item
                            ) {

                                return (
                                    soma +
                                    numeroPositivoVenda(
                                        item.quantidade
                                    )
                                );

                            },
                            0
                        )
                        : 0;

                return (
                    total +
                    unidadesVenda
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
                    Math.max(
                        0,
                        numeroPositivoVenda(
                            venda.total
                        ) -
                        numeroPositivoVenda(
                            venda.valorPago
                        )
                    )
                );

            },
            0
        );

    if (resumoTotalVendas) {

        resumoTotalVendas.textContent =
            totalVendas;

    }

    if (resumoUnidadesVenda) {

        resumoUnidadesVenda.textContent =
            totalUnidades;

    }

    if (resumoBrindesVenda) {

        resumoBrindesVenda.textContent =
            totalBrindes;

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

// ======================================================
// FORMATAR DATA
// ======================================================

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

    if (partes.length !== 3) {
        return data;
    }

    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}

// ======================================================
// MOSTRAR VENDAS
// ======================================================

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

                return String(
                    b.data || ""
                ).localeCompare(
                    String(
                        a.data || ""
                    )
                );

            }
        );

    listaVendas.innerHTML =
        vendasOrdenadas
            .map(
                function (venda) {

                    const cliente =
                        encontrarClienteVenda(
                            venda.clienteId
                        );

                    const itensTexto =
                        Array.isArray(
                            venda.itens
                        )
                            ? venda.itens
                                .map(
                                    function (item) {

                                        return (
                                            escaparTextoVenda(
                                                item.nome ||
                                                "Produto"
                                            ) +
                                            " — " +
                                            numeroPositivoVenda(
                                                item.quantidade
                                            ) +
                                            " un. — " +
                                            (
                                                item.brinde
                                                    ? "Brinde"
                                                    : formatarDinheiroVenda(
                                                        numeroPositivoVenda(
                                                            item.quantidade
                                                        ) *
                                                        numeroPositivoVenda(
                                                            item.valorUnitario
                                                        )
                                                    )
                                            )
                                        );

                                    }
                                )
                                .join("<br>")
                            : "Nenhum item";

                    return `
                        <div class="card-item">

                            <h4>
                                Venda #${escaparTextoVenda(
                                    venda.id
                                )}
                            </h4>

                            <p>
                                <strong>Data:</strong>
                                ${formatarDataVenda(
                                    venda.data
                                )}
                            </p>

                            <p>
                                <strong>Cliente:</strong>
                                ${escaparTextoVenda(
                                    cliente
                                        ? cliente.nome
                                        : "Não vinculado"
                                )}
                            </p>

                            <p>
                                <strong>Produtos:</strong><br>
                                ${itensTexto}
                            </p>

                            <p>
                                <strong>Desconto:</strong>
                                ${formatarDinheiroVenda(
                                    venda.desconto
                                )}
                            </p>

                            <p>
                                <strong>Frete:</strong>
                                ${formatarDinheiroVenda(
                                    venda.frete
                                )}
                            </p>

                            <p>
                                <strong>Total:</strong>
                                ${formatarDinheiroVenda(
                                    venda.total
                                )}
                            </p>

                            <p>
                                <strong>Valor pago:</strong>
                                ${formatarDinheiroVenda(
                                    venda.valorPago
                                )}
                            </p>

                            <p>
                                <strong>Situação:</strong>
                                ${escaparTextoVenda(
                                    venda.situacaoPagamento ||
                                    "Não informada"
                                )}
                            </p>

                            <p>
                                <strong>Forma de pagamento:</strong>
                                ${escaparTextoVenda(
                                    venda.formaPagamento ||
                                    "Não informada"
                                )}
                            </p>

                        </div>
                    `;

                }
            )
            .join("");

    atualizarResumoVenda();

}
// ======================================================
// LIMPAR FORMULÁRIO DA VENDA
// ======================================================

function limparFormularioVenda() {

    if (campoClienteVenda) {
        campoClienteVenda.value = "";
    }

    if (campoDataVenda) {
        campoDataVenda.value =
            dataHojeVenda();
    }

    if (campoDescontoVenda) {
        campoDescontoVenda.value = 0;
    }

    if (campoFreteVenda) {
        campoFreteVenda.value = 0;
    }

    if (campoValorPagoVenda) {
        campoValorPagoVenda.value = 0;
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
        campoObservacoesVenda.value = "";
    }

    if (listaItensVenda) {

        const itens =
            listaItensVenda.querySelectorAll(
                ".item-venda"
            );

        itens.forEach(
            function (
                item,
                indice
            ) {

                if (indice > 0) {
                    item.remove();
                }

            }
        );

        const primeiroItem =
            listaItensVenda.querySelector(
                ".item-venda"
            );

        if (primeiroItem) {

            const produto =
                primeiroItem.querySelector(
                    ".venda-item-produto"
                );

            const estoque =
                primeiroItem.querySelector(
                    ".venda-item-estoque"
                );

            const quantidade =
                primeiroItem.querySelector(
                    ".venda-item-quantidade"
                );

            const valor =
                primeiroItem.querySelector(
                    ".venda-item-valor-unitario"
                );

            const brinde =
                primeiroItem.querySelector(
                    ".venda-item-brinde"
                );

            const total =
                primeiroItem.querySelector(
                    ".venda-item-total"
                );

            carregarProdutosSelect(
                produto
            );

            produto.value = "";
            estoque.value = "0 unidades";
            quantidade.value = 1;
            valor.value = "";
            brinde.value = "Não";
            total.value = "R$ 0,00";

        }

    }

    calcularTotaisVenda();

}
