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

    const campoObservacoes =
        document.getElementById("observacoes-cliente");

    const botaoSalvarCliente =
        document.getElementById("salvar-cliente");

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
                "Não foi possível carregar os cliente.",
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

        if (campoObservacoes) {
            campoObservacoes.value = "";
        }

        if (botaoSalvarCliente) {
            botaoSalvarCliente.textContent =
                "Salvar Cliente";
        }

    }
        // ==================================================
    // MOSTRAR CLIENTES
    // ==================================================

    function mostrarCliente() {

        if (!listaCliente) {
            return;
        }

        if (cliente.length === 0) {

            listaCliente.innerHTML =
                "<p>Nenhum cliente cadastrado.</p>";

            return;

        }

        listaCliente.innerHTML = cliente
            .map(function (cliente) {

                return `
                    <div class="card-item">

                        <h4>
                            ${escaparTexto(cliente.nome)}
                        </h4>

                        <p>
                            <strong>Telefone:</strong>
                            ${escaparTexto(
                                cliente.telefone ||
                                "Não informado"
                            )}
                        </p>

                        <p>
                            <strong>E-mail:</strong>
                            ${escaparTexto(
                                cliente.email ||
                                "Não informado"
                            )}
                        </p>

                        <p>
                            <strong>Observações:</strong>
                            ${escaparTexto(
                                cliente.observacoes ||
                                "Nenhuma"
                            )}
                        </p>

                        <button
                            type="button"
                            class="botao-principal"
                            onclick="editarCliente(${cliente.id})"
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            class="botao-excluir"
                            onclick="excluirCliente(${cliente.id})"
                        >
                            Excluir
                        </button>

                    </div>
                `;

            })
            .join("");

    }
        // ==================================================
    // EDITAR CLIENTE
    // ==================================================

    window.editarCliente = function (id) {

        const clienteEncontrado = cliente.find(
            function (cliente) {
                return cliente.id === id;
            }
        );

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

        if (campoObservacoes) {
            campoObservacoes.value =
                clienteEncontrado.observacoes || "";
        }

        if (botaoSalvarCliente) {
            botaoSalvarCliente.textContent =
                "Atualizar Cliente";
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
            function (cliente) {
                return cliente.id !== id;
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

                const observacoes =
                    campoObservacoes
                        ? campoObservacoes.value.trim()
                        : "";

                if (!nome) {
                    alert("Informe o nome completo do cliente.");
                    return;
                }

                const estavaEditando =
                    clienteEmEdicaoId !== null;

                if (estavaEditando) {

                    const clienteEncontrado =
                        cliente.find(
                            function (cliente) {
                                return cliente.id ===
                                    clienteEmEdicaoId;
                            }
                        );

                    if (!clienteEncontrado) {
                        alert("Cliente não encontrado.");
                        return;
                    }

                    clienteEncontrado.nome = nome;
                    clienteEncontrado.telefone = telefone;
                    clienteEncontrado.email = email;
                    clienteEncontrado.observacoes =
                        observacoes;

                } else {

                    const novoCliente = {
                        id: Date.now(),
                        nome: nome,
                        telefone: telefone,
                        email: email,
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
    // INICIALIZAÇÃO DO MÓDULO
    // ==================================================

    mostrarCliente();
    atualizarTotalCliente();

}