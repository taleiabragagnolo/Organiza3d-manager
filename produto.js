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
