// ======================================================
// ORGANIZA 3D MANAGER
// MÓDULO RELATÓRIOS
// relatorio.js
// ======================================================

"use strict";

(function () {

    // ==================================================
    // CHAVES DO LOCALSTORAGE
    // ==================================================

    const CHAVE_VENDAS =
        "organiza3d_vendas";

    const CHAVE_PRODUTOS =
        "organiza3d_produtos_produzidos";

    const CHAVE_FINANCEIRO =
        "organiza3d_financeiro";

    const CHAVE_CLIENTES =
        "organiza3d_cliente";

    const CHAVE_FILAMENTOS =
        "organiza3d_filamentos";

    const CHAVE_IMPRESSORAS =
        "organiza3d_impressoras";

    const CHAVE_CONSUMO_PROPRIO =
        "organiza3d_consumo_proprio";

    const CHAVE_PERDAS =
        "organiza3d_perdas_produtos";


    // ==================================================
    // DADOS DO RELATÓRIO
    // ==================================================

    let vendasRelatorio = [];

    let produtosRelatorio = [];

    let financeiroRelatorio = [];

    let clientesRelatorio = [];

    let filamentosRelatorio = [];

    let impressorasRelatorio = [];

    let consumoProprioRelatorio = [];

    let perdasRelatorio = [];


    // ==================================================
    // CONTROLES DO MÓDULO
    // ==================================================

    let moduloRelatorioIniciado = false;

    let periodoInicialRelatorio = "";

    let periodoFinalRelatorio = "";
        // ==================================================
    // LEITURA SEGURA DO LOCALSTORAGE
    // ==================================================

    function lerListaRelatorio(
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
                "Erro ao carregar dados do relatório:",
                chave,
                erro
            );

            return [];

        }

    }


    // ==================================================
    // FUNÇÕES AUXILIARES
    // ==================================================

    function numeroRelatorio(
        valor
    ) {

        if (
            typeof valor === "string"
        ) {

            valor =
                valor
                    .trim()
                    .replace(",", ".");

        }

        const numero =
            Number(valor);

        return Number.isFinite(numero)
            ? numero
            : 0;

    }


    function numeroPositivoRelatorio(
        valor
    ) {

        return Math.max(
            0,
            numeroRelatorio(
                valor
            )
        );

    }


    function dinheiroRelatorio(
        valor
    ) {

        return numeroRelatorio(
            valor
        ).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    }


    function numeroFormatadoRelatorio(
        valor,
        casas = 0
    ) {

        return numeroRelatorio(
            valor
        ).toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits:
                    casas,

                maximumFractionDigits:
                    casas
            }
        );

    }


    function formatarDataRelatorio(
        data
    ) {

        if (!data) {

            return "Não informada";

        }

        const partes =
            String(data)
                .split("-");

        if (
            partes.length !== 3
        ) {

            return String(data);

        }

        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );

    }


    function escaparTextoRelatorio(
        texto
    ) {

        return String(
            texto ?? ""
        )
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );

    }
        // ==================================================
    // CARREGAR DADOS DO RELATÓRIO
    // ==================================================

    function carregarDadosRelatorio() {

        vendasRelatorio =
            lerListaRelatorio(
                CHAVE_VENDAS
            );

        produtosRelatorio =
            lerListaRelatorio(
                CHAVE_PRODUTOS
            );

        financeiroRelatorio =
            lerListaRelatorio(
                CHAVE_FINANCEIRO
            );

        clientesRelatorio =
            lerListaRelatorio(
                CHAVE_CLIENTES
            );

        filamentosRelatorio =
            lerListaRelatorio(
                CHAVE_FILAMENTOS
            );

        impressorasRelatorio =
            lerListaRelatorio(
                CHAVE_IMPRESSORAS
            );

        consumoProprioRelatorio =
            lerListaRelatorio(
                CHAVE_CONSUMO_PROPRIO
            );

        perdasRelatorio =
            lerListaRelatorio(
                CHAVE_PERDAS
            );

    }


    // ==================================================
    // FILTRO POR PERÍODO
    // ==================================================

    function dataDentroPeriodoRelatorio(
        data
    ) {

        if (!data) {

            return false;

        }

        if (
            periodoInicialRelatorio &&
            data <
                periodoInicialRelatorio
        ) {

            return false;

        }

        if (
            periodoFinalRelatorio &&
            data >
                periodoFinalRelatorio
        ) {

            return false;

        }

        return true;

    }


    function filtrarPorPeriodoRelatorio(
        lista,
        campoData = "data"
    ) {

        if (
            !periodoInicialRelatorio &&
            !periodoFinalRelatorio
        ) {

            return [...lista];

        }

        return lista.filter(
            function (item) {

                return dataDentroPeriodoRelatorio(
                    item[campoData]
                );

            }
        );

    }
        // ==================================================
    // RELATÓRIO DE VENDAS
    // ==================================================

    function calcularVendasRelatorio() {

        const vendasFiltradas =
            filtrarPorPeriodoRelatorio(
                vendasRelatorio,
                "data"
            );

        let faturamento = 0;

        let unidadesVendidas = 0;

        let brindes = 0;

        let descontos = 0;

        let fretes = 0;

        vendasFiltradas.forEach(
            function (venda) {

                faturamento +=
                    numeroPositivoRelatorio(
                        venda.total
                    );

                descontos +=
                    numeroPositivoRelatorio(
                        venda.desconto
                    );

                fretes +=
                    numeroPositivoRelatorio(
                        venda.frete
                    );

                if (
                    Array.isArray(
                        venda.itens
                    )
                ) {

                    venda.itens.forEach(
                        function (item) {

                            const quantidade =
                                numeroPositivoRelatorio(
                                    item.quantidade
                                );

                            if (
                                item.brinde
                            ) {

                                brindes +=
                                    quantidade;

                            } else {

                                unidadesVendidas +=
                                    quantidade;

                            }

                        }
                    );

                }

            }
        );

        const totalVendas =
            vendasFiltradas.length;

        const ticketMedio =
            totalVendas > 0
                ? faturamento /
                    totalVendas
                : 0;

        return {

            vendas:
                vendasFiltradas,

            totalVendas:
                totalVendas,

            faturamento:
                faturamento,

            unidadesVendidas:
                unidadesVendidas,

            brindes:
                brindes,

            descontos:
                descontos,

            fretes:
                fretes,

            ticketMedio:
                ticketMedio

        };

    }
        // ==================================================
    // RELATÓRIO FINANCEIRO
    // ==================================================

    function calcularFinanceiroRelatorio() {

        const lancamentosFiltrados =
            filtrarPorPeriodoRelatorio(
                financeiroRelatorio,
                "data"
            );

        let entradasRecebidas = 0;

        let despesasPagas = 0;

        let entradasPendentes = 0;

        let despesasPendentes = 0;

        lancamentosFiltrados.forEach(
            function (lancamento) {

                const valor =
                    numeroPositivoRelatorio(
                        lancamento.valor
                    );

                const valorPago =
                    numeroPositivoRelatorio(
                        lancamento.valorPago
                    );

                const valorPendente =
                    Math.max(
                        0,
                        valor -
                        valorPago
                    );

                if (
                    lancamento.tipo ===
                    "Entrada"
                ) {

                    entradasRecebidas +=
                        valorPago;

                    entradasPendentes +=
                        valorPendente;

                }

                if (
                    lancamento.tipo ===
                    "Despesa"
                ) {

                    despesasPagas +=
                        valorPago;

                    despesasPendentes +=
                        valorPendente;

                }

            }
        );

        const saldo =
            entradasRecebidas -
            despesasPagas;

        return {

            lancamentos:
                lancamentosFiltrados,

            entradasRecebidas:
                entradasRecebidas,

            despesasPagas:
                despesasPagas,

            entradasPendentes:
                entradasPendentes,

            despesasPendentes:
                despesasPendentes,

            saldo:
                saldo

        };

    }
        // ==================================================
    // PRODUTOS E ESTOQUE
    // ==================================================

    function calcularProdutosRelatorio() {

        let unidadesEstoque = 0;

        let valorEstoque = 0;

        produtosRelatorio.forEach(
            function (produto) {

                const quantidadeDisponivel =
                    numeroPositivoRelatorio(
                        produto.quantidadeDisponivel
                    );

                const precoVenda =
                    numeroPositivoRelatorio(
                        produto.precoVenda
                    );

                unidadesEstoque +=
                    quantidadeDisponivel;

                valorEstoque +=
                    quantidadeDisponivel *
                    precoVenda;

            }
        );

        return {

            totalProdutos:
                produtosRelatorio.length,

            unidadesEstoque:
                unidadesEstoque,

            valorEstoque:
                valorEstoque

        };

    }


    // ==================================================
    // CONSUMO PRÓPRIO
    // ==================================================

    function calcularConsumoProprioRelatorio() {

        const consumosFiltrados =
            filtrarPorPeriodoRelatorio(
                consumoProprioRelatorio,
                "data"
            );

        let totalUnidades = 0;

        consumosFiltrados.forEach(
            function (consumo) {

                totalUnidades +=
                    numeroPositivoRelatorio(
                        consumo.quantidade
                    );

            }
        );

        return {

            registros:
                consumosFiltrados,

            totalRegistros:
                consumosFiltrados.length,

            totalUnidades:
                totalUnidades

        };

    }


    // ==================================================
    // FALHAS E PERDAS
    // ==================================================

    function calcularPerdasRelatorio() {

        const perdasFiltradas =
            filtrarPorPeriodoRelatorio(
                perdasRelatorio,
                "data"
            );

        let totalUnidades = 0;

        let custoTotal = 0;

        perdasFiltradas.forEach(
            function (perda) {

                totalUnidades +=
                    numeroPositivoRelatorio(
                        perda.quantidade
                    );

                custoTotal +=
                    numeroPositivoRelatorio(
                        perda.custoTotal
                    );

            }
        );

        return {

            registros:
                perdasFiltradas,

            totalRegistros:
                perdasFiltradas.length,

            totalUnidades:
                totalUnidades,

            custoTotal:
                custoTotal

        };

    }
        // ==================================================
    // FILAMENTOS
    // ==================================================

    function calcularFilamentosRelatorio() {

        let pesoDisponivel = 0;

        let estoqueBaixo = 0;

        let finalizados = 0;

        filamentosRelatorio.forEach(
            function (filamento) {

                const pesoRestante =
                    numeroPositivoRelatorio(
                        filamento.pesoRestante
                    );

                pesoDisponivel +=
                    pesoRestante;

                if (
                    filamento.status ===
                    "Baixo estoque"
                ) {

                    estoqueBaixo += 1;

                }

                if (
                    filamento.status === "Inativo" ||
                    filamento.status === "Finalizado" ||
                    pesoRestante <= 0
                ) {

                    finalizados += 1;

                }

            }
        );

        return {

            totalFilamentos:
                filamentosRelatorio.length,

            pesoDisponivel:
                pesoDisponivel,

            estoqueBaixo:
                estoqueBaixo,

            finalizados:
                finalizados

        };

    }


    // ==================================================
    // EQUIPAMENTOS
    // ==================================================

    function calcularEquipamentosRelatorio() {

        let impressorasAtivas = 0;

        let impressorasManutencao = 0;

        let horasProducao = 0;

        let horasTotais = 0;

        impressorasRelatorio.forEach(
            function (impressora) {

                const status =
                    String(
                        impressora.status ||
                        ""
                    ).toLowerCase();

                if (
                    status === "ativa" ||
                    status === "ativo"
                ) {

                    impressorasAtivas += 1;

                }

                if (
                    status.includes(
                        "manuten"
                    )
                ) {

                    impressorasManutencao += 1;

                }

                const horasIniciais =
                    numeroPositivoRelatorio(
                        impressora.horasIniciais
                    );

                const producao =
                    numeroPositivoRelatorio(
                        impressora.horasProducoes
                    );

                const ajustes =
                    numeroPositivoRelatorio(
                        impressora.horasAjustes
                    );

                horasProducao +=
                    producao;

                horasTotais +=
                    horasIniciais +
                    producao +
                    ajustes;

            }
        );

        return {

            totalImpressoras:
                impressorasRelatorio.length,

            impressorasAtivas:
                impressorasAtivas,

            impressorasManutencao:
                impressorasManutencao,

            horasProducao:
                horasProducao,

            horasTotais:
                horasTotais

        };

    }
        // ==================================================
    // RESUMO GERAL DOS RELATÓRIOS
    // ==================================================

    function calcularResumoGeralRelatorio() {

        const vendas =
            calcularVendasRelatorio();

        const financeiro =
            calcularFinanceiroRelatorio();

        const produtos =
            calcularProdutosRelatorio();

        const consumoProprio =
            calcularConsumoProprioRelatorio();

        const perdas =
            calcularPerdasRelatorio();

        const filamentos =
            calcularFilamentosRelatorio();

        const equipamentos =
            calcularEquipamentosRelatorio();

        return {

            vendas:
                vendas,

            financeiro:
                financeiro,

            produtos:
                produtos,

            consumoProprio:
                consumoProprio,

            perdas:
                perdas,

            filamentos:
                filamentos,

            equipamentos:
                equipamentos,

            clientes: {

                totalClientes:
                    clientesRelatorio.length

            }

        };

    }
        // ==================================================
    // ELEMENTOS DA TELA DE RELATÓRIOS
    // ==================================================

    let menuRelatorio = null;

    let campoDataInicialRelatorio = null;

    let campoDataFinalRelatorio = null;

    let botaoAplicarFiltroRelatorio = null;

    let botaoLimparFiltroRelatorio = null;

    let areaResumoRelatorio = null;

    let areaVendasRelatorio = null;

    let areaFinanceiroRelatorio = null;

    let areaProdutosRelatorio = null;

    let areaConsumoRelatorio = null;

    let areaPerdasRelatorio = null;

    let areaFilamentosRelatorio = null;

    let areaEquipamentosRelatorio = null;


    // ==================================================
    // LOCALIZAR ELEMENTOS DA TELA
    // ==================================================

    function localizarElementosRelatorio() {

        menuRelatorio =
            document.querySelector(
                '[data-pagina="relatorio"]'
            );

        campoDataInicialRelatorio =
            document.getElementById(
                "relatorio-data-inicial"
            );

        campoDataFinalRelatorio =
            document.getElementById(
                "relatorio-data-final"
            );

        botaoAplicarFiltroRelatorio =
            document.getElementById(
                "relatorio-aplicar-filtro"
            );

        botaoLimparFiltroRelatorio =
            document.getElementById(
                "relatorio-limpar-filtro"
            );

        areaResumoRelatorio =
            document.getElementById(
                "relatorio-resumo"
            );

        areaVendasRelatorio =
            document.getElementById(
                "relatorio-vendas"
            );

        areaFinanceiroRelatorio =
            document.getElementById(
                "relatorio-financeiro"
            );

        areaProdutosRelatorio =
            document.getElementById(
                "relatorio-produtos"
            );

        areaConsumoRelatorio =
            document.getElementById(
                "relatorio-consumo-proprio"
            );

        areaPerdasRelatorio =
            document.getElementById(
                "relatorio-perdas"
            );

        areaFilamentosRelatorio =
            document.getElementById(
                "relatorio-filamentos"
            );

        areaEquipamentosRelatorio =
            document.getElementById(
                "relatorio-equipamentos"
            );

    }


    // ==================================================
    // LER FILTRO DE PERÍODO
    // ==================================================

    function atualizarPeriodoRelatorio() {

        periodoInicialRelatorio =
            campoDataInicialRelatorio
                ? campoDataInicialRelatorio.value
                : "";

        periodoFinalRelatorio =
            campoDataFinalRelatorio
                ? campoDataFinalRelatorio.value
                : "";

    }


    function limparPeriodoRelatorio() {

        periodoInicialRelatorio = "";

        periodoFinalRelatorio = "";

        if (
            campoDataInicialRelatorio
        ) {

            campoDataInicialRelatorio.value =
                "";

        }

        if (
            campoDataFinalRelatorio
        ) {

            campoDataFinalRelatorio.value =
                "";

        }

    }
        // ==================================================
    // EXIBIR RESUMO GERAL
    // ==================================================

    function mostrarResumoGeralRelatorio(
        resumo
    ) {

        if (
            !areaResumoRelatorio
        ) {

            return;

        }

        areaResumoRelatorio.innerHTML = `
            <div class="cards">

                <div class="card">
                    <span>🛒 Vendas</span>
                    <strong>
                        ${numeroFormatadoRelatorio(
                            resumo.vendas.totalVendas,
                            0
                        )}
                    </strong>
                </div>

                <div class="card">
                    <span>💰 Faturamento</span>
                    <strong>
                        ${dinheiroRelatorio(
                            resumo.vendas.faturamento
                        )}
                    </strong>
                </div>

                <div class="card">
                    <span>📦 Unidades vendidas</span>
                    <strong>
                        ${numeroFormatadoRelatorio(
                            resumo.vendas.unidadesVendidas,
                            0
                        )}
                    </strong>
                </div>

                <div class="card">
                    <span>🎁 Brindes</span>
                    <strong>
                        ${numeroFormatadoRelatorio(
                            resumo.vendas.brindes,
                            0
                        )}
                    </strong>
                </div>

                <div class="card">
                    <span>💵 Entradas recebidas</span>
                    <strong>
                        ${dinheiroRelatorio(
                            resumo.financeiro
                                .entradasRecebidas
                        )}
                    </strong>
                </div>

                <div class="card">
                    <span>💸 Despesas pagas</span>
                    <strong>
                        ${dinheiroRelatorio(
                            resumo.financeiro
                                .despesasPagas
                        )}
                    </strong>
                </div>

                <div class="card">
                    <span>📊 Saldo</span>
                    <strong>
                        ${dinheiroRelatorio(
                            resumo.financeiro.saldo
                        )}
                    </strong>
                </div>

                <div class="card">
                    <span>📦 Estoque disponível</span>
                    <strong>
                        ${numeroFormatadoRelatorio(
                            resumo.produtos
                                .unidadesEstoque,
                            0
                        )}
                    </strong>
                </div>

                <div class="card">
                    <span>🏠 Consumo próprio</span>
                    <strong>
                        ${numeroFormatadoRelatorio(
                            resumo.consumoProprio
                                .totalUnidades,
                            0
                        )}
                    </strong>
                </div>

                <div class="card">
                    <span>⚠️ Peças com falha</span>
                    <strong>
                        ${numeroFormatadoRelatorio(
                            resumo.perdas
                                .totalUnidades,
                            0
                        )}
                    </strong>
                </div>

                <div class="card">
                    <span>🧵 Filamentos</span>
                    <strong>
                        ${numeroFormatadoRelatorio(
                            resumo.filamentos
                                .totalFilamentos,
                            0
                        )}
                    </strong>
                </div>

                <div class="card">
                    <span>🖨️ Impressoras</span>
                    <strong>
                        ${numeroFormatadoRelatorio(
                            resumo.equipamentos
                                .totalImpressoras,
                            0
                        )}
                    </strong>
                </div>

            </div>
        `;

    }
        // ==================================================
    // EXIBIR RELATÓRIO DE VENDAS
    // ==================================================

    function mostrarVendasRelatorio(
        resumo
    ) {

        if (
            !areaVendasRelatorio
        ) {

            return;

        }

        const vendas =
            resumo.vendas.vendas;

        if (
            vendas.length === 0
        ) {

            areaVendasRelatorio.innerHTML =
                "<p>Nenhuma venda encontrada no período.</p>";

            return;

        }

        areaVendasRelatorio.innerHTML =
            vendas
                .map(
                    function (venda) {

                        const cliente =
                            venda.clienteNome ||
                            "Não vinculado";

                        const itens =
                            Array.isArray(
                                venda.itens
                            )
                                ? venda.itens
                                : [];

                        const totalUnidades =
                            itens.reduce(
                                function (
                                    soma,
                                    item
                                ) {

                                    return (
                                        soma +
                                        numeroPositivoRelatorio(
                                            item.quantidade
                                        )
                                    );

                                },
                                0
                            );

                        return `
                            <div class="card-item">

                                <h4>
                                    Venda #${escaparTextoRelatorio(
                                        venda.id
                                    )}
                                </h4>

                                <p>
                                    <strong>Data:</strong>
                                    ${formatarDataRelatorio(
                                        venda.data
                                    )}
                                </p>

                                <p>
                                    <strong>Cliente:</strong>
                                    ${escaparTextoRelatorio(
                                        cliente
                                    )}
                                </p>

                                <p>
                                    <strong>Unidades:</strong>
                                    ${numeroFormatadoRelatorio(
                                        totalUnidades,
                                        0
                                    )}
                                </p>

                                <p>
                                    <strong>Total:</strong>
                                    ${dinheiroRelatorio(
                                        venda.total
                                    )}
                                </p>

                                <p>
                                    <strong>Valor pago:</strong>
                                    ${dinheiroRelatorio(
                                        venda.valorPago
                                    )}
                                </p>

                                <p>
                                    <strong>Situação:</strong>
                                    ${escaparTextoRelatorio(
                                        venda.situacaoPagamento ||
                                        "Não informada"
                                    )}
                                </p>

                            </div>
                        `;

                    }
                )
                .join("");

    }


    // ==================================================
    // EXIBIR RELATÓRIO FINANCEIRO
    // ==================================================

    function mostrarFinanceiroRelatorio(
        resumo
    ) {

        if (
            !areaFinanceiroRelatorio
        ) {

            return;

        }

        const lancamentos =
            resumo.financeiro
                .lancamentos;

        if (
            lancamentos.length === 0
        ) {

            areaFinanceiroRelatorio.innerHTML =
                "<p>Nenhum lançamento financeiro encontrado no período.</p>";

            return;

        }

        areaFinanceiroRelatorio.innerHTML =
            lancamentos
                .map(
                    function (
                        lancamento
                    ) {

                        const valor =
                            numeroPositivoRelatorio(
                                lancamento.valor
                            );

                        const valorPago =
                            numeroPositivoRelatorio(
                                lancamento.valorPago
                            );

                        const valorPendente =
                            Math.max(
                                0,
                                valor -
                                valorPago
                            );

                        return `
                            <div class="card-item">

                                <h4>
                                    ${escaparTextoRelatorio(
                                        lancamento.descricao ||
                                        "Lançamento"
                                    )}
                                </h4>

                                <p>
                                    <strong>Tipo:</strong>
                                    ${escaparTextoRelatorio(
                                        lancamento.tipo ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Categoria:</strong>
                                    ${escaparTextoRelatorio(
                                        lancamento.categoria ||
                                        "Não informada"
                                    )}
                                </p>

                                <p>
                                    <strong>Data:</strong>
                                    ${formatarDataRelatorio(
                                        lancamento.data
                                    )}
                                </p>

                                <p>
                                    <strong>Valor:</strong>
                                    ${dinheiroRelatorio(
                                        valor
                                    )}
                                </p>

                                <p>
                                    <strong>Valor pago:</strong>
                                    ${dinheiroRelatorio(
                                        valorPago
                                    )}
                                </p>

                                <p>
                                    <strong>Valor pendente:</strong>
                                    ${dinheiroRelatorio(
                                        valorPendente
                                    )}
                                </p>

                                <p>
                                    <strong>Situação:</strong>
                                    ${escaparTextoRelatorio(
                                        lancamento.situacao ||
                                        "Não informada"
                                    )}
                                </p>

                            </div>
                        `;

                    }
                )
                .join("");

    }
        // ==================================================
    // EXIBIR RELATÓRIO DE PRODUTOS
    // ==================================================

    function mostrarProdutosRelatorio(
        resumo
    ) {

        if (
            !areaProdutosRelatorio
        ) {

            return;

        }

        if (
            produtosRelatorio.length === 0
        ) {

            areaProdutosRelatorio.innerHTML =
                "<p>Nenhum produto cadastrado.</p>";

            return;

        }

        areaProdutosRelatorio.innerHTML =
            produtosRelatorio
                .map(
                    function (
                        produto
                    ) {

                        return `
                            <div class="card-item">

                                <h4>
                                    ${escaparTextoRelatorio(
                                        produto.nome ||
                                        "Produto sem nome"
                                    )}
                                </h4>

                                <p>
                                    <strong>Produzido:</strong>
                                    ${numeroFormatadoRelatorio(
                                        produto.quantidadeProduzida,
                                        0
                                    )}
                                </p>

                                <p>
                                    <strong>Disponível:</strong>
                                    ${numeroFormatadoRelatorio(
                                        produto.quantidadeDisponivel,
                                        0
                                    )}
                                </p>

                                <p>
                                    <strong>Custo unitário:</strong>
                                    ${dinheiroRelatorio(
                                        produto.custoUnitario
                                    )}
                                </p>

                                <p>
                                    <strong>Preço de venda:</strong>
                                    ${dinheiroRelatorio(
                                        produto.precoVenda
                                    )}
                                </p>

                            </div>
                        `;

                    }
                )
                .join("");

    }


    // ==================================================
    // EXIBIR CONSUMO PRÓPRIO
    // ==================================================

    function mostrarConsumoProprioRelatorio(
        resumo
    ) {

        if (
            !areaConsumoRelatorio
        ) {

            return;

        }

        const registros =
            resumo.consumoProprio
                .registros;

        if (
            registros.length === 0
        ) {

            areaConsumoRelatorio.innerHTML =
                "<p>Nenhum consumo próprio encontrado no período.</p>";

            return;

        }

        areaConsumoRelatorio.innerHTML =
            registros
                .map(
                    function (
                        consumo
                    ) {

                        return `
                            <div class="card-item">

                                <h4>
                                    ${escaparTextoRelatorio(
                                        consumo.produtoNome ||
                                        consumo.nome ||
                                        "Produto"
                                    )}
                                </h4>

                                <p>
                                    <strong>Data:</strong>
                                    ${formatarDataRelatorio(
                                        consumo.data
                                    )}
                                </p>

                                <p>
                                    <strong>Quantidade:</strong>
                                    ${numeroFormatadoRelatorio(
                                        consumo.quantidade,
                                        0
                                    )}
                                </p>

                                <p>
                                    <strong>Motivo:</strong>
                                    ${escaparTextoRelatorio(
                                        consumo.motivo ||
                                        "Não informado"
                                    )}
                                </p>

                            </div>
                        `;

                    }
                )
                .join("");

    }


    // ==================================================
    // EXIBIR FALHAS E PERDAS
    // ==================================================

    function mostrarPerdasRelatorio(
        resumo
    ) {

        if (
            !areaPerdasRelatorio
        ) {

            return;

        }

        const registros =
            resumo.perdas
                .registros;

        if (
            registros.length === 0
        ) {

            areaPerdasRelatorio.innerHTML =
                "<p>Nenhuma falha encontrada no período.</p>";

            return;

        }

        areaPerdasRelatorio.innerHTML =
            registros
                .map(
                    function (
                        perda
                    ) {

                        return `
                            <div class="card-item">

                                <h4>
                                    ${escaparTextoRelatorio(
                                        perda.produtoNome ||
                                        perda.nome ||
                                        "Produto"
                                    )}
                                </h4>

                                <p>
                                    <strong>Data:</strong>
                                    ${formatarDataRelatorio(
                                        perda.data
                                    )}
                                </p>

                                <p>
                                    <strong>Quantidade perdida:</strong>
                                    ${numeroFormatadoRelatorio(
                                        perda.quantidade,
                                        0
                                    )}
                                </p>

                                <p>
                                    <strong>Custo da perda:</strong>
                                    ${dinheiroRelatorio(
                                        perda.custoTotal
                                    )}
                                </p>

                                <p>
                                    <strong>Motivo:</strong>
                                    ${escaparTextoRelatorio(
                                        perda.motivo ||
                                        perda.observacoes ||
                                        "Não informado"
                                    )}
                                </p>

                            </div>
                        `;

                    }
                )
                .join("");

    }
    // ==================================================
    // EXIBIR RELATÓRIO DE FILAMENTOS
    // ==================================================

    function mostrarFilamentosRelatorio(
        resumo
    ) {

        if (
            !areaFilamentosRelatorio
        ) {

            return;

        }

        if (
            filamentosRelatorio.length === 0
        ) {

            areaFilamentosRelatorio.innerHTML =
                "<p>Nenhum filamento cadastrado.</p>";

            return;

        }

        areaFilamentosRelatorio.innerHTML =
            filamentosRelatorio
                .map(
                    function (
                        filamento
                    ) {

                        return `
                            <div class="card-item">

                                <h4>
                                    ${escaparTextoRelatorio(
                                        filamento.fabricante ||
                                        filamento.nome ||
                                        "Filamento"
                                    )}
                                </h4>

                                <p>
                                    <strong>Material:</strong>
                                    ${escaparTextoRelatorio(
                                        filamento.material ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Cor:</strong>
                                    ${escaparTextoRelatorio(
                                        filamento.cor ||
                                        "Não informada"
                                    )}
                                </p>

                                <p>
                                    <strong>Peso restante:</strong>
                                    ${numeroFormatadoRelatorio(
                                        filamento.pesoRestante,
                                        2
                                    )} g
                                </p>

                                <p>
                                    <strong>Status:</strong>
                                    ${escaparTextoRelatorio(
                                        filamento.status ||
                                        "Não informado"
                                    )}
                                </p>

                            </div>
                        `;

                    }
                )
                .join("");

    }


    // ==================================================
    // EXIBIR RELATÓRIO DE EQUIPAMENTOS
    // ==================================================

    function mostrarEquipamentosRelatorio(
        resumo
    ) {

        if (
            !areaEquipamentosRelatorio
        ) {

            return;

        }

        if (
            impressorasRelatorio.length === 0
        ) {

            areaEquipamentosRelatorio.innerHTML =
                "<p>Nenhuma impressora cadastrada.</p>";

            return;

        }

        areaEquipamentosRelatorio.innerHTML =
            impressorasRelatorio
                .map(
                    function (
                        impressora
                    ) {

                        const horasTotais =
                            numeroPositivoRelatorio(
                                impressora.horasIniciais
                            ) +
                            numeroPositivoRelatorio(
                                impressora.horasProducoes
                            ) +
                            numeroPositivoRelatorio(
                                impressora.horasAjustes
                            );

                        return `
                            <div class="card-item">

                                <h4>
                                    ${escaparTextoRelatorio(
                                        impressora.nome ||
                                        impressora.modelo ||
                                        "Impressora"
                                    )}
                                </h4>

                                <p>
                                    <strong>Modelo:</strong>
                                    ${escaparTextoRelatorio(
                                        impressora.modelo ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Status:</strong>
                                    ${escaparTextoRelatorio(
                                        impressora.status ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Horas de produção:</strong>
                                    ${numeroFormatadoRelatorio(
                                        impressora.horasProducoes,
                                        2
                                    )} h
                                </p>

                                <p>
                                    <strong>Horas totais:</strong>
                                    ${numeroFormatadoRelatorio(
                                        horasTotais,
                                        2
                                    )} h
                                </p>

                            </div>
                        `;

                    }
                )
                .join("");

    }
    // ==================================================
    // ATUALIZAR TODOS OS RELATÓRIOS
    // ==================================================

    function atualizarRelatorios() {

        carregarDadosRelatorio();

        atualizarPeriodoRelatorio();

        const resumo =
            calcularResumoGeralRelatorio();

        mostrarResumoGeralRelatorio(
            resumo
        );

        mostrarVendasRelatorio(
            resumo
        );

        mostrarFinanceiroRelatorio(
            resumo
        );

        mostrarProdutosRelatorio(
            resumo
        );

        mostrarConsumoProprioRelatorio(
            resumo
        );

        mostrarPerdasRelatorio(
            resumo
        );

        mostrarFilamentosRelatorio(
            resumo
        );

        mostrarEquipamentosRelatorio(
            resumo
        );

    }
        // ==================================================
    // EVENTOS DO MÓDULO RELATÓRIOS
    // ==================================================

    function configurarEventosRelatorio() {

        if (
            botaoAplicarFiltroRelatorio
        ) {

            botaoAplicarFiltroRelatorio
                .addEventListener(
                    "click",
                    function () {

                        atualizarRelatorios();

                    }
                );

        }

        if (
            botaoLimparFiltroRelatorio
        ) {

            botaoLimparFiltroRelatorio
                .addEventListener(
                    "click",
                    function () {

                        limparPeriodoRelatorio();

                        atualizarRelatorios();

                    }
                );

        }

        if (
            menuRelatorio
        ) {

            menuRelatorio
                .addEventListener(
                    "click",
                    function () {

                        atualizarRelatorios();

                    }
                );

        }

    }


    // ==================================================
    // DISPONIBILIZAR PARA OUTROS MÓDULOS
    // ==================================================

    window.atualizarRelatorios =
        atualizarRelatorios;


    // ==================================================
    // INICIALIZAÇÃO
    // ==================================================

    localizarElementosRelatorio();

    carregarDadosRelatorio();

    configurarEventosRelatorio();

    atualizarRelatorios();

    moduloRelatorioIniciado =
        true;


})();
