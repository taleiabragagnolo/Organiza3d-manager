// ======================================================
// ORGANIZA 3D MANAGER
// app.js
// Arquivo principal do sistema
// ======================================================

"use strict";

// ======================================================
// INICIALIZAÇÃO
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        try {

            iniciarAplicacao();

        } catch (erro) {

            console.error(
                "Erro ao iniciar o Organiza 3D:",
                erro
            );

            const detalheErro =
                erro && erro.message
                    ? erro.message
                    : String(
                        erro ||
                        "Erro desconhecido"
                    );

            alert(
                "Não foi possível iniciar o sistema.\n\n" +
                "Detalhe: " +
                detalheErro
            );

        }

    }
);

// ======================================================
// INICIAR APLICAÇÃO
// ======================================================

function iniciarAplicacao() {

    iniciarMenu();

    iniciarModulos();

     iniciarBackup();

    iniciarImportacaoBackup();

    abrirPaginaInicial();

}
// ======================================================
// MENU PRINCIPAL
// ======================================================

function iniciarMenu() {

    const botoesMenu =
        document.querySelectorAll(".menu-item");

    const paginas =
        document.querySelectorAll(".pagina");

    botoesMenu.forEach(function (botao) {

        botao.addEventListener(
            "click",
            function () {

                const paginaSelecionada =
                    botao.dataset.pagina;

                botoesMenu.forEach(function (item) {

                    item.classList.remove("ativo");

                });

                paginas.forEach(function (pagina) {

                    pagina.classList.remove("ativa");

                });

                botao.classList.add("ativo");

                const pagina =
                    document.getElementById(
                        paginaSelecionada
                    );

                if (pagina) {

                    pagina.classList.add("ativa");

                }

            }
        );

    });

}
// ======================================================
// INICIALIZAÇÃO DOS MÓDULOS
// ======================================================

function iniciarModulos() {

    if (typeof iniciarVenda === "function") {
        iniciarVenda();
    }

    if (typeof iniciarCliente === "function") {
        iniciarCliente();
    }

    if (typeof iniciarProduto === "function") {
        iniciarProduto();
    }

    if (typeof iniciarFilamento === "function") {
        iniciarFilamento();
    }

    if (typeof iniciarEquipamento === "function") {
        iniciarEquipamento();
    }

    if (typeof iniciarFinanceiro === "function") {
        iniciarFinanceiro();
    }

    if (typeof iniciarRelatorio === "function") {
        iniciarRelatorio();
    }

    if (typeof iniciarDashboard === "function") {
        iniciarDashboard();
    }

}
// ======================================================
// FUNÇÕES UTILITÁRIAS
// ======================================================

function escaparTexto(texto) {

    if (texto === null || texto === undefined) {
        return "";
    }

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

}

function formatarDinheiro(valor) {

    const numero = Number(valor) || 0;

    return numero.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}

function formatarNumero(valor) {

    return Number(valor || 0).toLocaleString(
        "pt-BR"
    );

}

function hoje() {

    return new Date()
        .toISOString()
        .split("T")[0];

}
// ======================================================
// PÁGINA INICIAL
// ======================================================

function abrirPaginaInicial() {

    const botoesMenu =
        document.querySelectorAll(".menu-item");

    const paginas =
        document.querySelectorAll(".pagina");

    botoesMenu.forEach(function (botao) {

        botao.classList.remove("ativo");

    });

    paginas.forEach(function (pagina) {

        pagina.classList.remove("ativa");

    });

    const botaoVendas =
        document.querySelector(
            '.menu-item[data-pagina="vendas"]'
        );

    const paginaVendas =
        document.getElementById("vendas");

    if (botaoVendas) {

        botaoVendas.classList.add("ativo");

    }

    if (paginaVendas) {

        paginaVendas.classList.add("ativa");

    }

}
// ======================================================
// BACKUP LOCAL
// ======================================================

function iniciarBackup() {

    const botaoBackup =
        document.getElementById(
            "botao-backup"
        );

    if (!botaoBackup) {
        return;
    }

    botaoBackup.addEventListener(
        "click",
        function () {

            const dadosBackup = {};

            for (
                let indice = 0;
                indice < localStorage.length;
                indice++
            ) {

                const chave =
                    localStorage.key(indice);

                if (
                    chave &&
                    chave.startsWith(
                        "organiza3d_"
                    )
                ) {

                    dadosBackup[chave] =
                        localStorage.getItem(
                            chave
                        );

                }

            }

            const backup = {
                sistema:
                    "Organiza 3D Manager",
                criadoEm:
                    new Date().toISOString(),
                dados:
                    dadosBackup
            };

            const arquivo =
                new Blob(
                    [
                        JSON.stringify(
                            backup,
                            null,
                            2
                        )
                    ],
                    {
                        type:
                            "application/json"
                    }
                );

            const endereco =
                URL.createObjectURL(
                    arquivo
                );

            const link =
                document.createElement(
                    "a"
                );

            link.href = endereco;

            link.download =
                "backup-organiza3d-" +
                hoje() +
                ".json";

            document.body.appendChild(
                link
            );

            link.click();

            link.remove();

            URL.revokeObjectURL(
                endereco
            );

            alert(
                "Backup baixado com sucesso."
            );

        }
    );

}
// ======================================================
// IMPORTAR BACKUP LOCAL
// ======================================================

function iniciarImportacaoBackup() {

    const botao =
        document.getElementById("botao-importar-backup");

    const campoArquivo =
        document.getElementById("arquivo-importar-backup");

    if (!botao || !campoArquivo) return;

    botao.addEventListener("click", function () {
        campoArquivo.value = "";
        campoArquivo.click();
    });

    campoArquivo.addEventListener("change", function () {

        const arquivo = campoArquivo.files[0];

        if (!arquivo) return;

        botao.disabled = true;

        const leitor = new FileReader();

        leitor.onerror = function () {
            botao.disabled = false;
            alert("Não foi possível ler o arquivo selecionado.");
        };

        leitor.onload = function () {

            let anteriores = null;
            let gravacaoIniciada = false;

            function listarChavesSistema() {
                const chaves = [];

                for (let i = 0; i < localStorage.length; i++) {
                    const chave = localStorage.key(i);

                    if (chave && chave.startsWith("organiza3d_")) {
                        chaves.push(chave);
                    }
                }

                return chaves;
            }

            try {
                const backup =
                    JSON.parse(String(leitor.result));

                if (
                    !backup ||
                    backup.sistema !== "Organiza 3D Manager" ||
                    !backup.dados ||
                    typeof backup.dados !== "object" ||
                    Array.isArray(backup.dados)
                ) {
                    throw new Error(
                        "O arquivo não é um backup válido do Organiza 3D."
                    );
                }

                const entradas = Object.entries(backup.dados);

                if (entradas.length === 0) {
                    throw new Error("O backup está vazio.");
                }

                // Confere todo o arquivo antes de alterar o sistema.
                entradas.forEach(function ([chave, valor]) {

                    if (
                        !chave.startsWith("organiza3d_") ||
                        typeof valor !== "string"
                    ) {
                        throw new Error(
                            "Formato inválido no backup: " + chave
                        );
                    }

                    JSON.parse(valor);
                });

                if (
                    !Object.prototype.hasOwnProperty.call(
                        backup.dados,
                        "organiza3d_produtos_produzidos"
                    ) ||
                    !Object.prototype.hasOwnProperty.call(
                        backup.dados,
                        "organiza3d_vendas"
                    )
                ) {
                    throw new Error(
                        "O backup não contém os dados de Produtos e Vendas."
                    );
                }

                const dataBackup =
                    new Date(backup.criadoEm);

                const dataTexto =
                    Number.isNaN(dataBackup.getTime())
                        ? "Data não informada"
                        : dataBackup.toLocaleString("pt-BR");

                const confirmado = confirm(
                    "Importar o backup de " + dataTexto + "?\n\n" +
                    "Os dados do Organiza 3D neste aparelho serão " +
                    "substituídos pelos dados do arquivo.\n\n" +
                    "Essa operação não junta os dados dos aparelhos."
                );

                if (!confirmado) return;

                anteriores = new Map(
                    listarChavesSistema().map(function (chave) {
                        return [chave, localStorage.getItem(chave)];
                    })
                );

                gravacaoIniciada = true;

                // Remove apenas dados do Organiza 3D.
                listarChavesSistema().forEach(function (chave) {
                    localStorage.removeItem(chave);
                });

                entradas.forEach(function ([chave, valor]) {
                    localStorage.setItem(chave, valor);
                });

                // Confirma que todos os valores foram gravados.
                entradas.forEach(function ([chave, valor]) {
                    if (localStorage.getItem(chave) !== valor) {
                        throw new Error(
                            "Não foi possível gravar: " + chave
                        );
                    }
                });

            } catch (erro) {

                if (gravacaoIniciada && anteriores) {
                    try {
                        listarChavesSistema().forEach(function (chave) {
                            localStorage.removeItem(chave);
                        });

                        anteriores.forEach(function (valor, chave) {
                            localStorage.setItem(chave, valor);
                        });

                    } catch (erroRestauracao) {
                        console.error(erroRestauracao);

                        alert(
                            "A importação falhou e não foi possível " +
                            "restaurar todos os dados anteriores. " +
                            "Guarde o arquivo de backup e não faça " +
                            "novos lançamentos até conferir o sistema."
                        );

                        return;
                    }
                }

                console.error("Erro ao importar backup:", erro);

                alert(
                    "O backup não foi importado.\n\n" +
                    erro.message +
                    (
                        gravacaoIniciada
                            ? "\n\nOs dados anteriores foram restaurados."
                            : ""
                    )
                );

                return;

            } finally {
                botao.disabled = false;
                campoArquivo.value = "";
            }

            alert(
                "Backup importado com sucesso! " +
                "O aplicativo será recarregado."
            );

            window.location.reload();
        };

        leitor.readAsText(arquivo);
    });
}