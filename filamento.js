// =========================
// FILAMENTOS 2.0
// =========================
function iniciarFilamento() {
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
// ACESSÓRIOS DE PRODUÇÃO
// =========================

let acessorios = [];

try {

    const dadosAcessorios =
        JSON.parse(
            localStorage.getItem(
                "organiza3d_acessorios"
            )
        );

    acessorios =
        Array.isArray(dadosAcessorios)
            ? dadosAcessorios
            : [];

} catch (erro) {

    console.error(
        "Não foi possível carregar os acessórios.",
        erro
    );

    acessorios = [];
}

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

                const dataCompra =
                    acessorio.dataCompra
                        ? acessorio.dataCompra
                            .split("-")
                            .reverse()
                            .join("/")
                        : "Não informada";

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
                                acessorio.categoria ||
                                "Não informada"
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
                            ${dataCompra}
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
                                type="button"
                                class="botao-principal"
                                onclick="editarAcessorio(
                                    ${acessorio.id}
                                )">
                                Editar
                            </button>

                            <button
                                type="button"
                                class="botao-excluir"
                                onclick="excluirAcessorio(
                                    ${acessorio.id}
                                )">
                                Excluir
                            </button>

                        </div>

                    </div>
                `;
            })
            .join("");
}

function limparFormularioAcessorio() {

    const campoNome =
        document.getElementById(
            "acessorio-nome"
        );

    const campoCategoria =
        document.getElementById(
            "acessorio-categoria"
        );

    const campoEstoqueMinimo =
        document.getElementById(
            "acessorio-estoque-minimo"
        );

    const campoUnidadeCompra =
        document.getElementById(
            "acessorio-unidade-compra"
        );

    const campoDataCompra =
        document.getElementById(
            "acessorio-data-compra"
        );

    const campoFornecedor =
        document.getElementById(
            "acessorio-fornecedor"
        );

    const campoObservacoes =
        document.getElementById(
            "acessorio-observacoes"
        );

    if (campoNome) {
        campoNome.value = "";
    }

    if (campoCategoria) {
        campoCategoria.value = "";
    }

    if (campoAcessorioQuantidade) {
        campoAcessorioQuantidade.value = "";
    }

    if (campoEstoqueMinimo) {
        campoEstoqueMinimo.value = "";
    }

    if (campoUnidadeCompra) {
        campoUnidadeCompra.value = "";
    }

    if (campoAcessorioValorCompra) {
        campoAcessorioValorCompra.value = "";
    }

    if (campoAcessorioValorUnitario) {
        campoAcessorioValorUnitario.value =
            "R$ 0,0000";
    }

    if (campoDataCompra) {
        campoDataCompra.value = "";
    }

    if (campoFornecedor) {
        campoFornecedor.value = "";
    }

    if (campoObservacoes) {
        campoObservacoes.value = "";
    }

    acessorioEmEdicaoId = null;

    if (botaoSalvarAcessorio) {

        botaoSalvarAcessorio.textContent =
            "Salvar Acessório";
    }
}

window.editarAcessorio = function (id) {

    const acessorio =
        acessorios.find(
            function (item) {
                return item.id === id;
            }
        );

    if (!acessorio) {

        alert(
            "Acessório não encontrado."
        );

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

    abrirAbaFilamento(
        "aba-acessorios"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

window.excluirAcessorio = function (id) {

    const acessorioEncontrado =
        acessorios.find(
            function (acessorio) {
                return acessorio.id === id;
            }
        );

    if (!acessorioEncontrado) {

        alert(
            "Acessório não encontrado."
        );

        return;
    }

    const confirmar = confirm(
        `Tem certeza que deseja excluir "${acessorioEncontrado.nome}"?`
    );

    if (!confirmar) {
        return;
    }

    acessorios =
        acessorios.filter(
            function (acessorio) {
                return acessorio.id !== id;
            }
        );

    salvarAcessorios();
    mostrarAcessorios();

    if (
        acessorioEmEdicaoId === id
    ) {
        limparFormularioAcessorio();
    }

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

            const dadosAcessorio = {
                nome: nome,
                categoria: categoria,
                quantidade: quantidade,
                estoqueMinimo: estoqueMinimo,
                unidadeCompra: unidadeCompra,
                valorCompra: valorCompra,
                valorUnitario: valorUnitario,
                dataCompra: dataCompra,
                fornecedor: fornecedor,
                observacoes: observacoes
            };

            if (
                acessorioEmEdicaoId !== null
            ) {

                const indice =
                    acessorios.findIndex(
                        function (acessorio) {
                            return acessorio.id ===
                                acessorioEmEdicaoId;
                        }
                    );

                if (indice === -1) {

                    alert(
                        "Acessório não encontrado."
                    );

                    return;
                }

                acessorios[indice] = {
                    id: acessorioEmEdicaoId,
                    ...dadosAcessorio
                };

                alert(
                    "Acessório atualizado com sucesso!"
                );

            } else {

                acessorios.push({
                    id: Date.now(),
                    ...dadosAcessorio
                });

                alert(
                    "Acessório cadastrado com sucesso!"
                );
            }

            salvarAcessorios();
            mostrarAcessorios();
            limparFormularioAcessorio();

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
        }
    );
}

if (botaoLimparFormularioAcessorio) {

    botaoLimparFormularioAcessorio.addEventListener(
        "click",
        limparFormularioAcessorio
    );
}

calcularValorUnitarioAcessorio();
mostrarAcessorios();
limparFormularioAcessorio();
// =========================
// FILAMENTOS
// =========================

let filamentos = [];

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
const CHAVE_PREJUIZOS_FILAMENTOS =
    "organiza3d_prejuizos_filamentos";

let prejuizosFilamentos = [];

try {

    const dadosPrejuizos =
        JSON.parse(
            localStorage.getItem(
                CHAVE_PREJUIZOS_FILAMENTOS
            )
        );

    prejuizosFilamentos =
        Array.isArray(dadosPrejuizos)
            ? dadosPrejuizos
            : [];

} catch (erro) {

    console.error(
        "Não foi possível carregar os prejuízos dos filamentos.",
        erro
    );

    prejuizosFilamentos = [];

}

function salvarPrejuizosFilamentos() {

    localStorage.setItem(
        CHAVE_PREJUIZOS_FILAMENTOS,
        JSON.stringify(
            prejuizosFilamentos
        )
    );

}
const botaoSalvarFilamento =
    document.getElementById(
        "salvar-filamento"
    );

const botaoLimparFormularioFilamento =
    document.getElementById(
        "limpar-formulario-filamento"
    );

const listaFilamentos =
    document.getElementById(
        "lista-filamentos"
    );

const campoFilamentoFabricante =
    document.getElementById(
        "filamento-fabricante"
    );

const campoFilamentoMaterial =
    document.getElementById(
        "filamento-material"
    );

const campoFilamentoCor =
    document.getElementById(
        "filamento-cor"
    );

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
    document.getElementById(
        "filamento-valor"
    );

const campoFilamentoDataCompra =
    document.getElementById(
        "filamento-data-compra"
    );

const campoFilamentoFornecedor =
    document.getElementById(
        "filamento-fornecedor"
    );

const campoFilamentoStatus =
    document.getElementById(
        "filamento-status"
    );

const campoFilamentoObservacoes =
    document.getElementById(
        "filamento-observacoes"
    );


// =========================
// SALVAMENTO
// =========================

function salvarFilamentos() {

    localStorage.setItem(
        "organiza3d_filamentos",
        JSON.stringify(filamentos)
    );
}


// =========================
// CÁLCULOS
// =========================

function calcularPercentualFilamento(
    pesoInicial,
    pesoRestante
) {

    const inicial =
        Number(pesoInicial);

    const restante =
        Number(pesoRestante);

    if (
        Number.isNaN(inicial) ||
        inicial <= 0
    ) {
        return 0;
    }

    const percentual =
        (restante / inicial) * 100;

    return Math.max(
        0,
        Math.min(
            100,
            percentual
        )
    );
}

function definirStatusFilamento(
    pesoInicial,
    pesoRestante
) {

    const inicial =
        Number(pesoInicial);

    const restante =
        Number(pesoRestante);

    if (restante <= 0) {
    return "Inativo";
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

function formatarPercentualFilamento(
    valor
) {

    return `${Number(valor || 0)
        .toLocaleString(
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

    const partes =
        data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function obterDataHojeFilamento() {

    const hoje = new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
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

    const pesoInicial =
        Number(
            campoFilamentoPesoInicial.value ||
            0
        );

    const pesoRestante =
        Number(
            campoFilamentoPesoRestante.value ||
            0
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

        campoFilamentoStatus.value =
            status;
    }
}


// =========================
// RESUMO
// =========================

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

    const totalNovos =
        filamentos.filter(
            function (filamento) {

                return filamento.status ===
                    "Novo";
            }
        ).length;

    const totalEmUso =
        filamentos.filter(
            function (filamento) {

                return filamento.status ===
                    "Em uso";
            }
        ).length;

    const totalBaixo =
        filamentos.filter(
            function (filamento) {

                return filamento.status ===
                    "Baixo estoque";
            }
        ).length;

    const totalFinalizados =
    filamentos.filter(
        function (filamento) {

            return (
                filamento.status ===
                    "Inativo" ||
                filamento.status ===
                    "Finalizado"
            );

        }
    ).length;

    const pesoDisponivel =
    filamentos.reduce(
        function (
            total,
            filamento
        ) {

            if (
                filamento.status ===
                    "Inativo" ||
                filamento.status ===
                    "Finalizado"
            ) {
                return total;
            }

            return total +
                Number(
                    filamento.pesoRestante ||
                    0
                );

        },
        0
    );

    if (campoTotal) {

        campoTotal.textContent =
            filamentos.length;
    }

    if (campoNovos) {

        campoNovos.textContent =
            totalNovos;
    }

    if (campoEmUso) {

        campoEmUso.textContent =
            totalEmUso;
    }

    if (campoBaixo) {

        campoBaixo.textContent =
            totalBaixo;
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


// =========================
// NORMALIZAÇÃO DE DADOS ANTIGOS
// =========================

function normalizarFilamentosAntigos() {

    if (!Array.isArray(filamentos)) {

        filamentos = [];
    }

    filamentos =
        filamentos.map(
            function (
                filamento,
                indice
            ) {

                const pesoInicial =
                    Number(
                        filamento.pesoInicial ||
                        0
                    );

                let pesoRestante =
                    filamento.pesoRestante !==
                    undefined
                        ? Number(
                            filamento.pesoRestante
                        )
                        : pesoInicial;

                if (
                    Number.isNaN(
                        pesoRestante
                    )
                ) {
                    pesoRestante =
                        pesoInicial;
                }

                pesoRestante =
                    Math.max(
                        0,
                        Math.min(
                            pesoInicial,
                            pesoRestante
                        )
                    );

                return {
                    id:
                        filamento.id ||
                        Date.now() + indice,

                    fabricante:
                        filamento.fabricante ||
                        "",

                    material:
                        filamento.material ||
                        filamento.tipo ||
                        "Outro",

                    cor:
                        filamento.cor ||
                        "",

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
                            filamento.valor ||
                            filamento.valorPago ||
                            0
                        ),

                    dataCompra:
                        filamento.dataCompra ||
                        "",

                    fornecedor:
                        filamento.fornecedor ||
                        "",

                    observacoes:
                        filamento.observacoes ||
                        "",

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


// =========================
// LISTAGEM
// =========================

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
const filamentosAtivos =
    filamentos.filter(
        function (filamento) {

            return (
                filamento.status !==
                    "Inativo" &&
                filamento.status !==
                    "Finalizado" &&
                Number(
                    filamento.pesoRestante ||
                    0
                ) > 0
            );

        }
    );

if (filamentosAtivos.length === 0) {

    listaFilamentos.innerHTML =
        "<p>Nenhum filamento ativo cadastrado.</p>";

    atualizarResumoFilamentos();

    return;

}
   listaFilamentos.innerHTML =
    filamentosAtivos
        .map(function (filamento) {

                const percentual =
                    calcularPercentualFilamento(
                        filamento.pesoInicial,
                        filamento.pesoRestante
                    );

                const fabricante =
                    filamento.fabricante
                        ? escaparTexto(
                            filamento.fabricante
                        )
                        : "Não informado";

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
                            ${fabricante}
                        </p>

                        <p>
                            <strong>Peso inicial:</strong>
                            ${Number(
                                filamento.pesoInicial ||
                                0
                            ).toLocaleString(
                                "pt-BR",
                                {
                                    maximumFractionDigits: 1
                                }
                            )} g
                        </p>

                        <p>
                            <strong>Peso restante:</strong>
                            ${Number(
                                filamento.pesoRestante ||
                                0
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

                        <div class="acoes-card">

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

                    </div>
                `;
            })
            .join("");

    atualizarResumoFilamentos();
}


// =========================
// LIMPEZA DO FORMULÁRIO
// =========================

function limparFormularioFilamento() {

    if (campoFilamentoFabricante) {

        campoFilamentoFabricante.value =
            "";
    }

    if (campoFilamentoMaterial) {

        campoFilamentoMaterial.value =
            "";
    }

    if (campoFilamentoCor) {

        campoFilamentoCor.value =
            "";
    }

    if (campoFilamentoPesoInicial) {

        campoFilamentoPesoInicial.value =
            "";
    }

    if (campoFilamentoPesoRestante) {

        campoFilamentoPesoRestante.value =
            "";
    }

    if (campoFilamentoPercentual) {

        campoFilamentoPercentual.value =
            "0%";
    }

    if (campoFilamentoValor) {

        campoFilamentoValor.value =
            "";
    }

    if (campoFilamentoDataCompra) {

        campoFilamentoDataCompra.value =
            obterDataHojeFilamento();
    }

    if (campoFilamentoFornecedor) {

        campoFilamentoFornecedor.value =
            "";
    }

    if (campoFilamentoStatus) {

        campoFilamentoStatus.value =
            "Novo";
    }

    if (campoFilamentoObservacoes) {

        campoFilamentoObservacoes.value =
            "";
    }

    filamentoEmEdicaoId = null;

    if (botaoSalvarFilamento) {

        botaoSalvarFilamento.textContent =
            "Salvar Filamento";
    }
}
// =========================
// EVENTOS DOS CAMPOS
// =========================

if (campoFilamentoPesoInicial) {

    campoFilamentoPesoInicial.addEventListener(
        "input",
        function () {

            const pesoInicial =
                Number(
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


// =========================
// SALVAR / EDITAR
// =========================

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

            const pesoInicial =
                Number(
                    campoFilamentoPesoInicial.value
                );

            const pesoRestante =
                Number(
                    campoFilamentoPesoRestante.value
                );

            const valor =
                Number(
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
                    "Selecione o material."
                );

                return;
            }

            if (!cor) {

                alert(
                    "Informe a cor."
                );

                return;
            }

            if (
                Number.isNaN(pesoInicial) ||
                pesoInicial <= 0
            ) {

                alert(
                    "Peso inicial inválido."
                );

                return;
            }

            if (
                Number.isNaN(pesoRestante) ||
                pesoRestante < 0 ||
                pesoRestante > pesoInicial
            ) {

                alert(
                    "Peso restante inválido."
                );

                return;
            }

            if (
                Number.isNaN(valor) ||
                valor < 0
            ) {

                alert(
                    "Valor inválido."
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

            const objeto = {

                id:
                    filamentoEmEdicaoId ??
                    Date.now(),

                fabricante,

                material,

                cor,

                pesoInicial,

                pesoRestante,

                percentual,

                valor,

                dataCompra,

                fornecedor,

                status,

                observacoes
            };

            if (
                filamentoEmEdicaoId !== null
            ) {

                const indice =
                    filamentos.findIndex(
                        function (f) {

                            return (
                                f.id ===
                                filamentoEmEdicaoId
                            );

                        }
                    );

                if (indice >= 0) {

                    filamentos[indice] =
                        objeto;
                }

            } else {

                filamentos.push(
                    objeto
                );
            }

           const estavaEditando =
    filamentoEmEdicaoId !== null;

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
    estavaEditando
        ? "Filamento atualizado com sucesso!"
        : "Filamento cadastrado com sucesso!"
);

        }
    );
}


// =========================
// EDITAR
// =========================

window.editarFilamento =
function (id) {

    const filamento =
        filamentos.find(
            function (item) {

                return item.id === id;

            }
        );

    if (!filamento) {

        return;
    }

    filamentoEmEdicaoId = id;

    campoFilamentoFabricante.value =
        filamento.fabricante;

    campoFilamentoMaterial.value =
        filamento.material;

    campoFilamentoCor.value =
        filamento.cor;

    campoFilamentoPesoInicial.value =
        filamento.pesoInicial;

    campoFilamentoPesoRestante.value =
        filamento.pesoRestante;

    campoFilamentoValor.value =
        filamento.valor;

    campoFilamentoDataCompra.value =
        filamento.dataCompra;

    campoFilamentoFornecedor.value =
        filamento.fornecedor;

    campoFilamentoObservacoes.value =
        filamento.observacoes;

    atualizarCalculosFormularioFilamento();

    botaoSalvarFilamento.textContent =
        "Salvar Alterações";
};


// =========================
// REGISTRAR CONSUMO
// =========================

window.registrarConsumoFilamento =
function (id) {

    const filamento =
        filamentos.find(
            function (item) {

                return item.id === id;

            }
        );

    if (!filamento) {

        return;
    }

    const resposta =
        prompt(
            "Quantos gramas foram utilizados?"
        );

    if (resposta === null) {

        return;
    }

    const consumo =
        Number(
            resposta.replace(",", ".")
        );

    if (
        Number.isNaN(consumo) ||
        consumo <= 0
    ) {

        alert(
            "Quantidade inválida."
        );

        return;
    }

    if (
        consumo >
        filamento.pesoRestante
    ) {

        alert(
            "Quantidade maior que o estoque."
        );

        return;
    }

    filamento.pesoRestante -=
        consumo;

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
        "Consumo registrado."
    );

};


// =========================
// EXCLUIR
// =========================

window.excluirFilamento =
function (id) {

    if (
        !confirm(
            "Deseja excluir este filamento?"
        )
    ) {

        return;
    }

    filamentos =
        filamentos.filter(
            function (item) {

                return item.id !== id;

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


// =========================
// BOTÃO LIMPAR
// =========================

if (
    botaoLimparFormularioFilamento
) {

    botaoLimparFormularioFilamento
        .addEventListener(
            "click",
            limparFormularioFilamento
        );
}


// =========================
// INICIALIZAÇÃO
// =========================

normalizarFilamentosAntigos();

mostrarFilamentos();

limparFormularioFilamento();

// =========================
// EMBALAGENS
// =========================

let embalagens = [];

try {

    const dadosEmbalagens =
        JSON.parse(
            localStorage.getItem(
                "organiza3d_embalagens"
            )
        );

    embalagens =
        Array.isArray(dadosEmbalagens)
            ? dadosEmbalagens
            : [];

} catch (erro) {

    console.error(
        "Não foi possível carregar as embalagens.",
        erro
    );

    embalagens = [];
}

let embalagemEmEdicaoId = null;

const campoEmbalagemNome =
    document.getElementById(
        "embalagem-nome"
    );

const campoEmbalagemCategoria =
    document.getElementById(
        "embalagem-categoria"
    );

const campoEmbalagemQuantidade =
    document.getElementById(
        "embalagem-quantidade"
    );

const campoEmbalagemEstoqueMinimo =
    document.getElementById(
        "embalagem-estoque-minimo"
    );

const campoEmbalagemValorCompra =
    document.getElementById(
        "embalagem-valor-compra"
    );

const campoEmbalagemValorUnitario =
    document.getElementById(
        "embalagem-valor-unitario"
    );

const campoEmbalagemDataCompra =
    document.getElementById(
        "embalagem-data-compra"
    );

const campoEmbalagemFornecedor =
    document.getElementById(
        "embalagem-fornecedor"
    );

const campoEmbalagemObservacoes =
    document.getElementById(
        "embalagem-observacoes"
    );

const botaoSalvarEmbalagem =
    document.getElementById(
        "salvar-embalagem"
    );

const botaoLimparFormularioEmbalagem =
    document.getElementById(
        "limpar-formulario-embalagem"
    );

const listaEmbalagens =
    document.getElementById(
        "lista-embalagens"
    );

function salvarEmbalagens() {

    localStorage.setItem(
        "organiza3d_embalagens",
        JSON.stringify(
            embalagens
        )
    );

}

function calcularValorUnitarioEmbalagem() {

    if (
        !campoEmbalagemQuantidade ||
        !campoEmbalagemValorCompra ||
        !campoEmbalagemValorUnitario
    ) {
        return;
    }

    const quantidade =
        Number(
            campoEmbalagemQuantidade.value ||
            0
        );

    const valorCompra =
        Number(
            campoEmbalagemValorCompra.value ||
            0
        );

    const valorUnitario =
        quantidade > 0
            ? valorCompra / quantidade
            : 0;

    campoEmbalagemValorUnitario.value =
        valorUnitario.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 4,
                maximumFractionDigits: 4
            }
        );

}
// =========================
// LISTAGEM DAS EMBALAGENS
// =========================

function mostrarEmbalagens() {

    if (!listaEmbalagens) {
        return;
    }

    if (embalagens.length === 0) {

        listaEmbalagens.innerHTML =
            "<p>Nenhuma embalagem cadastrada.</p>";

        return;
    }

    listaEmbalagens.innerHTML =
        embalagens
            .map(function (embalagem) {

                const dataCompra =
                    embalagem.dataCompra
                        ? embalagem.dataCompra
                            .split("-")
                            .reverse()
                            .join("/")
                        : "Não informada";

                const valorUnitario =
                    Number(
                        embalagem.valorUnitario || 0
                    ).toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL",
                            minimumFractionDigits: 4,
                            maximumFractionDigits: 4
                        }
                    );

                return `
                    <div class="card-item">

                        <h4>
                            ${escaparTexto(
                                embalagem.nome
                            )}
                        </h4>

                        <p>
                            <strong>Categoria:</strong>
                            ${escaparTexto(
                                embalagem.categoria ||
                                "Não informada"
                            )}
                        </p>

                        <p>
                            <strong>Quantidade:</strong>
                            ${Number(
                                embalagem.quantidade || 0
                            )}
                        </p>

                        <p>
                            <strong>Estoque mínimo:</strong>
                            ${Number(
                                embalagem.estoqueMinimo || 0
                            )}
                        </p>

                        <p>
                            <strong>Valor da compra:</strong>
                            ${formatarDinheiro(
                                embalagem.valorCompra
                            )}
                        </p>

                        <p>
                            <strong>Valor unitário:</strong>
                            ${valorUnitario}
                        </p>

                        <p>
                            <strong>Data da compra:</strong>
                            ${dataCompra}
                        </p>

                        <p>
                            <strong>Fornecedor:</strong>
                            ${escaparTexto(
                                embalagem.fornecedor ||
                                "Não informado"
                            )}
                        </p>

                        <p>
                            <strong>Observações:</strong>
                            ${escaparTexto(
                                embalagem.observacoes ||
                                "Nenhuma"
                            )}
                        </p>

                        <div class="acoes-card">

                            <button
                                type="button"
                                class="botao-principal"
                                onclick="editarEmbalagem(
                                    ${embalagem.id}
                                )">
                                Editar
                            </button>

                            <button
                                type="button"
                                class="botao-excluir"
                                onclick="excluirEmbalagem(
                                    ${embalagem.id}
                                )">
                                Excluir
                            </button>

                        </div>

                    </div>
                `;
            })
            .join("");
}


// =========================
// LIMPEZA DO FORMULÁRIO
// =========================

function limparFormularioEmbalagem() {

    if (campoEmbalagemNome) {

        campoEmbalagemNome.value =
            "";
    }

    if (campoEmbalagemCategoria) {

        campoEmbalagemCategoria.value =
            "";
    }

    if (campoEmbalagemQuantidade) {

        campoEmbalagemQuantidade.value =
            "";
    }

    if (campoEmbalagemEstoqueMinimo) {

        campoEmbalagemEstoqueMinimo.value =
            "";
    }

    if (campoEmbalagemValorCompra) {

        campoEmbalagemValorCompra.value =
            "";
    }

    if (campoEmbalagemValorUnitario) {

        campoEmbalagemValorUnitario.value =
            "R$ 0,0000";
    }

    if (campoEmbalagemDataCompra) {

        campoEmbalagemDataCompra.value =
            "";
    }

    if (campoEmbalagemFornecedor) {

        campoEmbalagemFornecedor.value =
            "";
    }

    if (campoEmbalagemObservacoes) {

        campoEmbalagemObservacoes.value =
            "";
    }

    embalagemEmEdicaoId = null;

    if (botaoSalvarEmbalagem) {

        botaoSalvarEmbalagem.textContent =
            "Salvar Embalagem";
    }
}


// =========================
// EDITAR EMBALAGEM
// =========================

window.editarEmbalagem =
function (id) {

    const embalagem =
        embalagens.find(
            function (item) {

                return item.id === id;
            }
        );

    if (!embalagem) {

        alert(
            "Embalagem não encontrada."
        );

        return;
    }

    embalagemEmEdicaoId = id;

    if (campoEmbalagemNome) {

        campoEmbalagemNome.value =
            embalagem.nome || "";
    }

    if (campoEmbalagemCategoria) {

        campoEmbalagemCategoria.value =
            embalagem.categoria || "";
    }

    if (campoEmbalagemQuantidade) {

        campoEmbalagemQuantidade.value =
            embalagem.quantidade || "";
    }

    if (campoEmbalagemEstoqueMinimo) {

        campoEmbalagemEstoqueMinimo.value =
            embalagem.estoqueMinimo || "";
    }

    if (campoEmbalagemValorCompra) {

        campoEmbalagemValorCompra.value =
            embalagem.valorCompra || "";
    }

    if (campoEmbalagemDataCompra) {

        campoEmbalagemDataCompra.value =
            embalagem.dataCompra || "";
    }

    if (campoEmbalagemFornecedor) {

        campoEmbalagemFornecedor.value =
            embalagem.fornecedor || "";
    }

    if (campoEmbalagemObservacoes) {

        campoEmbalagemObservacoes.value =
            embalagem.observacoes || "";
    }

    calcularValorUnitarioEmbalagem();

    if (botaoSalvarEmbalagem) {

        botaoSalvarEmbalagem.textContent =
            "Atualizar Embalagem";
    }

    abrirAbaFilamento(
        "aba-embalagens"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};


// =========================
// EXCLUIR EMBALAGEM
// =========================

window.excluirEmbalagem =
function (id) {

    const embalagemEncontrada =
        embalagens.find(
            function (embalagem) {

                return embalagem.id === id;
            }
        );

    if (!embalagemEncontrada) {

        alert(
            "Embalagem não encontrada."
        );

        return;
    }

    const confirmar =
        confirm(
            `Tem certeza que deseja excluir "${embalagemEncontrada.nome}"?`
        );

    if (!confirmar) {
        return;
    }

    embalagens =
        embalagens.filter(
            function (embalagem) {

                return embalagem.id !== id;
            }
        );

    salvarEmbalagens();

    mostrarEmbalagens();

    if (
        embalagemEmEdicaoId === id
    ) {

        limparFormularioEmbalagem();
    }

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
// EVENTOS
// =========================

[
    campoEmbalagemQuantidade,
    campoEmbalagemValorCompra
].forEach(function (campo) {

    if (campo) {

        campo.addEventListener(
            "input",
            calcularValorUnitarioEmbalagem
        );

    }

});


// =========================
// SALVAR EMBALAGEM
// =========================

if (botaoSalvarEmbalagem) {

    botaoSalvarEmbalagem.addEventListener(
        "click",
        function () {

            const nome =
                campoEmbalagemNome.value.trim();

            const categoria =
                campoEmbalagemCategoria.value;

            const quantidade =
                Number(
                    campoEmbalagemQuantidade.value
                );

            const estoqueMinimo =
                Number(
                    campoEmbalagemEstoqueMinimo.value
                );

            const valorCompra =
                Number(
                    campoEmbalagemValorCompra.value
                );

            const valorUnitario =
                quantidade > 0
                    ? valorCompra / quantidade
                    : 0;

            const dataCompra =
                campoEmbalagemDataCompra.value;

            const fornecedor =
                campoEmbalagemFornecedor.value.trim();

            const observacoes =
                campoEmbalagemObservacoes.value.trim();

            if (!nome) {

                alert(
                    "Informe o nome da embalagem."
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
                    "Quantidade inválida."
                );

                return;

            }

            if (
                Number.isNaN(estoqueMinimo) ||
                estoqueMinimo < 0
            ) {

                alert(
                    "Estoque mínimo inválido."
                );

                return;

            }

            if (
                Number.isNaN(valorCompra) ||
                valorCompra < 0
            ) {

                alert(
                    "Valor inválido."
                );

                return;

            }

            const dados = {

                nome,
                categoria,
                quantidade,
                estoqueMinimo,
                valorCompra,
                valorUnitario,
                dataCompra,
                fornecedor,
                observacoes

            };

            const estavaEditando =
                embalagemEmEdicaoId !== null;

            if (estavaEditando) {

                const indice =
                    embalagens.findIndex(
                        function (item) {

                            return (
                                item.id ===
                                embalagemEmEdicaoId
                            );

                        }
                    );

                if (indice >= 0) {

                    embalagens[indice] = {

                        id:
                            embalagemEmEdicaoId,

                        ...dados

                    };

                }

            } else {

                embalagens.push({

                    id: Date.now(),

                    ...dados

                });

            }

            salvarEmbalagens();

            mostrarEmbalagens();

            limparFormularioEmbalagem();

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
                estavaEditando
                    ? "Embalagem atualizada com sucesso!"
                    : "Embalagem cadastrada com sucesso!"
            );

        }

    );

}


// =========================
// BOTÃO LIMPAR
// =========================

if (
    botaoLimparFormularioEmbalagem
) {

    botaoLimparFormularioEmbalagem
        .addEventListener(
            "click",
            limparFormularioEmbalagem
        );

}


// =========================
// INICIALIZAÇÃO
// =========================

calcularValorUnitarioEmbalagem();
mostrarEmbalagens();
limparFormularioEmbalagem();
}