// =========================
// EQUIPAMENTOS 2.0
// =========================
function iniciarEquipamento() {

let impressoras = carregarListaEquipamentos(
    "organiza3d_impressoras"
);

let pecasEquipamentos = carregarListaEquipamentos(
    "organiza3d_pecas"
);

let lubrificantesEquipamentos = carregarListaEquipamentos(
    "organiza3d_lubrificantes"
);

let manutencoesEquipamentos = carregarListaEquipamentos(
    "organiza3d_manutencoes"
);

let registrosHorasEquipamentos = carregarListaEquipamentos(
    "organiza3d_horas_equipamentos"
);

let diarioEquipamentos = carregarListaEquipamentos(
    "organiza3d_diario_equipamentos"
);

let impressoraEmEdicaoId = null;
let pecaEmEdicaoId = null;
let lubrificanteEmEdicaoId = null;
let manutencaoEmEdicaoId = null;

function carregarListaEquipamentos(chave) {
    try {
        const dados = JSON.parse(
            localStorage.getItem(chave)
        );

        return Array.isArray(dados)
            ? dados
            : [];
    } catch (erro) {
        console.error(
            `Não foi possível carregar ${chave}.`,
            erro
        );

        return [];
    }
}

function salvarListaEquipamentos(
    chave,
    lista
) {
    localStorage.setItem(
        chave,
        JSON.stringify(lista)
    );
}

function obterDataHojeEquipamentos() {
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

function formatarDataEquipamentos(data) {
    if (!data) {
        return "Não informada";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarHorasEquipamentos(horas) {
    const total = Number(horas || 0);

    const sinal = total < 0
        ? "-"
        : "";

    const valorAbsoluto = Math.abs(total);

    let horasInteiras = Math.floor(
        valorAbsoluto
    );

    let minutos = Math.round(
        (valorAbsoluto - horasInteiras) * 60
    );

    if (minutos >= 60) {
        horasInteiras += 1;
        minutos = 0;
    }

    if (minutos === 0) {
        return `${sinal}${horasInteiras}h`;
    }

    return `${sinal}${horasInteiras}h ${minutos}min`;
}

function definirTextoEquipamentos(
    id,
    valor
) {
    const campo = document.getElementById(id);

    if (campo) {
        campo.textContent = valor;
    }
}

function obterNumeroCampoEquipamentos(id) {
    const campo = document.getElementById(id);

    if (!campo) {
        return 0;
    }

    return Number(
        String(campo.value || "0")
            .replace(",", ".")
    );
}

function obterTextoCampoEquipamentos(id) {
    const campo = document.getElementById(id);

    return campo
        ? campo.value.trim()
        : "";
}

function definirValorCampoEquipamentos(
    id,
    valor
) {
    const campo = document.getElementById(id);

    if (campo) {
        campo.value = valor;
    }
}

function obterTotalHorasImpressora(impressora) {
    return Math.max(
        0,
        Number(impressora.horasIniciais || 0) +
        Number(impressora.horasProducoes || 0) +
        Number(impressora.horasAjustes || 0)
    );
}

function salvarImpressoras() {
    salvarListaEquipamentos(
        "organiza3d_impressoras",
        impressoras
    );
}

function salvarPecasEquipamentos() {
    salvarListaEquipamentos(
        "organiza3d_pecas",
        pecasEquipamentos
    );
}

function salvarLubrificantesEquipamentos() {
    salvarListaEquipamentos(
        "organiza3d_lubrificantes",
        lubrificantesEquipamentos
    );
}

function salvarManutencoesEquipamentos() {
    salvarListaEquipamentos(
        "organiza3d_manutencoes",
        manutencoesEquipamentos
    );
}

function salvarRegistrosHorasEquipamentos() {
    salvarListaEquipamentos(
        "organiza3d_horas_equipamentos",
        registrosHorasEquipamentos
    );
}

function salvarDiarioEquipamentos() {
    salvarListaEquipamentos(
        "organiza3d_diario_equipamentos",
        diarioEquipamentos
    );
}

function registrarDiarioEquipamento(dados) {
    diarioEquipamentos.push({
        id: Date.now() + Math.random(),

        data:
            dados.data ||
            obterDataHojeEquipamentos(),

        impressoraId:
            dados.impressoraId || null,

        impressoraNome:
            dados.impressoraNome || "Geral",

        tipo:
            dados.tipo || "Outro",

        titulo:
            dados.titulo || "Ocorrência",

        descricao:
            dados.descricao || ""
    });

    salvarDiarioEquipamentos();
    mostrarDiarioEquipamentos();
}


// =========================
// ABAS
// =========================

const botoesAbasEquipamentos =
    document.querySelectorAll(
        ".aba-equipamento"
    );

const conteudosAbasEquipamentos =
    document.querySelectorAll(
        ".conteudo-aba-equipamento"
    );

function abrirAbaEquipamento(idAba) {
    conteudosAbasEquipamentos.forEach(
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

    botoesAbasEquipamentos.forEach(
        function (botao) {
            const ativo =
                botao.dataset.abaEquipamento ===
                idAba;

            botao.classList.toggle(
                "botao-principal",
                ativo
            );
        }
    );
}

botoesAbasEquipamentos.forEach(
    function (botao) {
        botao.addEventListener(
            "click",
            function () {
                abrirAbaEquipamento(
                    botao.dataset.abaEquipamento
                );
            }
        );
    }
);


// =========================
// NORMALIZAÇÃO DOS DADOS
// =========================

function normalizarDadosEquipamentos() {
    impressoras = impressoras.map(
        function (impressora, indice) {
            return {
                id:
                    impressora.id ||
                    Date.now() + indice,

                nome:
                    impressora.nome || "",

                marca:
                    impressora.marca || "",

                modelo:
                    impressora.modelo || "",

                serie:
                    impressora.serie || "",

                dataCompra:
                    impressora.dataCompra || "",

                valor:
                Number(
                  impressora.valor || 0
    ),

potenciaWatts:
    Number(
        impressora.potenciaWatts || 0
    ),

tarifaEnergia:
    Number(
        impressora.tarifaEnergia || 0
    ),

custoHoraImpressora:
    Number(
        impressora.custoHoraImpressora || 0
    ),

status:
    impressora.status || "Ativa",

                horasIniciais:
                    Number(
                        impressora.horasIniciais ??
                        impressora.horasUso ??
                        impressora.horas ??
                        0
                    ),

                horasProducoes:
                    Number(
                        impressora.horasProducoes || 0
                    ),

                horasAjustes:
                    Number(
                        impressora.horasAjustes || 0
                    ),

                ultimaManutencao:
                    impressora.ultimaManutencao || "",

                proximaManutencao:
                    impressora.proximaManutencao || "",

                proximasHorasManutencao:
                    Number(
                        impressora.proximasHorasManutencao ||
                        0
                    ),

                observacoes:
                    impressora.observacoes || ""
            };
        }
    );

    pecasEquipamentos = pecasEquipamentos.map(
        function (peca, indice) {
            const quantidadeInicial = Number(
                peca.quantidadeInicial ??
                peca.quantidadeComprada ??
                peca.quantidade ??
                0
            );

            const quantidadeAtual = Number(
                peca.quantidadeAtual ??
                peca.quantidade ??
                quantidadeInicial
            );

            return {
                id:
                    peca.id ||
                    Date.now() + indice + 1000,

                nome:
                    peca.nome || "",

                categoria:
                    peca.categoria || "Outro",

                marca:
                    peca.marca || "",

                codigo:
                    peca.codigo || "",

                quantidadeInicial:
                    quantidadeInicial,

                quantidadeAtual:
                    quantidadeAtual,

                estoqueMinimo:
                    Number(
                        peca.estoqueMinimo || 0
                    ),

                valorTotal:
                    Number(
                        peca.valorTotal || 0
                    ),

                valorUnitario:
                    Number(
                        peca.valorUnitario ||
                        (
                            quantidadeInicial > 0
                                ? Number(
                                    peca.valorTotal || 0
                                ) / quantidadeInicial
                                : 0
                        )
                    ),

                dataCompra:
                    peca.dataCompra || "",

                fornecedor:
                    peca.fornecedor || "",

                compatibilidade:
                    peca.compatibilidade || "",

                observacoes:
                    peca.observacoes || ""
            };
        }
    );

    lubrificantesEquipamentos =
        lubrificantesEquipamentos.map(
            function (item, indice) {
                const quantidadeInicial = Number(
                    item.quantidadeInicial ??
                    item.quantidadeComprada ??
                    item.quantidade ??
                    0
                );

                const quantidadeAtual = Number(
                    item.quantidadeAtual ??
                    item.quantidade ??
                    quantidadeInicial
                );

                return {
                    id:
                        item.id ||
                        Date.now() + indice + 2000,

                    nome:
                        item.nome || "",

                    tipo:
                        item.tipo || "Outro",

                    marca:
                        item.marca || "",

                    unidade:
                        item.unidade || "Unidade",

                    quantidadeInicial:
                        quantidadeInicial,

                    quantidadeAtual:
                        quantidadeAtual,

                    estoqueMinimo:
                        Number(
                            item.estoqueMinimo || 0
                        ),

                    valorTotal:
                        Number(
                            item.valorTotal || 0
                        ),

                    valorUnitario:
                        Number(
                            item.valorUnitario ||
                            (
                                quantidadeInicial > 0
                                    ? Number(
                                        item.valorTotal || 0
                                    ) / quantidadeInicial
                                    : 0
                            )
                        ),

                    dataCompra:
                        item.dataCompra || "",

                    fornecedor:
                        item.fornecedor || "",

                    aplicacao:
                        item.aplicacao || "",

                    observacoes:
                        item.observacoes || ""
                };
            }
        );

    manutencoesEquipamentos =
        manutencoesEquipamentos.map(
            function (item, indice) {
                return {
                    id:
                        item.id ||
                        Date.now() + indice + 3000,

                    impressoraId:
                        item.impressoraId || null,

                    impressoraNome:
                        item.impressoraNome || "",

                    tipo:
                        item.tipo || "Outra",

                    data:
                        item.data || "",

                    horasImpressora:
                        Number(
                            item.horasImpressora || 0
                        ),

                    descricao:
                        item.descricao || "",

                    pecaId:
                        item.pecaId || null,

                    pecaNome:
                        item.pecaNome || "",

                    quantidadePeca:
                        Number(
                            item.quantidadePeca || 0
                        ),

                    custoPeca:
                        Number(
                            item.custoPeca || 0
                        ),

                    lubrificanteId:
                        item.lubrificanteId || null,

                    lubrificanteNome:
                        item.lubrificanteNome || "",

                    quantidadeLubrificante:
                        Number(
                            item.quantidadeLubrificante || 0
                        ),

                    custoLubrificante:
                        Number(
                            item.custoLubrificante || 0
                        ),

                    custoServico:
                        Number(
                            item.custoServico || 0
                        ),

                    custoTotal:
                        Number(
                            item.custoTotal || 0
                        ),

                    responsavel:
                        item.responsavel || "",

                    proximaData:
                        item.proximaData || "",

                    proximasHoras:
                        Number(
                            item.proximasHoras || 0
                        ),

                    observacoes:
                        item.observacoes || ""
                };
            }
        );

    registrosHorasEquipamentos =
        registrosHorasEquipamentos.map(
            function (item, indice) {
                return {
                    id:
                        item.id ||
                        Date.now() + indice + 4000,

                    impressoraId:
                        item.impressoraId || null,

                    impressoraNome:
                        item.impressoraNome || "",

                    data:
                        item.data || "",

                    horas:
                        Number(
                            item.horas || 0
                        ),

                    motivo:
                        item.motivo || "Outro",

                    observacoes:
                        item.observacoes || "",

                    origem:
                        item.origem || "Manual"
                };
            }
        );

    salvarImpressoras();
    salvarPecasEquipamentos();
    salvarLubrificantesEquipamentos();
    salvarManutencoesEquipamentos();
    salvarRegistrosHorasEquipamentos();
}
// =========================
// IMPRESSORAS
// =========================

const botaoSalvarImpressora =
    document.getElementById(
        "salvar-impressora"
    );

const botaoLimparFormularioImpressora =
    document.getElementById(
        "limpar-formulario-impressora"
    );

const listaImpressoras =
    document.getElementById(
        "lista-impressoras"
    );


function atualizarResumoImpressoras() {

    const ativas = impressoras.filter(
        function (impressora) {

            return impressora.status === "Ativa";

        }
    ).length;


    const emManutencao = impressoras.filter(
        function (impressora) {

            return impressora.status ===
                "Em manutenção";

        }
    ).length;


    const totalHoras = impressoras.reduce(
        function (total, impressora) {

            return total +
                obterTotalHorasImpressora(
                    impressora
                );

        },
        0
    );


    definirTextoEquipamentos(
        "total-impressoras",
        impressoras.length
    );


    definirTextoEquipamentos(
        "equipamentos-total-impressoras",
        impressoras.length
    );


    definirTextoEquipamentos(
        "equipamentos-impressoras-ativas",
        ativas
    );


    definirTextoEquipamentos(
        "equipamentos-impressoras-manutencao",
        emManutencao
    );


    definirTextoEquipamentos(
        "equipamentos-total-horas",
        formatarHorasEquipamentos(
            totalHoras
        )
    );


    definirTextoEquipamentos(
        "relatorio-impressoras",
        impressoras.length
    );


    definirTextoEquipamentos(
        "relatorio-impressoras-ativas",
        ativas
    );

}


function mostrarImpressoras() {

    if (!listaImpressoras) {

        atualizarResumoImpressoras();

        return;

    }


    if (impressoras.length === 0) {

        listaImpressoras.innerHTML =
            "<p>Nenhuma impressora cadastrada.</p>";


        atualizarResumoImpressoras();


        if (
            typeof atualizarOpcoesEquipamentos ===
            "function"
        ) {

            atualizarOpcoesEquipamentos();

        }

        return;

    }


    listaImpressoras.innerHTML =
        impressoras.map(
            function (impressora) {

                const horasTotais =
                    obterTotalHorasImpressora(
                        impressora
                    );


                const proximaManutencaoHoras =
                    Number(
                        impressora
                            .proximasHorasManutencao ||
                        0
                    );


                let avisoManutencao = "";


                if (
                    proximaManutencaoHoras > 0 &&
                    horasTotais >=
                        proximaManutencaoHoras
                ) {

                    avisoManutencao = `
                        <p>
                            <strong>
                                ⚠️ Manutenção por horas:
                            </strong>
                            Vencida
                        </p>
                    `;

                } else if (
                    proximaManutencaoHoras > 0
                ) {

                    const horasRestantes =
                        proximaManutencaoHoras -
                        horasTotais;


                    avisoManutencao = `
                        <p>
                            <strong>
                                Próxima manutenção em:
                            </strong>

                            ${formatarHorasEquipamentos(
                                horasRestantes
                            )}
                        </p>
                    `;

                }


                return `
                    <div class="card-item">

                        <h4>
                            ${escaparTexto(
                                impressora.nome
                            )}
                        </h4>

                        <p>
                            <strong>Marca:</strong>

                            ${escaparTexto(
                                impressora.marca ||
                                "Não informada"
                            )}
                        </p>

                        <p>
                            <strong>Modelo:</strong>

                            ${escaparTexto(
                                impressora.modelo ||
                                "Não informado"
                            )}
                        </p>

                        <p>
                            <strong>
                                Número de série:
                            </strong>

                            ${escaparTexto(
                                impressora.serie ||
                                "Não informado"
                            )}
                        </p>

                        <p>
                            <strong>
                                Data da compra:
                            </strong>

                            ${formatarDataEquipamentos(
                                impressora.dataCompra
                            )}
                        </p>

                        <p>
                            <strong>
                                Valor pago:
                            </strong>

                            ${formatarDinheiro(
                                impressora.valor
                            )}
                        </p>

                        <p>
                            <strong>Status:</strong>

                            ${escaparTexto(
                                impressora.status
                            )}
                        </p>

                        <p>
                            <strong>
                                Horas iniciais:
                            </strong>

                            ${formatarHorasEquipamentos(
                                impressora
                                    .horasIniciais
                            )}
                        </p>

                        <p>
                            <strong>
                                Horas de produções:
                            </strong>

                            ${formatarHorasEquipamentos(
                                impressora
                                    .horasProducoes
                            )}
                        </p>

                        <p>
                            <strong>
                                Ajustes manuais:
                            </strong>

                            ${formatarHorasEquipamentos(
                                impressora
                                    .horasAjustes
                            )}
                        </p>

                        <p>
                            <strong>
                                Total de horas:
                            </strong>

                            ${formatarHorasEquipamentos(
                                horasTotais
                            )}
                        </p>

                        <p>
                            <strong>
                                Última manutenção:
                            </strong>

                            ${formatarDataEquipamentos(
                                impressora
                                    .ultimaManutencao
                            )}
                        </p>

                        <p>
                            <strong>
                                Próxima manutenção:
                            </strong>

                            ${formatarDataEquipamentos(
                                impressora
                                    .proximaManutencao
                            )}
                        </p>

                        <p>
                            <strong>
                                Próxima manutenção
                                por horas:
                            </strong>

                            ${
                                proximaManutencaoHoras > 0
                                    ? formatarHorasEquipamentos(
                                        proximaManutencaoHoras
                                    )
                                    : "Não informada"
                            }
                        </p>

                        ${avisoManutencao}

                        <p>
                            <strong>
                                Observações:
                            </strong>

                            ${escaparTexto(
                                impressora.observacoes ||
                                "Nenhuma"
                            )}
                        </p>

                        <button
                            type="button"
                            class="botao-principal"
                            onclick="editarImpressora(${impressora.id})">

                            Editar

                        </button>

                        <button
                            type="button"
                            onclick="alterarStatusImpressora(${impressora.id})">

                            Alterar Status

                        </button>

                        <button
                            type="button"
                            class="botao-excluir"
                            onclick="excluirImpressora(${impressora.id})">

                            Excluir

                        </button>

                    </div>
                `;

            }
        ).join("");


    atualizarResumoImpressoras();


    if (
        typeof atualizarOpcoesEquipamentos ===
        "function"
    ) {

        atualizarOpcoesEquipamentos();

    }

}


function limparFormularioImpressora() {

    impressoraEmEdicaoId = null;


    definirValorCampoEquipamentos(
        "nome-impressora",
        ""
    );


    definirValorCampoEquipamentos(
        "marca-impressora",
        ""
    );


    definirValorCampoEquipamentos(
        "modelo-impressora",
        ""
    );


    definirValorCampoEquipamentos(
        "serie-impressora",
        ""
    );


    definirValorCampoEquipamentos(
        "data-compra-impressora",
        ""
    );


    definirValorCampoEquipamentos(
        "valor-impressora",
        ""
    );
    definirValorCampoEquipamentos(
    "potencia-impressora",
    ""
    );

    definirValorCampoEquipamentos(
    "tarifa-energia-impressora",
    ""
    );

    definirValorCampoEquipamentos(
      "custo-hora-impressora",
      ""
    );

    definirValorCampoEquipamentos(
        "status-impressora",
        "Ativa"
    );


    definirValorCampoEquipamentos(
        "horas-iniciais-impressora",
        ""
    );


    definirValorCampoEquipamentos(
        "ultima-manutencao-impressora",
        ""
    );


    definirValorCampoEquipamentos(
        "proxima-manutencao-impressora",
        ""
    );


    definirValorCampoEquipamentos(
        "observacoes-impressora",
        ""
    );


    if (botaoSalvarImpressora) {

        botaoSalvarImpressora.textContent =
            "Salvar Impressora";

    }

}


if (botaoSalvarImpressora) {

    botaoSalvarImpressora.addEventListener(
        "click",
        function () {

            const nome =
                obterTextoCampoEquipamentos(
                    "nome-impressora"
                );


            const marca =
                obterTextoCampoEquipamentos(
                    "marca-impressora"
                );


            const modelo =
                obterTextoCampoEquipamentos(
                    "modelo-impressora"
                );


            const serie =
                obterTextoCampoEquipamentos(
                    "serie-impressora"
                );


            const dataCompra =
                obterTextoCampoEquipamentos(
                    "data-compra-impressora"
                );


            const valor =
                obterNumeroCampoEquipamentos(
                    "valor-impressora"
                );
                const potenciaWatts =
    obterNumeroCampoEquipamentos(
        "potencia-impressora"
    );

const tarifaEnergia =
    obterNumeroCampoEquipamentos(
        "tarifa-energia-impressora"
    );

const custoHoraImpressora =
    obterNumeroCampoEquipamentos(
        "custo-hora-impressora"
    );

            const status =
                obterTextoCampoEquipamentos(
                    "status-impressora"
                ) || "Ativa";


            const horasIniciais =
                obterNumeroCampoEquipamentos(
                    "horas-iniciais-impressora"
                );


            const ultimaManutencao =
                obterTextoCampoEquipamentos(
                    "ultima-manutencao-impressora"
                );


            const proximaManutencao =
                obterTextoCampoEquipamentos(
                    "proxima-manutencao-impressora"
                );


            const observacoes =
                obterTextoCampoEquipamentos(
                    "observacoes-impressora"
                );


            if (!nome) {

                alert(
                    "Informe o nome da impressora."
                );

                return;

            }


            if (!marca) {

                alert(
                    "Informe a marca da impressora."
                );

                return;

            }


            if (!modelo) {

                alert(
                    "Informe o modelo da impressora."
                );

                return;

            }


            if (
                Number.isNaN(valor) ||
                valor < 0
            ) {

                alert(
                    "Informe um valor pago válido."
                );

                return;

            }


            if (
                Number.isNaN(horasIniciais) ||
                horasIniciais < 0
            ) {

                alert(
                    "Informe uma quantidade válida de horas iniciais."
                );

                return;

            }


            if (
                ultimaManutencao &&
                proximaManutencao &&
                proximaManutencao <
                    ultimaManutencao
            ) {

                alert(
                    "A próxima manutenção não pode ser anterior à última manutenção."
                );

                return;

            }


            const estavaEditando =
                impressoraEmEdicaoId !== null;


            if (estavaEditando) {

                const impressora =
                    impressoras.find(
                        function (item) {

                            return item.id ===
                                impressoraEmEdicaoId;

                        }
                    );


                if (!impressora) {

                    alert(
                        "Impressora não encontrada."
                    );

                    return;

                }


                impressora.nome = nome;

                impressora.marca = marca;

                impressora.modelo = modelo;

                impressora.serie = serie;

                impressora.dataCompra =
                    dataCompra;

                impressora.valor = valor;
               
                impressora.potenciaWatts =
                     potenciaWatts;

                impressora.tarifaEnergia =
                   tarifaEnergia;

                impressora.custoHoraImpressora =
                    custoHoraImpressora;

                impressora.status = status;

                impressora.horasIniciais =
                    horasIniciais;

                impressora.ultimaManutencao =
                    ultimaManutencao;

                impressora.proximaManutencao =
                    proximaManutencao;

                impressora.observacoes =
                    observacoes;


                registrarDiarioEquipamento({

                    impressoraId:
                        impressora.id,

                    impressoraNome:
                        impressora.nome,

                    tipo:
                        "Cadastro",

                    titulo:
                        "Cadastro atualizado",

                    descricao:
                        "Os dados da impressora foram atualizados."

                });

            } else {

                const novaImpressora = {

                    id:
                        Date.now(),

                    nome:
                        nome,

                    marca:
                        marca,

                    modelo:
                        modelo,

                    serie:
                        serie,

                    dataCompra:
                        dataCompra,

                    valor:
                         valor,

                    potenciaWatts:
                        potenciaWatts,

                    tarifaEnergia:
                        tarifaEnergia,

                    custoHoraImpressora:
                        custoHoraImpressora,

                    status:
                        status,

                    horasIniciais:
                        horasIniciais,

                    horasProducoes:
                        0,

                    horasAjustes:
                        0,

                    ultimaManutencao:
                        ultimaManutencao,

                    proximaManutencao:
                        proximaManutencao,

                    proximasHorasManutencao:
                        0,

                    observacoes:
                        observacoes

                };


                impressoras.push(
                    novaImpressora
                );


                registrarDiarioEquipamento({

                    impressoraId:
                        novaImpressora.id,

                    impressoraNome:
                        novaImpressora.nome,

                    tipo:
                        "Cadastro",

                    titulo:
                        "Impressora cadastrada",

                    descricao:
                        `${novaImpressora.marca} ${novaImpressora.modelo}`

                });

            }


            salvarImpressoras();

            mostrarImpressoras();

            limparFormularioImpressora();


            if (estavaEditando) {

                alert(
                    "Impressora atualizada com sucesso!"
                );

            } else {

                alert(
                    "Impressora cadastrada com sucesso!"
                );

            }

        }
    );

}


if (botaoLimparFormularioImpressora) {

    botaoLimparFormularioImpressora
        .addEventListener(
            "click",
            limparFormularioImpressora
        );

}


window.editarImpressora = function (id) {

    const impressora =
        impressoras.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!impressora) {

        alert(
            "Impressora não encontrada."
        );

        return;

    }


    impressoraEmEdicaoId = id;


    definirValorCampoEquipamentos(
        "nome-impressora",
        impressora.nome
    );


    definirValorCampoEquipamentos(
        "marca-impressora",
        impressora.marca
    );


    definirValorCampoEquipamentos(
        "modelo-impressora",
        impressora.modelo
    );


    definirValorCampoEquipamentos(
        "serie-impressora",
        impressora.serie
    );


    definirValorCampoEquipamentos(
        "data-compra-impressora",
        impressora.dataCompra
    );


    definirValorCampoEquipamentos(
        "valor-impressora",
        impressora.valor
    );


    definirValorCampoEquipamentos(
         "potencia-impressora",
         impressora.potenciaWatts || ""
    );

    definirValorCampoEquipamentos(
         "tarifa-energia-impressora",
         impressora.tarifaEnergia || ""
    );

    definirValorCampoEquipamentos(
         "custo-hora-impressora",
        impressora.custoHoraImpressora || ""
    );

    definirValorCampoEquipamentos(
        "status-impressora",
        impressora.status
    );


    definirValorCampoEquipamentos(
        "horas-iniciais-impressora",
        impressora.horasIniciais
    );


    definirValorCampoEquipamentos(
        "ultima-manutencao-impressora",
        impressora.ultimaManutencao
    );


    definirValorCampoEquipamentos(
        "proxima-manutencao-impressora",
        impressora.proximaManutencao
    );


    definirValorCampoEquipamentos(
        "observacoes-impressora",
        impressora.observacoes
    );


    if (botaoSalvarImpressora) {

        botaoSalvarImpressora.textContent =
            "Atualizar Impressora";

    }


    abrirAbaEquipamento(
        "aba-impressoras"
    );


    const paginaEquipamentos =
        document.getElementById(
            "impressoras"
        );


    if (paginaEquipamentos) {

        paginaEquipamentos.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }

};


window.alterarStatusImpressora =
    function (id) {

        const impressora =
            impressoras.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!impressora) {

            alert(
                "Impressora não encontrada."
            );

            return;

        }


        const resposta = prompt(

            "Digite o novo status:\n\n" +
            "Ativa\n" +
            "Em manutenção\n" +
            "Parada\n" +
            "Desativada",

            impressora.status

        );


        if (resposta === null) {

            return;

        }


        const statusPermitidos = [

            "Ativa",

            "Em manutenção",

            "Parada",

            "Desativada"

        ];


        const novoStatus =
            statusPermitidos.find(
                function (statusPermitido) {

                    return (
                        statusPermitido
                            .toLowerCase() ===

                        resposta
                            .trim()
                            .toLowerCase()
                    );

                }
            );


        if (!novoStatus) {

            alert(
                "Informe um status válido."
            );

            return;

        }


        const statusAnterior =
            impressora.status;


        impressora.status =
            novoStatus;


        salvarImpressoras();

        mostrarImpressoras();


        registrarDiarioEquipamento({

            impressoraId:
                impressora.id,

            impressoraNome:
                impressora.nome,

            tipo:
                "Status",

            titulo:
                "Status alterado",

            descricao:
                `${statusAnterior} → ${novoStatus}`

        });


        alert(
            "Status atualizado com sucesso!"
        );

    };


window.excluirImpressora =
    function (id) {

        const impressora =
            impressoras.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!impressora) {

            alert(
                "Impressora não encontrada."
            );

            return;

        }


        const possuiManutencoes =
            manutencoesEquipamentos.some(
                function (manutencao) {

                    return manutencao
                        .impressoraId === id;

                }
            );


        const possuiRegistrosHoras =
            registrosHorasEquipamentos.some(
                function (registro) {

                    return registro
                        .impressoraId === id;

                }
            );


        let mensagem =

            `Deseja excluir a impressora "${impressora.nome}"?`;


        if (
            possuiManutencoes ||
            possuiRegistrosHoras
        ) {

            mensagem +=

                "\n\nAtenção: os registros antigos de manutenção e horas permanecerão no histórico.";

        }


        const confirmar =
            confirm(mensagem);


        if (!confirmar) {

            return;

        }


        impressoras =
            impressoras.filter(
                function (item) {

                    return item.id !== id;

                }
            );


        if (
            impressoraEmEdicaoId === id
        ) {

            limparFormularioImpressora();

        }


        salvarImpressoras();

        mostrarImpressoras();


        registrarDiarioEquipamento({

            impressoraId:
                id,

            impressoraNome:
                impressora.nome,

            tipo:
                "Cadastro",

            titulo:
                "Impressora excluída",

            descricao:
                "O cadastro da impressora foi removido."

        });


        alert(
            "Impressora excluída com sucesso!"
        );

    };
  // =========================
// PEÇAS
// =========================

const botaoSalvarPeca =
    document.getElementById(
        "salvar-peca"
    );

const botaoLimparFormularioPeca =
    document.getElementById(
        "limpar-formulario-peca"
    );

const listaPecas =
    document.getElementById(
        "lista-pecas"
    );


// =========================
// CÁLCULO DO VALOR UNITÁRIO
// =========================

function atualizarValorUnitarioPeca() {

    const quantidade =
        obterNumeroCampoEquipamentos(
            "peca-quantidade"
        );

    const valorTotal =
        obterNumeroCampoEquipamentos(
            "peca-valor-total"
        );

    const valorUnitario =
        quantidade > 0
            ? valorTotal / quantidade
            : 0;

    definirValorCampoEquipamentos(
        "peca-valor-unitario",
        formatarDinheiro(
            valorUnitario
        )
    );

}


[
    "peca-quantidade",
    "peca-valor-total"
].forEach(
    function (id) {

        const campo =
            document.getElementById(id);

        if (campo) {

            campo.addEventListener(
                "input",
                atualizarValorUnitarioPeca
            );

        }

    }
);


// =========================
// RESUMO DAS PEÇAS
// =========================

function atualizarResumoPecas() {

    const quantidadeTotal =
        pecasEquipamentos.reduce(
            function (total, peca) {

                return total +
                    Number(
                        peca.quantidadeAtual || 0
                    );

            },
            0
        );


    const estoqueBaixo =
        pecasEquipamentos.filter(
            function (peca) {

                return (
                    Number(
                        peca.quantidadeAtual || 0
                    ) <=

                    Number(
                        peca.estoqueMinimo || 0
                    )
                );

            }
        ).length;


    const valorEstoque =
        pecasEquipamentos.reduce(
            function (total, peca) {

                return total +

                    Number(
                        peca.quantidadeAtual || 0
                    ) *

                    Number(
                        peca.valorUnitario || 0
                    );

            },
            0
        );


    definirTextoEquipamentos(
        "equipamentos-total-pecas",
        pecasEquipamentos.length
    );


    definirTextoEquipamentos(
        "equipamentos-pecas-quantidade",
        quantidadeTotal.toLocaleString(
            "pt-BR"
        )
    );


    definirTextoEquipamentos(
        "equipamentos-pecas-estoque-baixo",
        estoqueBaixo
    );


    definirTextoEquipamentos(
        "equipamentos-pecas-valor-estoque",
        formatarDinheiro(
            valorEstoque
        )
    );

}


// =========================
// MOSTRAR PEÇAS
// =========================

function mostrarPecasEquipamentos() {

    if (!listaPecas) {

        atualizarResumoPecas();

        return;

    }


    if (pecasEquipamentos.length === 0) {

        listaPecas.innerHTML =
            "<p>Nenhuma peça cadastrada.</p>";


        atualizarResumoPecas();


        if (
            typeof atualizarOpcoesEquipamentos ===
            "function"
        ) {

            atualizarOpcoesEquipamentos();

        }

        return;

    }


    listaPecas.innerHTML =
        pecasEquipamentos.map(
            function (peca) {

                const quantidadeAtual =
                    Number(
                        peca.quantidadeAtual || 0
                    );


                const estoqueMinimo =
                    Number(
                        peca.estoqueMinimo || 0
                    );


                const estoqueBaixo =
                    quantidadeAtual <=
                    estoqueMinimo;


                const valorAtualEstoque =
                    quantidadeAtual *

                    Number(
                        peca.valorUnitario || 0
                    );


                return `
                    <div class="card-item">

                        <h4>
                            ${escaparTexto(
                                peca.nome
                            )}
                        </h4>

                        <p>
                            <strong>
                                Categoria:
                            </strong>

                            ${escaparTexto(
                                peca.categoria
                            )}
                        </p>

                        <p>
                            <strong>
                                Marca:
                            </strong>

                            ${escaparTexto(
                                peca.marca ||
                                "Não informada"
                            )}
                        </p>

                        <p>
                            <strong>
                                Código:
                            </strong>

                            ${escaparTexto(
                                peca.codigo ||
                                "Não informado"
                            )}
                        </p>

                        <p>
                            <strong>
                                Estoque atual:
                            </strong>

                            ${quantidadeAtual}
                            unidade(s)
                        </p>

                        <p>
                            <strong>
                                Estoque mínimo:
                            </strong>

                            ${estoqueMinimo}
                        </p>

                        <p>
                            <strong>
                                Situação:
                            </strong>

                            ${
                                estoqueBaixo
                                    ? "⚠️ Estoque baixo"
                                    : "✅ Estoque suficiente"
                            }
                        </p>

                        <p>
                            <strong>
                                Valor unitário:
                            </strong>

                            ${formatarDinheiro(
                                peca.valorUnitario
                            )}
                        </p>

                        <p>
                            <strong>
                                Valor atual em estoque:
                            </strong>

                            ${formatarDinheiro(
                                valorAtualEstoque
                            )}
                        </p>

                        <p>
                            <strong>
                                Data da compra:
                            </strong>

                            ${formatarDataEquipamentos(
                                peca.dataCompra
                            )}
                        </p>

                        <p>
                            <strong>
                                Fornecedor:
                            </strong>

                            ${escaparTexto(
                                peca.fornecedor ||
                                "Não informado"
                            )}
                        </p>

                        <p>
                            <strong>
                                Compatibilidade:
                            </strong>

                            ${escaparTexto(
                                peca.compatibilidade ||
                                "Não informada"
                            )}
                        </p>

                        <p>
                            <strong>
                                Observações:
                            </strong>

                            ${escaparTexto(
                                peca.observacoes ||
                                "Nenhuma"
                            )}
                        </p>

                        <button
                            type="button"
                            class="botao-principal"
                            onclick="editarPecaEquipamento(${peca.id})">

                            Editar

                        </button>

                        <button
                            type="button"
                            onclick="adicionarEstoquePeca(${peca.id})">

                            Adicionar estoque

                        </button>

                        <button
                            type="button"
                            class="botao-excluir"
                            onclick="excluirPecaEquipamento(${peca.id})">

                            Excluir

                        </button>

                    </div>
                `;

            }
        ).join("");


    atualizarResumoPecas();


    if (
        typeof atualizarOpcoesEquipamentos ===
        "function"
    ) {

        atualizarOpcoesEquipamentos();

    }

}


// =========================
// LIMPAR FORMULÁRIO DE PEÇAS
// =========================

function limparFormularioPeca() {

    pecaEmEdicaoId = null;


    [
        "peca-nome",
        "peca-categoria",
        "peca-marca",
        "peca-codigo",
        "peca-quantidade",
        "peca-estoque-minimo",
        "peca-valor-total",
        "peca-data-compra",
        "peca-fornecedor",
        "peca-compatibilidade",
        "peca-observacoes"
    ].forEach(
        function (id) {

            definirValorCampoEquipamentos(
                id,
                ""
            );

        }
    );


    definirValorCampoEquipamentos(
        "peca-valor-unitario",
        "R$ 0,00"
    );


    if (botaoSalvarPeca) {

        botaoSalvarPeca.textContent =
            "Salvar Peça";

    }

}  
// =========================
// SALVAR PEÇA
// =========================

if (botaoSalvarPeca) {

    botaoSalvarPeca.addEventListener(
        "click",
        function () {

            const nome =
                obterTextoCampoEquipamentos(
                    "peca-nome"
                );

            const categoria =
                obterTextoCampoEquipamentos(
                    "peca-categoria"
                ) || "Outro";

            const marca =
                obterTextoCampoEquipamentos(
                    "peca-marca"
                );

            const codigo =
                obterTextoCampoEquipamentos(
                    "peca-codigo"
                );

            const quantidade =
                obterNumeroCampoEquipamentos(
                    "peca-quantidade"
                );

            const estoqueMinimo =
                obterNumeroCampoEquipamentos(
                    "peca-estoque-minimo"
                );

            const valorTotal =
                obterNumeroCampoEquipamentos(
                    "peca-valor-total"
                );

            const dataCompra =
                obterTextoCampoEquipamentos(
                    "peca-data-compra"
                );

            const fornecedor =
                obterTextoCampoEquipamentos(
                    "peca-fornecedor"
                );

            const compatibilidade =
                obterTextoCampoEquipamentos(
                    "peca-compatibilidade"
                );

            const observacoes =
                obterTextoCampoEquipamentos(
                    "peca-observacoes"
                );


            if (!nome) {

                alert(
                    "Informe o nome da peça."
                );

                return;

            }


            if (
                Number.isNaN(quantidade) ||
                quantidade < 0
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


            if (
                Number.isNaN(valorTotal) ||
                valorTotal < 0
            ) {

                alert(
                    "Informe um valor total válido."
                );

                return;

            }


            const valorUnitario =
                quantidade > 0
                    ? valorTotal / quantidade
                    : 0;


            const estavaEditando =
                pecaEmEdicaoId !== null;


            if (estavaEditando) {

                const peca =
                    pecasEquipamentos.find(
                        function (item) {

                            return item.id ===
                                pecaEmEdicaoId;

                        }
                    );


                if (!peca) {

                    alert(
                        "Peça não encontrada."
                    );

                    return;

                }


                const quantidadeAnterior =
                    Number(
                        peca.quantidadeAtual || 0
                    );


                peca.nome = nome;

                peca.categoria = categoria;

                peca.marca = marca;

                peca.codigo = codigo;

                peca.quantidadeInicial =
                    quantidade;

                peca.quantidadeAtual =
                    quantidade;

                peca.estoqueMinimo =
                    estoqueMinimo;

                peca.valorTotal =
                    valorTotal;

                peca.valorUnitario =
                    valorUnitario;

                peca.dataCompra =
                    dataCompra;

                peca.fornecedor =
                    fornecedor;

                peca.compatibilidade =
                    compatibilidade;

                peca.observacoes =
                    observacoes;


                registrarDiarioEquipamento({

                    tipo:
                        "Estoque",

                    titulo:
                        "Peça atualizada",

                    descricao:
                        `${nome}: estoque alterado de ${quantidadeAnterior} para ${quantidade}.`

                });

            } else {

                const novaPeca = {

                    id:
                        Date.now(),

                    nome:
                        nome,

                    categoria:
                        categoria,

                    marca:
                        marca,

                    codigo:
                        codigo,

                    quantidadeInicial:
                        quantidade,

                    quantidadeAtual:
                        quantidade,

                    estoqueMinimo:
                        estoqueMinimo,

                    valorTotal:
                        valorTotal,

                    valorUnitario:
                        valorUnitario,

                    dataCompra:
                        dataCompra,

                    fornecedor:
                        fornecedor,

                    compatibilidade:
                        compatibilidade,

                    observacoes:
                        observacoes

                };


                pecasEquipamentos.push(
                    novaPeca
                );


                registrarDiarioEquipamento({

                    tipo:
                        "Estoque",

                    titulo:
                        "Peça cadastrada",

                    descricao:
                        `${novaPeca.nome}: ${novaPeca.quantidadeAtual} unidade(s) adicionada(s) ao estoque.`

                });

            }


            salvarPecasEquipamentos();

            mostrarPecasEquipamentos();

            limparFormularioPeca();


            if (estavaEditando) {

                alert(
                    "Peça atualizada com sucesso!"
                );

            } else {

                alert(
                    "Peça cadastrada com sucesso!"
                );

            }

        }
    );

}


// =========================
// LIMPAR FORMULÁRIO
// =========================

if (botaoLimparFormularioPeca) {

    botaoLimparFormularioPeca
        .addEventListener(
            "click",
            limparFormularioPeca
        );

}


// =========================
// EDITAR PEÇA
// =========================

window.editarPecaEquipamento =
    function (id) {

        const peca =
            pecasEquipamentos.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!peca) {

            alert(
                "Peça não encontrada."
            );

            return;

        }


        pecaEmEdicaoId = id;


        definirValorCampoEquipamentos(
            "peca-nome",
            peca.nome
        );


        definirValorCampoEquipamentos(
            "peca-categoria",
            peca.categoria
        );


        definirValorCampoEquipamentos(
            "peca-marca",
            peca.marca
        );


        definirValorCampoEquipamentos(
            "peca-codigo",
            peca.codigo
        );


        definirValorCampoEquipamentos(
            "peca-quantidade",
            peca.quantidadeAtual
        );


        definirValorCampoEquipamentos(
            "peca-estoque-minimo",
            peca.estoqueMinimo
        );


        definirValorCampoEquipamentos(
            "peca-valor-total",
            peca.valorTotal
        );


        definirValorCampoEquipamentos(
            "peca-data-compra",
            peca.dataCompra
        );


        definirValorCampoEquipamentos(
            "peca-fornecedor",
            peca.fornecedor
        );


        definirValorCampoEquipamentos(
            "peca-compatibilidade",
            peca.compatibilidade
        );


        definirValorCampoEquipamentos(
            "peca-observacoes",
            peca.observacoes
        );


        atualizarValorUnitarioPeca();


        if (botaoSalvarPeca) {

            botaoSalvarPeca.textContent =
                "Atualizar Peça";

        }


        abrirAbaEquipamento(
            "aba-pecas"
        );


        const abaPecas =
            document.getElementById(
                "aba-pecas"
            );


        if (abaPecas) {

            abaPecas.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "start"

            });

        }

    };


// =========================
// ADICIONAR ESTOQUE
// =========================

window.adicionarEstoquePeca =
    function (id) {

        const peca =
            pecasEquipamentos.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!peca) {

            alert(
                "Peça não encontrada."
            );

            return;

        }


        const respostaQuantidade =
            prompt(

                `Quantas unidades deseja adicionar ao estoque de "${peca.nome}"?`,

                "1"

            );


        if (respostaQuantidade === null) {

            return;

        }


        const quantidadeAdicionada =
            Number(
                String(respostaQuantidade)
                    .replace(",", ".")
            );


        if (
            Number.isNaN(
                quantidadeAdicionada
            ) ||
            quantidadeAdicionada <= 0
        ) {

            alert(
                "Informe uma quantidade maior que zero."
            );

            return;

        }


        const respostaValor =
            prompt(

                "Qual foi o valor total pago nesta nova compra?",

                "0"

            );


        if (respostaValor === null) {

            return;

        }


        const valorNovaCompra =
            Number(
                String(respostaValor)
                    .replace(",", ".")
            );


        if (
            Number.isNaN(valorNovaCompra) ||
            valorNovaCompra < 0
        ) {

            alert(
                "Informe um valor válido."
            );

            return;

        }


        const quantidadeAnterior =
            Number(
                peca.quantidadeAtual || 0
            );


        const valorAnteriorEstoque =
            quantidadeAnterior *

            Number(
                peca.valorUnitario || 0
            );


        const novaQuantidade =
            quantidadeAnterior +
            quantidadeAdicionada;


        const novoValorEstoque =
            valorAnteriorEstoque +
            valorNovaCompra;


        const novoValorUnitario =
            novaQuantidade > 0
                ? novoValorEstoque /
                    novaQuantidade
                : 0;


        peca.quantidadeAtual =
            novaQuantidade;


        peca.quantidadeInicial =
            Number(
                peca.quantidadeInicial || 0
            ) +
            quantidadeAdicionada;


        peca.valorTotal =
            Number(
                peca.valorTotal || 0
            ) +
            valorNovaCompra;


        peca.valorUnitario =
            novoValorUnitario;


        salvarPecasEquipamentos();

        mostrarPecasEquipamentos();


        registrarDiarioEquipamento({

            tipo:
                "Estoque",

            titulo:
                "Entrada de peças",

            descricao:
                `${quantidadeAdicionada} unidade(s) de ${peca.nome} adicionada(s). Estoque atual: ${novaQuantidade}.`

        });


        alert(
            "Estoque atualizado com sucesso!"
        );

    };


// =========================
// EXCLUIR PEÇA
// =========================

window.excluirPecaEquipamento =
    function (id) {

        const peca =
            pecasEquipamentos.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!peca) {

            alert(
                "Peça não encontrada."
            );

            return;

        }


        const foiUtilizada =
            manutencoesEquipamentos.some(
                function (manutencao) {

                    return manutencao.pecaId ===
                        id;

                }
            );


        let mensagem =

            `Deseja excluir a peça "${peca.nome}"?`;


        if (foiUtilizada) {

            mensagem +=

                "\n\nAtenção: essa peça já foi utilizada em uma manutenção. O histórico da manutenção permanecerá salvo.";

        }


        const confirmar =
            confirm(mensagem);


        if (!confirmar) {

            return;

        }


        pecasEquipamentos =
            pecasEquipamentos.filter(
                function (item) {

                    return item.id !== id;

                }
            );


        if (
            pecaEmEdicaoId === id
        ) {

            limparFormularioPeca();

        }


        salvarPecasEquipamentos();

        mostrarPecasEquipamentos();


        registrarDiarioEquipamento({

            tipo:
                "Estoque",

            titulo:
                "Peça excluída",

            descricao:
                `O cadastro da peça ${peca.nome} foi removido.`

        });


        alert(
            "Peça excluída com sucesso!"
        );

    };
// =========================
// LUBRIFICANTES
// =========================

const botaoSalvarLubrificante =
    document.getElementById(
        "salvar-lubrificante"
    );

const botaoLimparFormularioLubrificante =
    document.getElementById(
        "limpar-formulario-lubrificante"
    );

const listaLubrificantes =
    document.getElementById(
        "lista-lubrificantes"
    );


// =========================
// CÁLCULO DO VALOR UNITÁRIO
// =========================

function atualizarValorUnitarioLubrificante() {

    const quantidade =
        obterNumeroCampoEquipamentos(
            "lubrificante-quantidade"
        );

    const valorTotal =
        obterNumeroCampoEquipamentos(
            "lubrificante-valor-total"
        );

    const valorUnitario =
        quantidade > 0
            ? valorTotal / quantidade
            : 0;

    definirValorCampoEquipamentos(
        "lubrificante-valor-unitario",
        formatarDinheiro(
            valorUnitario
        )
    );

}


[
    "lubrificante-quantidade",
    "lubrificante-valor-total"
].forEach(
    function (id) {

        const campo =
            document.getElementById(id);

        if (campo) {

            campo.addEventListener(
                "input",
                atualizarValorUnitarioLubrificante
            );

        }

    }
);


// =========================
// RESUMO DOS LUBRIFICANTES
// =========================

function atualizarResumoLubrificantes() {

    const quantidadeTotal =
        lubrificantesEquipamentos.reduce(
            function (total, item) {

                return total +
                    Number(
                        item.quantidadeAtual || 0
                    );

            },
            0
        );


    const estoqueBaixo =
        lubrificantesEquipamentos.filter(
            function (item) {

                return (
                    Number(
                        item.quantidadeAtual || 0
                    ) <=

                    Number(
                        item.estoqueMinimo || 0
                    )
                );

            }
        ).length;


    const valorEstoque =
        lubrificantesEquipamentos.reduce(
            function (total, item) {

                return total +

                    Number(
                        item.quantidadeAtual || 0
                    ) *

                    Number(
                        item.valorUnitario || 0
                    );

            },
            0
        );


    definirTextoEquipamentos(
        "equipamentos-total-lubrificantes",
        lubrificantesEquipamentos.length
    );


    definirTextoEquipamentos(
        "equipamentos-lubrificantes-quantidade",
        quantidadeTotal.toLocaleString(
            "pt-BR",
            {
                maximumFractionDigits: 2
            }
        )
    );


    definirTextoEquipamentos(
        "equipamentos-lubrificantes-estoque-baixo",
        estoqueBaixo
    );


    definirTextoEquipamentos(
        "equipamentos-lubrificantes-valor-estoque",
        formatarDinheiro(
            valorEstoque
        )
    );

}


// =========================
// MOSTRAR LUBRIFICANTES
// =========================

function mostrarLubrificantesEquipamentos() {

    if (!listaLubrificantes) {

        atualizarResumoLubrificantes();

        return;

    }


    if (
        lubrificantesEquipamentos.length === 0
    ) {

        listaLubrificantes.innerHTML =
            "<p>Nenhum lubrificante cadastrado.</p>";


        atualizarResumoLubrificantes();


        if (
            typeof atualizarOpcoesEquipamentos ===
            "function"
        ) {

            atualizarOpcoesEquipamentos();

        }

        return;

    }


    listaLubrificantes.innerHTML =
        lubrificantesEquipamentos.map(
            function (item) {

                const quantidadeAtual =
                    Number(
                        item.quantidadeAtual || 0
                    );


                const estoqueMinimo =
                    Number(
                        item.estoqueMinimo || 0
                    );


                const estoqueBaixo =
                    quantidadeAtual <=
                    estoqueMinimo;


                const valorAtualEstoque =
                    quantidadeAtual *

                    Number(
                        item.valorUnitario || 0
                    );


                return `
                    <div class="card-item">

                        <h4>
                            ${escaparTexto(
                                item.nome
                            )}
                        </h4>

                        <p>
                            <strong>
                                Tipo:
                            </strong>

                            ${escaparTexto(
                                item.tipo
                            )}
                        </p>

                        <p>
                            <strong>
                                Marca:
                            </strong>

                            ${escaparTexto(
                                item.marca ||
                                "Não informada"
                            )}
                        </p>

                        <p>
                            <strong>
                                Estoque atual:
                            </strong>

                            ${quantidadeAtual.toLocaleString(
                                "pt-BR",
                                {
                                    maximumFractionDigits: 2
                                }
                            )}

                            ${escaparTexto(
                                item.unidade
                            )}
                        </p>

                        <p>
                            <strong>
                                Estoque mínimo:
                            </strong>

                            ${estoqueMinimo.toLocaleString(
                                "pt-BR",
                                {
                                    maximumFractionDigits: 2
                                }
                            )}

                            ${escaparTexto(
                                item.unidade
                            )}
                        </p>

                        <p>
                            <strong>
                                Situação:
                            </strong>

                            ${
                                estoqueBaixo
                                    ? "⚠️ Estoque baixo"
                                    : "✅ Estoque suficiente"
                            }
                        </p>

                        <p>
                            <strong>
                                Valor por unidade:
                            </strong>

                            ${formatarDinheiro(
                                item.valorUnitario
                            )}
                        </p>

                        <p>
                            <strong>
                                Valor atual em estoque:
                            </strong>

                            ${formatarDinheiro(
                                valorAtualEstoque
                            )}
                        </p>

                        <p>
                            <strong>
                                Data da compra:
                            </strong>

                            ${formatarDataEquipamentos(
                                item.dataCompra
                            )}
                        </p>

                        <p>
                            <strong>
                                Fornecedor:
                            </strong>

                            ${escaparTexto(
                                item.fornecedor ||
                                "Não informado"
                            )}
                        </p>

                        <p>
                            <strong>
                                Aplicação:
                            </strong>

                            ${escaparTexto(
                                item.aplicacao ||
                                "Não informada"
                            )}
                        </p>

                        <p>
                            <strong>
                                Observações:
                            </strong>

                            ${escaparTexto(
                                item.observacoes ||
                                "Nenhuma"
                            )}
                        </p>

                        <button
                            type="button"
                            class="botao-principal"
                            onclick="editarLubrificanteEquipamento(${item.id})">

                            Editar

                        </button>

                        <button
                            type="button"
                            onclick="adicionarEstoqueLubrificante(${item.id})">

                            Adicionar estoque

                        </button>

                        <button
                            type="button"
                            class="botao-excluir"
                            onclick="excluirLubrificanteEquipamento(${item.id})">

                            Excluir

                        </button>

                    </div>
                `;

            }
        ).join("");


    atualizarResumoLubrificantes();


    if (
        typeof atualizarOpcoesEquipamentos ===
        "function"
    ) {

        atualizarOpcoesEquipamentos();

    }

}


// =========================
// LIMPAR FORMULÁRIO
// =========================

function limparFormularioLubrificante() {

    lubrificanteEmEdicaoId = null;


    [
        "lubrificante-nome",
        "lubrificante-tipo",
        "lubrificante-marca",
        "lubrificante-unidade",
        "lubrificante-quantidade",
        "lubrificante-estoque-minimo",
        "lubrificante-valor-total",
        "lubrificante-data-compra",
        "lubrificante-fornecedor",
        "lubrificante-aplicacao",
        "lubrificante-observacoes"
    ].forEach(
        function (id) {

            definirValorCampoEquipamentos(
                id,
                ""
            );

        }
    );


    definirValorCampoEquipamentos(
        "lubrificante-valor-unitario",
        "R$ 0,00"
    );


    if (botaoSalvarLubrificante) {

        botaoSalvarLubrificante.textContent =
            "Salvar Lubrificante";

    }

}
// =========================
// SALVAR LUBRIFICANTE
// =========================

if (botaoSalvarLubrificante) {

    botaoSalvarLubrificante.addEventListener(
        "click",
        function () {

            const nome =
                obterTextoCampoEquipamentos(
                    "lubrificante-nome"
                );

            const tipo =
                obterTextoCampoEquipamentos(
                    "lubrificante-tipo"
                ) || "Outro";

            const marca =
                obterTextoCampoEquipamentos(
                    "lubrificante-marca"
                );

            const unidade =
                obterTextoCampoEquipamentos(
                    "lubrificante-unidade"
                ) || "Unidade";

            const quantidade =
                obterNumeroCampoEquipamentos(
                    "lubrificante-quantidade"
                );

            const estoqueMinimo =
                obterNumeroCampoEquipamentos(
                    "lubrificante-estoque-minimo"
                );

            const valorTotal =
                obterNumeroCampoEquipamentos(
                    "lubrificante-valor-total"
                );

            const dataCompra =
                obterTextoCampoEquipamentos(
                    "lubrificante-data-compra"
                );

            const fornecedor =
                obterTextoCampoEquipamentos(
                    "lubrificante-fornecedor"
                );

            const aplicacao =
                obterTextoCampoEquipamentos(
                    "lubrificante-aplicacao"
                );

            const observacoes =
                obterTextoCampoEquipamentos(
                    "lubrificante-observacoes"
                );


            if (!nome) {

                alert(
                    "Informe o nome do lubrificante."
                );

                return;

            }


            if (
                Number.isNaN(quantidade) ||
                quantidade < 0
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


            if (
                Number.isNaN(valorTotal) ||
                valorTotal < 0
            ) {

                alert(
                    "Informe um valor total válido."
                );

                return;

            }


            const valorUnitario =
                quantidade > 0
                    ? valorTotal / quantidade
                    : 0;


            const estavaEditando =
                lubrificanteEmEdicaoId !== null;


            if (estavaEditando) {

                const lubrificante =
                    lubrificantesEquipamentos.find(
                        function (item) {

                            return item.id ===
                                lubrificanteEmEdicaoId;

                        }
                    );


                if (!lubrificante) {

                    alert(
                        "Lubrificante não encontrado."
                    );

                    return;

                }


                const quantidadeAnterior =
                    Number(
                        lubrificante.quantidadeAtual ||
                        0
                    );


                lubrificante.nome =
                    nome;

                lubrificante.tipo =
                    tipo;

                lubrificante.marca =
                    marca;

                lubrificante.unidade =
                    unidade;

                lubrificante.quantidadeInicial =
                    quantidade;

                lubrificante.quantidadeAtual =
                    quantidade;

                lubrificante.estoqueMinimo =
                    estoqueMinimo;

                lubrificante.valorTotal =
                    valorTotal;

                lubrificante.valorUnitario =
                    valorUnitario;

                lubrificante.dataCompra =
                    dataCompra;

                lubrificante.fornecedor =
                    fornecedor;

                lubrificante.aplicacao =
                    aplicacao;

                lubrificante.observacoes =
                    observacoes;


                registrarDiarioEquipamento({

                    tipo:
                        "Estoque",

                    titulo:
                        "Lubrificante atualizado",

                    descricao:
                        `${nome}: estoque alterado de ${quantidadeAnterior} para ${quantidade} ${unidade}.`

                });

            } else {

                const novoLubrificante = {

                    id:
                        Date.now(),

                    nome:
                        nome,

                    tipo:
                        tipo,

                    marca:
                        marca,

                    unidade:
                        unidade,

                    quantidadeInicial:
                        quantidade,

                    quantidadeAtual:
                        quantidade,

                    estoqueMinimo:
                        estoqueMinimo,

                    valorTotal:
                        valorTotal,

                    valorUnitario:
                        valorUnitario,

                    dataCompra:
                        dataCompra,

                    fornecedor:
                        fornecedor,

                    aplicacao:
                        aplicacao,

                    observacoes:
                        observacoes

                };


                lubrificantesEquipamentos.push(
                    novoLubrificante
                );


                registrarDiarioEquipamento({

                    tipo:
                        "Estoque",

                    titulo:
                        "Lubrificante cadastrado",

                    descricao:
                        `${novoLubrificante.nome}: ${novoLubrificante.quantidadeAtual} ${novoLubrificante.unidade} adicionado(s) ao estoque.`

                });

            }


            salvarLubrificantesEquipamentos();

            mostrarLubrificantesEquipamentos();

            limparFormularioLubrificante();


            if (estavaEditando) {

                alert(
                    "Lubrificante atualizado com sucesso!"
                );

            } else {

                alert(
                    "Lubrificante cadastrado com sucesso!"
                );

            }

        }
    );

}


// =========================
// BOTÃO LIMPAR FORMULÁRIO
// =========================

if (botaoLimparFormularioLubrificante) {

    botaoLimparFormularioLubrificante
        .addEventListener(
            "click",
            limparFormularioLubrificante
        );

}


// =========================
// EDITAR LUBRIFICANTE
// =========================

window.editarLubrificanteEquipamento =
    function (id) {

        const lubrificante =
            lubrificantesEquipamentos.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!lubrificante) {

            alert(
                "Lubrificante não encontrado."
            );

            return;

        }


        lubrificanteEmEdicaoId = id;


        definirValorCampoEquipamentos(
            "lubrificante-nome",
            lubrificante.nome
        );


        definirValorCampoEquipamentos(
            "lubrificante-tipo",
            lubrificante.tipo
        );


        definirValorCampoEquipamentos(
            "lubrificante-marca",
            lubrificante.marca
        );


        definirValorCampoEquipamentos(
            "lubrificante-unidade",
            lubrificante.unidade
        );


        definirValorCampoEquipamentos(
            "lubrificante-quantidade",
            lubrificante.quantidadeAtual
        );


        definirValorCampoEquipamentos(
            "lubrificante-estoque-minimo",
            lubrificante.estoqueMinimo
        );


        definirValorCampoEquipamentos(
            "lubrificante-valor-total",
            lubrificante.valorTotal
        );


        definirValorCampoEquipamentos(
            "lubrificante-data-compra",
            lubrificante.dataCompra
        );


        definirValorCampoEquipamentos(
            "lubrificante-fornecedor",
            lubrificante.fornecedor
        );


        definirValorCampoEquipamentos(
            "lubrificante-aplicacao",
            lubrificante.aplicacao
        );


        definirValorCampoEquipamentos(
            "lubrificante-observacoes",
            lubrificante.observacoes
        );


        atualizarValorUnitarioLubrificante();


        if (botaoSalvarLubrificante) {

            botaoSalvarLubrificante.textContent =
                "Atualizar Lubrificante";

        }


        abrirAbaEquipamento(
            "aba-lubrificantes"
        );


        const abaLubrificantes =
            document.getElementById(
                "aba-lubrificantes"
            );


        if (abaLubrificantes) {

            abaLubrificantes.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "start"

            });

        }

    };
// =========================
// ADICIONAR ESTOQUE DE LUBRIFICANTE
// =========================

window.adicionarEstoqueLubrificante =
    function (id) {

        const lubrificante =
            lubrificantesEquipamentos.find(
                function (item) {
                    return item.id === id;
                }
            );

        if (!lubrificante) {
            alert("Lubrificante não encontrado.");
            return;
        }

        const respostaQuantidade = prompt(
            `Quanto deseja adicionar ao estoque de "${lubrificante.nome}"?`,
            "1"
        );

        if (respostaQuantidade === null) {
            return;
        }

        const quantidadeAdicionada = Number(
            String(respostaQuantidade)
                .replace(",", ".")
        );

        if (
            Number.isNaN(quantidadeAdicionada) ||
            quantidadeAdicionada <= 0
        ) {
            alert("Informe uma quantidade válida.");
            return;
        }

        const respostaValor = prompt(
            "Qual foi o valor total desta compra?",
            "0"
        );

        if (respostaValor === null) {
            return;
        }

        const valorCompra = Number(
            String(respostaValor)
                .replace(",", ".")
        );

        if (
            Number.isNaN(valorCompra) ||
            valorCompra < 0
        ) {
            alert("Informe um valor válido.");
            return;
        }

        const quantidadeAnterior =
            Number(
                lubrificante.quantidadeAtual || 0
            );

        const valorAnterior =
            quantidadeAnterior *
            Number(
                lubrificante.valorUnitario || 0
            );

        const novaQuantidade =
            quantidadeAnterior +
            quantidadeAdicionada;

        const novoValorEstoque =
            valorAnterior +
            valorCompra;

        const novoValorUnitario =
            novaQuantidade > 0
                ? novoValorEstoque /
                  novaQuantidade
                : 0;

        lubrificante.quantidadeAtual =
            novaQuantidade;

        lubrificante.quantidadeInicial =
            Number(
                lubrificante.quantidadeInicial || 0
            ) + quantidadeAdicionada;

        lubrificante.valorTotal =
            Number(
                lubrificante.valorTotal || 0
            ) + valorCompra;

        lubrificante.valorUnitario =
            novoValorUnitario;

        salvarLubrificantesEquipamentos();

        mostrarLubrificantesEquipamentos();

        registrarDiarioEquipamento({

            tipo: "Estoque",

            titulo:
                "Entrada de lubrificante",

            descricao:
                `${quantidadeAdicionada} ${lubrificante.unidade} adicionados ao estoque de ${lubrificante.nome}.`

        });

        alert(
            "Estoque atualizado com sucesso!"
        );

    };


// =========================
// EXCLUIR LUBRIFICANTE
// =========================

window.excluirLubrificanteEquipamento =
    function (id) {

        const lubrificante =
            lubrificantesEquipamentos.find(
                function (item) {
                    return item.id === id;
                }
            );

        if (!lubrificante) {
            alert(
                "Lubrificante não encontrado."
            );
            return;
        }

        const foiUtilizado =
            manutencoesEquipamentos.some(
                function (manutencao) {

                    return (
                        manutencao.lubrificanteId ===
                        id
                    );

                }
            );

        let mensagem =
            `Deseja excluir o lubrificante "${lubrificante.nome}"?`;

        if (foiUtilizado) {

            mensagem +=
                "\n\nEsse lubrificante já foi utilizado em manutenções. O histórico será preservado.";

        }

        if (!confirm(mensagem)) {
            return;
        }

        lubrificantesEquipamentos =
            lubrificantesEquipamentos.filter(
                function (item) {

                    return item.id !== id;

                }
            );

        if (
            lubrificanteEmEdicaoId === id
        ) {

            limparFormularioLubrificante();

        }

        salvarLubrificantesEquipamentos();

        mostrarLubrificantesEquipamentos();

        registrarDiarioEquipamento({

            tipo:
                "Estoque",

            titulo:
                "Lubrificante excluído",

            descricao:
                `${lubrificante.nome} removido do cadastro.`

        });

        alert(
            "Lubrificante excluído com sucesso!"
        );

    };


// =========================
// ATUALIZAÇÃO DAS OPÇÕES
// =========================

function atualizarOpcoesEquipamentos() {

    atualizarSelectImpressoras();

    atualizarSelectPecas();

    atualizarSelectLubrificantes();

}
// =========================
// MANUTENÇÕES
// PARTE 7A
// =========================

const botaoSalvarManutencao =
    document.getElementById(
        "salvar-manutencao"
    );

const botaoLimparFormularioManutencao =
    document.getElementById(
        "limpar-formulario-manutencao"
    );

const listaManutencoes =
    document.getElementById(
        "lista-manutencoes"
    );


// =========================
// ATUALIZAR SELECTS
// =========================

function atualizarSelectImpressoras() {

    const campos = [
        document.getElementById(
            "manutencao-impressora"
        ),
        document.getElementById(
            "horas-impressora"
        ),
        document.getElementById(
            "diario-impressora"
        )
    ];


    campos.forEach(
        function (campo) {

            if (!campo) {
                return;
            }


            const valorAtual =
                campo.value;


            campo.innerHTML =
                '<option value="">Selecione uma impressora</option>';


            impressoras.forEach(
                function (impressora) {

                    const opcao =
                        document.createElement(
                            "option"
                        );


                    opcao.value =
                        impressora.id;


                    opcao.textContent =
                        `${impressora.nome} — ${impressora.modelo || "Modelo não informado"}`;


                    campo.appendChild(
                        opcao
                    );

                }
            );


            if (
                valorAtual &&
                impressoras.some(
                    function (impressora) {

                        return String(
                            impressora.id
                        ) ===
                        String(valorAtual);

                    }
                )
            ) {

                campo.value =
                    valorAtual;

            }

        }
    );

}


function atualizarSelectPecas() {

    const campo =
        document.getElementById(
            "manutencao-peca"
        );


    if (!campo) {
        return;
    }


    const valorAtual =
        campo.value;


    campo.innerHTML =
        '<option value="">Nenhuma peça utilizada</option>';


    pecasEquipamentos.forEach(
        function (peca) {

            const opcao =
                document.createElement(
                    "option"
                );


            opcao.value =
                peca.id;


            opcao.textContent =
                `${peca.nome} — estoque: ${Number(
                    peca.quantidadeAtual || 0
                )}`;


            if (
                Number(
                    peca.quantidadeAtual || 0
                ) <= 0
            ) {

                opcao.disabled =
                    true;

            }


            campo.appendChild(
                opcao
            );

        }
    );


    if (
        valorAtual &&
        pecasEquipamentos.some(
            function (peca) {

                return String(peca.id) ===
                    String(valorAtual);

            }
        )
    ) {

        campo.value =
            valorAtual;

    }

}


function atualizarSelectLubrificantes() {

    const campo =
        document.getElementById(
            "manutencao-lubrificante"
        );


    if (!campo) {
        return;
    }


    const valorAtual =
        campo.value;


    campo.innerHTML =
        '<option value="">Nenhum lubrificante utilizado</option>';


    lubrificantesEquipamentos.forEach(
        function (lubrificante) {

            const opcao =
                document.createElement(
                    "option"
                );


            opcao.value =
                lubrificante.id;


            opcao.textContent =
                `${lubrificante.nome} — estoque: ${Number(
                    lubrificante.quantidadeAtual || 0
                ).toLocaleString(
                    "pt-BR",
                    {
                        maximumFractionDigits: 2
                    }
                )} ${lubrificante.unidade}`;


            if (
                Number(
                    lubrificante.quantidadeAtual ||
                    0
                ) <= 0
            ) {

                opcao.disabled =
                    true;

            }


            campo.appendChild(
                opcao
            );

        }
    );


    if (
        valorAtual &&
        lubrificantesEquipamentos.some(
            function (lubrificante) {

                return String(
                    lubrificante.id
                ) ===
                String(valorAtual);

            }
        )
    ) {

        campo.value =
            valorAtual;

    }

}


// =========================
// RESUMO DAS MANUTENÇÕES
// =========================

function atualizarResumoManutencoes() {

    const preventivas =
        manutencoesEquipamentos.filter(
            function (manutencao) {

                return manutencao.tipo ===
                    "Preventiva";

            }
        ).length;


    const corretivas =
        manutencoesEquipamentos.filter(
            function (manutencao) {

                return manutencao.tipo ===
                    "Corretiva";

            }
        ).length;


    const custoTotal =
        manutencoesEquipamentos.reduce(
            function (total, manutencao) {

                return total +
                    Number(
                        manutencao.custoTotal || 0
                    );

            },
            0
        );


    definirTextoEquipamentos(
        "equipamentos-total-manutencoes",
        manutencoesEquipamentos.length
    );


    definirTextoEquipamentos(
        "equipamentos-manutencoes-preventivas",
        preventivas
    );


    definirTextoEquipamentos(
        "equipamentos-manutencoes-corretivas",
        corretivas
    );


    definirTextoEquipamentos(
        "equipamentos-manutencoes-custo",
        formatarDinheiro(
            custoTotal
        )
    );

}


// =========================
// MOSTRAR MANUTENÇÕES
// =========================

function mostrarManutencoesEquipamentos() {

    if (!listaManutencoes) {

        atualizarResumoManutencoes();

        return;

    }


    if (
        manutencoesEquipamentos.length === 0
    ) {

        listaManutencoes.innerHTML =
            "<p>Nenhuma manutenção registrada.</p>";


        atualizarResumoManutencoes();

        return;

    }


    const manutencoesOrdenadas =
        [...manutencoesEquipamentos].sort(
            function (a, b) {

                return String(
                    b.data || ""
                ).localeCompare(
                    String(a.data || "")
                );

            }
        );


    listaManutencoes.innerHTML =
        manutencoesOrdenadas.map(
            function (manutencao) {

                let itensUtilizados =
                    "Nenhum item do estoque utilizado";


                const itens = [];


                if (manutencao.pecaNome) {

                    itens.push(
                        `${manutencao.quantidadePeca} unidade(s) de ${escaparTexto(
                            manutencao.pecaNome
                        )}`
                    );

                }


                if (
                    manutencao.lubrificanteNome
                ) {

                    itens.push(
                        `${Number(
                            manutencao
                                .quantidadeLubrificante ||
                            0
                        ).toLocaleString(
                            "pt-BR",
                            {
                                maximumFractionDigits: 2
                            }
                        )} de ${escaparTexto(
                            manutencao
                                .lubrificanteNome
                        )}`
                    );

                }


                if (itens.length > 0) {

                    itensUtilizados =
                        itens.join(" + ");

                }


                return `
                    <div class="card-item">

                        <h4>
                            ${escaparTexto(
                                manutencao.tipo
                            )} —
                            ${escaparTexto(
                                manutencao.impressoraNome
                            )}
                        </h4>

                        <p>
                            <strong>Data:</strong>

                            ${formatarDataEquipamentos(
                                manutencao.data
                            )}
                        </p>

                        <p>
                            <strong>
                                Horas da impressora:
                            </strong>

                            ${formatarHorasEquipamentos(
                                manutencao
                                    .horasImpressora
                            )}
                        </p>

                        <p>
                            <strong>
                                Serviço realizado:
                            </strong>

                            ${escaparTexto(
                                manutencao.descricao ||
                                "Não informado"
                            )}
                        </p>

                        <p>
                            <strong>
                                Materiais utilizados:
                            </strong>

                            ${itensUtilizados}
                        </p>

                        <p>
                            <strong>
                                Custo das peças:
                            </strong>

                            ${formatarDinheiro(
                                manutencao.custoPeca
                            )}
                        </p>

                        <p>
                            <strong>
                                Custo dos lubrificantes:
                            </strong>

                            ${formatarDinheiro(
                                manutencao
                                    .custoLubrificante
                            )}
                        </p>

                        <p>
                            <strong>
                                Serviço ou mão de obra:
                            </strong>

                            ${formatarDinheiro(
                                manutencao.custoServico
                            )}
                        </p>

                        <p>
                            <strong>
                                Custo total:
                            </strong>

                            ${formatarDinheiro(
                                manutencao.custoTotal
                            )}
                        </p>

                        <p>
                            <strong>
                                Responsável:
                            </strong>

                            ${escaparTexto(
                                manutencao.responsavel ||
                                "Não informado"
                            )}
                        </p>

                        <p>
                            <strong>
                                Próxima manutenção:
                            </strong>

                            ${formatarDataEquipamentos(
                                manutencao.proximaData
                            )}
                        </p>

                        <p>
                            <strong>
                                Próxima manutenção por horas:
                            </strong>

                            ${
                                Number(
                                    manutencao
                                        .proximasHoras ||
                                    0
                                ) > 0

                                    ? formatarHorasEquipamentos(
                                        manutencao
                                            .proximasHoras
                                    )

                                    : "Não informada"
                            }
                        </p>

                        <p>
                            <strong>
                                Observações:
                            </strong>

                            ${escaparTexto(
                                manutencao.observacoes ||
                                "Nenhuma"
                            )}
                        </p>

                        <button
                            type="button"
                            class="botao-excluir"
                            onclick="excluirManutencaoEquipamento(${manutencao.id})">

                            Excluir registro

                        </button>

                    </div>
                `;

            }
        ).join("");


    atualizarResumoManutencoes();

}


// =========================
// PREENCHER HORAS DA IMPRESSORA
// =========================

const campoImpressoraManutencao =
    document.getElementById(
        "manutencao-impressora"
    );


if (campoImpressoraManutencao) {

    campoImpressoraManutencao
        .addEventListener(
            "change",
            function () {

                const impressoraId =
                    Number(
                        campoImpressoraManutencao
                            .value
                    );


                const impressora =
                    impressoras.find(
                        function (item) {

                            return item.id ===
                                impressoraId;

                        }
                    );


                definirValorCampoEquipamentos(
                    "manutencao-horas",
                    impressora
                        ? obterTotalHorasImpressora(
                            impressora
                        )
                        : ""
                );

            }
        );

}


// =========================
// LIMPAR FORMULÁRIO
// =========================

function limparFormularioManutencao() {

    manutencaoEmEdicaoId = null;


    [
        "manutencao-impressora",
        "manutencao-tipo",
        "manutencao-data",
        "manutencao-horas",
        "manutencao-descricao",
        "manutencao-peca",
        "manutencao-quantidade-peca",
        "manutencao-lubrificante",
        "manutencao-quantidade-lubrificante",
        "manutencao-custo-servico",
        "manutencao-responsavel",
        "manutencao-proxima-data",
        "manutencao-proximas-horas",
        "manutencao-observacoes"
    ].forEach(
        function (id) {

            definirValorCampoEquipamentos(
                id,
                ""
            );

        }
    );


    definirValorCampoEquipamentos(
        "manutencao-tipo",
        "Preventiva"
    );


    definirValorCampoEquipamentos(
        "manutencao-data",
        obterDataHojeEquipamentos()
    );


    definirValorCampoEquipamentos(
        "manutencao-quantidade-peca",
        "0"
    );


    definirValorCampoEquipamentos(
        "manutencao-quantidade-lubrificante",
        "0"
    );


    definirValorCampoEquipamentos(
        "manutencao-custo-servico",
        "0"
    );


    if (botaoSalvarManutencao) {

        botaoSalvarManutencao.textContent =
            "Registrar Manutenção";

    }

}


if (botaoLimparFormularioManutencao) {

    botaoLimparFormularioManutencao
        .addEventListener(
            "click",
            limparFormularioManutencao
        );

}
// =========================
// LANÇAR DESPESA DE MANUTENÇÃO
// =========================

function lancarDespesaManutencaoFinanceiro(
    manutencao
) {

    if (
        typeof lancamentosFinanceiros ===
        "undefined"
    ) {

        console.warn(
            "O módulo Financeiro ainda não está disponível."
        );

        return null;

    }


    const custoTotal =
        Number(
            manutencao.custoTotal || 0
        );


    if (custoTotal <= 0) {

        return null;

    }


    const lancamentoId =
        Date.now() +
        Math.random();


    const novoLancamento = {

        id:
            lancamentoId,

        tipo:
            "Despesa",

        categoria:
            "Manutenção de equipamentos",

        descricao:
            `Manutenção ${manutencao.tipo.toLowerCase()} — ${manutencao.impressoraNome}`,

        valor:
            custoTotal,

        data:
            manutencao.data,

        formaPagamento:
            "Não informada",

        situacao:
            "Pago",

        valorPago:
            custoTotal,

        encomenda:
            "",

        origem:
            "Equipamentos",

        observacoes:
            `Lançamento automático referente à manutenção: ${manutencao.descricao || "serviço não informado"}.`,

        manutencaoId:
            manutencao.id
    };


    lancamentosFinanceiros.push(
        novoLancamento
    );


    if (
        typeof salvarLancamentosFinanceiros ===
        "function"
    ) {

        salvarLancamentosFinanceiros();

    }


    if (
        typeof mostrarLancamentosFinanceiros ===
        "function"
    ) {

        mostrarLancamentosFinanceiros();

    } else if (
        typeof mostrarLancamentos ===
        "function"
    ) {

        mostrarLancamentos();

    }


    if (
        typeof atualizarResumoFinanceiro ===
        "function"
    ) {

        atualizarResumoFinanceiro();

    }


    return lancamentoId;

}


// =========================
// SALVAR MANUTENÇÃO
// =========================

if (botaoSalvarManutencao) {

    botaoSalvarManutencao.addEventListener(
        "click",
        function () {

            const impressoraId =
                Number(
                    obterTextoCampoEquipamentos(
                        "manutencao-impressora"
                    )
                );


            const tipo =
                obterTextoCampoEquipamentos(
                    "manutencao-tipo"
                ) || "Preventiva";


            const data =
                obterTextoCampoEquipamentos(
                    "manutencao-data"
                );


            const horasImpressora =
                obterNumeroCampoEquipamentos(
                    "manutencao-horas"
                );


            const descricao =
                obterTextoCampoEquipamentos(
                    "manutencao-descricao"
                );


            const pecaIdTexto =
                obterTextoCampoEquipamentos(
                    "manutencao-peca"
                );


            const pecaId =
                pecaIdTexto
                    ? Number(pecaIdTexto)
                    : null;


            const quantidadePeca =
                obterNumeroCampoEquipamentos(
                    "manutencao-quantidade-peca"
                );


            const lubrificanteIdTexto =
                obterTextoCampoEquipamentos(
                    "manutencao-lubrificante"
                );


            const lubrificanteId =
                lubrificanteIdTexto
                    ? Number(
                        lubrificanteIdTexto
                    )
                    : null;


            const quantidadeLubrificante =
                obterNumeroCampoEquipamentos(
                    "manutencao-quantidade-lubrificante"
                );


            const custoServico =
                obterNumeroCampoEquipamentos(
                    "manutencao-custo-servico"
                );


            const responsavel =
                obterTextoCampoEquipamentos(
                    "manutencao-responsavel"
                );


            const proximaData =
                obterTextoCampoEquipamentos(
                    "manutencao-proxima-data"
                );


            const proximasHoras =
                obterNumeroCampoEquipamentos(
                    "manutencao-proximas-horas"
                );


            const observacoes =
                obterTextoCampoEquipamentos(
                    "manutencao-observacoes"
                );


            const impressora =
                impressoras.find(
                    function (item) {

                        return item.id ===
                            impressoraId;

                    }
                );


            if (!impressora) {

                alert(
                    "Selecione uma impressora."
                );

                return;

            }


            if (!data) {

                alert(
                    "Informe a data da manutenção."
                );

                return;

            }


            if (!descricao) {

                alert(
                    "Informe o serviço realizado."
                );

                return;

            }


            if (
                Number.isNaN(
                    horasImpressora
                ) ||
                horasImpressora < 0
            ) {

                alert(
                    "Informe uma quantidade válida de horas."
                );

                return;

            }


            if (
                Number.isNaN(
                    custoServico
                ) ||
                custoServico < 0
            ) {

                alert(
                    "Informe um custo de serviço válido."
                );

                return;

            }


            if (
                Number.isNaN(
                    proximasHoras
                ) ||
                proximasHoras < 0
            ) {

                alert(
                    "Informe uma quantidade válida para a próxima manutenção por horas."
                );

                return;

            }


            let peca = null;

            let custoPeca = 0;


            if (pecaId) {

                peca =
                    pecasEquipamentos.find(
                        function (item) {

                            return item.id ===
                                pecaId;

                        }
                    );


                if (!peca) {

                    alert(
                        "A peça selecionada não foi encontrada."
                    );

                    return;

                }


                if (
                    Number.isNaN(
                        quantidadePeca
                    ) ||
                    quantidadePeca <= 0
                ) {

                    alert(
                        "Informe a quantidade da peça utilizada."
                    );

                    return;

                }


                if (
                    quantidadePeca >
                    Number(
                        peca.quantidadeAtual ||
                        0
                    )
                ) {

                    alert(
                        `Estoque insuficiente de ${peca.nome}.\n\nEstoque disponível: ${peca.quantidadeAtual}.`
                    );

                    return;

                }


                custoPeca =
                    quantidadePeca *

                    Number(
                        peca.valorUnitario ||
                        0
                    );

            } else if (
                quantidadePeca > 0
            ) {

                alert(
                    "Selecione a peça utilizada."
                );

                return;

            }


            let lubrificante = null;

            let custoLubrificante = 0;


            if (lubrificanteId) {

                lubrificante =
                    lubrificantesEquipamentos.find(
                        function (item) {

                            return item.id ===
                                lubrificanteId;

                        }
                    );


                if (!lubrificante) {

                    alert(
                        "O lubrificante selecionado não foi encontrado."
                    );

                    return;

                }


                if (
                    Number.isNaN(
                        quantidadeLubrificante
                    ) ||
                    quantidadeLubrificante <= 0
                ) {

                    alert(
                        "Informe a quantidade de lubrificante utilizada."
                    );

                    return;

                }


                if (
                    quantidadeLubrificante >
                    Number(
                        lubrificante
                            .quantidadeAtual ||
                        0
                    )
                ) {

                    alert(
                        `Estoque insuficiente de ${lubrificante.nome}.\n\nEstoque disponível: ${lubrificante.quantidadeAtual} ${lubrificante.unidade}.`
                    );

                    return;

                }


                custoLubrificante =
                    quantidadeLubrificante *

                    Number(
                        lubrificante
                            .valorUnitario ||
                        0
                    );

            } else if (
                quantidadeLubrificante > 0
            ) {

                alert(
                    "Selecione o lubrificante utilizado."
                );

                return;

            }


            if (
                proximaData &&
                proximaData < data
            ) {

                alert(
                    "A próxima manutenção não pode ter uma data anterior à manutenção atual."
                );

                return;

            }


            const custoTotal =
                custoPeca +
                custoLubrificante +
                custoServico;


            const novaManutencao = {

                id:
                    Date.now() +
                    Math.random(),

                impressoraId:
                    impressora.id,

                impressoraNome:
                    impressora.nome,

                tipo:
                    tipo,

                data:
                    data,

                horasImpressora:
                    horasImpressora,

                descricao:
                    descricao,

                pecaId:
                    peca
                        ? peca.id
                        : null,

                pecaNome:
                    peca
                        ? peca.nome
                        : "",

                quantidadePeca:
                    peca
                        ? quantidadePeca
                        : 0,

                custoPeca:
                    custoPeca,

                lubrificanteId:
                    lubrificante
                        ? lubrificante.id
                        : null,

                lubrificanteNome:
                    lubrificante
                        ? lubrificante.nome
                        : "",

                quantidadeLubrificante:
                    lubrificante
                        ? quantidadeLubrificante
                        : 0,

                custoLubrificante:
                    custoLubrificante,

                custoServico:
                    custoServico,

                custoTotal:
                    custoTotal,

                responsavel:
                    responsavel,

                proximaData:
                    proximaData,

                proximasHoras:
                    proximasHoras,

                observacoes:
                    observacoes,

                lancamentoFinanceiroId:
                    null
            };


            // Baixa da peça no estoque

            if (peca) {

                peca.quantidadeAtual =
                    Number(
                        peca.quantidadeAtual ||
                        0
                    ) -
                    quantidadePeca;

            }


            // Baixa do lubrificante no estoque

            if (lubrificante) {

                lubrificante.quantidadeAtual =
                    Number(
                        lubrificante
                            .quantidadeAtual ||
                        0
                    ) -
                    quantidadeLubrificante;

            }


            // Atualiza os dados de manutenção
            // da impressora

            impressora.ultimaManutencao =
                data;


            if (proximaData) {

                impressora.proximaManutencao =
                    proximaData;

            }


            if (proximasHoras > 0) {

                impressora
                    .proximasHorasManutencao =
                    proximasHoras;

            }


            if (
                impressora.status ===
                "Em manutenção"
            ) {

                impressora.status =
                    "Ativa";

            }


            manutencoesEquipamentos.push(
                novaManutencao
            );


            salvarImpressoras();

            salvarPecasEquipamentos();

            salvarLubrificantesEquipamentos();

            salvarManutencoesEquipamentos();


            novaManutencao
                .lancamentoFinanceiroId =
                lancarDespesaManutencaoFinanceiro(
                    novaManutencao
                );


            salvarManutencoesEquipamentos();


            registrarDiarioEquipamento({

                data:
                    data,

                impressoraId:
                    impressora.id,

                impressoraNome:
                    impressora.nome,

                tipo:
                    "Manutenção",

                titulo:
                    `${tipo} realizada`,

                descricao:
                    `${descricao}. Custo total: ${formatarDinheiro(
                        custoTotal
                    )}.`

            });


            mostrarImpressoras();

            mostrarPecasEquipamentos();

            mostrarLubrificantesEquipamentos();

            mostrarManutencoesEquipamentos();

            atualizarOpcoesEquipamentos();

            limparFormularioManutencao();


            alert(
                custoTotal > 0

                    ? "Manutenção registrada e despesa lançada no Financeiro!"

                    : "Manutenção registrada com sucesso!"
            );

        }
    );

}


// =========================
// REMOVER DESPESA DA MANUTENÇÃO
// =========================

function removerDespesaManutencaoFinanceiro(
    manutencao
) {

    if (
        typeof lancamentosFinanceiros ===
        "undefined"
    ) {

        return;

    }


    lancamentosFinanceiros =
        lancamentosFinanceiros.filter(
            function (lancamento) {

                const mesmoId =
                    manutencao
                        .lancamentoFinanceiroId &&

                    lancamento.id ===
                    manutencao
                        .lancamentoFinanceiroId;


                const mesmaManutencao =
                    lancamento.manutencaoId ===
                    manutencao.id;


                return !(
                    mesmoId ||
                    mesmaManutencao
                );

            }
        );


    if (
        typeof salvarLancamentosFinanceiros ===
        "function"
    ) {

        salvarLancamentosFinanceiros();

    }


    if (
        typeof mostrarLancamentosFinanceiros ===
        "function"
    ) {

        mostrarLancamentosFinanceiros();

    } else if (
        typeof mostrarLancamentos ===
        "function"
    ) {

        mostrarLancamentos();

    }


    if (
        typeof atualizarResumoFinanceiro ===
        "function"
    ) {

        atualizarResumoFinanceiro();

    }

}


// =========================
// EXCLUIR MANUTENÇÃO
// =========================

window.excluirManutencaoEquipamento =
    function (id) {

        const manutencao =
            manutencoesEquipamentos.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!manutencao) {

            alert(
                "Manutenção não encontrada."
            );

            return;

        }


        const confirmar =
            confirm(
                "Deseja excluir este registro de manutenção?\n\nAs peças e os lubrificantes utilizados voltarão para o estoque. A despesa automática também será removida do Financeiro."
            );


        if (!confirmar) {

            return;

        }


        if (manutencao.pecaId) {

            const peca =
                pecasEquipamentos.find(
                    function (item) {

                        return item.id ===
                            manutencao.pecaId;

                    }
                );


            if (peca) {

                peca.quantidadeAtual =
                    Number(
                        peca.quantidadeAtual ||
                        0
                    ) +

                    Number(
                        manutencao
                            .quantidadePeca ||
                        0
                    );

            }

        }


        if (
            manutencao.lubrificanteId
        ) {

            const lubrificante =
                lubrificantesEquipamentos.find(
                    function (item) {

                        return item.id ===
                            manutencao
                                .lubrificanteId;

                    }
                );


            if (lubrificante) {

                lubrificante.quantidadeAtual =
                    Number(
                        lubrificante
                            .quantidadeAtual ||
                        0
                    ) +

                    Number(
                        manutencao
                            .quantidadeLubrificante ||
                        0
                    );

            }

        }


        removerDespesaManutencaoFinanceiro(
            manutencao
        );


        manutencoesEquipamentos =
            manutencoesEquipamentos.filter(
                function (item) {

                    return item.id !== id;

                }
            );


        salvarPecasEquipamentos();

        salvarLubrificantesEquipamentos();

        salvarManutencoesEquipamentos();


        registrarDiarioEquipamento({

            data:
                obterDataHojeEquipamentos(),

            impressoraId:
                manutencao.impressoraId,

            impressoraNome:
                manutencao.impressoraNome,

            tipo:
                "Manutenção",

            titulo:
                "Registro de manutenção excluído",

            descricao:
                `A manutenção de ${formatarDataEquipamentos(
                    manutencao.data
                )} foi excluída e os materiais retornaram ao estoque.`

        });


        mostrarPecasEquipamentos();

        mostrarLubrificantesEquipamentos();

        mostrarManutencoesEquipamentos();

        atualizarOpcoesEquipamentos();


        alert(
            "Manutenção excluída com sucesso!"
        );

    };
// =========================
// HORAS DE USO
// PARTE 8A
// =========================

const botaoSalvarAjusteHoras =
    document.getElementById(
        "salvar-ajuste-horas"
    );

const botaoLimparAjusteHoras =
    document.getElementById(
        "limpar-ajuste-horas"
    );

const listaAjustesHoras =
    document.getElementById(
        "lista-ajustes-horas"
    );

const campoImpressoraHoras =
    document.getElementById(
        "horas-impressora"
    );

// =========================
// ATUALIZAR HORAS NAS IMPRESSORAS
// =========================

function atualizarHorasDasImpressoras() {

    impressoras.forEach(
        function (impressora) {

            impressora.totalHoras =
                obterTotalHorasImpressora(
                    impressora
                );

        }
    );


    salvarImpressoras();

}


// =========================
// RESUMO DAS HORAS
// =========================

function atualizarResumoHorasEquipamentos() {

    const totalHoras =
        impressoras.reduce(
            function (total, impressora) {

                return total +
                    obterTotalHorasImpressora(
                        impressora
                    );

            },
            0
        );


    const horasManuais =
        registrosHorasEquipamentos.reduce(
            function (total, ajuste) {

                return total +
                    Number(
                        ajuste.horas || 0
                    );

            },
            0
        );


    const horasProducao =
        impressoras.reduce(
            function (total, impressora) {

                return total +
                    Number(
                        impressora.horasProducoes ||
                        0
                    );

            },
            0
        );


    definirTextoEquipamentos(
        "equipamentos-total-horas",
        formatarHorasEquipamentos(
            totalHoras
        )
    );


    definirTextoEquipamentos(
        "equipamentos-horas-producao",
        formatarHorasEquipamentos(
            horasProducao
        )
    );


    definirTextoEquipamentos(
        "equipamentos-horas-manuais",
        formatarHorasEquipamentos(
            horasManuais
        )
    );


    definirTextoEquipamentos(
        "horas-total-geral",
        formatarHorasEquipamentos(
            totalHoras
        )
    );

}


// =========================
// MOSTRAR HORAS POR IMPRESSORA
// =========================

function mostrarResumoHorasImpressoras() {

    const lista =
        document.getElementById(
            "lista-horas-impressoras"
        );


    if (!lista) {
        return;
    }


    if (impressoras.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma impressora cadastrada.</p>";

        return;

    }


    lista.innerHTML =
        impressoras.map(
            function (impressora) {

                const totalHoras =
                    obterTotalHorasImpressora(
                        impressora
                    );


                const proximaManutencaoHoras =
                    Number(
                        impressora
                            .proximasHorasManutencao ||
                        0
                    );


                let situacaoManutencao =
                    "Sem manutenção programada por horas";


                if (
                    proximaManutencaoHoras > 0
                ) {

                    const horasRestantes =
                        proximaManutencaoHoras -
                        totalHoras;


                    if (horasRestantes <= 0) {

                        situacaoManutencao =
                            "⚠️ Manutenção por horas vencida";

                    } else {

                        situacaoManutencao =
                            `Próxima manutenção em ${formatarHorasEquipamentos(
                                horasRestantes
                            )}`;

                    }

                }


                return `
                    <div class="card-item">

                        <h4>
                            ${escaparTexto(
                                impressora.nome
                            )}
                        </h4>

                        <p>
                            <strong>Modelo:</strong>

                            ${escaparTexto(
                                impressora.modelo ||
                                "Não informado"
                            )}
                        </p>

                        <p>
                            <strong>
                                Horas iniciais:
                            </strong>

                            ${formatarHorasEquipamentos(
                                impressora.horasIniciais ||
                                impressora.horasUso ||
                                0
                            )}
                        </p>

                        <p>
                            <strong>
                                Horas de produção:
                            </strong>

                            ${formatarHorasEquipamentos(
                                impressora.horasProducoes ||
                                0
                            )}
                        </p>

                        <p>
                            <strong>
                                Total acumulado:
                            </strong>

                            ${formatarHorasEquipamentos(
                                totalHoras
                            )}
                        </p>

                        <p>
                            <strong>
                                Manutenção:
                            </strong>

                            ${situacaoManutencao}
                        </p>

                    </div>
                `;

            }
        ).join("");

}


// =========================
// MOSTRAR HISTÓRICO DE AJUSTES
// =========================

function mostrarAjustesHorasEquipamentos() {

    if (!listaAjustesHoras) {

        atualizarResumoHorasEquipamentos();

        mostrarResumoHorasImpressoras();

        return;

    }


    if (
        registrosHorasEquipamentos.length ===
        0
    ) {

        listaAjustesHoras.innerHTML =
            "<p>Nenhum ajuste manual de horas registrado.</p>";


        atualizarResumoHorasEquipamentos();

        mostrarResumoHorasImpressoras();

        return;

    }


    const ajustesOrdenados =
        [...registrosHorasEquipamentos].sort(
            function (a, b) {

                return String(
                    b.data || ""
                ).localeCompare(
                    String(a.data || "")
                );

            }
        );


    listaAjustesHoras.innerHTML =
        ajustesOrdenados.map(
            function (ajuste) {

                const horas =
                    Number(
                        ajuste.horas || 0
                    );


                
                return `
                    <div class="card-item">

                        <h4>
                            ${escaparTexto(
                                ajuste.impressoraNome
                            )}
                        </h4>

                        <p>
                            <strong>Data:</strong>

                            ${formatarDataEquipamentos(
                                ajuste.data
                            )}
                        </p>

                        <p>
                            <strong>Ajuste:</strong>

                           ${formatarHorasEquipamentos(
    horas
)}
                        </p>

                        <p>
                            <strong>Motivo:</strong>

                            ${escaparTexto(
                                ajuste.motivo ||
                                "Não informado"
                            )}
                        </p>

                                                <p>
                            <strong>Observações:</strong>

                            ${escaparTexto(
                                ajuste.observacoes ||
                                "Nenhuma"
                            )}
                    
                        </p>

                        <button
                            type="button"
                            class="botao-excluir"
                            onclick="excluirAjusteHorasEquipamento(${ajuste.id})">

                            Excluir ajuste

                        </button>

                    </div>
                `;

            }
        ).join("");


    atualizarResumoHorasEquipamentos();

    mostrarResumoHorasImpressoras();

}


// =========================
// MOSTRAR HORAS DA IMPRESSORA SELECIONADA
// =========================

function mostrarHorasImpressoraSelecionada() {

    if (!campoImpressoraHoras) {
        return;
    }


    const impressoraId =
        Number(
            campoImpressoraHoras.value
        );


    const impressora =
        impressoras.find(
            function (item) {

                return item.id ===
                    impressoraId;

            }
        );


    const totalHoras =
        impressora
            ? obterTotalHorasImpressora(
                impressora
            )
            : 0;


    definirTextoEquipamentos(
        "horas-atual-impressora",
        impressora
            ? formatarHorasEquipamentos(
                totalHoras
            )
            : "0h"
    );

}


if (campoImpressoraHoras) {

    campoImpressoraHoras.addEventListener(
        "change",
        mostrarHorasImpressoraSelecionada
    );

}


// =========================
// LIMPAR FORMULÁRIO DE HORAS
// =========================

function limparFormularioAjusteHoras() {

    definirValorCampoEquipamentos(
        "horas-impressora",
        ""
    );


    definirValorCampoEquipamentos(
        "horas-data",
        obterDataHojeEquipamentos()
    );


    definirValorCampoEquipamentos(
        "horas-quantidade",
        ""
    );


    definirValorCampoEquipamentos(
        "horas-motivo",
        ""
    );


    definirValorCampoEquipamentos(
        "horas-observacoes",
        ""
    );


    definirTextoEquipamentos(
        "horas-atual-impressora",
        "0h"
    );

}


if (botaoLimparAjusteHoras) {

    botaoLimparAjusteHoras.addEventListener(
        "click",
        limparFormularioAjusteHoras
    );

}
// =========================
// SALVAR AJUSTE MANUAL DE HORAS
// =========================

if (botaoSalvarAjusteHoras) {

    botaoSalvarAjusteHoras.addEventListener(
        "click",
        function () {

            const impressoraId =
                Number(
                    obterTextoCampoEquipamentos(
                        "horas-impressora"
                    )
                );


            const data =
                obterTextoCampoEquipamentos(
                    "horas-data"
                );


            const quantidadeHoras =
                obterNumeroCampoEquipamentos(
                    "horas-quantidade"
                );


            const motivo =
                obterTextoCampoEquipamentos(
                    "horas-motivo"
                );


            const observacoes =
                obterTextoCampoEquipamentos(
                    "horas-observacoes"
                );


            const impressora =
                impressoras.find(
                    function (item) {

                        return item.id ===
                            impressoraId;

                    }
                );


            if (!impressora) {

                alert(
                    "Selecione uma impressora."
                );

                return;

            }


            if (!data) {

                alert(
                    "Informe a data do ajuste."
                );

                return;

            }


            if (
                Number.isNaN(
                    quantidadeHoras
                ) ||
                quantidadeHoras === 0
            ) {

                alert(
                    "Informe uma quantidade de horas diferente de zero."
                );

                return;

            }


            if (!motivo) {

                alert(
                    "Informe o motivo do ajuste."
                );

                return;

            }


            const totalAntes =
                obterTotalHorasImpressora(
                    impressora
                );


            const totalDepois =
                totalAntes +
                quantidadeHoras;


            if (totalDepois < 0) {

                alert(
                    `Este ajuste deixaria a impressora com horas negativas.\n\nHoras atuais: ${formatarHorasEquipamentos(
                        totalAntes
                    )}.`
                );

                return;

            }


            const novoAjuste = {

                id:
                    Date.now() +
                    Math.random(),

                impressoraId:
                    impressora.id,

                impressoraNome:
                    impressora.nome,

                data:
                    data,

                horas:
                    quantidadeHoras,

                motivo:
                    motivo,

                observacoes:
                    observacoes,

                totalAntes:
                    totalAntes,

                totalDepois:
                    totalDepois,

                criadoEm:
                    new Date()
                        .toISOString()
            };


                        registrosHorasEquipamentos.push(
                novoAjuste
            );


            impressora.horasAjustes =
                Number(
                    impressora.horasAjustes || 0
                ) +
                quantidadeHoras;


            salvarRegistrosHorasEquipamentos();

            atualizarHorasDasImpressoras();

            registrarDiarioEquipamento({

                data:
                    data,

                impressoraId:
                    impressora.id,

                impressoraNome:
                    impressora.nome,

                tipo:
                    "Horas",

                titulo:
                    quantidadeHoras > 0
                        ? "Horas adicionadas manualmente"
                        : "Horas removidas manualmente",

                descricao:
                    `${formatarHorasEquipamentos(
                        Math.abs(
                            quantidadeHoras
                        )
                    )} ${
                        quantidadeHoras > 0
                            ? "adicionadas"
                            : "removidas"
                    }. Motivo: ${motivo}. Total após o ajuste: ${formatarHorasEquipamentos(
                        totalDepois
                    )}.`

            });


            mostrarAjustesHorasEquipamentos();

            mostrarImpressoras();

            atualizarResumoHorasEquipamentos();

            limparFormularioAjusteHoras();


            alert(
                "Ajuste de horas registrado com sucesso!"
            );

        }
    );

}


// =========================
// EXCLUIR AJUSTE DE HORAS
// =========================

window.excluirAjusteHorasEquipamento =
    function (id) {

        const ajuste =
            registrosHorasEquipamentos.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!ajuste) {

            alert(
                "Ajuste de horas não encontrado."
            );

            return;

        }


        const impressora =
            impressoras.find(
                function (item) {

                    return item.id ===
                        ajuste.impressoraId;

                }
            );


        if (impressora) {

            const totalAtual =
                obterTotalHorasImpressora(
                    impressora
                );


            const totalAposExclusao =
                totalAtual -
                Number(
                    ajuste.horas || 0
                );


            if (totalAposExclusao < 0) {

                alert(
                    "Este ajuste não pode ser excluído porque deixaria a impressora com horas negativas."
                );

                return;

            }

        }


        const confirmar =
            confirm(
                `Deseja excluir o ajuste de ${formatarHorasEquipamentos(
                    Math.abs(
                        ajuste.horas || 0
                    )
                )} da impressora "${ajuste.impressoraNome}"?`
            );


        if (!confirmar) {

            return;

        }


        registrosHorasEquipamentos =
    registrosHorasEquipamentos.filter(
        function (item) {

            return item.id !== id;

        }
    );


if (impressora) {

    impressora.horasAjustes =
        Number(
            impressora.horasAjustes || 0
        ) -
        Number(
            ajuste.horas || 0
        );

}


salvarRegistrosHorasEquipamentos();

        atualizarHorasDasImpressoras();


        registrarDiarioEquipamento({

            data:
                obterDataHojeEquipamentos(),

            impressoraId:
                ajuste.impressoraId,

            impressoraNome:
                ajuste.impressoraNome,

            tipo:
                "Horas",

            titulo:
                "Ajuste manual excluído",

            descricao:
                `O ajuste de ${formatarHorasEquipamentos(
                    Math.abs(
                        ajuste.horas || 0
                    )
                )} referente ao motivo "${ajuste.motivo}" foi excluído.`

        });


        mostrarAjustesHorasEquipamentos();

        mostrarImpressoras();

        atualizarResumoHorasEquipamentos();


        alert(
            "Ajuste de horas excluído com sucesso!"
        );

    };


// =========================
// ADICIONAR HORAS AUTOMATICAMENTE
// PELA PRODUÇÃO
// =========================

window.adicionarHorasProducaoEquipamento =
    function (
        impressoraId,
        horas,
        descricao,
        data
    ) {

        const id =
            Number(
                impressoraId
            );


        const quantidadeHoras =
            Number(
                horas || 0
            );


        const impressora =
            impressoras.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (
            !impressora ||
            Number.isNaN(
                quantidadeHoras
            ) ||
            quantidadeHoras <= 0
        ) {

            return false;

        }


        impressora.horasProducoes =
            Number(
                impressora.horasProducoes ||
                0
            ) +
            quantidadeHoras;


        impressora.totalHoras =
            obterTotalHorasImpressora(
                impressora
            );


        salvarImpressoras();


        registrarDiarioEquipamento({

            data:
                data ||
                obterDataHojeEquipamentos(),

            impressoraId:
                impressora.id,

            impressoraNome:
                impressora.nome,

            tipo:
                "Produção",

            titulo:
                "Horas adicionadas pela produção",

            descricao:
                `${formatarHorasEquipamentos(
                    quantidadeHoras
                )} adicionadas automaticamente. ${
                    descricao ||
                    "Produção registrada no sistema."
                }`

        });


        mostrarImpressoras();

        mostrarAjustesHorasEquipamentos();

        atualizarResumoHorasEquipamentos();


        return true;

    };


// =========================
// REMOVER HORAS AUTOMÁTICAS
// EM CASO DE EXCLUSÃO DA PRODUÇÃO
// =========================

window.removerHorasProducaoEquipamento =
    function (
        impressoraId,
        horas,
        descricao,
        data
    ) {

        const id =
            Number(
                impressoraId
            );


        const quantidadeHoras =
            Number(
                horas || 0
            );


        const impressora =
            impressoras.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (
            !impressora ||
            Number.isNaN(
                quantidadeHoras
            ) ||
            quantidadeHoras <= 0
        ) {

            return false;

        }


        const horasProducaoAtuais =
    Number(
        impressora.horasProducoes ||
        0
    );


impressora.horasProducoes =
    Math.max(
        0,
        horasProducaoAtuais -
        quantidadeHoras
    );


        impressora.totalHoras =
            obterTotalHorasImpressora(
                impressora
            );


        salvarImpressoras();


        registrarDiarioEquipamento({

            data:
                data ||
                obterDataHojeEquipamentos(),

            impressoraId:
                impressora.id,

            impressoraNome:
                impressora.nome,

            tipo:
                "Produção",

            titulo:
                "Horas de produção removidas",

            descricao:
                `${formatarHorasEquipamentos(
                    quantidadeHoras
                )} removidas automaticamente. ${
                    descricao ||
                    "Produção excluída do sistema."
                }`

        });


        mostrarImpressoras();

        mostrarAjustesHorasEquipamentos();

        atualizarResumoHorasEquipamentos();


        return true;

    };
    // =========================
// DIÁRIO DOS EQUIPAMENTOS
// PARTE 9A
// =========================

const botaoSalvarDiarioEquipamento =
    document.getElementById(
        "salvar-diario-equipamento"
    );

const botaoLimparDiarioEquipamento =
    document.getElementById(
        "limpar-diario-equipamento"
    );

const listaDiarioEquipamentos =
    document.getElementById(
        "lista-diario-equipamentos"
    );

const campoDiarioImpressora =
    document.getElementById(
        "diario-impressora"
    );

const campoDiarioData =
    document.getElementById(
        "diario-data"
    );

const campoDiarioTipo =
    document.getElementById(
        "diario-tipo"
    );

const campoDiarioTitulo =
    document.getElementById(
        "diario-titulo"
    );

const campoDiarioDescricao =
    document.getElementById(
        "diario-descricao"
    );


// =========================
// NORMALIZAR DIÁRIO
// =========================

function normalizarDiarioEquipamentos() {

    diarioEquipamentos =
        diarioEquipamentos.map(
            function (registro, indice) {

                return {

                    id:
                        registro.id ||
                        Date.now() +
                        indice +
                        5000,

                    data:
                        registro.data ||
                        obterDataHojeEquipamentos(),

                    impressoraId:
                        registro.impressoraId ||
                        null,

                    impressoraNome:
                        registro.impressoraNome ||
                        "Geral",

                    tipo:
                        registro.tipo ||
                        "Outro",

                    titulo:
                        registro.titulo ||
                        "Ocorrência",

                    descricao:
                        registro.descricao ||
                        "",

                    criadoEm:
                        registro.criadoEm ||
                        new Date()
                            .toISOString()

                };

            }
        );

    salvarDiarioEquipamentos();

}


// =========================
// LIMPAR FORMULÁRIO
// =========================

function limparFormularioDiarioEquipamento() {

    definirValorCampoEquipamentos(
        "diario-impressora",
        ""
    );

    definirValorCampoEquipamentos(
        "diario-data",
        obterDataHojeEquipamentos()
    );

    definirValorCampoEquipamentos(
        "diario-tipo",
        ""
    );

    definirValorCampoEquipamentos(
        "diario-titulo",
        ""
    );

    definirValorCampoEquipamentos(
        "diario-descricao",
        ""
    );

}


// =========================
// MOSTRAR DIÁRIO
// =========================

function mostrarDiarioEquipamentos() {

    if (!listaDiarioEquipamentos) {

        return;

    }

    if (diarioEquipamentos.length === 0) {

        listaDiarioEquipamentos.innerHTML =
            "<p>Nenhum registro no diário.</p>";

        return;

    }

    const registrosOrdenados =
        [...diarioEquipamentos].sort(
            function (a, b) {

                const dataA =
                    `${a.data || ""}-${
                        a.criadoEm || ""
                    }`;

                const dataB =
                    `${b.data || ""}-${
                        b.criadoEm || ""
                    }`;

                return dataB.localeCompare(
                    dataA
                );

            }
        );

    listaDiarioEquipamentos.innerHTML =
        registrosOrdenados.map(
            function (registro) {

                return `
                    <div class="card-item">

                        <h4>
                            ${escaparTexto(
                                registro.titulo
                            )}
                        </h4>

                        <p>
                            <strong>Data:</strong>

                            ${formatarDataEquipamentos(
                                registro.data
                            )}
                        </p>

                        <p>
                            <strong>Impressora:</strong>

                            ${escaparTexto(
                                registro.impressoraNome ||
                                "Geral"
                            )}
                        </p>

                        <p>
                            <strong>Tipo:</strong>

                            ${escaparTexto(
                                registro.tipo ||
                                "Outro"
                            )}
                        </p>

                        <p>
                            <strong>Descrição:</strong>

                            ${escaparTexto(
                                registro.descricao ||
                                "Nenhuma descrição."
                            )}
                        </p>

                        <button
                            type="button"
                            class="botao-excluir"
                            onclick="excluirRegistroDiarioEquipamento(
                                ${registro.id}
                            )">

                            Excluir registro

                        </button>

                    </div>
                `;

            }
        ).join("");

}


// =========================
// SALVAR REGISTRO MANUAL
// =========================

if (botaoSalvarDiarioEquipamento) {

    botaoSalvarDiarioEquipamento
        .addEventListener(
            "click",
            function () {

                const impressoraId =
                    Number(
                        obterTextoCampoEquipamentos(
                            "diario-impressora"
                        )
                    );

                const data =
                    obterTextoCampoEquipamentos(
                        "diario-data"
                    );

                const tipo =
                    obterTextoCampoEquipamentos(
                        "diario-tipo"
                    );

                const titulo =
                    obterTextoCampoEquipamentos(
                        "diario-titulo"
                    );

                const descricao =
                    obterTextoCampoEquipamentos(
                        "diario-descricao"
                    );

                const impressora =
                    impressoras.find(
                        function (item) {

                            return item.id ===
                                impressoraId;

                        }
                    );

                if (!data) {

                    alert(
                        "Informe a data do registro."
                    );

                    return;

                }

                if (!tipo) {

                    alert(
                        "Selecione o tipo do registro."
                    );

                    return;

                }

                if (!titulo) {

                    alert(
                        "Informe o título do registro."
                    );

                    return;

                }

                if (!descricao) {

                    alert(
                        "Informe a descrição do registro."
                    );

                    return;

                }

                const novoRegistro = {

                    id:
                        Date.now() +
                        Math.random(),

                    data:
                        data,

                    impressoraId:
                        impressora
                            ? impressora.id
                            : null,

                    impressoraNome:
                        impressora
                            ? impressora.nome
                            : "Geral",

                    tipo:
                        tipo,

                    titulo:
                        titulo,

                    descricao:
                        descricao,

                    criadoEm:
                        new Date()
                            .toISOString()

                };

                diarioEquipamentos.push(
                    novoRegistro
                );

                salvarDiarioEquipamentos();

                mostrarDiarioEquipamentos();

                limparFormularioDiarioEquipamento();

                alert(
                    "Registro adicionado ao diário com sucesso!"
                );

            }
        );

}


// =========================
// LIMPAR PELO BOTÃO
// =========================

if (botaoLimparDiarioEquipamento) {

    botaoLimparDiarioEquipamento
        .addEventListener(
            "click",
            limparFormularioDiarioEquipamento
        );

}
// =========================
// DIÁRIO DOS EQUIPAMENTOS
// PARTE 9B
// EXCLUIR REGISTRO
// =========================

window.excluirRegistroDiarioEquipamento =
    function (id) {

        const registro =
            diarioEquipamentos.find(
                function (item) {

                    return item.id === id;

                }
            );

        if (!registro) {

            alert(
                "Registro do diário não encontrado."
            );

            return;

        }

        const confirmar =
            confirm(
                `Deseja excluir o registro "${registro.titulo}"?`
            );

        if (!confirmar) {

            return;

        }

        diarioEquipamentos =
            diarioEquipamentos.filter(
                function (item) {

                    return item.id !== id;

                }
            );

        salvarDiarioEquipamentos();

        mostrarDiarioEquipamentos();

        alert(
            "Registro do diário excluído com sucesso!"
        );

    };
    // =========================
// EQUIPAMENTOS
// PARTE 10
// INICIALIZAÇÃO FINAL
// =========================

function iniciarModuloEquipamentos() {

    normalizarDadosEquipamentos();

    normalizarDiarioEquipamentos();

    atualizarHorasDasImpressoras();

    atualizarOpcoesEquipamentos();


    mostrarImpressoras();

    mostrarPecasEquipamentos();

    mostrarLubrificantesEquipamentos();

    mostrarManutencoesEquipamentos();

    mostrarAjustesHorasEquipamentos();

    mostrarDiarioEquipamentos();


    atualizarResumoImpressoras();

    atualizarResumoHorasEquipamentos();


    limparFormularioImpressora();

    limparFormularioPeca();

    limparFormularioLubrificante();

    limparFormularioManutencao();

    limparFormularioAjusteHoras();

    limparFormularioDiarioEquipamento();


    abrirAbaEquipamento(
        "aba-impressoras"
    );

}


// =========================
// INICIAR EQUIPAMENTOS
// =========================

iniciarModuloEquipamentos();
}