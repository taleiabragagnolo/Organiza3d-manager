// ======================================================
// ORGANIZA 3D MANAGER
// sincronizacao.js
// Login e sincronizacao com o Supabase
// ======================================================

"use strict";

const ORGANIZA_SUPABASE_URL =
    "https://samgbekppquclgaaaxgs.supabase.co";

const ORGANIZA_SUPABASE_CHAVE =
    "sb_publishable_j4Ep3UXCuuvKdoXNJl5J2w_wH_iH-C4";

let organizaClienteSupabase = null;
let organizaUsuarioId = "";
let organizaSincronizacaoAtiva = false;
let organizaAlterandoLocalmente = false;
const organizaTemporizadores = new Map();

// ======================================================
// INICIALIZACAO
// ======================================================

async function iniciarSincronizacao() {

    if (
        !window.supabase ||
        typeof window.supabase.createClient !== "function"
    ) {
        throw new Error("Biblioteca do Supabase nao carregada.");
    }

    organizaClienteSupabase =
        window.supabase.createClient(
            ORGANIZA_SUPABASE_URL,
            ORGANIZA_SUPABASE_CHAVE
        );
configurarSaidaOrganiza();

    let resultadoSessao =
        await organizaClienteSupabase.auth.getSession();

    if (resultadoSessao.error) {
        throw resultadoSessao.error;
    }

    let sessao = resultadoSessao.data.session;

    if (!sessao) {
        sessao = await mostrarLoginOrganiza();
    }

    if (!sessao || !sessao.user) {
        return false;
    }

    organizaUsuarioId = sessao.user.id;

    await sincronizarDadosIniciais();

    instalarSincronizacaoAutomatica();
    
    organizaSincronizacaoAtiva = true;

    return true;
}

// ======================================================
// LOGIN
// ======================================================

function mostrarLoginOrganiza() {

    return new Promise(function (resolver) {

        const fundo = document.createElement("div");
        fundo.id = "organiza-login-fundo";

        fundo.innerHTML = `
            <form id="organiza-login-formulario">
                <h1>Organiza 3D</h1>
                <p>Entre para acessar seus dados</p>

                <label for="organiza-login-email">
                    E-mail
                </label>
                <input
                    id="organiza-login-email"
                    type="email"
                    autocomplete="username"
                    required
                >

                <label for="organiza-login-senha">
                    Senha
                </label>
                <input
                    id="organiza-login-senha"
                    type="password"
                    autocomplete="current-password"
                    required
                >

                <div id="organiza-login-mensagem"></div>

                <button type="submit">
                    Entrar
                </button>
            </form>
        `;

        const estilo = document.createElement("style");
        estilo.textContent = `
            #organiza-login-fundo {
                position: fixed;
                inset: 0;
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                background: #f5f3ee;
            }

            #organiza-login-formulario {
                width: min(420px, 100%);
                padding: 30px;
                border: 1px solid #d9d4ca;
                border-radius: 18px;
                background: #ffffff;
                box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
                color: #4a382b;
            }

            #organiza-login-formulario h1 {
                margin: 0 0 8px;
                color: #795438;
            }

            #organiza-login-formulario p {
                margin: 0 0 24px;
            }

            #organiza-login-formulario label {
                display: block;
                margin: 14px 0 6px;
                font-weight: 700;
            }

            #organiza-login-formulario input {
                box-sizing: border-box;
                width: 100%;
                min-height: 46px;
                padding: 10px 12px;
                border: 1px solid #cfc8bc;
                border-radius: 9px;
                font-size: 16px;
            }

            #organiza-login-formulario button {
                width: 100%;
                min-height: 48px;
                margin-top: 20px;
                border: 0;
                border-radius: 9px;
                background: #788b6b;
                color: #ffffff;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
            }

            #organiza-login-mensagem {
                min-height: 20px;
                margin-top: 12px;
                color: #b33a3a;
                font-size: 14px;
            }
        `;

        document.head.appendChild(estilo);
        document.body.appendChild(fundo);

        const formulario =
            document.getElementById(
                "organiza-login-formulario"
            );

        const mensagem =
            document.getElementById(
                "organiza-login-mensagem"
            );

        formulario.addEventListener(
            "submit",
            async function (evento) {

                evento.preventDefault();

                const botao =
                    formulario.querySelector("button");

                const email =
                    document.getElementById(
                        "organiza-login-email"
                    ).value.trim();

                const senha =
                    document.getElementById(
                        "organiza-login-senha"
                    ).value;

                botao.disabled = true;
                botao.textContent = "Entrando...";
                mensagem.textContent = "";

                const resultado =
                    await organizaClienteSupabase.auth
                        .signInWithPassword({
                            email,
                            password: senha
                        });

                if (resultado.error) {
                    mensagem.textContent =
                        "E-mail ou senha incorretos.";
                    botao.disabled = false;
                    botao.textContent = "Entrar";
                    return;
                }

                fundo.remove();
                estilo.remove();
                resolver(resultado.data.session);

            }
        );

    });
}

// ======================================================
// PRIMEIRA SINCRONIZACAO
// ======================================================

async function sincronizarDadosIniciais() {

    const resultado =
        await organizaClienteSupabase
            .from("organiza_dados")
            .select("chave, valor");

    if (resultado.error) {
        throw resultado.error;
    }

    const dadosNuvem = resultado.data || [];

    if (dadosNuvem.length === 0) {
        await enviarBaseLocalParaNuvem();
        return;
    }

    organizaAlterandoLocalmente = true;

    try {
        dadosNuvem.forEach(function (registro) {
            localStorage.setItem(
                registro.chave,
                registro.valor === null ? "" : registro.valor
            );
        });
    } finally {
        organizaAlterandoLocalmente = false;
    }
}

async function enviarBaseLocalParaNuvem() {

    const registros = [];

    for (let indice = 0; indice < localStorage.length; indice++) {

        const chave = localStorage.key(indice);

        if (!chavePodeSincronizar(chave)) {
            continue;
        }

        registros.push({
            usuario_id: organizaUsuarioId,
            chave,
            valor: localStorage.getItem(chave),
            atualizado_em: new Date().toISOString()
        });
    }

    if (registros.length === 0) {
        return;
    }

    const resultado =
        await organizaClienteSupabase
            .from("organiza_dados")
            .upsert(
                registros,
                { onConflict: "usuario_id,chave" }
            );

    if (resultado.error) {
        throw resultado.error;
    }
}

// ======================================================
// SINCRONIZACAO AUTOMATICA
// ======================================================

function instalarSincronizacaoAutomatica() {

    if (window.__organizaSincronizacaoInstalada) {
        return;
    }

    window.__organizaSincronizacaoInstalada = true;

    const salvarOriginal = Storage.prototype.setItem;
    const removerOriginal = Storage.prototype.removeItem;

    Storage.prototype.setItem = function (chave, valor) {

        salvarOriginal.call(this, chave, valor);

        if (
            this === localStorage &&
            organizaSincronizacaoAtiva &&
            !organizaAlterandoLocalmente &&
            chavePodeSincronizar(chave)
        ) {
            agendarEnvioChave(chave, String(valor));
        }
    };

    Storage.prototype.removeItem = function (chave) {

        removerOriginal.call(this, chave);

        if (
            this === localStorage &&
            organizaSincronizacaoAtiva &&
            !organizaAlterandoLocalmente &&
            chavePodeSincronizar(chave)
        ) {
            excluirChaveDaNuvem(chave);
        }
    };
}

function chavePodeSincronizar(chave) {

    if (!chave) {
        return false;
    }

    const texto = String(chave).toLowerCase();

    return !texto.startsWith("sb-");
}

function agendarEnvioChave(chave, valor) {

    if (organizaTemporizadores.has(chave)) {
        clearTimeout(organizaTemporizadores.get(chave));
    }

    const temporizador = setTimeout(
        async function () {

            organizaTemporizadores.delete(chave);

            const resultado =
                await organizaClienteSupabase
                    .from("organiza_dados")
                    .upsert(
                        {
                            usuario_id: organizaUsuarioId,
                            chave,
                            valor,
                            atualizado_em:
                                new Date().toISOString()
                        },
                        {
                            onConflict: "usuario_id,chave"
                        }
                    );

            if (resultado.error) {
                console.error(
                    "Erro ao sincronizar:",
                    chave,
                    resultado.error
                );
            }

        },
        500
    );

    organizaTemporizadores.set(chave, temporizador);
}

async function excluirChaveDaNuvem(chave) {

    const resultado =
        await organizaClienteSupabase
            .from("organiza_dados")
            .delete()
            .eq("usuario_id", organizaUsuarioId)
            .eq("chave", chave);

    if (resultado.error) {
        console.error(
            "Erro ao excluir dado sincronizado:",
            chave,
            resultado.error
        );
    }
}

// ======================================================
// SAIR
// ======================================================

function configurarSaidaOrganiza() {

    const botaoSair =
        document.getElementById("botao-sair");

    if (!botaoSair) {
        return;
    }

    botaoSair.addEventListener(
        "click",
        async function () {

            const confirmar = confirm(
                "Deseja sair do Organiza 3D?"
            );

            if (!confirmar) {
                return;
            }

            organizaSincronizacaoAtiva = false;

            await organizaClienteSupabase.auth.signOut();

            location.reload();
        }
    );
}