// ======================================================
// ORGANIZA 3D MANAGER
// DASHBOARD
// dashboard.js
// ======================================================

"use strict";

(function () {

    // ==================================================
    // CHAVES DO LOCALSTORAGE
    // ==================================================

    const CHAVE_PRODUTOS =
        "organiza3d_produtos_produzidos";

    const CHAVE_VENDAS =
        "organiza3d_vendas";

    const CHAVE_CLIENTES =
        "organiza3d_cliente";

        const CHAVE_FILAMENTOS =
        "organiza3d_filamentos";

    const CHAVE_ACESSORIOS =
        "organiza3d_acessorios";

    const CHAVE_EMBALAGENS =
        "organiza3d_embalagens";

    const CHAVE_IMPRESSORAS =
        "organiza3d_impressoras";

    const CHAVE_FINANCEIRO =
        "organiza3d_financeiro";

    const CHAVE_CONSUMO_PROPRIO =
        "organiza3d_consumo_proprio";

    const CHAVE_PERDAS =
        "organiza3d_perdas_produtos";
           
    const CHAVE_PREJUIZOS_FILAMENTOS =
        "organiza3d_prejuizos_filamentos";

    // ==================================================
    // FUNÇÕES AUXILIARES
    // ==================================================

    function lerListaDashboard(
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
                "Erro ao carregar dados do Dashboard:",
                chave,
                erro
            );

            return [];

        }

    }

    function numeroDashboard(
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

    function numeroPositivoDashboard(
        valor
    ) {

        return Math.max(
            0,
            numeroDashboard(
                valor
            )
        );

    }

    function dinheiroDashboard(
        valor
    ) {

        return numeroDashboard(
            valor
        ).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    }

    function numeroFormatadoDashboard(
        valor,
        casas = 0
    ) {

        return numeroDashboard(
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

    function definirTextoDashboard(
        id,
        valor
    ) {

        const elemento =
            document.getElementById(
                id
            );

        if (!elemento) {

            return;

        }

        elemento.textContent =
            valor;

    }

    function definirDinheiroDashboard(
        id,
        valor
    ) {

        definirTextoDashboard(
            id,
            dinheiroDashboard(
                valor
            )
        );

    }

    function formatarHorasDashboard(
        horas
    ) {

        const total =
            numeroDashboard(
                horas
            );

        const horasInteiras =
            Math.floor(total);

        let minutos =
            Math.round(
                (
                    total -
                    horasInteiras
                ) * 60
            );

        let horasFinal =
            horasInteiras;

        if (minutos >= 60) {

            horasFinal += 1;

            minutos = 0;

        }

        if (minutos <= 0) {

            return (
                horasFinal +
                "h"
            );

        }

        return (
            horasFinal +
            "h " +
            minutos +
            "min"
        );

    }

    // ==================================================
    // RESUMO DAS VENDAS
    // ==================================================

        function calcularVendasDashboard(
        vendas,
        produtos
    ) {

        let faturamento = 0;

        let faturamentoProdutos = 0;

        let fretesClientes = 0;

        let custoProdutosVendidos = 0;

        let unidadesVendidas = 0;

        let brindes = 0;

        let unidadesSemCusto = 0;

        const produtosPorId =
            new Map();

        produtos.forEach(
            function (produto) {

                produtosPorId.set(
                    String(
                        produto.id
                    ),
                    produto
                );

            }
        );

        vendas.forEach(
            function (venda) {

                faturamento +=
                    numeroPositivoDashboard(
                        venda.total
                    );

                fretesClientes +=
                    numeroPositivoDashboard(
                        venda.frete
                    );

                const subtotalProdutos =
                    numeroPositivoDashboard(
                        venda.subtotal
                    );

                const desconto =
                    numeroPositivoDashboard(
                        venda.desconto
                    );

                faturamentoProdutos +=
                    Math.max(
                        0,
                        subtotalProdutos -
                        desconto
                    );

                if (
                    !Array.isArray(
                        venda.itens
                    )
                ) {

                    return;

                }

                venda.itens.forEach(
                    function (item) {

                        const quantidade =
                            numeroPositivoDashboard(
                                item.quantidade
                            );

                        const produto =
                            produtosPorId.get(
                                String(
                                    item.produtoId
                                )
                            ) || null;

                        let custoUnitario =
                            numeroPositivoDashboard(
                                item
                                    .custoUnitarioProducao
                            );

                        if (
                            custoUnitario <= 0 &&
                            produto
                        ) {

                            custoUnitario =
                                numeroPositivoDashboard(
                                    produto.custoUnitario ??
                                    produto.custoUnitarioDireto ??
                                    0
                                );

                        }

                        if (custoUnitario > 0) {

                            custoProdutosVendidos +=
                                quantidade *
                                custoUnitario;

                        } else if (quantidade > 0) {

                            unidadesSemCusto +=
                                quantidade;

                        }

                        if (item.brinde) {

                            brindes +=
                                quantidade;

                        } else {

                            unidadesVendidas +=
                                quantidade;

                        }

                    }
                );

            }
        );

        const ticketMedio =
            vendas.length > 0
                ? faturamento /
                    vendas.length
                : 0;

        return {

            faturamento:
                faturamento,

            faturamentoProdutos:
                faturamentoProdutos,

            fretesClientes:
                fretesClientes,

            custoProdutosVendidos:
                custoProdutosVendidos,

            totalVendas:
                vendas.length,

            unidadesVendidas:
                unidadesVendidas,

            brindes:
                brindes,

            ticketMedio:
                ticketMedio,

            unidadesSemCusto:
                unidadesSemCusto

        };

    }

    // ==================================================
    // RESUMO FINANCEIRO
    // ==================================================

    function calcularFinanceiroDashboard(
        lancamentos
    ) {

        let entradas = 0;

        let despesas = 0;

        let entradasPendentes = 0;

        let despesasPendentes = 0;

        lancamentos.forEach(
            function (lancamento) {

                const valor =
                    numeroPositivoDashboard(
                        lancamento.valor
                    );

                const valorPago =
                    numeroPositivoDashboard(
                        lancamento.valorPago
                    );

                const realizado =
                    Math.min(
                        valor,
                        valorPago
                    );

                const pendente =
                    Math.max(
                        0,
                        valor -
                        realizado
                    );

                if (
                    lancamento.tipo ===
                    "Entrada"
                ) {

                    entradas +=
                        realizado;

                    entradasPendentes +=
                        pendente;

                }

                if (
                    lancamento.tipo ===
                    "Despesa"
                ) {

                    despesas +=
                        realizado;

                    despesasPendentes +=
                        pendente;

                }

            }
        );

        return {

            entradas:
                entradas,

            despesas:
                despesas,

            saldo:
                entradas -
                despesas,

            entradasPendentes:
                entradasPendentes,

            despesasPendentes:
                despesasPendentes

        };

    }

    // ==================================================
    // PRODUTOS E ESTOQUE
    // ==================================================

    function calcularProdutosDashboard(
        produtos
    ) {

        let unidadesEstoque = 0;

        let valorEstoque = 0;

        produtos.forEach(
            function (produto) {

                const quantidade =
                    numeroPositivoDashboard(
                        produto.quantidadeDisponivel
                    );

                const preco =
                    numeroPositivoDashboard(
                        produto.precoVenda
                    );

                unidadesEstoque +=
                    quantidade;

                valorEstoque +=
                    quantidade *
                    preco;

            }
        );

        return {

            totalProdutos:
                produtos.length,

            unidadesEstoque:
                unidadesEstoque,

            valorEstoque:
                valorEstoque

        };

    }

    // ==================================================
    // CONSUMO PRÓPRIO
    // ==================================================

    function calcularConsumoProprioDashboard(
        consumos
    ) {

        return consumos.reduce(
            function (
                total,
                consumo
            ) {

                return (
                    total +
                    numeroPositivoDashboard(
                        consumo.quantidade
                    )
                );

            },
            0
        );

    }

    // ==================================================
    // PERDAS DE PRODUTOS
    // ==================================================

    function calcularPerdasDashboard(
        perdas
    ) {

        return perdas.reduce(
            function (
                total,
                perda
            ) {

                return (
                    total +
                    numeroPositivoDashboard(
                        perda.quantidade
                    )
                );

            },
            0
        );

    }
    // ==================================================
    // VALOR DAS PERDAS
    // ==================================================

    function calcularValorPerdasDashboard(
        perdas
    ) {

        return perdas.reduce(
            function (
                total,
                perda
            ) {

                return (
                    total +
                    numeroPositivoDashboard(
                        perda.custoTotal
                    )
                );

            },
            0
        );

    }

    // ==================================================
    // CUSTO TOTAL DAS PRODUÇÕES
    // ==================================================

    function calcularCustoProducoesDashboard(
        produtos
    ) {

        return produtos.reduce(
            function (
                total,
                produto
            ) {

                return (
                    total +
                    numeroPositivoDashboard(
                        produto.custoTotalProducao
                    )
                );

            },
            0
        );

    }

    // ==================================================
    // VALOR ATUAL DA MATÉRIA-PRIMA
    // ==================================================

    function calcularMateriaPrimaDashboard(
        filamentos,
        acessorios,
        embalagens
    ) {

        const valorFilamentos =
            filamentos.reduce(
                function (
                    total,
                    filamento
                ) {

                    const pesoInicial =
                        numeroPositivoDashboard(
                            filamento.pesoInicial
                        );

                    const pesoRestante =
                        numeroPositivoDashboard(
                            filamento.pesoRestante
                        );

                    const valorRolo =
                        numeroPositivoDashboard(
                            filamento.valor
                        );

                    const valorRestante =
                        pesoInicial > 0
                            ? (
                                pesoRestante /
                                pesoInicial
                            ) *
                            valorRolo
                            : 0;

                    return (
                        total +
                        valorRestante
                    );

                },
                0
            );

        const valorAcessorios =
            acessorios.reduce(
                function (
                    total,
                    acessorio
                ) {

                    return (
                        total +
                        (
                            numeroPositivoDashboard(
                                acessorio.quantidade
                            ) *
                            numeroPositivoDashboard(
                                acessorio.valorUnitario
                            )
                        )
                    );

                },
                0
            );

        const valorEmbalagens =
            embalagens.reduce(
                function (
                    total,
                    embalagem
                ) {

                    return (
                        total +
                        (
                            numeroPositivoDashboard(
                                embalagem.quantidade
                            ) *
                            numeroPositivoDashboard(
                                embalagem.valorUnitario
                            )
                        )
                    );

                },
                0
            );

        return (
            valorFilamentos +
            valorAcessorios +
            valorEmbalagens
        );

    }
    // ==================================================
    // FILAMENTOS
    // ==================================================

    function calcularFilamentosDashboard(
        filamentos
    ) {

        let pesoDisponivel = 0;

        let estoqueBaixo = 0;

        let finalizados = 0;

        filamentos.forEach(
            function (filamento) {

                const pesoRestante =
                    numeroPositivoDashboard(
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

            total:
                filamentos.length,

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

    function calcularEquipamentosDashboard(
        impressoras
    ) {

        let ativas = 0;

        let emManutencao = 0;

        let horasProducoes = 0;

        let horasTotais = 0;

        impressoras.forEach(
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

                    ativas += 1;

                }

                if (
                    status.includes(
                        "manuten"
                    )
                ) {

                    emManutencao += 1;

                }

                const horasIniciais =
                    numeroDashboard(
                        impressora.horasIniciais
                    );

                const horasProducao =
                    numeroDashboard(
                        impressora.horasProducoes
                    );

                const horasAjustes =
                    numeroDashboard(
                        impressora.horasAjustes
                    );

                horasProducoes +=
                    horasProducao;

                horasTotais +=
                    Math.max(
                        0,
                        horasIniciais +
                        horasProducao +
                        horasAjustes
                    );

            }
        );

        return {

            total:
                impressoras.length,

            ativas:
                ativas,

            emManutencao:
                emManutencao,

            horasProducoes:
                horasProducoes,

            horasTotais:
                horasTotais

        };

    }

    // ==================================================
    // ALERTAS DO DASHBOARD
    // ==================================================

    function atualizarAlertasDashboard(
        dados
    ) {

        const campo =
            document.getElementById(
                "dashboard-alertas"
            );

        if (!campo) {

            return;

        }

        const alertas = [];

        if (
            dados.financeiro
                .entradasPendentes > 0
        ) {

            alertas.push(
                "Valores a receber: " +
                dinheiroDashboard(
                    dados.financeiro
                        .entradasPendentes
                ) +
                "."
            );

        }

        if (
            dados.financeiro
                .despesasPendentes > 0
        ) {

            alertas.push(
                "Valores a pagar: " +
                dinheiroDashboard(
                    dados.financeiro
                        .despesasPendentes
                ) +
                "."
            );

        }

        if (
            dados.financeiro.saldo < 0
        ) {

            alertas.push(
                "Saldo financeiro negativo em " +
                dinheiroDashboard(
                    Math.abs(
                        dados.financeiro.saldo
                    )
                ) +
                "."
            );

        }

        if (
            dados.filamentos
                .estoqueBaixo > 0
        ) {

            alertas.push(
                dados.filamentos
                    .estoqueBaixo +
                " filamento(s) com estoque baixo."
            );

        }

        if (
            dados.filamentos
                .finalizados > 0
        ) {

            alertas.push(
                dados.filamentos
                    .finalizados +
                " filamento(s) finalizado(s)."
            );

        }

        if (
            dados.equipamentos
                .emManutencao > 0
        ) {

            alertas.push(
                dados.equipamentos
                    .emManutencao +
                " impressora(s) em manutenção."
            );

        }

        if (
            dados.produtos
                .unidadesEstoque <= 0
        ) {

            alertas.push(
                "Não há unidades de produtos disponíveis em estoque."
            );

        }

                if (
            dados.vendas &&
            dados.vendas
                .unidadesSemCusto > 0
        ) {

            alertas.push(
                dados.vendas
                    .unidadesSemCusto +
                " unidade(s) vendida(s) sem custo de produção identificado."
            );

        }

        if (
            alertas.length === 0
        ) {

            campo.innerHTML =
                "<p>Nenhum aviso no momento.</p>";

            return;

        }

        campo.innerHTML =
            alertas
                .map(
                    function (alerta) {

                        return (
                            "<p>⚠️ " +
                            alerta +
                            "</p>"
                        );

                    }
                )
                .join("");

    }

    // ==================================================
    // ATUALIZAÇÃO PRINCIPAL
    // ==================================================

    function atualizarDashboardCompleto() {

        const produtos =
            lerListaDashboard(
                CHAVE_PRODUTOS
            );

        const vendas =
            lerListaDashboard(
                CHAVE_VENDAS
            );

        const clientes =
            lerListaDashboard(
                CHAVE_CLIENTES
            );

                const filamentos =
            lerListaDashboard(
                CHAVE_FILAMENTOS
            );

        const acessorios =
            lerListaDashboard(
                CHAVE_ACESSORIOS
            );

        const embalagens =
            lerListaDashboard(
                CHAVE_EMBALAGENS
            );

        const impressoras =
            lerListaDashboard(
                CHAVE_IMPRESSORAS
            );

        const financeiro =
            lerListaDashboard(
                CHAVE_FINANCEIRO
            );

        const consumosProprios =
            lerListaDashboard(
                CHAVE_CONSUMO_PROPRIO
            );

               const perdas =
            lerListaDashboard(
                CHAVE_PERDAS
            );

        const prejuizosFilamentos =
            lerListaDashboard(
                CHAVE_PREJUIZOS_FILAMENTOS
            );

               const resumoVendas =
            calcularVendasDashboard(
                vendas,
                produtos
            );

        const resumoFinanceiro =
            calcularFinanceiroDashboard(
                financeiro
            );

        const resultadoDisponivel =
            resumoFinanceiro.saldo -
            resumoVendas
                .custoProdutosVendidos -
            resumoVendas
                .fretesClientes;

        const resumoProdutos =
            calcularProdutosDashboard(
                produtos
            );

        const resumoFilamentos =
            calcularFilamentosDashboard(
                filamentos
            );

        const resumoEquipamentos =
            calcularEquipamentosDashboard(
                impressoras
            );

        const totalConsumoProprio =
            calcularConsumoProprioDashboard(
                consumosProprios
            );

        
                  const totalPerdas =
            calcularPerdasDashboard(
                perdas
            );

                const valorPerdasProdutos =
            calcularValorPerdasDashboard(
                perdas
            );

        const valorPerdasFilamentos =
            calcularValorPerdasDashboard(
                prejuizosFilamentos
            );

        const valorPerdas =
            valorPerdasProdutos +
            valorPerdasFilamentos;

        const custoProducoes =
            calcularCustoProducoesDashboard(
                produtos
            );

        const percentualFalhas =
            custoProducoes > 0
                ? (
                    valorPerdas /
                    custoProducoes
                ) * 100
                : 0;

        const valorMateriaPrima =
            calcularMateriaPrimaDashboard(
                filamentos,
                acessorios,
                embalagens
            );

        // ==============================================
        // FINANCEIRO E VENDAS
        // ==============================================

        definirDinheiroDashboard(
            "total-faturamento",
            resumoVendas.faturamento
        );

        definirDinheiroDashboard(
            "dashboard-total-entradas",
            resumoFinanceiro.entradas
        );

        definirDinheiroDashboard(
            "dashboard-total-despesas",
            resumoFinanceiro.despesas
        );

                definirDinheiroDashboard(
            "dashboard-saldo-financeiro",
            resumoFinanceiro.saldo
        );

        definirDinheiroDashboard(
            "dashboard-custo-produtos-vendidos",
            resumoVendas
                .custoProdutosVendidos
        );

        definirDinheiroDashboard(
            "dashboard-frete-clientes",
            resumoVendas
                .fretesClientes
        );

        definirDinheiroDashboard(
            "dashboard-resultado-disponivel",
            resultadoDisponivel
        );

        definirDinheiroDashboard(
            "dashboard-entradas-pendentes",
            resumoFinanceiro
                .entradasPendentes
        );

        definirDinheiroDashboard(
            "dashboard-despesas-pendentes",
            resumoFinanceiro
                .despesasPendentes
        );

        definirTextoDashboard(
            "dashboard-total-vendas",
            resumoVendas.totalVendas
        );

        definirTextoDashboard(
            "dashboard-unidades-vendidas",
            numeroFormatadoDashboard(
                resumoVendas
                    .unidadesVendidas,
                0
            )
        );

        definirTextoDashboard(
            "dashboard-total-brindes",
            numeroFormatadoDashboard(
                resumoVendas.brindes,
                0
            )
        );

        definirDinheiroDashboard(
            "dashboard-ticket-medio",
            resumoVendas.ticketMedio
        );

        // ==============================================
        // PRODUTOS E ESTOQUE
        // ==============================================

        definirTextoDashboard(
            "total-produto",
            resumoProdutos.totalProdutos
        );

        definirTextoDashboard(
            "dashboard-unidades-estoque",
            numeroFormatadoDashboard(
                resumoProdutos
                    .unidadesEstoque,
                0
            )
        );

        definirDinheiroDashboard(
            "dashboard-valor-estoque",
            resumoProdutos.valorEstoque
        );

        definirTextoDashboard(
            "dashboard-consumo-proprio",
            numeroFormatadoDashboard(
                totalConsumoProprio,
                0
            )
        );

                definirTextoDashboard(
            "dashboard-perdas-produtos",
            numeroFormatadoDashboard(
                totalPerdas,
                0
            )
        );

        definirDinheiroDashboard(
            "dashboard-valor-materia-prima",
            valorMateriaPrima
        );

        definirDinheiroDashboard(
            "dashboard-valor-perdas",
            valorPerdas
        );

        definirTextoDashboard(
            "dashboard-percentual-falhas",
            numeroFormatadoDashboard(
                percentualFalhas,
                2
            ) + "%"
        );

        definirTextoDashboard(
            "total-filamento",
            resumoFilamentos.total
        );

        definirTextoDashboard(
            "dashboard-filamento-disponivel",
            numeroFormatadoDashboard(
                resumoFilamentos
                    .pesoDisponivel,
                2
            ) +
            " g"
        );

        definirTextoDashboard(
            "total-cliente",
            clientes.length
        );

        // ==============================================
        // EQUIPAMENTOS
        // ==============================================

        definirTextoDashboard(
            "total-impressoras",
            resumoEquipamentos.total
        );

        definirTextoDashboard(
            "dashboard-impressoras-ativas",
            resumoEquipamentos.ativas
        );

        definirTextoDashboard(
            "dashboard-horas-producao",
            formatarHorasDashboard(
                resumoEquipamentos
                    .horasProducoes
            )
        );

        definirTextoDashboard(
            "dashboard-horas-totais",
            formatarHorasDashboard(
                resumoEquipamentos
                    .horasTotais
            )
        );

        // ==============================================
        // ALERTAS
        // ==============================================

        atualizarAlertasDashboard({

            financeiro:
                resumoFinanceiro,

            vendas:
                resumoVendas,

            produtos:
                resumoProdutos,

            filamentos:
                resumoFilamentos,

            equipamentos:
                resumoEquipamentos

        });

    }

    // ==================================================
    // EVENTOS
    // ==================================================

    function configurarEventosDashboard() {

        const menuDashboard =
            document.querySelector(
                '[data-pagina="dashboard"]'
            );

        const botaoAtualizar =
            document.getElementById(
                "atualizar-dashboard"
            );

        if (menuDashboard) {

            menuDashboard.addEventListener(
                "click",
                atualizarDashboardCompleto
            );

        }

        if (botaoAtualizar) {

            botaoAtualizar.addEventListener(
                "click",
                function () {

                    atualizarDashboardCompleto();

                    alert(
                        "Dashboard atualizado com sucesso!"
                    );

                }
            );

        }

    }

    // ==================================================
    // EXPOR ATUALIZAÇÃO PARA OUTROS MÓDULOS
    // ==================================================

    window.atualizarDashboardCompleto =
        atualizarDashboardCompleto;

    // ==================================================
    // ATUALIZAÇÃO POR ALTERAÇÃO DO LOCALSTORAGE
    // ==================================================

    window.addEventListener(
        "storage",
        function (evento) {

            const chavesDashboard = [

                CHAVE_PRODUTOS,
                CHAVE_VENDAS,
                CHAVE_CLIENTES,
                CHAVE_FILAMENTOS,
                CHAVE_IMPRESSORAS,
                CHAVE_FINANCEIRO,
                CHAVE_CONSUMO_PROPRIO,
                CHAVE_PERDAS

            ];

            if (
                evento.key &&
                chavesDashboard.includes(
                    evento.key
                )
            ) {

                atualizarDashboardCompleto();

            }

        }
    );

    // ==================================================
    // INICIALIZAÇÃO
    // ==================================================

    configurarEventosDashboard();

atualizarDashboardCompleto();
})();