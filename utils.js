// =========================
// FUNÇÕES GERAIS
// =========================

function formatarDinheiro(valor) {
    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

function escaparTexto(texto) {
    const elemento =
        document.createElement("div");

    elemento.textContent =
        texto === undefined ||
        texto === null
            ? ""
            : String(texto);

    return elemento.innerHTML;
}