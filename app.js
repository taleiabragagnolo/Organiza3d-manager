 document.addEventListener("DOMContentLoaded", function () {
    const botoesMenu = document.querySelectorAll(".menu-item");
    const paginas = document.querySelectorAll(".pagina");

// =========================
// PRODUTOS 2.0
// =========================

let produtos = JSON.parse(
    localStorage.getItem("organiza3d_produtos")
) || [];

const botaoSalvarProduto =
    document.getElementById("salvar-produto");

const botaoLimparFormularioProduto =
    document.getElementById(
        "limpar-formulario-produto"
    );

const listaProdutos =
    document.getElementById("lista-produtos");

const campoProdutoNome =
    document.getElementById("produto-nome");

const campoProdutoCategoria =
    document.getElementById("produto-categoria");

const campoProdutoDescricao =
    document.getElementById("produto-descricao");

const campoProdutoCusto =
    document.getElementById("produto-custo");

const campoProdutoPreco =
    document.getElementById("produto-preco");

const campoProdutoLucro =
    document.getElementById("produto-lucro");

const campoProdutoMargem =
    document.getElementById("produto-margem");

const campoProdutoEstoque =
    document.getElementById("produto-estoque");

const campoProdutoEstoqueMinimo =
    document.getElementById(
        "produto-estoque-minimo"
    );

const campoProdutoStatus =
    document.getElementById("produto-status");

const campoProdutoDataCadastro =
    document.getElementById(
        "produto-data-cadastro"
    );

const campoProdutoObservacoes =
    document.getElementById(
        "produto-observacoes"
    );

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
}

// =========================
// FUNÇÕES GERAIS
// =========================

function formatarDinheiro(valor) {
    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

function escaparTexto(texto) {
    const elemento =
        document.createElement("div");

    elemento.textContent =
        texto === undefined ||
        texto === null
            ? ""
            : String(texto);

    return elemento.innerHTML;
}

// =========================
// FUNÇÕES DOS PRODUTOS
// =========================

function salvarProdutos() {
    localStorage.setItem(
        "organiza3d_produtos",
        JSON.stringify(produtos)
    );
}

function formatarDataProduto(data) {
    if (!data) {
        return "Não informada";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function obterDataHojeProduto() {
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

function calcularLucroProduto(
    custo,
    preco
) {
    return Number(preco || 0) -
        Number(custo || 0);
}

function calcularMargemProduto(
    custo,
    preco
) {
    const precoVenda =
        Number(preco || 0);

    if (precoVenda <= 0) {
        return 0;
    }

    const lucro =
        calcularLucroProduto(
            custo,
            precoVenda
        );

    return (lucro / precoVenda) * 100;
}

function definirStatusProduto(
    estoque,
    estoqueMinimo
) {
    const quantidade =
        Number(estoque || 0);

    const minimo =
        Number(estoqueMinimo || 0);

    if (quantidade <= 0) {
        return "Sem estoque";
    }

    if (quantidade <= minimo) {
        return "Estoque baixo";
    }

    return "Disponível";
}

function atualizarCalculosFormularioProduto() {
    const custo = Number(
        campoProdutoCusto
            ? campoProdutoCusto.value || 0
            : 0
    );

    const preco = Number(
        campoProdutoPreco
            ? campoProdutoPreco.value || 0
            : 0
    );

    const estoque = Number(
        campoProdutoEstoque
            ? campoProdutoEstoque.value || 0
            : 0
    );

    const estoqueMinimo = Number(
        campoProdutoEstoqueMinimo
            ? campoProdutoEstoqueMinimo.value || 0
            : 0
    );

    const lucro =
        calcularLucroProduto(
            custo,
            preco
        );

    const margem =
        calcularMargemProduto(
            custo,
            preco
        );

    const status =
        definirStatusProduto(
            estoque,
            estoqueMinimo
        );

    if (campoProdutoLucro) {
        campoProdutoLucro.value =
            formatarDinheiro(lucro);
    }

    if (campoProdutoMargem) {
        campoProdutoMargem.value =
            `${margem.toLocaleString(
                "pt-BR",
                {
                    maximumFractionDigits: 1
                }
            )}%`;
    }

    if (campoProdutoStatus) {
        campoProdutoStatus.value =
            status;
    }
}

function atualizarResumoProdutos() {
    const campoTotal =
        document.getElementById(
            "produtos-total"
        );

    const campoDisponiveis =
        document.getElementById(
            "produtos-disponiveis"
        );

    const campoEstoqueBaixo =
        document.getElementById(
            "produtos-estoque-baixo"
        );

    const campoSemEstoque =
        document.getElementById(
            "produtos-sem-estoque"
        );

    const campoValorEstoque =
        document.getElementById(
            "produtos-valor-estoque"
        );

    const disponiveis =
        produtos.filter(
            function (produto) {
                return produto.status ===
                    "Disponível";
            }
        ).length;

    const estoqueBaixo =
        produtos.filter(
            function (produto) {
                return produto.status ===
                    "Estoque baixo";
            }
        ).length;

    const semEstoque =
        produtos.filter(
            function (produto) {
                return produto.status ===
                    "Sem estoque";
            }
        ).length;

    const valorEmEstoque =
        produtos.reduce(
            function (total, produto) {
                return total +
                    Number(
                        produto.preco || 0
                    ) *
                    Number(
                        produto.estoque || 0
                    );
            },
            0
        );

    if (campoTotal) {
        campoTotal.textContent =
            produtos.length;
    }

    if (campoDisponiveis) {
        campoDisponiveis.textContent =
            disponiveis;
    }

    if (campoEstoqueBaixo) {
        campoEstoqueBaixo.textContent =
            estoqueBaixo;
    }

    if (campoSemEstoque) {
        campoSemEstoque.textContent =
            semEstoque;
    }

    if (campoValorEstoque) {
        campoValorEstoque.textContent =
            formatarDinheiro(
                valorEmEstoque
            );
    }
}

function atualizarDashboard() {
    const totalProdutosDashboard =
        document.getElementById(
            "total-produtos"
        );

    const campoFaturamento =
        document.getElementById(
            "total-faturamento"
        );

    const campoLucro =
        document.getElementById(
            "total-lucro"
        );

    const faturamentoEstimado =
        produtos.reduce(
            function (total, produto) {
                return total +
                    Number(
                        produto.preco || 0
                    ) *
                    Number(
                        produto.estoque || 0
                    );
            },
            0
        );

    const custoEstoque =
        produtos.reduce(
            function (total, produto) {
                return total +
                    Number(
                        produto.custo || 0
                    ) *
                    Number(
                        produto.estoque || 0
                    );
            },
            0
        );

    const lucroEstimado =
        faturamentoEstimado -
        custoEstoque;

    if (totalProdutosDashboard) {
        totalProdutosDashboard.textContent =
            produtos.length;
    }

    if (campoFaturamento) {
        campoFaturamento.textContent =
            formatarDinheiro(
                faturamentoEstimado
            );
    }

    if (campoLucro) {
        campoLucro.textContent =
            formatarDinheiro(
                lucroEstimado
            );
    }
}

function normalizarProdutosAntigos() {
    produtos = produtos.map(
        function (produto, indice) {
            const custo = Number(
                produto.custo || 0
            );

            const preco = Number(
                produto.preco ||
                produto.valor ||
                0
            );

            const estoque = Number(
                produto.estoque ||
                produto.quantidade ||
                0
            );

            const estoqueMinimo = Number(
                produto.estoqueMinimo || 0
            );

            return {
                id:
                    produto.id ||
                    Date.now() + indice,

                nome:
                    produto.nome || "",

                categoria:
                    produto.categoria ||
                    "Outros",

                descricao:
                    produto.descricao || "",

                custo:
                    custo,

                preco:
                    preco,

                lucro:
                    calcularLucroProduto(
                        custo,
                        preco
                    ),

                margem:
                    calcularMargemProduto(
                        custo,
                        preco
                    ),

                estoque:
                    estoque,

                estoqueMinimo:
                    estoqueMinimo,

                status:
                    definirStatusProduto(
                        estoque,
                        estoqueMinimo
                    ),

                dataCadastro:
                    produto.dataCadastro || "",

                observacoes:
                    produto.observacoes || ""
            };
        }
    );

    salvarProdutos();
}

function mostrarProdutos() {
    if (!listaProdutos) {
        return;
    }

    if (produtos.length === 0) {
        listaProdutos.innerHTML =
            "<p>Nenhum produto cadastrado.</p>";

        atualizarResumoProdutos();
        atualizarDashboard();
        return;
    }

    listaProdutos.innerHTML =
        produtos
            .map(function (produto) {
                const descricao =
                    produto.descricao
                        ? escaparTexto(
                            produto.descricao
                        )
                        : "Não informada";

                const observacoes =
                    produto.observacoes
                        ? escaparTexto(
                            produto.observacoes
                        )
                        : "Nenhuma";

                return `
                    <div class="card-item">

                        <h4>
                            ${escaparTexto(produto.nome)}
                        </h4>

                        <p>
                            <strong>Categoria:</strong>
                            ${escaparTexto(
                                produto.categoria
                            )}
                        </p>

                        <p>
                            <strong>Descrição:</strong>
                            ${descricao}
                        </p>

                        <p>
                            <strong>Custo:</strong>
                            ${formatarDinheiro(
                                produto.custo
                            )}
                        </p>

                        <p>
                            <strong>Preço de venda:</strong>
                            ${formatarDinheiro(
                                produto.preco
                            )}
                        </p>

                        <p>
                            <strong>Lucro por unidade:</strong>
                            ${formatarDinheiro(
                                produto.lucro
                            )}
                        </p>

                        <p>
                            <strong>Margem:</strong>
                            ${Number(
                                produto.margem || 0
                            ).toLocaleString(
                                "pt-BR",
                                {
                                    maximumFractionDigits: 1
                                }
                            )}%
                        </p>

                        <p>
                            <strong>Estoque:</strong>
                            ${Number(
                                produto.estoque || 0
                            )} unidade(s)
                        </p>

                        <p>
                            <strong>Estoque mínimo:</strong>
                            ${Number(
                                produto.estoqueMinimo || 0
                            )} unidade(s)
                        </p>

                        <p>
                            <strong>Status:</strong>
                            ${escaparTexto(
                                produto.status
                            )}
                        </p>

                        <p>
                            <strong>Data de cadastro:</strong>
                            ${formatarDataProduto(
                                produto.dataCadastro
                            )}
                        </p>

                        <p>
                            <strong>Observações:</strong>
                            ${observacoes}
                        </p>

                        <button
                            type="button"
                            class="botao-principal"
                            onclick="atualizarEstoqueProduto(
                                ${produto.id}
                            )">
                            Atualizar Estoque
                        </button>

                        <button
                            type="button"
                            class="botao-excluir"
                            onclick="excluirProduto(
                                ${produto.id}
                            )">
                            Excluir
                        </button>

                    </div>
                `;
            })
            .join("");

    atualizarResumoProdutos();
    atualizarDashboard();
}

function limparFormularioProduto() {
    if (campoProdutoNome) {
        campoProdutoNome.value = "";
    }

    if (campoProdutoCategoria) {
        campoProdutoCategoria.value = "";
    }

    if (campoProdutoDescricao) {
        campoProdutoDescricao.value = "";
    }

    if (campoProdutoCusto) {
        campoProdutoCusto.value = "";
    }

    if (campoProdutoPreco) {
        campoProdutoPreco.value = "";
    }

    if (campoProdutoLucro) {
        campoProdutoLucro.value = "R$ 0,00";
    }

    if (campoProdutoMargem) {
        campoProdutoMargem.value = "0%";
    }

    if (campoProdutoEstoque) {
        campoProdutoEstoque.value = "";
    }

    if (campoProdutoEstoqueMinimo) {
        campoProdutoEstoqueMinimo.value = "";
    }

    if (campoProdutoStatus) {
        campoProdutoStatus.value = "Sem estoque";
    }

    if (campoProdutoDataCadastro) {
        campoProdutoDataCadastro.value =
            obterDataHojeProduto();
    }

    if (campoProdutoObservacoes) {
        campoProdutoObservacoes.value = "";
    }
}

[
    campoProdutoCusto,
    campoProdutoPreco,
    campoProdutoEstoque,
    campoProdutoEstoqueMinimo
].forEach(function (campo) {
    if (campo) {
        campo.addEventListener(
            "input",
            atualizarCalculosFormularioProduto
        );
    }
});

if (botaoSalvarProduto) {
    botaoSalvarProduto.addEventListener(
        "click",
        function () {
            const nome =
                campoProdutoNome.value.trim();

            const categoria =
                campoProdutoCategoria.value;

            const descricao =
                campoProdutoDescricao.value.trim();

            const custo =
                Number(campoProdutoCusto.value);

            const preco =
                Number(campoProdutoPreco.value);

            const estoque =
                Number(campoProdutoEstoque.value);

            const estoqueMinimo =
                Number(
                    campoProdutoEstoqueMinimo.value
                );

            const dataCadastro =
                campoProdutoDataCadastro.value;

            const observacoes =
                campoProdutoObservacoes
                    .value
                    .trim();

            if (!nome) {
                alert("Informe o nome do produto.");
                return;
            }

            if (!categoria) {
                alert("Selecione uma categoria.");
                return;
            }

            if (
                Number.isNaN(custo) ||
                custo < 0
            ) {
                alert("Informe um custo válido.");
                return;
            }

            if (
                Number.isNaN(preco) ||
                preco <= 0
            ) {
                alert(
                    "Informe um preço de venda válido."
                );
                return;
            }

            if (preco < custo) {
                const confirmar = confirm(
                    "O preço de venda é menor que o custo. Deseja salvar mesmo assim?"
                );

                if (!confirmar) {
                    return;
                }
            }

            if (
                Number.isNaN(estoque) ||
                estoque < 0 ||
                !Number.isInteger(estoque)
            ) {
                alert(
                    "Informe uma quantidade de estoque válida."
                );
                return;
            }

            if (
                Number.isNaN(estoqueMinimo) ||
                estoqueMinimo < 0 ||
                !Number.isInteger(
                    estoqueMinimo
                )
            ) {
                alert(
                    "Informe um estoque mínimo válido."
                );
                return;
            }

            const lucro =
                calcularLucroProduto(
                    custo,
                    preco
                );

            const margem =
                calcularMargemProduto(
                    custo,
                    preco
                );

            const status =
                definirStatusProduto(
                    estoque,
                    estoqueMinimo
                );

            const novoProduto = {
                id: Date.now(),
                nome: nome,
                categoria: categoria,
                descricao: descricao,
                custo: custo,
                preco: preco,
                lucro: lucro,
                margem: margem,
                estoque: estoque,
                estoqueMinimo: estoqueMinimo,
                status: status,
                dataCadastro: dataCadastro,
                observacoes: observacoes
            };

            produtos.push(novoProduto);

            salvarProdutos();
            mostrarProdutos();
            limparFormularioProduto();

            if (
                typeof atualizarOpcoesEncomendas ===
                "function"
            ) {
                atualizarOpcoesEncomendas();
            }

            alert(
                "Produto cadastrado com sucesso!"
            );
        }
    );
}

if (botaoLimparFormularioProduto) {
    botaoLimparFormularioProduto.addEventListener(
        "click",
        limparFormularioProduto
    );
}

window.atualizarEstoqueProduto =
    function (id) {
        const produto = produtos.find(
            function (item) {
                return item.id === id;
            }
        );

        if (!produto) {
            alert("Produto não encontrado.");
            return;
        }

        const resposta = prompt(
            `Informe a nova quantidade em estoque de ${produto.nome}:`,
            produto.estoque
        );

        if (resposta === null) {
            return;
        }

        const novaQuantidade =
            Number(resposta.trim());

        if (
            Number.isNaN(novaQuantidade) ||
            novaQuantidade < 0 ||
            !Number.isInteger(novaQuantidade)
        ) {
            alert(
                "Informe uma quantidade inteira válida."
            );
            return;
        }

        produto.estoque = novaQuantidade;

        produto.status =
            definirStatusProduto(
                produto.estoque,
                produto.estoqueMinimo
            );

        salvarProdutos();
        mostrarProdutos();

        alert(
            "Estoque atualizado com sucesso!"
        );
    };

window.excluirProduto =
    function (id) {
        const produtoEncontrado =
            produtos.find(
                function (produto) {
                    return produto.id === id;
                }
            );

        if (!produtoEncontrado) {
            return;
        }

        const confirmar = confirm(
            `Deseja excluir o produto "${produtoEncontrado.nome}"?`
        );

        if (!confirmar) {
            return;
        }

        produtos = produtos.filter(
            function (produto) {
                return produto.id !== id;
            }
        );

        salvarProdutos();
        mostrarProdutos();

        if (
            typeof atualizarOpcoesEncomendas ===
            "function"
        ) {
            atualizarOpcoesEncomendas();
        }
    };

normalizarProdutosAntigos();
mostrarProdutos();
limparFormularioProduto();
    
// =========================
// CLIENTES
// =========================

let clientes = JSON.parse(
    localStorage.getItem("organiza3d_clientes")
) || [];

const botaoSalvarCliente =
    document.getElementById("salvar-cliente");

const listaClientes =
    document.getElementById("lista-clientes");

const totalClientes =
    document.getElementById("total-clientes");

function salvarClientes() {
    localStorage.setItem(
        "organiza3d_clientes",
        JSON.stringify(clientes)
    );
}

function atualizarTotalClientes() {
    if (totalClientes) {
        totalClientes.textContent = clientes.length;
    }
}

function mostrarClientes() {
    if (!listaClientes) {
        return;
    }

    if (clientes.length === 0) {
        listaClientes.innerHTML =
            "<p>Nenhum cliente cadastrado.</p>";

        return;
    }

    listaClientes.innerHTML = clientes
        .map(function (cliente) {
            return `
                <div class="card-item">

                    <h4>${escaparTexto(cliente.nome)}</h4>

                    <p>
                        <strong>Telefone:</strong>
                        ${escaparTexto(cliente.telefone || "Não informado")}
                    </p>

                    <p>
                        <strong>E-mail:</strong>
                        ${escaparTexto(cliente.email || "Não informado")}
                    </p>

                    <p>
                        <strong>Cidade:</strong>
                        ${escaparTexto(cliente.cidade || "Não informada")}
                    </p>

                    <p>
                        <strong>Observações:</strong>
                        ${escaparTexto(
                            cliente.observacoes || "Nenhuma"
                        )}
                    </p>

                    <button
                        type="button"
                        class="botao-excluir"
                        onclick="excluirCliente(${cliente.id})">
                        Excluir
                    </button>

                </div>
            `;
        })
        .join("");
}

mostrarClientes();
atualizarTotalClientes();

if (botaoSalvarCliente) {
    botaoSalvarCliente.addEventListener(
        "click",
        function () {
            const nome = document
                .getElementById("nome-cliente")
                .value
                .trim();

            const telefone = document
                .getElementById("telefone-cliente")
                .value
                .trim();

            const email = document
                .getElementById("email-cliente")
                .value
                .trim();

            const cidade = document
                .getElementById("cidade-cliente")
                .value
                .trim();

            const observacoes = document
                .getElementById("observacoes-cliente")
                .value
                .trim();

            if (!nome) {
                alert("Informe o nome do cliente.");
                return;
            }

            const cliente = {
                id: Date.now(),
                nome: nome,
                telefone: telefone,
                email: email,
                cidade: cidade,
                observacoes: observacoes
            };

            clientes.push(cliente);

            salvarClientes();
            mostrarClientes();
            atualizarTotalClientes();

            document.getElementById(
                "nome-cliente"
            ).value = "";

            document.getElementById(
                "telefone-cliente"
            ).value = "";

            document.getElementById(
                "email-cliente"
            ).value = "";

            document.getElementById(
                "cidade-cliente"
            ).value = "";

            document.getElementById(
                "observacoes-cliente"
            ).value = "";

            alert("Cliente cadastrado com sucesso!");
        }
    );
}

window.excluirCliente = function (id) {
    const confirmar = confirm(
        "Tem certeza que deseja excluir este cliente?"
    );

    if (!confirmar) {
        return;
    }

    clientes = clientes.filter(
        function (cliente) {
            return cliente.id !== id;
        }
    );

    salvarClientes();
    mostrarClientes();
    atualizarTotalClientes();
};
// =========================
// EQUIPAMENTOS 2.0
// =========================

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


// =========================
// FILAMENTOS 2.0
// =========================

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
   SEGURANÇA 1.0
======================================= */

const telaLogin = document.getElementById("tela-login");
const aplicativo = document.getElementById("aplicativo");

const campoUsuario = document.getElementById("login-usuario");
const campoSenha = document.getElementById("login-senha");

const botaoEntrar = document.getElementById("entrar-sistema");
const mensagemLogin = document.getElementById("mensagem-login");

let usuarioSistema =
    JSON.parse(localStorage.getItem("usuarioAdministrador")) || null;

if (!usuarioSistema) {

    const usuario = prompt("Crie o usuário administrador:");

    const senha = prompt("Crie a senha do administrador:");

    usuarioSistema = {
        usuario,
        senha
    };

    localStorage.setItem(
        "usuarioAdministrador",
        JSON.stringify(usuarioSistema)
    );

    alert("Administrador criado com sucesso!");
}

function abrirSistema() {

    telaLogin.style.display = "none";

    aplicativo.style.display = "flex";

}

function validarLogin() {

    mensagemLogin.textContent = "";

    if (
        campoUsuario.value === usuarioSistema.usuario &&
        campoSenha.value === usuarioSistema.senha
    ) {

        abrirSistema();

    } else {

        mensagemLogin.textContent =
            "Usuário ou senha incorretos.";

    }

}

botaoEntrar.addEventListener("click", validarLogin);

campoSenha.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        validarLogin();

    }

});