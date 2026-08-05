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
    // ELEMENTOS — PRODUTOS PRODUZIDOS
    // ==================================================

    const listaFilamentosProduto =
        document.getElementById(
            "lista-filamentos-produto"
        );

    const listaAcessoriosProduto =
        document.getElementById(
            "lista-acessorios-produto"
        );

    const listaEmbalagensProduto =
        document.getElementById(
            "lista-embalagens-produto"
        );

    const campoImpressoraProduto =
        document.getElementById(
            "produto-impressora-utilizada"
        );

    const botaoAdicionarFilamentoProduto =
        document.getElementById(
            "adicionar-filamento-produto"
        );

    const botaoAdicionarAcessorioProduto =
        document.getElementById(
            "adicionar-acessorio-produto"
        );

    const botaoAdicionarEmbalagemProduto =
        document.getElementById(
            "adicionar-embalagem-produto"
        );

    // ==================================================
    // ELEMENTOS — ORÇAMENTOS
    // ==================================================

    const listaFilamentosOrcamento =
        document.getElementById(
            "lista-filamentos-orcamento"
        );

    const listaAcessoriosOrcamento =
        document.getElementById(
            "lista-acessorios-orcamento"
        );

    const listaEmbalagensOrcamento =
        document.getElementById(
            "lista-embalagens-orcamento"
        );

    const campoClienteOrcamento =
        document.getElementById(
            "orcamento-cliente"
        );

    const campoImpressoraOrcamento =
        document.getElementById(
            "orcamento-impressora"
        );

    const botaoAdicionarFilamentoOrcamento =
        document.getElementById(
            "adicionar-filamento-orcamento"
        );

    const botaoAdicionarAcessorioOrcamento =
        document.getElementById(
            "adicionar-acessorio-orcamento"
        );

    const botaoAdicionarEmbalagemOrcamento =
        document.getElementById(
            "adicionar-embalagem-orcamento"
        );

    // ==================================================
    // LOCALIZAR REGISTROS
    // ==================================================

    function encontrarFilamento(id) {

        return filamentos.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );

    }

    function encontrarAcessorio(id) {

        return acessorios.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );

    }

    function encontrarEmbalagem(id) {

        return embalagens.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );

    }

    function encontrarImpressora(id) {

        return impressoras.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );

    }

    function encontrarCliente(id) {

        return clientes.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );

    }

    function encontrarProduto(id) {

        return produtos.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );

    }

    // ==================================================
    // DADOS NUMÉRICOS DOS INSUMOS
    // ==================================================

    function pesoRestanteFilamento(
        filamento
    ) {

        return numero(
            filamento?.pesoRestante ??
            filamento?.pesoAtual ??
            filamento?.pesoInicial ??
            0
        );

    }

    function pesoInicialFilamento(
        filamento
    ) {

        return numero(
            filamento?.pesoInicial ??
            filamento?.peso ??
            0
        );

    }

    function valorFilamento(
        filamento
    ) {

        return numero(
            filamento?.valor ??
            filamento?.valorPago ??
            filamento?.valorCompra ??
            0
        );

    }

    function custoPorGrama(
        filamento
    ) {

        const pesoInicial =
            pesoInicialFilamento(
                filamento
            );

        if (pesoInicial <= 0) {
            return 0;
        }

        return (
            valorFilamento(
                filamento
            ) /
            pesoInicial
        );

    }

    function quantidadeAcessorio(
        acessorio
    ) {

        return numero(
            acessorio?.quantidade ??
            acessorio?.estoque ??
            0
        );

    }

    function valorUnitarioAcessorio(
        acessorio
    ) {

        const valorUnitario =
            numero(
                acessorio?.valorUnitario
            );

        if (valorUnitario > 0) {
            return valorUnitario;
        }

        const quantidade =
            quantidadeAcessorio(
                acessorio
            );

        const valorCompra =
            numero(
                acessorio?.valorCompra ??
                acessorio?.valor ??
                0
            );

        return quantidade > 0
            ? valorCompra / quantidade
            : 0;

    }

    function quantidadeEmbalagem(
        embalagem
    ) {

        return numero(
            embalagem?.quantidade ??
            embalagem?.estoque ??
            0
        );

    }

    function valorUnitarioEmbalagem(
        embalagem
    ) {

        const valorUnitario =
            numero(
                embalagem?.valorUnitario
            );

        if (valorUnitario > 0) {
            return valorUnitario;
        }

        const quantidade =
            quantidadeEmbalagem(
                embalagem
            );

        const valorCompra =
            numero(
                embalagem?.valorCompra ??
                embalagem?.valor ??
                0
            );

        return quantidade > 0
            ? valorCompra / quantidade
            : 0;

    }

    // ==================================================
    // TEXTOS DOS SELECTS
    // ==================================================

    function textoFilamento(
        filamento
    ) {

        const fabricante =
            filamento.fabricante ||
            "Fabricante não informado";

        const material =
            filamento.material ||
            filamento.tipo ||
            "Material não informado";

        const cor =
            filamento.cor ||
            "Cor não informada";

        const lote =
            filamento.lote ||
            "Sem lote";

        return (
            fabricante +
            " — " +
            material +
            " — " +
            cor +
            " — lote " +
            lote +
            " — " +
            numeroFormatado(
                pesoRestanteFilamento(
                    filamento
                ),
                2
            ) +
            " g disponíveis"
        );

    }

    function textoAcessorio(
        acessorio
    ) {

        return (
            (
                acessorio.nome ||
                "Acessório sem nome"
            ) +
            " — " +
            numeroFormatado(
                quantidadeAcessorio(
                    acessorio
                ),
                0
            ) +
            " disponíveis"
        );

    }

    function textoEmbalagem(
        embalagem
    ) {

        return (
            (
                embalagem.nome ||
                "Embalagem sem nome"
            ) +
            " — " +
            numeroFormatado(
                quantidadeEmbalagem(
                    embalagem
                ),
                0
            ) +
            " disponíveis"
        );

    }

    function textoImpressora(
        impressora
    ) {

        const nome =
            impressora.nome ||
            impressora.apelido ||
            impressora.identificacao ||
            "Impressora sem nome";

        const marca =
            impressora.marca || "";

        const modelo =
            impressora.modelo || "";

        return [
            nome,
            marca,
            modelo
        ]
            .filter(Boolean)
            .join(" — ");

    }

    // ==================================================
    // PREENCHER SELECTS
    // ==================================================

    function preencherSelectFilamentos(
        select,
        valorSelecionado = ""
    ) {

        if (!select) {
            return;
        }

        select.innerHTML =
            '<option value="">' +
            "Selecione o filamento" +
            "</option>";

        filamentos.forEach(
            function (filamento) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    String(filamento.id);

                option.textContent =
                    textoFilamento(
                        filamento
                    );

                option.selected =
                    String(valorSelecionado) ===
                    String(filamento.id);

                select.appendChild(
                    option
                );

            }
        );

    }

    function preencherSelectAcessorios(
        select,
        valorSelecionado = ""
    ) {

        if (!select) {
            return;
        }

        select.innerHTML =
            '<option value="">' +
            "Selecione o acessório" +
            "</option>";

        acessorios.forEach(
            function (acessorio) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    String(acessorio.id);

                option.textContent =
                    textoAcessorio(
                        acessorio
                    );

                option.selected =
                    String(valorSelecionado) ===
                    String(acessorio.id);

                select.appendChild(
                    option
                );

            }
        );

    }

    function preencherSelectEmbalagens(
        select,
        valorSelecionado = ""
    ) {

        if (!select) {
            return;
        }

        select.innerHTML =
            '<option value="">' +
            "Selecione a embalagem" +
            "</option>";

        embalagens.forEach(
            function (embalagem) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    String(embalagem.id);

                option.textContent =
                    textoEmbalagem(
                        embalagem
                    );

                option.selected =
                    String(valorSelecionado) ===
                    String(embalagem.id);

                select.appendChild(
                    option
                );

            }
        );

    }

    function preencherSelectImpressoras(
        select,
        valorSelecionado = ""
    ) {

        if (!select) {
            return;
        }

        select.innerHTML =
            '<option value="">' +
            "Selecione a impressora" +
            "</option>";

        impressoras.forEach(
            function (impressora) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    String(impressora.id);

                option.textContent =
                    textoImpressora(
                        impressora
                    );

                option.selected =
                    String(valorSelecionado) ===
                    String(impressora.id);

                select.appendChild(
                    option
                );

            }
        );

    }

    function preencherSelectClientes(
        select,
        valorSelecionado = ""
    ) {

        if (!select) {
            return;
        }

        select.innerHTML =
            '<option value="">' +
            "Cliente não informado" +
            "</option>";

        clientes.forEach(
            function (cliente) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    String(cliente.id);

                option.textContent =
                    cliente.nome ||
                    "Cliente sem nome";

                option.selected =
                    String(valorSelecionado) ===
                    String(cliente.id);

                select.appendChild(
                    option
                );

            }
        );

    }

        function atualizarSelectsFixos() {

        recarregarDadosDeApoio();

        preencherSelectImpressoras(
            campoImpressoraProduto,
            campoImpressoraProduto
                ? campoImpressoraProduto.value
                : ""
        );

        preencherSelectImpressoras(
            campoImpressoraOrcamento,
            campoImpressoraOrcamento
                ? campoImpressoraOrcamento.value
                : ""
        );

        preencherSelectClientes(
            campoClienteOrcamento,
            campoClienteOrcamento
                ? campoClienteOrcamento.value
                : ""
        );

        // Atualizar filamentos da produção
        if (listaFilamentosProduto) {

            listaFilamentosProduto
                .querySelectorAll(
                    ".produto-filamento-select"
                )
                .forEach(
                    function (select) {

                        const valorAtual =
                            select.value;

                        preencherSelectFilamentos(
                            select,
                            valorAtual
                        );

                    }
                );

        }

        // Atualizar filamentos do orçamento
        if (listaFilamentosOrcamento) {

            listaFilamentosOrcamento
                .querySelectorAll(
                    ".orcamento-filamento-select"
                )
                .forEach(
                    function (select) {

                        const valorAtual =
                            select.value;

                        preencherSelectFilamentos(
                            select,
                            valorAtual
                        );

                    }
                );

        }

        // Atualizar acessórios da produção
        if (listaAcessoriosProduto) {

            listaAcessoriosProduto
                .querySelectorAll(
                    ".select-acessorio, .produto-acessorio-select"
                )
                .forEach(
                    function (select) {

                        const valorAtual =
                            select.value;

                        preencherSelectAcessorios(
                            select,
                            valorAtual
                        );

                    }
                );

        }

        // Atualizar acessórios do orçamento
        if (listaAcessoriosOrcamento) {

            listaAcessoriosOrcamento
                .querySelectorAll(
                    ".select-acessorio, .orcamento-acessorio-select"
                )
                .forEach(
                    function (select) {

                        const valorAtual =
                            select.value;

                        preencherSelectAcessorios(
                            select,
                            valorAtual
                        );

                    }
                );

        }

        // Atualizar embalagens da produção
        if (listaEmbalagensProduto) {

            listaEmbalagensProduto
                .querySelectorAll(
                    ".select-embalagem, .produto-embalagem-select"
                )
                .forEach(
                    function (select) {

                        const valorAtual =
                            select.value;

                        preencherSelectEmbalagens(
                            select,
                            valorAtual
                        );

                    }
                );

        }

        // Atualizar embalagens do orçamento
        if (listaEmbalagensOrcamento) {

            listaEmbalagensOrcamento
                .querySelectorAll(
                    ".select-embalagem, .orcamento-embalagem-select"
                )
                .forEach(
                    function (select) {

                        const valorAtual =
                            select.value;

                        preencherSelectEmbalagens(
                            select,
                            valorAtual
                        );

                    }
                );

        }

    }
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

        if (!listaAcessoriosProduto) {
            return resultado;
        }

        listaAcessoriosProduto
            .querySelectorAll(
                ".item-acessorio-produto"
            )
            .forEach(
                function (linha) {

                    const campoSelect =
                        linha.querySelector(
                            ".select-acessorio, .produto-acessorio-select"
                        );

                    const campoQuantidade =
                        linha.querySelector(
                            ".quantidade-acessorio, .produto-acessorio-quantidade"
                        );

                    if (
                        !campoSelect ||
                        !campoQuantidade
                    ) {
                        return;
                    }

                    const id =
                        campoSelect.value;

                    const quantidade =
                        numeroPositivo(
                            campoQuantidade.value
                        );

                    const acessorio =
                        encontrarAcessorio(id);

                    if (
                        acessorio &&
                        quantidade > 0
                    ) {

                        const valorUnitario =
                            valorUnitarioAcessorio(
                                acessorio
                            );

                        resultado.push({

                            acessorioId:
                                acessorio.id,

                            nome:
                                acessorio.nome || "",

                            quantidade:
                                quantidade,

                            valorUnitario:
                                valorUnitario,

                            custoTotal:
                                quantidade *
                                valorUnitario

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

        if (!listaAcessoriosOrcamento) {
            return resultado;
        }

        listaAcessoriosOrcamento
            .querySelectorAll(
                ".item-acessorio-orcamento"
            )
            .forEach(
                function (linha) {

                    const campoSelect =
                        linha.querySelector(
                            ".select-acessorio, .orcamento-acessorio-select"
                        );

                    const campoQuantidade =
                        linha.querySelector(
                            ".quantidade-acessorio, .orcamento-acessorio-quantidade"
                        );

                    if (
                        !campoSelect ||
                        !campoQuantidade
                    ) {
                        return;
                    }

                    const id =
                        campoSelect.value;

                    const quantidade =
                        numeroPositivo(
                            campoQuantidade.value
                        );

                    const acessorio =
                        encontrarAcessorio(id);

                    if (
                        acessorio &&
                        quantidade > 0
                    ) {

                        const valorUnitario =
                            valorUnitarioAcessorio(
                                acessorio
                            );

                        resultado.push({

                            acessorioId:
                                acessorio.id,

                            nome:
                                acessorio.nome || "",

                            quantidade:
                                quantidade,

                            valorUnitario:
                                valorUnitario,

                            custoTotal:
                                quantidade *
                                valorUnitario

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

        if (!listaEmbalagensProduto) {
            return resultado;
        }

        listaEmbalagensProduto
            .querySelectorAll(
                ".item-embalagem-produto"
            )
            .forEach(
                function (linha) {

                    const campoSelect =
                        linha.querySelector(
                            ".select-embalagem, .produto-embalagem-select"
                        );

                    const campoQuantidade =
                        linha.querySelector(
                            ".quantidade-embalagem, .produto-embalagem-quantidade"
                        );

                    const campoCusto =
                        linha.querySelector(
                            ".custo-embalagem, .produto-embalagem-custo"
                        );

                    if (
                        !campoSelect ||
                        !campoQuantidade
                    ) {
                        return;
                    }

                    const id =
                        campoSelect.value;

                    const quantidade =
                        numeroPositivo(
                            campoQuantidade.value
                        );

                    const embalagem =
                        encontrarEmbalagem(id);

                    const valorUnitario =
                        embalagem
                            ? valorUnitarioEmbalagem(
                                embalagem
                            )
                            : 0;

                    const custoTotal =
                        quantidade *
                        valorUnitario;

                    if (campoCusto) {

                        campoCusto.value =
                            dinheiro(
                                custoTotal
                            );

                    }

                    if (
                        embalagem &&
                        quantidade > 0
                    ) {

                        resultado.push({

                            embalagemId:
                                embalagem.id,

                            nome:
                                embalagem.nome || "",

                            quantidade:
                                quantidade,

                            valorUnitario:
                                valorUnitario,

                            custoTotal:
                                custoTotal

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

        if (!listaEmbalagensOrcamento) {
            return resultado;
        }

        listaEmbalagensOrcamento
            .querySelectorAll(
                ".item-embalagem-orcamento"
            )
            .forEach(
                function (linha) {

                    const campoSelect =
                        linha.querySelector(
                            ".select-embalagem, .orcamento-embalagem-select"
                        );

                    const campoQuantidade =
                        linha.querySelector(
                            ".quantidade-embalagem, .orcamento-embalagem-quantidade"
                        );

                    const campoCusto =
                        linha.querySelector(
                            ".custo-embalagem, .orcamento-embalagem-custo"
                        );

                    if (
                        !campoSelect ||
                        !campoQuantidade
                    ) {
                        return;
                    }

                    const id =
                        campoSelect.value;

                    const quantidade =
                        numeroPositivo(
                            campoQuantidade.value
                        );

                    const embalagem =
                        encontrarEmbalagem(id);

                    const valorUnitario =
                        embalagem
                            ? valorUnitarioEmbalagem(
                                embalagem
                            )
                            : 0;

                    const custoTotal =
                        quantidade *
                        valorUnitario;

                    if (campoCusto) {

                        campoCusto.value =
                            dinheiro(
                                custoTotal
                            );

                    }

                    if (
                        embalagem &&
                        quantidade > 0
                    ) {

                        resultado.push({

                            embalagemId:
                                embalagem.id,

                            nome:
                                embalagem.nome || "",

                            quantidade:
                                quantidade,

                            valorUnitario:
                                valorUnitario,

                            custoTotal:
                                custoTotal

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
    // ==================================================
    // CÁLCULO COMPLETO DO ORÇAMENTO
    // ==================================================

    function atualizarCalculosOrcamento() {

        const filamentosEstimados =
            obterFilamentosOrcamento();

        const acessoriosEstimados =
            obterAcessoriosOrcamento();

        const embalagensEstimadas =
            obterEmbalagensOrcamento();

        const custoFilamentos =
            somar(
                filamentosEstimados,
                "custoTotal"
            );

        const custoAcessorios =
            somar(
                acessoriosEstimados,
                "custoTotal"
            );

        const custoEmbalagens =
            somar(
                embalagensEstimadas,
                "custoTotal"
            );

        const custoInsumos =
            custoFilamentos +
            custoAcessorios +
            custoEmbalagens;

        const tempo =
            calcularTempoDecimal(
                campoHorasOrcamento,
                campoMinutosOrcamento
            );

        const energia =
            calcularEnergia(
                campoPotenciaOrcamento
                    ? campoPotenciaOrcamento.value
                    : 0,

                tempo.horasDecimais,

                campoTarifaOrcamento
                    ? campoTarifaOrcamento.value
                    : 0
            );

        const maquina =
            calcularCustoMaquina(
                tempo.horasDecimais,

                campoCustoHoraOrcamento
                    ? campoCustoHoraOrcamento.value
                    : 0
            );

        const custoTotal =
            custoInsumos +
            energia.custoEnergia +
            maquina.custoTotal;

        const quantidade =
            numeroPositivo(
                campoQuantidadeOrcamento
                    ? campoQuantidadeOrcamento.value
                    : 0
            );

        const custoUnitario =
            quantidade > 0
                ? custoTotal / quantidade
                : 0;

        const margemDesejada =
            numeroPositivo(
                campoMargemDesejadaOrcamento
                    ? campoMargemDesejadaOrcamento.value
                    : 0
            );

        const precoSugerido =
            calcularPrecoPelaMargem(
                custoUnitario,
                margemDesejada
            );

        const precoFinal =
            numeroPositivo(
                campoPrecoFinalOrcamento
                    ? campoPrecoFinalOrcamento.value
                    : 0
            );

        const valorTotal =
            precoFinal *
            quantidade;

        const margemReal =
            calcularMargemReal(
                precoFinal,
                custoUnitario
            );

        if (campoCustoInsumosOrcamento) {

            campoCustoInsumosOrcamento.value =
                dinheiro(
                    custoInsumos
                );

        }

        if (campoCustoEnergiaOrcamento) {

            campoCustoEnergiaOrcamento.value =
                dinheiro(
                    energia.custoEnergia
                );

        }

        if (campoCustoMaquinaOrcamento) {

            campoCustoMaquinaOrcamento.value =
                dinheiro(
                    maquina.custoTotal
                );

        }

        if (campoCustoTotalOrcamento) {

            campoCustoTotalOrcamento.value =
                dinheiro(
                    custoTotal
                );

        }

        if (campoCustoUnitarioOrcamento) {

            campoCustoUnitarioOrcamento.value =
                dinheiro(
                    custoUnitario
                );

        }

        if (campoPrecoSugeridoOrcamento) {

            campoPrecoSugeridoOrcamento.value =
                dinheiro(
                    precoSugerido
                );

        }

        if (campoValorTotalOrcamento) {

            campoValorTotalOrcamento.value =
                dinheiro(
                    valorTotal
                );

        }

        if (campoMargemRealOrcamento) {

            campoMargemRealOrcamento.value =
                numeroFormatado(
                    margemReal,
                    2
                ) +
                "%";

        }

        return {

            filamentos:
                filamentosEstimados,

            acessorios:
                acessoriosEstimados,

            embalagens:
                embalagensEstimadas,

            custoFilamentos:
                custoFilamentos,

            custoAcessorios:
                custoAcessorios,

            custoEmbalagens:
                custoEmbalagens,

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

            custoTotal:
                custoTotal,

            quantidade:
                quantidade,

            custoUnitario:
                custoUnitario,

            margemDesejada:
                margemDesejada,

            precoSugerido:
                precoSugerido,

            precoFinal:
                precoFinal,

            valorTotal:
                valorTotal,

            margemReal:
                margemReal

        };

    }

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
    // ==================================================
    // PARTE 7A
    // VALIDAÇÃO DOS INSUMOS DA PRODUÇÃO
    // ==================================================

    function validarItensRepetidosProducao(
        calculos
    ) {

        if (
            possuiIdRepetido(
                calculos.filamentos,
                "filamentoId"
            )
        ) {

            alert(
                "O mesmo lote de filamento foi adicionado mais de uma vez."
            );

            return false;

        }

        if (
            possuiIdRepetido(
                calculos.acessorios,
                "acessorioId"
            )
        ) {

            alert(
                "O mesmo acessório foi adicionado mais de uma vez."
            );

            return false;

        }

        if (
            possuiIdRepetido(
                calculos.embalagens,
                "embalagemId"
            )
        ) {

            alert(
                "A mesma embalagem foi adicionada mais de uma vez."
            );

            return false;

        }

        return true;

    }

    // ==================================================
    // VALIDAR FILAMENTOS
    // ==================================================

    function validarFilamentosProducao(
        filamentosUsados
    ) {

        if (
            !Array.isArray(
                filamentosUsados
            ) ||
            filamentosUsados.length === 0
        ) {

            alert(
                "Adicione pelo menos um filamento utilizado."
            );

            return false;

        }

        for (
            const consumo of
            filamentosUsados
        ) {

            const filamento =
                encontrarFilamento(
                    consumo.filamentoId
                );

            if (!filamento) {

                alert(
                    "Um dos filamentos selecionados não foi encontrado."
                );

                return false;

            }

            const quantidadeUsada =
                numeroPositivo(
                    consumo.quantidade
                );

            const quantidadeDisponivel =
                pesoRestanteFilamento(
                    filamento
                );

            if (
                quantidadeUsada <= 0
            ) {

                alert(
                    "Informe uma quantidade válida para cada filamento."
                );

                return false;

            }

            if (
                quantidadeUsada >
                quantidadeDisponivel
            ) {

                alert(
                    "Estoque insuficiente para o filamento:\n\n" +
                    textoFilamento(
                        filamento
                    ) +
                    "\n\nDisponível: " +
                    numeroFormatado(
                        quantidadeDisponivel,
                        2
                    ) +
                    " g" +
                    "\nNecessário: " +
                    numeroFormatado(
                        quantidadeUsada,
                        2
                    ) +
                    " g"
                );

                return false;

            }

        }

        return true;

    }

    // ==================================================
    // VALIDAR ACESSÓRIOS
    // ==================================================

    function validarAcessoriosProducao(
        acessoriosUsados
    ) {

        if (
            !Array.isArray(
                acessoriosUsados
            )
        ) {
            return true;
        }

        for (
            const consumo of
            acessoriosUsados
        ) {

            const acessorio =
                encontrarAcessorio(
                    consumo.acessorioId
                );

            if (!acessorio) {

                alert(
                    "Um dos acessórios selecionados não foi encontrado."
                );

                return false;

            }

            const quantidadeUsada =
                numeroPositivo(
                    consumo.quantidade
                );

            const quantidadeDisponivel =
                quantidadeAcessorio(
                    acessorio
                );

            if (
                quantidadeUsada <= 0
            ) {

                alert(
                    "Informe uma quantidade válida para cada acessório."
                );

                return false;

            }

            if (
                quantidadeUsada >
                quantidadeDisponivel
            ) {

                alert(
                    "Estoque insuficiente para o acessório:\n\n" +
                    (
                        acessorio.nome ||
                        "Acessório sem nome"
                    ) +
                    "\n\nDisponível: " +
                    numeroFormatado(
                        quantidadeDisponivel,
                        0
                    ) +
                    "\nNecessário: " +
                    numeroFormatado(
                        quantidadeUsada,
                        0
                    )
                );

                return false;

            }

        }

        return true;

    }

    // ==================================================
    // VALIDAR EMBALAGENS
    // ==================================================

    function validarEmbalagensProducao(
        embalagensUsadas
    ) {

        if (
            !Array.isArray(
                embalagensUsadas
            )
        ) {
            return true;
        }

        for (
            const consumo of
            embalagensUsadas
        ) {

            const embalagem =
                encontrarEmbalagem(
                    consumo.embalagemId
                );

            if (!embalagem) {

                alert(
                    "Uma das embalagens selecionadas não foi encontrada."
                );

                return false;

            }

            const quantidadeUsada =
                numeroPositivo(
                    consumo.quantidade
                );

            const quantidadeDisponivel =
                quantidadeEmbalagem(
                    embalagem
                );

            if (
                quantidadeUsada <= 0
            ) {

                alert(
                    "Informe uma quantidade válida para cada embalagem."
                );

                return false;

            }

            if (
                quantidadeUsada >
                quantidadeDisponivel
            ) {

                alert(
                    "Estoque insuficiente para a embalagem:\n\n" +
                    (
                        embalagem.nome ||
                        "Embalagem sem nome"
                    ) +
                    "\n\nDisponível: " +
                    numeroFormatado(
                        quantidadeDisponivel,
                        0
                    ) +
                    "\nNecessário: " +
                    numeroFormatado(
                        quantidadeUsada,
                        0
                    )
                );

                return false;

            }

        }

        return true;

    }

    // ==================================================
    // VALIDAR TODO O ESTOQUE DA PRODUÇÃO
    // ==================================================

    function validarEstoqueProducao(
        calculos
    ) {

        if (!calculos) {

            alert(
                "Não foi possível calcular os dados da produção."
            );

            return false;

        }

        if (
            !validarItensRepetidosProducao(
                calculos
            )
        ) {
            return false;
        }

        if (
            !validarFilamentosProducao(
                calculos.filamentos
            )
        ) {
            return false;
        }

        if (
            !validarAcessoriosProducao(
                calculos.acessorios
            )
        ) {
            return false;
        }

        if (
            !validarEmbalagensProducao(
                calculos.embalagens
            )
        ) {
            return false;
        }

        return true;

    }
        // ==================================================
    // PARTE 7B
    // BAIXA DOS INSUMOS DA PRODUÇÃO
    // ==================================================

    function atualizarStatusFilamento(
        filamento
    ) {

        if (!filamento) {
            return;
        }

        const pesoInicial =
            pesoInicialFilamento(
                filamento
            );

        const pesoRestante =
            Math.max(
                0,
                pesoRestanteFilamento(
                    filamento
                )
            );

        const percentual =
            pesoInicial > 0
                ? (
                    pesoRestante /
                    pesoInicial
                ) * 100
                : 0;

        filamento.pesoRestante =
            pesoRestante;

        filamento.percentualRestante =
            percentual;

        filamento.percentual =
            percentual;

        if (pesoRestante <= 0) {

            filamento.status =
                "Finalizado";

        } else if (percentual <= 20) {

            filamento.status =
                "Baixo estoque";

        } else if (
            pesoRestante <
            pesoInicial
        ) {

            filamento.status =
                "Em uso";

        } else {

            filamento.status =
                "Novo";

        }

    }

    // ==================================================
    // BAIXAR FILAMENTOS
    // ==================================================

    function baixarFilamentosProducao(
        filamentosUsados
    ) {

        filamentosUsados.forEach(
            function (consumo) {

                const filamento =
                    encontrarFilamento(
                        consumo.filamentoId
                    );

                if (!filamento) {
                    return;
                }

                const saldoAtual =
                    pesoRestanteFilamento(
                        filamento
                    );

                const quantidadeUsada =
                    numeroPositivo(
                        consumo.quantidade
                    );

                filamento.pesoRestante =
                    Math.max(
                        0,
                        saldoAtual -
                        quantidadeUsada
                    );

                atualizarStatusFilamento(
                    filamento
                );

            }
        );

        salvarFilamentos();

    }

    // ==================================================
    // BAIXAR ACESSÓRIOS
    // ==================================================

    function baixarAcessoriosProducao(
        acessoriosUsados
    ) {

        acessoriosUsados.forEach(
            function (consumo) {

                const acessorio =
                    encontrarAcessorio(
                        consumo.acessorioId
                    );

                if (!acessorio) {
                    return;
                }

                const saldoAtual =
                    quantidadeAcessorio(
                        acessorio
                    );

                const quantidadeUsada =
                    numeroPositivo(
                        consumo.quantidade
                    );

                const novoSaldo =
                    Math.max(
                        0,
                        saldoAtual -
                        quantidadeUsada
                    );

                acessorio.quantidade =
                    novoSaldo;

                if (
                    Object.prototype.hasOwnProperty.call(
                        acessorio,
                        "estoque"
                    )
                ) {

                    acessorio.estoque =
                        novoSaldo;

                }

            }
        );

        salvarAcessorios();

    }

    // ==================================================
    // BAIXAR EMBALAGENS
    // ==================================================

    function baixarEmbalagensProducao(
        embalagensUsadas
    ) {

        embalagensUsadas.forEach(
            function (consumo) {

                const embalagem =
                    encontrarEmbalagem(
                        consumo.embalagemId
                    );

                if (!embalagem) {
                    return;
                }

                const saldoAtual =
                    quantidadeEmbalagem(
                        embalagem
                    );

                const quantidadeUsada =
                    numeroPositivo(
                        consumo.quantidade
                    );

                const novoSaldo =
                    Math.max(
                        0,
                        saldoAtual -
                        quantidadeUsada
                    );

                embalagem.quantidade =
                    novoSaldo;

                if (
                    Object.prototype.hasOwnProperty.call(
                        embalagem,
                        "estoque"
                    )
                ) {

                    embalagem.estoque =
                        novoSaldo;

                }

            }
        );

        salvarEmbalagens();

    }

    // ==================================================
    // BAIXAR TODOS OS INSUMOS
    // ==================================================

    function baixarInsumosProducao(
        calculos
    ) {

        baixarFilamentosProducao(
            calculos.filamentos
        );

        baixarAcessoriosProducao(
            calculos.acessorios
        );

        baixarEmbalagensProducao(
            calculos.embalagens
        );

        recarregarDadosDeApoio();
        atualizarSelectsFixos();

    }
    // ==================================================
    // PARTE 7C
    // MOVIMENTAÇÕES DE ESTOQUE DA PRODUÇÃO
    // ==================================================

    function registrarMovimentacaoProducao(
        produto
    ) {

        if (!produto) {
            return;
        }

        movimentacoes.push({

            id:
                criarId(),

            data:
                produto.dataProducao,

            tipo:
                "Entrada por produção",

            produtoId:
                produto.id,

            produto:
                produto.nome,

            quantidade:
                produto.quantidadeProduzida,

            quantidadeAnterior:
                0,

            quantidadePosterior:
                produto.quantidadeDisponivel,

            custoUnitario:
                produto.custoUnitario,

            custoTotal:
                produto.custoTotalProducao,

            observacoes:
                "Entrada inicial do lote produzido.",

            criadoEm:
                new Date().toISOString()

        });

        salvarMovimentacoes();

    }

    function registrarMovimentacaoSaida(
        dados
    ) {

        movimentacoes.push({

            id:
                criarId(),

            data:
                dados.data,

            tipo:
                dados.tipo,

            produtoId:
                dados.produtoId,

            produto:
                dados.produto,

            lote:
                dados.lote,

            quantidade:
                numeroPositivo(
                    dados.quantidade
                ),

            quantidadeAnterior:
                numeroPositivo(
                    dados.quantidadeAnterior
                ),

            quantidadePosterior:
                numeroPositivo(
                    dados.quantidadePosterior
                ),

            custoUnitario:
                numeroPositivo(
                    dados.custoUnitario
                ),

            custoTotal:
                numeroPositivo(
                    dados.custoTotal
                ),

            observacoes:
                dados.observacoes || "",

            criadoEm:
                new Date().toISOString()

        });

        salvarMovimentacoes();

    }
    // ==================================================
    // PARTE 7D
    // CADASTRO DO LOTE PRODUZIDO
    // ==================================================

    const campoNomeProduto =
        document.getElementById(
            "produto-produzido-nome"
        );

    const campoCategoriaProduto =
        document.getElementById(
            "produto-produzido-categoria"
        );

    
    const campoDataProduto =
        document.getElementById(
            "produto-produzido-data"
        );

    const campoEstoqueMinimoProduto =
        document.getElementById(
            "produto-produzido-estoque-minimo"
        );

    const campoDescricaoProduto =
        document.getElementById(
            "produto-produzido-descricao"
        );

    const campoObservacoesProduto =
        document.getElementById(
            "produto-produzido-observacoes"
        );

    const botaoSalvarProduto =
        document.getElementById(
            "salvar-produto-produzido"
        );

    const botaoLimparProduto =
        document.getElementById(
            "limpar-formulario-produto-produzido"
        );

    // ==================================================
    // VALIDAR DADOS PRINCIPAIS
    // ==================================================

    function validarDadosProduto(
        calculos
    ) {

        const nome =
            campoNomeProduto
                ? campoNomeProduto.value.trim()
                : "";

        const categoria =
            campoCategoriaProduto
                ? campoCategoriaProduto.value
                : "";

            const data =
            campoDataProduto
                ? campoDataProduto.value
                : "";

        const impressoraId =
            campoImpressoraProduto
                ? campoImpressoraProduto.value
                : "";

        if (!nome) {

            alert(
                "Informe o nome do produto."
            );

            return false;

        }

        if (!categoria) {

            alert(
                "Selecione a categoria do produto."
            );

            return false;

        }

    

            return false;

        }

        if (!data) {

            alert(
                "Informe a data da produção."
            );

            return false;

        }

        if (
            calculos.quantidadeProduzida <= 0
        ) {

            alert(
                "Informe uma quantidade produzida válida."
            );

            return false;

        }

        if (!impressoraId) {

            alert(
                "Selecione a impressora utilizada."
            );

            return false;

        }

        if (
            calculos.horasDecimais <= 0
        ) {

            alert(
                "Informe o tempo de impressão."
            );

            return false;

        }

        return true;

    }

    // ==================================================
    // CRIAR OBJETO DO PRODUTO
    // ==================================================

    function criarObjetoProduto(
        calculos
    ) {

        const impressoraId =
            campoImpressoraProduto
                ? campoImpressoraProduto.value
                : "";

        const impressora =
            encontrarImpressora(
                impressoraId
            );

        const quantidadeDisponivelAtual =
            campoQuantidadeDisponivel
                ? numeroPositivo(
                    campoQuantidadeDisponivel.value
                )
                : calculos.quantidadeProduzida;

        return {

            id:
                produtoEmEdicaoId ||
                criarId(),

            nome:
                campoNomeProduto
                    ? campoNomeProduto.value.trim()
                    : "",

            categoria:
                campoCategoriaProduto
                    ? campoCategoriaProduto.value
                    : "",

            
            dataProducao:
                campoDataProduto
                    ? campoDataProduto.value
                    : "",

            quantidadeProduzida:
                calculos.quantidadeProduzida,

            quantidadeDisponivel:
                produtoEmEdicaoId
                    ? quantidadeDisponivelAtual
                    : calculos.quantidadeProduzida,

            estoqueMinimo:
                campoEstoqueMinimoProduto
                    ? numeroPositivo(
                        campoEstoqueMinimoProduto.value
                    )
                    : 0,

            descricao:
                campoDescricaoProduto
                    ? campoDescricaoProduto.value.trim()
                    : "",

            observacoes:
                campoObservacoesProduto
                    ? campoObservacoesProduto.value.trim()
                    : "",

            filamentos:
                calculos.filamentos,

            acessorios:
                calculos.acessorios,

            embalagens:
                calculos.embalagens,

            custoFilamentos:
                calculos.custoFilamentos,

            custoAcessorios:
                calculos.custoAcessorios,

            custoEmbalagens:
                calculos.custoEmbalagens,

            custoInsumos:
                calculos.custoInsumos,

            impressoraId:
                impressora
                    ? impressora.id
                    : impressoraId,

            impressoraNome:
                impressora
                    ? textoImpressora(
                        impressora
                    )
                    : "",

            horas:
                calculos.horas,

            minutos:
                calculos.minutos,

            horasDecimais:
                calculos.horasDecimais,

            potenciaWatts:
                calculos.potenciaWatts,

            tarifaEnergia:
                calculos.tarifaEnergia,

            consumoKwh:
                calculos.consumoKwh,

            custoEnergia:
                calculos.custoEnergia,

            custoHoraImpressora:
                calculos.custoHoraImpressora,

            custoMaquina:
                calculos.custoMaquina,

            custoTotalProducao:
                calculos.custoTotalProducao,

            custoUnitario:
                calculos.custoUnitario,

            precoVenda:
                calculos.precoVenda,

            lucroUnitario:
                calculos.lucroUnitario,

            margemReal:
                calculos.margemReal,

            valorTotalEstoque:
                calculos.valorTotalEstoque,

            orcamentoOrigemId:
                orcamentoOrigemProducaoId ||
                null,

            criadoEm:
                new Date().toISOString(),

            atualizadoEm:
                new Date().toISOString()

        };

    }

    // ==================================================
    // SALVAR PRODUÇÃO
    // ==================================================

    function salvarProdutoProduzido() {

        recarregarDadosDeApoio();

        const calculos =
            atualizarCalculosProduto();

        if (
            !validarDadosProduto(
                calculos
            )
        ) {
            return;
        }

        const editando =
            produtoEmEdicaoId !== null;

        if (!editando) {

            if (
                !validarEstoqueProducao(
                    calculos
                )
            ) {
                return;
            }

        }

        const produto =
            criarObjetoProduto(
                calculos
            );

        if (editando) {

            const indice =
                produtos.findIndex(
                    function (item) {

                        return String(item.id) ===
                            String(
                                produtoEmEdicaoId
                            );

                    }
                );

            if (indice === -1) {

                alert(
                    "Produto não encontrado."
                );

                return;

            }

            produto.criadoEm =
                produtos[indice].criadoEm ||
                produto.criadoEm;

            produtos[indice] =
                produto;

        } else {

            baixarInsumosProducao(
                calculos
            );

            produtos.push(
                produto
            );

            registrarMovimentacaoProducao(
                produto
            );

        }

        salvarProdutos();

        registrarHorasImpressoraProduto(
            produto,
            editando
        );

        marcarOrcamentoComoProduzido(
            produto,
            editando
        );

        mostrarProdutos();

        atualizarResumoProdutos();

        limparFormularioProduto();

        if (
            typeof atualizarDashboardCompleto ===
            "function"
        ) {

            atualizarDashboardCompleto();

        }

        alert(
            editando
                ? "Produção atualizada com sucesso!"
                : "Produção registrada com sucesso!"
        );

    }

    // ==================================================
    // EVENTOS DOS BOTÕES
    // ==================================================

    if (botaoSalvarProduto) {

        botaoSalvarProduto.addEventListener(
            "click",
            salvarProdutoProduzido
        );

    }

    if (botaoLimparProduto) {

        botaoLimparProduto.addEventListener(
            "click",
            limparFormularioProduto
        );

    }
        // ==================================================
    // PARTE 7E
    // ATUALIZAÇÃO DAS HORAS DA IMPRESSORA
    // ==================================================

    function obterHorasAtuaisImpressora(
        impressora
    ) {

        if (!impressora) {
            return 0;
        }

        return numeroPositivo(

            impressora.horasUso ??
            impressora.horasAcumuladas ??
            impressora.horas ??
            impressora.horasIniciais ??
            0

        );

    }

    function definirHorasImpressora(
        impressora,
        totalHoras
    ) {

        const horas =
            numeroPositivo(
                totalHoras
            );

        impressora.horasUso =
            horas;

        impressora.horasAcumuladas =
            horas;

        if (
            Object.prototype.hasOwnProperty.call(
                impressora,
                "horas"
            )
        ) {

            impressora.horas =
                horas;

        }

    }

    function adicionarHistoricoHorasImpressora(
        impressora,
        produto,
        horasAdicionadas
    ) {

        if (!impressora) {
            return;
        }

        if (
            !Array.isArray(
                impressora.historicoHoras
            )
        ) {

            impressora.historicoHoras =
                [];

        }

        impressora.historicoHoras.push({

            id:
                criarId(),

            data:
                produto.dataProducao ||
                dataHoje(),

            origem:
                "Produção",

            produtoId:
                produto.id,

            produto:
                produto.nome,

            horas:
                numeroPositivo(
                    horasAdicionadas
                ),

            criadoEm:
                new Date().toISOString()

        });

    }

    function atualizarControleManutencaoImpressora(
        impressora
    ) {

        if (!impressora) {
            return;
        }

        const horasAtuais =
            obterHorasAtuaisImpressora(
                impressora
            );

        const intervaloManutencao =
            numeroPositivo(

                impressora.intervaloManutencaoHoras ??
                impressora.intervaloManutencao ??
                impressora.horasManutencaoPreventiva ??
                0

            );

        const horasUltimaManutencao =
            numeroPositivo(

                impressora.horasUltimaManutencao ??
                impressora.ultimaManutencaoHoras ??
                0

            );

        const horasDesdeUltimaManutencao =
            Math.max(
                0,
                horasAtuais -
                horasUltimaManutencao
            );

        impressora.horasDesdeUltimaManutencao =
            horasDesdeUltimaManutencao;

        if (
            intervaloManutencao > 0
        ) {

            impressora.horasParaProximaManutencao =
                Math.max(
                    0,
                    intervaloManutencao -
                    horasDesdeUltimaManutencao
                );

            impressora.manutencaoPendente =
                horasDesdeUltimaManutencao >=
                intervaloManutencao;

        }

    }

    function atualizarDepreciacaoImpressora(
        impressora
    ) {

        if (!impressora) {
            return;
        }

        const horasAtuais =
            obterHorasAtuaisImpressora(
                impressora
            );

        const custoPorHora =
            numeroPositivo(

                impressora.custoHora ??
                impressora.custoPorHora ??
                0

            );

        impressora.depreciacaoAcumulada =
            horasAtuais *
            custoPorHora;

    }

    function registrarHorasImpressoraProduto(
        produto,
        editando
    ) {

        if (!produto) {
            return;
        }

        const impressora =
            encontrarImpressora(
                produto.impressoraId
            );

        if (!impressora) {

            console.warn(
                "A impressora utilizada não foi encontrada."
            );

            return;

        }

        const horasProduto =
            numeroPositivo(
                produto.horasDecimais
            );

        if (editando) {

            const produtoAnterior =
                produtos.find(
                    function (item) {

                        return String(item.id) ===
                            String(produto.id);

                    }
                );

            const horasAnteriores =
                produtoAnterior
                    ? numeroPositivo(
                        produtoAnterior.horasDecimais
                    )
                    : horasProduto;

            const diferencaHoras =
                horasProduto -
                horasAnteriores;

            if (diferencaHoras !== 0) {

                const horasAtuais =
                    obterHorasAtuaisImpressora(
                        impressora
                    );

                definirHorasImpressora(

                    impressora,

                    Math.max(
                        0,
                        horasAtuais +
                        diferencaHoras
                    )

                );

                adicionarHistoricoHorasImpressora(

                    impressora,

                    produto,

                    diferencaHoras

                );

            }

        } else {

            const horasAtuais =
                obterHorasAtuaisImpressora(
                    impressora
                );

            definirHorasImpressora(

                impressora,

                horasAtuais +
                horasProduto

            );

            adicionarHistoricoHorasImpressora(

                impressora,

                produto,

                horasProduto

            );

        }

        atualizarControleManutencaoImpressora(
            impressora
        );

        atualizarDepreciacaoImpressora(
            impressora
        );

        salvarImpressoras();

    }
        // ==================================================
    // PARTE 7F
    // INTEGRAÇÃO DA PRODUÇÃO COM O ORÇAMENTO
    // ==================================================

    function encontrarOrcamento(id) {

        return orcamentos.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );

    }

    function marcarOrcamentoComoProduzido(
        produto,
        editando
    ) {

        if (editando) {
            return;
        }

        if (
            !produto ||
            !produto.orcamentoOrigemId
        ) {
            return;
        }

        const orcamento =
            encontrarOrcamento(
                produto.orcamentoOrigemId
            );

        if (!orcamento) {

            console.warn(
                "O orçamento de origem da produção não foi encontrado."
            );

            return;

        }

        orcamento.status =
            "Produzido";

        orcamento.produtoProduzidoId =
            produto.id;

        orcamento.dataProducao =
            produto.dataProducao;

        orcamento.custoRealProducao =
            produto.custoTotalProducao;

        orcamento.custoUnitarioReal =
            produto.custoUnitario;

        orcamento.quantidadeProduzida =
            produto.quantidadeProduzida;

        orcamento.impressoraRealId =
            produto.impressoraId;

        orcamento.impressoraRealNome =
            produto.impressoraNome;

        orcamento.horasReais =
            produto.horasDecimais;

        orcamento.atualizadoEm =
            new Date().toISOString();

        salvarOrcamentos();

    }

    function copiarOrcamentoParaProducao(
        orcamento
    ) {

        if (!orcamento) {
            return;
        }

        produtoEmEdicaoId =
            null;

        orcamentoOrigemProducaoId =
            orcamento.id;

        if (campoNomeProduto) {

            campoNomeProduto.value =
                orcamento.produtoNome ||
                "";

        }

        if (campoCategoriaProduto) {

            campoCategoriaProduto.value =
                "";

        }

        if (campoDataProduto) {

            campoDataProduto.value =
                dataHoje();

        }

        if (campoQuantidadeProduzida) {

            campoQuantidadeProduzida.value =
                orcamento.quantidade ||
                "";

        }

        if (campoQuantidadeDisponivel) {

            campoQuantidadeDisponivel.value =
                orcamento.quantidade ||
                0;

        }

        if (campoDescricaoProduto) {

            campoDescricaoProduto.value =
                orcamento.descricao ||
                "";

        }

        if (campoObservacoesProduto) {

            campoObservacoesProduto.value =
                orcamento.observacoes ||
                "";

        }

        preencherSelectImpressoras(

            campoImpressoraProduto,

            orcamento.impressoraId ||
            ""

        );

        if (campoHorasProduto) {

            campoHorasProduto.value =
                orcamento.horas ||
                "";

        }

        if (campoMinutosProduto) {

            campoMinutosProduto.value =
                orcamento.minutos ||
                "";

        }

        if (campoPotenciaProduto) {

            campoPotenciaProduto.value =
                orcamento.potenciaWatts ||
                "";

        }

        if (campoTarifaProduto) {

            campoTarifaProduto.value =
                orcamento.tarifaEnergia ||
                "";

        }

        if (campoCustoHoraProduto) {

            campoCustoHoraProduto.value =
                orcamento.custoHoraImpressora ||
                "";

        }

        if (campoPrecoVendaProduto) {

            campoPrecoVendaProduto.value =
                orcamento.precoFinal ||
                orcamento.precoSugerido ||
                "";

        }

        limparLinhasFilamentosProduto(
            orcamento.filamentos ||
            []
        );

        if (listaAcessoriosProduto) {

            listaAcessoriosProduto.innerHTML =
                "";

            if (
                Array.isArray(
                    orcamento.acessorios
                ) &&
                orcamento.acessorios.length > 0
            ) {

                orcamento.acessorios.forEach(
                    function (item) {

                        adicionarLinhaAcessorioProduto(
                            item
                        );

                    }
                );

            } else {

                adicionarLinhaAcessorioProduto();

            }

        }

        if (listaEmbalagensProduto) {

            listaEmbalagensProduto.innerHTML =
                "";

            if (
                Array.isArray(
                    orcamento.embalagens
                ) &&
                orcamento.embalagens.length > 0
            ) {

                orcamento.embalagens.forEach(
                    function (item) {

                        adicionarLinhaEmbalagemProduto(
                            item
                        );

                    }
                );

            } else {

                adicionarLinhaEmbalagemProduto();

            }

        }

        if (botaoSalvarProduto) {

            botaoSalvarProduto.textContent =
                "Confirmar Produção";

        }

        abrirAba(
            "aba-produtos-produzidos"
        );

        atualizarCalculosProduto();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
        // ==================================================
    // PARTE 8A
    // LIMPEZA, RESUMO E LISTAGEM DOS PRODUTOS
    // ==================================================

    const listaProdutos =
        document.getElementById(
            "lista-produtos-produzidos"
        );

    const campoTotalLotes =
        document.getElementById(
            "produtos-total-lotes"
        );

    const campoTotalUnidadesDisponiveis =
        document.getElementById(
            "produtos-unidades-disponiveis"
        );

    const campoValorEstoque =
        document.getElementById(
            "produtos-valor-estoque"
        );

    const campoCustoTotalProduzido =
        document.getElementById(
            "produtos-custo-total"
        );

    // ==================================================
    // LIMPAR LINHAS DE ACESSÓRIOS
    // ==================================================

    function limparLinhasAcessoriosProduto(
        lista = []
    ) {

        if (!listaAcessoriosProduto) {
            return;
        }

        listaAcessoriosProduto.innerHTML =
            "";

        if (
            Array.isArray(lista) &&
            lista.length > 0
        ) {

            lista.forEach(
                function (item) {

                    adicionarLinhaAcessorioProduto(
                        item
                    );

                }
            );

        } else {

            adicionarLinhaAcessorioProduto();

        }

    }

    // ==================================================
    // LIMPAR LINHAS DE EMBALAGENS
    // ==================================================

    function limparLinhasEmbalagensProduto(
        lista = []
    ) {

        if (!listaEmbalagensProduto) {
            return;
        }

        listaEmbalagensProduto.innerHTML =
            "";

        if (
            Array.isArray(lista) &&
            lista.length > 0
        ) {

            lista.forEach(
                function (item) {

                    adicionarLinhaEmbalagemProduto(
                        item
                    );

                }
            );

        } else {

            adicionarLinhaEmbalagemProduto();

        }

    }

    // ==================================================
    // LIMPAR FORMULÁRIO
    // ==================================================

    function limparFormularioProduto() {

        produtoEmEdicaoId =
            null;

        orcamentoOrigemProducaoId =
            null;

        if (campoNomeProduto) {
            campoNomeProduto.value = "";
        }

        if (campoCategoriaProduto) {
            campoCategoriaProduto.value = "";
        }


        if (campoDataProduto) {

            campoDataProduto.value =
                dataHoje();

        }

        if (campoQuantidadeProduzida) {
            campoQuantidadeProduzida.value = "";
        }

        if (campoQuantidadeDisponivel) {
            campoQuantidadeDisponivel.value = "0";
        }

        if (campoEstoqueMinimoProduto) {
            campoEstoqueMinimoProduto.value = "";
        }

        if (campoDescricaoProduto) {
            campoDescricaoProduto.value = "";
        }

        if (campoObservacoesProduto) {
            campoObservacoesProduto.value = "";
        }

        if (campoImpressoraProduto) {
            campoImpressoraProduto.value = "";
        }

        if (campoHorasProduto) {
            campoHorasProduto.value = "";
        }

        if (campoMinutosProduto) {
            campoMinutosProduto.value = "";
        }

        if (campoPotenciaProduto) {
            campoPotenciaProduto.value = "";
        }

        if (campoTarifaProduto) {
            campoTarifaProduto.value = "";
        }

        if (campoCustoHoraProduto) {
            campoCustoHoraProduto.value = "";
        }

        if (campoPrecoVendaProduto) {
            campoPrecoVendaProduto.value = "";
        }

        limparLinhasFilamentosProduto();

        limparLinhasAcessoriosProduto();

        limparLinhasEmbalagensProduto();

        if (botaoSalvarProduto) {

            botaoSalvarProduto.textContent =
                "Salvar Produção";

        }

        atualizarSelectsFixos();

        atualizarCalculosProduto();

    }

    // ==================================================
    // ATUALIZAR RESUMO
    // ==================================================

    function atualizarResumoProdutos() {

        const totalLotes =
            produtos.length;

        const totalUnidades =
            produtos.reduce(
                function (total, produto) {

                    return (
                        total +
                        numeroPositivo(
                            produto.quantidadeDisponivel
                        )
                    );

                },
                0
            );

        const valorTotalEstoque =
            produtos.reduce(
                function (total, produto) {

                    return (
                        total +
                        (
                            numeroPositivo(
                                produto.quantidadeDisponivel
                            ) *
                            numeroPositivo(
                                produto.precoVenda
                            )
                        )
                    );

                },
                0
            );

        const custoTotal =
            produtos.reduce(
                function (total, produto) {

                    return (
                        total +
                        numeroPositivo(
                            produto.custoTotalProducao
                        )
                    );

                },
                0
            );

        if (campoTotalLotes) {

            campoTotalLotes.textContent =
                totalLotes;

        }

        if (campoTotalUnidadesDisponiveis) {

            campoTotalUnidadesDisponiveis.textContent =
                numeroFormatado(
                    totalUnidades,
                    0
                );

        }

        if (campoValorEstoque) {

            campoValorEstoque.textContent =
                dinheiro(
                    valorTotalEstoque
                );

        }

        if (campoCustoTotalProduzido) {

            campoCustoTotalProduzido.textContent =
                dinheiro(
                    custoTotal
                );

        }

    }

    // ==================================================
    // TEXTO DOS FILAMENTOS
    // ==================================================

    function montarTextoFilamentos(
        lista
    ) {

        if (
            !Array.isArray(lista) ||
            lista.length === 0
        ) {

            return "Nenhum filamento informado.";

        }

        return lista
            .map(
                function (item) {

                    const descricao = [

                        item.material,

                        item.cor,

                        item.lote
                            ? "Lote " + item.lote
                            : ""

                    ]
                        .filter(Boolean)
                        .join(" — ");

                    return (
                        textoSeguro(
                            descricao ||
                            "Filamento"
                        ) +
                        ": " +
                        numeroFormatado(
                            item.quantidade,
                            2
                        ) +
                        " g"
                    );

                }
            )
            .join("<br>");

    }

    // ==================================================
    // TEXTO DOS ACESSÓRIOS
    // ==================================================

    function montarTextoAcessorios(
        lista
    ) {

        if (
            !Array.isArray(lista) ||
            lista.length === 0
        ) {

            return "Nenhum acessório utilizado.";

        }

        return lista
            .map(
                function (item) {

                    return (
                        textoSeguro(
                            item.nome ||
                            "Acessório"
                        ) +
                        ": " +
                        numeroFormatado(
                            item.quantidade,
                            0
                        )
                    );

                }
            )
            .join("<br>");

    }

    // ==================================================
    // TEXTO DAS EMBALAGENS
    // ==================================================

    function montarTextoEmbalagens(
        lista
    ) {

        if (
            !Array.isArray(lista) ||
            lista.length === 0
        ) {

            return "Nenhuma embalagem utilizada.";

        }

        return lista
            .map(
                function (item) {

                    return (
                        textoSeguro(
                            item.nome ||
                            "Embalagem"
                        ) +
                        ": " +
                        numeroFormatado(
                            item.quantidade,
                            0
                        )
                    );

                }
            )
            .join("<br>");

    }

    // ==================================================
    // DEFINIR STATUS DO LOTE
    // ==================================================

    function obterStatusProduto(
        produto
    ) {

        const quantidadeDisponivel =
            numeroPositivo(
                produto.quantidadeDisponivel
            );

        const estoqueMinimo =
            numeroPositivo(
                produto.estoqueMinimo
            );

        if (quantidadeDisponivel <= 0) {

            return "Sem estoque";

        }

        if (
            estoqueMinimo > 0 &&
            quantidadeDisponivel <=
                estoqueMinimo
        ) {

            return "Estoque baixo";

        }

        return "Disponível";

    }

    // ==================================================
    // MOSTRAR PRODUTOS
    // ==================================================

    function mostrarProdutos() {

        if (!listaProdutos) {
            return;
        }

        if (
            !Array.isArray(produtos) ||
            produtos.length === 0
        ) {

            listaProdutos.innerHTML =
                "<p>Nenhum lote produzido cadastrado.</p>";

            atualizarResumoProdutos();

            return;

        }

        const produtosOrdenados =
            [...produtos].sort(
                function (a, b) {

                    const dataA =
                        String(
                            a.dataProducao ||
                            ""
                        );

                    const dataB =
                        String(
                            b.dataProducao ||
                            ""
                        );

                    if (dataA !== dataB) {

                        return dataA.localeCompare(
                            dataB
                        );

                    }

                    return (
                        numero(a.id) -
                        numero(b.id)
                    );

                }
            );

        listaProdutos.innerHTML =
            produtosOrdenados
                .map(
                    function (produto) {

                        return `
                            <div class="card-item">

                                <h4>
                                    ${textoSeguro(
                                        produto.nome ||
                                        "Produto sem nome"
                                    )}
                                </h4>

                                </p>

                                <p>
                                    <strong>Categoria:</strong>
                                    ${textoSeguro(
                                        produto.categoria ||
                                        "Não informada"
                                    )}
                                </p>

                                <p>
                                    <strong>Data da produção:</strong>
                                    ${dataFormatada(
                                        produto.dataProducao
                                    )}
                                </p>

                                <p>
                                    <strong>Quantidade produzida:</strong>
                                    ${numeroFormatado(
                                        produto.quantidadeProduzida,
                                        0
                                    )}
                                </p>

                                <p>
                                    <strong>Quantidade disponível:</strong>
                                    ${numeroFormatado(
                                        produto.quantidadeDisponivel,
                                        0
                                    )}
                                </p>

                                <p>
                                    <strong>Status:</strong>
                                    ${textoSeguro(
                                        obterStatusProduto(
                                            produto
                                        )
                                    )}
                                </p>

                                <p>
                                    <strong>Impressora:</strong>
                                    ${textoSeguro(
                                        produto.impressoraNome ||
                                        "Não informada"
                                    )}
                                </p>

                                <p>
                                    <strong>Tempo de impressão:</strong>
                                    ${numeroFormatado(
                                        produto.horas,
                                        0
                                    )}h
                                    ${numeroFormatado(
                                        produto.minutos,
                                        0
                                    )}min
                                </p>

                                <p>
                                    <strong>Filamentos:</strong><br>
                                    ${montarTextoFilamentos(
                                        produto.filamentos
                                    )}
                                </p>

                                <p>
                                    <strong>Acessórios:</strong><br>
                                    ${montarTextoAcessorios(
                                        produto.acessorios
                                    )}
                                </p>

                                <p>
                                    <strong>Embalagens:</strong><br>
                                    ${montarTextoEmbalagens(
                                        produto.embalagens
                                    )}
                                </p>

                                <p>
                                    <strong>Custo dos insumos:</strong>
                                    ${dinheiro(
                                        produto.custoInsumos
                                    )}
                                </p>

                                <p>
                                    <strong>Custo de energia:</strong>
                                    ${dinheiro(
                                        produto.custoEnergia
                                    )}
                                </p>

                                <p>
                                    <strong>Custo da máquina:</strong>
                                    ${dinheiro(
                                        produto.custoMaquina
                                    )}
                                </p>

                                <p>
                                    <strong>Custo total:</strong>
                                    ${dinheiro(
                                        produto.custoTotalProducao
                                    )}
                                </p>

                                <p>
                                    <strong>Custo unitário:</strong>
                                    ${dinheiro(
                                        produto.custoUnitario
                                    )}
                                </p>

                                <p>
                                    <strong>Preço de venda:</strong>
                                    ${dinheiro(
                                        produto.precoVenda
                                    )}
                                </p>

                                <p>
                                    <strong>Margem real:</strong>
                                    ${numeroFormatado(
                                        produto.margemReal,
                                        2
                                    )}%
                                </p>

                                <div class="acoes-card">

                                    <button
                                        type="button"
                                        class="botao-principal"
                                        data-editar-produto="${produto.id}">
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        class="botao-excluir"
                                        data-excluir-produto="${produto.id}">
                                        Excluir
                                    </button>

                                </div>

                            </div>
                        `;

                    }
                )
                .join("");

        listaProdutos
            .querySelectorAll(
                "[data-editar-produto]"
            )
            .forEach(
                function (botao) {

                    botao.addEventListener(
                        "click",
                        function () {

                            editarProduto(
                                botao.dataset
                                    .editarProduto
                            );

                        }
                    );

                }
            );

        listaProdutos
            .querySelectorAll(
                "[data-excluir-produto]"
            )
            .forEach(
                function (botao) {

                    botao.addEventListener(
                        "click",
                        function () {

                            excluirProduto(
                                botao.dataset
                                    .excluirProduto
                            );

                        }
                    );

                }
            );

        atualizarResumoProdutos();

    }
        // ==================================================
    // PARTE 8B
    // EDIÇÃO E EXCLUSÃO DOS PRODUTOS PRODUZIDOS
    // ==================================================

    function editarProduto(id) {

        const produto =
            encontrarProduto(id);

        if (!produto) {

            alert(
                "Produto não encontrado."
            );

            return;

        }

        produtoEmEdicaoId =
            produto.id;

        orcamentoOrigemProducaoId =
            produto.orcamentoOrigemId ||
            null;

        if (campoNomeProduto) {

            campoNomeProduto.value =
                produto.nome || "";

        }

        if (campoCategoriaProduto) {

            campoCategoriaProduto.value =
                produto.categoria || "";

        }

            if (campoDataProduto) {

            campoDataProduto.value =
                produto.dataProducao || "";

        }

        if (campoQuantidadeProduzida) {

            campoQuantidadeProduzida.value =
                produto.quantidadeProduzida ||
                "";

        }

        if (campoQuantidadeDisponivel) {

            campoQuantidadeDisponivel.value =
                produto.quantidadeDisponivel ??
                0;

        }

        if (campoEstoqueMinimoProduto) {

            campoEstoqueMinimoProduto.value =
                produto.estoqueMinimo ||
                "";

        }

        if (campoDescricaoProduto) {

            campoDescricaoProduto.value =
                produto.descricao || "";

        }

        if (campoObservacoesProduto) {

            campoObservacoesProduto.value =
                produto.observacoes || "";

        }

        preencherSelectImpressoras(

            campoImpressoraProduto,

            produto.impressoraId ||
            ""

        );

        if (campoHorasProduto) {

            campoHorasProduto.value =
                produto.horas || "";

        }

        if (campoMinutosProduto) {

            campoMinutosProduto.value =
                produto.minutos || "";

        }

        if (campoPotenciaProduto) {

            campoPotenciaProduto.value =
                produto.potenciaWatts ||
                "";

        }

        if (campoTarifaProduto) {

            campoTarifaProduto.value =
                produto.tarifaEnergia ||
                "";

        }

        if (campoCustoHoraProduto) {

            campoCustoHoraProduto.value =
                produto.custoHoraImpressora ||
                "";

        }

        if (campoPrecoVendaProduto) {

            campoPrecoVendaProduto.value =
                produto.precoVenda ||
                "";

        }

        limparLinhasFilamentosProduto(
            produto.filamentos || []
        );

        limparLinhasAcessoriosProduto(
            produto.acessorios || []
        );

        limparLinhasEmbalagensProduto(
            produto.embalagens || []
        );

        if (botaoSalvarProduto) {

            botaoSalvarProduto.textContent =
                "Atualizar Produção";

        }

        abrirAba(
            "aba-produtos-produzidos"
        );

        atualizarCalculosProduto();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    // ==================================================
    // VERIFICAR MOVIMENTAÇÕES DE SAÍDA
    // ==================================================

    function produtoPossuiSaidas(
        produtoId
    ) {

        return movimentacoes.some(
            function (movimentacao) {

                return (
                    String(
                        movimentacao.produtoId
                    ) ===
                    String(produtoId) &&
                    movimentacao.tipo !==
                        "Entrada por produção"
                );

            }
        );

    }

    // ==================================================
    // EXCLUIR PRODUTO
    // ==================================================

    function excluirProduto(id) {

        const produto =
            encontrarProduto(id);

        if (!produto) {

            alert(
                "Produto não encontrado."
            );

            return;

        }

        if (
            produtoPossuiSaidas(
                produto.id
            )
        ) {

            alert(
                "Este lote já possui movimentações de saída e não pode ser excluído."
            );

            return;

        }

        const confirmar =
            confirm(
                'Deseja excluir o lote "' +
                (
                   
                ) +
                '" do produto "' +
                (
                    produto.nome ||
                    "produto sem nome"
                ) +
                '"?\n\n' +
                "Os insumos consumidos e as horas da impressora não serão devolvidos automaticamente."
            );

        if (!confirmar) {
            return;
        }

        produtos =
            produtos.filter(
                function (item) {

                    return String(item.id) !==
                        String(produto.id);

                }
            );

        movimentacoes =
            movimentacoes.filter(
                function (movimentacao) {

                    return !(
                        String(
                            movimentacao.produtoId
                        ) ===
                            String(produto.id) &&
                        movimentacao.tipo ===
                            "Entrada por produção"
                    );

                }
            );

        salvarProdutos();

        salvarMovimentacoes();

        if (
            String(produtoEmEdicaoId) ===
            String(produto.id)
        ) {

            limparFormularioProduto();

        }

        mostrarProdutos();

        atualizarResumoProdutos();

        preencherSelectLotesPerda();

        preencherSelectLotesConsumoProprio();

        if (
            typeof atualizarDashboardCompleto ===
            "function"
        ) {

            atualizarDashboardCompleto();

        }

        alert(
            "Produto excluído com sucesso."
        );

    }
        // ==================================================
    // PARTE 9A
    // CADASTRO, SALVAMENTO E RESUMO DOS ORÇAMENTOS
    // ==================================================

    const campoDataOrcamento =
        document.getElementById(
            "orcamento-data"
        );

    const campoValidadeOrcamento =
        document.getElementById(
            "orcamento-validade"
        );

    const campoStatusOrcamento =
        document.getElementById(
            "orcamento-status"
        );

    const campoNomeProdutoOrcamento =
        document.getElementById(
            "orcamento-produto-nome"
        );

    const campoDescricaoOrcamento =
        document.getElementById(
            "orcamento-descricao"
        );

    const campoObservacoesOrcamento =
        document.getElementById(
            "orcamento-observacoes"
        );

    const botaoSalvarOrcamento =
        document.getElementById(
            "salvar-orcamento"
        );

    const botaoLimparOrcamento =
        document.getElementById(
            "limpar-formulario-orcamento"
        );

    const listaOrcamentos =
        document.getElementById(
            "lista-orcamentos"
        );

    const campoTotalOrcamentos =
        document.getElementById(
            "orcamentos-total"
        );

    const campoOrcamentosAguardando =
        document.getElementById(
            "orcamentos-aguardando"
        );

    const campoOrcamentosAprovados =
        document.getElementById(
            "orcamentos-aprovados"
        );

    const campoOrcamentosRecusados =
        document.getElementById(
            "orcamentos-recusados"
        );

    // ==================================================
    // STATUS ADICIONAIS DO ORÇAMENTO
    // ==================================================

    function garantirStatusOrcamento(
        valor
    ) {

        if (!campoStatusOrcamento) {
            return;
        }

        const existe =
            Array.from(
                campoStatusOrcamento.options
            ).some(
                function (option) {

                    return option.value ===
                        valor;

                }
            );

        if (existe) {
            return;
        }

        const option =
            document.createElement(
                "option"
            );

        option.value =
            valor;

        option.textContent =
            valor;

        campoStatusOrcamento.appendChild(
            option
        );

    }

    garantirStatusOrcamento(
        "Aguardando produção"
    );

    garantirStatusOrcamento(
        "Produzido"
    );

    // ==================================================
    // LINHAS DE ACESSÓRIOS DO ORÇAMENTO
    // ==================================================

    function limparLinhasAcessoriosOrcamento(
        lista = []
    ) {

        if (!listaAcessoriosOrcamento) {
            return;
        }

        listaAcessoriosOrcamento.innerHTML =
            "";

        if (
            Array.isArray(lista) &&
            lista.length > 0
        ) {

            lista.forEach(
                function (item) {

                    adicionarLinhaAcessorioOrcamento(
                        item
                    );

                }
            );

        } else {

            adicionarLinhaAcessorioOrcamento();

        }

    }

    // ==================================================
    // LINHAS DE EMBALAGENS DO ORÇAMENTO
    // ==================================================

    function limparLinhasEmbalagensOrcamento(
        lista = []
    ) {

        if (!listaEmbalagensOrcamento) {
            return;
        }

        listaEmbalagensOrcamento.innerHTML =
            "";

        if (
            Array.isArray(lista) &&
            lista.length > 0
        ) {

            lista.forEach(
                function (item) {

                    adicionarLinhaEmbalagemOrcamento(
                        item
                    );

                }
            );

        } else {

            adicionarLinhaEmbalagemOrcamento();

        }

    }

    // ==================================================
    // VALIDAR ORÇAMENTO
    // ==================================================

    function validarDadosOrcamento(
        calculos
    ) {

        const nomeProduto =
            campoNomeProdutoOrcamento
                ? campoNomeProdutoOrcamento
                    .value
                    .trim()
                : "";

        const data =
            campoDataOrcamento
                ? campoDataOrcamento.value
                : "";

        if (!nomeProduto) {

            alert(
                "Informe o nome do produto do orçamento."
            );

            return false;

        }

        if (!data) {

            alert(
                "Informe a data do orçamento."
            );

            return false;

        }

        if (
            calculos.quantidade <= 0
        ) {

            alert(
                "Informe uma quantidade válida para o orçamento."
            );

            return false;

        }

        if (
            calculos.filamentos.length ===
            0
        ) {

            alert(
                "Adicione pelo menos um filamento estimado."
            );

            return false;

        }

        if (
            possuiIdRepetido(
                calculos.filamentos,
                "filamentoId"
            )
        ) {

            alert(
                "O mesmo lote de filamento foi adicionado mais de uma vez."
            );

            return false;

        }

        if (
            possuiIdRepetido(
                calculos.acessorios,
                "acessorioId"
            )
        ) {

            alert(
                "O mesmo acessório foi adicionado mais de uma vez."
            );

            return false;

        }

        if (
            possuiIdRepetido(
                calculos.embalagens,
                "embalagemId"
            )
        ) {

            alert(
                "A mesma embalagem foi adicionada mais de uma vez."
            );

            return false;

        }

        return true;

    }

    // ==================================================
    // CRIAR OBJETO DO ORÇAMENTO
    // ==================================================

    function criarObjetoOrcamento(
        calculos
    ) {

        const clienteId =
            campoClienteOrcamento
                ? campoClienteOrcamento.value
                : "";

        const cliente =
            encontrarCliente(
                clienteId
            );

        const impressoraId =
            campoImpressoraOrcamento
                ? campoImpressoraOrcamento.value
                : "";

        const impressora =
            encontrarImpressora(
                impressoraId
            );

        return {

            id:
                orcamentoEmEdicaoId ||
                criarId(),

            clienteId:
                cliente
                    ? cliente.id
                    : "",

            clienteNome:
                cliente
                    ? cliente.nome || ""
                    : "",

            data:
                campoDataOrcamento
                    ? campoDataOrcamento.value
                    : "",

            validade:
                campoValidadeOrcamento
                    ? campoValidadeOrcamento.value
                    : "",

            status:
                campoStatusOrcamento
                    ? campoStatusOrcamento.value
                    : "Rascunho",

            produtoNome:
                campoNomeProdutoOrcamento
                    ? campoNomeProdutoOrcamento
                        .value
                        .trim()
                    : "",

            quantidade:
                calculos.quantidade,

            descricao:
                campoDescricaoOrcamento
                    ? campoDescricaoOrcamento
                        .value
                        .trim()
                    : "",

            filamentos:
                calculos.filamentos,

            acessorios:
                calculos.acessorios,

            embalagens:
                calculos.embalagens,

            impressoraId:
                impressora
                    ? impressora.id
                    : "",

            impressoraNome:
                impressora
                    ? textoImpressora(
                        impressora
                    )
                    : "",

            horas:
                calculos.horas,

            minutos:
                calculos.minutos,

            horasDecimais:
                calculos.horasDecimais,

            potenciaWatts:
                calculos.potenciaWatts,

            tarifaEnergia:
                calculos.tarifaEnergia,

            consumoKwh:
                calculos.consumoKwh,

            custoFilamentos:
                calculos.custoFilamentos,

            custoAcessorios:
                calculos.custoAcessorios,

            custoEmbalagens:
                calculos.custoEmbalagens,

            custoInsumos:
                calculos.custoInsumos,

            custoEnergia:
                calculos.custoEnergia,

            custoHoraImpressora:
                calculos.custoHoraImpressora,

            custoMaquina:
                calculos.custoMaquina,

            custoTotal:
                calculos.custoTotal,

            custoUnitario:
                calculos.custoUnitario,

            margemDesejada:
                calculos.margemDesejada,

            precoSugerido:
                calculos.precoSugerido,

            precoFinal:
                calculos.precoFinal,

            valorTotal:
                calculos.valorTotal,

            margemReal:
                calculos.margemReal,

            observacoes:
                campoObservacoesOrcamento
                    ? campoObservacoesOrcamento
                        .value
                        .trim()
                    : "",

            criadoEm:
                new Date().toISOString(),

            atualizadoEm:
                new Date().toISOString()

        };

    }

    // ==================================================
    // SALVAR ORÇAMENTO
    // ==================================================

    function salvarOrcamento() {

        recarregarDadosDeApoio();

        const calculos =
            atualizarCalculosOrcamento();

        if (
            !validarDadosOrcamento(
                calculos
            )
        ) {
            return;
        }

        const editando =
            orcamentoEmEdicaoId !==
            null;

        const orcamento =
            criarObjetoOrcamento(
                calculos
            );

        if (editando) {

            const indice =
                orcamentos.findIndex(
                    function (item) {

                        return String(item.id) ===
                            String(
                                orcamentoEmEdicaoId
                            );

                    }
                );

            if (indice === -1) {

                alert(
                    "Orçamento não encontrado."
                );

                return;

            }

            orcamento.criadoEm =
                orcamentos[indice]
                    .criadoEm ||
                orcamento.criadoEm;

            orcamentos[indice] =
                orcamento;

        } else {

            orcamentos.push(
                orcamento
            );

        }

        salvarOrcamentos();

        mostrarOrcamentos();

        atualizarResumoOrcamentos();

        limparFormularioOrcamento();

        alert(
            editando
                ? "Orçamento atualizado com sucesso!"
                : "Orçamento cadastrado com sucesso!"
        );

    }

    // ==================================================
    // LIMPAR FORMULÁRIO DO ORÇAMENTO
    // ==================================================

    function limparFormularioOrcamento() {

        orcamentoEmEdicaoId =
            null;

        if (campoClienteOrcamento) {
            campoClienteOrcamento.value = "";
        }

        if (campoDataOrcamento) {

            campoDataOrcamento.value =
                dataHoje();

        }

        if (campoValidadeOrcamento) {
            campoValidadeOrcamento.value = "";
        }

        if (campoStatusOrcamento) {
            campoStatusOrcamento.value = "Rascunho";
        }

        if (campoNomeProdutoOrcamento) {
            campoNomeProdutoOrcamento.value = "";
        }

        if (campoQuantidadeOrcamento) {
            campoQuantidadeOrcamento.value = "";
        }

        if (campoDescricaoOrcamento) {
            campoDescricaoOrcamento.value = "";
        }

        if (campoImpressoraOrcamento) {
            campoImpressoraOrcamento.value = "";
        }

        if (campoHorasOrcamento) {
            campoHorasOrcamento.value = "";
        }

        if (campoMinutosOrcamento) {
            campoMinutosOrcamento.value = "";
        }

        if (campoPotenciaOrcamento) {
            campoPotenciaOrcamento.value = "";
        }

        if (campoTarifaOrcamento) {
            campoTarifaOrcamento.value = "";
        }

        if (campoCustoHoraOrcamento) {
            campoCustoHoraOrcamento.value = "";
        }

        if (campoMargemDesejadaOrcamento) {
            campoMargemDesejadaOrcamento.value = "";
        }

        if (campoPrecoFinalOrcamento) {
            campoPrecoFinalOrcamento.value = "";
        }

        if (campoObservacoesOrcamento) {
            campoObservacoesOrcamento.value = "";
        }

        limparLinhasFilamentosOrcamento();

        limparLinhasAcessoriosOrcamento();

        limparLinhasEmbalagensOrcamento();

        if (botaoSalvarOrcamento) {

            botaoSalvarOrcamento.textContent =
                "Salvar Orçamento";

        }

        atualizarSelectsFixos();

        atualizarCalculosOrcamento();

    }

    // ==================================================
    // ATUALIZAR RESUMO DOS ORÇAMENTOS
    // ==================================================

    function atualizarResumoOrcamentos() {

        const aguardando =
            orcamentos.filter(
                function (orcamento) {

                    return [
                        "Enviado",
                        "Aguardando resposta",
                        "Aguardando produção"
                    ].includes(
                        orcamento.status
                    );

                }
            ).length;

        const aprovados =
            orcamentos.filter(
                function (orcamento) {

                    return (
                        orcamento.status ===
                            "Aprovado" ||
                        orcamento.status ===
                            "Aguardando produção" ||
                        orcamento.status ===
                            "Produzido"
                    );

                }
            ).length;

        const recusados =
            orcamentos.filter(
                function (orcamento) {

                    return orcamento.status ===
                        "Recusado";

                }
            ).length;

        if (campoTotalOrcamentos) {

            campoTotalOrcamentos.textContent =
                orcamentos.length;

        }

        if (campoOrcamentosAguardando) {

            campoOrcamentosAguardando.textContent =
                aguardando;

        }

        if (campoOrcamentosAprovados) {

            campoOrcamentosAprovados.textContent =
                aprovados;

        }

        if (campoOrcamentosRecusados) {

            campoOrcamentosRecusados.textContent =
                recusados;

        }

    }

    // ==================================================
    // EVENTOS DOS BOTÕES DO ORÇAMENTO
    // ==================================================

    if (botaoSalvarOrcamento) {

        botaoSalvarOrcamento.addEventListener(
            "click",
            salvarOrcamento
        );

    }

    if (botaoLimparOrcamento) {

        botaoLimparOrcamento.addEventListener(
            "click",
            limparFormularioOrcamento
        );

    }
        // ==================================================
    // PARTE 9B
    // LISTAGEM E AÇÕES DOS ORÇAMENTOS
    // ==================================================

    function mostrarOrcamentos() {

        if (!listaOrcamentos) {
            return;
        }

        if (
            !Array.isArray(orcamentos) ||
            orcamentos.length === 0
        ) {

            listaOrcamentos.innerHTML =
                "<p>Nenhum orçamento cadastrado.</p>";

            atualizarResumoOrcamentos();

            return;

        }

        const listaOrdenada =
            [...orcamentos].sort(
                function (a, b) {

                    return String(
                        b.data || ""
                    ).localeCompare(
                        String(
                            a.data || ""
                        )
                    );

                }
            );

        listaOrcamentos.innerHTML =
            listaOrdenada
                .map(
                    function (orcamento) {

                        const podeProduzir =
                            orcamento.status !==
                            "Produzido";

                        return `
                            <div class="card-item">

                                <h4>
                                    ${textoSeguro(
                                        orcamento.produtoNome ||
                                        "Produto não informado"
                                    )}
                                </h4>

                                <p>
                                    <strong>Cliente:</strong>
                                    ${textoSeguro(
                                        orcamento.clienteNome ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Data:</strong>
                                    ${dataFormatada(
                                        orcamento.data
                                    )}
                                </p>

                                <p>
                                    <strong>Validade:</strong>
                                    ${dataFormatada(
                                        orcamento.validade
                                    )}
                                </p>

                                <p>
                                    <strong>Status:</strong>
                                    ${textoSeguro(
                                        orcamento.status ||
                                        "Rascunho"
                                    )}
                                </p>

                                <p>
                                    <strong>Quantidade:</strong>
                                    ${numeroFormatado(
                                        orcamento.quantidade,
                                        0
                                    )}
                                </p>

                                <p>
                                    <strong>Custo unitário estimado:</strong>
                                    ${dinheiro(
                                        orcamento.custoUnitario
                                    )}
                                </p>

                                <p>
                                    <strong>Preço sugerido:</strong>
                                    ${dinheiro(
                                        orcamento.precoSugerido
                                    )}
                                </p>

                                <p>
                                    <strong>Preço final:</strong>
                                    ${dinheiro(
                                        orcamento.precoFinal
                                    )}
                                </p>

                                <p>
                                    <strong>Valor total:</strong>
                                    ${dinheiro(
                                        orcamento.valorTotal
                                    )}
                                </p>

                                <p>
                                    <strong>Margem real:</strong>
                                    ${numeroFormatado(
                                        orcamento.margemReal,
                                        2
                                    )}%
                                </p>

                                <div class="acoes-card">

                                    ${
                                        podeProduzir
                                            ? `
                                                <button
                                                    type="button"
                                                    data-aprovar-orcamento="${orcamento.id}">
                                                    Aprovar
                                                </button>

                                                <button
                                                    type="button"
                                                    class="botao-principal"
                                                    data-produzir-orcamento="${orcamento.id}">
                                                    Enviar para Produção
                                                </button>
                                            `
                                            : ""
                                    }

                                    <button
                                        type="button"
                                        data-editar-orcamento="${orcamento.id}">
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        class="botao-excluir"
                                        data-excluir-orcamento="${orcamento.id}">
                                        Excluir
                                    </button>

                                </div>

                            </div>
                        `;

                    }
                )
                .join("");

        listaOrcamentos
            .querySelectorAll(
                "[data-editar-orcamento]"
            )
            .forEach(
                function (botao) {

                    botao.addEventListener(
                        "click",
                        function () {

                            editarOrcamento(
                                botao.dataset
                                    .editarOrcamento
                            );

                        }
                    );

                }
            );

        listaOrcamentos
            .querySelectorAll(
                "[data-excluir-orcamento]"
            )
            .forEach(
                function (botao) {

                    botao.addEventListener(
                        "click",
                        function () {

                            excluirOrcamento(
                                botao.dataset
                                    .excluirOrcamento
                            );

                        }
                    );

                }
            );

        listaOrcamentos
            .querySelectorAll(
                "[data-aprovar-orcamento]"
            )
            .forEach(
                function (botao) {

                    botao.addEventListener(
                        "click",
                        function () {

                            aprovarOrcamento(
                                botao.dataset
                                    .aprovarOrcamento
                            );

                        }
                    );

                }
            );

        listaOrcamentos
            .querySelectorAll(
                "[data-produzir-orcamento]"
            )
            .forEach(
                function (botao) {

                    botao.addEventListener(
                        "click",
                        function () {

                            enviarOrcamentoParaProducao(
                                botao.dataset
                                    .produzirOrcamento
                            );

                        }
                    );

                }
            );

        atualizarResumoOrcamentos();

    }

    // ==================================================
    // EDITAR ORÇAMENTO
    // ==================================================

    function editarOrcamento(id) {

        recarregarDadosDeApoio();

        const orcamento =
            encontrarOrcamento(id);

        if (!orcamento) {

            alert(
                "Orçamento não encontrado."
            );

            return;

        }

        orcamentoEmEdicaoId =
            orcamento.id;

        preencherSelectClientes(

            campoClienteOrcamento,

            orcamento.clienteId ||
            ""

        );

        if (campoDataOrcamento) {

            campoDataOrcamento.value =
                orcamento.data || "";

        }

        if (campoValidadeOrcamento) {

            campoValidadeOrcamento.value =
                orcamento.validade || "";

        }

        if (campoStatusOrcamento) {

            garantirStatusOrcamento(
                orcamento.status ||
                "Rascunho"
            );

            campoStatusOrcamento.value =
                orcamento.status ||
                "Rascunho";

        }

        if (campoNomeProdutoOrcamento) {

            campoNomeProdutoOrcamento.value =
                orcamento.produtoNome ||
                "";

        }

        if (campoQuantidadeOrcamento) {

            campoQuantidadeOrcamento.value =
                orcamento.quantidade ||
                "";

        }

        if (campoDescricaoOrcamento) {

            campoDescricaoOrcamento.value =
                orcamento.descricao ||
                "";

        }

        limparLinhasFilamentosOrcamento(
            orcamento.filamentos ||
            []
        );

        limparLinhasAcessoriosOrcamento(
            orcamento.acessorios ||
            []
        );

        limparLinhasEmbalagensOrcamento(
            orcamento.embalagens ||
            []
        );

        preencherSelectImpressoras(

            campoImpressoraOrcamento,

            orcamento.impressoraId ||
            ""

        );

        if (campoHorasOrcamento) {

            campoHorasOrcamento.value =
                orcamento.horas ||
                "";

        }

        if (campoMinutosOrcamento) {

            campoMinutosOrcamento.value =
                orcamento.minutos ||
                "";

        }

        if (campoPotenciaOrcamento) {

            campoPotenciaOrcamento.value =
                orcamento.potenciaWatts ||
                "";

        }

        if (campoTarifaOrcamento) {

            campoTarifaOrcamento.value =
                orcamento.tarifaEnergia ||
                "";

        }

        if (campoCustoHoraOrcamento) {

            campoCustoHoraOrcamento.value =
                orcamento.custoHoraImpressora ||
                "";

        }

        if (campoMargemDesejadaOrcamento) {

            campoMargemDesejadaOrcamento.value =
                orcamento.margemDesejada ||
                "";

        }

        if (campoPrecoFinalOrcamento) {

            campoPrecoFinalOrcamento.value =
                orcamento.precoFinal ||
                "";

        }

        if (campoObservacoesOrcamento) {

            campoObservacoesOrcamento.value =
                orcamento.observacoes ||
                "";

        }

        if (botaoSalvarOrcamento) {

            botaoSalvarOrcamento.textContent =
                "Atualizar Orçamento";

        }

        abrirAba(
            "aba-orcamentos"
        );

        atualizarCalculosOrcamento();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    // ==================================================
    // EXCLUIR ORÇAMENTO
    // ==================================================

    function excluirOrcamento(id) {

        const orcamento =
            encontrarOrcamento(id);

        if (!orcamento) {

            alert(
                "Orçamento não encontrado."
            );

            return;

        }

        if (
            orcamento.status ===
            "Produzido"
        ) {

            alert(
                "Um orçamento já produzido não pode ser excluído."
            );

            return;

        }

        const confirmar =
    confirm(
        'Deseja excluir o produto "' +
        (
            produto.nome ||
            "produto sem nome"
        ) +
        '"?\n\n' +
        "Os insumos consumidos e as horas da impressora não serão devolvidos automaticamente."
    );

        if (!confirmar) {
            return;
        }

        orcamentos =
            orcamentos.filter(
                function (item) {

                    return String(item.id) !==
                        String(orcamento.id);

                }
            );

        salvarOrcamentos();

        if (
            String(
                orcamentoEmEdicaoId
            ) ===
            String(
                orcamento.id
            )
        ) {

            limparFormularioOrcamento();

        }

        mostrarOrcamentos();

        atualizarResumoOrcamentos();

        alert(
            "Orçamento excluído com sucesso."
        );

    }

    // ==================================================
    // APROVAR ORÇAMENTO
    // ==================================================

    function aprovarOrcamento(id) {

        const orcamento =
            encontrarOrcamento(id);

        if (!orcamento) {

            alert(
                "Orçamento não encontrado."
            );

            return;

        }

        if (
            orcamento.status ===
            "Produzido"
        ) {

            alert(
                "Este orçamento já foi produzido."
            );

            return;

        }

        const confirmar =
            confirm(
                "Deseja aprovar este orçamento e deixá-lo aguardando produção?"
            );

        if (!confirmar) {
            return;
        }

        orcamento.status =
            "Aguardando produção";

        orcamento.atualizadoEm =
            new Date().toISOString();

        salvarOrcamentos();

        mostrarOrcamentos();

        atualizarResumoOrcamentos();

        alert(
            "Orçamento aprovado e enviado para a fila de produção."
        );

    }

    // ==================================================
    // ENVIAR ORÇAMENTO PARA PRODUÇÃO
    // ==================================================

    function enviarOrcamentoParaProducao(
        id
    ) {

        recarregarDadosDeApoio();

        const orcamento =
            encontrarOrcamento(id);

        if (!orcamento) {

            alert(
                "Orçamento não encontrado."
            );

            return;

        }

        if (
            orcamento.status ===
            "Produzido"
        ) {

            alert(
                "Este orçamento já foi produzido."
            );

            return;

        }

        orcamento.status =
            "Aguardando produção";

        orcamento.atualizadoEm =
            new Date().toISOString();

        salvarOrcamentos();

        copiarOrcamentoParaProducao(
            orcamento
        );

        mostrarOrcamentos();

        atualizarResumoOrcamentos();

        alert(
            "Dados do orçamento copiados para a produção. Confira os consumos reais antes de confirmar."
        );

    }
        // ==================================================
    // PARTE 10A
    // PEÇAS COM FALHA — CAMPOS E CÁLCULOS
    // ==================================================

    const campoPerdaProdutoLote =
        document.getElementById(
            "perda-produto-lote"
        );

    const campoPerdaData =
        document.getElementById(
            "perda-data"
        );

    const campoPerdaQuantidade =
        document.getElementById(
            "perda-quantidade"
        );

    const campoPerdaTipo =
        document.getElementById(
            "perda-tipo"
        );

    const campoPerdaReaproveitavel =
        document.getElementById(
            "perda-reaproveitavel"
        );

    const campoPerdaQuantidadeReaproveitavel =
        document.getElementById(
            "perda-quantidade-reaproveitavel"
        );

    const campoPerdaCustoUnitario =
        document.getElementById(
            "perda-custo-unitario"
        );

    const campoPerdaCustoTotal =
        document.getElementById(
            "perda-custo-total"
        );

    const campoPerdaMotivo =
        document.getElementById(
            "perda-motivo"
        );

    const campoPerdaDestino =
        document.getElementById(
            "perda-destino"
        );

    const campoPerdaObservacoes =
        document.getElementById(
            "perda-observacoes"
        );

    const botaoSalvarPerda =
        document.getElementById(
            "salvar-perda-produto"
        );

    const botaoLimparPerda =
        document.getElementById(
            "limpar-formulario-perda"
        );

    const listaPerdas =
        document.getElementById(
            "lista-perdas-produtos"
        );

    const campoTotalRegistrosPerdas =
        document.getElementById(
            "perdas-total-registros"
        );

    const campoTotalUnidadesPerdidas =
        document.getElementById(
            "perdas-total-unidades"
        );

    const campoCustoTotalPerdas =
        document.getElementById(
            "perdas-custo-total"
        );

    const campoTotalReaproveitaveis =
        document.getElementById(
            "perdas-total-reaproveitaveis"
        );

    // ==================================================
    // PREENCHER LOTES DISPONÍVEIS
    // ==================================================

    function preencherSelectLotesPerda(
        valorSelecionado = ""
    ) {

        if (!campoPerdaProdutoLote) {
            return;
        }

        campoPerdaProdutoLote.innerHTML =
            '<option value="">' +
            "Selecione o lote produzido" +
            "</option>";

        produtos
            .filter(
                function (produto) {

                    return (
                        numeroPositivo(
                            produto.quantidadeDisponivel
                        ) > 0
                    );

                }
            )
            .sort(
                function (a, b) {

                    return String(
                        a.dataProducao || ""
                    ).localeCompare(
                        String(
                            b.dataProducao || ""
                        )
                    );

                }
            )
            .forEach(
                function (produto) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        String(produto.id);

                    option.textContent =
                        (
                            produto.nome ||
                            "Produto sem nome"
                                            
                        ) +
                        " — " +
                        numeroFormatado(
                            produto.quantidadeDisponivel,
                            0
                        ) +
                        " disponíveis";

                    option.selected =
                        String(valorSelecionado) ===
                        String(produto.id);

                    campoPerdaProdutoLote
                        .appendChild(option);

                }
            );

    }

    // ==================================================
    // CALCULAR PERDA
    // ==================================================

    function atualizarCalculosPerda() {

        const produto =
            encontrarProduto(
                campoPerdaProdutoLote
                    ? campoPerdaProdutoLote.value
                    : ""
            );

        const quantidade =
            numeroPositivo(
                campoPerdaQuantidade
                    ? campoPerdaQuantidade.value
                    : 0
            );

        const quantidadeReaproveitavel =
            numeroPositivo(
                campoPerdaQuantidadeReaproveitavel
                    ? campoPerdaQuantidadeReaproveitavel.value
                    : 0
            );

        const custoUnitario =
            produto
                ? numeroPositivo(
                    produto.custoUnitario
                )
                : 0;

        const custoTotal =
            quantidade *
            custoUnitario;

        if (campoPerdaCustoUnitario) {

            campoPerdaCustoUnitario.value =
                dinheiro(
                    custoUnitario
                );

        }

        if (campoPerdaCustoTotal) {

            campoPerdaCustoTotal.value =
                dinheiro(
                    custoTotal
                );

        }

        return {

            produto:
                produto,

            quantidade:
                quantidade,

            quantidadeReaproveitavel:
                quantidadeReaproveitavel,

            custoUnitario:
                custoUnitario,

            custoTotal:
                custoTotal

        };

    }

    // ==================================================
    // VALIDAR PERDA
    // ==================================================

    function validarPerda(
        calculos
    ) {

        if (!calculos.produto) {

            alert(
                "Selecione o lote produzido."
            );

            return false;

        }

        if (
            !campoPerdaData ||
            !campoPerdaData.value
        ) {

            alert(
                "Informe a data da ocorrência."
            );

            return false;

        }

        if (
            calculos.quantidade <= 0
        ) {

            alert(
                "Informe uma quantidade com falha válida."
            );

            return false;

        }

        const quantidadeDisponivel =
            numeroPositivo(
                calculos.produto
                    .quantidadeDisponivel
            );

        if (
            calculos.quantidade >
            quantidadeDisponivel
        ) {

            alert(
                "A quantidade com falha é maior que o estoque disponível.\n\n" +
                "Disponível: " +
                numeroFormatado(
                    quantidadeDisponivel,
                    0
                ) +
                "\nInformado: " +
                numeroFormatado(
                    calculos.quantidade,
                    0
                )
            );

            return false;

        }

        if (
            !campoPerdaTipo ||
            !campoPerdaTipo.value
        ) {

            alert(
                "Selecione o tipo de falha."
            );

            return false;

        }

        if (
            calculos.quantidadeReaproveitavel >
            calculos.quantidade
        ) {

            alert(
                "A quantidade reaproveitável não pode ser maior que a quantidade com falha."
            );

            return false;

        }

        if (
            campoPerdaReaproveitavel &&
            campoPerdaReaproveitavel.value ===
                "Não" &&
            calculos.quantidadeReaproveitavel > 0
        ) {

            alert(
                'Quando a peça não for reaproveitável, informe "0" na quantidade reaproveitável.'
            );

            return false;

        }

        if (
            !campoPerdaMotivo ||
            !campoPerdaMotivo.value.trim()
        ) {

            alert(
                "Descreva a falha ocorrida."
            );

            return false;

        }

        return true;

    }

    // ==================================================
    // CRIAR OBJETO DA PERDA
    // ==================================================

    function criarObjetoPerda(
        calculos
    ) {

        const produto =
            calculos.produto;

        return {

            id:
                perdaEmEdicaoId ||
                criarId(),

            produtoId:
                produto.id,

            produtoNome:
                produto.nome || "",


            data:
                campoPerdaData
                    ? campoPerdaData.value
                    : "",

            quantidade:
                calculos.quantidade,

            tipo:
                campoPerdaTipo
                    ? campoPerdaTipo.value
                    : "",

            reaproveitavel:
                campoPerdaReaproveitavel
                    ? campoPerdaReaproveitavel.value
                    : "Não",

            quantidadeReaproveitavel:
                calculos.quantidadeReaproveitavel,

            custoUnitario:
                calculos.custoUnitario,

            custoTotal:
                calculos.custoTotal,

            motivo:
                campoPerdaMotivo
                    ? campoPerdaMotivo.value.trim()
                    : "",

            destino:
                campoPerdaDestino
                    ? campoPerdaDestino.value
                    : "Descarte",

            observacoes:
                campoPerdaObservacoes
                    ? campoPerdaObservacoes.value.trim()
                    : "",

            criadoEm:
                new Date().toISOString(),

            atualizadoEm:
                new Date().toISOString()

        };

    }

    // ==================================================
    // EVENTOS DE CÁLCULO
    // ==================================================

    [
        campoPerdaProdutoLote,
        campoPerdaQuantidade,
        campoPerdaQuantidadeReaproveitavel,
        campoPerdaReaproveitavel
    ].forEach(
        function (campo) {

            if (!campo) {
                return;
            }

            campo.addEventListener(
                "input",
                atualizarCalculosPerda
            );

            campo.addEventListener(
                "change",
                atualizarCalculosPerda
            );

        }
    );
        // ==================================================
    // PARTE 10B
    // SALVAMENTO, MOVIMENTAÇÃO E LISTAGEM DAS PERDAS
    // ==================================================

    function salvarPerdaProduto() {

        const calculos =
            atualizarCalculosPerda();

        if (
            !validarPerda(
                calculos
            )
        ) {
            return;
        }

        const editando =
            perdaEmEdicaoId !== null;

        const perda =
            criarObjetoPerda(
                calculos
            );

        if (editando) {

            const indice =
                perdas.findIndex(
                    function (item) {

                        return String(item.id) ===
                            String(
                                perdaEmEdicaoId
                            );

                    }
                );

            if (indice === -1) {

                alert(
                    "Registro de perda não encontrado."
                );

                return;

            }

            perda.criadoEm =
                perdas[indice].criadoEm ||
                perda.criadoEm;

            perdas[indice] =
                perda;

        } else {

            const produto =
                calculos.produto;

            const quantidadeAnterior =
                numeroPositivo(
                    produto.quantidadeDisponivel
                );

            produto.quantidadeDisponivel =
                Math.max(
                    0,
                    quantidadeAnterior -
                    perda.quantidade
                );

            const quantidadePosterior =
                produto.quantidadeDisponivel;

            perdas.push(
                perda
            );

            salvarProdutos();

            registrarMovimentacaoSaida({

                data:
                    perda.data,

                tipo:
                    "Saída por perda",

                produtoId:
                    perda.produtoId,

                produto:
                    perda.produtoNome,

                lote:
                    perda.lote,

                quantidade:
                    perda.quantidade,

                quantidadeAnterior:
                    quantidadeAnterior,

                quantidadePosterior:
                    quantidadePosterior,

                custoUnitario:
                    perda.custoUnitario,

                custoTotal:
                    perda.custoTotal,

                observacoes:
                    perda.motivo

            });

        }

        salvarPerdas();

        mostrarPerdas();

        atualizarResumoPerdas();

        mostrarProdutos();

        atualizarResumoProdutos();

        preencherSelectLotesPerda();

        preencherSelectLotesConsumoProprio();

        limparFormularioPerda();

        if (
            typeof atualizarDashboardCompleto ===
            "function"
        ) {

            atualizarDashboardCompleto();

        }

        alert(
            editando
                ? "Registro de perda atualizado com sucesso!"
                : "Perda registrada com sucesso!"
        );

    }

    // ==================================================
    // LIMPAR FORMULÁRIO DA PERDA
    // ==================================================

    function limparFormularioPerda() {

        perdaEmEdicaoId =
            null;

        preencherSelectLotesPerda();

        if (campoPerdaData) {

            campoPerdaData.value =
                dataHoje();

        }

        if (campoPerdaQuantidade) {
            campoPerdaQuantidade.value = "";
        }

        if (campoPerdaTipo) {
            campoPerdaTipo.value = "";
        }

        if (campoPerdaReaproveitavel) {

            campoPerdaReaproveitavel.value =
                "Não";

        }

        if (campoPerdaQuantidadeReaproveitavel) {

            campoPerdaQuantidadeReaproveitavel.value =
                "0";

        }

        if (campoPerdaMotivo) {
            campoPerdaMotivo.value = "";
        }

        if (campoPerdaDestino) {

            campoPerdaDestino.value =
                "Descarte";

        }

        if (campoPerdaObservacoes) {
            campoPerdaObservacoes.value = "";
        }

        if (botaoSalvarPerda) {

            botaoSalvarPerda.textContent =
                "Salvar Perda";

        }

        atualizarCalculosPerda();

    }

    // ==================================================
    // ATUALIZAR RESUMO DAS PERDAS
    // ==================================================

    function atualizarResumoPerdas() {

        const totalUnidades =
            perdas.reduce(
                function (total, perda) {

                    return (
                        total +
                        numeroPositivo(
                            perda.quantidade
                        )
                    );

                },
                0
            );

        const custoTotal =
            perdas.reduce(
                function (total, perda) {

                    return (
                        total +
                        numeroPositivo(
                            perda.custoTotal
                        )
                    );

                },
                0
            );

        const totalReaproveitavel =
            perdas.reduce(
                function (total, perda) {

                    return (
                        total +
                        numeroPositivo(
                            perda.quantidadeReaproveitavel
                        )
                    );

                },
                0
            );

        if (campoTotalRegistrosPerdas) {

            campoTotalRegistrosPerdas.textContent =
                perdas.length;

        }

        if (campoTotalUnidadesPerdidas) {

            campoTotalUnidadesPerdidas.textContent =
                numeroFormatado(
                    totalUnidades,
                    0
                );

        }

        if (campoCustoTotalPerdas) {

            campoCustoTotalPerdas.textContent =
                dinheiro(
                    custoTotal
                );

        }

        if (campoTotalReaproveitaveis) {

            campoTotalReaproveitaveis.textContent =
                numeroFormatado(
                    totalReaproveitavel,
                    0
                );

        }

    }

    // ==================================================
    // MOSTRAR PERDAS
    // ==================================================

    function mostrarPerdas() {

        if (!listaPerdas) {
            return;
        }

        if (
            !Array.isArray(perdas) ||
            perdas.length === 0
        ) {

            listaPerdas.innerHTML =
                "<p>Nenhuma perda registrada.</p>";

            atualizarResumoPerdas();

            return;

        }

        listaPerdas.innerHTML =
            [...perdas]
                .sort(
                    function (a, b) {

                        return String(
                            b.data || ""
                        ).localeCompare(
                            String(
                                a.data || ""
                            )
                        );

                    }
                )
                .map(
                    function (perda) {

                        return `
                            <div class="card-item">

                                <h4>
                                    ${textoSeguro(
                                        perda.produtoNome ||
                                        "Produto não informado"
                                    )}
                                </h4>

                                <p>
                                    <strong>Lote:</strong>
                                    ${textoSeguro(
                                        perda.lote ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Data:</strong>
                                    ${dataFormatada(
                                        perda.data
                                    )}
                                </p>

                                <p>
                                    <strong>Quantidade perdida:</strong>
                                    ${numeroFormatado(
                                        perda.quantidade,
                                        0
                                    )}
                                </p>

                                <p>
                                    <strong>Tipo de falha:</strong>
                                    ${textoSeguro(
                                        perda.tipo ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Reaproveitável:</strong>
                                    ${textoSeguro(
                                        perda.reaproveitavel ||
                                        "Não"
                                    )}
                                </p>

                                <p>
                                    <strong>Quantidade reaproveitável:</strong>
                                    ${numeroFormatado(
                                        perda.quantidadeReaproveitavel,
                                        0
                                    )}
                                </p>

                                <p>
                                    <strong>Custo unitário:</strong>
                                    ${dinheiro(
                                        perda.custoUnitario
                                    )}
                                </p>

                                <p>
                                    <strong>Custo total perdido:</strong>
                                    ${dinheiro(
                                        perda.custoTotal
                                    )}
                                </p>

                                <p>
                                    <strong>Destino:</strong>
                                    ${textoSeguro(
                                        perda.destino ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Descrição:</strong>
                                    ${textoSeguro(
                                        perda.motivo ||
                                        "Não informada"
                                    )}
                                </p>

                            </div>
                        `;

                    }
                )
                .join("");

        atualizarResumoPerdas();

    }

    // ==================================================
    // EVENTOS DOS BOTÕES DA PERDA
    // ==================================================

    if (botaoSalvarPerda) {

        botaoSalvarPerda.addEventListener(
            "click",
            salvarPerdaProduto
        );

    }

    if (botaoLimparPerda) {

        botaoLimparPerda.addEventListener(
            "click",
            limparFormularioPerda
        );

    }
        // ==================================================
    // PARTE 11A
    // CONSUMO PRÓPRIO — CAMPOS, CÁLCULOS E VALIDAÇÃO
    // ==================================================

    const campoConsumoProdutoLote =
        document.getElementById(
            "consumo-proprio-produto-lote"
        );

    const campoConsumoData =
        document.getElementById(
            "consumo-proprio-data"
        );

    const campoConsumoQuantidade =
        document.getElementById(
            "consumo-proprio-quantidade"
        );

    const campoConsumoFinalidade =
        document.getElementById(
            "consumo-proprio-finalidade"
        );

    const campoConsumoLocal =
        document.getElementById(
            "consumo-proprio-local"
        );

    const campoConsumoResponsavel =
        document.getElementById(
            "consumo-proprio-responsavel"
        );

    const campoConsumoCustoUnitario =
        document.getElementById(
            "consumo-proprio-custo-unitario"
        );

    const campoConsumoCustoTotal =
        document.getElementById(
            "consumo-proprio-custo-total"
        );

    const campoConsumoDescricao =
        document.getElementById(
            "consumo-proprio-descricao"
        );

    const campoConsumoObservacoes =
        document.getElementById(
            "consumo-proprio-observacoes"
        );

    const botaoSalvarConsumoProprio =
        document.getElementById(
            "salvar-consumo-proprio"
        );

    const botaoLimparConsumoProprio =
        document.getElementById(
            "limpar-formulario-consumo-proprio"
        );

    const listaConsumoProprio =
        document.getElementById(
            "lista-consumo-proprio"
        );

    const campoTotalRegistrosConsumo =
        document.getElementById(
            "consumo-proprio-total-registros"
        );

    const campoTotalUnidadesConsumo =
        document.getElementById(
            "consumo-proprio-total-unidades"
        );

    const campoCustoInternoTotalConsumo =
        document.getElementById(
            "consumo-proprio-custo-interno-total"
        );

    const campoItensEmUsoConsumo =
        document.getElementById(
            "consumo-proprio-itens-em-uso"
        );

    // ==================================================
    // PREENCHER LOTES DISPONÍVEIS
    // ==================================================

    function preencherSelectLotesConsumoProprio(
        valorSelecionado = ""
    ) {

        if (!campoConsumoProdutoLote) {
            return;
        }

        campoConsumoProdutoLote.innerHTML =
            '<option value="">' +
            "Selecione o lote produzido" +
            "</option>";

        produtos
            .filter(
                function (produto) {

                    return (
                        numeroPositivo(
                            produto.quantidadeDisponivel
                        ) > 0
                    );

                }
            )
            .sort(
                function (a, b) {

                    return String(
                        a.dataProducao || ""
                    ).localeCompare(
                        String(
                            b.dataProducao || ""
                        )
                    );

                }
            )
            .forEach(
                function (produto) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        String(produto.id);

                    option.textContent =
                        (
                            produto.nome ||
                            "Produto sem nome"
                        ) +
                                        
                        " — " +
                        numeroFormatado(
                            produto.quantidadeDisponivel,
                            0
                        ) +
                        " disponíveis";

                    option.selected =
                        String(valorSelecionado) ===
                        String(produto.id);

                    campoConsumoProdutoLote
                        .appendChild(option);

                }
            );

    }

    // ==================================================
    // CALCULAR CONSUMO PRÓPRIO
    // ==================================================

    function atualizarCalculosConsumoProprio() {

        const produto =
            encontrarProduto(
                campoConsumoProdutoLote
                    ? campoConsumoProdutoLote.value
                    : ""
            );

        const quantidade =
            numeroPositivo(
                campoConsumoQuantidade
                    ? campoConsumoQuantidade.value
                    : 0
            );

        const custoUnitario =
            produto
                ? numeroPositivo(
                    produto.custoUnitario
                )
                : 0;

        const custoTotal =
            quantidade *
            custoUnitario;

        if (campoConsumoCustoUnitario) {

            campoConsumoCustoUnitario.value =
                dinheiro(
                    custoUnitario
                );

        }

        if (campoConsumoCustoTotal) {

            campoConsumoCustoTotal.value =
                dinheiro(
                    custoTotal
                );

        }

        return {

            produto:
                produto,

            quantidade:
                quantidade,

            custoUnitario:
                custoUnitario,

            custoTotal:
                custoTotal

        };

    }

    // ==================================================
    // VALIDAR CONSUMO PRÓPRIO
    // ==================================================

    function validarConsumoProprio(
        calculos
    ) {

        if (!calculos.produto) {

            alert(
                "Selecione o lote produzido."
            );

            return false;

        }

        if (
            !campoConsumoData ||
            !campoConsumoData.value
        ) {

            alert(
                "Informe a data da retirada."
            );

            return false;

        }

        if (
            calculos.quantidade <= 0
        ) {

            alert(
                "Informe uma quantidade válida."
            );

            return false;

        }

        const quantidadeDisponivel =
            numeroPositivo(
                calculos.produto
                    .quantidadeDisponivel
            );

        if (
            calculos.quantidade >
            quantidadeDisponivel
        ) {

            alert(
                "A quantidade informada é maior que o estoque disponível.\n\n" +
                "Disponível: " +
                numeroFormatado(
                    quantidadeDisponivel,
                    0
                ) +
                "\nInformado: " +
                numeroFormatado(
                    calculos.quantidade,
                    0
                )
            );

            return false;

        }

        if (
            !campoConsumoFinalidade ||
            !campoConsumoFinalidade.value
        ) {

            alert(
                "Selecione a finalidade do consumo próprio."
            );

            return false;

        }

        if (
            !campoConsumoDescricao ||
            !campoConsumoDescricao.value.trim()
        ) {

            alert(
                "Descreva como o produto será utilizado."
            );

            return false;

        }

        return true;

    }

    // ==================================================
    // CRIAR OBJETO DO CONSUMO PRÓPRIO
    // ==================================================

    function criarObjetoConsumoProprio(
        calculos
    ) {

        const produto =
            calculos.produto;

        return {

            id:
                consumoProprioEmEdicaoId ||
                criarId(),

            produtoId:
                produto.id,

            produtoNome:
                produto.nome || "",

        
            data:
                campoConsumoData
                    ? campoConsumoData.value
                    : "",

            quantidade:
                calculos.quantidade,

            finalidade:
                campoConsumoFinalidade
                    ? campoConsumoFinalidade.value
                    : "",

            local:
                campoConsumoLocal
                    ? campoConsumoLocal.value.trim()
                    : "",

            responsavel:
                campoConsumoResponsavel
                    ? campoConsumoResponsavel.value.trim()
                    : "",

            custoUnitario:
                calculos.custoUnitario,

            custoTotal:
                calculos.custoTotal,

            descricao:
                campoConsumoDescricao
                    ? campoConsumoDescricao.value.trim()
                    : "",

            observacoes:
                campoConsumoObservacoes
                    ? campoConsumoObservacoes.value.trim()
                    : "",

            status:
                "Em uso",

            criadoEm:
                new Date().toISOString(),

            atualizadoEm:
                new Date().toISOString()

        };

    }

    // ==================================================
    // EVENTOS DE CÁLCULO
    // ==================================================

    [
        campoConsumoProdutoLote,
        campoConsumoQuantidade
    ].forEach(
        function (campo) {

            if (!campo) {
                return;
            }

            campo.addEventListener(
                "input",
                atualizarCalculosConsumoProprio
            );

            campo.addEventListener(
                "change",
                atualizarCalculosConsumoProprio
            );

        }
    );
        // ==================================================
    // PARTE 11B
    // SALVAMENTO E LISTAGEM DO CONSUMO PRÓPRIO
    // ==================================================

    function salvarConsumoProprioProduto() {

        const calculos =
            atualizarCalculosConsumoProprio();

        if (
            !validarConsumoProprio(
                calculos
            )
        ) {
            return;
        }

        const editando =
            consumoProprioEmEdicaoId !==
            null;

        const consumo =
            criarObjetoConsumoProprio(
                calculos
            );

        if (editando) {

            const indice =
                consumosProprios.findIndex(
                    function (item) {

                        return String(item.id) ===
                            String(
                                consumoProprioEmEdicaoId
                            );

                    }
                );

            if (indice === -1) {

                alert(
                    "Registro de consumo próprio não encontrado."
                );

                return;

            }

            consumo.criadoEm =
                consumosProprios[indice]
                    .criadoEm ||
                consumo.criadoEm;

            consumosProprios[indice] =
                consumo;

        } else {

            const produto =
                calculos.produto;

            const quantidadeAnterior =
                numeroPositivo(
                    produto.quantidadeDisponivel
                );

            produto.quantidadeDisponivel =
                Math.max(
                    0,
                    quantidadeAnterior -
                    consumo.quantidade
                );

            const quantidadePosterior =
                produto.quantidadeDisponivel;

            consumosProprios.push(
                consumo
            );

            salvarProdutos();

            registrarMovimentacaoSaida({

                data:
                    consumo.data,

                tipo:
                    "Saída por consumo próprio",

                produtoId:
                    consumo.produtoId,

                produto:
                    consumo.produtoNome,

                lote:
                    consumo.lote,

                quantidade:
                    consumo.quantidade,

                quantidadeAnterior:
                    quantidadeAnterior,

                quantidadePosterior:
                    quantidadePosterior,

                custoUnitario:
                    consumo.custoUnitario,

                custoTotal:
                    consumo.custoTotal,

                observacoes:
                    consumo.finalidade +
                    (
                        consumo.descricao
                            ? " — " +
                                consumo.descricao
                            : ""
                    )

            });

        }

        salvarConsumosProprios();

        mostrarConsumosProprios();

        atualizarResumoConsumoProprio();

        mostrarProdutos();

        atualizarResumoProdutos();

        preencherSelectLotesPerda();

        preencherSelectLotesConsumoProprio();

        limparFormularioConsumoProprio();

        if (
            typeof atualizarDashboardCompleto ===
            "function"
        ) {

            atualizarDashboardCompleto();

        }

        alert(
            editando
                ? "Consumo próprio atualizado com sucesso!"
                : "Consumo próprio registrado com sucesso!"
        );

    }

    // ==================================================
    // LIMPAR FORMULÁRIO DO CONSUMO PRÓPRIO
    // ==================================================

    function limparFormularioConsumoProprio() {

        consumoProprioEmEdicaoId =
            null;

        preencherSelectLotesConsumoProprio();

        if (campoConsumoData) {

            campoConsumoData.value =
                dataHoje();

        }

        if (campoConsumoQuantidade) {

            campoConsumoQuantidade.value =
                "";

        }

        if (campoConsumoFinalidade) {

            campoConsumoFinalidade.value =
                "";

        }

        if (campoConsumoLocal) {

            campoConsumoLocal.value =
                "";

        }

        if (campoConsumoResponsavel) {

            campoConsumoResponsavel.value =
                "";

        }

        if (campoConsumoDescricao) {

            campoConsumoDescricao.value =
                "";

        }

        if (campoConsumoObservacoes) {

            campoConsumoObservacoes.value =
                "";

        }

        if (botaoSalvarConsumoProprio) {

            botaoSalvarConsumoProprio.textContent =
                "Salvar Consumo Próprio";

        }

        atualizarCalculosConsumoProprio();

    }

    // ==================================================
    // ATUALIZAR RESUMO DO CONSUMO PRÓPRIO
    // ==================================================

    function atualizarResumoConsumoProprio() {

        const totalUnidades =
            consumosProprios.reduce(
                function (total, consumo) {

                    return (
                        total +
                        numeroPositivo(
                            consumo.quantidade
                        )
                    );

                },
                0
            );

        const custoTotal =
            consumosProprios.reduce(
                function (total, consumo) {

                    return (
                        total +
                        numeroPositivo(
                            consumo.custoTotal
                        )
                    );

                },
                0
            );

        const itensEmUso =
            consumosProprios.filter(
                function (consumo) {

                    return consumo.status !==
                        "Descartado";

                }
            ).length;

        if (campoTotalRegistrosConsumo) {

            campoTotalRegistrosConsumo.textContent =
                consumosProprios.length;

        }

        if (campoTotalUnidadesConsumo) {

            campoTotalUnidadesConsumo.textContent =
                numeroFormatado(
                    totalUnidades,
                    0
                );

        }

        if (campoCustoInternoTotalConsumo) {

            campoCustoInternoTotalConsumo.textContent =
                dinheiro(
                    custoTotal
                );

        }

        if (campoItensEmUsoConsumo) {

            campoItensEmUsoConsumo.textContent =
                itensEmUso;

        }

    }

    // ==================================================
    // MOSTRAR CONSUMOS PRÓPRIOS
    // ==================================================

    function mostrarConsumosProprios() {

        if (!listaConsumoProprio) {
            return;
        }

        if (
            !Array.isArray(
                consumosProprios
            ) ||
            consumosProprios.length === 0
        ) {

            listaConsumoProprio.innerHTML =
                "<p>Nenhum consumo próprio registrado.</p>";

            atualizarResumoConsumoProprio();

            return;

        }

        listaConsumoProprio.innerHTML =
            [...consumosProprios]
                .sort(
                    function (a, b) {

                        return String(
                            b.data || ""
                        ).localeCompare(
                            String(
                                a.data || ""
                            )
                        );

                    }
                )
                .map(
                    function (consumo) {

                        return `
                            <div class="card-item">

                                <h4>
                                    ${textoSeguro(
                                        consumo.produtoNome ||
                                        "Produto não informado"
                                    )}
                                </h4>

                                <p>
                                    <strong>Lote:</strong>
                                    ${textoSeguro(
                                        consumo.lote ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Data:</strong>
                                    ${dataFormatada(
                                        consumo.data
                                    )}
                                </p>

                                <p>
                                    <strong>Quantidade:</strong>
                                    ${numeroFormatado(
                                        consumo.quantidade,
                                        0
                                    )}
                                </p>

                                <p>
                                    <strong>Finalidade:</strong>
                                    ${textoSeguro(
                                        consumo.finalidade ||
                                        "Não informada"
                                    )}
                                </p>

                                <p>
                                    <strong>Local de uso:</strong>
                                    ${textoSeguro(
                                        consumo.local ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Responsável:</strong>
                                    ${textoSeguro(
                                        consumo.responsavel ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Custo unitário:</strong>
                                    ${dinheiro(
                                        consumo.custoUnitario
                                    )}
                                </p>

                                <p>
                                    <strong>Custo interno total:</strong>
                                    ${dinheiro(
                                        consumo.custoTotal
                                    )}
                                </p>

                                <p>
                                    <strong>Descrição:</strong>
                                    ${textoSeguro(
                                        consumo.descricao ||
                                        "Não informada"
                                    )}
                                </p>

                                <p>
                                    <strong>Status:</strong>
                                    ${textoSeguro(
                                        consumo.status ||
                                        "Em uso"
                                    )}
                                </p>

                            </div>
                        `;

                    }
                )
                .join("");

        atualizarResumoConsumoProprio();

    }

    // ==================================================
    // EVENTOS DOS BOTÕES DO CONSUMO PRÓPRIO
    // ==================================================

    if (botaoSalvarConsumoProprio) {

        botaoSalvarConsumoProprio
            .addEventListener(
                "click",
                salvarConsumoProprioProduto
            );

    }

    if (botaoLimparConsumoProprio) {

        botaoLimparConsumoProprio
            .addEventListener(
                "click",
                limparFormularioConsumoProprio
            );

    }

    // ==================================================
    // PARTE 12
    // INICIALIZAÇÃO FINAL DO MÓDULO
    // ==================================================

    function atualizarModuloProduto() {

        produtos =
            lerLista(
                CHAVE_PRODUTOS
            );

        orcamentos =
            lerLista(
                CHAVE_ORCAMENTOS
            );

        perdas =
            lerLista(
                CHAVE_PERDAS
            );

        consumosProprios =
            lerLista(
                CHAVE_CONSUMO_PROPRIO
            );

        movimentacoes =
            lerLista(
                CHAVE_MOVIMENTACOES
            );

        recarregarDadosDeApoio();

        atualizarSelectsFixos();

        mostrarProdutos();

        atualizarResumoProdutos();

        mostrarOrcamentos();

        atualizarResumoOrcamentos();

        mostrarPerdas();

        atualizarResumoPerdas();

        mostrarConsumosProprios();

        atualizarResumoConsumoProprio();

        preencherSelectLotesPerda();

        preencherSelectLotesConsumoProprio();

        atualizarCalculosProduto();

        atualizarCalculosOrcamento();

        atualizarCalculosPerda();

        atualizarCalculosConsumoProprio();

    }

    // ==================================================
    // DATAS INICIAIS
    // ==================================================

    if (
        campoDataProduto &&
        !campoDataProduto.value
    ) {

        campoDataProduto.value =
            dataHoje();

    }

    if (
        campoDataOrcamento &&
        !campoDataOrcamento.value
    ) {

        campoDataOrcamento.value =
            dataHoje();

    }

    if (
        campoPerdaData &&
        !campoPerdaData.value
    ) {

        campoPerdaData.value =
            dataHoje();

    }

    if (
        campoConsumoData &&
        !campoConsumoData.value
    ) {

        campoConsumoData.value =
            dataHoje();

    }

    // ==================================================
    // LINHAS INICIAIS
    // ==================================================

    limparLinhasFilamentosProduto();

    limparLinhasAcessoriosProduto();

    limparLinhasEmbalagensProduto();

    limparLinhasFilamentosOrcamento();

    limparLinhasAcessoriosOrcamento();

    limparLinhasEmbalagensOrcamento();

    // ==================================================
    // EXPOR ATUALIZAÇÃO PARA OUTROS MÓDULOS
    // ==================================================

    window.atualizarModuloProduto =
        atualizarModuloProduto;

    // ==================================================
    // ATUALIZAR QUANDO O LOCALSTORAGE MUDAR
    // ==================================================

    window.addEventListener(
        "storage",
        function (evento) {

            const chavesRelacionadas = [

                CHAVE_PRODUTOS,
                CHAVE_ORCAMENTOS,
                CHAVE_PERDAS,
                CHAVE_CONSUMO_PROPRIO,
                CHAVE_MOVIMENTACOES,
                CHAVE_FILAMENTOS,
                CHAVE_ACESSORIOS,
                CHAVE_EMBALAGENS,
                CHAVE_IMPRESSORAS,
                CHAVE_CLIENTES

            ];

            if (
                evento.key &&
                chavesRelacionadas.includes(
                    evento.key
                )
            ) {

                atualizarModuloProduto();

            }

        }
    );

    // ==================================================
    // PRIMEIRA ATUALIZAÇÃO
    // ==================================================

    atualizarModuloProduto();

    abrirAba(
        "aba-produtos-produzidos"
    );

} 