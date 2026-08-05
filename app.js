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

        iniciarAplicacao();

    }
);

// ======================================================
// INICIAR APLICAÇÃO
// ======================================================

function iniciarAplicacao() {

    iniciarMenu();

    iniciarModulos();

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