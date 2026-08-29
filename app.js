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