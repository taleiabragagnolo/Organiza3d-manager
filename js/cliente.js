// ======================================================
// MÓDULO CLIENTES
// cliente.js
// ======================================================

function iniciarCliente() {

    let cliente = JSON.parse(
        localStorage.getItem("organiza3d_cliente")
    ) || [];
        let clienteEmEdicaoId = null;

    const botaoSalvarCliente =
        document.getElementById("salvar-cliente");

    const listaClientes =
        document.getElementById("lista-cliente");

    const totalClientes =
        document.getElementById("total-cliente");

    function salvarClientes() {

        localStorage.setItem(
            "organiza3d_cliente",
            JSON.stringify(cliente)
        );

    }

    function atualizarTotalClientes() {

        if (totalClientes) {
            totalClientes.textContent = cliente.length;
        }

    }

    function mostrarClientes() {

        if (!listaClientes) {
            return;
        }

        if (cliente.length === 0) {

            listaClientes.innerHTML =
                "<p>Nenhum cliente cadastrado.</p>";

            return;

        }

        listaClientes.innerHTML = cliente
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
                            <strong>Cidade:</strong>
                            ${escaparTexto(
                                cliente.cidade ||
                                "Não informada"
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
window.editarCliente = function (id) {

    const clienteEncontrado = cliente.find(
        function (item) {
            return item.id === id;
        }
    );

    if (!clienteEncontrado) {
        alert("Cliente não encontrado.");
        return;
    }

    clienteEmEdicaoId = id;

    document.getElementById("nome-cliente").value =
        clienteEncontrado.nome || "";

    document.getElementById("telefone-cliente").value =
        clienteEncontrado.telefone || "";

    document.getElementById("email-cliente").value =
        clienteEncontrado.email || "";

    document.getElementById("cidade-cliente").value =
        clienteEncontrado.cidade || "";

    document.getElementById("observacoes-cliente").value =
        clienteEncontrado.observacoes || "";

    if (botaoSalvarCliente) {
        botaoSalvarCliente.textContent =
            "Atualizar Cliente";
    }

};
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

        salvarClientes();
        mostrarClientes();
        atualizarTotalClientes();

    };

    if (botaoSalvarCliente) {

        botaoSalvarCliente.addEventListener(
            "click",
            function () {

                const campoNome =
                    document.getElementById("nome-cliente");

                const campoTelefone =
                    document.getElementById("telefone-cliente");

                const campoEmail =
                    document.getElementById("email-cliente");

                const campoCidade =
                    document.getElementById("cidade-cliente");

                const campoObservacoes =
                    document.getElementById(
                        "observacoes-cliente"
                    );

                if (!campoNome) {
                    return;
                }

                const nome =
                    campoNome.value.trim();

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
                        "Informe o nome do cliente."
                    );

                    return;

                }

                if (clienteEmEdicaoId !== null) {

    const clienteEncontrado = cliente.find(
        function (item) {
            return item.id === clienteEmEdicaoId;
        }
    );

    if (!clienteEncontrado) {
        alert("Cliente não encontrado.");
        return;
    }

    clienteEncontrado.nome = nome;
    clienteEncontrado.telefone = telefone;
    clienteEncontrado.email = email;
    clienteEncontrado.cidade = cidade;
    clienteEncontrado.observacoes = observacoes;

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

salvarClientes();
mostrarClientes();
atualizarTotalClientes();

clienteEmEdicaoId = null;

if (botaoSalvarCliente) {
    botaoSalvarCliente.textContent =
        "Salvar Cliente";
}

                campoNome.value = "";

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

                alert(
                    "Cliente cadastrado com sucesso!"
                );

            }
        );

    }

    mostrarClientes();
    atualizarTotalClientes();


}