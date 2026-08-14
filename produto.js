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


    let perdaEmEdicaoId =
        null;

    let consumoProprioEmEdicaoId =
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

        const cor =
            filamento.cor ||
            "Cor não informada";

        const material =
            filamento.material ||
            filamento.tipo ||
            "Material não informado";

        const fabricante =
            filamento.fabricante ||
            "Fabricante não informado";

        const lote =
            filamento.lote ||
            "Sem lote";

        const dataCompra =
            dataFormatada(
                filamento.dataCompra
            );

        const fornecedor =
            filamento.fornecedor ||
            "Fornecedor não informado";

        return (
            cor +
            " | " +
            material +
            " | " +
            fabricante +
            " | " +
            lote +
            " | " +
            dataCompra +
            " | " +
            fornecedor +
            " | " +
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

    const filamentosDisponiveis =
        filamentos
            .filter(function (filamento) {

                const status =
                    String(
                        filamento.status || ""
                    )
                        .trim()
                        .toLowerCase();

                const pesoRestante =
                    Number(
                        filamento.pesoRestante || 0
                    );

                const filamentoSelecionado =
                    String(filamento.id) ===
                    String(valorSelecionado);

                return (
                    filamentoSelecionado ||
                    (
                        status !== "finalizado" &&
                        status !== "inativo" &&
                        pesoRestante > 0
                    )
                );

            })
            .sort(function (a, b) {

                const ordemA = [
                    a.material || "",
                    a.cor || "",
                    a.fabricante || ""
                ].join(" ");

                const ordemB = [
                    b.material || "",
                    b.cor || "",
                    b.fabricante || ""
                ].join(" ");

                return ordemA.localeCompare(
                    ordemB,
                    "pt-BR",
                    {
                        sensitivity: "base",
                        numeric: true
                    }
                );

            });

    filamentosDisponiveis.forEach(
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

const campoTipoProducao =
    document.getElementById(
        "produto-tipo-producao"
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

tipoProducao:
    campoTipoProducao
        ? campoTipoProducao.value
        : "Estoque",

status:
    produtoEmEdicaoId
        ? (
            encontrarProduto(
                produtoEmEdicaoId
            )?.status ||
            "Ativo"
        )
        : "Ativo",

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
    (
        campoTipoProducao &&
        campoTipoProducao.value ===
            "Estoque" &&
        campoEstoqueMinimoProduto
    )
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

let produtoAnterior =
    null;

if (!editando) {

    if (
        !validarEstoqueProducao(
            calculos
        )
    ) {
        return;
    }

} else {

    produtoAnterior =
        encontrarProduto(
            produtoEmEdicaoId
        );

    if (!produtoAnterior) {

        alert(
            "Produto não encontrado."
        );

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

    const ajusteRealizado =
        ajustarInsumosEdicao(
            produtoAnterior,
            produto
        );

    if (!ajusteRealizado) {

        return;

    }

    produto.criadoEm =
        produtoAnterior.criadoEm ||
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
             editando,
             produtoAnterior
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
    // AJUSTAR INSUMOS AO EDITAR UMA PRODUÇÃO
    // ==================================================

    function ajustarInsumosEdicao(
        produtoAnterior,
        produtoNovo
    ) {

        if (
            !produtoAnterior ||
            !produtoNovo
        ) {
            return false;
        }

        // ==============================================
        // SOMAR CONSUMOS POR ID
        // ==============================================

        function montarMapaConsumos(
            lista,
            campoId
        ) {

            const mapa = {};

            if (!Array.isArray(lista)) {
                return mapa;
            }

            lista.forEach(
                function (item) {

                    const id =
                        String(
                            item[campoId] ??
                            ""
                        );

                    if (!id) {
                        return;
                    }

                    if (!mapa[id]) {
                        mapa[id] = 0;
                    }

                    mapa[id] +=
                        numeroPositivo(
                            item.quantidade
                        );

                }
            );

            return mapa;

        }

        // ==============================================
        // FILAMENTOS
        // ==============================================

        const filamentosAnteriores =
            montarMapaConsumos(
                produtoAnterior.filamentos,
                "filamentoId"
            );

        const filamentosNovos =
            montarMapaConsumos(
                produtoNovo.filamentos,
                "filamentoId"
            );

        const idsFilamentos =
            new Set([
                ...Object.keys(
                    filamentosAnteriores
                ),
                ...Object.keys(
                    filamentosNovos
                )
            ]);

        // Primeiro validar antes de alterar qualquer coisa

        for (
            const id of idsFilamentos
        ) {

            const quantidadeAnterior =
                numeroPositivo(
                    filamentosAnteriores[id]
                );

            const quantidadeNova =
                numeroPositivo(
                    filamentosNovos[id]
                );

            const diferenca =
                quantidadeNova -
                quantidadeAnterior;

            if (diferenca <= 0) {
                continue;
            }

            const filamento =
                encontrarFilamento(id);

            if (!filamento) {

                alert(
                    "Um dos filamentos da produção não foi encontrado."
                );

                return false;

            }

            const saldoAtual =
                pesoRestanteFilamento(
                    filamento
                );

            if (
                diferenca >
                saldoAtual
            ) {

                alert(
                    "Não há filamento suficiente para atualizar esta produção.\n\n" +
                    "Filamento: " +
                    textoFilamento(
                        filamento
                    ) +
                    "\nNecessário adicional: " +
                    numeroFormatado(
                        diferenca,
                        2
                    ) +
                    " g\nDisponível: " +
                    numeroFormatado(
                        saldoAtual,
                        2
                    ) +
                    " g"
                );

                return false;

            }

        }

        // ==============================================
        // ACESSÓRIOS
        // ==============================================

        const acessoriosAnteriores =
            montarMapaConsumos(
                produtoAnterior.acessorios,
                "acessorioId"
            );

        const acessoriosNovos =
            montarMapaConsumos(
                produtoNovo.acessorios,
                "acessorioId"
            );

        const idsAcessorios =
            new Set([
                ...Object.keys(
                    acessoriosAnteriores
                ),
                ...Object.keys(
                    acessoriosNovos
                )
            ]);

        for (
            const id of idsAcessorios
        ) {

            const quantidadeAnterior =
                numeroPositivo(
                    acessoriosAnteriores[id]
                );

            const quantidadeNova =
                numeroPositivo(
                    acessoriosNovos[id]
                );

            const diferenca =
                quantidadeNova -
                quantidadeAnterior;

            if (diferenca <= 0) {
                continue;
            }

            const acessorio =
                encontrarAcessorio(id);

            if (!acessorio) {

                alert(
                    "Um dos acessórios da produção não foi encontrado."
                );

                return false;

            }

            const saldoAtual =
                quantidadeAcessorio(
                    acessorio
                );

            if (
                diferenca >
                saldoAtual
            ) {

                alert(
                    'Estoque insuficiente do acessório "' +
                    (
                        acessorio.nome ||
                        "sem nome"
                    ) +
                    '".\n\n' +
                    "Necessário adicional: " +
                    numeroFormatado(
                        diferenca,
                        0
                    ) +
                    "\nDisponível: " +
                    numeroFormatado(
                        saldoAtual,
                        0
                    )
                );

                return false;

            }

        }

        // ==============================================
        // EMBALAGENS
        // ==============================================

        const embalagensAnteriores =
            montarMapaConsumos(
                produtoAnterior.embalagens,
                "embalagemId"
            );

        const embalagensNovas =
            montarMapaConsumos(
                produtoNovo.embalagens,
                "embalagemId"
            );

        const idsEmbalagens =
            new Set([
                ...Object.keys(
                    embalagensAnteriores
                ),
                ...Object.keys(
                    embalagensNovas
                )
            ]);

        for (
            const id of idsEmbalagens
        ) {

            const quantidadeAnterior =
                numeroPositivo(
                    embalagensAnteriores[id]
                );

            const quantidadeNova =
                numeroPositivo(
                    embalagensNovas[id]
                );

            const diferenca =
                quantidadeNova -
                quantidadeAnterior;

            if (diferenca <= 0) {
                continue;
            }

            const embalagem =
                encontrarEmbalagem(id);

            if (!embalagem) {

                alert(
                    "Uma das embalagens da produção não foi encontrada."
                );

                return false;

            }

            const saldoAtual =
                quantidadeEmbalagem(
                    embalagem
                );

            if (
                diferenca >
                saldoAtual
            ) {

                alert(
                    'Estoque insuficiente da embalagem "' +
                    (
                        embalagem.nome ||
                        "sem nome"
                    ) +
                    '".\n\n' +
                    "Necessário adicional: " +
                    numeroFormatado(
                        diferenca,
                        0
                    ) +
                    "\nDisponível: " +
                    numeroFormatado(
                        saldoAtual,
                        0
                    )
                );

                return false;

            }

        }

        // ==============================================
        // APLICAR DIFERENÇAS DOS FILAMENTOS
        // ==============================================

        idsFilamentos.forEach(
            function (id) {

                const quantidadeAnterior =
                    numeroPositivo(
                        filamentosAnteriores[id]
                    );

                const quantidadeNova =
                    numeroPositivo(
                        filamentosNovos[id]
                    );

                const diferenca =
                    quantidadeNova -
                    quantidadeAnterior;

                if (diferenca === 0) {
                    return;
                }

                const filamento =
                    encontrarFilamento(id);

                if (!filamento) {
                    return;
                }

                const saldoAtual =
                    pesoRestanteFilamento(
                        filamento
                    );

                const pesoInicial =
                    pesoInicialFilamento(
                        filamento
                    );

                filamento.pesoRestante =
                    Math.max(
                        0,
                        Math.min(
                            pesoInicial,
                            saldoAtual -
                            diferenca
                        )
                    );

                atualizarStatusFilamento(
                    filamento
                );

            }
        );

        // ==============================================
        // APLICAR DIFERENÇAS DOS ACESSÓRIOS
        // ==============================================

        idsAcessorios.forEach(
            function (id) {

                const quantidadeAnterior =
                    numeroPositivo(
                        acessoriosAnteriores[id]
                    );

                const quantidadeNova =
                    numeroPositivo(
                        acessoriosNovos[id]
                    );

                const diferenca =
                    quantidadeNova -
                    quantidadeAnterior;

                if (diferenca === 0) {
                    return;
                }

                const acessorio =
                    encontrarAcessorio(id);

                if (!acessorio) {
                    return;
                }

                const novoSaldo =
                    Math.max(
                        0,
                        quantidadeAcessorio(
                            acessorio
                        ) -
                        diferenca
                    );

                acessorio.quantidade =
                    novoSaldo;

                if (
                    Object.prototype
                        .hasOwnProperty.call(
                            acessorio,
                            "estoque"
                        )
                ) {

                    acessorio.estoque =
                        novoSaldo;

                }

            }
        );

        // ==============================================
        // APLICAR DIFERENÇAS DAS EMBALAGENS
        // ==============================================

        idsEmbalagens.forEach(
            function (id) {

                const quantidadeAnterior =
                    numeroPositivo(
                        embalagensAnteriores[id]
                    );

                const quantidadeNova =
                    numeroPositivo(
                        embalagensNovas[id]
                    );

                const diferenca =
                    quantidadeNova -
                    quantidadeAnterior;

                if (diferenca === 0) {
                    return;
                }

                const embalagem =
                    encontrarEmbalagem(id);

                if (!embalagem) {
                    return;
                }

                const novoSaldo =
                    Math.max(
                        0,
                        quantidadeEmbalagem(
                            embalagem
                        ) -
                        diferenca
                    );

                embalagem.quantidade =
                    novoSaldo;

                if (
                    Object.prototype
                        .hasOwnProperty.call(
                            embalagem,
                            "estoque"
                        )
                ) {

                    embalagem.estoque =
                        novoSaldo;

                }

            }
        );

        salvarFilamentos();

        salvarAcessorios();

        salvarEmbalagens();

        return true;

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
    // ATUALIZAÇÃO DAS HORAS DA IMPRESSORA
    // ==================================================

        // ==================================================
    // ATUALIZAÇÃO DAS HORAS DA IMPRESSORA
    // ==================================================

    function adicionarHorasProducaoLocal(
        impressoraId,
        horas
    ) {

        const quantidadeHoras =
            numeroPositivo(
                horas
            );

        if (quantidadeHoras <= 0) {
            return false;
        }

        const impressora =
            encontrarImpressora(
                impressoraId
            );

        if (!impressora) {

            console.warn(
                "A impressora utilizada não foi encontrada."
            );

            return false;

        }

        impressora.horasProducoes =
            numeroPositivo(
                impressora.horasProducoes
            ) +
            quantidadeHoras;

        salvarImpressoras();

        return true;

    }

    function removerHorasProducaoLocal(
        impressoraId,
        horas
    ) {

        const quantidadeHoras =
            numeroPositivo(
                horas
            );

        if (quantidadeHoras <= 0) {
            return false;
        }

        const impressora =
            encontrarImpressora(
                impressoraId
            );

        if (!impressora) {

            console.warn(
                "A impressora utilizada não foi encontrada."
            );

            return false;

        }

        impressora.horasProducoes =
            Math.max(
                0,
                numeroPositivo(
                    impressora.horasProducoes
                ) -
                quantidadeHoras
            );

        salvarImpressoras();

        return true;

    }

    function adicionarHorasProducao(
        impressoraId,
        horas,
        produto
    ) {

        const quantidadeHoras =
            numeroPositivo(
                horas
            );

        if (quantidadeHoras <= 0) {
            return true;
        }

        if (
            typeof window.adicionarHorasProducaoEquipamento ===
            "function"
        ) {

            return window.adicionarHorasProducaoEquipamento(
                impressoraId,
                quantidadeHoras,
                "Produção do produto " +
                (
                    produto?.nome ||
                    "não informado"
                ),
                produto?.dataProducao ||
                dataHoje()
            );

        }

        return adicionarHorasProducaoLocal(
            impressoraId,
            quantidadeHoras
        );

    }

    function removerHorasProducao(
        impressoraId,
        horas,
        produto
    ) {

        const quantidadeHoras =
            numeroPositivo(
                horas
            );

        if (quantidadeHoras <= 0) {
            return true;
        }

        if (
            typeof window.removerHorasProducaoEquipamento ===
            "function"
        ) {

            return window.removerHorasProducaoEquipamento(
                impressoraId,
                quantidadeHoras,
                "Produção do produto " +
                (
                    produto?.nome ||
                    "não informado"
                ),
                produto?.dataProducao ||
                dataHoje()
            );

        }

        return removerHorasProducaoLocal(
            impressoraId,
            quantidadeHoras
        );

    }

    function registrarHorasImpressoraProduto(
        produto,
        editando,
        produtoAnterior = null
    ) {

        if (!produto) {
            return;
        }

        const horasNovas =
            numeroPositivo(
                produto.horasDecimais
            );

        // ==============================================
        // NOVA PRODUÇÃO
        // ==============================================

        if (!editando) {

            adicionarHorasProducao(
                produto.impressoraId,
                horasNovas,
                produto
            );

            return;

        }

        // ==============================================
        // EDIÇÃO
        // ==============================================

        if (!produtoAnterior) {

            console.warn(
                "Não foi possível localizar os dados anteriores da produção."
            );

            return;

        }

        const horasAnteriores =
            numeroPositivo(
                produtoAnterior.horasDecimais
            );

        const impressoraAnteriorId =
            String(
                produtoAnterior.impressoraId ||
                ""
            );

        const impressoraNovaId =
            String(
                produto.impressoraId ||
                ""
            );

        // ==============================================
        // MESMA IMPRESSORA
        // ==============================================

        if (
            impressoraAnteriorId ===
            impressoraNovaId
        ) {

            const diferencaHoras =
                horasNovas -
                horasAnteriores;

            if (diferencaHoras > 0) {

                adicionarHorasProducao(
                    produto.impressoraId,
                    diferencaHoras,
                    produto
                );

            } else if (
                diferencaHoras < 0
            ) {

                removerHorasProducao(
                    produto.impressoraId,
                    Math.abs(
                        diferencaHoras
                    ),
                    produto
                );

            }

            return;

        }

        // ==============================================
        // TROCOU DE IMPRESSORA
        // ==============================================

        if (
            impressoraAnteriorId &&
            horasAnteriores > 0
        ) {

            removerHorasProducao(
                produtoAnterior.impressoraId,
                horasAnteriores,
                produtoAnterior
            );

        }

        if (
            impressoraNovaId &&
            horasNovas > 0
        ) {

            adicionarHorasProducao(
                produto.impressoraId,
                horasNovas,
                produto
            );

        }

    }
   
    // ==================================================
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
        if (campoNomeProduto) {
            campoNomeProduto.value = "";
        }

       if (campoCategoriaProduto) {
    campoCategoriaProduto.value = "";
}

if (campoTipoProducao) {
    campoTipoProducao.value =
        "Estoque";
}

if (campoEstoqueMinimoProduto) {
    campoEstoqueMinimoProduto.disabled =
        false;
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
    // MOSTRAR PRODUTOS - FORMATO HORIZONTAL COMPACTO
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


        const produtosAtivos =
            produtos.filter(
                function (produto) {

                    return (
                        produto.status !==
                        "Inativo"
                    );

                }
            );


        if (produtosAtivos.length === 0) {

            listaProdutos.innerHTML =
                "<p>Nenhum produto ativo cadastrado.</p>";

            atualizarResumoProdutos();

            return;
        }


        const produtosOrdenados =
            [...produtosAtivos].sort(
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

                        return dataB.localeCompare(
                            dataA
                        );

                    }

                    return (
                        numero(b.id) -
                        numero(a.id)
                    );

                }
            );


        const linhasProdutos =
            produtosOrdenados
                .map(
                    function (produto) {

                        const status =
                            obterStatusProduto(
                                produto
                            );


                        const classeStatus =
                            status === "Disponível"
                                ? "produto-status-disponivel"
                                : (
                                    status === "Estoque baixo"
                                        ? "produto-status-baixo"
                                        : "produto-status-indisponivel"
                                );


                        return `

                            <div class="produto-tabela-linha">

                                <div
                                    class="produto-coluna produto-coluna-nome"
                                    data-titulo="Produto">

                                    ${textoSeguro(
                                        produto.nome ||
                                        "Produto sem nome"
                                    )}

                                </div>


                                <div
                                    class="produto-coluna"
                                    data-titulo="Categoria">

                                    ${textoSeguro(
                                        produto.categoria ||
                                        "Não informada"
                                    )}

                                </div>


                                <div
                                    class="produto-coluna"
                                    data-titulo="Tipo">

                                    ${textoSeguro(
                                        produto.tipoProducao ||
                                        "Estoque"
                                    )}

                                </div>


                                <div
                                    class="produto-coluna"
                                    data-titulo="Produzido">

                                    ${numeroFormatado(
                                        produto.quantidadeProduzida,
                                        0
                                    )}

                                </div>


                                <div
                                    class="produto-coluna"
                                    data-titulo="Disponível">

                                    ${numeroFormatado(
                                        produto.quantidadeDisponivel,
                                        0
                                    )}

                                </div>


                                <div
                                    class="produto-coluna"
                                    data-titulo="Custo unit.">

                                    ${dinheiro(
                                        produto.custoUnitario
                                    )}

                                </div>


                                <div
                                    class="produto-coluna produto-coluna-preco"
                                    data-titulo="Preço venda">

                                    ${dinheiro(
                                        produto.precoVenda
                                    )}

                                </div>


                                <div
                                    class="produto-coluna"
                                    data-titulo="Margem">

                                    ${numeroFormatado(
                                        produto.margemReal,
                                        2
                                    )}%

                                </div>


                                <div
                                    class="produto-coluna"
                                    data-titulo="Data">

                                    ${dataFormatada(
                                        produto.dataProducao
                                    )}

                                </div>


                                <div
                                    class="produto-coluna ${classeStatus}"
                                    data-titulo="Status">

                                    ${textoSeguro(
                                        status
                                    )}

                                </div>


                                <div
                                    class="produto-coluna produto-coluna-acoes"
                                    data-titulo="Ações">

                                    <button
                                        type="button"
                                        class="botao-principal botao-editar-produto"
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


        listaProdutos.innerHTML = `

            <div class="produtos-tabela">

                <div class="produto-tabela-cabecalho">

                    <div>Produto</div>
                    <div>Categoria</div>
                    <div>Tipo</div>
                    <div>Produzido</div>
                    <div>Disponível</div>
                    <div>Custo unit.</div>
                    <div>Preço venda</div>
                    <div>Margem</div>
                    <div>Data</div>
                    <div>Status</div>
                    <div>Ações</div>

                </div>

                ${linhasProdutos}

            </div>

        `;


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

        if (campoNomeProduto) {

            campoNomeProduto.value =
                produto.nome || "";

        }

        if (campoCategoriaProduto) {

    campoCategoriaProduto.value =
        produto.categoria || "";

}

if (campoTipoProducao) {

    campoTipoProducao.value =
        produto.tipoProducao ||
        "Estoque";

}

if (campoEstoqueMinimoProduto) {

    const encomenda =
        (
            produto.tipoProducao ||
            "Estoque"
        ) === "Encomenda";

    campoEstoqueMinimoProduto.disabled =
        encomenda;

    if (encomenda) {
        campoEstoqueMinimoProduto.value =
            "";
    }

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
// DEVOLVER INSUMOS DA PRODUÇÃO
// ==================================================

function devolverInsumosProduto(produto) {

    if (!produto) {
        return;
    }

    // ------------------------------
    // FILAMENTOS
    // ------------------------------

    if (Array.isArray(produto.filamentos)) {

        produto.filamentos.forEach(function (consumo) {

            const filamento =
                encontrarFilamento(
                    consumo.filamentoId
                );

            if (!filamento) {
                return;
            }

            filamento.pesoRestante =
                numero(
                    filamento.pesoRestante
                ) +
                numero(
                    consumo.quantidade
                );

            const pesoInicial =
                numero(
                    filamento.pesoInicial
                );

            if (
                filamento.pesoRestante >
                pesoInicial
            ) {

                filamento.pesoRestante =
                    pesoInicial;

            }

            atualizarStatusFilamento(
                filamento
            );

        });

    }

    // ------------------------------
    // ACESSÓRIOS
    // ------------------------------

    if (Array.isArray(produto.acessorios)) {

        produto.acessorios.forEach(function (consumo) {

            const acessorio =
                encontrarAcessorio(
                    consumo.acessorioId
                );

            if (!acessorio) {
                return;
            }

            acessorio.quantidade =
                numero(
                    acessorio.quantidade
                ) +
                numero(
                    consumo.quantidade
                );

            acessorio.estoque =
                acessorio.quantidade;

        });

    }

    // ------------------------------
    // EMBALAGENS
    // ------------------------------

    if (Array.isArray(produto.embalagens)) {

        produto.embalagens.forEach(function (consumo) {

            const embalagem =
                encontrarEmbalagem(
                    consumo.embalagemId
                );

            if (!embalagem) {
                return;
            }

            embalagem.quantidade =
                numero(
                    embalagem.quantidade
                ) +
                numero(
                    consumo.quantidade
                );

            embalagem.estoque =
                embalagem.quantidade;

        });

    }

    salvarFilamentos();

    salvarAcessorios();

    salvarEmbalagens();

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
                "Este produto já possui movimentações de saída e não pode ser excluído."
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
        "Os filamentos, acessórios e embalagens consumidos serão devolvidos ao estoque.\n\n" +
        "Esta operação só é permitida porque este produto não possui movimentações de saída."
    );
        if (!confirmar) {
    return;
}

removerHorasProducao(
    produto.impressoraId,
    produto.horasDecimais,
    produto
);

devolverInsumosProduto(
    produto
);

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

    const listaOrdenada =
        [...perdas].sort(
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

    listaPerdas.innerHTML = `
        <table class="tabela tabela-perdas">

            <thead>

                <tr>

                    <th>Produto</th>

                    <th>Data</th>

                    <th>Qtd. falha</th>

                    <th>Tipo de falha</th>

                    <th>Reaprov.</th>

                    <th>Qtd. reaprov.</th>

                    <th>Custo</th>

                    <th>Destino</th>

                    <th>Descrição</th>

                    <th>Observações</th>

                </tr>

            </thead>

            <tbody>

                ${listaOrdenada
                    .map(
                        function (perda) {

                            return `
                                <tr>

                                    <td>
                                        ${textoSeguro(
                                            perda.produtoNome ||
                                            "Produto não informado"
                                        )}
                                    </td>

                                    <td>
                                        ${dataFormatada(
                                            perda.data
                                        )}
                                    </td>

                                    <td>
                                        ${numeroFormatado(
                                            perda.quantidade,
                                            0
                                        )}
                                    </td>

                                    <td>
                                        ${textoSeguro(
                                            perda.tipo ||
                                            "Não informado"
                                        )}
                                    </td>

                                    <td>
                                        ${textoSeguro(
                                            perda.reaproveitavel ||
                                            "Não"
                                        )}
                                    </td>

                                    <td>
                                        ${numeroFormatado(
                                            perda.quantidadeReaproveitavel,
                                            0
                                        )}
                                    </td>

                                    <td>
                                        ${dinheiro(
                                            perda.custoTotal
                                        )}
                                    </td>

                                    <td>
                                        ${textoSeguro(
                                            perda.destino ||
                                            "Não informado"
                                        )}
                                    </td>

                                    <td>
                                        ${textoSeguro(
                                            perda.motivo ||
                                            "-"
                                        )}
                                    </td>

                                    <td>
                                        ${textoSeguro(
                                            perda.observacoes ||
                                            "-"
                                        )}
                                    </td>

                                </tr>
                            `;

                        }
                    )
                    .join("")}

            </tbody>

        </table>
    `;

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

    const listaOrdenada =
        [...consumosProprios].sort(
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

    listaConsumoProprio.innerHTML = `
        <table class="tabela tabela-consumo-proprio">

            <thead>

                <tr>

                    <th>Produto</th>

                    <th>Data</th>

                    <th>Qtd.</th>

                    <th>Finalidade</th>

                    <th>Local</th>

                    <th>Responsável</th>

                    <th>Custo unit.</th>

                    <th>Custo total</th>

                    <th>Descrição</th>

                    <th>Status</th>

                </tr>

            </thead>

            <tbody>

                ${listaOrdenada
                    .map(
                        function (consumo) {

                            return `
                                <tr>

                                    <td>
                                        ${textoSeguro(
                                            consumo.produtoNome ||
                                            "Produto não informado"
                                        )}
                                    </td>

                                    <td>
                                        ${dataFormatada(
                                            consumo.data
                                        )}
                                    </td>

                                    <td>
                                        ${numeroFormatado(
                                            consumo.quantidade,
                                            0
                                        )}
                                    </td>

                                    <td>
                                        ${textoSeguro(
                                            consumo.finalidade ||
                                            "-"
                                        )}
                                    </td>

                                    <td>
                                        ${textoSeguro(
                                            consumo.local ||
                                            "-"
                                        )}
                                    </td>

                                    <td>
                                        ${textoSeguro(
                                            consumo.responsavel ||
                                            "-"
                                        )}
                                    </td>

                                    <td>
                                        ${dinheiro(
                                            consumo.custoUnitario
                                        )}
                                    </td>

                                    <td>
                                        ${dinheiro(
                                            consumo.custoTotal
                                        )}
                                    </td>

                                    <td>
                                        ${textoSeguro(
                                            consumo.descricao ||
                                            "-"
                                        )}
                                    </td>

                                    <td>
                                        ${textoSeguro(
                                            consumo.status ||
                                            "Em uso"
                                        )}
                                    </td>

                                </tr>
                            `;

                        }
                    )
                    .join("")}

            </tbody>

        </table>
    `;

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
// RECUPERAR HORAS DAS PRODUÇÕES ANTIGAS
// ==================================================

function recuperarHorasProdutosExistentes() {

    const totaisPorImpressora = {};

    // ----------------------------------------------
    // SOMAR HORAS DE TODOS OS PRODUTOS EXISTENTES
    // ----------------------------------------------

    produtos.forEach(
        function (produto) {

            if (!produto) {
                return;
            }

            const impressoraId =
                String(
                    produto.impressoraId ||
                    ""
                );

            const horas =
                numeroPositivo(
                    produto.horasDecimais
                );

            if (
                !impressoraId ||
                horas <= 0
            ) {
                return;
            }

            if (
                !totaisPorImpressora[
                    impressoraId
                ]
            ) {

                totaisPorImpressora[
                    impressoraId
                ] = 0;

            }

            totaisPorImpressora[
                impressoraId
            ] += horas;

        }
    );

    // ----------------------------------------------
    // CORRIGIR CADA IMPRESSORA
    // ----------------------------------------------

    impressoras.forEach(
        function (impressora) {

            const id =
                String(
                    impressora.id
                );

            const totalCorreto =
                numeroPositivo(
                    totaisPorImpressora[id]
                );

            impressora.horasProducoes =
                totalCorreto;

            impressora.totalHoras =
                numeroPositivo(
                    impressora.horasIniciais
                ) +
                numeroPositivo(
                    impressora.horasProducoes
                ) +
                numeroPositivo(
                    impressora.horasAjustes
                );

        }
    );

    salvarImpressoras();

    console.log(
        "Horas das produções recuperadas com sucesso.",
        totaisPorImpressora
    );

    return totaisPorImpressora;

}

// Disponibilizar somente para a recuperação
window.recuperarHorasProdutosExistentes =
    recuperarHorasProdutosExistentes;
    
    // ==================================================
    // PARTE 12
    // INICIALIZAÇÃO FINAL DO MÓDULO
    // ==================================================

    function atualizarModuloProduto() {

        produtos =
            lerLista(
                CHAVE_PRODUTOS
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

        mostrarPerdas();

        atualizarResumoPerdas();

        mostrarConsumosProprios();

        atualizarResumoConsumoProprio();

        preencherSelectLotesPerda();

        preencherSelectLotesConsumoProprio();

        atualizarCalculosProduto();

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