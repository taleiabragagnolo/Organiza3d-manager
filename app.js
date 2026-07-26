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

let filamentos = JSON.parse(
    localStorage.getItem("organiza3d_filamentos")
) || [];

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
// EQUIPAMENTOS
// ANTIGO MÓDULO IMPRESSORAS
// =========================

let impressoras = [];

try {
    impressoras =
        JSON.parse(
            localStorage.getItem(
                "organiza3d_impressoras"
            )
        ) || [];
} catch (erro) {
    console.error(
        "Não foi possível carregar as impressoras.",
        erro
    );

    impressoras = [];
}


// =========================
// ELEMENTOS DAS ABAS
// =========================

const botoesAbasEquipamentos =
    document.querySelectorAll(
        ".aba-equipamento"
    );

const conteudosAbasEquipamentos =
    document.querySelectorAll(
        ".conteudo-aba-equipamento"
    );


// =========================
// ELEMENTOS DO FORMULÁRIO
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

const campoNomeImpressora =
    document.getElementById(
        "nome-impressora"
    );

const campoMarcaImpressora =
    document.getElementById(
        "marca-impressora"
    );

const campoModeloImpressora =
    document.getElementById(
        "modelo-impressora"
    );

const campoSerieImpressora =
    document.getElementById(
        "serie-impressora"
    );

const campoDataCompraImpressora =
    document.getElementById(
        "data-compra-impressora"
    );

const campoValorImpressora =
    document.getElementById(
        "valor-impressora"
    );

const campoStatusImpressora =
    document.getElementById(
        "status-impressora"
    );

const campoHorasIniciaisImpressora =
    document.getElementById(
        "horas-iniciais-impressora"
    );

const campoUltimaManutencaoImpressora =
    document.getElementById(
        "ultima-manutencao-impressora"
    );

const campoProximaManutencaoImpressora =
    document.getElementById(
        "proxima-manutencao-impressora"
    );

const campoObservacoesImpressora =
    document.getElementById(
        "observacoes-impressora"
    );


// =========================
// ELEMENTOS DOS RESUMOS
// =========================

const totalImpressorasDashboard =
    document.getElementById(
        "total-impressoras"
    );

const totalImpressorasEquipamentos =
    document.getElementById(
        "equipamentos-total-impressoras"
    );

const totalImpressorasAtivas =
    document.getElementById(
        "equipamentos-impressoras-ativas"
    );

const totalImpressorasManutencao =
    document.getElementById(
        "equipamentos-impressoras-manutencao"
    );

const totalHorasEquipamentos =
    document.getElementById(
        "equipamentos-total-horas"
    );


// =========================
// FUNÇÕES DAS ABAS
// =========================

function abrirAbaEquipamento(
    idAba
) {
    conteudosAbasEquipamentos.forEach(
        function (conteudo) {
            const abaAtiva =
                conteudo.id === idAba;

            conteudo.hidden =
                !abaAtiva;

            conteudo.classList.toggle(
                "ativo",
                abaAtiva
            );
        }
    );

    botoesAbasEquipamentos.forEach(
        function (botao) {
            const botaoAtivo =
                botao.dataset
                    .abaEquipamento ===
                idAba;

            botao.classList.toggle(
                "botao-principal",
                botaoAtivo
            );
        }
    );
}

botoesAbasEquipamentos.forEach(
    function (botao) {
        botao.addEventListener(
            "click",
            function () {
                const idAba =
                    botao.dataset
                        .abaEquipamento;

                if (!idAba) {
                    return;
                }

                abrirAbaEquipamento(
                    idAba
                );
            }
        );
    }
);


// =========================
// ARMAZENAMENTO
// =========================

function salvarImpressoras() {
    localStorage.setItem(
        "organiza3d_impressoras",
        JSON.stringify(
            impressoras
        )
    );
}


// =========================
// DATA
// =========================

function formatarDataImpressora(
    data
) {
    if (!data) {
        return "Não informada";
    }

    const partes =
        data.split("-");

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
// HORAS
// =========================

function formatarHorasImpressora(
    horas
) {
    const totalHoras =
        Math.max(
            0,
            Number(horas || 0)
        );

    const horasInteiras =
        Math.floor(totalHoras);

    const minutos =
        Math.round(
            (totalHoras - horasInteiras) *
            60
        );

    if (minutos >= 60) {
        return `${horasInteiras + 1}h`;
    }

    if (minutos <= 0) {
        return `${horasInteiras}h`;
    }

    return (
        `${horasInteiras}h ` +
        `${minutos}min`
    );
}


// =========================
// NORMALIZAÇÃO
// =========================

function normalizarImpressorasAntigas() {
    impressoras =
        impressoras.map(
            function (
                impressora,
                indice
            ) {
                const horasIniciais =
                    Number(
                        impressora
                            .horasIniciais ??
                        impressora
                            .horasUso ??
                        impressora
                            .horas ??
                        0
                    );

                const horasProducoes =
                    Number(
                        impressora
                            .horasProducoes ??
                        0
                    );

                const horasAjustes =
                    Number(
                        impressora
                            .horasAjustes ??
                        0
                    );

                return {
                    id:
                        impressora.id ||
                        Date.now() +
                        indice,

                    nome:
                        impressora.nome ||
                        "",

                    marca:
                        impressora.marca ||
                        "",

                    modelo:
                        impressora.modelo ||
                        "",

                    serie:
                        impressora.serie ||
                        "",

                    dataCompra:
                        impressora
                            .dataCompra ||
                        "",

                    valor:
                        Number(
                            impressora
                                .valor ||
                            0
                        ),

                    status:
                        impressora.status ||
                        "Ativa",

                    horasIniciais:
                        Number.isNaN(
                            horasIniciais
                        )
                            ? 0
                            : Math.max(
                                0,
                                horasIniciais
                            ),

                    horasProducoes:
                        Number.isNaN(
                            horasProducoes
                        )
                            ? 0
                            : Math.max(
                                0,
                                horasProducoes
                            ),

                    horasAjustes:
                        Number.isNaN(
                            horasAjustes
                        )
                            ? 0
                            : horasAjustes,

                    ultimaManutencao:
                        impressora
                            .ultimaManutencao ||
                        "",

                    proximaManutencao:
                        impressora
                            .proximaManutencao ||
                        "",

                    observacoes:
                        impressora
                            .observacoes ||
                        ""
                };
            }
        );

    salvarImpressoras();
}


// =========================
// CÁLCULO DAS HORAS
// =========================

function obterTotalHorasImpressora(
    impressora
) {
    const horasIniciais =
        Number(
            impressora
                .horasIniciais ||
            0
        );

    const horasProducoes =
        Number(
            impressora
                .horasProducoes ||
            0
        );

    const horasAjustes =
        Number(
            impressora
                .horasAjustes ||
            0
        );

    return Math.max(
        0,
        horasIniciais +
        horasProducoes +
        horasAjustes
    );
}


// =========================
// RESUMO
// =========================

function atualizarResumoImpressoras() {
    const impressorasAtivas =
        impressoras.filter(
            function (impressora) {
                return (
                    impressora.status ===
                    "Ativa"
                );
            }
        ).length;

    const impressorasEmManutencao =
        impressoras.filter(
            function (impressora) {
                return (
                    impressora.status ===
                    "Em manutenção"
                );
            }
        ).length;

    const totalHoras =
        impressoras.reduce(
            function (
                total,
                impressora
            ) {
                return (
                    total +
                    obterTotalHorasImpressora(
                        impressora
                    )
                );
            },
            0
        );

    if (
        totalImpressorasDashboard
    ) {
        totalImpressorasDashboard
            .textContent =
            impressoras.length;
    }

    if (
        totalImpressorasEquipamentos
    ) {
        totalImpressorasEquipamentos
            .textContent =
            impressoras.length;
    }

    if (
        totalImpressorasAtivas
    ) {
        totalImpressorasAtivas
            .textContent =
            impressorasAtivas;
    }

    if (
        totalImpressorasManutencao
    ) {
        totalImpressorasManutencao
            .textContent =
            impressorasEmManutencao;
    }

    if (
        totalHorasEquipamentos
    ) {
        totalHorasEquipamentos
            .textContent =
            formatarHorasImpressora(
                totalHoras
            );
    }

    const relatorioImpressoras =
        document.getElementById(
            "relatorio-impressoras"
        );

    const relatorioImpressorasAtivas =
        document.getElementById(
            "relatorio-impressoras-ativas"
        );

    if (relatorioImpressoras) {
        relatorioImpressoras
            .textContent =
            impressoras.length;
    }

    if (
        relatorioImpressorasAtivas
    ) {
        relatorioImpressorasAtivas
            .textContent =
            impressorasAtivas;
    }
}


// =========================
// LISTAGEM
// =========================

function mostrarImpressoras() {
    if (!listaImpressoras) {
        atualizarResumoImpressoras();
        return;
    }

    if (impressoras.length === 0) {
        listaImpressoras.innerHTML =
            "<p>Nenhuma impressora cadastrada.</p>";

        atualizarResumoImpressoras();
        return;
    }

    listaImpressoras.innerHTML =
        impressoras
            .map(
                function (
                    impressora
                ) {
                    const totalHoras =
                        obterTotalHorasImpressora(
                            impressora
                        );

                    const marca =
                        impressora.marca
                            ? escaparTexto(
                                impressora
                                    .marca
                            )
                            : "Não informada";

                    const modelo =
                        impressora.modelo
                            ? escaparTexto(
                                impressora
                                    .modelo
                            )
                            : "Não informado";

                    const serie =
                        impressora.serie
                            ? escaparTexto(
                                impressora
                                    .serie
                            )
                            : "Não informado";

                    const observacoes =
                        impressora
                            .observacoes
                            ? escaparTexto(
                                impressora
                                    .observacoes
                            )
                            : "Nenhuma";

                    return `
                        <div class="card-item">

                            <h4>
                                ${escaparTexto(
                                    impressora.nome
                                )}
                            </h4>

                            <p>
                                <strong>Marca:</strong>
                                ${marca}
                            </p>

                            <p>
                                <strong>Modelo:</strong>
                                ${modelo}
                            </p>

                            <p>
                                <strong>Número de série:</strong>
                                ${serie}
                            </p>

                            <p>
                                <strong>Data da compra:</strong>
                                ${formatarDataImpressora(
                                    impressora
                                        .dataCompra
                                )}
                            </p>

                            <p>
                                <strong>Valor pago:</strong>
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
                                <strong>Horas iniciais:</strong>
                                ${formatarHorasImpressora(
                                    impressora
                                        .horasIniciais
                                )}
                            </p>

                            <p>
                                <strong>Horas das produções:</strong>
                                ${formatarHorasImpressora(
                                    impressora
                                        .horasProducoes
                                )}
                            </p>

                            <p>
                                <strong>Ajustes de horas:</strong>
                                ${formatarHorasImpressora(
                                    impressora
                                        .horasAjustes
                                )}
                            </p>

                            <p>
                                <strong>Total de horas:</strong>
                                ${formatarHorasImpressora(
                                    totalHoras
                                )}
                            </p>

                            <p>
                                <strong>Última manutenção:</strong>
                                ${formatarDataImpressora(
                                    impressora
                                        .ultimaManutencao
                                )}
                            </p>

                            <p>
                                <strong>Próxima manutenção:</strong>
                                ${formatarDataImpressora(
                                    impressora
                                        .proximaManutencao
                                )}
                            </p>

                            <p>
                                <strong>Observações:</strong>
                                ${observacoes}
                            </p>

                            <button
                                type="button"
                                class="botao-principal"
                                onclick="ajustarHorasImpressora(
                                    ${impressora.id}
                                )">
                                Adicionar horas
                            </button>

                            <button
                                type="button"
                                class="botao-principal"
                                onclick="alterarStatusImpressora(
                                    ${impressora.id}
                                )">
                                Alterar status
                            </button>

                            <button
                                type="button"
                                class="botao-excluir"
                                onclick="excluirImpressora(
                                    ${impressora.id}
                                )">
                                Excluir
                            </button>

                        </div>
                    `;
                }
            )
            .join("");

    atualizarResumoImpressoras();
}


// =========================
// LIMPEZA DO FORMULÁRIO
// =========================

function limparFormularioImpressora() {
    if (campoNomeImpressora) {
        campoNomeImpressora.value =
            "";
    }

    if (campoMarcaImpressora) {
        campoMarcaImpressora.value =
            "";
    }

    if (campoModeloImpressora) {
        campoModeloImpressora.value =
            "";
    }

    if (campoSerieImpressora) {
        campoSerieImpressora.value =
            "";
    }

    if (
        campoDataCompraImpressora
    ) {
        campoDataCompraImpressora
            .value = "";
    }

    if (campoValorImpressora) {
        campoValorImpressora.value =
            "";
    }

    if (campoStatusImpressora) {
        campoStatusImpressora.value =
            "Ativa";
    }

    if (
        campoHorasIniciaisImpressora
    ) {
        campoHorasIniciaisImpressora
            .value = "";
    }

    if (
        campoUltimaManutencaoImpressora
    ) {
        campoUltimaManutencaoImpressora
            .value = "";
    }

    if (
        campoProximaManutencaoImpressora
    ) {
        campoProximaManutencaoImpressora
            .value = "";
    }

    if (
        campoObservacoesImpressora
    ) {
        campoObservacoesImpressora
            .value = "";
    }
}


// =========================
// CADASTRO
// =========================

if (botaoSalvarImpressora) {
    botaoSalvarImpressora
        .addEventListener(
            "click",
            function () {
                const nome =
                    campoNomeImpressora
                        ? campoNomeImpressora
                            .value
                            .trim()
                        : "";

                const marca =
                    campoMarcaImpressora
                        ? campoMarcaImpressora
                            .value
                            .trim()
                        : "";

                const modelo =
                    campoModeloImpressora
                        ? campoModeloImpressora
                            .value
                            .trim()
                        : "";

                const serie =
                    campoSerieImpressora
                        ? campoSerieImpressora
                            .value
                            .trim()
                        : "";

                const dataCompra =
                    campoDataCompraImpressora
                        ? campoDataCompraImpressora
                            .value
                        : "";

                const valor =
                    campoValorImpressora
                        ? Number(
                            campoValorImpressora
                                .value || 0
                        )
                        : 0;

                const status =
                    campoStatusImpressora
                        ? campoStatusImpressora
                            .value
                        : "Ativa";

                const horasIniciais =
                    campoHorasIniciaisImpressora
                        ? Number(
                            campoHorasIniciaisImpressora
                                .value || 0
                        )
                        : 0;

                const ultimaManutencao =
                    campoUltimaManutencaoImpressora
                        ? campoUltimaManutencaoImpressora
                            .value
                        : "";

                const proximaManutencao =
                    campoProximaManutencaoImpressora
                        ? campoProximaManutencaoImpressora
                            .value
                        : "";

                const observacoes =
                    campoObservacoesImpressora
                        ? campoObservacoesImpressora
                            .value
                            .trim()
                        : "";

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
                        "Selecione o modelo da impressora."
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
                    Number.isNaN(
                        horasIniciais
                    ) ||
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

                const novaImpressora = {
                    id: Date.now(),
                    nome: nome,
                    marca: marca,
                    modelo: modelo,
                    serie: serie,
                    dataCompra:
                        dataCompra,
                    valor: valor,
                    status: status,
                    horasIniciais:
                        horasIniciais,
                    horasProducoes: 0,
                    horasAjustes: 0,
                    ultimaManutencao:
                        ultimaManutencao,
                    proximaManutencao:
                        proximaManutencao,
                    observacoes:
                        observacoes
                };

                impressoras.push(
                    novaImpressora
                );

                salvarImpressoras();
                mostrarImpressoras();
                limparFormularioImpressora();

                alert(
                    "Impressora cadastrada com sucesso!"
                );
            }
        );
}


// =========================
// BOTÃO LIMPAR
// =========================

if (
    botaoLimparFormularioImpressora
) {
    botaoLimparFormularioImpressora
        .addEventListener(
            "click",
            limparFormularioImpressora
        );
}


// =========================
// AJUSTE MANUAL DE HORAS
// =========================

window.ajustarHorasImpressora =
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

        const resposta =
            prompt(
                `Quantas horas deseja adicionar à impressora "${impressora.nome}"?\n\nUse número positivo para adicionar ou negativo para corrigir.`,
                "1"
            );

        if (resposta === null) {
            return;
        }

        const horas =
            Number(
                resposta
                    .replace(",", ".")
                    .trim()
            );

        if (
            Number.isNaN(horas) ||
            horas === 0
        ) {
            alert(
                "Informe uma quantidade de horas válida."
            );
            return;
        }

        const totalAtual =
            obterTotalHorasImpressora(
                impressora
            );

        if (
            totalAtual + horas < 0
        ) {
            alert(
                "O ajuste não pode deixar o total de horas negativo."
            );
            return;
        }

        impressora.horasAjustes =
            Number(
                impressora
                    .horasAjustes ||
                0
            ) + horas;

        salvarImpressoras();
        mostrarImpressoras();

        alert(
            "Horas atualizadas com sucesso!"
        );
    };


// =========================
// ALTERAR STATUS
// =========================

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

        const novoStatus =
            prompt(
                "Digite o novo status:\n\nAtiva\nEm manutenção\nParada\nDesativada",
                impressora.status
            );

        if (novoStatus === null) {
            return;
        }

        const statusPermitidos = [
            "Ativa",
            "Em manutenção",
            "Parada",
            "Desativada"
        ];

        const statusEncontrado =
            statusPermitidos.find(
                function (status) {
                    return (
                        status
                            .toLowerCase() ===
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

        impressora.status =
            statusEncontrado;

        salvarImpressoras();
        mostrarImpressoras();

        alert(
            "Status atualizado com sucesso!"
        );
    };


// =========================
// EXCLUSÃO
// =========================

window.excluirImpressora =
    function (id) {
        const impressora =
            impressoras.find(
                function (item) {
                    return item.id === id;
                }
            );

        if (!impressora) {
            return;
        }

        const confirmar =
            confirm(
                `Deseja excluir a impressora "${impressora.nome}"?`
            );

        if (!confirmar) {
            return;
        }

        impressoras =
            impressoras.filter(
                function (item) {
                    return item.id !== id;
                }
            );

        salvarImpressoras();
        mostrarImpressoras();
    };


// =========================
// INICIALIZAÇÃO
// =========================

normalizarImpressorasAntigas();
mostrarImpressoras();
limparFormularioImpressora();
abrirAbaEquipamento(
    "aba-impressoras"
);

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