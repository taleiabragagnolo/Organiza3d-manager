// =========================
// ENCOMENDAS 2.0
// =========================

let encomendas = JSON.parse(
    localStorage.getItem("organiza3d_encomendas")
) || [];

const botaoSalvarEncomenda =
    document.getElementById("salvar-encomenda");

const botaoLimparFormularioEncomenda =
    document.getElementById(
        "limpar-formulario-encomenda"
    );

const listaEncomendas =
    document.getElementById("lista-encomendas");

const campoClienteEncomenda =
    document.getElementById("cliente-encomenda");

const campoProdutoEncomenda =
    document.getElementById("produto-encomenda");

const campoQuantidadeEncomenda =
    document.getElementById(
        "quantidade-encomenda"
    );

const campoValorUnitarioEncomenda =
    document.getElementById(
        "valor-unitario-encomenda"
    );

const campoValorTotalEncomenda =
    document.getElementById(
        "valor-total-encomenda"
    );

const campoPrioridadeEncomenda =
    document.getElementById(
        "prioridade-encomenda"
    );

const campoDataPedidoEncomenda =
    document.getElementById(
        "data-pedido-encomenda"
    );

const campoDataEntregaEncomenda =
    document.getElementById(
        "data-entrega-encomenda"
    );

const campoStatusEncomenda =
    document.getElementById(
        "status-encomenda"
    );

const campoPagamentoEncomenda =
    document.getElementById(
        "pagamento-encomenda"
    );

const campoSituacaoPagamentoEncomenda =
    document.getElementById(
        "situacao-pagamento-encomenda"
    );

const campoValorPagoEncomenda =
    document.getElementById(
        "valor-pago-encomenda"
    );

const campoFilamentoEncomenda =
    document.getElementById(
        "encomenda-filamento"
    );

const campoConsumoFilamentoEncomenda =
    document.getElementById(
        "encomenda-consumo-filamento"
    );

const campoFilamentoDisponivelEncomenda =
    document.getElementById(
        "encomenda-filamento-disponivel"
    );

const campoFilamentoRestanteEncomenda =
    document.getElementById(
        "encomenda-filamento-restante"
    );

const campoObservacoesEncomenda =
    document.getElementById(
        "observacoes-encomenda"
    );

const menuEncomendas =
    document.querySelector(
        '[data-pagina="encomendas"]'
    );

// =========================
// ARMAZENAMENTO
// =========================

function salvarEncomendas() {
    localStorage.setItem(
        "organiza3d_encomendas",
        JSON.stringify(encomendas)
    );
}

function carregarFilamentosEncomenda() {
    try {
        return JSON.parse(
            localStorage.getItem(
                "organiza3d_filamentos"
            )
        ) || [];
    } catch (erro) {
        console.error(
            "Não foi possível carregar os filamentos.",
            erro
        );

        return [];
    }
}

// =========================
// DATAS
// =========================

function obterDataHoje() {
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

function formatarDataEncomenda(data) {
    if (!data) {
        return "Não informada";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function encomendaEstaAtrasada(encomenda) {
    const statusFinalizado =
        encomenda.status === "Finalizada" ||
        encomenda.status === "Entregue" ||
        encomenda.status === "Cancelada";

    return Boolean(
        encomenda.dataEntrega &&
        encomenda.dataEntrega < obterDataHoje() &&
        !statusFinalizado
    );
}

// =========================
// OPÇÕES DOS CAMPOS
// =========================

function atualizarOpcoesEncomendas() {
    if (campoClienteEncomenda) {
        const clienteSelecionado =
            campoClienteEncomenda.value;

        campoClienteEncomenda.innerHTML =
            '<option value="">Selecione o cliente</option>';

        clientes.forEach(function (cliente) {
            campoClienteEncomenda.innerHTML += `
                <option value="${cliente.id}">
                    ${escaparTexto(cliente.nome)}
                </option>
            `;
        });

        campoClienteEncomenda.value =
            clienteSelecionado;
    }

    if (campoProdutoEncomenda) {
        const produtoSelecionado =
            campoProdutoEncomenda.value;

        campoProdutoEncomenda.innerHTML =
            '<option value="">Selecione o produto</option>';

        produtos.forEach(function (produto) {
            campoProdutoEncomenda.innerHTML += `
                <option value="${produto.id}">
                    ${escaparTexto(produto.nome)}
                    — ${formatarDinheiro(
                        produto.preco
                    )}
                </option>
            `;
        });

        campoProdutoEncomenda.value =
            produtoSelecionado;
    }

    atualizarOpcoesFilamentosEncomenda();
}

function atualizarOpcoesFilamentosEncomenda() {
    if (!campoFilamentoEncomenda) {
        return;
    }

    const filamentoSelecionado =
        campoFilamentoEncomenda.value;

    const filamentosDisponiveis =
        carregarFilamentosEncomenda().filter(
            function (filamento) {
                return (
                    filamento.status !==
                        "Finalizado" &&
                    Number(
                        filamento.pesoRestante || 0
                    ) > 0
                );
            }
        );

    campoFilamentoEncomenda.innerHTML =
        '<option value="">Nenhum filamento selecionado</option>';

    filamentosDisponiveis.forEach(
        function (filamento) {
            campoFilamentoEncomenda.innerHTML += `
                <option value="${filamento.id}">
                    ${escaparTexto(
                        filamento.material
                    )}
                    ${escaparTexto(
                        filamento.cor
                    )}
                    — ${Number(
                        filamento.pesoRestante || 0
                    ).toLocaleString(
                        "pt-BR",
                        {
                            maximumFractionDigits: 1
                        }
                    )} g disponíveis
                </option>
            `;
        }
    );

    campoFilamentoEncomenda.value =
        filamentoSelecionado;
}

// =========================
// CÁLCULOS
// =========================

function calcularValoresEncomenda() {
    if (
        !campoProdutoEncomenda ||
        !campoQuantidadeEncomenda
    ) {
        return;
    }

    const produtoId = Number(
        campoProdutoEncomenda.value
    );

    const quantidade = Number(
        campoQuantidadeEncomenda.value
    ) || 0;

    const produtoEncontrado =
        produtos.find(
            function (produto) {
                return produto.id === produtoId;
            }
        );

    if (
        !produtoEncontrado ||
        quantidade <= 0
    ) {
        if (campoValorUnitarioEncomenda) {
            campoValorUnitarioEncomenda.value =
                "R$ 0,00";
        }

        if (campoValorTotalEncomenda) {
            campoValorTotalEncomenda.value =
                "R$ 0,00";
        }

        return;
    }

    const valorUnitario = Number(
        produtoEncontrado.preco || 0
    );

    const valorTotal =
        valorUnitario * quantidade;

    if (campoValorUnitarioEncomenda) {
        campoValorUnitarioEncomenda.value =
            formatarDinheiro(valorUnitario);
    }

    if (campoValorTotalEncomenda) {
        campoValorTotalEncomenda.value =
            formatarDinheiro(valorTotal);
    }
}

function calcularFilamentoAposEncomenda() {
    if (
        !campoFilamentoEncomenda ||
        !campoConsumoFilamentoEncomenda
    ) {
        return;
    }

    const filamentoId = Number(
        campoFilamentoEncomenda.value
    );

    const consumo = Number(
        campoConsumoFilamentoEncomenda.value
    ) || 0;

    const filamentosSalvos =
        carregarFilamentosEncomenda();

    const filamentoEncontrado =
        filamentosSalvos.find(
            function (filamento) {
                return filamento.id === filamentoId;
            }
        );

    if (!filamentoEncontrado) {
        if (
            campoFilamentoDisponivelEncomenda
        ) {
            campoFilamentoDisponivelEncomenda.value =
                "Nenhum filamento selecionado";
        }

        if (
            campoFilamentoRestanteEncomenda
        ) {
            campoFilamentoRestanteEncomenda.value =
                "0 g";
        }

        return;
    }

    const pesoDisponivel = Number(
        filamentoEncontrado.pesoRestante || 0
    );

    const pesoRestante =
        pesoDisponivel - consumo;

    if (
        campoFilamentoDisponivelEncomenda
    ) {
        campoFilamentoDisponivelEncomenda.value =
            `${pesoDisponivel.toLocaleString(
                "pt-BR",
                {
                    maximumFractionDigits: 1
                }
            )} g`;
    }

    if (
        campoFilamentoRestanteEncomenda
    ) {
        campoFilamentoRestanteEncomenda.value =
            `${Math.max(
                0,
                pesoRestante
            ).toLocaleString(
                "pt-BR",
                {
                    maximumFractionDigits: 1
                }
            )} g`;
    }
}

// =========================
// RESUMO
// =========================

function atualizarResumoEncomendas() {
    const campoTotal =
        document.getElementById(
            "encomendas-total"
        );

    const campoAguardando =
        document.getElementById(
            "encomendas-aguardando"
        );

    const campoProducao =
        document.getElementById(
            "encomendas-em-producao"
        );

    const campoFinalizadas =
        document.getElementById(
            "encomendas-finalizadas"
        );

    const campoEntregues =
        document.getElementById(
            "encomendas-entregues"
        );

    const campoAtrasadas =
        document.getElementById(
            "encomendas-atrasadas"
        );

    const campoValorTotal =
        document.getElementById(
            "encomendas-valor-total"
        );

    const totalAguardando =
        encomendas.filter(
            function (encomenda) {
                return encomenda.status ===
                    "Aguardando";
            }
        ).length;

    const totalProducao =
        encomendas.filter(
            function (encomenda) {
                return encomenda.status ===
                    "Em produção";
            }
        ).length;

    const totalFinalizadas =
        encomendas.filter(
            function (encomenda) {
                return encomenda.status ===
                    "Finalizada";
            }
        ).length;

    const totalEntregues =
        encomendas.filter(
            function (encomenda) {
                return encomenda.status ===
                    "Entregue";
            }
        ).length;

    const totalAtrasadas =
        encomendas.filter(
            encomendaEstaAtrasada
        ).length;

    const valorTotal =
        encomendas.reduce(
            function (total, encomenda) {
                if (
                    encomenda.status ===
                    "Cancelada"
                ) {
                    return total;
                }

                return total +
                    Number(
                        encomenda.valorTotal || 0
                    );
            },
            0
        );

    if (campoTotal) {
        campoTotal.textContent =
            encomendas.length;
    }

    if (campoAguardando) {
        campoAguardando.textContent =
            totalAguardando;
    }

    if (campoProducao) {
        campoProducao.textContent =
            totalProducao;
    }

    if (campoFinalizadas) {
        campoFinalizadas.textContent =
            totalFinalizadas;
    }

    if (campoEntregues) {
        campoEntregues.textContent =
            totalEntregues;
    }

    if (campoAtrasadas) {
        campoAtrasadas.textContent =
            totalAtrasadas;
    }

    if (campoValorTotal) {
        campoValorTotal.textContent =
            formatarDinheiro(valorTotal);
    }

    const totalEncomendasDashboard =
        document.getElementById(
            "total-encomendas"
        );

    if (totalEncomendasDashboard) {
        totalEncomendasDashboard.textContent =
            encomendas.length;
    }
}

// =========================
// NORMALIZAÇÃO
// =========================

function normalizarEncomendasAntigas() {
    encomendas = encomendas.map(
        function (encomenda, indice) {
            const valorTotal = Number(
                encomenda.valorTotal || 0
            );

            const valorPago = Number(
                encomenda.valorPago || 0
            );

            return {
                id:
                    encomenda.id ||
                    Date.now() + indice,

                clienteId:
                    encomenda.clienteId || null,

                clienteNome:
                    encomenda.clienteNome || "",

                produtoId:
                    encomenda.produtoId || null,

                produtoNome:
                    encomenda.produtoNome || "",

                quantidade:
                    Number(
                        encomenda.quantidade || 1
                    ),

                valorUnitario:
                    Number(
                        encomenda.valorUnitario ||
                        0
                    ),

                valorTotal:
                    valorTotal,

                prioridade:
                    encomenda.prioridade ||
                    "Normal",

                dataPedido:
                    encomenda.dataPedido || "",

                dataEntrega:
                    encomenda.dataEntrega || "",

                status:
                    encomenda.status ||
                    "Aguardando",

                formaPagamento:
                    encomenda.formaPagamento ||
                    "",

                situacaoPagamento:
                    encomenda.situacaoPagamento ||
                    (
                        valorPago >= valorTotal &&
                        valorTotal > 0
                            ? "Pago"
                            : valorPago > 0
                                ? "Parcial"
                                : "Pendente"
                    ),

                valorPago:
                    valorPago,

                filamentoId:
                    encomenda.filamentoId ||
                    null,

                filamentoNome:
                    encomenda.filamentoNome ||
                    "",

                consumoFilamento:
                    Number(
                        encomenda.consumoFilamento ||
                        0
                    ),

                observacoes:
                    encomenda.observacoes || ""
            };
        }
    );

    salvarEncomendas();
}

// =========================
// LISTAGEM
// =========================

function mostrarEncomendas() {
    if (!listaEncomendas) {
        return;
    }

    if (encomendas.length === 0) {
        listaEncomendas.innerHTML =
            "<p>Nenhuma encomenda cadastrada.</p>";

        atualizarResumoEncomendas();
        return;
    }

    const encomendasOrdenadas =
        [...encomendas].sort(
            function (a, b) {
                return (
                    new Date(b.dataPedido) -
                    new Date(a.dataPedido)
                );
            }
        );

    listaEncomendas.innerHTML =
        encomendasOrdenadas
            .map(function (encomenda) {
                const atrasada =
                    encomendaEstaAtrasada(
                        encomenda
                    );

                const saldoPendente =
                    Math.max(
                        0,
                        Number(
                            encomenda.valorTotal || 0
                        ) -
                        Number(
                            encomenda.valorPago || 0
                        )
                    );

                const filamentoTexto =
                    encomenda.filamentoNome
                        ? escaparTexto(
                            encomenda.filamentoNome
                        )
                        : "Não informado";

                const observacoes =
                    encomenda.observacoes
                        ? escaparTexto(
                            encomenda.observacoes
                        )
                        : "Nenhuma";

                return `
                    <div class="card-item">

                        <h4>
                            ${escaparTexto(
                                encomenda.produtoNome
                            )}
                        </h4>

                        ${
                            atrasada
                                ? `
                                    <p>
                                        <strong>
                                            ⚠️ Encomenda atrasada
                                        </strong>
                                    </p>
                                `
                                : ""
                        }

                        <p>
                            <strong>Cliente:</strong>
                            ${escaparTexto(
                                encomenda.clienteNome
                            )}
                        </p>

                        <p>
                            <strong>Quantidade:</strong>
                            ${Number(
                                encomenda.quantidade
                            )}
                        </p>

                        <p>
                            <strong>Prioridade:</strong>
                            ${escaparTexto(
                                encomenda.prioridade
                            )}
                        </p>

                        <p>
                            <strong>Data do pedido:</strong>
                            ${formatarDataEncomenda(
                                encomenda.dataPedido
                            )}
                        </p>

                        <p>
                            <strong>Previsão de entrega:</strong>
                            ${formatarDataEncomenda(
                                encomenda.dataEntrega
                            )}
                        </p>

                        <p>
                            <strong>Status:</strong>
                            ${escaparTexto(
                                encomenda.status
                            )}
                        </p>

                        <p>
                            <strong>Valor unitário:</strong>
                            ${formatarDinheiro(
                                encomenda.valorUnitario
                            )}
                        </p>

                        <p>
                            <strong>Valor total:</strong>
                            ${formatarDinheiro(
                                encomenda.valorTotal
                            )}
                        </p>

                        <p>
                            <strong>Forma de pagamento:</strong>
                            ${
                                encomenda.formaPagamento
                                    ? escaparTexto(
                                        encomenda.formaPagamento
                                    )
                                    : "Não informada"
                            }
                        </p>

                        <p>
                            <strong>Situação do pagamento:</strong>
                            ${escaparTexto(
                                encomenda.situacaoPagamento
                            )}
                        </p>

                        <p>
                            <strong>Valor pago:</strong>
                            ${formatarDinheiro(
                                encomenda.valorPago
                            )}
                        </p>

                        <p>
                            <strong>Saldo pendente:</strong>
                            ${formatarDinheiro(
                                saldoPendente
                            )}
                        </p>

                        <p>
                            <strong>Filamento:</strong>
                            ${filamentoTexto}
                        </p>

                        <p>
                            <strong>Consumo:</strong>
                            ${Number(
                                encomenda.consumoFilamento ||
                                0
                            ).toLocaleString(
                                "pt-BR",
                                {
                                    maximumFractionDigits: 1
                                }
                            )} g
                        </p>

                        <p>
                            <strong>Observações:</strong>
                            ${observacoes}
                        </p>

                        <button
                            type="button"
                            class="botao-principal"
                            onclick="atualizarStatusEncomenda(
                                ${encomenda.id}
                            )">
                            Atualizar Status
                        </button>

                        <button
                            type="button"
                            onclick="registrarPagamentoEncomenda(
                                ${encomenda.id}
                            )">
                            Registrar Pagamento
                        </button>

                        <button
                            type="button"
                            class="botao-excluir"
                            onclick="excluirEncomenda(
                                ${encomenda.id}
                            )">
                            Excluir
                        </button>

                    </div>
                `;
            })
            .join("");

    atualizarResumoEncomendas();
}

// =========================
// FORMULÁRIO
// =========================

function limparFormularioEncomenda() {
    if (campoClienteEncomenda) {
        campoClienteEncomenda.value = "";
    }

    if (campoProdutoEncomenda) {
        campoProdutoEncomenda.value = "";
    }

    if (campoQuantidadeEncomenda) {
        campoQuantidadeEncomenda.value = 1;
    }

    if (campoValorUnitarioEncomenda) {
        campoValorUnitarioEncomenda.value =
            "R$ 0,00";
    }

    if (campoValorTotalEncomenda) {
        campoValorTotalEncomenda.value =
            "R$ 0,00";
    }

    if (campoPrioridadeEncomenda) {
        campoPrioridadeEncomenda.value =
            "Normal";
    }

    if (campoDataPedidoEncomenda) {
        campoDataPedidoEncomenda.value =
            obterDataHoje();
    }

    if (campoDataEntregaEncomenda) {
        campoDataEntregaEncomenda.value =
            "";
    }

    if (campoStatusEncomenda) {
        campoStatusEncomenda.value =
            "Aguardando";
    }

    if (campoPagamentoEncomenda) {
        campoPagamentoEncomenda.value = "";
    }

    if (
        campoSituacaoPagamentoEncomenda
    ) {
        campoSituacaoPagamentoEncomenda.value =
            "Pendente";
    }

    if (campoValorPagoEncomenda) {
        campoValorPagoEncomenda.value = "";
    }

    if (campoFilamentoEncomenda) {
        campoFilamentoEncomenda.value = "";
    }

    if (
        campoConsumoFilamentoEncomenda
    ) {
        campoConsumoFilamentoEncomenda.value =
            "";
    }

    if (
        campoFilamentoDisponivelEncomenda
    ) {
        campoFilamentoDisponivelEncomenda.value =
            "Nenhum filamento selecionado";
    }

    if (
        campoFilamentoRestanteEncomenda
    ) {
        campoFilamentoRestanteEncomenda.value =
            "0 g";
    }

    if (campoObservacoesEncomenda) {
        campoObservacoesEncomenda.value = "";
    }
}

// =========================
// EVENTOS DOS CAMPOS
// =========================

if (menuEncomendas) {
    menuEncomendas.addEventListener(
        "click",
        function () {
            atualizarOpcoesEncomendas();
            calcularValoresEncomenda();
            calcularFilamentoAposEncomenda();
            atualizarResumoEncomendas();
        }
    );
}

if (campoProdutoEncomenda) {
    campoProdutoEncomenda.addEventListener(
        "change",
        calcularValoresEncomenda
    );
}

if (campoQuantidadeEncomenda) {
    campoQuantidadeEncomenda.addEventListener(
        "input",
        calcularValoresEncomenda
    );
}

if (campoFilamentoEncomenda) {
    campoFilamentoEncomenda.addEventListener(
        "change",
        calcularFilamentoAposEncomenda
    );
}

if (campoConsumoFilamentoEncomenda) {
    campoConsumoFilamentoEncomenda.addEventListener(
        "input",
        calcularFilamentoAposEncomenda
    );
}

if (botaoLimparFormularioEncomenda) {
    botaoLimparFormularioEncomenda.addEventListener(
        "click",
        limparFormularioEncomenda
    );
}

// =========================
// SALVAR ENCOMENDA
// =========================

if (botaoSalvarEncomenda) {
    botaoSalvarEncomenda.addEventListener(
        "click",
        function () {
            const clienteId = Number(
                campoClienteEncomenda.value
            );

            const produtoId = Number(
                campoProdutoEncomenda.value
            );

            const quantidade = Number(
                campoQuantidadeEncomenda.value
            );

            const prioridade =
                campoPrioridadeEncomenda.value;

            const dataPedido =
                campoDataPedidoEncomenda.value;

            const dataEntrega =
                campoDataEntregaEncomenda.value;

            const status =
                campoStatusEncomenda.value;

            const formaPagamento =
                campoPagamentoEncomenda.value;

            const situacaoPagamento =
                campoSituacaoPagamentoEncomenda
                    .value;

            const valorPago = Number(
                campoValorPagoEncomenda.value ||
                0
            );

            const filamentoId = Number(
                campoFilamentoEncomenda.value
            );

            const consumoFilamento = Number(
                campoConsumoFilamentoEncomenda
                    .value || 0
            );

            const observacoes =
                campoObservacoesEncomenda
                    .value
                    .trim();

            const clienteEncontrado =
                clientes.find(
                    function (cliente) {
                        return cliente.id ===
                            clienteId;
                    }
                );

            const produtoEncontrado =
                produtos.find(
                    function (produto) {
                        return produto.id ===
                            produtoId;
                    }
                );

            if (!clienteEncontrado) {
                alert(
                    "Selecione um cliente."
                );
                return;
            }

            if (!produtoEncontrado) {
                alert(
                    "Selecione um produto."
                );
                return;
            }

            if (
                !quantidade ||
                quantidade <= 0 ||
                !Number.isInteger(quantidade)
            ) {
                alert(
                    "Informe uma quantidade inteira válida."
                );
                return;
            }

            if (!dataPedido) {
                alert(
                    "Informe a data do pedido."
                );
                return;
            }

            if (!dataEntrega) {
                alert(
                    "Informe a previsão de entrega."
                );
                return;
            }

            if (dataEntrega < dataPedido) {
                alert(
                    "A previsão de entrega não pode ser anterior à data do pedido."
                );
                return;
            }

            if (
                valorPago < 0 ||
                Number.isNaN(valorPago)
            ) {
                alert(
                    "Informe um valor pago válido."
                );
                return;
            }

            const valorUnitario = Number(
                produtoEncontrado.preco || 0
            );

            const valorTotal =
                valorUnitario * quantidade;

            if (valorPago > valorTotal) {
                alert(
                    "O valor pago não pode ser maior que o valor total."
                );
                return;
            }

            let situacaoPagamentoFinal =
                situacaoPagamento;

            if (valorPago >= valorTotal) {
                situacaoPagamentoFinal =
                    "Pago";
            } else if (valorPago > 0) {
                situacaoPagamentoFinal =
                    "Parcial";
            } else {
                situacaoPagamentoFinal =
                    "Pendente";
            }

            let filamentoEncontrado = null;

            if (filamentoId) {
                filamentoEncontrado =
                    filamentos.find(
                        function (filamento) {
                            return filamento.id ===
                                filamentoId;
                        }
                    );

                if (!filamentoEncontrado) {
                    alert(
                        "O filamento selecionado não foi encontrado."
                    );
                    return;
                }

                if (
                    !consumoFilamento ||
                    consumoFilamento <= 0
                ) {
                    alert(
                        "Informe o consumo do filamento em gramas."
                    );
                    return;
                }

                if (
                    consumoFilamento >
                    Number(
                        filamentoEncontrado
                            .pesoRestante || 0
                    )
                ) {
                    alert(
                        "O consumo é maior que o peso disponível do filamento."
                    );
                    return;
                }
            } else if (
                consumoFilamento > 0
            ) {
                alert(
                    "Selecione o filamento utilizado."
                );
                return;
            }

            const encomenda = {
                id: Date.now(),

                clienteId:
                    clienteEncontrado.id,

                clienteNome:
                    clienteEncontrado.nome,

                produtoId:
                    produtoEncontrado.id,

                produtoNome:
                    produtoEncontrado.nome,

                quantidade:
                    quantidade,

                valorUnitario:
                    valorUnitario,

                valorTotal:
                    valorTotal,

                prioridade:
                    prioridade,

                dataPedido:
                    dataPedido,

                dataEntrega:
                    dataEntrega,

                status:
                    status,

                formaPagamento:
                    formaPagamento,

                situacaoPagamento:
                    situacaoPagamentoFinal,

                valorPago:
                    valorPago,

                filamentoId:
                    filamentoEncontrado
                        ? filamentoEncontrado.id
                        : null,

                filamentoNome:
                    filamentoEncontrado
                        ? `${filamentoEncontrado.material} ${filamentoEncontrado.cor}`
                        : "",

                consumoFilamento:
                    filamentoEncontrado
                        ? consumoFilamento
                        : 0,

                observacoes:
                    observacoes
            };

            if (filamentoEncontrado) {
                filamentoEncontrado.pesoRestante =
                    Math.max(
                        0,
                        Number(
                            filamentoEncontrado
                                .pesoRestante
                        ) -
                        consumoFilamento
                    );

                filamentoEncontrado.percentual =
                    calcularPercentualFilamento(
                        filamentoEncontrado
                            .pesoInicial,
                        filamentoEncontrado
                            .pesoRestante
                    );

                filamentoEncontrado.status =
                    definirStatusFilamento(
                        filamentoEncontrado
                            .pesoInicial,
                        filamentoEncontrado
                            .pesoRestante
                    );

                salvarFilamentos();
                mostrarFilamentos();
            }

            encomendas.push(encomenda);

            salvarEncomendas();
            mostrarEncomendas();
            atualizarOpcoesEncomendas();
            limparFormularioEncomenda();

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
                "Encomenda cadastrada com sucesso!"
            );
        }
    );
}

// =========================
// ATUALIZAR STATUS
// =========================

window.atualizarStatusEncomenda =
    function (id) {
        const encomenda =
            encomendas.find(
                function (item) {
                    return item.id === id;
                }
            );

        if (!encomenda) {
            alert(
                "Encomenda não encontrada."
            );
            return;
        }

        const novoStatus = prompt(
            "Informe o novo status:\n\nAguardando\nEm produção\nFinalizada\nEntregue\nCancelada",
            encomenda.status
        );

        if (novoStatus === null) {
            return;
        }

        const statusPermitidos = [
            "Aguardando",
            "Em produção",
            "Finalizada",
            "Entregue",
            "Cancelada"
        ];

        const statusEncontrado =
            statusPermitidos.find(
                function (status) {
                    return (
                        status.toLowerCase() ===
                        novoStatus
                            .trim()
                            .toLowerCase()
                    );
                }
            );

        if (!statusEncontrado) {
            alert(
                "Informe um status válido."
            );
            return;
        }

        encomenda.status =
            statusEncontrado;

        salvarEncomendas();
        mostrarEncomendas();

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
            "Status atualizado com sucesso!"
        );
    };

// =========================
// REGISTRAR PAGAMENTO
// =========================

window.registrarPagamentoEncomenda =
    function (id) {
        const encomenda =
            encomendas.find(
                function (item) {
                    return item.id === id;
                }
            );

        if (!encomenda) {
            alert(
                "Encomenda não encontrada."
            );
            return;
        }

        const saldoAtual =
            Math.max(
                0,
                Number(
                    encomenda.valorTotal || 0
                ) -
                Number(
                    encomenda.valorPago || 0
                )
            );

        if (saldoAtual <= 0) {
            alert(
                "Esta encomenda já está totalmente paga."
            );
            return;
        }

        const resposta = prompt(
            `Saldo pendente: ${formatarDinheiro(
                saldoAtual
            )}\n\nInforme o valor recebido:`
        );

        if (resposta === null) {
            return;
        }

        const valorRecebido = Number(
            resposta
                .trim()
                .replace(",", ".")
        );

        if (
            !valorRecebido ||
            valorRecebido <= 0
        ) {
            alert(
                "Informe um valor válido."
            );
            return;
        }

        if (valorRecebido > saldoAtual) {
            alert(
                "O valor recebido é maior que o saldo pendente."
            );
            return;
        }

        encomenda.valorPago =
            Number(
                encomenda.valorPago || 0
            ) + valorRecebido;

        if (
            encomenda.valorPago >=
            encomenda.valorTotal
        ) {
            encomenda.situacaoPagamento =
                "Pago";
        } else {
            encomenda.situacaoPagamento =
                "Parcial";
        }

        salvarEncomendas();
        mostrarEncomendas();

        alert(
            "Pagamento registrado com sucesso!"
        );
    };

// =========================
// EXCLUIR
// =========================

window.excluirEncomenda =
    function (id) {
        const encomenda =
            encomendas.find(
                function (item) {
                    return item.id === id;
                }
            );

        if (!encomenda) {
            return;
        }

        const confirmar = confirm(
            `Tem certeza que deseja excluir a encomenda de "${encomenda.produtoNome}"?`
        );

        if (!confirmar) {
            return;
        }

        encomendas =
            encomendas.filter(
                function (item) {
                    return item.id !== id;
                }
            );

        salvarEncomendas();
        mostrarEncomendas();

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

// =========================
// INICIALIZAÇÃO
// =========================

normalizarEncomendasAntigas();
mostrarEncomendas();
atualizarOpcoesEncomendas();
limparFormularioEncomenda();

prepararFormularioFinanceiro();