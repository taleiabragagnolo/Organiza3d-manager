// ======================================================
// MÓDULO PRODUTOS
// produto.js
// ======================================================

"use strict";

function iniciarProduto() {

    // ==================================================
    // ELEMENTOS DAS ABAS
    // ==================================================

    const botoesAbasProduto =
        document.querySelectorAll(
            ".aba-produto"
        );

    const conteudosAbasProduto =
        document.querySelectorAll(
            ".conteudo-aba-produto"
        );

    // ==================================================
    // ABRIR ABA
    // ==================================================

    function abrirAbaProduto(idAba) {

        conteudosAbasProduto.forEach(
            function (conteudo) {

                const estaAtiva =
                    conteudo.id === idAba;

                conteudo.hidden =
                    !estaAtiva;

                conteudo.classList.toggle(
                    "ativo",
                    estaAtiva
                );

            }
        );

        botoesAbasProduto.forEach(
            function (botao) {

                const estaAtivo =
                    botao.dataset.abaProduto ===
                    idAba;

                botao.classList.toggle(
                    "botao-principal",
                    estaAtivo
                );

            }
        );

    }

    // ==================================================
    // EVENTOS DAS ABAS
    // ==================================================

    botoesAbasProduto.forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    abrirAbaProduto(
                        botao.dataset.abaProduto
                    );

                }
            );

        }
    );

    // ==================================================
    // FUNÇÕES AUXILIARES
    // ==================================================

    function lerListaLocalStorage(chave) {

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
                `Não foi possível carregar ${chave}.`,
                erro
            );

            return [];

        }

    }

    function salvarListaLocalStorage(
        chave,
        lista
    ) {

        localStorage.setItem(
            chave,
            JSON.stringify(lista)
        );

    }

    function converterNumero(valor) {

        const numero =
            Number(valor);

        return Number.isFinite(numero)
            ? numero
            : 0;

    }

    function limitarNumero(
        valor,
        minimo,
        maximo
    ) {

        let numero =
            converterNumero(valor);

        if (
            minimo !== undefined &&
            numero < minimo
        ) {
            numero = minimo;
        }

        if (
            maximo !== undefined &&
            numero > maximo
        ) {
            numero = maximo;
        }

        return numero;

    }

    function formatarDinheiroProduto(valor) {

        return converterNumero(valor)
            .toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

    }

    function formatarNumeroProduto(
        valor,
        casasDecimais
    ) {

        return converterNumero(valor)
            .toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits:
                        casasDecimais || 0,

                    maximumFractionDigits:
                        casasDecimais || 0
                }
            );

    }

    function formatarDataProduto(data) {

        if (!data) {
            return "Não informada";
        }

        const partes =
            data.split("-");

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

    function obterDataHojeProduto() {

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

    function criarIdProduto() {

        return (
            Date.now() +
            Math.floor(
                Math.random() * 1000
            )
        );

    }

    // ==================================================
    // ABRIR ABA INICIAL
    // ==================================================

    abrirAbaProduto(
        "aba-produtos-produzidos"
    );

    // As próximas partes serão inseridas aqui,
    // antes da chave final da função.


    // ==================================================
    // CHAVES DO LOCALSTORAGE
    // ==================================================

    const CHAVE_PRODUTOS_PRODUZIDOS =
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
    // LISTAS PRINCIPAIS
    // ==================================================

    let produtosProduzidos =
        lerListaLocalStorage(
            CHAVE_PRODUTOS_PRODUZIDOS
        );

    let orcamentos =
        lerListaLocalStorage(
            CHAVE_ORCAMENTOS
        );

    let perdasProdutos =
        lerListaLocalStorage(
            CHAVE_PERDAS
        );

    let consumosProprios =
        lerListaLocalStorage(
            CHAVE_CONSUMO_PROPRIO
        );

    let movimentacoesProdutos =
        lerListaLocalStorage(
            CHAVE_MOVIMENTACOES
        );

    // ==================================================
    // INSUMOS E DADOS DE APOIO
    // ==================================================

    let filamentosDisponiveis =
        lerListaLocalStorage(
            CHAVE_FILAMENTOS
        );

    let acessoriosDisponiveis =
        lerListaLocalStorage(
            CHAVE_ACESSORIOS
        );

    let embalagensDisponiveis =
        lerListaLocalStorage(
            CHAVE_EMBALAGENS
        );

    let impressorasDisponiveis =
        lerListaLocalStorage(
            CHAVE_IMPRESSORAS
        );

    let clientesDisponiveis =
        lerListaLocalStorage(
            CHAVE_CLIENTES
        );

    // ==================================================
    // CONTROLE DE EDIÇÃO
    // ==================================================

    let produtoProduzidoEmEdicaoId =
        null;

    let orcamentoEmEdicaoId =
        null;

    let perdaEmEdicaoId =
        null;

    let consumoProprioEmEdicaoId =
        null;

    // ==================================================
    // SALVAMENTO DAS LISTAS
    // ==================================================

    function salvarProdutosProduzidos() {

        salvarListaLocalStorage(
            CHAVE_PRODUTOS_PRODUZIDOS,
            produtosProduzidos
        );

    }

    function salvarOrcamentos() {

        salvarListaLocalStorage(
            CHAVE_ORCAMENTOS,
            orcamentos
        );

    }

    function salvarPerdasProdutos() {

        salvarListaLocalStorage(
            CHAVE_PERDAS,
            perdasProdutos
        );

    }

    function salvarConsumosProprios() {

        salvarListaLocalStorage(
            CHAVE_CONSUMO_PROPRIO,
            consumosProprios
        );

    }

    function salvarMovimentacoesProdutos() {

        salvarListaLocalStorage(
            CHAVE_MOVIMENTACOES,
            movimentacoesProdutos
        );

    }

    function salvarFilamentosDisponiveis() {

        salvarListaLocalStorage(
            CHAVE_FILAMENTOS,
            filamentosDisponiveis
        );

    }

    function salvarAcessoriosDisponiveis() {

        salvarListaLocalStorage(
            CHAVE_ACESSORIOS,
            acessoriosDisponiveis
        );

    }

    function salvarEmbalagensDisponiveis() {

        salvarListaLocalStorage(
            CHAVE_EMBALAGENS,
            embalagensDisponiveis
        );

    }

    function salvarImpressorasDisponiveis() {

        salvarListaLocalStorage(
            CHAVE_IMPRESSORAS,
            impressorasDisponiveis
        );

    }

    // ==================================================
    // ATUALIZAR DADOS DE APOIO
    // ==================================================

    function recarregarDadosDeApoio() {

        filamentosDisponiveis =
            lerListaLocalStorage(
                CHAVE_FILAMENTOS
            );

        acessoriosDisponiveis =
            lerListaLocalStorage(
                CHAVE_ACESSORIOS
            );

        embalagensDisponiveis =
            lerListaLocalStorage(
                CHAVE_EMBALAGENS
            );

        impressorasDisponiveis =
            lerListaLocalStorage(
                CHAVE_IMPRESSORAS
            );

        clientesDisponiveis =
            lerListaLocalStorage(
                CHAVE_CLIENTES
            );

    }
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
    // CRIAR TEXTO DO FILAMENTO
    // ==================================================

    function obterTextoFilamento(
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

        const pesoRestante =
            converterNumero(
                filamento.pesoRestante
            );

        return (
            fabricante +
            " — " +
            material +
            " — " +
            cor +
            " — lote " +
            lote +
            " — " +
            formatarNumeroProduto(
                pesoRestante,
                1
            ) +
            " g disponíveis"
        );

    }

    // ==================================================
    // CRIAR TEXTO DO ACESSÓRIO
    // ==================================================

    function obterTextoAcessorio(
        acessorio
    ) {

        const nome =
            acessorio.nome ||
            "Acessório sem nome";

        const quantidade =
            converterNumero(
                acessorio.quantidade
            );

        return (
            nome +
            " — " +
            formatarNumeroProduto(
                quantidade,
                0
            ) +
            " disponíveis"
        );

    }

    // ==================================================
    // CRIAR TEXTO DA EMBALAGEM
    // ==================================================

    function obterTextoEmbalagem(
        embalagem
    ) {

        const nome =
            embalagem.nome ||
            "Embalagem sem nome";

        const quantidade =
            converterNumero(
                embalagem.quantidade
            );

        return (
            nome +
            " — " +
            formatarNumeroProduto(
                quantidade,
                0
            ) +
            " disponíveis"
        );

    }

    // ==================================================
    // CRIAR TEXTO DA IMPRESSORA
    // ==================================================

    function obterTextoImpressora(
        impressora
    ) {

        const nome =
            impressora.nome ||
            impressora.apelido ||
            "Impressora sem nome";

        const marca =
            impressora.marca ||
            "";

        const modelo =
            impressora.modelo ||
            "";

        let texto = nome;

        if (marca) {
            texto += " — " + marca;
        }

        if (modelo) {
            texto += " " + modelo;
        }

        return texto;

    }

    // ==================================================
    // PREENCHER SELECT DE FILAMENTOS
    // ==================================================

    function preencherSelectFilamentos(
        select,
        valorSelecionado
    ) {

        if (!select) {
            return;
        }

        select.innerHTML =
            '<option value="">' +
            "Selecione o filamento" +
            "</option>";

        filamentosDisponiveis.forEach(
            function (filamento) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    String(filamento.id);

                option.textContent =
                    obterTextoFilamento(
                        filamento
                    );

                if (
                    String(valorSelecionado) ===
                    String(filamento.id)
                ) {
                    option.selected = true;
                }

                select.appendChild(option);

            }
        );

    }

    // ==================================================
    // PREENCHER SELECT DE ACESSÓRIOS
    // ==================================================

    function preencherSelectAcessorios(
        select,
        valorSelecionado
    ) {

        if (!select) {
            return;
        }

        select.innerHTML =
            '<option value="">' +
            "Selecione o acessório" +
            "</option>";

        acessoriosDisponiveis.forEach(
            function (acessorio) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    String(acessorio.id);

                option.textContent =
                    obterTextoAcessorio(
                        acessorio
                    );

                if (
                    String(valorSelecionado) ===
                    String(acessorio.id)
                ) {
                    option.selected = true;
                }

                select.appendChild(option);

            }
        );

    }

    // ==================================================
    // PREENCHER SELECT DE EMBALAGENS
    // ==================================================

    function preencherSelectEmbalagens(
        select,
        valorSelecionado
    ) {

        if (!select) {
            return;
        }

        select.innerHTML =
            '<option value="">' +
            "Selecione a embalagem" +
            "</option>";

        embalagensDisponiveis.forEach(
            function (embalagem) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    String(embalagem.id);

                option.textContent =
                    obterTextoEmbalagem(
                        embalagem
                    );

                if (
                    String(valorSelecionado) ===
                    String(embalagem.id)
                ) {
                    option.selected = true;
                }

                select.appendChild(option);

            }
        );

    }

    // ==================================================
    // PREENCHER SELECT DE IMPRESSORAS
    // ==================================================

    function preencherSelectImpressoras(
        select,
        valorSelecionado
    ) {

        if (!select) {
            return;
        }

        select.innerHTML =
            '<option value="">' +
            "Selecione a impressora" +
            "</option>";

        impressorasDisponiveis.forEach(
            function (impressora) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    String(impressora.id);

                option.textContent =
                    obterTextoImpressora(
                        impressora
                    );

                if (
                    String(valorSelecionado) ===
                    String(impressora.id)
                ) {
                    option.selected = true;
                }

                select.appendChild(option);

            }
        );

    }

    // ==================================================
    // PREENCHER SELECT DE CLIENTES
    // ==================================================

    function preencherSelectClientes(
        select,
        valorSelecionado
    ) {

        if (!select) {
            return;
        }

        select.innerHTML =
            '<option value="">' +
            "Cliente não informado" +
            "</option>";

        clientesDisponiveis.forEach(
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

                if (
                    String(valorSelecionado) ===
                    String(cliente.id)
                ) {
                    option.selected = true;
                }

                select.appendChild(option);

            }
        );

    }

    // ==================================================
    // ATUALIZAR TODOS OS SELECTS EXISTENTES
    // ==================================================

    function atualizarSelectsProduto() {

        recarregarDadosDeApoio();

        document
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

        document
            .querySelectorAll(
                ".produto-acessorio-select"
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

        document
            .querySelectorAll(
                ".produto-embalagem-select"
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

        document
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

        document
            .querySelectorAll(
                ".orcamento-acessorio-select"
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

        document
            .querySelectorAll(
                ".orcamento-embalagem-select"
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

    }

    // ==================================================
    // PRIMEIRO CARREGAMENTO DOS SELECTS
    // ==================================================

    atualizarSelectsProduto();
        // ==================================================
    // FILAMENTOS — FUNÇÕES AUXILIARES
    // ==================================================

    function encontrarFilamentoPorId(id) {

        return filamentosDisponiveis.find(
            function (filamento) {

                return String(filamento.id) ===
                    String(id);

            }
        );

    }

    function calcularCustoPorGramaFilamento(
        filamento
    ) {

        if (!filamento) {
            return 0;
        }

        const pesoInicial =
            converterNumero(
                filamento.pesoInicial
            );

        const valor =
            converterNumero(
                filamento.valor
            );

        if (pesoInicial <= 0) {
            return 0;
        }

        return valor / pesoInicial;

    }

    // ==================================================
    // CRIAR LINHA DE FILAMENTO — PRODUÇÃO
    // ==================================================

    function criarLinhaFilamentoProduto(
        dados
    ) {

        const linha =
            document.createElement("div");

        linha.className =
            "linha item-filamento-produto";

        linha.setAttribute(
            "data-item-filamento",
            ""
        );

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
            dados ? dados.filamentoId : ""
        );

        if (dados) {

            campoQuantidade.value =
                dados.quantidade || "";

        }

        select.addEventListener(
            "change",
            function () {

                atualizarCalculosProduto();

            }
        );

        campoQuantidade.addEventListener(
            "input",
            function () {

                atualizarCalculosProduto();

            }
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

    // ==================================================
    // GARANTIR LINHA DE FILAMENTO — PRODUÇÃO
    // ==================================================

    function garantirLinhaFilamentoProduto() {

        if (!listaFilamentosProduto) {
            return;
        }

        const linhas =
            listaFilamentosProduto
                .querySelectorAll(
                    ".item-filamento-produto"
                );

        if (linhas.length === 0) {

            listaFilamentosProduto.appendChild(
                criarLinhaFilamentoProduto()
            );

        }

    }

    // ==================================================
    // ADICIONAR FILAMENTO — PRODUÇÃO
    // ==================================================

    function adicionarLinhaFilamentoProduto(
        dados
    ) {

        if (!listaFilamentosProduto) {
            return;
        }

        listaFilamentosProduto.appendChild(
            criarLinhaFilamentoProduto(
                dados
            )
        );

        atualizarCalculosProduto();

    }

    // ==================================================
    // LER FILAMENTOS DA PRODUÇÃO
    // ==================================================

    function obterFilamentosSelecionadosProduto() {

        if (!listaFilamentosProduto) {
            return [];
        }

        const resultado = [];

        listaFilamentosProduto
            .querySelectorAll(
                ".item-filamento-produto"
            )
            .forEach(
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
                            ? converterNumero(
                                campoQuantidade.value
                            )
                            : 0;

                    const filamento =
                        encontrarFilamentoPorId(
                            filamentoId
                        );

                    const custoPorGrama =
                        calcularCustoPorGramaFilamento(
                            filamento
                        );

                    const custoTotal =
                        quantidade *
                        custoPorGrama;

                    if (campoCusto) {

                        campoCusto.value =
                            formatarDinheiroProduto(
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
                                custoPorGrama,

                            custoTotal:
                                custoTotal

                        });

                    }

                }
            );

        return resultado;

    }

    // ==================================================
    // CRIAR LINHA DE FILAMENTO — ORÇAMENTO
    // ==================================================

    function criarLinhaFilamentoOrcamento(
        dados
    ) {

        const linha =
            document.createElement("div");

        linha.className =
            "linha item-filamento-orcamento";

        linha.setAttribute(
            "data-item-filamento-orcamento",
            ""
        );

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
            dados ? dados.filamentoId : ""
        );

        if (dados) {

            campoQuantidade.value =
                dados.quantidade || "";

        }

        select.addEventListener(
            "change",
            function () {

                atualizarCalculosOrcamento();

            }
        );

        campoQuantidade.addEventListener(
            "input",
            function () {

                atualizarCalculosOrcamento();

            }
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

    // ==================================================
    // GARANTIR LINHA DE FILAMENTO — ORÇAMENTO
    // ==================================================

    function garantirLinhaFilamentoOrcamento() {

        if (!listaFilamentosOrcamento) {
            return;
        }

        const linhas =
            listaFilamentosOrcamento
                .querySelectorAll(
                    ".item-filamento-orcamento"
                );

        if (linhas.length === 0) {

            listaFilamentosOrcamento.appendChild(
                criarLinhaFilamentoOrcamento()
            );

        }

    }

    // ==================================================
    // ADICIONAR FILAMENTO — ORÇAMENTO
    // ==================================================

    function adicionarLinhaFilamentoOrcamento(
        dados
    ) {

        if (!listaFilamentosOrcamento) {
            return;
        }

        listaFilamentosOrcamento.appendChild(
            criarLinhaFilamentoOrcamento(
                dados
            )
        );

        atualizarCalculosOrcamento();

    }

    // ==================================================
    // LER FILAMENTOS DO ORÇAMENTO
    // ==================================================

    function obterFilamentosSelecionadosOrcamento() {

        if (!listaFilamentosOrcamento) {
            return [];
        }

        const resultado = [];

        listaFilamentosOrcamento
            .querySelectorAll(
                ".item-filamento-orcamento"
            )
            .forEach(
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
                            ? converterNumero(
                                campoQuantidade.value
                            )
                            : 0;

                    const filamento =
                        encontrarFilamentoPorId(
                            filamentoId
                        );

                    const custoPorGrama =
                        calcularCustoPorGramaFilamento(
                            filamento
                        );

                    const custoTotal =
                        quantidade *
                        custoPorGrama;

                    if (campoCusto) {

                        campoCusto.value =
                            formatarDinheiroProduto(
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
                                custoPorGrama,

                            custoTotal:
                                custoTotal

                        });

                    }

                }
            );

        return resultado;

    }

    // ==================================================
    // EVENTOS DOS BOTÕES DE FILAMENTOS
    // ==================================================

    if (botaoAdicionarFilamentoProduto) {

        botaoAdicionarFilamentoProduto
            .addEventListener(
                "click",
                function () {

                    adicionarLinhaFilamentoProduto();

                }
            );

    }

    if (botaoAdicionarFilamentoOrcamento) {

        botaoAdicionarFilamentoOrcamento
            .addEventListener(
                "click",
                function () {

                    adicionarLinhaFilamentoOrcamento();

                }
            );

    }

    // ==================================================
    // LIGAR AS LINHAS INICIAIS DO HTML
    // ==================================================

    function substituirLinhasIniciaisFilamentos() {

        if (listaFilamentosProduto) {

            listaFilamentosProduto.innerHTML =
                "";

            adicionarLinhaFilamentoProduto();

        }

        if (listaFilamentosOrcamento) {

            listaFilamentosOrcamento.innerHTML =
                "";

            adicionarLinhaFilamentoOrcamento();

        }

    }

    substituirLinhasIniciaisFilamentos();
        // ==================================================
    // ACESSÓRIOS — FUNÇÕES AUXILIARES
    // ==================================================

    function encontrarAcessorioPorId(id) {

        return acessoriosDisponiveis.find(
            function (acessorio) {

                return String(acessorio.id) ===
                    String(id);

            }
        );

    }

    // ==================================================
    // CRIAR LINHA DE ACESSÓRIO — PRODUÇÃO
    // ==================================================

    function criarLinhaAcessorioProduto(
        dados
    ) {

        const linha =
            document.createElement("div");

        linha.className =
            "linha item-acessorio-produto";

        linha.setAttribute(
            "data-item-acessorio",
            ""
        );

        linha.innerHTML = `
            <div class="campo">

                <label>
                    Acessório
                </label>

                <select
                    class="produto-acessorio-select">

                    <option value="">
                        Selecione o acessório
                    </option>

                </select>

            </div>

            <div class="campo">

                <label>
                    Quantidade utilizada
                </label>

                <input
                    type="number"
                    class="produto-acessorio-quantidade"
                    min="1"
                    step="1"
                    placeholder="Ex.: 10">

            </div>

            <div class="campo">

                <label>
                    Custo desta linha
                </label>

                <input
                    type="text"
                    class="produto-acessorio-custo"
                    value="R$ 0,00"
                    readonly>

            </div>

            <div class="campo">

                <label>
                    Ação
                </label>

                <button
                    type="button"
                    class="botao-excluir remover-acessorio-produto">
                    Remover
                </button>

            </div>
        `;

        const select =
            linha.querySelector(
                ".produto-acessorio-select"
            );

        const campoQuantidade =
            linha.querySelector(
                ".produto-acessorio-quantidade"
            );

        const botaoRemover =
            linha.querySelector(
                ".remover-acessorio-produto"
            );

        preencherSelectAcessorios(
            select,
            dados ? dados.acessorioId : ""
        );

        if (dados) {

            campoQuantidade.value =
                dados.quantidade || "";

        }

        select.addEventListener(
            "change",
            function () {

                atualizarCalculosProduto();

            }
        );

        campoQuantidade.addEventListener(
            "input",
            function () {

                atualizarCalculosProduto();

            }
        );

        botaoRemover.addEventListener(
            "click",
            function () {

                linha.remove();

                garantirLinhaAcessorioProduto();

                atualizarCalculosProduto();

            }
        );

        return linha;

    }

    // ==================================================
    // GARANTIR LINHA DE ACESSÓRIO — PRODUÇÃO
    // ==================================================

    function garantirLinhaAcessorioProduto() {

        if (!listaAcessoriosProduto) {
            return;
        }

        const linhas =
            listaAcessoriosProduto
                .querySelectorAll(
                    ".item-acessorio-produto"
                );

        if (linhas.length === 0) {

            listaAcessoriosProduto.appendChild(
                criarLinhaAcessorioProduto()
            );

        }

    }

    // ==================================================
    // ADICIONAR ACESSÓRIO — PRODUÇÃO
    // ==================================================

    function adicionarLinhaAcessorioProduto(
        dados
    ) {

        if (!listaAcessoriosProduto) {
            return;
        }

        listaAcessoriosProduto.appendChild(
            criarLinhaAcessorioProduto(
                dados
            )
        );

        atualizarCalculosProduto();

    }

    // ==================================================
    // LER ACESSÓRIOS DA PRODUÇÃO
    // ==================================================

    function obterAcessoriosSelecionadosProduto() {

        if (!listaAcessoriosProduto) {
            return [];
        }

        const resultado = [];

        listaAcessoriosProduto
            .querySelectorAll(
                ".item-acessorio-produto"
            )
            .forEach(
                function (linha) {

                    const select =
                        linha.querySelector(
                            ".produto-acessorio-select"
                        );

                    const campoQuantidade =
                        linha.querySelector(
                            ".produto-acessorio-quantidade"
                        );

                    const campoCusto =
                        linha.querySelector(
                            ".produto-acessorio-custo"
                        );

                    const acessorioId =
                        select
                            ? select.value
                            : "";

                    const quantidade =
                        campoQuantidade
                            ? converterNumero(
                                campoQuantidade.value
                            )
                            : 0;

                    const acessorio =
                        encontrarAcessorioPorId(
                            acessorioId
                        );

                    const valorUnitario =
                        acessorio
                            ? converterNumero(
                                acessorio.valorUnitario
                            )
                            : 0;

                    const custoTotal =
                        quantidade *
                        valorUnitario;

                    if (campoCusto) {

                        campoCusto.value =
                            formatarDinheiroProduto(
                                custoTotal
                            );

                    }

                    if (
                        acessorio &&
                        quantidade > 0
                    ) {

                        resultado.push({

                            acessorioId:
                                acessorio.id,

                            nome:
                                acessorio.nome ||
                                "",

                            categoria:
                                acessorio.categoria ||
                                "",

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
    // CRIAR LINHA DE ACESSÓRIO — ORÇAMENTO
    // ==================================================

    function criarLinhaAcessorioOrcamento(
        dados
    ) {

        const linha =
            document.createElement("div");

        linha.className =
            "linha item-acessorio-orcamento";

        linha.setAttribute(
            "data-item-acessorio-orcamento",
            ""
        );

        linha.innerHTML = `
            <div class="campo">

                <label>
                    Acessório
                </label>

                <select
                    class="orcamento-acessorio-select">

                    <option value="">
                        Selecione o acessório
                    </option>

                </select>

            </div>

            <div class="campo">

                <label>
                    Quantidade estimada
                </label>

                <input
                    type="number"
                    class="orcamento-acessorio-quantidade"
                    min="1"
                    step="1"
                    placeholder="Ex.: 20">

            </div>

            <div class="campo">

                <label>
                    Custo estimado
                </label>

                <input
                    type="text"
                    class="orcamento-acessorio-custo"
                    value="R$ 0,00"
                    readonly>

            </div>

            <div class="campo">

                <label>
                    Ação
                </label>

                <button
                    type="button"
                    class="botao-excluir remover-acessorio-orcamento">
                    Remover
                </button>

            </div>
        `;

        const select =
            linha.querySelector(
                ".orcamento-acessorio-select"
            );

        const campoQuantidade =
            linha.querySelector(
                ".orcamento-acessorio-quantidade"
            );

        const botaoRemover =
            linha.querySelector(
                ".remover-acessorio-orcamento"
            );

        preencherSelectAcessorios(
            select,
            dados ? dados.acessorioId : ""
        );

        if (dados) {

            campoQuantidade.value =
                dados.quantidade || "";

        }

        select.addEventListener(
            "change",
            function () {

                atualizarCalculosOrcamento();

            }
        );

        campoQuantidade.addEventListener(
            "input",
            function () {

                atualizarCalculosOrcamento();

            }
        );

        botaoRemover.addEventListener(
            "click",
            function () {

                linha.remove();

                garantirLinhaAcessorioOrcamento();

                atualizarCalculosOrcamento();

            }
        );

        return linha;

    }

    // ==================================================
    // GARANTIR LINHA DE ACESSÓRIO — ORÇAMENTO
    // ==================================================

    function garantirLinhaAcessorioOrcamento() {

        if (!listaAcessoriosOrcamento) {
            return;
        }

        const linhas =
            listaAcessoriosOrcamento
                .querySelectorAll(
                    ".item-acessorio-orcamento"
                );

        if (linhas.length === 0) {

            listaAcessoriosOrcamento.appendChild(
                criarLinhaAcessorioOrcamento()
            );

        }

    }

    // ==================================================
    // ADICIONAR ACESSÓRIO — ORÇAMENTO
    // ==================================================

    function adicionarLinhaAcessorioOrcamento(
        dados
    ) {

        if (!listaAcessoriosOrcamento) {
            return;
        }

        listaAcessoriosOrcamento.appendChild(
            criarLinhaAcessorioOrcamento(
                dados
            )
        );

        atualizarCalculosOrcamento();

    }

    // ==================================================
    // LER ACESSÓRIOS DO ORÇAMENTO
    // ==================================================

    function obterAcessoriosSelecionadosOrcamento() {

        if (!listaAcessoriosOrcamento) {
            return [];
        }

        const resultado = [];

        listaAcessoriosOrcamento
            .querySelectorAll(
                ".item-acessorio-orcamento"
            )
            .forEach(
                function (linha) {

                    const select =
                        linha.querySelector(
                            ".orcamento-acessorio-select"
                        );

                    const campoQuantidade =
                        linha.querySelector(
                            ".orcamento-acessorio-quantidade"
                        );

                    const campoCusto =
                        linha.querySelector(
                            ".orcamento-acessorio-custo"
                        );

                    const acessorioId =
                        select
                            ? select.value
                            : "";

                    const quantidade =
                        campoQuantidade
                            ? converterNumero(
                                campoQuantidade.value
                            )
                            : 0;

                    const acessorio =
                        encontrarAcessorioPorId(
                            acessorioId
                        );

                    const valorUnitario =
                        acessorio
                            ? converterNumero(
                                acessorio.valorUnitario
                            )
                            : 0;

                    const custoTotal =
                        quantidade *
                        valorUnitario;

                    if (campoCusto) {

                        campoCusto.value =
                            formatarDinheiroProduto(
                                custoTotal
                            );

                    }

                    if (
                        acessorio &&
                        quantidade > 0
                    ) {

                        resultado.push({

                            acessorioId:
                                acessorio.id,

                            nome:
                                acessorio.nome ||
                                "",

                            categoria:
                                acessorio.categoria ||
                                "",

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
    // EVENTOS DOS BOTÕES DE ACESSÓRIOS
    // ==================================================

    if (botaoAdicionarAcessorioProduto) {

        botaoAdicionarAcessorioProduto
            .addEventListener(
                "click",
                function () {

                    adicionarLinhaAcessorioProduto();

                }
            );

    }

    if (botaoAdicionarAcessorioOrcamento) {

        botaoAdicionarAcessorioOrcamento
            .addEventListener(
                "click",
                function () {

                    adicionarLinhaAcessorioOrcamento();

                }
            );

    }

    // ==================================================
    // LIGAR AS LINHAS INICIAIS DO HTML
    // ==================================================

    function substituirLinhasIniciaisAcessorios() {

        if (listaAcessoriosProduto) {

            listaAcessoriosProduto.innerHTML =
                "";

            adicionarLinhaAcessorioProduto();

        }

        if (listaAcessoriosOrcamento) {

            listaAcessoriosOrcamento.innerHTML =
                "";

            adicionarLinhaAcessorioOrcamento();

        }

    }

    substituirLinhasIniciaisAcessorios();
        // ==================================================
    // EMBALAGENS — FUNÇÕES AUXILIARES
    // ==================================================

    function encontrarEmbalagemPorId(id) {

        return embalagensDisponiveis.find(
            function (embalagem) {

                return String(embalagem.id) ===
                    String(id);

            }
        );

    }

    // ==================================================
    // CRIAR LINHA DE EMBALAGEM — PRODUÇÃO
    // ==================================================

    function criarLinhaEmbalagemProduto(
        dados
    ) {

        const linha =
            document.createElement("div");

        linha.className =
            "linha item-embalagem-produto";

        linha.setAttribute(
            "data-item-embalagem",
            ""
        );

        linha.innerHTML = `
            <div class="campo">

                <label>
                    Embalagem
                </label>

                <select
                    class="produto-embalagem-select">

                    <option value="">
                        Selecione a embalagem
                    </option>

                </select>

            </div>

            <div class="campo">

                <label>
                    Quantidade utilizada
                </label>

                <input
                    type="number"
                    class="produto-embalagem-quantidade"
                    min="1"
                    step="1"
                    placeholder="Ex.: 10">

            </div>

            <div class="campo">

                <label>
                    Custo desta linha
                </label>

                <input
                    type="text"
                    class="produto-embalagem-custo"
                    value="R$ 0,00"
                    readonly>

            </div>

            <div class="campo">

                <label>
                    Ação
                </label>

                <button
                    type="button"
                    class="botao-excluir remover-embalagem-produto">
                    Remover
                </button>

            </div>
        `;

        const select =
            linha.querySelector(
                ".produto-embalagem-select"
            );

        const campoQuantidade =
            linha.querySelector(
                ".produto-embalagem-quantidade"
            );

        const botaoRemover =
            linha.querySelector(
                ".remover-embalagem-produto"
            );

        preencherSelectEmbalagens(
            select,
            dados ? dados.embalagemId : ""
        );

        if (dados) {

            campoQuantidade.value =
                dados.quantidade || "";

        }

        select.addEventListener(
            "change",
            function () {

                atualizarCalculosProduto();

            }
        );

        campoQuantidade.addEventListener(
            "input",
            function () {

                atualizarCalculosProduto();

            }
        );

        botaoRemover.addEventListener(
            "click",
            function () {

                linha.remove();

                garantirLinhaEmbalagemProduto();

                atualizarCalculosProduto();

            }
        );

        return linha;

    }

    // ==================================================
    // GARANTIR LINHA DE EMBALAGEM — PRODUÇÃO
    // ==================================================

    function garantirLinhaEmbalagemProduto() {

        if (!listaEmbalagensProduto) {
            return;
        }

        const linhas =
            listaEmbalagensProduto
                .querySelectorAll(
                    ".item-embalagem-produto"
                );

        if (linhas.length === 0) {

            listaEmbalagensProduto.appendChild(
                criarLinhaEmbalagemProduto()
            );

        }

    }

    // ==================================================
    // ADICIONAR EMBALAGEM — PRODUÇÃO
    // ==================================================

    function adicionarLinhaEmbalagemProduto(
        dados
    ) {

        if (!listaEmbalagensProduto) {
            return;
        }

        listaEmbalagensProduto.appendChild(
            criarLinhaEmbalagemProduto(
                dados
            )
        );

        atualizarCalculosProduto();

    }

    // ==================================================
    // LER EMBALAGENS DA PRODUÇÃO
    // ==================================================

    function obterEmbalagensSelecionadasProduto() {

        if (!listaEmbalagensProduto) {
            return [];
        }

        const resultado = [];

        listaEmbalagensProduto
            .querySelectorAll(
                ".item-embalagem-produto"
            )
            .forEach(
                function (linha) {

                    const select =
                        linha.querySelector(
                            ".produto-embalagem-select"
                        );

                    const campoQuantidade =
                        linha.querySelector(
                            ".produto-embalagem-quantidade"
                        );

                    const campoCusto =
                        linha.querySelector(
                            ".produto-embalagem-custo"
                        );

                    const embalagemId =
                        select
                            ? select.value
                            : "";

                    const quantidade =
                        campoQuantidade
                            ? converterNumero(
                                campoQuantidade.value
                            )
                            : 0;

                    const embalagem =
                        encontrarEmbalagemPorId(
                            embalagemId
                        );

                    const valorUnitario =
                        embalagem
                            ? converterNumero(
                                embalagem.valorUnitario
                            )
                            : 0;

                    const custoTotal =
                        quantidade *
                        valorUnitario;

                    if (campoCusto) {

                        campoCusto.value =
                            formatarDinheiroProduto(
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
                                embalagem.nome ||
                                "",

                            categoria:
                                embalagem.categoria ||
                                "",

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
    // CRIAR LINHA DE EMBALAGEM — ORÇAMENTO
    // ==================================================

    function criarLinhaEmbalagemOrcamento(
        dados
    ) {

        const linha =
            document.createElement("div");

        linha.className =
            "linha item-embalagem-orcamento";

        linha.setAttribute(
            "data-item-embalagem-orcamento",
            ""
        );

        linha.innerHTML = `
            <div class="campo">

                <label>
                    Embalagem
                </label>

                <select
                    class="orcamento-embalagem-select">

                    <option value="">
                        Selecione a embalagem
                    </option>

                </select>

            </div>

            <div class="campo">

                <label>
                    Quantidade estimada
                </label>

                <input
                    type="number"
                    class="orcamento-embalagem-quantidade"
                    min="1"
                    step="1"
                    placeholder="Ex.: 20">

            </div>

            <div class="campo">

                <label>
                    Custo estimado
                </label>

                <input
                    type="text"
                    class="orcamento-embalagem-custo"
                    value="R$ 0,00"
                    readonly>

            </div>

            <div class="campo">

                <label>
                    Ação
                </label>

                <button
                    type="button"
                    class="botao-excluir remover-embalagem-orcamento">
                    Remover
                </button>

            </div>
        `;

        const select =
            linha.querySelector(
                ".orcamento-embalagem-select"
            );

        const campoQuantidade =
            linha.querySelector(
                ".orcamento-embalagem-quantidade"
            );

        const botaoRemover =
            linha.querySelector(
                ".remover-embalagem-orcamento"
            );

        preencherSelectEmbalagens(
            select,
            dados ? dados.embalagemId : ""
        );

        if (dados) {

            campoQuantidade.value =
                dados.quantidade || "";

        }

        select.addEventListener(
            "change",
            function () {

                atualizarCalculosOrcamento();

            }
        );

        campoQuantidade.addEventListener(
            "input",
            function () {

                atualizarCalculosOrcamento();

            }
        );

        botaoRemover.addEventListener(
            "click",
            function () {

                linha.remove();

                garantirLinhaEmbalagemOrcamento();

                atualizarCalculosOrcamento();

            }
        );

        return linha;

    }

    // ==================================================
    // GARANTIR LINHA DE EMBALAGEM — ORÇAMENTO
    // ==================================================

    function garantirLinhaEmbalagemOrcamento() {

        if (!listaEmbalagensOrcamento) {
            return;
        }

        const linhas =
            listaEmbalagensOrcamento
                .querySelectorAll(
                    ".item-embalagem-orcamento"
                );

        if (linhas.length === 0) {

            listaEmbalagensOrcamento.appendChild(
                criarLinhaEmbalagemOrcamento()
            );

        }

    }

    // ==================================================
    // ADICIONAR EMBALAGEM — ORÇAMENTO
    // ==================================================

    function adicionarLinhaEmbalagemOrcamento(
        dados
    ) {

        if (!listaEmbalagensOrcamento) {
            return;
        }

        listaEmbalagensOrcamento.appendChild(
            criarLinhaEmbalagemOrcamento(
                dados
            )
        );

        atualizarCalculosOrcamento();

    }

    // ==================================================
    // LER EMBALAGENS DO ORÇAMENTO
    // ==================================================

    function obterEmbalagensSelecionadasOrcamento() {

        if (!listaEmbalagensOrcamento) {
            return [];
        }

        const resultado = [];

        listaEmbalagensOrcamento
            .querySelectorAll(
                ".item-embalagem-orcamento"
            )
            .forEach(
                function (linha) {

                    const select =
                        linha.querySelector(
                            ".orcamento-embalagem-select"
                        );

                    const campoQuantidade =
                        linha.querySelector(
                            ".orcamento-embalagem-quantidade"
                        );

                    const campoCusto =
                        linha.querySelector(
                            ".orcamento-embalagem-custo"
                        );

                    const embalagemId =
                        select
                            ? select.value
                            : "";

                    const quantidade =
                        campoQuantidade
                            ? converterNumero(
                                campoQuantidade.value
                            )
                            : 0;

                    const embalagem =
                        encontrarEmbalagemPorId(
                            embalagemId
                        );

                    const valorUnitario =
                        embalagem
                            ? converterNumero(
                                embalagem.valorUnitario
                            )
                            : 0;

                    const custoTotal =
                        quantidade *
                        valorUnitario;

                    if (campoCusto) {

                        campoCusto.value =
                            formatarDinheiroProduto(
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
                                embalagem.nome ||
                                "",

                            categoria:
                                embalagem.categoria ||
                                "",

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
    // EVENTOS DOS BOTÕES DE EMBALAGENS
    // ==================================================

    if (botaoAdicionarEmbalagemProduto) {

        botaoAdicionarEmbalagemProduto
            .addEventListener(
                "click",
                function () {

                    adicionarLinhaEmbalagemProduto();

                }
            );

    }

    if (botaoAdicionarEmbalagemOrcamento) {

        botaoAdicionarEmbalagemOrcamento
            .addEventListener(
                "click",
                function () {

                    adicionarLinhaEmbalagemOrcamento();

                }
            );

    }

    // ==================================================
    // LIGAR AS LINHAS INICIAIS DO HTML
    // ==================================================

    function substituirLinhasIniciaisEmbalagens() {

        if (listaEmbalagensProduto) {

            listaEmbalagensProduto.innerHTML =
                "";

            adicionarLinhaEmbalagemProduto();

        }

        if (listaEmbalagensOrcamento) {

            listaEmbalagensOrcamento.innerHTML =
                "";

            adicionarLinhaEmbalagemOrcamento();

        }

    }

    substituirLinhasIniciaisEmbalagens();
        // ==================================================
    // ELEMENTOS DOS CÁLCULOS DA PRODUÇÃO
    // ==================================================

    const campoQuantidadeProduzida =
        document.getElementById(
            "produto-produzido-quantidade"
        );

    const campoQuantidadeDisponivel =
        document.getElementById(
            "produto-quantidade-disponivel"
        );

    const campoHorasImpressao =
        document.getElementById(
            "produto-tempo-impressao-horas"
        );

    const campoMinutosImpressao =
        document.getElementById(
            "produto-tempo-impressao-minutos"
        );

    const campoPotenciaImpressora =
        document.getElementById(
            "produto-potencia-impressora"
        );

    const campoTarifaEnergia =
        document.getElementById(
            "produto-tarifa-energia"
        );

    const campoCustoHoraImpressora =
        document.getElementById(
            "produto-custo-hora-impressora"
        );

    const campoPrecoVendaProduto =
        document.getElementById(
            "produto-preco-venda"
        );

    const campoCustoFilamentos =
        document.getElementById(
            "produto-custo-filamentos"
        );

    const campoPesoFilamentos =
        document.getElementById(
            "produto-peso-total-filamentos"
        );

    const campoCustoAcessorios =
        document.getElementById(
            "produto-custo-acessorios"
        );

    const campoQuantidadeAcessorios =
        document.getElementById(
            "produto-quantidade-total-acessorios"
        );

    const campoCustoEmbalagens =
        document.getElementById(
            "produto-custo-embalagens"
        );

    const campoQuantidadeEmbalagens =
        document.getElementById(
            "produto-quantidade-total-embalagens"
        );

    const campoTempoTotalImpressao =
        document.getElementById(
            "produto-tempo-total-impressao"
        );

    const campoHorasDecimais =
        document.getElementById(
            "produto-horas-decimais"
        );

    const campoConsumoEnergia =
        document.getElementById(
            "produto-consumo-energia"
        );

    const campoCustoEnergia =
        document.getElementById(
            "produto-custo-energia"
        );

    const campoCustoMaquina =
        document.getElementById(
            "produto-custo-maquina"
        );

    const campoCustoInsumos =
        document.getElementById(
            "produto-custo-insumos"
        );

    const campoCustoTotalProducao =
        document.getElementById(
            "produto-custo-total-producao"
        );

    const campoCustoUnitarioReal =
        document.getElementById(
            "produto-custo-unitario-real"
        );

    const campoLucroUnitario =
        document.getElementById(
            "produto-lucro-unitario"
        );

    const campoMargemReal =
        document.getElementById(
            "produto-margem-real"
        );

    const campoValorTotalEstoque =
        document.getElementById(
            "produto-valor-total-estoque"
        );

    // ==================================================
    // SOMAR VALORES DE UMA LISTA
    // ==================================================

    function somarCampoLista(
        lista,
        campo
    ) {

        return lista.reduce(
            function (total, item) {

                return total +
                    converterNumero(
                        item[campo]
                    );

            },
            0
        );

    }

    // ==================================================
    // CALCULAR TEMPO DA PRODUÇÃO
    // ==================================================

    function calcularTempoProduto() {

        const horas =
            limitarNumero(
                campoHorasImpressao
                    ? campoHorasImpressao.value
                    : 0,
                0
            );

        const minutos =
            limitarNumero(
                campoMinutosImpressao
                    ? campoMinutosImpressao.value
                    : 0,
                0,
                59
            );

        const horasDecimais =
            horas +
            minutos / 60;

        return {
            horas: horas,
            minutos: minutos,
            horasDecimais: horasDecimais
        };

    }

    // ==================================================
    // CALCULAR ENERGIA DA PRODUÇÃO
    // ==================================================

    function calcularEnergiaProduto(
        horasDecimais
    ) {

        const potenciaWatts =
            limitarNumero(
                campoPotenciaImpressora
                    ? campoPotenciaImpressora.value
                    : 0,
                0
            );

        const tarifa =
            limitarNumero(
                campoTarifaEnergia
                    ? campoTarifaEnergia.value
                    : 0,
                0
            );

        const consumoKwh =
            potenciaWatts /
            1000 *
            horasDecimais;

        const custoEnergia =
            consumoKwh *
            tarifa;

        return {
            potenciaWatts: potenciaWatts,
            tarifa: tarifa,
            consumoKwh: consumoKwh,
            custoEnergia: custoEnergia
        };

    }

    // ==================================================
    // CALCULAR CUSTO DA MÁQUINA
    // ==================================================

    function calcularMaquinaProduto(
        horasDecimais
    ) {

        const custoPorHora =
            limitarNumero(
                campoCustoHoraImpressora
                    ? campoCustoHoraImpressora.value
                    : 0,
                0
            );

        return {
            custoPorHora: custoPorHora,
            custoTotal:
                horasDecimais *
                custoPorHora
        };

    }

    // ==================================================
    // CALCULAR MARGEM SOBRE O PREÇO DE VENDA
    // ==================================================

    function calcularMargemProduto(
        precoVenda,
        custoUnitario
    ) {

        if (precoVenda <= 0) {
            return 0;
        }

        return (
            (precoVenda - custoUnitario) /
            precoVenda
        ) * 100;

    }

    // ==================================================
    // ATUALIZAR TODOS OS CÁLCULOS DA PRODUÇÃO
    // ==================================================

    function atualizarCalculosProduto() {

        const filamentos =
            obterFilamentosSelecionadosProduto();

        const acessorios =
            obterAcessoriosSelecionadosProduto();

        const embalagens =
            obterEmbalagensSelecionadasProduto();

        const custoFilamentos =
            somarCampoLista(
                filamentos,
                "custoTotal"
            );

        const pesoTotalFilamentos =
            somarCampoLista(
                filamentos,
                "quantidade"
            );

        const custoAcessorios =
            somarCampoLista(
                acessorios,
                "custoTotal"
            );

        const quantidadeTotalAcessorios =
            somarCampoLista(
                acessorios,
                "quantidade"
            );

        const custoEmbalagens =
            somarCampoLista(
                embalagens,
                "custoTotal"
            );

        const quantidadeTotalEmbalagens =
            somarCampoLista(
                embalagens,
                "quantidade"
            );

        const tempo =
            calcularTempoProduto();

        const energia =
            calcularEnergiaProduto(
                tempo.horasDecimais
            );

        const maquina =
            calcularMaquinaProduto(
                tempo.horasDecimais
            );

        const custoInsumos =
            custoFilamentos +
            custoAcessorios +
            custoEmbalagens;

        const custoTotalProducao =
            custoInsumos +
            energia.custoEnergia +
            maquina.custoTotal;

        const quantidadeProduzida =
            limitarNumero(
                campoQuantidadeProduzida
                    ? campoQuantidadeProduzida.value
                    : 0,
                0
            );

        const custoUnitario =
            quantidadeProduzida > 0
                ? custoTotalProducao /
                    quantidadeProduzida
                : 0;

        const precoVenda =
            limitarNumero(
                campoPrecoVendaProduto
                    ? campoPrecoVendaProduto.value
                    : 0,
                0
            );

        const lucroUnitario =
            precoVenda -
            custoUnitario;

        const margemReal =
            calcularMargemProduto(
                precoVenda,
                custoUnitario
            );

        const valorTotalEstoque =
            precoVenda *
            quantidadeProduzida;

        // ==============================================
        // ATUALIZAR CAMPOS DOS INSUMOS
        // ==============================================

        if (campoCustoFilamentos) {

            campoCustoFilamentos.value =
                formatarDinheiroProduto(
                    custoFilamentos
                );

        }

        if (campoPesoFilamentos) {

            campoPesoFilamentos.value =
                formatarNumeroProduto(
                    pesoTotalFilamentos,
                    2
                ) +
                " g";

        }

        if (campoCustoAcessorios) {

            campoCustoAcessorios.value =
                formatarDinheiroProduto(
                    custoAcessorios
                );

        }

        if (campoQuantidadeAcessorios) {

            campoQuantidadeAcessorios.value =
                formatarNumeroProduto(
                    quantidadeTotalAcessorios,
                    0
                );

        }

        if (campoCustoEmbalagens) {

            campoCustoEmbalagens.value =
                formatarDinheiroProduto(
                    custoEmbalagens
                );

        }

        if (campoQuantidadeEmbalagens) {

            campoQuantidadeEmbalagens.value =
                formatarNumeroProduto(
                    quantidadeTotalEmbalagens,
                    0
                );

        }

        // ==============================================
        // ATUALIZAR TEMPO, ENERGIA E MÁQUINA
        // ==============================================

        if (campoTempoTotalImpressao) {

            campoTempoTotalImpressao.value =
                formatarNumeroProduto(
                    tempo.horas,
                    0
                ) +
                "h " +
                formatarNumeroProduto(
                    tempo.minutos,
                    0
                ) +
                "min";

        }

        if (campoHorasDecimais) {

            campoHorasDecimais.value =
                formatarNumeroProduto(
                    tempo.horasDecimais,
                    2
                ) +
                " h";

        }

        if (campoConsumoEnergia) {

            campoConsumoEnergia.value =
                formatarNumeroProduto(
                    energia.consumoKwh,
                    4
                ) +
                " kWh";

        }

        if (campoCustoEnergia) {

            campoCustoEnergia.value =
                formatarDinheiroProduto(
                    energia.custoEnergia
                );

        }

        if (campoCustoMaquina) {

            campoCustoMaquina.value =
                formatarDinheiroProduto(
                    maquina.custoTotal
                );

        }

        // ==============================================
        // ATUALIZAR RESUMO FINANCEIRO
        // ==============================================

        if (campoCustoInsumos) {

            campoCustoInsumos.value =
                formatarDinheiroProduto(
                    custoInsumos
                );

        }

        if (campoCustoTotalProducao) {

            campoCustoTotalProducao.value =
                formatarDinheiroProduto(
                    custoTotalProducao
                );

        }

        if (campoCustoUnitarioReal) {

            campoCustoUnitarioReal.value =
                formatarDinheiroProduto(
                    custoUnitario
                );

        }

        if (campoLucroUnitario) {

            campoLucroUnitario.value =
                formatarDinheiroProduto(
                    lucroUnitario
                );

        }

        if (campoMargemReal) {

            campoMargemReal.value =
                formatarNumeroProduto(
                    margemReal,
                    2
                ) +
                "%";

        }

        if (campoValorTotalEstoque) {

            campoValorTotalEstoque.value =
                formatarDinheiroProduto(
                    valorTotalEstoque
                );

        }

        if (
            campoQuantidadeDisponivel &&
            produtoProduzidoEmEdicaoId === null
        ) {

            campoQuantidadeDisponivel.value =
                quantidadeProduzida;

        }

        return {

            filamentos: filamentos,
            acessorios: acessorios,
            embalagens: embalagens,

            custoFilamentos:
                custoFilamentos,

            pesoTotalFilamentos:
                pesoTotalFilamentos,

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
    // CAMPOS QUE DISPARAM NOVOS CÁLCULOS
    // ==================================================

    [
        campoQuantidadeProduzida,
        campoHorasImpressao,
        campoMinutosImpressao,
        campoPotenciaImpressora,
        campoTarifaEnergia,
        campoCustoHoraImpressora,
        campoPrecoVendaProduto
    ].forEach(
        function (campo) {

            if (!campo) {
                return;
            }

            campo.addEventListener(
                "input",
                atualizarCalculosProduto
            );

            campo.addEventListener(
                "change",
                atualizarCalculosProduto
            );

        }
    );

    // ==================================================
    // PRIMEIRO CÁLCULO
    // ==================================================

    atualizarCalculosProduto();
        // ==================================================
    // AGRUPAR CONSUMOS PELO ID DO INSUMO
    // ==================================================

    function agruparConsumosPorId(
        lista,
        campoId
    ) {

        const agrupados = {};

        lista.forEach(
            function (item) {

                const id =
                    String(item[campoId]);

                if (!agrupados[id]) {

                    agrupados[id] = {
                        id: item[campoId],
                        quantidade: 0
                    };

                }

                agrupados[id].quantidade +=
                    converterNumero(
                        item.quantidade
                    );

            }
        );

        return Object.values(agrupados);

    }

    // ==================================================
    // VERIFICAR ITENS REPETIDOS
    // ==================================================

    function possuiItensRepetidos(
        lista,
        campoId
    ) {

        const ids =
            lista.map(
                function (item) {

                    return String(
                        item[campoId]
                    );

                }
            );

        return (
            new Set(ids).size !==
            ids.length
        );

    }

    // ==================================================
    // VALIDAR FILAMENTOS DA PRODUÇÃO
    // ==================================================

    function validarFilamentosProduto(
        filamentos
    ) {

        if (filamentos.length === 0) {

            alert(
                "Adicione pelo menos um filamento utilizado."
            );

            return false;

        }

        if (
            possuiItensRepetidos(
                filamentos,
                "filamentoId"
            )
        ) {

            alert(
                "O mesmo lote de filamento foi adicionado mais de uma vez."
            );

            return false;

        }

        const consumosAgrupados =
            agruparConsumosPorId(
                filamentos,
                "filamentoId"
            );

        for (
            const consumo of
            consumosAgrupados
        ) {

            const filamento =
                encontrarFilamentoPorId(
                    consumo.id
                );

            if (!filamento) {

                alert(
                    "Um dos filamentos selecionados não foi encontrado."
                );

                return false;

            }

            const pesoDisponivel =
                converterNumero(
                    filamento.pesoRestante
                );

            if (
                consumo.quantidade <= 0
            ) {

                alert(
                    "Informe uma quantidade válida para cada filamento."
                );

                return false;

            }

            if (
                consumo.quantidade >
                pesoDisponivel
            ) {

                const nome =
                    obterTextoFilamento(
                        filamento
                    );

                alert(
                    "Estoque insuficiente para o filamento:\n" +
                    nome +
                    "\n\nDisponível: " +
                    formatarNumeroProduto(
                        pesoDisponivel,
                        2
                    ) +
                    " g\nNecessário: " +
                    formatarNumeroProduto(
                        consumo.quantidade,
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
    // VALIDAR ACESSÓRIOS DA PRODUÇÃO
    // ==================================================

    function validarAcessoriosProduto(
        acessorios
    ) {

        if (
            possuiItensRepetidos(
                acessorios,
                "acessorioId"
            )
        ) {

            alert(
                "O mesmo acessório foi adicionado mais de uma vez."
            );

            return false;

        }

        const consumosAgrupados =
            agruparConsumosPorId(
                acessorios,
                "acessorioId"
            );

        for (
            const consumo of
            consumosAgrupados
        ) {

            const acessorio =
                encontrarAcessorioPorId(
                    consumo.id
                );

            if (!acessorio) {

                alert(
                    "Um dos acessórios selecionados não foi encontrado."
                );

                return false;

            }

            const quantidadeDisponivel =
                converterNumero(
                    acessorio.quantidade
                );

            if (
                consumo.quantidade <= 0
            ) {

                alert(
                    "Informe uma quantidade válida para cada acessório."
                );

                return false;

            }

            if (
                consumo.quantidade >
                quantidadeDisponivel
            ) {

                alert(
                    "Estoque insuficiente para o acessório:\n" +
                    (acessorio.nome ||
                        "Acessório") +
                    "\n\nDisponível: " +
                    formatarNumeroProduto(
                        quantidadeDisponivel,
                        0
                    ) +
                    "\nNecessário: " +
                    formatarNumeroProduto(
                        consumo.quantidade,
                        0
                    )
                );

                return false;

            }

        }

        return true;

    }

    // ==================================================
    // VALIDAR EMBALAGENS DA PRODUÇÃO
    // ==================================================

    function validarEmbalagensProduto(
        embalagens
    ) {

        if (
            possuiItensRepetidos(
                embalagens,
                "embalagemId"
            )
        ) {

            alert(
                "A mesma embalagem foi adicionada mais de uma vez."
            );

            return false;

        }

        const consumosAgrupados =
            agruparConsumosPorId(
                embalagens,
                "embalagemId"
            );

        for (
            const consumo of
            consumosAgrupados
        ) {

            const embalagem =
                encontrarEmbalagemPorId(
                    consumo.id
                );

            if (!embalagem) {

                alert(
                    "Uma das embalagens selecionadas não foi encontrada."
                );

                return false;

            }

            const quantidadeDisponivel =
                converterNumero(
                    embalagem.quantidade
                );

            if (
                consumo.quantidade <= 0
            ) {

                alert(
                    "Informe uma quantidade válida para cada embalagem."
                );

                return false;

            }

            if (
                consumo.quantidade >
                quantidadeDisponivel
            ) {

                alert(
                    "Estoque insuficiente para a embalagem:\n" +
                    (embalagem.nome ||
                        "Embalagem") +
                    "\n\nDisponível: " +
                    formatarNumeroProduto(
                        quantidadeDisponivel,
                        0
                    ) +
                    "\nNecessário: " +
                    formatarNumeroProduto(
                        consumo.quantidade,
                        0
                    )
                );

                return false;

            }

        }

        return true;

    }

    // ==================================================
    // VALIDAR TODOS OS INSUMOS
    // ==================================================

    function validarEstoqueDaProducao(
        calculos
    ) {

        if (
            !validarFilamentosProduto(
                calculos.filamentos
            )
        ) {
            return false;
        }

        if (
            !validarAcessoriosProduto(
                calculos.acessorios
            )
        ) {
            return false;
        }

        if (
            !validarEmbalagensProduto(
                calculos.embalagens
            )
        ) {
            return false;
        }

        return true;

    }

    // ==================================================
    // ATUALIZAR STATUS DO FILAMENTO
    // ==================================================

    function atualizarStatusFilamentoProduto(
        filamento
    ) {

        const pesoInicial =
            converterNumero(
                filamento.pesoInicial
            );

        const pesoRestante =
            Math.max(
                0,
                converterNumero(
                    filamento.pesoRestante
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

        filamento.percentual =
            percentual;

        if (pesoRestante <= 0) {

            filamento.status =
                "Finalizado";

        } else if (
            percentual <= 20
        ) {

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

    function baixarFilamentosDaProducao(
        filamentos
    ) {

        filamentos.forEach(
            function (consumo) {

                const filamento =
                    encontrarFilamentoPorId(
                        consumo.filamentoId
                    );

                if (!filamento) {
                    return;
                }

                filamento.pesoRestante =
                    Math.max(
                        0,
                        converterNumero(
                            filamento.pesoRestante
                        ) -
                        converterNumero(
                            consumo.quantidade
                        )
                    );

                atualizarStatusFilamentoProduto(
                    filamento
                );

            }
        );

        salvarFilamentosDisponiveis();

    }

    // ==================================================
    // BAIXAR ACESSÓRIOS
    // ==================================================

    function baixarAcessoriosDaProducao(
        acessorios
    ) {

        acessorios.forEach(
            function (consumo) {

                const acessorio =
                    encontrarAcessorioPorId(
                        consumo.acessorioId
                    );

                if (!acessorio) {
                    return;
                }

                acessorio.quantidade =
                    Math.max(
                        0,
                        converterNumero(
                            acessorio.quantidade
                        ) -
                        converterNumero(
                            consumo.quantidade
                        )
                    );

            }
        );

        salvarAcessoriosDisponiveis();

    }

    // ==================================================
    // BAIXAR EMBALAGENS
    // ==================================================

    function baixarEmbalagensDaProducao(
        embalagens
    ) {

        embalagens.forEach(
            function (consumo) {

                const embalagem =
                    encontrarEmbalagemPorId(
                        consumo.embalagemId
                    );

                if (!embalagem) {
                    return;
                }

                embalagem.quantidade =
                    Math.max(
                        0,
                        converterNumero(
                            embalagem.quantidade
                        ) -
                        converterNumero(
                            consumo.quantidade
                        )
                    );

            }
        );

        salvarEmbalagensDisponiveis();

    }

    // ==================================================
    // EFETUAR TODAS AS BAIXAS
    // ==================================================

    function baixarInsumosDaProducao(
        calculos
    ) {

        baixarFilamentosDaProducao(
            calculos.filamentos
        );

        baixarAcessoriosDaProducao(
            calculos.acessorios
        );

        baixarEmbalagensDaProducao(
            calculos.embalagens
        );

        atualizarSelectsProduto();

    }
        // ==================================================
    // ELEMENTOS DO FORMULÁRIO DE PRODUÇÃO
    // ==================================================

    const campoNomeProdutoProduzido =
        document.getElementById(
            "produto-produzido-nome"
        );

    const campoCategoriaProdutoProduzido =
        document.getElementById(
            "produto-produzido-categoria"
        );

    const campoLoteProdutoProduzido =
        document.getElementById(
            "produto-produzido-lote"
        );

    const campoDataProdutoProduzido =
        document.getElementById(
            "produto-produzido-data"
        );

    const campoEstoqueMinimoProduto =
        document.getElementById(
            "produto-produzido-estoque-minimo"
        );

    const campoDescricaoProdutoProduzido =
        document.getElementById(
            "produto-produzido-descricao"
        );

    const campoObservacoesProdutoProduzido =
        document.getElementById(
            "produto-produzido-observacoes"
        );

    const botaoSalvarProdutoProduzido =
        document.getElementById(
            "salvar-produto-produzido"
        );

    const botaoLimparProdutoProduzido =
        document.getElementById(
            "limpar-formulario-produto-produzido"
        );

    // ==================================================
    // ENCONTRAR IMPRESSORA
    // ==================================================

    function encontrarImpressoraPorId(id) {

        return impressorasDisponiveis.find(
            function (impressora) {

                return String(impressora.id) ===
                    String(id);

            }
        );

    }

    // ==================================================
    // VALIDAR DADOS PRINCIPAIS DA PRODUÇÃO
    // ==================================================

    function validarDadosPrincipaisProducao(
        calculos
    ) {

        const nome =
            campoNomeProdutoProduzido
                ? campoNomeProdutoProduzido
                    .value
                    .trim()
                : "";

        const categoria =
            campoCategoriaProdutoProduzido
                ? campoCategoriaProdutoProduzido.value
                : "";

        const lote =
            campoLoteProdutoProduzido
                ? campoLoteProdutoProduzido
                    .value
                    .trim()
                : "";

        const data =
            campoDataProdutoProduzido
                ? campoDataProdutoProduzido.value
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

        if (!lote) {

            alert(
                "Informe o lote de produção."
            );

            return false;

        }

        const loteJaExiste =
            produtosProduzidos.some(
                function (produto) {

                    return (
                        String(
                            produto.lote || ""
                        ).toLowerCase() ===
                        lote.toLowerCase() &&
                        produto.id !==
                            produtoProduzidoEmEdicaoId
                    );

                }
            );

        if (loteJaExiste) {

            alert(
                "Já existe um lote com este código."
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

        if (
            calculos.precoVenda < 0
        ) {

            alert(
                "Informe um preço de venda válido."
            );

            return false;

        }

        return true;

    }

    // ==================================================
    // REGISTRAR HORAS NA IMPRESSORA
    // ==================================================

    function registrarHorasNaImpressora(
        impressoraId,
        horasDecimais,
        produto,
        lote
    ) {

        const impressora =
            encontrarImpressoraPorId(
                impressoraId
            );

        if (!impressora) {
            return;
        }

        const horasAtuais =
            converterNumero(
                impressora.horasUso ??
                impressora.horasAcumuladas ??
                impressora.horas ??
                impressora.horasIniciais ??
                0
            );

        const novoTotal =
            horasAtuais +
            horasDecimais;

        impressora.horasUso =
            novoTotal;

        impressora.horasAcumuladas =
            novoTotal;

        if (
            Array.isArray(
                impressora.historicoHoras
            )
        ) {

            impressora.historicoHoras.push({

                id: criarIdProduto(),

                data: obterDataHojeProduto(),

                origem: "Produção",

                produto: produto,

                lote: lote,

                horas:
                    horasDecimais

            });

        } else {

            impressora.historicoHoras = [{

                id: criarIdProduto(),

                data: obterDataHojeProduto(),

                origem: "Produção",

                produto: produto,

                lote: lote,

                horas:
                    horasDecimais

            }];

        }

        salvarImpressorasDisponiveis();

    }

    // ==================================================
    // REGISTRAR MOVIMENTAÇÃO DE PRODUÇÃO
    // ==================================================

    function registrarMovimentacaoProducao(
        produto
    ) {

        movimentacoesProdutos.push({

            id: criarIdProduto(),

            data:
                produto.dataProducao,

            tipo:
                "Entrada por produção",

            produtoId:
                produto.id,

            produto:
                produto.nome,

            lote:
                produto.lote,

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
                "Entrada inicial do lote produzido."

        });

        salvarMovimentacoesProdutos();

    }

    // ==================================================
    // CRIAR OBJETO DO LOTE PRODUZIDO
    // ==================================================

    function criarObjetoProdutoProduzido(
        calculos
    ) {

        const impressoraId =
            campoImpressoraProduto
                ? campoImpressoraProduto.value
                : "";

        const impressora =
            encontrarImpressoraPorId(
                impressoraId
            );

        const quantidadeDisponivelAtual =
            campoQuantidadeDisponivel
                ? converterNumero(
                    campoQuantidadeDisponivel.value
                )
                : calculos.quantidadeProduzida;

        const quantidadeDisponivel =
            produtoProduzidoEmEdicaoId ===
            null
                ? calculos.quantidadeProduzida
                : quantidadeDisponivelAtual;

        return {

            id:
                produtoProduzidoEmEdicaoId ??
                criarIdProduto(),

            nome:
                campoNomeProdutoProduzido
                    ? campoNomeProdutoProduzido
                        .value
                        .trim()
                    : "",

            categoria:
                campoCategoriaProdutoProduzido
                    ? campoCategoriaProdutoProduzido.value
                    : "",

            lote:
                campoLoteProdutoProduzido
                    ? campoLoteProdutoProduzido
                        .value
                        .trim()
                    : "",

            dataProducao:
                campoDataProdutoProduzido
                    ? campoDataProdutoProduzido.value
                    : "",

            quantidadeProduzida:
                calculos.quantidadeProduzida,

            quantidadeDisponivel:
                quantidadeDisponivel,

            estoqueMinimo:
                campoEstoqueMinimoProduto
                    ? converterNumero(
                        campoEstoqueMinimoProduto.value
                    )
                    : 0,

            descricao:
                campoDescricaoProdutoProduzido
                    ? campoDescricaoProdutoProduzido
                        .value
                        .trim()
                    : "",

            observacoes:
                campoObservacoesProdutoProduzido
                    ? campoObservacoesProdutoProduzido
                        .value
                        .trim()
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
                    ? obterTextoImpressora(
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

    function salvarProducaoProduto() {

        recarregarDadosDeApoio();

        const calculos =
            atualizarCalculosProduto();

        if (
            !validarDadosPrincipaisProducao(
                calculos
            )
        ) {
            return;
        }

        const estavaEditando =
            produtoProduzidoEmEdicaoId !==
            null;

        if (!estavaEditando) {

            if (
                !validarEstoqueDaProducao(
                    calculos
                )
            ) {
                return;
            }

        }

        const produto =
            criarObjetoProdutoProduzido(
                calculos
            );

        if (estavaEditando) {

            const indice =
                produtosProduzidos.findIndex(
                    function (item) {

                        return item.id ===
                            produtoProduzidoEmEdicaoId;

                    }
                );

            if (indice === -1) {

                alert(
                    "Lote produzido não encontrado."
                );

                return;

            }

            const produtoAnterior =
                produtosProduzidos[indice];

            produto.criadoEm =
                produtoAnterior.criadoEm ||
                produto.criadoEm;

            produtosProduzidos[indice] =
                produto;

        } else {

            baixarInsumosDaProducao(
                calculos
            );

            produtosProduzidos.push(
                produto
            );

            registrarHorasNaImpressora(
                produto.impressoraId,
                produto.horasDecimais,
                produto.nome,
                produto.lote
            );

            registrarMovimentacaoProducao(
                produto
            );
            marcarOrcamentoOrigemComoProduzido(
            produto
            );
        }

        salvarProdutosProduzidos();

        mostrarProdutosProduzidos();

        atualizarResumoProdutosProduzidos();

        limparFormularioProdutoProduzido();

        if (
            typeof atualizarDashboardCompleto ===
            "function"
        ) {

            atualizarDashboardCompleto();

        }

        if (
            typeof atualizarRelatorios ===
            "function"
        ) {

            atualizarRelatorios();

        }

        alert(
            estavaEditando
                ? "Produção atualizada com sucesso!"
                : "Produção registrada com sucesso!"
        );

    }

    // ==================================================
    // EVENTOS DOS BOTÕES DA PRODUÇÃO
    // ==================================================

    if (botaoSalvarProdutoProduzido) {

        botaoSalvarProdutoProduzido
            .addEventListener(
                "click",
                salvarProducaoProduto
            );

    }

    if (botaoLimparProdutoProduzido) {

        botaoLimparProdutoProduzido
            .addEventListener(
                "click",
                limparFormularioProdutoProduzido
            );

    }
        // ==================================================
    // ELEMENTOS DA LISTAGEM E DO RESUMO
    // ==================================================

    const listaProdutosProduzidos =
        document.getElementById(
            "lista-produtos-produzidos"
        );

    const campoTotalLotesProduzidos =
        document.getElementById(
            "produtos-total-lotes"
        );

    const campoUnidadesDisponiveis =
        document.getElementById(
            "produtos-unidades-disponiveis"
        );

    const campoValorEstoqueProdutos =
        document.getElementById(
            "produtos-valor-estoque"
        );

    const campoCustoTotalProduzido =
        document.getElementById(
            "produtos-custo-total"
        );

    // ==================================================
    // LIMPAR FORMULÁRIO DA PRODUÇÃO
    // ==================================================

    function limparFormularioProdutoProduzido() {

        if (campoNomeProdutoProduzido) {
            campoNomeProdutoProduzido.value = "";
        }

        if (campoCategoriaProdutoProduzido) {
            campoCategoriaProdutoProduzido.value = "";
        }

        if (campoLoteProdutoProduzido) {
            campoLoteProdutoProduzido.value = "";
        }

        if (campoDataProdutoProduzido) {

            campoDataProdutoProduzido.value =
                obterDataHojeProduto();

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

        if (campoDescricaoProdutoProduzido) {
            campoDescricaoProdutoProduzido.value = "";
        }

        if (campoObservacoesProdutoProduzido) {
            campoObservacoesProdutoProduzido.value = "";
        }

        if (campoImpressoraProduto) {
            campoImpressoraProduto.value = "";
        }

        if (campoHorasImpressao) {
            campoHorasImpressao.value = "";
        }

        if (campoMinutosImpressao) {
            campoMinutosImpressao.value = "";
        }

        if (campoPotenciaImpressora) {
            campoPotenciaImpressora.value = "";
        }

        if (campoTarifaEnergia) {
            campoTarifaEnergia.value = "";
        }

        if (campoCustoHoraImpressora) {
            campoCustoHoraImpressora.value = "";
        }

        if (campoPrecoVendaProduto) {
            campoPrecoVendaProduto.value = "";
        }

        if (listaFilamentosProduto) {

            listaFilamentosProduto.innerHTML = "";

            adicionarLinhaFilamentoProduto();

        }

        if (listaAcessoriosProduto) {

            listaAcessoriosProduto.innerHTML = "";

            adicionarLinhaAcessorioProduto();

        }

        if (listaEmbalagensProduto) {

            listaEmbalagensProduto.innerHTML = "";

            adicionarLinhaEmbalagemProduto();

        }

        produtoProduzidoEmEdicaoId = null;

        orcamentoOrigemProducaoId = null;

        if (botaoSalvarProdutoProduzido) {

            botaoSalvarProdutoProduzido.textContent =
                "Salvar Produção";

        }

        atualizarSelectsProduto();

        atualizarCalculosProduto();

    }

    // ==================================================
    // ATUALIZAR RESUMO DOS LOTES
    // ==================================================

    function atualizarResumoProdutosProduzidos() {

        const totalLotes =
            produtosProduzidos.length;

        const unidadesDisponiveis =
            produtosProduzidos.reduce(
                function (total, produto) {

                    return total +
                        converterNumero(
                            produto.quantidadeDisponivel
                        );

                },
                0
            );

        const valorEstoque =
            produtosProduzidos.reduce(
                function (total, produto) {

                    return total +
                        (
                            converterNumero(
                                produto.quantidadeDisponivel
                            ) *
                            converterNumero(
                                produto.precoVenda
                            )
                        );

                },
                0
            );

        const custoTotal =
            produtosProduzidos.reduce(
                function (total, produto) {

                    return total +
                        converterNumero(
                            produto.custoTotalProducao
                        );

                },
                0
            );

        if (campoTotalLotesProduzidos) {

            campoTotalLotesProduzidos.textContent =
                totalLotes;

        }

        if (campoUnidadesDisponiveis) {

            campoUnidadesDisponiveis.textContent =
                unidadesDisponiveis;

        }

        if (campoValorEstoqueProdutos) {

            campoValorEstoqueProdutos.textContent =
                formatarDinheiroProduto(
                    valorEstoque
                );

        }

        if (campoCustoTotalProduzido) {

            campoCustoTotalProduzido.textContent =
                formatarDinheiroProduto(
                    custoTotal
                );

        }

    }

    // ==================================================
    // MONTAR TEXTO DOS FILAMENTOS UTILIZADOS
    // ==================================================

    function montarTextoFilamentosProduto(
        filamentos
    ) {

        if (
            !Array.isArray(filamentos) ||
            filamentos.length === 0
        ) {
            return "Nenhum filamento informado.";
        }

        return filamentos
            .map(
                function (filamento) {

                    const identificacao =
                        [
                            filamento.material,
                            filamento.cor,
                            filamento.lote
                                ? "Lote " +
                                    filamento.lote
                                : ""
                        ]
                            .filter(Boolean)
                            .join(" — ");

                    return (
                        escaparTexto(
                            identificacao ||
                            "Filamento"
                        ) +
                        ": " +
                        formatarNumeroProduto(
                            filamento.quantidade,
                            2
                        ) +
                        " g"
                    );

                }
            )
            .join("<br>");

    }

    // ==================================================
    // MONTAR TEXTO DOS ACESSÓRIOS
    // ==================================================

    function montarTextoAcessoriosProduto(
        acessorios
    ) {

        if (
            !Array.isArray(acessorios) ||
            acessorios.length === 0
        ) {
            return "Nenhum acessório utilizado.";
        }

        return acessorios
            .map(
                function (acessorio) {

                    return (
                        escaparTexto(
                            acessorio.nome ||
                            "Acessório"
                        ) +
                        ": " +
                        formatarNumeroProduto(
                            acessorio.quantidade,
                            0
                        )
                    );

                }
            )
            .join("<br>");

    }

    // ==================================================
    // MONTAR TEXTO DAS EMBALAGENS
    // ==================================================

    function montarTextoEmbalagensProduto(
        embalagens
    ) {

        if (
            !Array.isArray(embalagens) ||
            embalagens.length === 0
        ) {
            return "Nenhuma embalagem utilizada.";
        }

        return embalagens
            .map(
                function (embalagem) {

                    return (
                        escaparTexto(
                            embalagem.nome ||
                            "Embalagem"
                        ) +
                        ": " +
                        formatarNumeroProduto(
                            embalagem.quantidade,
                            0
                        )
                    );

                }
            )
            .join("<br>");

    }

    // ==================================================
    // MOSTRAR LOTES PRODUZIDOS
    // ==================================================

    function mostrarProdutosProduzidos() {

        if (!listaProdutosProduzidos) {
            return;
        }

        if (
            !Array.isArray(
                produtosProduzidos
            ) ||
            produtosProduzidos.length === 0
        ) {

            listaProdutosProduzidos.innerHTML =
                "<p>Nenhum lote produzido cadastrado.</p>";

            atualizarResumoProdutosProduzidos();

            return;

        }

        const produtosOrdenados =
            [...produtosProduzidos]
                .sort(
                    function (produtoA, produtoB) {

                        const dataA =
                            produtoA.dataProducao ||
                            "";

                        const dataB =
                            produtoB.dataProducao ||
                            "";

                        if (dataA !== dataB) {

                            return dataA.localeCompare(
                                dataB
                            );

                        }

                        return (
                            converterNumero(
                                produtoA.id
                            ) -
                            converterNumero(
                                produtoB.id
                            )
                        );

                    }
                );

        listaProdutosProduzidos.innerHTML =
            produtosOrdenados
                .map(
                    function (produto) {

                        const quantidadeDisponivel =
                            converterNumero(
                                produto.quantidadeDisponivel
                            );

                        const estoqueMinimo =
                            converterNumero(
                                produto.estoqueMinimo
                            );

                        let status =
                            "Disponível";

                        if (
                            quantidadeDisponivel <= 0
                        ) {

                            status =
                                "Sem estoque";

                        } else if (
                            quantidadeDisponivel <=
                            estoqueMinimo
                        ) {

                            status =
                                "Estoque baixo";

                        }

                        return `
                            <div class="card-item">

                                <h4>
                                    ${escaparTexto(
                                        produto.nome ||
                                        "Produto sem nome"
                                    )}
                                </h4>

                                <p>
                                    <strong>Lote:</strong>
                                    ${escaparTexto(
                                        produto.lote ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Categoria:</strong>
                                    ${escaparTexto(
                                        produto.categoria ||
                                        "Não informada"
                                    )}
                                </p>

                                <p>
                                    <strong>Data da produção:</strong>
                                    ${formatarDataProduto(
                                        produto.dataProducao
                                    )}
                                </p>

                                <p>
                                    <strong>Quantidade produzida:</strong>
                                    ${formatarNumeroProduto(
                                        produto.quantidadeProduzida,
                                        0
                                    )}
                                </p>

                                <p>
                                    <strong>Quantidade disponível:</strong>
                                    ${formatarNumeroProduto(
                                        quantidadeDisponivel,
                                        0
                                    )}
                                </p>

                                <p>
                                    <strong>Status:</strong>
                                    ${escaparTexto(status)}
                                </p>

                                <p>
                                    <strong>Impressora:</strong>
                                    ${escaparTexto(
                                        produto.impressoraNome ||
                                        "Não informada"
                                    )}
                                </p>

                                <p>
                                    <strong>Tempo de impressão:</strong>
                                    ${formatarNumeroProduto(
                                        produto.horas || 0,
                                        0
                                    )}h
                                    ${formatarNumeroProduto(
                                        produto.minutos || 0,
                                        0
                                    )}min
                                </p>

                                <p>
                                    <strong>Filamentos utilizados:</strong><br>
                                    ${montarTextoFilamentosProduto(
                                        produto.filamentos
                                    )}
                                </p>

                                <p>
                                    <strong>Acessórios utilizados:</strong><br>
                                    ${montarTextoAcessoriosProduto(
                                        produto.acessorios
                                    )}
                                </p>

                                <p>
                                    <strong>Embalagens utilizadas:</strong><br>
                                    ${montarTextoEmbalagensProduto(
                                        produto.embalagens
                                    )}
                                </p>

                                <p>
                                    <strong>Custo dos insumos:</strong>
                                    ${formatarDinheiroProduto(
                                        produto.custoInsumos
                                    )}
                                </p>

                                <p>
                                    <strong>Custo de energia:</strong>
                                    ${formatarDinheiroProduto(
                                        produto.custoEnergia
                                    )}
                                </p>

                                <p>
                                    <strong>Custo da máquina:</strong>
                                    ${formatarDinheiroProduto(
                                        produto.custoMaquina
                                    )}
                                </p>

                                <p>
                                    <strong>Custo total do lote:</strong>
                                    ${formatarDinheiroProduto(
                                        produto.custoTotalProducao
                                    )}
                                </p>

                                <p>
                                    <strong>Custo unitário real:</strong>
                                    ${formatarDinheiroProduto(
                                        produto.custoUnitario
                                    )}
                                </p>

                                <p>
                                    <strong>Preço de venda:</strong>
                                    ${formatarDinheiroProduto(
                                        produto.precoVenda
                                    )}
                                </p>

                                <p>
                                    <strong>Margem real:</strong>
                                    ${formatarNumeroProduto(
                                        produto.margemReal,
                                        2
                                    )}%
                                </p>

                                <div class="acoes-card">

                                    <button
                                        type="button"
                                        class="botao-principal"
                                        onclick="editarProdutoProduzido(
                                            ${produto.id}
                                        )">
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        class="botao-excluir"
                                        onclick="excluirProdutoProduzido(
                                            ${produto.id}
                                        )">
                                        Excluir
                                    </button>

                                </div>

                            </div>
                        `;

                    }
                )
                .join("");

        atualizarResumoProdutosProduzidos();

    }

    // ==================================================
    // PRIMEIRA EXIBIÇÃO DOS LOTES
    // ==================================================

    mostrarProdutosProduzidos();

    atualizarResumoProdutosProduzidos();

    if (campoDataProdutoProduzido) {

        campoDataProdutoProduzido.value =
            campoDataProdutoProduzido.value ||
            obterDataHojeProduto();

    }
        // ==================================================
    // EDITAR LOTE PRODUZIDO
    // ==================================================

    window.editarProdutoProduzido =
        function (id) {

            const produto =
                produtosProduzidos.find(
                    function (item) {

                        return item.id === id;

                    }
                );

            if (!produto) {

                alert(
                    "Lote produzido não encontrado."
                );

                return;

            }

            produtoProduzidoEmEdicaoId =
                id;

            abrirAbaProduto(
                "aba-produtos-produzidos"
            );

            if (campoNomeProdutoProduzido) {

                campoNomeProdutoProduzido.value =
                    produto.nome || "";

            }

            if (campoCategoriaProdutoProduzido) {

                campoCategoriaProdutoProduzido.value =
                    produto.categoria || "";

            }

            if (campoLoteProdutoProduzido) {

                campoLoteProdutoProduzido.value =
                    produto.lote || "";

            }

            if (campoDataProdutoProduzido) {

                campoDataProdutoProduzido.value =
                    produto.dataProducao || "";

            }

            if (campoQuantidadeProduzida) {

                campoQuantidadeProduzida.value =
                    produto.quantidadeProduzida || "";

            }

            if (campoQuantidadeDisponivel) {

                campoQuantidadeDisponivel.value =
                    produto.quantidadeDisponivel ?? 0;

            }

            if (campoEstoqueMinimoProduto) {

                campoEstoqueMinimoProduto.value =
                    produto.estoqueMinimo || "";

            }

            if (campoDescricaoProdutoProduzido) {

                campoDescricaoProdutoProduzido.value =
                    produto.descricao || "";

            }

            if (campoObservacoesProdutoProduzido) {

                campoObservacoesProdutoProduzido.value =
                    produto.observacoes || "";

            }

            if (campoImpressoraProduto) {

                preencherSelectImpressoras(
                    campoImpressoraProduto,
                    produto.impressoraId || ""
                );

            }

            if (campoHorasImpressao) {

                campoHorasImpressao.value =
                    produto.horas || "";

            }

            if (campoMinutosImpressao) {

                campoMinutosImpressao.value =
                    produto.minutos || "";

            }

            if (campoPotenciaImpressora) {

                campoPotenciaImpressora.value =
                    produto.potenciaWatts || "";

            }

            if (campoTarifaEnergia) {

                campoTarifaEnergia.value =
                    produto.tarifaEnergia || "";

            }

            if (campoCustoHoraImpressora) {

                campoCustoHoraImpressora.value =
                    produto.custoHoraImpressora || "";

            }

            if (campoPrecoVendaProduto) {

                campoPrecoVendaProduto.value =
                    produto.precoVenda || "";

            }

            if (listaFilamentosProduto) {

                listaFilamentosProduto.innerHTML =
                    "";

                if (
                    Array.isArray(
                        produto.filamentos
                    ) &&
                    produto.filamentos.length > 0
                ) {

                    produto.filamentos.forEach(
                        function (filamento) {

                            adicionarLinhaFilamentoProduto({

                                filamentoId:
                                    filamento.filamentoId,

                                quantidade:
                                    filamento.quantidade

                            });

                        }
                    );

                } else {

                    adicionarLinhaFilamentoProduto();

                }

            }

            if (listaAcessoriosProduto) {

                listaAcessoriosProduto.innerHTML =
                    "";

                if (
                    Array.isArray(
                        produto.acessorios
                    ) &&
                    produto.acessorios.length > 0
                ) {

                    produto.acessorios.forEach(
                        function (acessorio) {

                            adicionarLinhaAcessorioProduto({

                                acessorioId:
                                    acessorio.acessorioId,

                                quantidade:
                                    acessorio.quantidade

                            });

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
                        produto.embalagens
                    ) &&
                    produto.embalagens.length > 0
                ) {

                    produto.embalagens.forEach(
                        function (embalagem) {

                            adicionarLinhaEmbalagemProduto({

                                embalagemId:
                                    embalagem.embalagemId,

                                quantidade:
                                    embalagem.quantidade

                            });

                        }
                    );

                } else {

                    adicionarLinhaEmbalagemProduto();

                }

            }

            if (botaoSalvarProdutoProduzido) {

                botaoSalvarProdutoProduzido.textContent =
                    "Atualizar Produção";

            }

            atualizarCalculosProduto();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        };

    // ==================================================
    // EXCLUIR LOTE PRODUZIDO
    // ==================================================

    window.excluirProdutoProduzido =
        function (id) {

            const produto =
                produtosProduzidos.find(
                    function (item) {

                        return item.id === id;

                    }
                );

            if (!produto) {

                alert(
                    "Lote produzido não encontrado."
                );

                return;

            }

            const possuiSaidas =
                movimentacoesProdutos.some(
                    function (movimentacao) {

                        return (
                            movimentacao.produtoId ===
                            id &&
                            movimentacao.tipo !==
                            "Entrada por produção"
                        );

                    }
                );

            if (possuiSaidas) {

                alert(
                    "Este lote já possui movimentações e não pode ser excluído."
                );

                return;

            }

            const confirmar =
                confirm(
                    'Deseja excluir o lote "' +
                    (produto.lote || "") +
                    '" do produto "' +
                    (produto.nome || "") +
                    '"?\n\n' +
                    "A exclusão não devolverá automaticamente os insumos ao estoque."
                );

            if (!confirmar) {
                return;
            }

            produtosProduzidos =
                produtosProduzidos.filter(
                    function (item) {

                        return item.id !== id;

                    }
                );

            movimentacoesProdutos =
                movimentacoesProdutos.filter(
                    function (movimentacao) {

                        return (
                            movimentacao.produtoId !==
                            id
                        );

                    }
                );

            salvarProdutosProduzidos();

            salvarMovimentacoesProdutos();

            if (
                produtoProduzidoEmEdicaoId ===
                id
            ) {

                limparFormularioProdutoProduzido();

            }

            mostrarProdutosProduzidos();

            atualizarResumoProdutosProduzidos();

            if (
                typeof atualizarDashboardCompleto ===
                "function"
            ) {

                atualizarDashboardCompleto();

            }

            if (
                typeof atualizarRelatorios ===
                "function"
            ) {

                atualizarRelatorios();

            }

            alert(
                "Lote excluído com sucesso."
            );

        };
            // ==================================================
    // ELEMENTOS DO FORMULÁRIO DE ORÇAMENTO
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

    const campoQuantidadeOrcamento =
        document.getElementById(
            "orcamento-quantidade"
        );

    const campoDescricaoOrcamento =
        document.getElementById(
            "orcamento-descricao"
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

    const campoMargemDesejadaOrcamento =
        document.getElementById(
            "orcamento-margem-desejada"
        );

    const campoPrecoSugeridoOrcamento =
        document.getElementById(
            "orcamento-preco-sugerido"
        );

    const campoPrecoFinalOrcamento =
        document.getElementById(
            "orcamento-preco-final"
        );

    const campoValorTotalOrcamento =
        document.getElementById(
            "orcamento-valor-total"
        );

    const campoMargemRealOrcamento =
        document.getElementById(
            "orcamento-margem-real"
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

    // ==================================================
    // ELEMENTOS DO RESUMO DOS ORÇAMENTOS
    // ==================================================

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
    // ENCONTRAR CLIENTE
    // ==================================================

    function encontrarClientePorId(id) {

        return clientesDisponiveis.find(
            function (cliente) {

                return String(cliente.id) ===
                    String(id);

            }
        );

    }

    // ==================================================
    // CALCULAR TEMPO DO ORÇAMENTO
    // ==================================================

    function calcularTempoOrcamento() {

        const horas =
            limitarNumero(
                campoHorasOrcamento
                    ? campoHorasOrcamento.value
                    : 0,
                0
            );

        const minutos =
            limitarNumero(
                campoMinutosOrcamento
                    ? campoMinutosOrcamento.value
                    : 0,
                0,
                59
            );

        return {

            horas: horas,

            minutos: minutos,

            horasDecimais:
                horas +
                minutos / 60

        };

    }

    // ==================================================
    // ATUALIZAR CÁLCULOS DO ORÇAMENTO
    // ==================================================

    function atualizarCalculosOrcamento() {

        const filamentos =
            obterFilamentosSelecionadosOrcamento();

        const acessorios =
            obterAcessoriosSelecionadosOrcamento();

        const embalagens =
            obterEmbalagensSelecionadasOrcamento();

        const custoFilamentos =
            somarCampoLista(
                filamentos,
                "custoTotal"
            );

        const custoAcessorios =
            somarCampoLista(
                acessorios,
                "custoTotal"
            );

        const custoEmbalagens =
            somarCampoLista(
                embalagens,
                "custoTotal"
            );

        const custoInsumos =
            custoFilamentos +
            custoAcessorios +
            custoEmbalagens;

        const tempo =
            calcularTempoOrcamento();

        const potencia =
            limitarNumero(
                campoPotenciaOrcamento
                    ? campoPotenciaOrcamento.value
                    : 0,
                0
            );

        const tarifa =
            limitarNumero(
                campoTarifaOrcamento
                    ? campoTarifaOrcamento.value
                    : 0,
                0
            );

        const custoHora =
            limitarNumero(
                campoCustoHoraOrcamento
                    ? campoCustoHoraOrcamento.value
                    : 0,
                0
            );

        const consumoKwh =
            potencia /
            1000 *
            tempo.horasDecimais;

        const custoEnergia =
            consumoKwh *
            tarifa;

        const custoMaquina =
            tempo.horasDecimais *
            custoHora;

        const custoTotal =
            custoInsumos +
            custoEnergia +
            custoMaquina;

        const quantidade =
            limitarNumero(
                campoQuantidadeOrcamento
                    ? campoQuantidadeOrcamento.value
                    : 0,
                0
            );

        const custoUnitario =
            quantidade > 0
                ? custoTotal /
                    quantidade
                : 0;

        const margemDesejada =
            limitarNumero(
                campoMargemDesejadaOrcamento
                    ? campoMargemDesejadaOrcamento.value
                    : 0,
                0
            );

        const divisorMargem =
            1 -
            margemDesejada / 100;

        const precoSugerido =
            divisorMargem > 0
                ? custoUnitario /
                    divisorMargem
                : custoUnitario;

        const precoFinal =
            limitarNumero(
                campoPrecoFinalOrcamento
                    ? campoPrecoFinalOrcamento.value
                    : 0,
                0
            );

        const valorTotal =
            precoFinal *
            quantidade;

        const margemReal =
            calcularMargemProduto(
                precoFinal,
                custoUnitario
            );

        if (campoCustoInsumosOrcamento) {

            campoCustoInsumosOrcamento.value =
                formatarDinheiroProduto(
                    custoInsumos
                );

        }

        if (campoCustoEnergiaOrcamento) {

            campoCustoEnergiaOrcamento.value =
                formatarDinheiroProduto(
                    custoEnergia
                );

        }

        if (campoCustoMaquinaOrcamento) {

            campoCustoMaquinaOrcamento.value =
                formatarDinheiroProduto(
                    custoMaquina
                );

        }

        if (campoCustoTotalOrcamento) {

            campoCustoTotalOrcamento.value =
                formatarDinheiroProduto(
                    custoTotal
                );

        }

        if (campoCustoUnitarioOrcamento) {

            campoCustoUnitarioOrcamento.value =
                formatarDinheiroProduto(
                    custoUnitario
                );

        }

        if (campoPrecoSugeridoOrcamento) {

            campoPrecoSugeridoOrcamento.value =
                formatarDinheiroProduto(
                    precoSugerido
                );

        }

        if (campoValorTotalOrcamento) {

            campoValorTotalOrcamento.value =
                formatarDinheiroProduto(
                    valorTotal
                );

        }

        if (campoMargemRealOrcamento) {

            campoMargemRealOrcamento.value =
                formatarNumeroProduto(
                    margemReal,
                    2
                ) +
                "%";

        }

        return {

            filamentos:
                filamentos,

            acessorios:
                acessorios,

            embalagens:
                embalagens,

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
                potencia,

            tarifaEnergia:
                tarifa,

            consumoKwh:
                consumoKwh,

            custoEnergia:
                custoEnergia,

            custoHoraImpressora:
                custoHora,

            custoMaquina:
                custoMaquina,

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

    // ==================================================
    // VALIDAR ORÇAMENTO
    // ==================================================

    function validarOrcamento(
        calculos
    ) {

        const nome =
            campoNomeProdutoOrcamento
                ? campoNomeProdutoOrcamento
                    .value
                    .trim()
                : "";

        if (!nome) {

            alert(
                "Informe o nome do produto do orçamento."
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

        if (
            calculos.filamentos.length === 0
        ) {

            alert(
                "Adicione pelo menos um filamento estimado."
            );

            return false;

        }

        if (
            possuiItensRepetidos(
                calculos.filamentos,
                "filamentoId"
            )
        ) {

            alert(
                "O mesmo lote de filamento foi incluído mais de uma vez."
            );

            return false;

        }

        if (
            possuiItensRepetidos(
                calculos.acessorios,
                "acessorioId"
            )
        ) {

            alert(
                "O mesmo acessório foi incluído mais de uma vez."
            );

            return false;

        }

        if (
            possuiItensRepetidos(
                calculos.embalagens,
                "embalagemId"
            )
        ) {

            alert(
                "A mesma embalagem foi incluída mais de uma vez."
            );

            return false;

        }

        if (
            calculos.precoFinal < 0
        ) {

            alert(
                "Informe um preço final válido."
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
            encontrarClientePorId(
                clienteId
            );

        const impressoraId =
            campoImpressoraOrcamento
                ? campoImpressoraOrcamento.value
                : "";

        const impressora =
            encontrarImpressoraPorId(
                impressoraId
            );

        return {

            id:
                orcamentoEmEdicaoId ??
                criarIdProduto(),

            clienteId:
                cliente
                    ? cliente.id
                    : "",

            clienteNome:
                cliente
                    ? cliente.nome
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
                    ? obterTextoImpressora(
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

    function salvarOrcamentoProduto() {

        recarregarDadosDeApoio();

        const calculos =
            atualizarCalculosOrcamento();

        if (
            !validarOrcamento(
                calculos
            )
        ) {
            return;
        }

        const estavaEditando =
            orcamentoEmEdicaoId !==
            null;

        const orcamento =
            criarObjetoOrcamento(
                calculos
            );

        if (estavaEditando) {

            const indice =
                orcamentos.findIndex(
                    function (item) {

                        return item.id ===
                            orcamentoEmEdicaoId;

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
            estavaEditando
                ? "Orçamento atualizado com sucesso!"
                : "Orçamento cadastrado com sucesso!"
        );

    }

    // ==================================================
    // LIMPAR FORMULÁRIO DO ORÇAMENTO
    // ==================================================

    function limparFormularioOrcamento() {

        if (campoClienteOrcamento) {
            campoClienteOrcamento.value = "";
        }

        if (campoDataOrcamento) {

            campoDataOrcamento.value =
                obterDataHojeProduto();

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

        if (listaFilamentosOrcamento) {

            listaFilamentosOrcamento.innerHTML =
                "";

            adicionarLinhaFilamentoOrcamento();

        }

        if (listaAcessoriosOrcamento) {

            listaAcessoriosOrcamento.innerHTML =
                "";

            adicionarLinhaAcessorioOrcamento();

        }

        if (listaEmbalagensOrcamento) {

            listaEmbalagensOrcamento.innerHTML =
                "";

            adicionarLinhaEmbalagemOrcamento();

        }

        orcamentoEmEdicaoId =
            null;

        if (botaoSalvarOrcamento) {

            botaoSalvarOrcamento.textContent =
                "Salvar Orçamento";

        }

        atualizarSelectsProduto();

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
                        "Aguardando resposta"
                    ].includes(
                        orcamento.status
                    );

                }
            ).length;

        const aprovados =
            orcamentos.filter(
                function (orcamento) {

                    return orcamento.status ===
                        "Aprovado";

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
    // MOSTRAR ORÇAMENTOS
    // ==================================================

    function mostrarOrcamentos() {

        if (!listaOrcamentos) {
            return;
        }

        if (orcamentos.length === 0) {

            listaOrcamentos.innerHTML =
                "<p>Nenhum orçamento cadastrado.</p>";

            atualizarResumoOrcamentos();

            return;

        }

        const listaOrdenada =
            [...orcamentos].sort(
                function (a, b) {

                    return (
                        String(b.data || "")
                            .localeCompare(
                                String(a.data || "")
                            )
                    );

                }
            );

        listaOrcamentos.innerHTML =
            listaOrdenada
                .map(
                    function (orcamento) {

                        return `
                            <div class="card-item">

                                <h4>
                                    ${escaparTexto(
                                        orcamento.produtoNome ||
                                        "Produto não informado"
                                    )}
                                </h4>

                                <p>
                                    <strong>Cliente:</strong>
                                    ${escaparTexto(
                                        orcamento.clienteNome ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Data:</strong>
                                    ${formatarDataProduto(
                                        orcamento.data
                                    )}
                                </p>

                                <p>
                                    <strong>Validade:</strong>
                                    ${formatarDataProduto(
                                        orcamento.validade
                                    )}
                                </p>

                                <p>
                                    <strong>Status:</strong>
                                    ${escaparTexto(
                                        orcamento.status ||
                                        "Rascunho"
                                    )}
                                </p>

                                <p>
                                    <strong>Quantidade:</strong>
                                    ${formatarNumeroProduto(
                                        orcamento.quantidade,
                                        0
                                    )}
                                </p>

                                <p>
                                    <strong>Custo unitário estimado:</strong>
                                    ${formatarDinheiroProduto(
                                        orcamento.custoUnitario
                                    )}
                                </p>

                                <p>
                                    <strong>Preço sugerido:</strong>
                                    ${formatarDinheiroProduto(
                                        orcamento.precoSugerido
                                    )}
                                </p>

                                <p>
                                    <strong>Preço final:</strong>
                                    ${formatarDinheiroProduto(
                                        orcamento.precoFinal
                                    )}
                                </p>

                                <p>
                                    <strong>Valor total:</strong>
                                    ${formatarDinheiroProduto(
                                        orcamento.valorTotal
                                    )}
                                </p>

                                <p>
                                    <strong>Margem real:</strong>
                                    ${formatarNumeroProduto(
                                        orcamento.margemReal,
                                        2
                                    )}%
                                </p>

                                <div class="acoes-card">

                                    <button
                                        type="button"
                                        class="botao-principal"
                                        onclick="editarOrcamentoProduto(
                                            ${orcamento.id}
                                        )">
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        class="botao-excluir"
                                        onclick="excluirOrcamentoProduto(
                                            ${orcamento.id}
                                        )">
                                        Excluir
                                    </button>

                                </div>

                            </div>
                        `;

                    }
                )
                .join("");

        atualizarResumoOrcamentos();

    }

    // ==================================================
    // EVENTOS DOS CAMPOS DO ORÇAMENTO
    // ==================================================

    [
        campoQuantidadeOrcamento,
        campoHorasOrcamento,
        campoMinutosOrcamento,
        campoPotenciaOrcamento,
        campoTarifaOrcamento,
        campoCustoHoraOrcamento,
        campoMargemDesejadaOrcamento,
        campoPrecoFinalOrcamento
    ].forEach(
        function (campo) {

            if (!campo) {
                return;
            }

            campo.addEventListener(
                "input",
                atualizarCalculosOrcamento
            );

            campo.addEventListener(
                "change",
                atualizarCalculosOrcamento
            );

        }
    );

    if (botaoSalvarOrcamento) {

        botaoSalvarOrcamento.addEventListener(
            "click",
            salvarOrcamentoProduto
        );

    }

    if (botaoLimparOrcamento) {

        botaoLimparOrcamento.addEventListener(
            "click",
            limparFormularioOrcamento
        );

    }

    // ==================================================
    // PRIMEIRA EXIBIÇÃO DOS ORÇAMENTOS
    // ==================================================

    mostrarOrcamentos();

    atualizarResumoOrcamentos();

    if (campoDataOrcamento) {

        campoDataOrcamento.value =
            campoDataOrcamento.value ||
            obterDataHojeProduto();

    }

    atualizarCalculosOrcamento();
        // ==================================================
    // CONTROLE DO ORÇAMENTO ENVIADO PARA PRODUÇÃO
    // ==================================================

    let orcamentoOrigemProducaoId =
        null;

    // ==================================================
    // GARANTIR STATUS ADICIONAIS
    // ==================================================

    function adicionarStatusOrcamento(
        valor,
        texto
    ) {

        if (!campoStatusOrcamento) {
            return;
        }

        const existe =
            Array.from(
                campoStatusOrcamento.options
            ).some(
                function (option) {

                    return option.value === valor;

                }
            );

        if (existe) {
            return;
        }

        const option =
            document.createElement(
                "option"
            );

        option.value = valor;
        option.textContent = texto;

        campoStatusOrcamento.appendChild(
            option
        );

    }

    adicionarStatusOrcamento(
        "Aguardando produção",
        "Aguardando produção"
    );

    adicionarStatusOrcamento(
        "Produzido",
        "Produzido"
    );

    // ==================================================
    // PREENCHER FILAMENTOS DO ORÇAMENTO
    // ==================================================

    function preencherFilamentosOrcamento(
        filamentos
    ) {

        if (!listaFilamentosOrcamento) {
            return;
        }

        listaFilamentosOrcamento.innerHTML =
            "";

        if (
            Array.isArray(filamentos) &&
            filamentos.length > 0
        ) {

            filamentos.forEach(
                function (filamento) {

                    adicionarLinhaFilamentoOrcamento({

                        filamentoId:
                            filamento.filamentoId,

                        quantidade:
                            filamento.quantidade

                    });

                }
            );

        } else {

            adicionarLinhaFilamentoOrcamento();

        }

    }

    // ==================================================
    // PREENCHER ACESSÓRIOS DO ORÇAMENTO
    // ==================================================

    function preencherAcessoriosOrcamento(
        acessorios
    ) {

        if (!listaAcessoriosOrcamento) {
            return;
        }

        listaAcessoriosOrcamento.innerHTML =
            "";

        if (
            Array.isArray(acessorios) &&
            acessorios.length > 0
        ) {

            acessorios.forEach(
                function (acessorio) {

                    adicionarLinhaAcessorioOrcamento({

                        acessorioId:
                            acessorio.acessorioId,

                        quantidade:
                            acessorio.quantidade

                    });

                }
            );

        } else {

            adicionarLinhaAcessorioOrcamento();

        }

    }

    // ==================================================
    // PREENCHER EMBALAGENS DO ORÇAMENTO
    // ==================================================

    function preencherEmbalagensOrcamento(
        embalagens
    ) {

        if (!listaEmbalagensOrcamento) {
            return;
        }

        listaEmbalagensOrcamento.innerHTML =
            "";

        if (
            Array.isArray(embalagens) &&
            embalagens.length > 0
        ) {

            embalagens.forEach(
                function (embalagem) {

                    adicionarLinhaEmbalagemOrcamento({

                        embalagemId:
                            embalagem.embalagemId,

                        quantidade:
                            embalagem.quantidade

                    });

                }
            );

        } else {

            adicionarLinhaEmbalagemOrcamento();

        }

    }

    // ==================================================
    // EDITAR ORÇAMENTO
    // ==================================================

    window.editarOrcamentoProduto =
        function (id) {

            recarregarDadosDeApoio();

            const orcamento =
                orcamentos.find(
                    function (item) {

                        return item.id === id;

                    }
                );

            if (!orcamento) {

                alert(
                    "Orçamento não encontrado."
                );

                return;

            }

            orcamentoEmEdicaoId =
                id;

            abrirAbaProduto(
                "aba-orcamentos"
            );

            preencherSelectClientes(
                campoClienteOrcamento,
                orcamento.clienteId || ""
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

                campoStatusOrcamento.value =
                    orcamento.status ||
                    "Rascunho";

            }

            if (campoNomeProdutoOrcamento) {

                campoNomeProdutoOrcamento.value =
                    orcamento.produtoNome || "";

            }

            if (campoQuantidadeOrcamento) {

                campoQuantidadeOrcamento.value =
                    orcamento.quantidade || "";

            }

            if (campoDescricaoOrcamento) {

                campoDescricaoOrcamento.value =
                    orcamento.descricao || "";

            }

            preencherFilamentosOrcamento(
                orcamento.filamentos
            );

            preencherAcessoriosOrcamento(
                orcamento.acessorios
            );

            preencherEmbalagensOrcamento(
                orcamento.embalagens
            );

            preencherSelectImpressoras(
                campoImpressoraOrcamento,
                orcamento.impressoraId || ""
            );

            if (campoHorasOrcamento) {

                campoHorasOrcamento.value =
                    orcamento.horas || "";

            }

            if (campoMinutosOrcamento) {

                campoMinutosOrcamento.value =
                    orcamento.minutos || "";

            }

            if (campoPotenciaOrcamento) {

                campoPotenciaOrcamento.value =
                    orcamento.potenciaWatts || "";

            }

            if (campoTarifaOrcamento) {

                campoTarifaOrcamento.value =
                    orcamento.tarifaEnergia || "";

            }

            if (campoCustoHoraOrcamento) {

                campoCustoHoraOrcamento.value =
                    orcamento.custoHoraImpressora ||
                    "";

            }

            if (campoMargemDesejadaOrcamento) {

                campoMargemDesejadaOrcamento.value =
                    orcamento.margemDesejada || "";

            }

            if (campoPrecoFinalOrcamento) {

                campoPrecoFinalOrcamento.value =
                    orcamento.precoFinal || "";

            }

            if (campoObservacoesOrcamento) {

                campoObservacoesOrcamento.value =
                    orcamento.observacoes || "";

            }

            if (botaoSalvarOrcamento) {

                botaoSalvarOrcamento.textContent =
                    "Atualizar Orçamento";

            }

            atualizarCalculosOrcamento();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        };

    // ==================================================
    // EXCLUIR ORÇAMENTO
    // ==================================================

    window.excluirOrcamentoProduto =
        function (id) {

            const orcamento =
                orcamentos.find(
                    function (item) {

                        return item.id === id;

                    }
                );

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
                    'Deseja excluir o orçamento de "' +
                    (
                        orcamento.produtoNome ||
                        "produto não informado"
                    ) +
                    '"?'
                );

            if (!confirmar) {
                return;
            }

            orcamentos =
                orcamentos.filter(
                    function (item) {

                        return item.id !== id;

                    }
                );

            salvarOrcamentos();

            if (
                orcamentoEmEdicaoId === id
            ) {

                limparFormularioOrcamento();

            }

            mostrarOrcamentos();

            atualizarResumoOrcamentos();

            alert(
                "Orçamento excluído com sucesso."
            );

        };

    // ==================================================
    // ALTERAR STATUS DO ORÇAMENTO
    // ==================================================

    function alterarStatusOrcamento(
        id,
        novoStatus
    ) {

        const orcamento =
            orcamentos.find(
                function (item) {

                    return item.id === id;

                }
            );

        if (!orcamento) {

            alert(
                "Orçamento não encontrado."
            );

            return null;

        }

        orcamento.status =
            novoStatus;

        orcamento.atualizadoEm =
            new Date().toISOString();

        salvarOrcamentos();

        mostrarOrcamentos();

        atualizarResumoOrcamentos();

        return orcamento;

    }

    // ==================================================
    // APROVAR ORÇAMENTO
    // ==================================================

    window.aprovarOrcamentoProduto =
        function (id) {

            const orcamento =
                orcamentos.find(
                    function (item) {

                        return item.id === id;

                    }
                );

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

            alterarStatusOrcamento(
                id,
                "Aguardando produção"
            );

            alert(
                "Orçamento aprovado e enviado para a fila de produção."
            );

        };

    // ==================================================
    // GERAR CÓDIGO DO LOTE
    // ==================================================

    function gerarCodigoLoteOrcamento(
        orcamento
    ) {

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

        const finalId =
            String(
                orcamento.id
            ).slice(-4);

        return (
            "PROD-" +
            ano +
            mes +
            dia +
            "-" +
            finalId
        );

    }

    // ==================================================
    // ENVIAR ORÇAMENTO PARA PRODUÇÃO
    // ==================================================

    window.enviarOrcamentoParaProducao =
        function (id) {

            recarregarDadosDeApoio();

            const orcamento =
                orcamentos.find(
                    function (item) {

                        return item.id === id;

                    }
                );

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

            orcamentoOrigemProducaoId =
                orcamento.id;

            orcamento.status =
                "Aguardando produção";

            orcamento.atualizadoEm =
                new Date().toISOString();

            salvarOrcamentos();

            abrirAbaProduto(
                "aba-produtos-produzidos"
            );

            produtoProduzidoEmEdicaoId =
                null;

            if (campoNomeProdutoProduzido) {

                campoNomeProdutoProduzido.value =
                    orcamento.produtoNome || "";

            }

            if (campoCategoriaProdutoProduzido) {

                campoCategoriaProdutoProduzido.value =
                    "";

            }

            if (campoLoteProdutoProduzido) {

                campoLoteProdutoProduzido.value =
                    gerarCodigoLoteOrcamento(
                        orcamento
                    );

            }

            if (campoDataProdutoProduzido) {

                campoDataProdutoProduzido.value =
                    obterDataHojeProduto();

            }

            if (campoQuantidadeProduzida) {

                campoQuantidadeProduzida.value =
                    orcamento.quantidade || "";

            }

            if (campoQuantidadeDisponivel) {

                campoQuantidadeDisponivel.value =
                    orcamento.quantidade || 0;

            }

            if (campoDescricaoProdutoProduzido) {

                campoDescricaoProdutoProduzido.value =
                    orcamento.descricao || "";

            }

            if (campoObservacoesProdutoProduzido) {

                campoObservacoesProdutoProduzido.value =
                    orcamento.observacoes || "";

            }

            if (campoImpressoraProduto) {

                preencherSelectImpressoras(
                    campoImpressoraProduto,
                    orcamento.impressoraId || ""
                );

            }

            if (campoHorasImpressao) {

                campoHorasImpressao.value =
                    orcamento.horas || "";

            }

            if (campoMinutosImpressao) {

                campoMinutosImpressao.value =
                    orcamento.minutos || "";

            }

            if (campoPotenciaImpressora) {

                campoPotenciaImpressora.value =
                    orcamento.potenciaWatts || "";

            }

            if (campoTarifaEnergia) {

                campoTarifaEnergia.value =
                    orcamento.tarifaEnergia || "";

            }

            if (campoCustoHoraImpressora) {

                campoCustoHoraImpressora.value =
                    orcamento.custoHoraImpressora ||
                    "";

            }

            if (campoPrecoVendaProduto) {

                campoPrecoVendaProduto.value =
                    orcamento.precoFinal ||
                    orcamento.precoSugerido ||
                    "";

            }

            if (listaFilamentosProduto) {

                listaFilamentosProduto.innerHTML =
                    "";

                if (
                    Array.isArray(
                        orcamento.filamentos
                    ) &&
                    orcamento.filamentos.length > 0
                ) {

                    orcamento.filamentos.forEach(
                        function (filamento) {

                            adicionarLinhaFilamentoProduto({

                                filamentoId:
                                    filamento.filamentoId,

                                quantidade:
                                    filamento.quantidade

                            });

                        }
                    );

                } else {

                    adicionarLinhaFilamentoProduto();

                }

            }

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
                        function (acessorio) {

                            adicionarLinhaAcessorioProduto({

                                acessorioId:
                                    acessorio.acessorioId,

                                quantidade:
                                    acessorio.quantidade

                            });

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
                        function (embalagem) {

                            adicionarLinhaEmbalagemProduto({

                                embalagemId:
                                    embalagem.embalagemId,

                                quantidade:
                                    embalagem.quantidade

                            });

                        }
                    );

                } else {

                    adicionarLinhaEmbalagemProduto();

                }

            }

            if (botaoSalvarProdutoProduzido) {

                botaoSalvarProdutoProduzido.textContent =
                    "Confirmar Produção";

            }

            atualizarCalculosProduto();

            mostrarOrcamentos();

            atualizarResumoOrcamentos();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            alert(
                "Dados do orçamento copiados para a produção. Confira os consumos reais antes de confirmar."
            );

        };

    // ==================================================
    // ADICIONAR NOVOS BOTÕES AOS ORÇAMENTOS
    // ==================================================

    const mostrarOrcamentosOriginal =
        mostrarOrcamentos;

    mostrarOrcamentos =
        function () {

            mostrarOrcamentosOriginal();

            if (!listaOrcamentos) {
                return;
            }

            const cards =
                listaOrcamentos.querySelectorAll(
                    ".card-item"
                );

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

            cards.forEach(
                function (card, indice) {

                    const orcamento =
                        listaOrdenada[indice];

                    if (!orcamento) {
                        return;
                    }

                    const areaAcoes =
                        card.querySelector(
                            ".acoes-card"
                        );

                    if (!areaAcoes) {
                        return;
                    }

                    if (
                        orcamento.status !==
                        "Produzido"
                    ) {

                        const botaoAprovar =
                            document.createElement(
                                "button"
                            );

                        botaoAprovar.type =
                            "button";

                        botaoAprovar.textContent =
                            "Aprovar";

                        botaoAprovar.addEventListener(
                            "click",
                            function () {

                                window
                                    .aprovarOrcamentoProduto(
                                        orcamento.id
                                    );

                            }
                        );

                        areaAcoes.prepend(
                            botaoAprovar
                        );

                        const botaoProduzir =
                            document.createElement(
                                "button"
                            );

                        botaoProduzir.type =
                            "button";

                        botaoProduzir.className =
                            "botao-principal";

                        botaoProduzir.textContent =
                            "Enviar para Produção";

                        botaoProduzir.addEventListener(
                            "click",
                            function () {

                                window
                                    .enviarOrcamentoParaProducao(
                                        orcamento.id
                                    );

                            }
                        );

                        areaAcoes.prepend(
                            botaoProduzir
                        );

                    }

                }
            );

        };

    // ==================================================
    // ATUALIZAR A LISTA COM OS NOVOS BOTÕES
    // ==================================================

    mostrarOrcamentos();
        // ==================================================
    // ELEMENTOS — PEÇAS COM FALHA
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

    const listaPerdasProdutos =
        document.getElementById(
            "lista-perdas-produtos"
        );

    const campoPerdasTotalRegistros =
        document.getElementById(
            "perdas-total-registros"
        );

    const campoPerdasTotalUnidades =
        document.getElementById(
            "perdas-total-unidades"
        );

    const campoPerdasCustoTotal =
        document.getElementById(
            "perdas-custo-total"
        );

    const campoPerdasTotalReaproveitaveis =
        document.getElementById(
            "perdas-total-reaproveitaveis"
        );

    // ==================================================
    // ENCONTRAR PRODUTO PRODUZIDO
    // ==================================================

    function encontrarProdutoProduzidoPorId(id) {

        return produtosProduzidos.find(
            function (produto) {

                return String(produto.id) ===
                    String(id);

            }
        );

    }

    // ==================================================
    // PREENCHER SELECT DE LOTES PARA PERDA
    // ==================================================

    function preencherSelectLotesPerda(
        valorSelecionado
    ) {

        if (!campoPerdaProdutoLote) {
            return;
        }

        campoPerdaProdutoLote.innerHTML =
            '<option value="">' +
            "Selecione o lote produzido" +
            "</option>";

        produtosProduzidos
            .filter(
                function (produto) {

                    return (
                        converterNumero(
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
                        " — lote " +
                        (
                            produto.lote ||
                            "não informado"
                        ) +
                        " — " +
                        formatarNumeroProduto(
                            produto.quantidadeDisponivel,
                            0
                        ) +
                        " disponíveis";

                    if (
                        String(valorSelecionado) ===
                        String(produto.id)
                    ) {

                        option.selected = true;

                    }

                    campoPerdaProdutoLote
                        .appendChild(option);

                }
            );

    }

    // ==================================================
    // CALCULAR CUSTO DA PERDA
    // ==================================================

    function atualizarCalculosPerda() {

        const produto =
            encontrarProdutoProduzidoPorId(
                campoPerdaProdutoLote
                    ? campoPerdaProdutoLote.value
                    : ""
            );

        const quantidade =
            limitarNumero(
                campoPerdaQuantidade
                    ? campoPerdaQuantidade.value
                    : 0,
                0
            );

        const custoUnitario =
            produto
                ? converterNumero(
                    produto.custoUnitario
                )
                : 0;

        const custoTotal =
            quantidade *
            custoUnitario;

        if (campoPerdaCustoUnitario) {

            campoPerdaCustoUnitario.value =
                formatarDinheiroProduto(
                    custoUnitario
                );

        }

        if (campoPerdaCustoTotal) {

            campoPerdaCustoTotal.value =
                formatarDinheiroProduto(
                    custoTotal
                );

        }

        return {

            produto: produto,

            quantidade: quantidade,

            custoUnitario:
                custoUnitario,

            custoTotal:
                custoTotal,

            quantidadeReaproveitavel:
                limitarNumero(
                    campoPerdaQuantidadeReaproveitavel
                        ? campoPerdaQuantidadeReaproveitavel.value
                        : 0,
                    0
                )

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

        if (!campoPerdaData?.value) {

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
            converterNumero(
                calculos.produto
                    .quantidadeDisponivel
            );

        if (
            calculos.quantidade >
            quantidadeDisponivel
        ) {

            alert(
                "A quantidade da perda é maior que o estoque disponível.\n\n" +
                "Disponível: " +
                formatarNumeroProduto(
                    quantidadeDisponivel,
                    0
                ) +
                "\nInformado: " +
                formatarNumeroProduto(
                    calculos.quantidade,
                    0
                )
            );

            return false;

        }

        if (!campoPerdaTipo?.value) {

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
            campoPerdaReaproveitavel?.value ===
                "Não" &&
            calculos.quantidadeReaproveitavel > 0
        ) {

            alert(
                'Se a peça não pode ser reaproveitada, informe "0" na quantidade reaproveitável.'
            );

            return false;

        }

        if (
            !campoPerdaMotivo?.value.trim()
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
                perdaEmEdicaoId ??
                criarIdProduto(),

            produtoId:
                produto.id,

            produtoNome:
                produto.nome || "",

            lote:
                produto.lote || "",

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
                calculos
                    .quantidadeReaproveitavel,

            custoUnitario:
                calculos.custoUnitario,

            custoTotal:
                calculos.custoTotal,

            motivo:
                campoPerdaMotivo
                    ? campoPerdaMotivo
                        .value
                        .trim()
                    : "",

            destino:
                campoPerdaDestino
                    ? campoPerdaDestino.value
                    : "Descarte",

            observacoes:
                campoPerdaObservacoes
                    ? campoPerdaObservacoes
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
    // REGISTRAR MOVIMENTAÇÃO DA PERDA
    // ==================================================

    function registrarMovimentacaoPerda(
        perda,
        quantidadeAnterior,
        quantidadePosterior
    ) {

        movimentacoesProdutos.push({

            id: criarIdProduto(),

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

        salvarMovimentacoesProdutos();

    }

    // ==================================================
    // SALVAR PERDA
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

        const estavaEditando =
            perdaEmEdicaoId !== null;

        const perda =
            criarObjetoPerda(
                calculos
            );

        if (estavaEditando) {

            const indice =
                perdasProdutos.findIndex(
                    function (item) {

                        return item.id ===
                            perdaEmEdicaoId;

                    }
                );

            if (indice === -1) {

                alert(
                    "Registro de perda não encontrado."
                );

                return;

            }

            const perdaAnterior =
                perdasProdutos[indice];

            perda.criadoEm =
                perdaAnterior.criadoEm ||
                perda.criadoEm;

            perdasProdutos[indice] =
                perda;

        } else {

            const produto =
                calculos.produto;

            const quantidadeAnterior =
                converterNumero(
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

            perdasProdutos.push(
                perda
            );

            salvarProdutosProduzidos();

            registrarMovimentacaoPerda(
                perda,
                quantidadeAnterior,
                quantidadePosterior
            );

        }

        salvarPerdasProdutos();

        mostrarPerdasProdutos();

        atualizarResumoPerdas();

        mostrarProdutosProduzidos();

        atualizarResumoProdutosProduzidos();

        preencherSelectLotesPerda();

        preencherSelectLotesConsumoProprio();

        limparFormularioPerda();

        if (
            typeof atualizarDashboardCompleto ===
            "function"
        ) {

            atualizarDashboardCompleto();

        }

        if (
            typeof atualizarRelatorios ===
            "function"
        ) {

            atualizarRelatorios();

        }

        alert(
            estavaEditando
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
                obterDataHojeProduto();

        }

        if (campoPerdaQuantidade) {
            campoPerdaQuantidade.value = "";
        }

        if (campoPerdaTipo) {
            campoPerdaTipo.value = "";
        }

        if (campoPerdaReaproveitavel) {
            campoPerdaReaproveitavel.value = "Não";
        }

        if (campoPerdaQuantidadeReaproveitavel) {
            campoPerdaQuantidadeReaproveitavel.value = "0";
        }

        if (campoPerdaMotivo) {
            campoPerdaMotivo.value = "";
        }

        if (campoPerdaDestino) {
            campoPerdaDestino.value = "Descarte";
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
            perdasProdutos.reduce(
                function (total, perda) {

                    return total +
                        converterNumero(
                            perda.quantidade
                        );

                },
                0
            );

        const custoTotal =
            perdasProdutos.reduce(
                function (total, perda) {

                    return total +
                        converterNumero(
                            perda.custoTotal
                        );

                },
                0
            );

        const totalReaproveitaveis =
            perdasProdutos.reduce(
                function (total, perda) {

                    return total +
                        converterNumero(
                            perda.quantidadeReaproveitavel
                        );

                },
                0
            );

        if (campoPerdasTotalRegistros) {

            campoPerdasTotalRegistros.textContent =
                perdasProdutos.length;

        }

        if (campoPerdasTotalUnidades) {

            campoPerdasTotalUnidades.textContent =
                formatarNumeroProduto(
                    totalUnidades,
                    0
                );

        }

        if (campoPerdasCustoTotal) {

            campoPerdasCustoTotal.textContent =
                formatarDinheiroProduto(
                    custoTotal
                );

        }

        if (campoPerdasTotalReaproveitaveis) {

            campoPerdasTotalReaproveitaveis.textContent =
                formatarNumeroProduto(
                    totalReaproveitaveis,
                    0
                );

        }

    }

    // ==================================================
    // MOSTRAR PERDAS
    // ==================================================

    function mostrarPerdasProdutos() {

        if (!listaPerdasProdutos) {
            return;
        }

        if (perdasProdutos.length === 0) {

            listaPerdasProdutos.innerHTML =
                "<p>Nenhuma perda registrada.</p>";

            atualizarResumoPerdas();

            return;

        }

        listaPerdasProdutos.innerHTML =
            [...perdasProdutos]
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
                                    ${escaparTexto(
                                        perda.produtoNome ||
                                        "Produto não informado"
                                    )}
                                </h4>

                                <p>
                                    <strong>Lote:</strong>
                                    ${escaparTexto(
                                        perda.lote ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Data:</strong>
                                    ${formatarDataProduto(
                                        perda.data
                                    )}
                                </p>

                                <p>
                                    <strong>Quantidade perdida:</strong>
                                    ${formatarNumeroProduto(
                                        perda.quantidade,
                                        0
                                    )}
                                </p>

                                <p>
                                    <strong>Tipo de falha:</strong>
                                    ${escaparTexto(
                                        perda.tipo ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Reaproveitável:</strong>
                                    ${escaparTexto(
                                        perda.reaproveitavel ||
                                        "Não"
                                    )}
                                </p>

                                <p>
                                    <strong>Quantidade reaproveitável:</strong>
                                    ${formatarNumeroProduto(
                                        perda.quantidadeReaproveitavel,
                                        0
                                    )}
                                </p>

                                <p>
                                    <strong>Custo total perdido:</strong>
                                    ${formatarDinheiroProduto(
                                        perda.custoTotal
                                    )}
                                </p>

                                <p>
                                    <strong>Destino:</strong>
                                    ${escaparTexto(
                                        perda.destino ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Descrição:</strong>
                                    ${escaparTexto(
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
    // EVENTOS DA PERDA
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
    // PRIMEIRO CARREGAMENTO DAS PERDAS
    // ==================================================

    preencherSelectLotesPerda();

    mostrarPerdasProdutos();

    atualizarResumoPerdas();

    if (campoPerdaData) {

        campoPerdaData.value =
            campoPerdaData.value ||
            obterDataHojeProduto();

    }

    atualizarCalculosPerda();
        // ==================================================
    // ELEMENTOS — CONSUMO PRÓPRIO
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

    const campoConsumoTotalRegistros =
        document.getElementById(
            "consumo-proprio-total-registros"
        );

    const campoConsumoTotalUnidades =
        document.getElementById(
            "consumo-proprio-total-unidades"
        );

    const campoConsumoCustoInternoTotal =
    document.getElementById(
        "consumo-proprio-custo-interno-total"
    );

    const campoConsumoItensEmUso =
        document.getElementById(
            "consumo-proprio-itens-em-uso"
        );

    // ==================================================
    // PREENCHER SELECT DOS LOTES
    // ==================================================

    function preencherSelectLotesConsumoProprio(
        valorSelecionado
    ) {

        if (!campoConsumoProdutoLote) {
            return;
        }

        campoConsumoProdutoLote.innerHTML =
            '<option value="">' +
            "Selecione o lote produzido" +
            "</option>";

        produtosProduzidos
            .filter(
                function (produto) {

                    return (
                        converterNumero(
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
                        " — lote " +
                        (
                            produto.lote ||
                            "não informado"
                        ) +
                        " — " +
                        formatarNumeroProduto(
                            produto.quantidadeDisponivel,
                            0
                        ) +
                        " disponíveis";

                    if (
                        String(valorSelecionado) ===
                        String(produto.id)
                    ) {

                        option.selected = true;

                    }

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
            encontrarProdutoProduzidoPorId(
                campoConsumoProdutoLote
                    ? campoConsumoProdutoLote.value
                    : ""
            );

        const quantidade =
            limitarNumero(
                campoConsumoQuantidade
                    ? campoConsumoQuantidade.value
                    : 0,
                0
            );

        const custoUnitario =
            produto
                ? converterNumero(
                    produto.custoUnitario
                )
                : 0;

        const custoTotal =
            quantidade *
            custoUnitario;

        if (campoConsumoCustoUnitario) {

            campoConsumoCustoUnitario.value =
                formatarDinheiroProduto(
                    custoUnitario
                );

        }

        if (campoConsumoCustoTotal) {

            campoConsumoCustoTotal.value =
                formatarDinheiroProduto(
                    custoTotal
                );

        }

        return {

            produto: produto,

            quantidade: quantidade,

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

        if (!campoConsumoData?.value) {

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
            converterNumero(
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
                formatarNumeroProduto(
                    quantidadeDisponivel,
                    0
                ) +
                "\nInformado: " +
                formatarNumeroProduto(
                    calculos.quantidade,
                    0
                )
            );

            return false;

        }

        if (!campoConsumoFinalidade?.value) {

            alert(
                "Selecione a finalidade do consumo próprio."
            );

            return false;

        }

        if (
            !campoConsumoDescricao?.value.trim()
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
                consumoProprioEmEdicaoId ??
                criarIdProduto(),

            produtoId:
                produto.id,

            produtoNome:
                produto.nome || "",

            lote:
                produto.lote || "",

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
                    ? campoConsumoLocal
                        .value
                        .trim()
                    : "",

            responsavel:
                campoConsumoResponsavel
                    ? campoConsumoResponsavel
                        .value
                        .trim()
                    : "",

            custoUnitario:
                calculos.custoUnitario,

            custoTotal:
                calculos.custoTotal,

            descricao:
                campoConsumoDescricao
                    ? campoConsumoDescricao
                        .value
                        .trim()
                    : "",

            observacoes:
                campoConsumoObservacoes
                    ? campoConsumoObservacoes
                        .value
                        .trim()
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
    // REGISTRAR MOVIMENTAÇÃO DO CONSUMO PRÓPRIO
    // ==================================================

    function registrarMovimentacaoConsumoProprio(
        consumo,
        quantidadeAnterior,
        quantidadePosterior
    ) {

        movimentacoesProdutos.push({

            id: criarIdProduto(),

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

        salvarMovimentacoesProdutos();

    }

    // ==================================================
    // SALVAR CONSUMO PRÓPRIO
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

        const estavaEditando =
            consumoProprioEmEdicaoId !==
            null;

        const consumo =
            criarObjetoConsumoProprio(
                calculos
            );

        if (estavaEditando) {

            const indice =
                consumosProprios.findIndex(
                    function (item) {

                        return item.id ===
                            consumoProprioEmEdicaoId;

                    }
                );

            if (indice === -1) {

                alert(
                    "Registro de consumo próprio não encontrado."
                );

                return;

            }

            const consumoAnterior =
                consumosProprios[indice];

            consumo.criadoEm =
                consumoAnterior.criadoEm ||
                consumo.criadoEm;

            consumosProprios[indice] =
                consumo;

        } else {

            const produto =
                calculos.produto;

            const quantidadeAnterior =
                converterNumero(
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

            salvarProdutosProduzidos();

            registrarMovimentacaoConsumoProprio(
                consumo,
                quantidadeAnterior,
                quantidadePosterior
            );

        }

        salvarConsumosProprios();

        mostrarConsumosProprios();

        atualizarResumoConsumoProprio();

        mostrarProdutosProduzidos();

        atualizarResumoProdutosProduzidos();

        preencherSelectLotesPerda();

        preencherSelectLotesConsumoProprio();

        limparFormularioConsumoProprio();

        if (
            typeof atualizarDashboardCompleto ===
            "function"
        ) {

            atualizarDashboardCompleto();

        }

        if (
            typeof atualizarRelatorios ===
            "function"
        ) {

            atualizarRelatorios();

        }

        alert(
            estavaEditando
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
                obterDataHojeProduto();

        }

        if (campoConsumoQuantidade) {
            campoConsumoQuantidade.value = "";
        }

        if (campoConsumoFinalidade) {
            campoConsumoFinalidade.value = "";
        }

        if (campoConsumoLocal) {
            campoConsumoLocal.value = "";
        }

        if (campoConsumoResponsavel) {
            campoConsumoResponsavel.value = "";
        }

        if (campoConsumoDescricao) {
            campoConsumoDescricao.value = "";
        }

        if (campoConsumoObservacoes) {
            campoConsumoObservacoes.value = "";
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

                    return total +
                        converterNumero(
                            consumo.quantidade
                        );

                },
                0
            );

        const custoTotal =
            consumosProprios.reduce(
                function (total, consumo) {

                    return total +
                        converterNumero(
                            consumo.custoTotal
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

        if (campoConsumoTotalRegistros) {

            campoConsumoTotalRegistros.textContent =
                consumosProprios.length;

        }

        if (campoConsumoTotalUnidades) {

            campoConsumoTotalUnidades.textContent =
                formatarNumeroProduto(
                    totalUnidades,
                    0
                );

        }

        if (campoConsumoCustoInternoTotal) {

            campoConsumoCustoInternoTotal.textContent =
                formatarDinheiroProduto(
                    custoTotal
                );

        }

        if (campoConsumoItensEmUso) {

            campoConsumoItensEmUso.textContent =
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

        if (consumosProprios.length === 0) {

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
                                    ${escaparTexto(
                                        consumo.produtoNome ||
                                        "Produto não informado"
                                    )}
                                </h4>

                                <p>
                                    <strong>Lote:</strong>
                                    ${escaparTexto(
                                        consumo.lote ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Data:</strong>
                                    ${formatarDataProduto(
                                        consumo.data
                                    )}
                                </p>

                                <p>
                                    <strong>Quantidade:</strong>
                                    ${formatarNumeroProduto(
                                        consumo.quantidade,
                                        0
                                    )}
                                </p>

                                <p>
                                    <strong>Finalidade:</strong>
                                    ${escaparTexto(
                                        consumo.finalidade ||
                                        "Não informada"
                                    )}
                                </p>

                                <p>
                                    <strong>Local de uso:</strong>
                                    ${escaparTexto(
                                        consumo.local ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Responsável:</strong>
                                    ${escaparTexto(
                                        consumo.responsavel ||
                                        "Não informado"
                                    )}
                                </p>

                                <p>
                                    <strong>Custo unitário:</strong>
                                    ${formatarDinheiroProduto(
                                        consumo.custoUnitario
                                    )}
                                </p>

                                <p>
                                    <strong>Custo interno total:</strong>
                                    ${formatarDinheiroProduto(
                                        consumo.custoTotal
                                    )}
                                </p>

                                <p>
                                    <strong>Descrição:</strong>
                                    ${escaparTexto(
                                        consumo.descricao ||
                                        "Não informada"
                                    )}
                                </p>

                                <p>
                                    <strong>Status:</strong>
                                    ${escaparTexto(
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
    // EVENTOS DO CONSUMO PRÓPRIO
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
    // PRIMEIRO CARREGAMENTO DO CONSUMO PRÓPRIO
    // ==================================================

    preencherSelectLotesConsumoProprio();

    mostrarConsumosProprios();

    atualizarResumoConsumoProprio();

    if (campoConsumoData) {

        campoConsumoData.value =
            campoConsumoData.value ||
            obterDataHojeProduto();

    }

    atualizarCalculosConsumoProprio();
        // ==================================================
    // MARCAR ORÇAMENTO COMO PRODUZIDO
    // ==================================================

    function marcarOrcamentoOrigemComoProduzido(
        produto
    ) {

        if (!orcamentoOrigemProducaoId) {
            return;
        }

        const orcamento =
            orcamentos.find(
                function (item) {

                    return String(item.id) ===
                        String(
                            orcamentoOrigemProducaoId
                        );

                }
            );

        if (!orcamento) {

            console.warn(
                "O orçamento de origem não foi encontrado."
            );

            return;

        }

        orcamento.status =
            "Produzido";

        orcamento.produtoProduzidoId =
            produto.id;

        orcamento.loteProduzido =
            produto.lote;

        orcamento.dataProducao =
            produto.dataProducao;

        orcamento.custoRealProducao =
            produto.custoTotalProducao;

        orcamento.custoUnitarioReal =
            produto.custoUnitario;

        orcamento.atualizadoEm =
            new Date().toISOString();

        salvarOrcamentos();

        mostrarOrcamentos();

        atualizarResumoOrcamentos();

    }

    // ==================================================
    // ATUALIZAR TODO O MÓDULO
    // ==================================================

    function atualizarModuloProduto() {

        recarregarDadosDeApoio();

        atualizarSelectsProduto();

        mostrarProdutosProduzidos();

        atualizarResumoProdutosProduzidos();

        mostrarOrcamentos();

        atualizarResumoOrcamentos();

        mostrarPerdasProdutos();

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
    // DISPONIBILIZAR ATUALIZAÇÃO PARA OUTROS MÓDULOS
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

                CHAVE_PRODUTOS_PRODUZIDOS,
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

                produtosProduzidos =
                    lerListaLocalStorage(
                        CHAVE_PRODUTOS_PRODUZIDOS
                    );

                orcamentos =
                    lerListaLocalStorage(
                        CHAVE_ORCAMENTOS
                    );

                perdasProdutos =
                    lerListaLocalStorage(
                        CHAVE_PERDAS
                    );

                consumosProprios =
                    lerListaLocalStorage(
                        CHAVE_CONSUMO_PROPRIO
                    );

                movimentacoesProdutos =
                    lerListaLocalStorage(
                        CHAVE_MOVIMENTACOES
                    );

                atualizarModuloProduto();

            }

        }
    );

    // ==================================================
    // INICIALIZAÇÃO FINAL
    // ==================================================

    atualizarModuloProduto();

    abrirAbaProduto(
        "aba-produtos-produzidos"
    );
}