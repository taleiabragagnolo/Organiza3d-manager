 document.addEventListener("DOMContentLoaded", function () {
    const botoesMenu = document.querySelectorAll(".menu-item");
    const paginas = document.querySelectorAll(".pagina");


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
        "lista-lancamentos"
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

const campoEncomendaLancamento =
    document.getElementById(
        "encomenda-lancamento"
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

                    encomendaId:
                        lancamento.encomendaId ||
                        null,

                    encomendaDescricao:
                        lancamento
                            .encomendaDescricao ||
                        "",

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

                const encomenda =
                    lancamento
                        .encomendaDescricao
                        ? escaparTexto(
                            lancamento
                                .encomendaDescricao
                        )
                        : "Nenhuma";

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
                            <strong>Encomenda vinculada:</strong>
                            ${encomenda}
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

    if (campoEncomendaLancamento) {
        campoEncomendaLancamento.value =
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

            const encomendaId =
                campoEncomendaLancamento &&
                campoEncomendaLancamento.value
                    ? Number(
                        campoEncomendaLancamento
                            .value
                    )
                    : null;

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

            let encomendaDescricao = "";

            if (
                campoEncomendaLancamento &&
                campoEncomendaLancamento
                    .selectedIndex >= 0
            ) {
                const opcaoSelecionada =
                    campoEncomendaLancamento
                        .options[
                            campoEncomendaLancamento
                                .selectedIndex
                        ];

                if (
                    opcaoSelecionada &&
                    encomendaId
                ) {
                    encomendaDescricao =
                        opcaoSelecionada
                            .textContent
                            .trim();
                }
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
                encomendaId:
                    encomendaId,
                encomendaDescricao:
                    encomendaDescricao,
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
// ENCOMENDAS DISPONÍVEIS
// =========================

function atualizarOpcoesEncomendasFinanceiro() {
    if (!campoEncomendaLancamento) {
        return;
    }

    const encomendaSelecionada =
        campoEncomendaLancamento.value;

    campoEncomendaLancamento.innerHTML =
        `
            <option value="">
                Nenhuma encomenda vinculada
            </option>
        `;

    if (
        typeof encomendas === "undefined" ||
        !Array.isArray(encomendas)
    ) {
        return;
    }

    encomendas.forEach(
        function (encomenda) {
            campoEncomendaLancamento
                .innerHTML += `
                    <option value="${encomenda.id}">
                        ${escaparTexto(
                            encomenda.clienteNome
                        )}
                        —
                        ${escaparTexto(
                            encomenda.produtoNome
                        )}
                        —
                        ${formatarDinheiro(
                            encomenda.valorTotal
                        )}
                    </option>
                `;
        }
    );

    campoEncomendaLancamento.value =
        encomendaSelecionada;
}

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

    atualizarOpcoesEncomendasFinanceiro();
}

// =========================
// ABERTURA DO MÓDULO
// =========================

if (menuFinanceiro) {
    menuFinanceiro.addEventListener(
        "click",
        function () {
            atualizarOpcoesEncomendasFinanceiro();
            atualizarResumoFinanceiro();
        }
    );
}

// =========================
// INICIALIZAÇÃO
// ========================

normalizarLancamentosFinanceiros();
// prepararFormularioFinanceiro();
mostrarLancamentosFinanceiros();




// =========================
// FILAMENTOS 2.0
// =========================
// =========================
// ABAS DOS FILAMENTOS
// =========================

const botoesAbasFilamentos =
    document.querySelectorAll(
        ".aba-filamento"
    );

const conteudosAbasFilamentos =
    document.querySelectorAll(
        ".conteudo-aba-filamento"
    );

function abrirAbaFilamento(idAba) {

    conteudosAbasFilamentos.forEach(
        function (conteudo) {

            const ativa =
                conteudo.id === idAba;

            conteudo.hidden = !ativa;

            conteudo.classList.toggle(
                "ativo",
                ativa
            );
        }
    );

    botoesAbasFilamentos.forEach(
        function (botao) {

            const ativo =
                botao.dataset.abaFilamento ===
                idAba;

            botao.classList.toggle(
                "botao-principal",
                ativo
            );
        }
    );
}

botoesAbasFilamentos.forEach(
    function (botao) {

        botao.addEventListener(
            "click",
            function () {

                abrirAbaFilamento(
                    botao.dataset.abaFilamento
                );
            }
        );
    }
);

abrirAbaFilamento("aba-filamentos");
// =========================
// ACESSÓRIOS
// =========================

let acessorios = JSON.parse(
    localStorage.getItem("organiza3d_acessorios")
) || [];

let acessorioEmEdicaoId = null;

const campoAcessorioQuantidade =
    document.getElementById(
        "acessorio-quantidade"
    );

const campoAcessorioValorCompra =
    document.getElementById(
        "acessorio-valor-compra"
    );

const campoAcessorioValorUnitario =
    document.getElementById(
        "acessorio-valor-unitario"
    );

function formatarValorUnitarioAcessorio(valor) {

    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
        }
    );
}

function calcularValorUnitarioAcessorio() {

    const quantidade = Number(
        campoAcessorioQuantidade
            ? campoAcessorioQuantidade.value || 0
            : 0
    );

    const valorCompra = Number(
        campoAcessorioValorCompra
            ? campoAcessorioValorCompra.value || 0
            : 0
    );

    const valorUnitario =
        quantidade > 0
            ? valorCompra / quantidade
            : 0;

    if (campoAcessorioValorUnitario) {

        campoAcessorioValorUnitario.value =
            formatarValorUnitarioAcessorio(
                valorUnitario
            );
    }
}

[
    campoAcessorioQuantidade,
    campoAcessorioValorCompra
].forEach(function (campo) {

    if (campo) {

        campo.addEventListener(
            "input",
            calcularValorUnitarioAcessorio
        );
    }
});

calcularValorUnitarioAcessorio();
const botaoSalvarAcessorio =
    document.getElementById(
        "salvar-acessorio"
    );

const botaoLimparFormularioAcessorio =
    document.getElementById(
        "limpar-formulario-acessorio"
    );

const listaAcessorios =
    document.getElementById(
        "lista-acessorios"
    );

function salvarAcessorios() {
    localStorage.setItem(
        "organiza3d_acessorios",
        JSON.stringify(acessorios)
    );
}
function mostrarAcessorios() {

    if (!listaAcessorios) {
        return;
    }

    if (acessorios.length === 0) {
        listaAcessorios.innerHTML =
            "<p>Nenhum acessório cadastrado.</p>";
        return;
    }

    listaAcessorios.innerHTML =
        acessorios
            .map(function (acessorio) {

                return `
                    <div class="card-item">

                        <h4>
                            ${escaparTexto(
                                acessorio.nome
                            )}
                        </h4>

                        <p>
                            <strong>Categoria:</strong>
                            ${escaparTexto(
                                acessorio.categoria
                            )}
                        </p>

                        <p>
                            <strong>Quantidade:</strong>
                            ${Number(
                                acessorio.quantidade || 0
                            )}
                        </p>

                        <p>
                            <strong>Estoque mínimo:</strong>
                            ${Number(
                                acessorio.estoqueMinimo || 0
                            )}
                        </p>

                        <p>
                            <strong>Unidade de compra:</strong>
                            ${escaparTexto(
                                acessorio.unidadeCompra ||
                                "Não informada"
                            )}
                        </p>

                        <p>
                            <strong>Valor da compra:</strong>
                            ${formatarDinheiro(
                                acessorio.valorCompra
                            )}
                        </p>

                        <p>
                            <strong>Valor unitário:</strong>
                            ${formatarValorUnitarioAcessorio(
                                acessorio.valorUnitario
                            )}
                        </p>

                        <p>
                            <strong>Data da compra:</strong>
                            ${
                                acessorio.dataCompra
                                    ? acessorio.dataCompra
                                        .split("-")
                                        .reverse()
                                        .join("/")
                                    : "Não informada"
                            }
                        </p>

                        <p>
                            <strong>Fornecedor:</strong>
                            ${escaparTexto(
                                acessorio.fornecedor ||
                                "Não informado"
                            )}
                        </p>

                        <p>
                            <strong>Observações:</strong>
                            ${escaparTexto(
                                acessorio.observacoes ||
                                "Nenhuma"
                            )}
                        </p>
<div class="acoes-card">

    <button
        class="botao-principal"
        onclick="editarAcessorio(${acessorio.id})">
        Editar
    </button>

    <button
        class="botao-excluir"
        onclick="excluirAcessorio(${acessorio.id})">
        Excluir
    </button>

</div>
                    </div>
                `;
            })
            .join("");
}
function limparFormularioAcessorio() {

    document.getElementById(
        "acessorio-nome"
    ).value = "";

    document.getElementById(
        "acessorio-categoria"
    ).value = "";

    document.getElementById(
        "acessorio-quantidade"
    ).value = "";

    document.getElementById(
        "acessorio-estoque-minimo"
    ).value = "";

    document.getElementById(
        "acessorio-unidade-compra"
    ).value = "";

    document.getElementById(
        "acessorio-valor-compra"
    ).value = "";

    document.getElementById(
        "acessorio-valor-unitario"
    ).value = "R$ 0,0000";

    document.getElementById(
        "acessorio-data-compra"
    ).value = "";

    document.getElementById(
        "acessorio-fornecedor"
    ).value = "";

    document.getElementById(
        "acessorio-observacoes"
    ).value = "";

    acessorioEmEdicaoId = null;

    if (botaoSalvarAcessorio) {
        botaoSalvarAcessorio.textContent =
            "Salvar Acessório";
    }
}

window.excluirAcessorio = function (id) {

    const acessorioEncontrado =
        acessorios.find(function (acessorio) {
            return acessorio.id === id;
        });

    if (!acessorioEncontrado) {
        alert("Acessório não encontrado.");
        return;
    }

    const confirmar = confirm(
        `Tem certeza que deseja excluir "${acessorioEncontrado.nome}"?`
    );

    if (!confirmar) {
        return;
    }

    acessorios = acessorios.filter(
        function (acessorio) {
            return acessorio.id !== id;
        }
    );

    salvarAcessorios();
    mostrarAcessorios();
};

window.editarAcessorio = function (id) {

    const acessorio =
        acessorios.find(function (item) {
            return item.id === id;
        });

    if (!acessorio) {
        alert("Acessório não encontrado.");
        return;
    }

    acessorioEmEdicaoId = id;

    document.getElementById(
        "acessorio-nome"
    ).value = acessorio.nome || "";

    document.getElementById(
        "acessorio-categoria"
    ).value = acessorio.categoria || "";

    document.getElementById(
        "acessorio-quantidade"
    ).value = acessorio.quantidade || "";

    document.getElementById(
        "acessorio-estoque-minimo"
    ).value = acessorio.estoqueMinimo || "";

    document.getElementById(
        "acessorio-unidade-compra"
    ).value = acessorio.unidadeCompra || "";

    document.getElementById(
        "acessorio-valor-compra"
    ).value = acessorio.valorCompra || "";

    document.getElementById(
        "acessorio-data-compra"
    ).value = acessorio.dataCompra || "";

    document.getElementById(
        "acessorio-fornecedor"
    ).value = acessorio.fornecedor || "";

    document.getElementById(
        "acessorio-observacoes"
    ).value = acessorio.observacoes || "";

    calcularValorUnitarioAcessorio();

    if (botaoSalvarAcessorio) {
        botaoSalvarAcessorio.textContent =
            "Atualizar Acessório";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

};

if (botaoSalvarAcessorio) {

    botaoSalvarAcessorio.addEventListener(
        "click",
        function () {

            const nome =
                document.getElementById(
                    "acessorio-nome"
                ).value.trim();

            const categoria =
                document.getElementById(
                    "acessorio-categoria"
                ).value;

            const quantidade =
                Number(
                    document.getElementById(
                        "acessorio-quantidade"
                    ).value
                );

            const estoqueMinimo =
                Number(
                    document.getElementById(
                        "acessorio-estoque-minimo"
                    ).value
                );

            const unidadeCompra =
                document.getElementById(
                    "acessorio-unidade-compra"
                ).value;

            const valorCompra =
                Number(
                    document.getElementById(
                        "acessorio-valor-compra"
                    ).value
                );

            const valorUnitario =
                quantidade > 0
                    ? valorCompra / quantidade
                    : 0;

            const dataCompra =
                document.getElementById(
                    "acessorio-data-compra"
                ).value;

            const fornecedor =
                document.getElementById(
                    "acessorio-fornecedor"
                ).value.trim();

            const observacoes =
                document.getElementById(
                    "acessorio-observacoes"
                ).value.trim();

            if (!nome) {
                alert(
                    "Informe o nome do acessório."
                );
                return;
            }

            if (!categoria) {
                alert(
                    "Selecione a categoria."
                );
                return;
            }

            if (
                Number.isNaN(quantidade) ||
                quantidade <= 0
            ) {
                alert(
                    "Informe uma quantidade válida."
                );
                return;
            }

            if (
                Number.isNaN(estoqueMinimo) ||
                estoqueMinimo < 0
            ) {
                alert(
                    "Informe um estoque mínimo válido."
                );
                return;
            }

            if (!unidadeCompra) {
                alert(
                    "Selecione a unidade de compra."
                );
                return;
            }

            if (
                Number.isNaN(valorCompra) ||
                valorCompra < 0
            ) {
                alert(
                    "Informe um valor de compra válido."
                );
                return;
            }

           acessorioEmEdicaoId = id
        }
    );
}

let filamentos = [];
mostrarAcessorios();
try {

    const dadosFilamentos =
        JSON.parse(
            localStorage.getItem(
                "organiza3d_filamentos"
            )
        );

    filamentos =
        Array.isArray(dadosFilamentos)
            ? dadosFilamentos
            : [];

} catch (erro) {

    console.error(
        "Não foi possível carregar os filamentos.",
        erro
    );

    filamentos = [];
}
let filamentoEmEdicaoId = null;

const botaoSalvarFilamento =
    document.getElementById("salvar-filamento");

const botaoLimparFormularioFilamento =
    document.getElementById(
        "limpar-formulario-filamento"
    );

const listaFilamentos =
    document.getElementById("lista-filamentos");

const campoFilamentoFabricante =
    document.getElementById("filamento-fabricante");

const campoFilamentoMaterial =
    document.getElementById("filamento-material");

const campoFilamentoCor =
    document.getElementById("filamento-cor");

const campoFilamentoPesoInicial =
    document.getElementById(
        "filamento-peso-inicial"
    );

const campoFilamentoPesoRestante =
    document.getElementById(
        "filamento-peso-restante"
    );

const campoFilamentoPercentual =
    document.getElementById(
        "filamento-percentual"
    );

const campoFilamentoValor =
    document.getElementById("filamento-valor");

const campoFilamentoDataCompra =
    document.getElementById(
        "filamento-data-compra"
    );

const campoFilamentoFornecedor =
    document.getElementById(
        "filamento-fornecedor"
    );

const campoFilamentoStatus =
    document.getElementById("filamento-status");

const campoFilamentoObservacoes =
    document.getElementById(
        "filamento-observacoes"
    );

function salvarFilamentos() {
    localStorage.setItem(
        "organiza3d_filamentos",
        JSON.stringify(filamentos)
    );
}

function calcularPercentualFilamento(
    pesoInicial,
    pesoRestante
) {
    const inicial = Number(pesoInicial);
    const restante = Number(pesoRestante);

    if (!inicial || inicial <= 0) {
        return 0;
    }

    const percentual =
        (restante / inicial) * 100;

    return Math.max(
        0,
        Math.min(100, percentual)
    );
}

function definirStatusFilamento(
    pesoInicial,
    pesoRestante
) {
    const inicial = Number(pesoInicial);
    const restante = Number(pesoRestante);

    if (restante <= 0) {
        return "Finalizado";
    }

    const percentual =
        calcularPercentualFilamento(
            inicial,
            restante
        );

    if (percentual <= 20) {
        return "Baixo estoque";
    }

    if (restante < inicial) {
        return "Em uso";
    }

    return "Novo";
}

function formatarPercentualFilamento(valor) {
    return `${Number(valor).toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1
        }
    )}%`;
}

function formatarDataFilamento(data) {
    if (!data) {
        return "Não informada";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function obterDataHojeFilamento() {
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

function atualizarCalculosFormularioFilamento() {
    if (
        !campoFilamentoPesoInicial ||
        !campoFilamentoPesoRestante
    ) {
        return;
    }

    const pesoInicial = Number(
        campoFilamentoPesoInicial.value
    );

    const pesoRestante = Number(
        campoFilamentoPesoRestante.value
    );

    const percentual =
        calcularPercentualFilamento(
            pesoInicial,
            pesoRestante
        );

    const status =
        definirStatusFilamento(
            pesoInicial,
            pesoRestante
        );

    if (campoFilamentoPercentual) {
        campoFilamentoPercentual.value =
            formatarPercentualFilamento(
                percentual
            );
    }

    if (campoFilamentoStatus) {
        campoFilamentoStatus.value = status;
    }
}

function atualizarResumoFilamentos() {
    const campoTotal =
        document.getElementById(
            "filamentos-total-rolos"
        );

    const campoNovos =
        document.getElementById(
            "filamentos-total-novos"
        );

    const campoEmUso =
        document.getElementById(
            "filamentos-total-em-uso"
        );

    const campoBaixo =
        document.getElementById(
            "filamentos-total-baixo"
        );

    const campoFinalizados =
        document.getElementById(
            "filamentos-total-finalizados"
        );

    const campoPesoDisponivel =
        document.getElementById(
            "filamentos-peso-disponivel"
        );

    const totalNovos = filamentos.filter(
        function (filamento) {
            return filamento.status === "Novo";
        }
    ).length;

    const totalEmUso = filamentos.filter(
        function (filamento) {
            return filamento.status === "Em uso";
        }
    ).length;

    const totalBaixo = filamentos.filter(
        function (filamento) {
            return filamento.status ===
                "Baixo estoque";
        }
    ).length;

    const totalFinalizados =
        filamentos.filter(
            function (filamento) {
                return filamento.status ===
                    "Finalizado";
            }
        ).length;

    const pesoDisponivel =
        filamentos.reduce(
            function (total, filamento) {
                return total +
                    Number(
                        filamento.pesoRestante || 0
                    );
            },
            0
        );

    if (campoTotal) {
        campoTotal.textContent =
            filamentos.length;
    }

    if (campoNovos) {
        campoNovos.textContent = totalNovos;
    }

    if (campoEmUso) {
        campoEmUso.textContent = totalEmUso;
    }

    if (campoBaixo) {
        campoBaixo.textContent = totalBaixo;
    }

    if (campoFinalizados) {
        campoFinalizados.textContent =
            totalFinalizados;
    }

    if (campoPesoDisponivel) {
        campoPesoDisponivel.textContent =
            `${pesoDisponivel.toLocaleString(
                "pt-BR",
                {
                    maximumFractionDigits: 1
                }
            )} g`;
    }
}

function normalizarFilamentosAntigos() {

    if (!Array.isArray(filamentos)) {
        filamentos = [];
    }

    filamentos = filamentos.map(

        function (filamento, indice) {
            const pesoInicial = Number(
                filamento.pesoInicial || 0
            );

            const pesoRestante =
                filamento.pesoRestante !== undefined
                    ? Number(
                        filamento.pesoRestante
                    )
                    : pesoInicial;

            return {
                id:
                    filamento.id ||
                    Date.now() + indice,

                fabricante:
                    filamento.fabricante || "",

                material:
                    filamento.material ||
                    filamento.tipo ||
                    "Outro",

                cor:
                    filamento.cor || "",

                pesoInicial:
                    pesoInicial,

                pesoRestante:
                    pesoRestante,

                percentual:
                    calcularPercentualFilamento(
                        pesoInicial,
                        pesoRestante
                    ),

                valor:
                    Number(
                        filamento.valor || 0
                    ),

                dataCompra:
                    filamento.dataCompra || "",

                fornecedor:
                    filamento.fornecedor || "",

                observacoes:
                    filamento.observacoes || "",

                status:
                    definirStatusFilamento(
                        pesoInicial,
                        pesoRestante
                    )
            };
        }
    );

    salvarFilamentos();
}

function mostrarFilamentos() {
    if (!listaFilamentos) {
        return;
    }

    if (filamentos.length === 0) {
        listaFilamentos.innerHTML =
            "<p>Nenhum filamento cadastrado.</p>";

        atualizarResumoFilamentos();
        return;
    }

    listaFilamentos.innerHTML =
        filamentos
            .map(function (filamento) {
                const percentual =
                    calcularPercentualFilamento(
                        filamento.pesoInicial,
                        filamento.pesoRestante
                    );

                const fornecedor =
                    filamento.fornecedor
                        ? escaparTexto(
                            filamento.fornecedor
                        )
                        : "Não informado";

                const observacoes =
                    filamento.observacoes
                        ? escaparTexto(
                            filamento.observacoes
                        )
                        : "Nenhuma";

                return `
                    <div class="card-item">

                        <h4>
                            ${escaparTexto(
                                filamento.material
                            )}
                            ${escaparTexto(
                                filamento.cor
                            )}
                        </h4>

                        <p>
                            <strong>Fabricante:</strong>
                            ${
                                filamento.fabricante
                                    ? escaparTexto(
                                        filamento.fabricante
                                    )
                                    : "Não informado"
                            }
                        </p>

                        <p>
                            <strong>Peso inicial:</strong>
                            ${Number(
                                filamento.pesoInicial
                            ).toLocaleString(
                                "pt-BR"
                            )} g
                        </p>

                        <p>
                            <strong>Peso restante:</strong>
                            ${Number(
                                filamento.pesoRestante
                            ).toLocaleString(
                                "pt-BR",
                                {
                                    maximumFractionDigits: 1
                                }
                            )} g
                        </p>

                        <p>
                            <strong>Percentual restante:</strong>
                            ${formatarPercentualFilamento(
                                percentual
                            )}
                        </p>

                        <p>
                            <strong>Status:</strong>
                            ${escaparTexto(
                                filamento.status
                            )}
                        </p>

                        <p>
                            <strong>Valor pago:</strong>
                            ${formatarDinheiro(
                                filamento.valor
                            )}
                        </p>

                        <p>
                            <strong>Data da compra:</strong>
                            ${formatarDataFilamento(
                                filamento.dataCompra
                            )}
                        </p>

                        <p>
                            <strong>Fornecedor:</strong>
                            ${fornecedor}
                        </p>

                        <p>
                            <strong>Observações:</strong>
                            ${observacoes}
                        </p>

                        ${
                            filamento.status !==
                            "Finalizado"
                                ? `
                                    <button
                                        type="button"
                                        class="botao-principal"
                                        onclick="registrarConsumoFilamento(
                                            ${filamento.id}
                                        )">
                                        Registrar Consumo
                                    </button>
                                `
                                : ""
                        }

                            <button
                            type="button"
                             class="botao-principal"
                              onclick="editarFilamento(
                            ${filamento.id}
                              )">
                              Editar
                        </button>
<button
    type="button"
    class="botao-excluir"
    onclick="excluirFilamento(
        ${filamento.id}
    )">
    Excluir
</button>
                    </div>
                `;
            })
            .join("");

    atualizarResumoFilamentos();
}

function limparFormularioFilamento() {
    if (campoFilamentoFabricante) {
        campoFilamentoFabricante.value = "";
    }

    if (campoFilamentoMaterial) {
        campoFilamentoMaterial.value = "";
    }

    if (campoFilamentoCor) {
        campoFilamentoCor.value = "";
    }

    if (campoFilamentoPesoInicial) {
        campoFilamentoPesoInicial.value = "";
    }

    if (campoFilamentoPesoRestante) {
        campoFilamentoPesoRestante.value = "";
    }

    if (campoFilamentoPercentual) {
        campoFilamentoPercentual.value = "0%";
    }

    if (campoFilamentoValor) {
        campoFilamentoValor.value = "";
    }

    if (campoFilamentoDataCompra) {
        campoFilamentoDataCompra.value =
            obterDataHojeFilamento();
    }

    if (campoFilamentoFornecedor) {
        campoFilamentoFornecedor.value = "";
    }

    if (campoFilamentoStatus) {
        campoFilamentoStatus.value = "Novo";
    }

    if (campoFilamentoObservacoes) {
        campoFilamentoObservacoes.value = "";
    }
}

if (campoFilamentoPesoInicial) {
    campoFilamentoPesoInicial.addEventListener(
        "input",
        function () {
            const pesoInicial = Number(
                campoFilamentoPesoInicial.value
            );

            if (
                campoFilamentoPesoRestante &&
                !campoFilamentoPesoRestante.value
            ) {
                campoFilamentoPesoRestante.value =
                    pesoInicial || "";
            }

            atualizarCalculosFormularioFilamento();
        }
    );
}

if (campoFilamentoPesoRestante) {
    campoFilamentoPesoRestante.addEventListener(
        "input",
        atualizarCalculosFormularioFilamento
    );
}

if (botaoSalvarFilamento) {
    botaoSalvarFilamento.addEventListener(
        "click",
        function () {
            const fabricante =
                campoFilamentoFabricante.value.trim();

            const material =
                campoFilamentoMaterial.value;

            const cor =
                campoFilamentoCor.value.trim();

            const pesoInicial = Number(
                campoFilamentoPesoInicial.value
            );

            const pesoRestante = Number(
                campoFilamentoPesoRestante.value
            );

            const valor = Number(
                campoFilamentoValor.value
            );

            const dataCompra =
                campoFilamentoDataCompra.value;

            const fornecedor =
                campoFilamentoFornecedor.value.trim();

            const observacoes =
                campoFilamentoObservacoes.value.trim();

            if (!material) {
                alert(
                    "Selecione o material do filamento."
                );
                return;
            }

            if (!cor) {
                alert(
                    "Informe a cor do filamento."
                );
                return;
            }

            if (
                !pesoInicial ||
                pesoInicial <= 0
            ) {
                alert(
                    "Informe um peso inicial válido."
                );
                return;
            }

            if (
                pesoRestante < 0 ||
                pesoRestante > pesoInicial
            ) {
                alert(
                    "O peso restante deve estar entre zero e o peso inicial."
                );
                return;
            }

            if (valor < 0) {
                alert(
                    "Informe um valor válido."
                );
                return;
            }

            const percentual =
                calcularPercentualFilamento(
                    pesoInicial,
                    pesoRestante
                );

            const status =
                definirStatusFilamento(
                    pesoInicial,
                    pesoRestante
                );

            const novoFilamento = {
                id: Date.now(),
                fabricante: fabricante,
                material: material,
                cor: cor,
                pesoInicial: pesoInicial,
                pesoRestante: pesoRestante,
                percentual: percentual,
                valor: valor,
                dataCompra: dataCompra,
                fornecedor: fornecedor,
                status: status,
                observacoes: observacoes
            };

            filamentos.push(novoFilamento);

            salvarFilamentos();
            mostrarFilamentos();
            limparFormularioFilamento();

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
    "Filamento cadastrado com sucesso!"
);
        }
    );
}

if (botaoLimparFormularioFilamento) {
    botaoLimparFormularioFilamento.addEventListener(
        "click",
        limparFormularioFilamento
    );
}

window.registrarConsumoFilamento =
    function (id) {
        const filamento = filamentos.find(
            function (item) {
                return item.id === id;
            }
        );

        if (!filamento) {
            alert("Filamento não encontrado.");
            return;
        }

        const resposta = prompt(
            `Informe quantos gramas foram utilizados de ` +
            `${filamento.material} ${filamento.cor}:`
        );

        if (resposta === null) {
            return;
        }

        const textoConsumo = resposta
            .trim()
            .replace(",", ".");

        const consumo = Number(textoConsumo);

        if (!consumo || consumo <= 0) {
            alert(
                "Informe uma quantidade válida."
            );
            return;
        }

        if (
            consumo >
            Number(filamento.pesoRestante)
        ) {
            alert(
                "O consumo informado é maior que o peso disponível."
            );
            return;
        }

        filamento.pesoRestante =
            Math.max(
                0,
                Number(filamento.pesoRestante) -
                consumo
            );

        filamento.percentual =
            calcularPercentualFilamento(
                filamento.pesoInicial,
                filamento.pesoRestante
            );

        filamento.status =
            definirStatusFilamento(
                filamento.pesoInicial,
                filamento.pesoRestante
            );

        salvarFilamentos();
        mostrarFilamentos();

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
            "Consumo registrado com sucesso!"
        );
    };

window.excluirFilamento =
    function (id) {
        const confirmar = confirm(
            "Tem certeza que deseja excluir este filamento?"
        );

        if (!confirmar) {
            return;
        }

        filamentos = filamentos.filter(
            function (filamento) {
                return filamento.id !== id;
            }
        );

        salvarFilamentos();
        mostrarFilamentos();

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
    };

normalizarFilamentosAntigos();
mostrarFilamentos();
limparFormularioFilamento();

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
// DASHBOARD 2.0
// =========================

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


/* =======================================
   BOTÃO SAIR
======================================= */

const botaoSair = document.getElementById("botao-sair");

if (botaoSair) {

    botaoSair.addEventListener("click", function () {

        const confirmarSaida = confirm(
            "Deseja realmente sair do sistema?"
        );

        if (!confirmarSaida) {
            return;
        }

        aplicativo.style.display = "none";
        telaLogin.style.display = "flex";

        campoUsuario.value = "";
        campoSenha.value = "";
        mensagemLogin.textContent = "";

        campoUsuario.focus();

    });

}