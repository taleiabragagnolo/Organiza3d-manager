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