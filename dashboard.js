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

    const CHAVE_IMPRESSORAS =
        "organiza3d_impressoras";

    const CHAVE_FINANCEIRO =
        "organiza3d_financeiro";

    const CHAVE_CONSUMO_PROPRIO =
        "organiza3d_consumo_proprio";

    const CHAVE_PERDAS =
        "organiza3d_perdas_produtos";

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
        vendas
    ) {

        let faturamento = 0;

        let unidadesVendidas = 0;

        let brindes = 0;

        vendas.forEach(
            function (venda) {

                faturamento +=
                    numeroPositivoDashboard(
                        venda.total
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

            totalVendas:
                vendas.length,

            unidadesVendidas:
                unidadesVendidas,

            brindes:
                brindes,

            ticketMedio:
                ticketMedio

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
                    filamento.status ===
                    "Finalizado" ||
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

        const resumoVendas =
            calcularVendasDashboard(
                vendas
            );

        const resumoFinanceiro =
            calcularFinanceiroDashboard(
                financeiro
            );

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
// ATUALIZAÇÃO PRINCIPAL DO DASHBOARD
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


    // ==============================================
    // CALCULAR RESUMOS
    // ==============================================

    const resumoVendas =
        calcularVendasDashboard(
            vendas
        );

    const resumoFinanceiro =
        calcularFinanceiroDashboard(
            financeiro
        );

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

        produtos:
            resumoProdutos,

        filamentos:
            resumoFilamentos,

        equipamentos:
            resumoEquipamentos

    });

}
// ==================================================
// EVENTOS DO DASHBOARD
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
// DISPONIBILIZAR PARA OUTROS MÓDULOS
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
