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
    