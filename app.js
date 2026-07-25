 document.addEventListener("DOMContentLoaded", function () {
    const botoesMenu = document.querySelectorAll(".menu-item");
    const paginas = document.querySelectorAll(".pagina");

    const formularioProduto = document.getElementById("formulario-produto");
    const botaoNovoProduto = document.getElementById("botao-novo-produto");
    const tabelaProdutos = document.getElementById("tabela-produtos");
    const mensagemVazia = document.getElementById("produtos-vazio");
    const totalProdutos = document.getElementById("total-produtos");

    let produtos = carregarProdutos();

    iniciarMenu();
    mostrarProdutos();
    atualizarDashboard();

    function iniciarMenu() {
        botoesMenu.forEach(function (botao) {
            botao.addEventListener("click", function () {
                const paginaEscolhida = botao.dataset.pagina;

                botoesMenu.forEach(function (item) {
                    item.classList.remove("ativo");
                });

                paginas.forEach(function (pagina) {
                    pagina.classList.remove("ativa");
                });

                botao.classList.add("ativo");

                const pagina = document.getElementById(paginaEscolhida);

                if (pagina) {
                    pagina.classList.add("ativa");
                }
            });
        });
    }

    if (botaoNovoProduto) {
        botaoNovoProduto.addEventListener("click", function () {
            const campoNome = document.getElementById("nome-produto");

            formularioProduto.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            campoNome.focus();
        });
    }

    if (formularioProduto) {
        formularioProduto.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const produto = {
                id: Date.now(),
                nome: document.getElementById("nome-produto").value.trim(),
                categoria: document.getElementById("categoria-produto").value,
                peso: document.getElementById("peso-produto").value,
                tempo: document.getElementById("tempo-produto").value.trim(),
                custo: Number(
                    document.getElementById("custo-produto").value
                ) || 0,
                preco: Number(
                    document.getElementById("preco-produto").value
                ) || 0,
                estoque: Number(
                    document.getElementById("estoque-produto").value
                    ) || 0,
                observacoes: document
                    .getElementById("observacoes-produto")
                    .value
                    .trim()
            };

            if (!produto.nome || !produto.categoria || produto.preco <= 0) {
                alert("Preencha o nome, a categoria e o preço de venda.");
                return;
            }

            produtos.push(produto);
            salvarProdutos();

            formularioProduto.reset();
            document.getElementById("estoque-produto").value = 0;

            mostrarProdutos();
            atualizarDashboard();

            alert("Produto cadastrado com sucesso!");
        });
    }

    function carregarProdutos() {
        const produtosSalvos = localStorage.getItem(
            "organiza3d_produtos"
        );

        if (!produtosSalvos) {
            return [];
        }

        try {
            return JSON.parse(produtosSalvos);
        } catch (erro) {
            console.error("Não foi possível carregar os produtos.", erro);
            return [];
        }
    }

    function salvarProdutos() {
        localStorage.setItem(
            "organiza3d_produtos",
            JSON.stringify(produtos)
        );
    }

    function mostrarProdutos() {
        if (!tabelaProdutos || !mensagemVazia) {
            return;
        }

        tabelaProdutos.innerHTML = "";

        if (produtos.length === 0) {
            mensagemVazia.style.display = "block";
            return;
        }

        mensagemVazia.style.display = "none";

        const tabela = document.createElement("table");
        tabela.className = "tabela";

        tabela.innerHTML = `
            <thead>
                <tr>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Custo</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                    <th>Ação</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const corpoTabela = tabela.querySelector("tbody");

        produtos.forEach(function (produto) {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${escaparTexto(produto.nome)}</td>
                <td>${escaparTexto(produto.categoria)}</td>
                <td>${formatarDinheiro(produto.custo)}</td>
                <td>${formatarDinheiro(produto.preco)}</td>
                <td>${produto.estoque}</td>
                <td>
                    <button
                        class="botao-excluir"
                        data-id="${produto.id}"
                        type="button"
                    >
                        Excluir
                    </button>
                </td>
            `;

            corpoTabela.appendChild(linha);
        });

        tabelaProdutos.appendChild(tabela);

        const botoesExcluir =
            tabelaProdutos.querySelectorAll(".botao-excluir");

        botoesExcluir.forEach(function (botao) {
            botao.addEventListener("click", function () {
                excluirProduto(Number(botao.dataset.id));
            });
        
        
        });
    }

    function excluirProduto(id) {
        const produtoEncontrado = produtos.find(function (produto) {
            return produto.id === id;
        });

        if (!produtoEncontrado) {
            return;
        }

        const confirmar = confirm(
            `Deseja excluir o produto "${produtoEncontrado.nome}"?`
        );

        if (!confirmar) {
            return;
        }

        produtos = produtos.filter(function (produto) {
            return produto.id !== id;
        });

        salvarProdutos();
        mostrarProdutos();
        atualizarDashboard();
    }

    function atualizarDashboard() {
        if (totalProdutos) {
            totalProdutos.textContent = produtos.length;
        }

        const faturamentoEstimado = produtos.reduce(
            function (total, produto) {
                return total + produto.preco * produto.estoque;
            },
            0
        );

        const custoEstoque = produtos.reduce(
            function (total, produto) {
                return total + produto.custo * produto.estoque;
            },
            0
        );

        const lucroEstimado =
            faturamentoEstimado - custoEstoque;

        const campoFaturamento =
            document.getElementById("total-faturamento");

        const campoLucro =
            document.getElementById("total-lucro");

        if (campoFaturamento) {
            campoFaturamento.textContent =
                formatarDinheiro(faturamentoEstimado);
        }

        if (campoLucro) {
            campoLucro.textContent =
                formatarDinheiro(lucroEstimado);
        }
    }

    function formatarDinheiro(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function escaparTexto(texto) {
        const elemento = document.createElement("div");
        elemento.textContent = texto || "";
        return elemento.innerHTML;
    }

    
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
// IMPRESSORAS
// =========================

let impressoras = JSON.parse(
    localStorage.getItem("organiza3d_impressoras")
) || [];

const botaoSalvarImpressora =
    document.getElementById("salvar-impressora");

const listaImpressoras =
    document.getElementById("lista-impressoras");

function salvarImpressoras() {
    localStorage.setItem(
        "organiza3d_impressoras",
        JSON.stringify(impressoras)
    );
}

function mostrarImpressoras() {

    if (!listaImpressoras) return;

    if (impressoras.length === 0) {
        listaImpressoras.innerHTML =
            "<p>Nenhuma impressora cadastrada.</p>";
        return;
    }

    listaImpressoras.innerHTML = impressoras.map(function (imp) {
        return `
            <div class="card-item">
                <h4>${imp.nome}</h4>
                <p><strong>Modelo:</strong> ${imp.modelo}</p>
<p><strong>Série:</strong> ${imp.serie}</p>
<p><strong>Compra:</strong> ${imp.dataCompra}</p>
<p><strong>Valor:</strong> R$ ${imp.valor}</p>
<p><strong>Status:</strong> ${imp.status}</p>

<button
    type="button"
    class="botao-excluir"
    onclick="excluirImpressora(${imp.id})">
    Excluir
</button>
            </div>
        `;
    }).join("");


}
mostrarImpressoras();

const totalImpressoras =
    document.getElementById("total-impressoras");

if (totalImpressoras) {
    totalImpressoras.textContent = impressoras.length;
}

if (botaoSalvarImpressora) {
    botaoSalvarImpressora.addEventListener("click", function () {
        const nome = document
            .getElementById("nome-impressora")
            .value
            .trim();

        const modelo = document
            .getElementById("modelo-impressora")
            .value
            .trim();

        if (!nome) {
            alert("Informe o nome da impressora.");
            return;
        }

 const impressora = {
    id: Date.now(),
    nome: nome,
    modelo: modelo,
    serie: document.getElementById(
        "serie-impressora"
    ).value.trim(),
    dataCompra: document.getElementById(
        "data-compra-impressora"
    ).value,
    valor: Number(
        document.getElementById(
            "valor-impressora"
        ).value
    ) || 0,
    status: document.getElementById(
        "status-impressora"
    ).value
};

        impressoras.push(impressora);
        salvarImpressoras();
        mostrarImpressoras();

        if (totalImpressoras) {
            totalImpressoras.textContent = impressoras.length;
        }

               alert("Impressora cadastrada com sucesso!");

document.getElementById("nome-impressora").value = "";
document.getElementById("modelo-impressora").value = "";
document.getElementById("serie-impressora").value = "";
document.getElementById("data-compra-impressora").value = "";
document.getElementById("valor-impressora").value = "";
document.getElementById("status-impressora").selectedIndex = 0;
    });
}

window.excluirImpressora = function (id) {

    if (!confirm("Tem certeza que deseja excluir esta impressora?")) {
        return;
    }

    impressoras = impressoras.filter(function (imp) {
        return imp.id !== id;
    });

    salvarImpressoras();
    mostrarImpressoras();

    if (totalImpressoras) {
    totalImpressoras.textContent = impressoras.length;
}
};
// =========================
// FINANCEIRO
// =========================

let lancamentosFinanceiros = JSON.parse(
    localStorage.getItem("organiza3d_financeiro")
) || [];

const botaoSalvarLancamento =
    document.getElementById("salvar-lancamento");

const listaLancamentos =
    document.getElementById("lista-lancamentos");

const totalEntradasFinanceiro =
    document.getElementById(
        "financeiro-total-entradas"
    );

const totalDespesasFinanceiro =
    document.getElementById(
        "financeiro-total-despesas"
    );

const saldoFinanceiro =
    document.getElementById("financeiro-saldo");

const campoDataLancamento =
    document.getElementById("data-lancamento");

function salvarLancamentosFinanceiros() {
    localStorage.setItem(
        "organiza3d_financeiro",
        JSON.stringify(lancamentosFinanceiros)
    );
}

function formatarDataFinanceiro(data) {
    if (!data) {
        return "Não informada";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

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

function atualizarResumoFinanceiro() {
    const entradas = lancamentosFinanceiros
        .filter(function (lancamento) {
            return lancamento.tipo === "Entrada";
        })
        .reduce(function (total, lancamento) {
            return total + Number(lancamento.valor);
        }, 0);

    const despesas = lancamentosFinanceiros
        .filter(function (lancamento) {
            return lancamento.tipo === "Despesa";
        })
        .reduce(function (total, lancamento) {
            return total + Number(lancamento.valor);
        }, 0);

    const saldo = entradas - despesas;

    if (totalEntradasFinanceiro) {
        totalEntradasFinanceiro.textContent =
            formatarDinheiro(entradas);
    }

    if (totalDespesasFinanceiro) {
        totalDespesasFinanceiro.textContent =
            formatarDinheiro(despesas);
    }

    if (saldoFinanceiro) {
        saldoFinanceiro.textContent =
            formatarDinheiro(saldo);
    }
}

function mostrarLancamentosFinanceiros() {
    if (!listaLancamentos) {
        return;
    }

    if (lancamentosFinanceiros.length === 0) {
        listaLancamentos.innerHTML =
            "<p>Nenhum lançamento cadastrado.</p>";

        return;
    }

    const lancamentosOrdenados =
        [...lancamentosFinanceiros].sort(
            function (a, b) {
                return new Date(b.data) -
                    new Date(a.data);
            }
        );

    listaLancamentos.innerHTML =
        lancamentosOrdenados
            .map(function (lancamento) {
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
                                lancamento.valor
                            )}
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
}

mostrarLancamentosFinanceiros();
atualizarResumoFinanceiro();

if (
    campoDataLancamento &&
    !campoDataLancamento.value
) {
    campoDataLancamento.value =
        obterDataHojeFinanceiro();
}

if (botaoSalvarLancamento) {
    botaoSalvarLancamento.addEventListener(
        "click",
        function () {
            const tipo = document
                .getElementById("tipo-lancamento")
                .value;

            const categoria = document
                .getElementById(
                    "categoria-lancamento"
                )
                .value;

            const descricao = document
                .getElementById(
                    "descricao-lancamento"
                )
                .value
                .trim();

            const valor = Number(
                document.getElementById(
                    "valor-lancamento"
                ).value
            );

            const data = document
                .getElementById("data-lancamento")
                .value;

            if (!categoria) {
                alert("Selecione uma categoria.");
                return;
            }

            if (!descricao) {
                alert("Informe a descrição.");
                return;
            }

            if (!valor || valor <= 0) {
                alert("Informe um valor válido.");
                return;
            }

            if (!data) {
                alert("Informe a data.");
                return;
            }

            const lancamento = {
                id: Date.now(),
                tipo: tipo,
                categoria: categoria,
                descricao: descricao,
                valor: valor,
                data: data
            };

            lancamentosFinanceiros.push(
                lancamento
            );

            salvarLancamentosFinanceiros();
            mostrarLancamentosFinanceiros();
            atualizarResumoFinanceiro();

            document.getElementById(
                "tipo-lancamento"
            ).selectedIndex = 0;

            document.getElementById(
                "categoria-lancamento"
            ).selectedIndex = 0;

            document.getElementById(
                "descricao-lancamento"
            ).value = "";

            document.getElementById(
                "valor-lancamento"
            ).value = "";

            document.getElementById(
                "data-lancamento"
            ).value = obterDataHojeFinanceiro();

            alert(
                "Lançamento cadastrado com sucesso!"
            );
        }
    );
}

window.excluirLancamentoFinanceiro =
    function (id) {
        const confirmar = confirm(
            "Tem certeza que deseja excluir este lançamento?"
        );

        if (!confirmar) {
            return;
        }

        lancamentosFinanceiros =
            lancamentosFinanceiros.filter(
                function (lancamento) {
                    return lancamento.id !== id;
                }
            );

        salvarLancamentosFinanceiros();
        mostrarLancamentosFinanceiros();
        atualizarResumoFinanceiro();
    };
// =========================
// RELATÓRIOS
// =========================

const botaoAtualizarRelatorios =
    document.getElementById("atualizar-relatorios");

const menuRelatorios =
    document.querySelector('[data-pagina="relatorios"]');

function contarEncomendasPorStatus(status) {
    return encomendas.filter(
        function (encomenda) {
            return encomenda.status === status;
        }
    ).length;
}

function atualizarRelatorios() {
    const campoProdutos =
        document.getElementById("relatorio-produtos");

    const campoClientes =
        document.getElementById("relatorio-clientes");

    const campoEncomendas =
        document.getElementById("relatorio-encomendas");

    const campoFilamentos =
        document.getElementById("relatorio-filamentos");

    const campoImpressoras =
        document.getElementById("relatorio-impressoras");

    const campoAguardando =
        document.getElementById("relatorio-aguardando");

    const campoProducao =
        document.getElementById("relatorio-producao");

    const campoFinalizadas =
        document.getElementById("relatorio-finalizadas");

    const campoEntregues =
        document.getElementById("relatorio-entregues");

    const campoCanceladas =
        document.getElementById("relatorio-canceladas");

    const campoEntradas =
        document.getElementById("relatorio-entradas");

    const campoDespesas =
        document.getElementById("relatorio-despesas");

    const campoSaldo =
        document.getElementById("relatorio-saldo");

    const campoValorEncomendas =
        document.getElementById(
            "relatorio-valor-encomendas"
        );

    const campoMaiorEstoque =
        document.getElementById(
            "relatorio-maior-estoque"
        );

    const campoUltimoCliente =
        document.getElementById(
            "relatorio-ultimo-cliente"
        );

    const campoUltimaEncomenda =
        document.getElementById(
            "relatorio-ultima-encomenda"
        );

    if (campoProdutos) {
        campoProdutos.textContent = produtos.length;
    }

    if (campoClientes) {
        campoClientes.textContent = clientes.length;
    }

    if (campoEncomendas) {
        campoEncomendas.textContent = encomendas.length;
    }

    if (campoFilamentos) {
        campoFilamentos.textContent = filamentos.length;
    }

    if (campoImpressoras) {
        campoImpressoras.textContent = impressoras.length;
    }

    if (campoAguardando) {
        campoAguardando.textContent =
            contarEncomendasPorStatus("Aguardando");
    }

    if (campoProducao) {
        campoProducao.textContent =
            contarEncomendasPorStatus("Em produção");
    }

    if (campoFinalizadas) {
        campoFinalizadas.textContent =
            contarEncomendasPorStatus("Finalizada");
    }

    if (campoEntregues) {
        campoEntregues.textContent =
            contarEncomendasPorStatus("Entregue");
    }

    if (campoCanceladas) {
        campoCanceladas.textContent =
            contarEncomendasPorStatus("Cancelada");
    }

    const totalEntradasRelatorio =
        lancamentosFinanceiros
            .filter(function (lancamento) {
                return lancamento.tipo === "Entrada";
            })
            .reduce(function (total, lancamento) {
                return total + Number(lancamento.valor);
            }, 0);

    const totalDespesasRelatorio =
        lancamentosFinanceiros
            .filter(function (lancamento) {
                return lancamento.tipo === "Despesa";
            })
            .reduce(function (total, lancamento) {
                return total + Number(lancamento.valor);
            }, 0);

    const saldoRelatorio =
        totalEntradasRelatorio -
        totalDespesasRelatorio;

    const valorTotalEncomendas =
        encomendas.reduce(
            function (total, encomenda) {
                if (encomenda.status === "Cancelada") {
                    return total;
                }

                return total +
                    Number(encomenda.valorTotal || 0);
            },
            0
        );

    if (campoEntradas) {
        campoEntradas.textContent =
            formatarDinheiro(totalEntradasRelatorio);
    }

    if (campoDespesas) {
        campoDespesas.textContent =
            formatarDinheiro(totalDespesasRelatorio);
    }

    if (campoSaldo) {
        campoSaldo.textContent =
            formatarDinheiro(saldoRelatorio);
    }

    if (campoValorEncomendas) {
        campoValorEncomendas.textContent =
            formatarDinheiro(valorTotalEncomendas);
    }

    if (campoMaiorEstoque) {
        if (produtos.length === 0) {
            campoMaiorEstoque.textContent =
                "Nenhum produto cadastrado";
        } else {
            const produtoMaiorEstoque =
                produtos.reduce(
                    function (maior, produto) {
                        if (
                            Number(produto.estoque) >
                            Number(maior.estoque)
                        ) {
                            return produto;
                        }

                        return maior;
                    }
                );

            campoMaiorEstoque.textContent =
                `${produtoMaiorEstoque.nome} — ` +
                `${produtoMaiorEstoque.estoque} unidade(s)`;
        }
    }

    if (campoUltimoCliente) {
        if (clientes.length === 0) {
            campoUltimoCliente.textContent =
                "Nenhum cliente cadastrado";
        } else {
            const ultimoCliente =
                clientes[clientes.length - 1];

            campoUltimoCliente.textContent =
                ultimoCliente.nome;
        }
    }

    if (campoUltimaEncomenda) {
        if (encomendas.length === 0) {
            campoUltimaEncomenda.textContent =
                "Nenhuma encomenda cadastrada";
        } else {
            const ultimaEncomenda =
                encomendas[encomendas.length - 1];

            campoUltimaEncomenda.textContent =
                `${ultimaEncomenda.produtoNome} — ` +
                `${ultimaEncomenda.clienteNome}`;
        }
    }
}

if (menuRelatorios) {
    menuRelatorios.addEventListener(
        "click",
        atualizarRelatorios
    );
}

if (botaoAtualizarRelatorios) {
    botaoAtualizarRelatorios.addEventListener(
        "click",
        function () {
            atualizarRelatorios();

            alert(
                "Relatórios atualizados com sucesso!"
            );
        }
    );
}

atualizarRelatorios();

// =========================
// ENCOMENDAS
// =========================

let encomendas = JSON.parse(
    localStorage.getItem("organiza3d_encomendas")
) || [];

const botaoSalvarEncomenda =
    document.getElementById("salvar-encomenda");

const listaEncomendas =
    document.getElementById("lista-encomendas");

const totalEncomendas =
    document.getElementById("total-encomendas");

const campoClienteEncomenda =
    document.getElementById("cliente-encomenda");

const campoProdutoEncomenda =
    document.getElementById("produto-encomenda");

const campoQuantidadeEncomenda =
    document.getElementById("quantidade-encomenda");

const campoValorTotalEncomenda =
    document.getElementById("valor-total-encomenda");

const campoDataPedidoEncomenda =
    document.getElementById("data-pedido-encomenda");

const menuEncomendas =
    document.querySelector('[data-pagina="encomendas"]');

function salvarEncomendas() {
    localStorage.setItem(
        "organiza3d_encomendas",
        JSON.stringify(encomendas)
    );
}

function atualizarTotalEncomendas() {
    if (totalEncomendas) {
        totalEncomendas.textContent = encomendas.length;
    }
}

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

function atualizarOpcoesEncomendas() {
    if (campoClienteEncomenda) {
        campoClienteEncomenda.innerHTML =
            '<option value="">Selecione o cliente</option>';

        clientes.forEach(function (cliente) {
            campoClienteEncomenda.innerHTML += `
                <option value="${cliente.id}">
                    ${escaparTexto(cliente.nome)}
                </option>
            `;
        });
    }

    if (campoProdutoEncomenda) {
        campoProdutoEncomenda.innerHTML =
            '<option value="">Selecione o produto</option>';

        produtos.forEach(function (produto) {
            campoProdutoEncomenda.innerHTML += `
                <option value="${produto.id}">
                    ${escaparTexto(produto.nome)}
                    — ${formatarDinheiro(produto.preco)}
                </option>
            `;
        });
    }
}

function calcularValorEncomenda() {
    if (
        !campoProdutoEncomenda ||
        !campoQuantidadeEncomenda ||
        !campoValorTotalEncomenda
    ) {
        return;
    }

    const produtoId = Number(
        campoProdutoEncomenda.value
    );

    const quantidade = Number(
        campoQuantidadeEncomenda.value
    ) || 0;

    const produtoEncontrado = produtos.find(
        function (produto) {
            return produto.id === produtoId;
        }
    );

    if (!produtoEncontrado || quantidade <= 0) {
        campoValorTotalEncomenda.value = "";
        return;
    }

    const valorTotal =
        Number(produtoEncontrado.preco || 0) *
        quantidade;

    campoValorTotalEncomenda.value =
        valorTotal.toFixed(2);
}

function mostrarEncomendas() {
    if (!listaEncomendas) {
        return;
    }

    if (encomendas.length === 0) {
        listaEncomendas.innerHTML =
            "<p>Nenhuma encomenda cadastrada.</p>";

        return;
    }

    listaEncomendas.innerHTML = encomendas
        .map(function (encomenda) {
            return `
                <div class="card-item">

                    <h4>
                        ${escaparTexto(encomenda.produtoNome)}
                    </h4>

                    <p>
                        <strong>Cliente:</strong>
                        ${escaparTexto(encomenda.clienteNome)}
                    </p>

                    <p>
                        <strong>Quantidade:</strong>
                        ${encomenda.quantidade}
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
                        ${escaparTexto(encomenda.status)}
                    </p>

                    <p>
                        <strong>Valor total:</strong>
                        ${formatarDinheiro(
                            encomenda.valorTotal
                        )}
                    </p>

                    <button
                        type="button"
                        class="botao-excluir"
                        onclick="excluirEncomenda(${encomenda.id})">
                        Excluir
                    </button>

                </div>
            `;
        })
        .join("");
}

atualizarOpcoesEncomendas();
mostrarEncomendas();
atualizarTotalEncomendas();

if (
    campoDataPedidoEncomenda &&
    !campoDataPedidoEncomenda.value
) {
    campoDataPedidoEncomenda.value =
        obterDataHoje();
}

if (menuEncomendas) {
    menuEncomendas.addEventListener(
        "click",
        function () {
            atualizarOpcoesEncomendas();
            calcularValorEncomenda();
        }
    );
}

if (campoProdutoEncomenda) {
    campoProdutoEncomenda.addEventListener(
        "change",
        calcularValorEncomenda
    );
}

if (campoQuantidadeEncomenda) {
    campoQuantidadeEncomenda.addEventListener(
        "input",
        calcularValorEncomenda
    );
}

if (botaoSalvarEncomenda) {
    botaoSalvarEncomenda.addEventListener(
        "click",
        function () {
            const clienteId = Number(
                document.getElementById(
                    "cliente-encomenda"
                ).value
            );

            const produtoId = Number(
                document.getElementById(
                    "produto-encomenda"
                ).value
            );

            const quantidade = Number(
                document.getElementById(
                    "quantidade-encomenda"
                ).value
            );

            const dataPedido = document
                .getElementById(
                    "data-pedido-encomenda"
                )
                .value;

            const dataEntrega = document
                .getElementById(
                    "data-entrega-encomenda"
                )
                .value;

            const status = document
                .getElementById(
                    "status-encomenda"
                )
                .value;

            const clienteEncontrado = clientes.find(
                function (cliente) {
                    return cliente.id === clienteId;
                }
            );

            const produtoEncontrado = produtos.find(
                function (produto) {
                    return produto.id === produtoId;
                }
            );

            if (!clienteEncontrado) {
                alert("Selecione um cliente.");
                return;
            }

            if (!produtoEncontrado) {
                alert("Selecione um produto.");
                return;
            }

            if (!quantidade || quantidade <= 0) {
                alert("Informe uma quantidade válida.");
                return;
            }

            if (!dataPedido) {
                alert("Informe a data do pedido.");
                return;
            }

            if (!dataEntrega) {
                alert("Informe a previsão de entrega.");
                return;
            }

            const valorUnitario =
                Number(produtoEncontrado.preco) || 0;

            const valorTotal =
                valorUnitario * quantidade;

            const encomenda = {
                id: Date.now(),
                clienteId: clienteEncontrado.id,
                clienteNome: clienteEncontrado.nome,
                produtoId: produtoEncontrado.id,
                produtoNome: produtoEncontrado.nome,
                quantidade: quantidade,
                dataPedido: dataPedido,
                dataEntrega: dataEntrega,
                status: status,
                valorUnitario: valorUnitario,
                valorTotal: valorTotal
            };

            encomendas.push(encomenda);

            salvarEncomendas();
            mostrarEncomendas();
            atualizarTotalEncomendas();

            atualizarOpcoesEncomendas();

            document.getElementById(
                "quantidade-encomenda"
            ).value = 1;

            document.getElementById(
                "data-pedido-encomenda"
            ).value = obterDataHoje();

            document.getElementById(
                "data-entrega-encomenda"
            ).value = "";

            document.getElementById(
                "status-encomenda"
            ).selectedIndex = 0;

            document.getElementById(
                "valor-total-encomenda"
            ).value = "";

            alert("Encomenda cadastrada com sucesso!");
        }
    );
}

window.excluirEncomenda = function (id) {
    const confirmar = confirm(
        "Tem certeza que deseja excluir esta encomenda?"
    );

    if (!confirmar) {
        return;
    }

    encomendas = encomendas.filter(
        function (encomenda) {
            return encomenda.id !== id;
        }
    );

    salvarEncomendas();
    mostrarEncomendas();
    atualizarTotalEncomendas();
};


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
// DASHBOARD COMPLETO
// =========================

const botaoAtualizarDashboardCompleto =
    document.getElementById("atualizar-dashboard");

const menuDashboard =
    document.querySelector('[data-pagina="dashboard"]');

function contarEncomendasDashboard(status) {
    return encomendas.filter(
        function (encomenda) {
            return encomenda.status === status;
        }
    ).length;
}

function calcularEncomendasAtrasadas() {
    const hoje = obterDataHoje();

    return encomendas.filter(
        function (encomenda) {
            const statusEncerrado =
                encomenda.status === "Entregue" ||
                encomenda.status === "Cancelada" ||
                encomenda.status === "Finalizada";

            return (
                encomenda.dataEntrega &&
                encomenda.dataEntrega < hoje &&
                !statusEncerrado
            );
        }
    ).length;
}

function atualizarAlertasDashboard() {
    const campoAlertas =
        document.getElementById("dashboard-alertas");

    if (!campoAlertas) {
        return;
    }

    const alertas = [];

    const encomendasAtrasadas =
        calcularEncomendasAtrasadas();

    if (produtos.length === 0) {
        alertas.push(
            "Nenhum produto cadastrado."
        );
    }

    if (clientes.length === 0) {
        alertas.push(
            "Nenhum cliente cadastrado."
        );
    }

    if (filamentos.length === 0) {
        alertas.push(
            "Nenhum filamento cadastrado."
        );
    }

    if (impressoras.length === 0) {
        alertas.push(
            "Nenhuma impressora cadastrada."
        );
    }

    if (encomendasAtrasadas > 0) {
        alertas.push(
            `${encomendasAtrasadas} encomenda(s) atrasada(s).`
        );
    }

    const impressorasManutencao =
        impressoras.filter(
            function (impressora) {
                return impressora.status ===
                    "Em manutenção";
            }
        ).length;

    if (impressorasManutencao > 0) {
        alertas.push(
            `${impressorasManutencao} impressora(s) em manutenção.`
        );
    }

    if (alertas.length === 0) {
        campoAlertas.innerHTML =
            "<p>Nenhum aviso no momento.</p>";

        return;
    }

    campoAlertas.innerHTML = alertas
        .map(function (alerta) {
            return `
                <p>
                    ⚠️ ${escaparTexto(alerta)}
                </p>
            `;
        })
        .join("");
}

function atualizarDashboardCompleto() {
    atualizarDashboard();

    const campoClientes =
        document.getElementById("total-clientes");

    const campoEncomendas =
        document.getElementById("total-encomendas");

    const campoFilamentos =
        document.getElementById("total-filamentos");

    const campoImpressoras =
        document.getElementById("total-impressoras");

    const campoAguardando =
        document.getElementById("dashboard-aguardando");

    const campoProducao =
        document.getElementById("dashboard-producao");

    const campoFinalizadas =
        document.getElementById("dashboard-finalizadas");

    const campoEntregues =
        document.getElementById("dashboard-entregues");

    const campoAtrasadas =
        document.getElementById("dashboard-atrasadas");

    const campoSaldo =
        document.getElementById(
            "dashboard-saldo-financeiro"
        );

    if (campoClientes) {
        campoClientes.textContent =
            clientes.length;
    }

    if (campoEncomendas) {
        campoEncomendas.textContent =
            encomendas.length;
    }

    if (campoFilamentos) {
        campoFilamentos.textContent =
            filamentos.length;
    }

    if (campoImpressoras) {
        campoImpressoras.textContent =
            impressoras.length;
    }

    if (campoAguardando) {
        campoAguardando.textContent =
            contarEncomendasDashboard(
                "Aguardando"
            );
    }

    if (campoProducao) {
        campoProducao.textContent =
            contarEncomendasDashboard(
                "Em produção"
            );
    }

    if (campoFinalizadas) {
        campoFinalizadas.textContent =
            contarEncomendasDashboard(
                "Finalizada"
            );
    }

    if (campoEntregues) {
        campoEntregues.textContent =
            contarEncomendasDashboard(
                "Entregue"
            );
    }

    if (campoAtrasadas) {
        campoAtrasadas.textContent =
            calcularEncomendasAtrasadas();
    }

    const entradasDashboard =
        lancamentosFinanceiros
            .filter(function (lancamento) {
                return lancamento.tipo === "Entrada";
            })
            .reduce(function (total, lancamento) {
                return total +
                    Number(lancamento.valor);
            }, 0);

    const despesasDashboard =
        lancamentosFinanceiros
            .filter(function (lancamento) {
                return lancamento.tipo === "Despesa";
            })
            .reduce(function (total, lancamento) {
                return total +
                    Number(lancamento.valor);
            }, 0);

    if (campoSaldo) {
        campoSaldo.textContent =
            formatarDinheiro(
                entradasDashboard -
                despesasDashboard
            );
    }

    atualizarAlertasDashboard();
}

if (menuDashboard) {
    menuDashboard.addEventListener(
        "click",
        atualizarDashboardCompleto
    );
}

if (botaoAtualizarDashboardCompleto) {
    botaoAtualizarDashboardCompleto.addEventListener(
        "click",
        function () {
            atualizarDashboardCompleto();

            alert(
                "Dashboard atualizado com sucesso!"
            );
        }
    );
}

atualizarDashboardCompleto();

});