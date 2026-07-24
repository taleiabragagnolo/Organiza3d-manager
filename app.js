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
});