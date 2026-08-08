// ======================================================
// MÓDULO CLIENTE
// cliente.js
// ======================================================

function iniciarCliente() {

    "use strict";

    // ==================================================
    // DADOS DO MÓDULO
    // ==================================================

    let cliente = carregarCliente();
    let clienteEmEdicaoId = null;


    // ==================================================
    // ELEMENTOS DO HTML
    // ==================================================

    const campoNome =
        document.getElementById("nome-cliente");

    const campoTelefone =
        document.getElementById("telefone-cliente");

    const campoEmail =
        document.getElementById("email-cliente");

    const campoCidade =
        document.getElementById("cidade-cliente");

    const campoObservacoes =
        document.getElementById("observacoes-cliente");

    const botaoSalvarCliente =
        document.getElementById("salvar-cliente");

    const botaoLimparCliente =
        document.getElementById("limpar-formulario-cliente");

    const campoBuscaCliente =
        document.getElementById("buscar-cliente");

    const listaCliente =
        document.getElementById("lista-cliente");

    const totalCliente =
        document.getElementById("total-cliente");


    // ==================================================
    // CARREGAR CLIENTES
    // ==================================================

    function carregarCliente() {

        try {

            const dadosSalvos =
                JSON.parse(
                    localStorage.getItem(
                        "organiza3d_cliente"
                    )
                );

            return Array.isArray(dadosSalvos)
                ? dadosSalvos
                : [];

        } catch (erro) {

            console.error(
                "Não foi possível carregar os clientes.",
                erro
            );

            return [];
        }

    }


    // ==================================================
    // SALVAR CLIENTES
    // ==================================================

    function salvarCliente() {

        localStorage.setItem(
            "organiza3d_cliente",
            JSON.stringify(cliente)
        );

    }


    // ==================================================
    // ATUALIZAR TOTAL
    // ==================================================

    function atualizarTotalCliente() {

        if (totalCliente) {
            totalCliente.textContent = cliente.length;
        }

    }


    // ==================================================
    // LIMPAR FORMULÁRIO
    // ==================================================

    function limparFormularioCliente() {

        clienteEmEdicaoId = null;

        if (campoNome) {
            campoNome.value = "";
        }

        if (campoTelefone) {
            campoTelefone.value = "";
        }

        if (campoEmail) {
            campoEmail.value = "";
        }

        if (campoCidade) {
            campoCidade.value = "";
        }

        if (campoObservacoes) {
            campoObservacoes.value = "";
        }

        if (botaoSalvarCliente) {
            botaoSalvarCliente.innerHTML =
                "💾 Salvar Cliente";
        }

    }


    // ==================================================
    // FILTRAR CLIENTES
    // ==================================================

    function obterClientesFiltrados() {

        const termo =
            campoBuscaCliente
                ? campoBuscaCliente.value
                    .trim()
                    .toLowerCase()
                : "";

        if (!termo) {
            return cliente;
        }

        return cliente.filter(function (item) {

            const texto = [
                item.nome,
                item.telefone,
                item.email,
                item.cidade,
                item.observacoes
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return texto.includes(termo);

        });

    }


    // ==================================================
    // MOSTRAR CLIENTES
    // ==================================================

    function mostrarCliente() {

        if (!listaCliente) {
            return;
        }

        const clientesFiltrados =
            obterClientesFiltrados();

        if (clientesFiltrados.length === 0) {

            listaCliente.innerHTML = `
                <p class="mensagem-vazia">
                    Nenhum cliente encontrado.
                </p>
            `;

            return;
        }

        listaCliente.innerHTML =
            clientesFiltrados
                .map(function (item) {

                    return `
                        <div class="cliente-tabela-linha">

                            <div class="cliente-coluna cliente-nome">
                                ${escaparTexto(
                                    item.nome || "Não informado"
                                )}
                            </div>

                            <div class="cliente-coluna">
                                ${escaparTexto(
                                    item.telefone || "Não informado"
                                )}
                            </div>

                            <div class="cliente-coluna">
                                ${escaparTexto(
                                    item.email || "Não informado"
                                )}
                            </div>

                            <div class="cliente-coluna">
                                ${escaparTexto(
                                    item.cidade || "Não informado"
                                )}
                            </div>

                            <div class="cliente-coluna cliente-observacao">
                                ${escaparTexto(
                                    item.observacoes || "Nenhuma"
                                )}
                            </div>

                            <div class="cliente-coluna cliente-acoes">

                                <button
                                    type="button"
                                    class="botao-principal botao-editar-cliente"
                                    onclick="editarCliente(${item.id})">

                                    ✏️ Editar

                                </button>

                                <button
                                    type="button"
                                    class="botao-excluir"
                                    onclick="excluirCliente(${item.id})">

                                    Excluir

                                </button>

                            </div>

                        </div>
                    `;

                })
                .join("");

    }


    // ==================================================
    // EDITAR CLIENTE
    // ==================================================

    window.editarCliente = function (id) {

        const clienteEncontrado =
            cliente.find(function (item) {
                return item.id === id;
            });

        if (!clienteEncontrado) {

            alert("Cliente não encontrado.");
            return;

        }

        clienteEmEdicaoId = id;

        if (campoNome) {
            campoNome.value =
                clienteEncontrado.nome || "";
        }

        if (campoTelefone) {
            campoTelefone.value =
                clienteEncontrado.telefone || "";
        }

        if (campoEmail) {
            campoEmail.value =
                clienteEncontrado.email || "";
        }

        if (campoCidade) {
            campoCidade.value =
                clienteEncontrado.cidade || "";
        }

        if (campoObservacoes) {
            campoObservacoes.value =
                clienteEncontrado.observacoes || "";
        }

        if (botaoSalvarCliente) {
            botaoSalvarCliente.innerHTML =
                "💾 Atualizar Cliente";
        }

        if (campoNome) {
            campoNome.focus();
        }

    };


    // ==================================================
    // EXCLUIR CLIENTE
    // ==================================================

    window.excluirCliente = function (id) {

        const confirmar = confirm(
            "Tem certeza que deseja excluir este cliente?"
        );

        if (!confirmar) {
            return;
        }

        cliente = cliente.filter(
            function (item) {
                return item.id !== id;
            }
        );

        salvarCliente();
        mostrarCliente();
        atualizarTotalCliente();

        if (clienteEmEdicaoId === id) {
            limparFormularioCliente();
        }

    };


    // ==================================================
    // SALVAR OU ATUALIZAR CLIENTE
    // ==================================================

    if (botaoSalvarCliente) {

        botaoSalvarCliente.addEventListener(
            "click",
            function () {

                const nome =
                    campoNome
                        ? campoNome.value.trim()
                        : "";

                const telefone =
                    campoTelefone
                        ? campoTelefone.value.trim()
                        : "";

                const email =
                    campoEmail
                        ? campoEmail.value.trim()
                        : "";

                const cidade =
                    campoCidade
                        ? campoCidade.value.trim()
                        : "";

                const observacoes =
                    campoObservacoes
                        ? campoObservacoes.value.trim()
                        : "";

                if (!nome) {

                    alert(
                        "Informe o nome completo do cliente."
                    );

                    return;
                }

                const estavaEditando =
                    clienteEmEdicaoId !== null;


                if (estavaEditando) {

                    const clienteEncontrado =
                        cliente.find(
                            function (item) {
                                return item.id ===
                                    clienteEmEdicaoId;
                            }
                        );

                    if (!clienteEncontrado) {

                        alert(
                            "Cliente não encontrado."
                        );

                        return;
                    }

                    clienteEncontrado.nome =
                        nome;

                    clienteEncontrado.telefone =
                        telefone;

                    clienteEncontrado.email =
                        email;

                    clienteEncontrado.cidade =
                        cidade;

                    clienteEncontrado.observacoes =
                        observacoes;

                } else {

                    const novoCliente = {

                        id: Date.now(),

                        nome: nome,

                        telefone: telefone,

                        email: email,

                        cidade: cidade,

                        observacoes: observacoes

                    };

                    cliente.push(novoCliente);

                }

                salvarCliente();
                mostrarCliente();
                atualizarTotalCliente();
                limparFormularioCliente();

                alert(
                    estavaEditando
                        ? "Cliente atualizado com sucesso!"
                        : "Cliente cadastrado com sucesso!"
                );

            }
        );

    }


    // ==================================================
    // BOTÃO LIMPAR
    // ==================================================

    if (botaoLimparCliente) {

        botaoLimparCliente.addEventListener(
            "click",
            limparFormularioCliente
        );

    }


    // ==================================================
    // BUSCA
    // ==================================================

    if (campoBuscaCliente) {

        campoBuscaCliente.addEventListener(
            "input",
            mostrarCliente
        );

    }


    // ==================================================
    // INICIALIZAÇÃO DO MÓDULO
    // ==================================================

    mostrarCliente();
    atualizarTotalCliente();

}