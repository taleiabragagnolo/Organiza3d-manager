// =========================
// DASHBOARD 2.0
// =========================

const menuDashboard =
    document.querySelector(
        '[data-pagina="dashboard"]'
    );

const botaoAtualizarDashboardCompleto =
    document.getElementById(
        "atualizar-dashboard"
    );

// =========================
// FUNÇÕES AUXILIARES
// =========================

function definirTextoDashboard(
    id,
    valor
) {
    const elemento =
        document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.textContent = valor;
}

function definirDinheiroDashboard(
    id,
    valor
) {
    definirTextoDashboard(
        id,
        formatarDinheiro(valor)
    );
}

// =========================
// ENCOMENDAS
// =========================

function contarEncomendasDashboard(
    status
) {
    if (
        typeof encomendas === "undefined" ||
        !Array.isArray(encomendas)
    ) {
        return 0;
    }

    return encomendas.filter(
        function (encomenda) {
            return encomenda.status === status;
        }
    ).length;
}

function calcularEncomendasAtrasadasDashboard() {
    if (
        typeof encomendas === "undefined" ||
        !Array.isArray(encomendas)
    ) {
        return 0;
    }

    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);

    return encomendas.filter(
        function (encomenda) {
            if (!encomenda.dataEntrega) {
                return false;
            }

            if (
                encomenda.status === "Finalizada" ||
                encomenda.status === "Entregue" ||
                encomenda.status === "Cancelada"
            ) {
                return false;
            }

            const dataEntrega =
                new Date(
                    `${encomenda.dataEntrega}T00:00:00`
                );

            return dataEntrega < hoje;
        }
    ).length;
}

function calcularEncomendasDashboard() {
    if (
        typeof encomendas === "undefined" ||
        !Array.isArray(encomendas)
    ) {
        return {
            valorTotal: 0,
            ticketMedio: 0
        };
    }

    const encomendasValidas =
        encomendas.filter(
            function (encomenda) {
                return (
                    encomenda.status !==
                    "Cancelada"
                );
            }
        );

    const valorTotal =
        encomendasValidas.reduce(
            function (total, encomenda) {
                return total +
                    Number(
                        encomenda.valorTotal || 0
                    );
            },
            0
        );

    const ticketMedio =
        encomendasValidas.length > 0
            ? valorTotal /
                encomendasValidas.length
            : 0;

    return {
        valorTotal: valorTotal,
        ticketMedio: ticketMedio
    };
}

// =========================
// FINANCEIRO
// =========================

function calcularFinanceiroDashboard() {
    if (
        typeof lancamentosFinanceiros ===
            "undefined" ||
        !Array.isArray(
            lancamentosFinanceiros
        )
    ) {
        return {
            entradas: 0,
            despesas: 0,
            saldo: 0,
            entradasPendentes: 0,
            despesasPendentes: 0
        };
    }

    let entradas = 0;
    let despesas = 0;
    let entradasPendentes = 0;
    let despesasPendentes = 0;

    lancamentosFinanceiros.forEach(
        function (lancamento) {
            const valorRealizado =
                typeof obterValorRealizadoLancamento ===
                "function"
                    ? obterValorRealizadoLancamento(
                        lancamento
                    )
                    : Number(
                        lancamento.valorPago || 0
                    );

            const valorPendente =
                typeof obterValorPendenteLancamento ===
                "function"
                    ? obterValorPendenteLancamento(
                        lancamento
                    )
                    : Math.max(
                        0,
                        Number(
                            lancamento.valor || 0
                        ) -
                        Number(
                            lancamento.valorPago || 0
                        )
                    );

            if (
                lancamento.tipo ===
                "Entrada"
            ) {
                entradas += valorRealizado;
                entradasPendentes +=
                    valorPendente;
            }

            if (
                lancamento.tipo ===
                "Despesa"
            ) {
                despesas += valorRealizado;
                despesasPendentes +=
                    valorPendente;
            }
        }
    );

    return {
        entradas: entradas,
        despesas: despesas,
        saldo: entradas - despesas,
        entradasPendentes:
            entradasPendentes,
        despesasPendentes:
            despesasPendentes
    };
}
// =========================
// ATUALIZAÇÃO PRINCIPAL
// =========================

function atualizarDashboardCompleto() {

    const financeiro =
        calcularFinanceiroDashboard();

    const resumoEncomendas =
        calcularEncomendasDashboard();

    definirTextoDashboard(
        "total-produtos",
        Array.isArray(produtos)
            ? produtos.length
            : 0
    );

    definirTextoDashboard(
        "total-clientes",
        Array.isArray(clientes)
            ? clientes.length
            : 0
    );

    definirTextoDashboard(
        "total-impressoras",
        Array.isArray(impressoras)
            ? impressoras.length
            : 0
    );

    definirTextoDashboard(
        "total-filamentos",
        typeof filamentos !== "undefined" &&
        Array.isArray(filamentos)
            ? filamentos.length
            : 0
    );

    definirTextoDashboard(
        "total-encomendas",
        typeof encomendas !== "undefined" &&
        Array.isArray(encomendas)
            ? encomendas.length
            : 0
    );

    definirTextoDashboard(
        "dashboard-aguardando",
        contarEncomendasDashboard(
            "Aguardando"
        )
    );

    definirTextoDashboard(
        "dashboard-producao",
        contarEncomendasDashboard(
            "Em produção"
        )
    );

    definirTextoDashboard(
        "dashboard-finalizadas",
        contarEncomendasDashboard(
            "Finalizada"
        )
    );

    definirTextoDashboard(
        "dashboard-entregues",
        contarEncomendasDashboard(
            "Entregue"
        )
    );

    definirTextoDashboard(
        "dashboard-atrasadas",
        calcularEncomendasAtrasadasDashboard()
    );

    definirDinheiroDashboard(
        "dashboard-saldo-financeiro",
        financeiro.saldo
    );

    definirDinheiroDashboard(
        "dashboard-total-entradas",
        financeiro.entradas
    );

    definirDinheiroDashboard(
        "dashboard-total-despesas",
        financeiro.despesas
    );

    definirDinheiroDashboard(
        "dashboard-valor-encomendas",
        resumoEncomendas.valorTotal
    );

    definirDinheiroDashboard(
        "dashboard-ticket-medio",
        resumoEncomendas.ticketMedio
    );

    if (
        typeof atualizarDashboard ===
        "function"
    ) {
        atualizarDashboard();
    }

    atualizarAlertasDashboard();
}
// =========================
// ALERTAS
// =========================

function atualizarAlertasDashboard() {

    const campoAlertas =
        document.getElementById(
            "dashboard-alertas"
        );

    if (!campoAlertas) {
        return;
    }

    const alertas = [];

    const financeiro =
        calcularFinanceiroDashboard();

    const encomendasAtrasadas =
        calcularEncomendasAtrasadasDashboard();

    const produtosEstoqueBaixo =
        Array.isArray(produtos)
            ? produtos.filter(function (produto) {
                  return produto.status ===
                      "Estoque baixo";
              }).length
            : 0;

    const produtosSemEstoque =
        Array.isArray(produtos)
            ? produtos.filter(function (produto) {
                  return produto.status ===
                      "Sem estoque";
              }).length
            : 0;

    const impressorasManutencao =
        Array.isArray(impressoras)
            ? impressoras.filter(function (impressora) {
                  return impressora.status ===
                      "Em manutenção";
              }).length
            : 0;

    const filamentosCriticos =
        typeof filamentos !== "undefined" &&
        Array.isArray(filamentos)
            ? filamentos.filter(function (filamento) {
                  return [
                      "Baixo",
                      "Crítico",
                      "Esgotado"
                  ].includes(filamento.status);
              }).length
            : 0;

    if (encomendasAtrasadas > 0) {
        alertas.push(
            `${encomendasAtrasadas} encomenda(s) atrasada(s).`
        );
    }

    if (produtosEstoqueBaixo > 0) {
        alertas.push(
            `${produtosEstoqueBaixo} produto(s) com estoque baixo.`
        );
    }

    if (produtosSemEstoque > 0) {
        alertas.push(
            `${produtosSemEstoque} produto(s) sem estoque.`
        );
    }

    if (impressorasManutencao > 0) {
        alertas.push(
            `${impressorasManutencao} impressora(s) em manutenção.`
        );
    }

    if (filamentosCriticos > 0) {
        alertas.push(
            `${filamentosCriticos} filamento(s) com estoque crítico.`
        );
    }

    if (financeiro.entradasPendentes > 0) {
        alertas.push(
            `Entradas pendentes: ${formatarDinheiro(
                financeiro.entradasPendentes
            )}.`
        );
    }

    if (financeiro.despesasPendentes > 0) {
        alertas.push(
            `Despesas pendentes: ${formatarDinheiro(
                financeiro.despesasPendentes
            )}.`
        );
    }

    if (financeiro.saldo < 0) {
        alertas.push(
            `Saldo negativo de ${formatarDinheiro(
                Math.abs(financeiro.saldo)
            )}.`
        );
    }

    if (alertas.length === 0) {

        campoAlertas.innerHTML =
            "<p>Nenhum alerta no momento.</p>";

        return;
    }

    campoAlertas.innerHTML =
        alertas
            .map(function (alerta) {
                return `<p>⚠️ ${escaparTexto(alerta)}</p>`;
            })
            .join("");

}

// =========================
// EVENTOS
// =========================

if (menuDashboard) {

    menuDashboard.addEventListener(
        "click",
        atualizarDashboardCompleto);}

if (botaoAtualizarDashboardCompleto) {

    botaoAtualizarDashboardCompleto
        .addEventListener(
            "click",
            function () {

                atualizarDashboardCompleto();

                alert(
                    "Dashboard atualizado com sucesso!"
                );

            }
        );

}

// =========================
// INICIALIZAÇÃO
// =========================

atualizarDashboardCompleto();
});