 document.addEventListener("DOMContentLoaded", function () {
    const botoesMenu = document.querySelectorAll(".menu-item");
    const paginas = document.querySelectorAll(".pagina");









// =========================
// RELATÓRIOS
// =========================

// =========================
// RELATÓRIOS 2.0
// =========================

const botaoAtualizarRelatorios =
    document.getElementById(
        "atualizar-relatorios"
    );

const botaoLimparPeriodoRelatorios =
    document.getElementById(
        "limpar-periodo-relatorios"
    );

const botaoGerarDetalhamentoRelatorio =
    document.getElementById(
        "gerar-detalhamento-relatorio"
    );

const campoPeriodoInicialRelatorio =
    document.getElementById(
        "relatorio-periodo-inicial"
    );

const campoPeriodoFinalRelatorio =
    document.getElementById(
        "relatorio-periodo-final"
    );

const campoTipoDetalhamentoRelatorio =
    document.getElementById(
        "tipo-detalhamento-relatorio"
    );

const listaDetalhamentoRelatorio =
    document.getElementById(
        "lista-detalhamento-relatorio"
    );

const menuRelatorios =
    document.querySelector(
        '[data-pagina="relatorios"]'
    );

// =========================
// FILTRO POR PERÍODO
// =========================

function dataEstaNoPeriodoRelatorio(data) {
    if (!data) {
        return false;
    }

    const dataInicial =
        campoPeriodoInicialRelatorio
            ? campoPeriodoInicialRelatorio.value
            : "";

    const dataFinal =
        campoPeriodoFinalRelatorio
            ? campoPeriodoFinalRelatorio.value
            : "";

    if (
        dataInicial &&
        data < dataInicial
    ) {
        return false;
    }

    if (
        dataFinal &&
        data > dataFinal
    ) {
        return false;
    }

    return true;
}

function periodoRelatorioEstaAtivo() {
    const dataInicial =
        campoPeriodoInicialRelatorio
            ? campoPeriodoInicialRelatorio.value
            : "";

    const dataFinal =
        campoPeriodoFinalRelatorio
            ? campoPeriodoFinalRelatorio.value
            : "";

    return Boolean(
        dataInicial || dataFinal
    );
}

function filtrarEncomendasRelatorio() {
    if (
        typeof encomendas === "undefined" ||
        !Array.isArray(encomendas)
    ) {
        return [];
    }

    if (!periodoRelatorioEstaAtivo()) {
        return [...encomendas];
    }

    return encomendas.filter(
        function (encomenda) {
            return dataEstaNoPeriodoRelatorio(
                encomenda.dataPedido
            );
        }
    );
}

function filtrarLancamentosRelatorio() {
    if (
        !Array.isArray(
            lancamentosFinanceiros
        )
    ) {
        return [];
    }

    if (!periodoRelatorioEstaAtivo()) {
        return [
            ...lancamentosFinanceiros
        ];
    }

    return lancamentosFinanceiros.filter(
        function (lancamento) {
            return dataEstaNoPeriodoRelatorio(
                lancamento.data
            );
        }
    );
}

// =========================
// ENCOMENDAS POR STATUS
// =========================

function contarEncomendasRelatorioPorStatus(
    lista,
    status
) {
    return lista.filter(
        function (encomenda) {
            return encomenda.status === status;
        }
    ).length;
}

function contarEncomendasAtrasadasRelatorio(
    lista
) {
    return lista.filter(
        function (encomenda) {
            if (
                typeof encomendaEstaAtrasada ===
                "function"
            ) {
                return encomendaEstaAtrasada(
                    encomenda
                );
            }

            return false;
        }
    ).length;
}

// =========================
// CÁLCULOS FINANCEIROS
// =========================

function calcularResumoFinanceiroRelatorio(
    lista
) {
    let entradas = 0;
    let despesas = 0;
    let entradasPendentes = 0;
    let despesasPendentes = 0;

    lista.forEach(
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
                lancamento.tipo === "Entrada"
            ) {
                entradas += valorRealizado;
                entradasPendentes +=
                    valorPendente;
            }

            if (
                lancamento.tipo === "Despesa"
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
        saldo:
            entradas - despesas,
        entradasPendentes:
            entradasPendentes,
        despesasPendentes:
            despesasPendentes
    };
}

// =========================
// ENCOMENDAS FINANCEIRAS
// =========================

function calcularResumoEncomendasRelatorio(
    lista
) {
    let valorTotal = 0;
    let valorRecebido = 0;
    let valorAReceber = 0;

    lista.forEach(
        function (encomenda) {
            if (
                encomenda.status ===
                "Cancelada"
            ) {
                return;
            }

            const total =
                Number(
                    encomenda.valorTotal || 0
                );

            const recebido =
                Math.min(
                    total,
                    Math.max(
                        0,
                        Number(
                            encomenda.valorPago || 0
                        )
                    )
                );

            valorTotal += total;
            valorRecebido += recebido;
            valorAReceber +=
                Math.max(
                    0,
                    total - recebido
                );
        }
    );

    const ticketMedio =
        lista.length > 0
            ? valorTotal / lista.length
            : 0;

    return {
        valorTotal: valorTotal,
        valorRecebido: valorRecebido,
        valorAReceber: valorAReceber,
        ticketMedio: ticketMedio
    };
}

// =========================
// ATUALIZAÇÃO DE CAMPOS
// =========================

function definirTextoRelatorio(
    id,
    valor
) {
    const campo =
        document.getElementById(id);

    if (campo) {
        campo.textContent = valor;
    }
}

function definirDinheiroRelatorio(
    id,
    valor
) {
    definirTextoRelatorio(
        id,
        formatarDinheiro(valor)
    );
}

// =========================
// INDICADORES PRINCIPAIS
// =========================


// =========================
// DETALHAMENTO
// =========================

function atualizarDetalhamentoRelatorio() {

    if (!listaDetalhamentoRelatorio) {
        return;
    }

    const tipo =
        campoTipoDetalhamentoRelatorio
            ? campoTipoDetalhamentoRelatorio.value
            : "geral";

    switch (tipo) {

        case "produtos":
            mostrarDetalhamentoProdutos();
            break;

        case "clientes":
            mostrarDetalhamentoClientes();
            break;

        case "encomendas":
            mostrarDetalhamentoEncomendas();
            break;

        case "financeiro":
            mostrarDetalhamentoFinanceiro();
            break;

        case "filamentos":
            mostrarDetalhamentoFilamentos();
            break;

        case "impressoras":
            mostrarDetalhamentoImpressoras();
            break;

        default:
            mostrarResumoGeralRelatorio();
    }

}

// =========================
// RESUMO GERAL
// =========================

function mostrarResumoGeralRelatorio() {

    const resumoFinanceiro =
        calcularResumoFinanceiroRelatorio(
            filtrarLancamentosRelatorio()
        );

    const resumoEncomendas =
        calcularResumoEncomendasRelatorio(
            filtrarEncomendasRelatorio()
        );

    listaDetalhamentoRelatorio.innerHTML = `

        <div class="card-item">

            <h4>Resumo Geral</h4>

            <p><strong>Produtos:</strong> ${produtos.length}</p>

            <p><strong>Clientes:</strong> ${clientes.length}</p>

            <p><strong>Impressoras:</strong> ${impressoras.length}</p>

            <p><strong>Encomendas:</strong> ${encomendas.length}</p>

            <p><strong>Entradas:</strong> ${formatarDinheiro(resumoFinanceiro.entradas)}</p>

            <p><strong>Despesas:</strong> ${formatarDinheiro(resumoFinanceiro.despesas)}</p>

            <p><strong>Saldo:</strong> ${formatarDinheiro(resumoFinanceiro.saldo)}</p>

            <p><strong>Valor das encomendas:</strong> ${formatarDinheiro(resumoEncomendas.valorTotal)}</p>

        </div>

    `;

}

// =========================
// PRODUTOS
// =========================

function mostrarDetalhamentoProdutos() {

    listaDetalhamentoRelatorio.innerHTML =
        produtos.map(function(produto){

            return `

                <div class="card-item">

                    <h4>${escaparTexto(produto.nome)}</h4>

                    <p>Categoria: ${escaparTexto(produto.categoria)}</p>

                    <p>Estoque: ${produto.estoque}</p>

                    <p>Status: ${escaparTexto(produto.status)}</p>

                </div>

            `;

        }).join("");

}

// =========================
// CLIENTES
// =========================

function mostrarDetalhamentoClientes(){

    listaDetalhamentoRelatorio.innerHTML =
        clientes.map(function(cliente){

            return `

                <div class="card-item">

                    <h4>${escaparTexto(cliente.nome)}</h4>

                    <p>${escaparTexto(cliente.cidade || "Não informada")}</p>

                    <p>${escaparTexto(cliente.telefone || "-")}</p>

                </div>

            `;

        }).join("");

}

// =========================
// ENCOMENDAS
// =========================

function mostrarDetalhamentoEncomendas(){

    const lista =
        filtrarEncomendasRelatorio();

    listaDetalhamentoRelatorio.innerHTML =
        lista.map(function(encomenda){

            return `

                <div class="card-item">

                    <h4>${escaparTexto(encomenda.clienteNome)}</h4>

                    <p>${escaparTexto(encomenda.produtoNome)}</p>

                    <p>${escaparTexto(encomenda.status)}</p>

                    <p>${formatarDinheiro(encomenda.valorTotal)}</p>

                </div>

            `;

        }).join("");

}

// =========================
// FINANCEIRO
// =========================

function mostrarDetalhamentoFinanceiro(){

    const lista =
        filtrarLancamentosRelatorio();

    listaDetalhamentoRelatorio.innerHTML =
        lista.map(function(item){

            return `

                <div class="card-item">

                    <h4>${escaparTexto(item.descricao)}</h4>

                    <p>${escaparTexto(item.tipo)}</p>

                    <p>${escaparTexto(item.situacao)}</p>

                    <p>${formatarDinheiro(item.valor)}</p>

                </div>

            `;

        }).join("");

}

// =========================
// FILAMENTOS
// =========================

function mostrarDetalhamentoFilamentos(){

    if (typeof filamentos === "undefined"){

        listaDetalhamentoRelatorio.innerHTML =
            "<p>Nenhum dado disponível.</p>";

        return;
    }

    listaDetalhamentoRelatorio.innerHTML =
        filamentos.map(function(f){

            return `

                <div class="card-item">

                    <h4>${escaparTexto(f.material)}</h4>

                    <p>${escaparTexto(f.cor)}</p>

                    <p>${Number(f.pesoRestante || 0)} g</p>

                </div>

            `;

        }).join("");

}

// =========================
// MENU
// =========================

iniciarMenu();

function iniciarMenu() {
    botoesMenu.forEach(function (botao) {
        botao.addEventListener(
            "click",
            function () {
                const paginaEscolhida =
                    botao.dataset.pagina;

                botoesMenu.forEach(
                    function (item) {
                        item.classList.remove(
                            "ativo"
                        );
                    }
                );

                paginas.forEach(
                    function (pagina) {
                        pagina.classList.remove(
                            "ativa"
                        );
                    }
                );

                botao.classList.add("ativo");

                const pagina =
                    document.getElementById(
                        paginaEscolhida
                    );

                if (pagina) {
                    pagina.classList.add("ativa");
                }
            }
        );
    });
}    });
}

// =========================
// FIM DO DOMContentLoaded
// =========================
});