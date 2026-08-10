// =========================
// FINANCEIRO 2.0
// =========================

let lancamentosFinanceiros = [];

try {
    lancamentosFinanceiros =
        JSON.parse(
            localStorage.getItem(
                "organiza3d_financeiro"
            )
        ) || [];
} catch (erro) {
    console.error(
        "Não foi possível carregar os lançamentos financeiros.",
        erro
    );

    lancamentosFinanceiros = [];
}

// =========================
// ELEMENTOS DO FINANCEIRO
// =========================

const botaoSalvarLancamento =
    document.getElementById(
        "salvar-lancamento"
    );

const botaoLimparFormularioLancamento =
    document.getElementById(
        "limpar-formulario-lancamento"
    );

const listaLancamentos =
    document.getElementById(
        "lista-financeiro"
    );

const campoTipoLancamento =
    document.getElementById(
        "tipo-lancamento"
    );

const campoCategoriaLancamento =
    document.getElementById(
        "categoria-lancamento"
    );

const campoDescricaoLancamento =
    document.getElementById(
        "descricao-lancamento"
    );

const campoValorLancamento =
    document.getElementById(
        "valor-lancamento"
    );

const campoDataLancamento =
    document.getElementById(
        "data-lancamento"
    );

const campoFormaPagamentoLancamento =
    document.getElementById(
        "forma-pagamento-lancamento"
    );

const campoSituacaoLancamento =
    document.getElementById(
        "situacao-lancamento"
    );

const campoValorPagoLancamento =
    document.getElementById(
        "valor-pago-lancamento"
    );


const campoOrigemLancamento =
    document.getElementById(
        "origem-lancamento"
    );

const campoObservacoesLancamento =
    document.getElementById(
        "observacoes-lancamento"
    );

const filtroTipoFinanceiro =
    document.getElementById(
        "filtro-tipo-financeiro"
    );

const filtroSituacaoFinanceiro =
    document.getElementById(
        "filtro-situacao-financeiro"
    );

const filtroDataInicialFinanceiro =
    document.getElementById(
        "filtro-data-inicial-financeiro"
    );

const filtroDataFinalFinanceiro =
    document.getElementById(
        "filtro-data-final-financeiro"
    );

const botaoAplicarFiltrosFinanceiro =
    document.getElementById(
        "aplicar-filtros-financeiro"
    );

const botaoLimparFiltrosFinanceiro =
    document.getElementById(
        "limpar-filtros-financeiro"
    );

const menuFinanceiro =
    document.querySelector(
        '[data-pagina="financeiro"]'
    );

// =========================
// ARMAZENAMENTO
// =========================

function salvarLancamentosFinanceiros() {
    localStorage.setItem(
        "organiza3d_financeiro",
        JSON.stringify(
            lancamentosFinanceiros
        )
    );
}

// =========================
// DATA
// =========================

function obterDataHojeFinanceiro() {
    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = String(
        hoje.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        hoje.getDate()
    ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function formatarDataFinanceiro(data) {
    if (!data) {
        return "Não informada";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return (
        `${partes[2]}/` +
        `${partes[1]}/` +
        `${partes[0]}`
    );
}

// =========================
// NORMALIZAÇÃO
// =========================

function normalizarLancamentosFinanceiros() {
    lancamentosFinanceiros =
        lancamentosFinanceiros.map(
            function (lancamento, indice) {
                const valor = Number(
                    lancamento.valor || 0
                );

                let valorPago;

                if (
                    lancamento.valorPago ===
                    undefined
                ) {
                    valorPago =
                        lancamento.situacao ===
                            "Pendente"
                            ? 0
                            : valor;
                } else {
                    valorPago = Number(
                        lancamento.valorPago || 0
                    );
                }

                valorPago = Math.max(
                    0,
                    Math.min(
                        valor,
                        valorPago
                    )
                );

                let situacao =
                    lancamento.situacao;

                if (
                    ![
                        "Pago",
                        "Pendente",
                        "Parcial"
                    ].includes(situacao)
                ) {
                    if (
                        valor > 0 &&
                        valorPago >= valor
                    ) {
                        situacao = "Pago";
                    } else if (
                        valorPago > 0
                    ) {
                        situacao = "Parcial";
                    } else {
                        situacao = "Pendente";
                    }
                }

                if (valorPago >= valor && valor > 0) {
                    situacao = "Pago";
                } else if (valorPago > 0) {
                    situacao = "Parcial";
                } else {
                    situacao = "Pendente";
                }

                return {
                    id:
                        lancamento.id ||
                        Date.now() + indice,

                    tipo:
                        lancamento.tipo ===
                            "Despesa"
                            ? "Despesa"
                            : "Entrada",

                    categoria:
                        lancamento.categoria ||
                        "Outros",

                    descricao:
                        lancamento.descricao ||
                        "Lançamento sem descrição",

                    valor:
                        valor,

                    data:
                        lancamento.data ||
                        obterDataHojeFinanceiro(),

                    formaPagamento:
                        lancamento.formaPagamento ||
                        "",

                    situacao:
                        situacao,

                    valorPago:
                        valorPago,

                        
                        origem:
                        lancamento.origem ||
                        "Manual",

                    observacoes:
                        lancamento.observacoes ||
                        "",

                    automatico:
                        Boolean(
                            lancamento.automatico
                        )
                };
            }
        );

    salvarLancamentosFinanceiros();
}

// =========================
// CÁLCULOS
// =========================

function obterValorRealizadoLancamento(
    lancamento
) {
    return Math.max(
        0,
        Number(
            lancamento.valorPago || 0
        )
    );
}

function obterValorPendenteLancamento(
    lancamento
) {
    const valor = Number(
        lancamento.valor || 0
    );

    const valorPago = Number(
        lancamento.valorPago || 0
    );

    return Math.max(
        0,
        valor - valorPago
    );
}

// =========================
// RESUMO FINANCEIRO
// =========================

function atualizarResumoFinanceiro() {
    let totalEntradas = 0;
    let totalDespesas = 0;
    let entradasPendentes = 0;
    let despesasPendentes = 0;

    lancamentosFinanceiros.forEach(
        function (lancamento) {
            const valorRealizado =
                obterValorRealizadoLancamento(
                    lancamento
                );

            const valorPendente =
                obterValorPendenteLancamento(
                    lancamento
                );

            if (
                lancamento.tipo ===
                "Entrada"
            ) {
                totalEntradas +=
                    valorRealizado;

                entradasPendentes +=
                    valorPendente;
            }

            if (
                lancamento.tipo ===
                "Despesa"
            ) {
                totalDespesas +=
                    valorRealizado;

                despesasPendentes +=
                    valorPendente;
            }
        }
    );

    const saldo =
        totalEntradas - totalDespesas;

    const totalPendente =
        entradasPendentes +
        despesasPendentes;

    const campoTotalEntradas =
        document.getElementById(
            "financeiro-total-entradas"
        );

    const campoTotalDespesas =
        document.getElementById(
            "financeiro-total-despesas"
        );

    const campoSaldo =
        document.getElementById(
            "financeiro-saldo"
        );

    const campoTotalPendente =
        document.getElementById(
            "financeiro-total-pendente"
        );

    const campoEntradasPendentes =
        document.getElementById(
            "financeiro-entradas-pendentes"
        );

    const campoDespesasPendentes =
        document.getElementById(
            "financeiro-despesas-pendentes"
        );

    if (campoTotalEntradas) {
        campoTotalEntradas.textContent =
            formatarDinheiro(
                totalEntradas
            );
    }

    if (campoTotalDespesas) {
        campoTotalDespesas.textContent =
            formatarDinheiro(
                totalDespesas
            );
    }

    if (campoSaldo) {
        campoSaldo.textContent =
            formatarDinheiro(
                saldo
            );
    }

    if (campoTotalPendente) {
        campoTotalPendente.textContent =
            formatarDinheiro(
                totalPendente
            );
    }

    if (campoEntradasPendentes) {
        campoEntradasPendentes.textContent =
            formatarDinheiro(
                entradasPendentes
            );
    }

    if (campoDespesasPendentes) {
        campoDespesasPendentes.textContent =
            formatarDinheiro(
                despesasPendentes
            );
    }
}

// =========================
// LISTAGEM
// =========================

function mostrarLancamentosFinanceiros(
    listaPersonalizada
) {
    if (!listaLancamentos) {
        return;
    }

    const lista =
        Array.isArray(listaPersonalizada)
            ? listaPersonalizada
            : lancamentosFinanceiros;

    if (lista.length === 0) {
        listaLancamentos.innerHTML =
            "<p>Nenhum lançamento cadastrado.</p>";

        atualizarResumoFinanceiro();
        return;
    }

    const lancamentosOrdenados =
        [...lista].sort(
            function (a, b) {
                const dataA =
                    a.data || "";

                const dataB =
                    b.data || "";

                if (dataA === dataB) {
                    return Number(b.id) -
                        Number(a.id);
                }

                return dataB.localeCompare(
                    dataA
                );
            }
        );

    listaLancamentos.innerHTML =
        lancamentosOrdenados
            .map(function (lancamento) {
                const valor =
                    Number(
                        lancamento.valor || 0
                    );

                const valorPago =
                    Number(
                        lancamento.valorPago || 0
                    );

                const valorPendente =
                    obterValorPendenteLancamento(
                        lancamento
                    );

                const formaPagamento =
                    lancamento.formaPagamento
                        ? escaparTexto(
                            lancamento
                                .formaPagamento
                        )
                        : "Não informada";

                const observacoes =
                    lancamento.observacoes
                        ? escaparTexto(
                            lancamento
                                .observacoes
                        )
                        : "Nenhuma";

                return `
                    <div class="card-item">

                        <h4>
                            ${escaparTexto(
                                lancamento.descricao
                            )}
                        </h4>

                        <p>
                            <strong>Tipo:</strong>
                            ${escaparTexto(
                                lancamento.tipo
                            )}
                        </p>

                        <p>
                            <strong>Categoria:</strong>
                            ${escaparTexto(
                                lancamento.categoria
                            )}
                        </p>

                        <p>
                            <strong>Data:</strong>
                            ${formatarDataFinanceiro(
                                lancamento.data
                            )}
                        </p>

                        <p>
                            <strong>Valor:</strong>
                            ${formatarDinheiro(
                                valor
                            )}
                        </p>

                        <p>
                            <strong>Situação:</strong>
                            ${escaparTexto(
                                lancamento.situacao
                            )}
                        </p>

                        <p>
                            <strong>Valor pago:</strong>
                            ${formatarDinheiro(
                                valorPago
                            )}
                        </p>

                        <p>
                            <strong>Valor pendente:</strong>
                            ${formatarDinheiro(
                                valorPendente
                            )}
                        </p>

                        <p>
                            <strong>Forma de pagamento:</strong>
                            ${formaPagamento}
                        </p>

                        <p>
                            <strong>Origem:</strong>
                            ${escaparTexto(
                                lancamento.origem
                            )}
                        </p>

                
                        <p>
                            <strong>Observações:</strong>
                            ${observacoes}
                        </p>

                        <button
                            type="button"
                            class="botao-excluir"
                            onclick="excluirLancamentoFinanceiro(
                                ${lancamento.id}
                            )">
                            Excluir
                        </button>

                    </div>
                `;
            })
            .join("");

    atualizarResumoFinanceiro();
}

// =========================
// FORMULÁRIO
// =========================

function limparFormularioFinanceiro() {
    if (campoTipoLancamento) {
        campoTipoLancamento.value =
            "Entrada";
    }

    if (campoCategoriaLancamento) {
        campoCategoriaLancamento.value =
            "";
    }

    if (campoDescricaoLancamento) {
        campoDescricaoLancamento.value =
            "";
    }

    if (campoValorLancamento) {
        campoValorLancamento.value =
            "";
    }

    if (campoDataLancamento) {
        campoDataLancamento.value =
            obterDataHojeFinanceiro();
    }

    if (
        campoFormaPagamentoLancamento
    ) {
        campoFormaPagamentoLancamento
            .value = "";
    }

    if (campoSituacaoLancamento) {
        campoSituacaoLancamento.value =
            "Pago";
    }

    if (campoValorPagoLancamento) {
        campoValorPagoLancamento.value =
            "";
    }

    if (campoOrigemLancamento) {
        campoOrigemLancamento.value =
            "Manual";
    }

    if (campoObservacoesLancamento) {
        campoObservacoesLancamento.value =
            "";
    }
}
function ajustarValorPagoFinanceiro() {
    if (
        !campoSituacaoLancamento ||
        !campoValorPagoLancamento ||
        !campoValorLancamento
    ) {
        return;
    }

    const valor =
        Number(
            campoValorLancamento.value || 0
        );

    const situacao =
        campoSituacaoLancamento.value;

    if (situacao === "Pago") {
        campoValorPagoLancamento.value =
            valor > 0
                ? valor
                : "";
    }

    if (situacao === "Pendente") {
        campoValorPagoLancamento.value =
            0;
    }
}

// =========================
// CADASTRO
// =========================

if (botaoSalvarLancamento) {
    botaoSalvarLancamento.addEventListener(
        "click",
        function () {
            const tipo =
                campoTipoLancamento
                    ? campoTipoLancamento.value
                    : "Entrada";

            const categoria =
                campoCategoriaLancamento
                    ? campoCategoriaLancamento
                        .value
                    : "";

            const descricao =
                campoDescricaoLancamento
                    ? campoDescricaoLancamento
                        .value
                        .trim()
                    : "";

            const valor =
                campoValorLancamento
                    ? Number(
                        campoValorLancamento
                            .value
                    )
                    : 0;

            const data =
                campoDataLancamento
                    ? campoDataLancamento.value
                    : "";

            const formaPagamento =
                campoFormaPagamentoLancamento
                    ? campoFormaPagamentoLancamento
                        .value
                    : "";

            let situacao =
                campoSituacaoLancamento
                    ? campoSituacaoLancamento
                        .value
                    : "Pendente";

            let valorPago =
                campoValorPagoLancamento
                    ? Number(
                        campoValorPagoLancamento
                            .value || 0
                    )
                    : 0;

            const origem =
                campoOrigemLancamento
                    ? campoOrigemLancamento
                        .value
                    : "Manual";

            const observacoes =
                campoObservacoesLancamento
                    ? campoObservacoesLancamento
                        .value
                        .trim()
                    : "";

            if (!categoria) {
                alert(
                    "Selecione uma categoria."
                );
                return;
            }

            if (!descricao) {
                alert(
                    "Informe a descrição."
                );
                return;
            }

            if (
                Number.isNaN(valor) ||
                valor <= 0
            ) {
                alert(
                    "Informe um valor válido."
                );
                return;
            }

            if (!data) {
                alert(
                    "Informe a data."
                );
                return;
            }

            if (
                Number.isNaN(valorPago) ||
                valorPago < 0
            ) {
                alert(
                    "Informe um valor pago válido."
                );
                return;
            }

            if (valorPago > valor) {
                alert(
                    "O valor pago não pode ser maior que o valor do lançamento."
                );
                return;
            }

            if (situacao === "Pago") {
                valorPago = valor;
            }

            if (situacao === "Pendente") {
                valorPago = 0;
            }

            if (
                valorPago > 0 &&
                valorPago < valor
            ) {
                situacao = "Parcial";
            }

            if (valorPago >= valor) {
                situacao = "Pago";
            }

            if (valorPago === 0) {
                situacao = "Pendente";
            }

            
            const novoLancamento = {
                id: Date.now(),
                tipo: tipo,
                categoria: categoria,
                descricao: descricao,
                valor: valor,
                data: data,
                formaPagamento:
                    formaPagamento,
                situacao: situacao,
                valorPago: valorPago,
               
                origem: origem,
                observacoes:
                    observacoes,
                automatico: false
            };

            lancamentosFinanceiros.push(
                novoLancamento
            );

            salvarLancamentosFinanceiros();
            mostrarLancamentosFinanceiros();
            limparFormularioFinanceiro();

            alert(
                "Lançamento cadastrado com sucesso!"
            );
        }
    );
}

if (
    botaoLimparFormularioLancamento
) {
    botaoLimparFormularioLancamento
        .addEventListener(
            "click",
            limparFormularioFinanceiro
        );
}

if (campoSituacaoLancamento) {
    campoSituacaoLancamento
        .addEventListener(
            "change",
            ajustarValorPagoFinanceiro
        );
}

if (campoValorLancamento) {
    campoValorLancamento
        .addEventListener(
            "input",
            function () {
                if (
                    campoSituacaoLancamento &&
                    campoSituacaoLancamento
                        .value === "Pago"
                ) {
                    ajustarValorPagoFinanceiro();
                }
            }
        );
}

// =========================
// EXCLUSÃO
// =========================

window.excluirLancamentoFinanceiro =
    function (id) {
        const lancamento =
            lancamentosFinanceiros.find(
                function (item) {
                    return item.id === id;
                }
            );

        if (!lancamento) {
            return;
        }

        const confirmar = confirm(
            `Deseja excluir o lançamento "${lancamento.descricao}"?`
        );

        if (!confirmar) {
            return;
        }

        lancamentosFinanceiros =
            lancamentosFinanceiros.filter(
                function (item) {
                    return item.id !== id;
                }
            );

        salvarLancamentosFinanceiros();
        mostrarLancamentosFinanceiros();
    };

// =========================
// FORMULÁRIO INICIAL
// =========================

function prepararFormularioFinanceiro() {
    if (
        campoDataLancamento &&
        !campoDataLancamento.value
    ) {
        campoDataLancamento.value =
            obterDataHojeFinanceiro();
    }

}

// =========================
// ABERTURA DO MÓDULO
// =========================

if (menuFinanceiro) {
    menuFinanceiro.addEventListener(
        "click",
        function () {
           
            atualizarResumoFinanceiro();
        }
    );
}

// =========================
// INICIALIZAÇÃO
// ========================

normalizarLancamentosFinanceiros();
prepararFormularioFinanceiro();
mostrarLancamentosFinanceiros();