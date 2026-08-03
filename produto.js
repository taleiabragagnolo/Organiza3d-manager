// ======================================================
// ORGANIZA 3D MANAGER
// MÓDULO PRODUTOS
// produto.js
// ======================================================

"use strict";

function iniciarProduto() {

    // ==================================================
    // CHAVES DO LOCALSTORAGE
    // ==================================================

    const CHAVE_PRODUTOS =
        "organiza3d_produtos_produzidos";

    const CHAVE_ORCAMENTOS =
        "organiza3d_orcamentos";

    const CHAVE_PERDAS =
        "organiza3d_perdas_produtos";

    const CHAVE_CONSUMO_PROPRIO =
        "organiza3d_consumo_proprio";

    const CHAVE_MOVIMENTACOES =
        "organiza3d_movimentacoes_produtos";

    const CHAVE_FILAMENTOS =
        "organiza3d_filamentos";

    const CHAVE_ACESSORIOS =
        "organiza3d_acessorios";

    const CHAVE_EMBALAGENS =
        "organiza3d_embalagens";

    const CHAVE_IMPRESSORAS =
        "organiza3d_impressoras";

    const CHAVE_CLIENTES =
        "organiza3d_cliente";

    // ==================================================
    // FUNÇÕES AUXILIARES
    // ==================================================

    function lerLista(chave) {

        try {

            const dados =
                JSON.parse(
                    localStorage.getItem(chave)
                );

            return Array.isArray(dados)
                ? dados
                : [];

        } catch (erro) {

            console.error(
                "Erro ao carregar:",
                chave,
                erro
            );

            return [];

        }

    }

    function salvarLista(
        chave,
        lista
    ) {

        localStorage.setItem(
            chave,
            JSON.stringify(lista)
        );

    }

    function numero(valor) {

        const resultado =
            Number(valor);

        return Number.isFinite(resultado)
            ? resultado
            : 0;

    }

    function numeroPositivo(valor) {

        return Math.max(
            0,
            numero(valor)
        );

    }

    function dinheiro(valor) {

        return numero(valor)
            .toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

    }

    function numeroFormatado(
        valor,
        casas = 0
    ) {

        return numero(valor)
            .toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits:
                        casas,

                    maximumFractionDigits:
                        casas
                }
            );

    }

    function dataFormatada(data) {

        if (!data) {
            return "Não informada";
        }

        const partes =
            String(data).split("-");

        if (partes.length !== 3) {
            return data;
        }

        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );

    }

    function dataHoje() {

        const data =
            new Date();

        const ano =
            data.getFullYear();

        const mes =
            String(
                data.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                data.getDate()
            ).padStart(2, "0");

        return (
            ano +
            "-" +
            mes +
            "-" +
            dia
        );

    }

    function criarId() {

        return (
            Date.now() +
            Math.floor(
                Math.random() * 1000
            )
        );

    }

    function textoSeguro(valor) {

        if (
            valor === null ||
            valor === undefined
        ) {
            return "";
        }

        return String(valor)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

    }

    function somar(
        lista,
        propriedade
    ) {

        return lista.reduce(
            function (total, item) {

                return (
                    total +
                    numero(
                        item[propriedade]
                    )
                );

            },
            0
        );

    }

    // ==================================================
    // LISTAS DO SISTEMA
    // ==================================================

    let produtos =
        lerLista(
            CHAVE_PRODUTOS
        );

    let orcamentos =
        lerLista(
            CHAVE_ORCAMENTOS
        );

    let perdas =
        lerLista(
            CHAVE_PERDAS
        );

    let consumosProprios =
        lerLista(
            CHAVE_CONSUMO_PROPRIO
        );

    let movimentacoes =
        lerLista(
            CHAVE_MOVIMENTACOES
        );

    let filamentos =
        lerLista(
            CHAVE_FILAMENTOS
        );

    let acessorios =
        lerLista(
            CHAVE_ACESSORIOS
        );

    let embalagens =
        lerLista(
            CHAVE_EMBALAGENS
        );

    let impressoras =
        lerLista(
            CHAVE_IMPRESSORAS
        );

    let clientes =
        lerLista(
            CHAVE_CLIENTES
        );

    // ==================================================
    // CONTROLE DE EDIÇÃO
    // ==================================================

    let produtoEmEdicaoId =
        null;

    let orcamentoEmEdicaoId =
        null;

    let perdaEmEdicaoId =
        null;

    let consumoProprioEmEdicaoId =
        null;

    let orcamentoOrigemProducaoId =
        null;

    // ==================================================
    // RECARREGAR DADOS DE APOIO
    // ==================================================

    function recarregarDadosDeApoio() {

        filamentos =
            lerLista(
                CHAVE_FILAMENTOS
            );

        acessorios =
            lerLista(
                CHAVE_ACESSORIOS
            );

        embalagens =
            lerLista(
                CHAVE_EMBALAGENS
            );

        impressoras =
            lerLista(
                CHAVE_IMPRESSORAS
            );

        clientes =
            lerLista(
                CHAVE_CLIENTES
            );

    }

    // ==================================================
    // SALVAMENTOS
    // ==================================================

    function salvarProdutos() {

        salvarLista(
            CHAVE_PRODUTOS,
            produtos
        );

    }

    function salvarOrcamentos() {

        salvarLista(
            CHAVE_ORCAMENTOS,
            orcamentos
        );

    }

    function salvarPerdas() {

        salvarLista(
            CHAVE_PERDAS,
            perdas
        );

    }

    function salvarConsumosProprios() {

        salvarLista(
            CHAVE_CONSUMO_PROPRIO,
            consumosProprios
        );

    }

    function salvarMovimentacoes() {

        salvarLista(
            CHAVE_MOVIMENTACOES,
            movimentacoes
        );

    }

    function salvarFilamentos() {

        salvarLista(
            CHAVE_FILAMENTOS,
            filamentos
        );

    }

    function salvarAcessorios() {

        salvarLista(
            CHAVE_ACESSORIOS,
            acessorios
        );

    }

    function salvarEmbalagens() {

        salvarLista(
            CHAVE_EMBALAGENS,
            embalagens
        );

    }

    function salvarImpressoras() {

        salvarLista(
            CHAVE_IMPRESSORAS,
            impressoras
        );

    }

    // ==================================================
    // NAVEGAÇÃO DAS ABAS
    // ==================================================

    const botoesAbas =
        document.querySelectorAll(
            ".aba-produto"
        );

    const conteudosAbas =
        document.querySelectorAll(
            ".conteudo-aba-produto"
        );

    function abrirAba(idAba) {

        conteudosAbas.forEach(
            function (conteudo) {

                const ativa =
                    conteudo.id === idAba;

                conteudo.hidden =
                    !ativa;

                conteudo.classList.toggle(
                    "ativo",
                    ativa
                );

            }
        );

        botoesAbas.forEach(
            function (botao) {

                const ativo =
                    botao.dataset.abaProduto ===
                    idAba;

                botao.classList.toggle(
                    "botao-principal",
                    ativo
                );

            }
        );

    }

    botoesAbas.forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    abrirAba(
                        botao.dataset.abaProduto
                    );

                }
            );

        }
    );
    // ======================================================
// ORGANIZA 3D MANAGER
// MÓDULO PRODUTOS
// produto.js
// ======================================================

"use strict";

function iniciarProduto() {

    // ==================================================
    // CHAVES DO LOCALSTORAGE
    // ==================================================

    const CHAVE_PRODUTOS =
        "organiza3d_produtos_produzidos";

    const CHAVE_ORCAMENTOS =
        "organiza3d_orcamentos";

    const CHAVE_PERDAS =
        "organiza3d_perdas_produtos";

    const CHAVE_CONSUMO_PROPRIO =
        "organiza3d_consumo_proprio";

    const CHAVE_MOVIMENTACOES =
        "organiza3d_movimentacoes_produtos";

    const CHAVE_FILAMENTOS =
        "organiza3d_filamentos";

    const CHAVE_ACESSORIOS =
        "organiza3d_acessorios";

    const CHAVE_EMBALAGENS =
        "organiza3d_embalagens";

    const CHAVE_IMPRESSORAS =
        "organiza3d_impressoras";

    const CHAVE_CLIENTES =
        "organiza3d_cliente";

    // ==================================================
    // FUNÇÕES AUXILIARES
    // ==================================================

    function lerLista(chave) {

        try {

            const dados =
                JSON.parse(
                    localStorage.getItem(chave)
                );

            return Array.isArray(dados)
                ? dados
                : [];

        } catch (erro) {

            console.error(
                "Erro ao carregar:",
                chave,
                erro
            );

            return [];

        }

    }

    function salvarLista(
        chave,
        lista
    ) {

        localStorage.setItem(
            chave,
            JSON.stringify(lista)
        );

    }

    function numero(valor) {

        const resultado =
            Number(valor);

        return Number.isFinite(resultado)
            ? resultado
            : 0;

    }

    function numeroPositivo(valor) {

        return Math.max(
            0,
            numero(valor)
        );

    }

    function dinheiro(valor) {

        return numero(valor)
            .toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

    }

    function numeroFormatado(
        valor,
        casas = 0
    ) {

        return numero(valor)
            .toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits:
                        casas,

                    maximumFractionDigits:
                        casas
                }
            );

    }

    function dataFormatada(data) {

        if (!data) {
            return "Não informada";
        }

        const partes =
            String(data).split("-");

        if (partes.length !== 3) {
            return data;
        }

        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );

    }

    function dataHoje() {

        const data =
            new Date();

        const ano =
            data.getFullYear();

        const mes =
            String(
                data.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                data.getDate()
            ).padStart(2, "0");

        return (
            ano +
            "-" +
            mes +
            "-" +
            dia
        );

    }

    function criarId() {

        return (
            Date.now() +
            Math.floor(
                Math.random() * 1000
            )
        );

    }

    function textoSeguro(valor) {

        if (
            valor === null ||
            valor === undefined
        ) {
            return "";
        }

        return String(valor)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

    }

    function somar(
        lista,
        propriedade
    ) {

        return lista.reduce(
            function (total, item) {

                return (
                    total +
                    numero(
                        item[propriedade]
                    )
                );

            },
            0
        );

    }

    // ==================================================
    // LISTAS DO SISTEMA
    // ==================================================

    let produtos =
        lerLista(
            CHAVE_PRODUTOS
        );

    let orcamentos =
        lerLista(
            CHAVE_ORCAMENTOS
        );

    let perdas =
        lerLista(
            CHAVE_PERDAS
        );

    let consumosProprios =
        lerLista(
            CHAVE_CONSUMO_PROPRIO
        );

    let movimentacoes =
        lerLista(
            CHAVE_MOVIMENTACOES
        );

    let filamentos =
        lerLista(
            CHAVE_FILAMENTOS
        );

    let acessorios =
        lerLista(
            CHAVE_ACESSORIOS
        );

    let embalagens =
        lerLista(
            CHAVE_EMBALAGENS
        );

    let impressoras =
        lerLista(
            CHAVE_IMPRESSORAS
        );

    let clientes =
        lerLista(
            CHAVE_CLIENTES
        );

    // ==================================================
    // CONTROLE DE EDIÇÃO
    // ==================================================

    let produtoEmEdicaoId =
        null;

    let orcamentoEmEdicaoId =
        null;

    let perdaEmEdicaoId =
        null;

    let consumoProprioEmEdicaoId =
        null;

    let orcamentoOrigemProducaoId =
        null;

    // ==================================================
    // RECARREGAR DADOS DE APOIO
    // ==================================================

    function recarregarDadosDeApoio() {

        filamentos =
            lerLista(
                CHAVE_FILAMENTOS
            );

        acessorios =
            lerLista(
                CHAVE_ACESSORIOS
            );

        embalagens =
            lerLista(
                CHAVE_EMBALAGENS
            );

        impressoras =
            lerLista(
                CHAVE_IMPRESSORAS
            );

        clientes =
            lerLista(
                CHAVE_CLIENTES
            );

    }

    // ==================================================
    // SALVAMENTOS
    // ==================================================

    function salvarProdutos() {

        salvarLista(
            CHAVE_PRODUTOS,
            produtos
        );

    }

    function salvarOrcamentos() {

        salvarLista(
            CHAVE_ORCAMENTOS,
            orcamentos
        );

    }

    function salvarPerdas() {

        salvarLista(
            CHAVE_PERDAS,
            perdas
        );

    }

    function salvarConsumosProprios() {

        salvarLista(
            CHAVE_CONSUMO_PROPRIO,
            consumosProprios
        );

    }

    function salvarMovimentacoes() {

        salvarLista(
            CHAVE_MOVIMENTACOES,
            movimentacoes
        );

    }

    function salvarFilamentos() {

        salvarLista(
            CHAVE_FILAMENTOS,
            filamentos
        );

    }

    function salvarAcessorios() {

        salvarLista(
            CHAVE_ACESSORIOS,
            acessorios
        );

    }

    function salvarEmbalagens() {

        salvarLista(
            CHAVE_EMBALAGENS,
            embalagens
        );

    }

    function salvarImpressoras() {

        salvarLista(
            CHAVE_IMPRESSORAS,
            impressoras
        );

    }

    // ==================================================
    // NAVEGAÇÃO DAS ABAS
    // ==================================================

    const botoesAbas =
        document.querySelectorAll(
            ".aba-produto"
        );

    const conteudosAbas =
        document.querySelectorAll(
            ".conteudo-aba-produto"
        );

    function abrirAba(idAba) {

        conteudosAbas.forEach(
            function (conteudo) {

                const ativa =
                    conteudo.id === idAba;

                conteudo.hidden =
                    !ativa;

                conteudo.classList.toggle(
                    "ativo",
                    ativa
                );

            }
        );

        botoesAbas.forEach(
            function (botao) {

                const ativo =
                    botao.dataset.abaProduto ===
                    idAba;

                botao.classList.toggle(
                    "botao-principal",
                    ativo
                );

            }
        );

    }

    botoesAbas.forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    abrirAba(
                        botao.dataset.abaProduto
                    );

                }
            );

        }
    );
        // ==================================================
    // LINHA DE FILAMENTO — PRODUÇÃO
    // ==================================================

    function criarLinhaFilamentoProduto(
        dados = {}
    ) {

        const linha =
            document.createElement("div");

        linha.className =
            "linha item-filamento-produto";

        linha.innerHTML = `
            <div class="campo">

                <label>
                    Filamento / lote
                </label>

                <select
                    class="produto-filamento-select">

                    <option value="">
                        Selecione o filamento
                    </option>

                </select>

            </div>

            <div class="campo">

                <label>
                    Quantidade utilizada (g)
                </label>

                <input
                    type="number"
                    class="produto-filamento-quantidade"
                    min="0.01"
                    step="0.01"
                    placeholder="Ex.: 80">

            </div>

            <div class="campo">

                <label>
                    Custo desta linha
                </label>

                <input
                    type="text"
                    class="produto-filamento-custo"
                    value="R$ 0,00"
                    readonly>

            </div>

            <div class="campo">

                <label>
                    Ação
                </label>

                <button
                    type="button"
                    class="botao-excluir remover-filamento-produto">
                    Remover
                </button>

            </div>
        `;

        const select =
            linha.querySelector(
                ".produto-filamento-select"
            );

        const campoQuantidade =
            linha.querySelector(
                ".produto-filamento-quantidade"
            );

        const botaoRemover =
            linha.querySelector(
                ".remover-filamento-produto"
            );

        preencherSelectFilamentos(
            select,
            dados.filamentoId || ""
        );

        campoQuantidade.value =
            dados.quantidade || "";

        select.addEventListener(
            "change",
            atualizarCalculosProduto
        );

        campoQuantidade.addEventListener(
            "input",
            atualizarCalculosProduto
        );

        botaoRemover.addEventListener(
            "click",
            function () {

                linha.remove();

                garantirLinhaFilamentoProduto();

                atualizarCalculosProduto();

            }
        );

        return linha;

    }

    function adicionarLinhaFilamentoProduto(
        dados = {}
    ) {

        if (!listaFilamentosProduto) {
            return;
        }

        listaFilamentosProduto.appendChild(
            criarLinhaFilamentoProduto(
                dados
            )
        );

    }

    function garantirLinhaFilamentoProduto() {

        if (!listaFilamentosProduto) {
            return;
        }

        const quantidadeLinhas =
            listaFilamentosProduto
                .querySelectorAll(
                    ".item-filamento-produto"
                )
                .length;

        if (quantidadeLinhas === 0) {

            adicionarLinhaFilamentoProduto();

        }

    }

    function limparLinhasFilamentosProduto(
        lista = []
    ) {

        if (!listaFilamentosProduto) {
            return;
        }

        listaFilamentosProduto.innerHTML =
            "";

        if (
            Array.isArray(lista) &&
            lista.length > 0
        ) {

            lista.forEach(
                function (item) {

                    adicionarLinhaFilamentoProduto(
                        item
                    );

                }
            );

        } else {

            adicionarLinhaFilamentoProduto();

        }

    }

    function obterFilamentosProduto() {

        if (!listaFilamentosProduto) {
            return [];
        }

        const resultado = [];

        const linhas =
            listaFilamentosProduto
                .querySelectorAll(
                    ".item-filamento-produto"
                );

        linhas.forEach(
            function (linha) {

                const select =
                    linha.querySelector(
                        ".produto-filamento-select"
                    );

                const campoQuantidade =
                    linha.querySelector(
                        ".produto-filamento-quantidade"
                    );

                const campoCusto =
                    linha.querySelector(
                        ".produto-filamento-custo"
                    );

                const filamentoId =
                    select
                        ? select.value
                        : "";

                const quantidade =
                    campoQuantidade
                        ? numeroPositivo(
                            campoQuantidade.value
                        )
                        : 0;

                const filamento =
                    encontrarFilamento(
                        filamentoId
                    );

                const valorPorGrama =
                    custoPorGrama(
                        filamento
                    );

                const custoTotal =
                    quantidade *
                    valorPorGrama;

                if (campoCusto) {

                    campoCusto.value =
                        dinheiro(
                            custoTotal
                        );

                }

                if (
                    filamento &&
                    quantidade > 0
                ) {

                    resultado.push({

                        filamentoId:
                            filamento.id,

                        fabricante:
                            filamento.fabricante ||
                            "",

                        material:
                            filamento.material ||
                            filamento.tipo ||
                            "",

                        cor:
                            filamento.cor ||
                            "",

                        lote:
                            filamento.lote ||
                            "",

                        quantidade:
                            quantidade,

                        custoPorGrama:
                            valorPorGrama,

                        custoTotal:
                            custoTotal

                    });

                }

            }
        );

        return resultado;

    }

    // ==================================================
    // LINHA DE FILAMENTO — ORÇAMENTO
    // ==================================================

    function criarLinhaFilamentoOrcamento(
        dados = {}
    ) {

        const linha =
            document.createElement("div");

        linha.className =
            "linha item-filamento-orcamento";

        linha.innerHTML = `
            <div class="campo">

                <label>
                    Filamento / lote
                </label>

                <select
                    class="orcamento-filamento-select">

                    <option value="">
                        Selecione o filamento
                    </option>

                </select>

            </div>

            <div class="campo">

                <label>
                    Quantidade estimada (g)
                </label>

                <input
                    type="number"
                    class="orcamento-filamento-quantidade"
                    min="0.01"
                    step="0.01"
                    placeholder="Ex.: 80">

            </div>

            <div class="campo">

                <label>
                    Custo estimado
                </label>

                <input
                    type="text"
                    class="orcamento-filamento-custo"
                    value="R$ 0,00"
                    readonly>

            </div>

            <div class="campo">

                <label>
                    Ação
                </label>

                <button
                    type="button"
                    class="botao-excluir remover-filamento-orcamento">
                    Remover
                </button>

            </div>
        `;

        const select =
            linha.querySelector(
                ".orcamento-filamento-select"
            );

        const campoQuantidade =
            linha.querySelector(
                ".orcamento-filamento-quantidade"
            );

        const botaoRemover =
            linha.querySelector(
                ".remover-filamento-orcamento"
            );

        preencherSelectFilamentos(
            select,
            dados.filamentoId || ""
        );

        campoQuantidade.value =
            dados.quantidade || "";

        select.addEventListener(
            "change",
            atualizarCalculosOrcamento
        );

        campoQuantidade.addEventListener(
            "input",
            atualizarCalculosOrcamento
        );

        botaoRemover.addEventListener(
            "click",
            function () {

                linha.remove();

                garantirLinhaFilamentoOrcamento();

                atualizarCalculosOrcamento();

            }
        );

        return linha;

    }

    function adicionarLinhaFilamentoOrcamento(
        dados = {}
    ) {

        if (!listaFilamentosOrcamento) {
            return;
        }

        listaFilamentosOrcamento.appendChild(
            criarLinhaFilamentoOrcamento(
                dados
            )
        );

    }

    function garantirLinhaFilamentoOrcamento() {

        if (!listaFilamentosOrcamento) {
            return;
        }

        const quantidadeLinhas =
            listaFilamentosOrcamento
                .querySelectorAll(
                    ".item-filamento-orcamento"
                )
                .length;

        if (quantidadeLinhas === 0) {

            adicionarLinhaFilamentoOrcamento();

        }

    }

    function limparLinhasFilamentosOrcamento(
        lista = []
    ) {

        if (!listaFilamentosOrcamento) {
            return;
        }

        listaFilamentosOrcamento.innerHTML =
            "";

        if (
            Array.isArray(lista) &&
            lista.length > 0
        ) {

            lista.forEach(
                function (item) {

                    adicionarLinhaFilamentoOrcamento(
                        item
                    );

                }
            );

        } else {

            adicionarLinhaFilamentoOrcamento();

        }

    }

    function obterFilamentosOrcamento() {

        if (!listaFilamentosOrcamento) {
            return [];
        }

        const resultado = [];

        const linhas =
            listaFilamentosOrcamento
                .querySelectorAll(
                    ".item-filamento-orcamento"
                );

        linhas.forEach(
            function (linha) {

                const select =
                    linha.querySelector(
                        ".orcamento-filamento-select"
                    );

                const campoQuantidade =
                    linha.querySelector(
                        ".orcamento-filamento-quantidade"
                    );

                const campoCusto =
                    linha.querySelector(
                        ".orcamento-filamento-custo"
                    );

                const filamentoId =
                    select
                        ? select.value
                        : "";

                const quantidade =
                    campoQuantidade
                        ? numeroPositivo(
                            campoQuantidade.value
                        )
                        : 0;

                const filamento =
                    encontrarFilamento(
                        filamentoId
                    );

                const valorPorGrama =
                    custoPorGrama(
                        filamento
                    );

                const custoTotal =
                    quantidade *
                    valorPorGrama;

                if (campoCusto) {

                    campoCusto.value =
                        dinheiro(
                            custoTotal
                        );

                }

                if (
                    filamento &&
                    quantidade > 0
                ) {

                    resultado.push({

                        filamentoId:
                            filamento.id,

                        fabricante:
                            filamento.fabricante ||
                            "",

                        material:
                            filamento.material ||
                            filamento.tipo ||
                            "",

                        cor:
                            filamento.cor ||
                            "",

                        lote:
                            filamento.lote ||
                            "",

                        quantidade:
                            quantidade,

                        custoPorGrama:
                            valorPorGrama,

                        custoTotal:
                            custoTotal

                    });

                }

            }
        );

        return resultado;

    }

    // ==================================================
    // EVENTOS DOS BOTÕES DE FILAMENTO
    // ==================================================

    if (botaoAdicionarFilamentoProduto) {

        botaoAdicionarFilamentoProduto
            .addEventListener(
                "click",
                function () {

                    adicionarLinhaFilamentoProduto();

                    atualizarCalculosProduto();

                }
            );

    }

    if (botaoAdicionarFilamentoOrcamento) {

        botaoAdicionarFilamentoOrcamento
            .addEventListener(
                "click",
                function () {

                    adicionarLinhaFilamentoOrcamento();

                    atualizarCalculosOrcamento();

                }
            );

    }
        // ==================================================
    // LINHAS DINÂMICAS - ACESSÓRIOS
    // ==================================================

    function criarLinhaAcessorio(
        classe,
        atualizar,
        dados = {}
    ) {

        const linha =
            document.createElement("div");

        linha.className =
            "linha " + classe;

        linha.innerHTML = `

            <div class="campo">

                <label>Acessório</label>

                <select class="select-acessorio">

                    <option value="">
                        Selecione
                    </option>

                </select>

            </div>

            <div class="campo">

                <label>Quantidade</label>

                <input
                    type="number"
                    class="quantidade-acessorio"
                    min="0.01"
                    step="0.01">

            </div>

            <div class="campo">

                <label>Custo</label>

                <input
                    type="text"
                    class="custo-acessorio"
                    readonly>

            </div>

            <div class="campo">

                <label>&nbsp;</label>

                <button
                    type="button"
                    class="botao-excluir remover-acessorio">

                    Remover

                </button>

            </div>

        `;

        const select =
            linha.querySelector(
                ".select-acessorio"
            );

        preencherSelectAcessorios(
            select,
            dados.acessorioId || ""
        );

        const quantidade =
            linha.querySelector(
                ".quantidade-acessorio"
            );

        quantidade.value =
            dados.quantidade || "";

        function recalcularLinha() {

            const acessorio =
                encontrarAcessorio(
                    select.value
                );

            const qtd =
                numeroPositivo(
                    quantidade.value
                );

            const custo =
                qtd *
                valorUnitarioAcessorio(
                    acessorio
                );

            linha.querySelector(
                ".custo-acessorio"
            ).value =
                dinheiro(custo);

            atualizar();

        }

        select.addEventListener(
            "change",
            recalcularLinha
        );

        quantidade.addEventListener(
            "input",
            recalcularLinha
        );

        linha.querySelector(
            ".remover-acessorio"
        ).addEventListener(
            "click",
            function () {

                linha.remove();

                atualizar();

            }
        );

        recalcularLinha();

        return linha;

    }

    // ==================================================
    // PRODUÇÃO
    // ==================================================

    function adicionarLinhaAcessorioProduto(
        dados = {}
    ) {

        listaAcessoriosProduto.appendChild(

            criarLinhaAcessorio(

                "item-acessorio-produto",

                atualizarCalculosProduto,

                dados

            )

        );

    }

    function obterAcessoriosProduto() {

        const resultado = [];

        listaAcessoriosProduto
            .querySelectorAll(
                ".item-acessorio-produto"
            )
            .forEach(

                function (linha) {

                    const id =
                        linha.querySelector(
                            ".select-acessorio"
                        ).value;

                    const quantidade =
                        numeroPositivo(

                            linha.querySelector(
                                ".quantidade-acessorio"
                            ).value

                        );

                    const acessorio =
                        encontrarAcessorio(id);

                    if (
                        acessorio &&
                        quantidade > 0
                    ) {

                        resultado.push({

                            acessorioId:
                                acessorio.id,

                            nome:
                                acessorio.nome,

                            quantidade:
                                quantidade,

                            valorUnitario:
                                valorUnitarioAcessorio(
                                    acessorio
                                ),

                            custoTotal:

                                quantidade *

                                valorUnitarioAcessorio(
                                    acessorio
                                )

                        });

                    }

                }

            );

        return resultado;

    }

    // ==================================================
    // ORÇAMENTO
    // ==================================================

    function adicionarLinhaAcessorioOrcamento(
        dados = {}
    ) {

        listaAcessoriosOrcamento.appendChild(

            criarLinhaAcessorio(

                "item-acessorio-orcamento",

                atualizarCalculosOrcamento,

                dados

            )

        );

    }

    function obterAcessoriosOrcamento() {

        const resultado = [];

        listaAcessoriosOrcamento
            .querySelectorAll(
                ".item-acessorio-orcamento"
            )
            .forEach(

                function (linha) {

                    const id =
                        linha.querySelector(
                            ".select-acessorio"
                        ).value;

                    const quantidade =
                        numeroPositivo(

                            linha.querySelector(
                                ".quantidade-acessorio"
                            ).value

                        );

                    const acessorio =
                        encontrarAcessorio(id);

                    if (
                        acessorio &&
                        quantidade > 0
                    ) {

                        resultado.push({

                            acessorioId:
                                acessorio.id,

                            nome:
                                acessorio.nome,

                            quantidade:
                                quantidade,

                            valorUnitario:
                                valorUnitarioAcessorio(
                                    acessorio
                                ),

                            custoTotal:

                                quantidade *

                                valorUnitarioAcessorio(
                                    acessorio
                                )

                        });

                    }

                }

            );

        return resultado;

    }

    // ==================================================
    // BOTÕES
    // ==================================================

    if (
        botaoAdicionarAcessorioProduto
    ) {

        botaoAdicionarAcessorioProduto
            .addEventListener(

                "click",

                function () {

                    adicionarLinhaAcessorioProduto();

                }

            );

    }

    if (
        botaoAdicionarAcessorioOrcamento
    ) {

        botaoAdicionarAcessorioOrcamento
            .addEventListener(

                "click",

                function () {

                    adicionarLinhaAcessorioOrcamento();

                }

            );

    }
        // ==================================================
    // LINHAS DINÂMICAS - EMBALAGENS
    // ==================================================

    function criarLinhaEmbalagem(
        classe,
        atualizar,
        dados = {}
    ) {

        const linha =
            document.createElement("div");

        linha.className =
            "linha " + classe;

        linha.innerHTML = `

            <div class="campo">

                <label>Embalagem</label>

                <select class="select-embalagem">

                    <option value="">
                        Selecione
                    </option>

                </select>

            </div>

            <div class="campo">

                <label>Quantidade</label>

                <input
                    type="number"
                    class="quantidade-embalagem"
                    min="0.01"
                    step="0.01">

            </div>

            <div class="campo">

                <label>Custo</label>

                <input
                    type="text"
                    class="custo-embalagem"
                    readonly>

            </div>

            <div class="campo">

                <label>&nbsp;</label>

                <button
                    type="button"
                    class="botao-excluir remover-embalagem">

                    Remover

                </button>

            </div>

        `;

        const select =
            linha.querySelector(
                ".select-embalagem"
            );

        preencherSelectEmbalagens(
            select,
            dados.embalagemId || ""
        );

        const quantidade =
            linha.querySelector(
                ".quantidade-embalagem"
            );

        quantidade.value =
            dados.quantidade || "";

        function recalcularLinha() {

            const embalagem =
                encontrarEmbalagem(
                    select.value
                );

            const qtd =
                numeroPositivo(
                    quantidade.value
                );

            const custo =
                qtd *
                valorUnitarioEmbalagem(
                    embalagem
                );

            linha.querySelector(
                ".custo-embalagem"
            ).value =
                dinheiro(custo);

            atualizar();

        }

        select.addEventListener(
            "change",
            recalcularLinha
        );

        quantidade.addEventListener(
            "input",
            recalcularLinha
        );

        linha.querySelector(
            ".remover-embalagem"
        ).addEventListener(
            "click",
            function () {

                linha.remove();

                atualizar();

            }
        );

        recalcularLinha();

        return linha;

    }

    // ==================================================
    // EMBALAGEM - PRODUÇÃO
    // ==================================================

    function adicionarLinhaEmbalagemProduto(
        dados = {}
    ) {

        listaEmbalagensProduto.appendChild(

            criarLinhaEmbalagem(

                "item-embalagem-produto",

                atualizarCalculosProduto,

                dados

            )

        );

    }

    function obterEmbalagensProduto() {

        const resultado = [];

        listaEmbalagensProduto
            .querySelectorAll(
                ".item-embalagem-produto"
            )
            .forEach(

                function (linha) {

                    const id =
                        linha.querySelector(
                            ".select-embalagem"
                        ).value;

                    const quantidade =
                        numeroPositivo(

                            linha.querySelector(
                                ".quantidade-embalagem"
                            ).value

                        );

                    const embalagem =
                        encontrarEmbalagem(id);

                    if (
                        embalagem &&
                        quantidade > 0
                    ) {

                        resultado.push({

                            embalagemId:
                                embalagem.id,

                            nome:
                                embalagem.nome,

                            quantidade:
                                quantidade,

                            valorUnitario:
                                valorUnitarioEmbalagem(
                                    embalagem
                                ),

                            custoTotal:

                                quantidade *

                                valorUnitarioEmbalagem(
                                    embalagem
                                )

                        });

                    }

                }

            );

        return resultado;

    }

    // ==================================================
    // EMBALAGEM - ORÇAMENTO
    // ==================================================

    function adicionarLinhaEmbalagemOrcamento(
        dados = {}
    ) {

        listaEmbalagensOrcamento.appendChild(

            criarLinhaEmbalagem(

                "item-embalagem-orcamento",

                atualizarCalculosOrcamento,

                dados

            )

        );

    }

    function obterEmbalagensOrcamento() {

        const resultado = [];

        listaEmbalagensOrcamento
            .querySelectorAll(
                ".item-embalagem-orcamento"
            )
            .forEach(

                function (linha) {

                    const id =
                        linha.querySelector(
                            ".select-embalagem"
                        ).value;

                    const quantidade =
                        numeroPositivo(

                            linha.querySelector(
                                ".quantidade-embalagem"
                            ).value

                        );

                    const embalagem =
                        encontrarEmbalagem(id);

                    if (
                        embalagem &&
                        quantidade > 0
                    ) {

                        resultado.push({

                            embalagemId:
                                embalagem.id,

                            nome:
                                embalagem.nome,

                            quantidade:
                                quantidade,

                            valorUnitario:
                                valorUnitarioEmbalagem(
                                    embalagem
                                ),

                            custoTotal:

                                quantidade *

                                valorUnitarioEmbalagem(
                                    embalagem
                                )

                        });

                    }

                }

            );

        return resultado;

    }

    // ==================================================
    // BOTÕES
    // ==================================================

    if (
        botaoAdicionarEmbalagemProduto
    ) {

        botaoAdicionarEmbalagemProduto
            .addEventListener(

                "click",

                function () {

                    adicionarLinhaEmbalagemProduto();

                }

            );

    }

    if (
        botaoAdicionarEmbalagemOrcamento
    ) {

        botaoAdicionarEmbalagemOrcamento
            .addEventListener(

                "click",

                function () {

                    adicionarLinhaEmbalagemOrcamento();

                }

            );

    }
    // ==================================================
    // PARTE 6A
    // CAMPOS E FUNÇÕES AUXILIARES DOS CÁLCULOS
    // ==================================================

    // ==================================================
    // CAMPOS — PRODUÇÃO
    // ==================================================

    const campoQuantidadeProduzida =
        document.getElementById(
            "produto-produzido-quantidade"
        );

    const campoQuantidadeDisponivel =
        document.getElementById(
            "produto-quantidade-disponivel"
        );

    const campoHorasProduto =
        document.getElementById(
            "produto-tempo-impressao-horas"
        );

    const campoMinutosProduto =
        document.getElementById(
            "produto-tempo-impressao-minutos"
        );

    const campoPotenciaProduto =
        document.getElementById(
            "produto-potencia-impressora"
        );

    const campoTarifaProduto =
        document.getElementById(
            "produto-tarifa-energia"
        );

    const campoCustoHoraProduto =
        document.getElementById(
            "produto-custo-hora-impressora"
        );

    const campoPrecoVendaProduto =
        document.getElementById(
            "produto-preco-venda"
        );

    const campoCustoFilamentosProduto =
        document.getElementById(
            "produto-custo-filamentos"
        );

    const campoPesoFilamentosProduto =
        document.getElementById(
            "produto-peso-total-filamentos"
        );

    const campoCustoAcessoriosProduto =
        document.getElementById(
            "produto-custo-acessorios"
        );

    const campoQuantidadeAcessoriosProduto =
        document.getElementById(
            "produto-quantidade-total-acessorios"
        );

    const campoCustoEmbalagensProduto =
        document.getElementById(
            "produto-custo-embalagens"
        );

    const campoQuantidadeEmbalagensProduto =
        document.getElementById(
            "produto-quantidade-total-embalagens"
        );

    const campoTempoTotalProduto =
        document.getElementById(
            "produto-tempo-total-impressao"
        );

    const campoHorasDecimaisProduto =
        document.getElementById(
            "produto-horas-decimais"
        );

    const campoConsumoEnergiaProduto =
        document.getElementById(
            "produto-consumo-energia"
        );

    const campoCustoEnergiaProduto =
        document.getElementById(
            "produto-custo-energia"
        );

    const campoCustoMaquinaProduto =
        document.getElementById(
            "produto-custo-maquina"
        );

    const campoCustoInsumosProduto =
        document.getElementById(
            "produto-custo-insumos"
        );

    const campoCustoTotalProduto =
        document.getElementById(
            "produto-custo-total-producao"
        );

    const campoCustoUnitarioProduto =
        document.getElementById(
            "produto-custo-unitario-real"
        );

    const campoLucroUnitarioProduto =
        document.getElementById(
            "produto-lucro-unitario"
        );

    const campoMargemRealProduto =
        document.getElementById(
            "produto-margem-real"
        );

    const campoValorTotalEstoqueProduto =
        document.getElementById(
            "produto-valor-total-estoque"
        );

    // ==================================================
    // CAMPOS — ORÇAMENTO
    // ==================================================

    const campoQuantidadeOrcamento =
        document.getElementById(
            "orcamento-quantidade"
        );

    const campoHorasOrcamento =
        document.getElementById(
            "orcamento-tempo-horas"
        );

    const campoMinutosOrcamento =
        document.getElementById(
            "orcamento-tempo-minutos"
        );

    const campoPotenciaOrcamento =
        document.getElementById(
            "orcamento-potencia-impressora"
        );

    const campoTarifaOrcamento =
        document.getElementById(
            "orcamento-tarifa-energia"
        );

    const campoCustoHoraOrcamento =
        document.getElementById(
            "orcamento-custo-hora-impressora"
        );

    const campoMargemDesejadaOrcamento =
        document.getElementById(
            "orcamento-margem-desejada"
        );

    const campoPrecoFinalOrcamento =
        document.getElementById(
            "orcamento-preco-final"
        );

    const campoCustoInsumosOrcamento =
        document.getElementById(
            "orcamento-custo-insumos"
        );

    const campoCustoEnergiaOrcamento =
        document.getElementById(
            "orcamento-custo-energia"
        );

    const campoCustoMaquinaOrcamento =
        document.getElementById(
            "orcamento-custo-maquina"
        );

    const campoCustoTotalOrcamento =
        document.getElementById(
            "orcamento-custo-total"
        );

    const campoCustoUnitarioOrcamento =
        document.getElementById(
            "orcamento-custo-unitario"
        );

    const campoPrecoSugeridoOrcamento =
        document.getElementById(
            "orcamento-preco-sugerido"
        );

    const campoValorTotalOrcamento =
        document.getElementById(
            "orcamento-valor-total"
        );

    const campoMargemRealOrcamento =
        document.getElementById(
            "orcamento-margem-real"
        );

    // ==================================================
    // CALCULAR TEMPO EM HORAS DECIMAIS
    // ==================================================

    function calcularTempoDecimal(
        campoHoras,
        campoMinutos
    ) {

        const horas =
            numeroPositivo(
                campoHoras
                    ? campoHoras.value
                    : 0
            );

        let minutos =
            numeroPositivo(
                campoMinutos
                    ? campoMinutos.value
                    : 0
            );

        if (minutos > 59) {
            minutos = 59;
        }

        return {

            horas:
                horas,

            minutos:
                minutos,

            horasDecimais:
                horas +
                minutos / 60

        };

    }

    // ==================================================
    // CALCULAR ENERGIA
    // ==================================================

    function calcularEnergia(
        potenciaWatts,
        horasDecimais,
        tarifa
    ) {

        const potencia =
            numeroPositivo(
                potenciaWatts
            );

        const horas =
            numeroPositivo(
                horasDecimais
            );

        const valorTarifa =
            numeroPositivo(
                tarifa
            );

        const consumoKwh =
            potencia /
            1000 *
            horas;

        const custoEnergia =
            consumoKwh *
            valorTarifa;

        return {

            potenciaWatts:
                potencia,

            tarifa:
                valorTarifa,

            consumoKwh:
                consumoKwh,

            custoEnergia:
                custoEnergia

        };

    }

    // ==================================================
    // CALCULAR CUSTO DA MÁQUINA
    // ==================================================

    function calcularCustoMaquina(
        horasDecimais,
        custoPorHora
    ) {

        const horas =
            numeroPositivo(
                horasDecimais
            );

        const custoHora =
            numeroPositivo(
                custoPorHora
            );

        return {

            custoPorHora:
                custoHora,

            custoTotal:
                horas *
                custoHora

        };

    }

    // ==================================================
    // CALCULAR MARGEM REAL
    // ==================================================

    function calcularMargemReal(
        precoVenda,
        custoUnitario
    ) {

        const preco =
            numeroPositivo(
                precoVenda
            );

        const custo =
            numeroPositivo(
                custoUnitario
            );

        if (preco <= 0) {
            return 0;
        }

        return (
            (
                preco -
                custo
            ) /
            preco
        ) * 100;

    }

    // ==================================================
    // CALCULAR PREÇO PELA MARGEM DESEJADA
    // ==================================================

    function calcularPrecoPelaMargem(
        custoUnitario,
        margemDesejada
    ) {

        const custo =
            numeroPositivo(
                custoUnitario
            );

        const margem =
            numeroPositivo(
                margemDesejada
            );

        const divisor =
            1 -
            margem / 100;

        if (divisor <= 0) {
            return custo;
        }

        return custo / divisor;

    }

    // ==================================================
    // EVITAR ITENS REPETIDOS
    // ==================================================

    function possuiIdRepetido(
        lista,
        propriedade
    ) {

        const ids =
            lista.map(
                function (item) {

                    return String(
                        item[propriedade]
                    );

                }
            );

        return (
            new Set(ids).size !==
            ids.length
        );

    }    // ==================================================
    // PARTE 6B
    // CÁLCULO COMPLETO DA PRODUÇÃO
    // ==================================================

    function atualizarCalculosProduto() {

        // ==============================================
        // INSUMOS UTILIZADOS
        // ==============================================

        const filamentosUsados =
            obterFilamentosProduto();

        const acessoriosUsados =
            obterAcessoriosProduto();

        const embalagensUsadas =
            obterEmbalagensProduto();

        // ==============================================
        // TOTAIS DOS FILAMENTOS
        // ==============================================

        const custoFilamentos =
            somar(
                filamentosUsados,
                "custoTotal"
            );

        const pesoTotalFilamentos =
            somar(
                filamentosUsados,
                "quantidade"
            );

        // ==============================================
        // TOTAIS DOS ACESSÓRIOS
        // ==============================================

        const custoAcessorios =
            somar(
                acessoriosUsados,
                "custoTotal"
            );

        const quantidadeTotalAcessorios =
            somar(
                acessoriosUsados,
                "quantidade"
            );

        // ==============================================
        // TOTAIS DAS EMBALAGENS
        // ==============================================

        const custoEmbalagens =
            somar(
                embalagensUsadas,
                "custoTotal"
            );

        const quantidadeTotalEmbalagens =
            somar(
                embalagensUsadas,
                "quantidade"
            );

        // ==============================================
        // TEMPO DE IMPRESSÃO
        // ==============================================

        const tempo =
            calcularTempoDecimal(
                campoHorasProduto,
                campoMinutosProduto
            );

        // ==============================================
        // ENERGIA
        // ==============================================

        const energia =
            calcularEnergia(

                campoPotenciaProduto
                    ? campoPotenciaProduto.value
                    : 0,

                tempo.horasDecimais,

                campoTarifaProduto
                    ? campoTarifaProduto.value
                    : 0

            );

        // ==============================================
        // CUSTO DA MÁQUINA
        // ==============================================

        const maquina =
            calcularCustoMaquina(

                tempo.horasDecimais,

                campoCustoHoraProduto
                    ? campoCustoHoraProduto.value
                    : 0

            );

        // ==============================================
        // CUSTOS DA PRODUÇÃO
        // ==============================================

        const custoInsumos =
            custoFilamentos +
            custoAcessorios +
            custoEmbalagens;

        const custoTotalProducao =
            custoInsumos +
            energia.custoEnergia +
            maquina.custoTotal;

        // ==============================================
        // QUANTIDADE PRODUZIDA
        // ==============================================

        const quantidadeProduzida =
            numeroPositivo(
                campoQuantidadeProduzida
                    ? campoQuantidadeProduzida.value
                    : 0
            );

        const custoUnitario =
            quantidadeProduzida > 0
                ? custoTotalProducao /
                    quantidadeProduzida
                : 0;

        // ==============================================
        // PREÇO, LUCRO E MARGEM
        // ==============================================

        const precoVenda =
            numeroPositivo(
                campoPrecoVendaProduto
                    ? campoPrecoVendaProduto.value
                    : 0
            );

        const lucroUnitario =
            precoVenda -
            custoUnitario;

        const margemReal =
            calcularMargemReal(
                precoVenda,
                custoUnitario
            );

        const valorTotalEstoque =
            precoVenda *
            quantidadeProduzida;

        // ==============================================
        // MOSTRAR CUSTOS DOS FILAMENTOS
        // ==============================================

        if (campoCustoFilamentosProduto) {

            campoCustoFilamentosProduto.value =
                dinheiro(
                    custoFilamentos
                );

        }

        if (campoPesoFilamentosProduto) {

            campoPesoFilamentosProduto.value =
                numeroFormatado(
                    pesoTotalFilamentos,
                    2
                ) +
                " g";

        }

        // ==============================================
        // MOSTRAR CUSTOS DOS ACESSÓRIOS
        // ==============================================

        if (campoCustoAcessoriosProduto) {

            campoCustoAcessoriosProduto.value =
                dinheiro(
                    custoAcessorios
                );

        }

        if (campoQuantidadeAcessoriosProduto) {

            campoQuantidadeAcessoriosProduto.value =
                numeroFormatado(
                    quantidadeTotalAcessorios,
                    0
                );

        }

        // ==============================================
        // MOSTRAR CUSTOS DAS EMBALAGENS
        // ==============================================

        if (campoCustoEmbalagensProduto) {

            campoCustoEmbalagensProduto.value =
                dinheiro(
                    custoEmbalagens
                );

        }

        if (campoQuantidadeEmbalagensProduto) {

            campoQuantidadeEmbalagensProduto.value =
                numeroFormatado(
                    quantidadeTotalEmbalagens,
                    0
                );

        }

        // ==============================================
        // MOSTRAR TEMPO
        // ==============================================

        if (campoTempoTotalProduto) {

            campoTempoTotalProduto.value =
                numeroFormatado(
                    tempo.horas,
                    0
                ) +
                "h " +
                numeroFormatado(
                    tempo.minutos,
                    0
                ) +
                "min";

        }

        if (campoHorasDecimaisProduto) {

            campoHorasDecimaisProduto.value =
                numeroFormatado(
                    tempo.horasDecimais,
                    2
                ) +
                " h";

        }

        // ==============================================
        // MOSTRAR ENERGIA
        // ==============================================

        if (campoConsumoEnergiaProduto) {

            campoConsumoEnergiaProduto.value =
                numeroFormatado(
                    energia.consumoKwh,
                    4
                ) +
                " kWh";

        }

        if (campoCustoEnergiaProduto) {

            campoCustoEnergiaProduto.value =
                dinheiro(
                    energia.custoEnergia
                );

        }

        // ==============================================
        // MOSTRAR CUSTO DA MÁQUINA
        // ==============================================

        if (campoCustoMaquinaProduto) {

            campoCustoMaquinaProduto.value =
                dinheiro(
                    maquina.custoTotal
                );

        }

        // ==============================================
        // MOSTRAR RESUMO FINANCEIRO
        // ==============================================

        if (campoCustoInsumosProduto) {

            campoCustoInsumosProduto.value =
                dinheiro(
                    custoInsumos
                );

        }

        if (campoCustoTotalProduto) {

            campoCustoTotalProduto.value =
                dinheiro(
                    custoTotalProducao
                );

        }

        if (campoCustoUnitarioProduto) {

            campoCustoUnitarioProduto.value =
                dinheiro(
                    custoUnitario
                );

        }

        if (campoLucroUnitarioProduto) {

            campoLucroUnitarioProduto.value =
                dinheiro(
                    lucroUnitario
                );

        }

        if (campoMargemRealProduto) {

            campoMargemRealProduto.value =
                numeroFormatado(
                    margemReal,
                    2
                ) +
                "%";

        }

        if (campoValorTotalEstoqueProduto) {

            campoValorTotalEstoqueProduto.value =
                dinheiro(
                    valorTotalEstoque
                );

        }

        // ==============================================
        // QUANTIDADE DISPONÍVEL INICIAL
        // ==============================================

        if (
            campoQuantidadeDisponivel &&
            produtoEmEdicaoId === null
        ) {

            campoQuantidadeDisponivel.value =
                quantidadeProduzida;

        }

        // ==============================================
        // RESULTADO COMPLETO
        // ==============================================

        return {

            filamentos:
                filamentosUsados,

            acessorios:
                acessoriosUsados,

            embalagens:
                embalagensUsadas,

            custoFilamentos:
                custoFilamentos,

            pesoTotalFilamentos:
                pesoTotalFilamentos,

            custoAcessorios:
                custoAcessorios,

            quantidadeTotalAcessorios:
                quantidadeTotalAcessorios,

            custoEmbalagens:
                custoEmbalagens,

            quantidadeTotalEmbalagens:
                quantidadeTotalEmbalagens,

            custoInsumos:
                custoInsumos,

            horas:
                tempo.horas,

            minutos:
                tempo.minutos,

            horasDecimais:
                tempo.horasDecimais,

            potenciaWatts:
                energia.potenciaWatts,

            tarifaEnergia:
                energia.tarifa,

            consumoKwh:
                energia.consumoKwh,

            custoEnergia:
                energia.custoEnergia,

            custoHoraImpressora:
                maquina.custoPorHora,

            custoMaquina:
                maquina.custoTotal,

            custoTotalProducao:
                custoTotalProducao,

            quantidadeProduzida:
                quantidadeProduzida,

            custoUnitario:
                custoUnitario,

            precoVenda:
                precoVenda,

            lucroUnitario:
                lucroUnitario,

            margemReal:
                margemReal,

            valorTotalEstoque:
                valorTotalEstoque

        };

    }
        // ==================================================
    // PARTE 6B
    // CÁLCULO COMPLETO DA PRODUÇÃO
    // ==================================================

    function atualizarCalculosProduto() {

        // ==============================================
        // INSUMOS UTILIZADOS
        // ==============================================

        const filamentosUsados =
            obterFilamentosProduto();

        const acessoriosUsados =
            obterAcessoriosProduto();

        const embalagensUsadas =
            obterEmbalagensProduto();

        // ==============================================
        // TOTAIS DOS FILAMENTOS
        // ==============================================

        const custoFilamentos =
            somar(
                filamentosUsados,
                "custoTotal"
            );

        const pesoTotalFilamentos =
            somar(
                filamentosUsados,
                "quantidade"
            );

        // ==============================================
        // TOTAIS DOS ACESSÓRIOS
        // ==============================================

        const custoAcessorios =
            somar(
                acessoriosUsados,
                "custoTotal"
            );

        const quantidadeTotalAcessorios =
            somar(
                acessoriosUsados,
                "quantidade"
            );

        // ==============================================
        // TOTAIS DAS EMBALAGENS
        // ==============================================

        const custoEmbalagens =
            somar(
                embalagensUsadas,
                "custoTotal"
            );

        const quantidadeTotalEmbalagens =
            somar(
                embalagensUsadas,
                "quantidade"
            );

        // ==============================================
        // TEMPO DE IMPRESSÃO
        // ==============================================

        const tempo =
            calcularTempoDecimal(
                campoHorasProduto,
                campoMinutosProduto
            );

        // ==============================================
        // ENERGIA
        // ==============================================

        const energia =
            calcularEnergia(

                campoPotenciaProduto
                    ? campoPotenciaProduto.value
                    : 0,

                tempo.horasDecimais,

                campoTarifaProduto
                    ? campoTarifaProduto.value
                    : 0

            );

        // ==============================================
        // CUSTO DA MÁQUINA
        // ==============================================

        const maquina =
            calcularCustoMaquina(

                tempo.horasDecimais,

                campoCustoHoraProduto
                    ? campoCustoHoraProduto.value
                    : 0

            );

        // ==============================================
        // CUSTOS DA PRODUÇÃO
        // ==============================================

        const custoInsumos =
            custoFilamentos +
            custoAcessorios +
            custoEmbalagens;

        const custoTotalProducao =
            custoInsumos +
            energia.custoEnergia +
            maquina.custoTotal;

        // ==============================================
        // QUANTIDADE PRODUZIDA
        // ==============================================

        const quantidadeProduzida =
            numeroPositivo(
                campoQuantidadeProduzida
                    ? campoQuantidadeProduzida.value
                    : 0
            );

        const custoUnitario =
            quantidadeProduzida > 0
                ? custoTotalProducao /
                    quantidadeProduzida
                : 0;

        // ==============================================
        // PREÇO, LUCRO E MARGEM
        // ==============================================

        const precoVenda =
            numeroPositivo(
                campoPrecoVendaProduto
                    ? campoPrecoVendaProduto.value
                    : 0
            );

        const lucroUnitario =
            precoVenda -
            custoUnitario;

        const margemReal =
            calcularMargemReal(
                precoVenda,
                custoUnitario
            );

        const valorTotalEstoque =
            precoVenda *
            quantidadeProduzida;

        // ==============================================
        // MOSTRAR CUSTOS DOS FILAMENTOS
        // ==============================================

        if (campoCustoFilamentosProduto) {

            campoCustoFilamentosProduto.value =
                dinheiro(
                    custoFilamentos
                );

        }

        if (campoPesoFilamentosProduto) {

            campoPesoFilamentosProduto.value =
                numeroFormatado(
                    pesoTotalFilamentos,
                    2
                ) +
                " g";

        }

        // ==============================================
        // MOSTRAR CUSTOS DOS ACESSÓRIOS
        // ==============================================

        if (campoCustoAcessoriosProduto) {

            campoCustoAcessoriosProduto.value =
                dinheiro(
                    custoAcessorios
                );

        }

        if (campoQuantidadeAcessoriosProduto) {

            campoQuantidadeAcessoriosProduto.value =
                numeroFormatado(
                    quantidadeTotalAcessorios,
                    0
                );

        }

        // ==============================================
        // MOSTRAR CUSTOS DAS EMBALAGENS
        // ==============================================

        if (campoCustoEmbalagensProduto) {

            campoCustoEmbalagensProduto.value =
                dinheiro(
                    custoEmbalagens
                );

        }

        if (campoQuantidadeEmbalagensProduto) {

            campoQuantidadeEmbalagensProduto.value =
                numeroFormatado(
                    quantidadeTotalEmbalagens,
                    0
                );

        }

        // ==============================================
        // MOSTRAR TEMPO
        // ==============================================

        if (campoTempoTotalProduto) {

            campoTempoTotalProduto.value =
                numeroFormatado(
                    tempo.horas,
                    0
                ) +
                "h " +
                numeroFormatado(
                    tempo.minutos,
                    0
                ) +
                "min";

        }

        if (campoHorasDecimaisProduto) {

            campoHorasDecimaisProduto.value =
                numeroFormatado(
                    tempo.horasDecimais,
                    2
                ) +
                " h";

        }

        // ==============================================
        // MOSTRAR ENERGIA
        // ==============================================

        if (campoConsumoEnergiaProduto) {

            campoConsumoEnergiaProduto.value =
                numeroFormatado(
                    energia.consumoKwh,
                    4
                ) +
                " kWh";

        }

        if (campoCustoEnergiaProduto) {

            campoCustoEnergiaProduto.value =
                dinheiro(
                    energia.custoEnergia
                );

        }

        // ==============================================
        // MOSTRAR CUSTO DA MÁQUINA
        // ==============================================

        if (campoCustoMaquinaProduto) {

            campoCustoMaquinaProduto.value =
                dinheiro(
                    maquina.custoTotal
                );

        }

        // ==============================================
        // MOSTRAR RESUMO FINANCEIRO
        // ==============================================

        if (campoCustoInsumosProduto) {

            campoCustoInsumosProduto.value =
                dinheiro(
                    custoInsumos
                );

        }

        if (campoCustoTotalProduto) {

            campoCustoTotalProduto.value =
                dinheiro(
                    custoTotalProducao
                );

        }

        if (campoCustoUnitarioProduto) {

            campoCustoUnitarioProduto.value =
                dinheiro(
                    custoUnitario
                );

        }

        if (campoLucroUnitarioProduto) {

            campoLucroUnitarioProduto.value =
                dinheiro(
                    lucroUnitario
                );

        }

        if (campoMargemRealProduto) {

            campoMargemRealProduto.value =
                numeroFormatado(
                    margemReal,
                    2
                ) +
                "%";

        }

        if (campoValorTotalEstoqueProduto) {

            campoValorTotalEstoqueProduto.value =
                dinheiro(
                    valorTotalEstoque
                );

        }

        // ==============================================
        // QUANTIDADE DISPONÍVEL INICIAL
        // ==============================================

        if (
            campoQuantidadeDisponivel &&
            produtoEmEdicaoId === null
        ) {

            campoQuantidadeDisponivel.value =
                quantidadeProduzida;

        }

        // ==============================================
        // RESULTADO COMPLETO
        // ==============================================

        return {

            filamentos:
                filamentosUsados,

            acessorios:
                acessoriosUsados,

            embalagens:
                embalagensUsadas,

            custoFilamentos:
                custoFilamentos,

            pesoTotalFilamentos:
                pesoTotalFilamentos,

            custoAcessorios:
                custoAcessorios,

            quantidadeTotalAcessorios:
                quantidadeTotalAcessorios,

            custoEmbalagens:
                custoEmbalagens,

            quantidadeTotalEmbalagens:
                quantidadeTotalEmbalagens,

            custoInsumos:
                custoInsumos,

            horas:
                tempo.horas,

            minutos:
                tempo.minutos,

            horasDecimais:
                tempo.horasDecimais,

            potenciaWatts:
                energia.potenciaWatts,

            tarifaEnergia:
                energia.tarifa,

            consumoKwh:
                energia.consumoKwh,

            custoEnergia:
                energia.custoEnergia,

            custoHoraImpressora:
                maquina.custoPorHora,

            custoMaquina:
                maquina.custoTotal,

            custoTotalProducao:
                custoTotalProducao,

            quantidadeProduzida:
                quantidadeProduzida,

            custoUnitario:
                custoUnitario,

            precoVenda:
                precoVenda,

            lucroUnitario:
                lucroUnitario,

            margemReal:
                margemReal,

            valorTotalEstoque:
                valorTotalEstoque

        };

    }
        // ==================================================
    // PARTE 6D
    // EVENTOS AUTOMÁTICOS DOS CÁLCULOS
    // ==================================================

    function ligarEventosCalculo(
        campos,
        atualizar
    ) {

        campos.forEach(
            function (campo) {

                if (!campo) {
                    return;
                }

                campo.addEventListener(
                    "input",
                    atualizar
                );

                campo.addEventListener(
                    "change",
                    atualizar
                );

            }
        );

    }

    ligarEventosCalculo(
        [
            campoQuantidadeProduzida,
            campoHorasProduto,
            campoMinutosProduto,
            campoPotenciaProduto,
            campoTarifaProduto,
            campoCustoHoraProduto,
            campoPrecoVendaProduto
        ],
        atualizarCalculosProduto
    );

    ligarEventosCalculo(
        [
            campoQuantidadeOrcamento,
            campoHorasOrcamento,
            campoMinutosOrcamento,
            campoPotenciaOrcamento,
            campoTarifaOrcamento,
            campoCustoHoraOrcamento,
            campoMargemDesejadaOrcamento,
            campoPrecoFinalOrcamento
        ],
        atualizarCalculosOrcamento
    );

    if (campoImpressoraProduto) {

        campoImpressoraProduto.addEventListener(
            "change",
            atualizarCalculosProduto
        );

    }

    if (campoImpressoraOrcamento) {

        campoImpressoraOrcamento.addEventListener(
            "change",
            atualizarCalculosOrcamento
        );

    }
    