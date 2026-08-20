// =====================================================
// CONFIGURAÇÕES
// =====================================================


// LINK DA LIVE DO YOUTUBE

const LINK_DA_LIVE =
    "https://youtu.be/kUSGZKzUP5Y?si=Dmf1ThJ1P5Lhnpz2";


// URL DO GOOGLE APPS SCRIPT
//
// Depois vamos colocar aqui a URL da planilha.
// Por enquanto deixe vazio.

const URL_GOOGLE_SHEETS = "https://script.google.com/macros/s/AKfycbz9AXczD15bQbNWlkxiZAq67eD80T586rGIHVobmo1CiOb0ay63s88tsSkH3pMFsdo4/exec";


// =====================================================
// ELEMENTOS DA PÁGINA
// =====================================================

const formulario =
    document.getElementById("formulario");

const nomeInput =
    document.getElementById("nome");

const paginaEntrada =
    document.getElementById("paginaEntrada");

const paginaSucesso =
    document.getElementById("paginaSucesso");

const paginaAdmin =
    document.getElementById("paginaAdmin");

const nomeConfirmacao =
    document.getElementById("nomeConfirmacao");

const botaoYoutube =
    document.getElementById("botaoYoutube");

const abrirAdmin =
    document.getElementById("abrirAdmin");

const botaoVoltar =
    document.getElementById("botaoVoltar");

const tabelaRegistros =
    document.getElementById("tabelaRegistros");

const total =
    document.getElementById("total");


// =====================================================
// GERAR ID
// =====================================================

function gerarID() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2, 8)
    ).toUpperCase();

}


// =====================================================
// REGISTRAR ACESSO
// =====================================================

formulario.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const nome =
            nomeInput.value.trim();


        if (nome === "") {

            alert(
                "Digite seu nome completo."
            );

            return;
        }


        // Data e hora

        const agora =
            new Date();


        const data =
            agora.toLocaleDateString(
                "pt-BR"
            );


        const hora =
            agora.toLocaleTimeString(
                "pt-BR"
            );


        // ID

        const id =
            gerarID();


        // Registro

        const registro = {

            nome: nome,

            data: data,

            hora: hora,

            id: id

        };


        // =================================================
        // SALVAR LOCALMENTE
        // =================================================

        let registros =
            JSON.parse(
                localStorage.getItem(
                    "registrosCulto"
                ) || "[]"
            );


        registros.push(
            registro
        );


        localStorage.setItem(
            "registrosCulto",
            JSON.stringify(
                registros
            )
        );


        // =================================================
        // ENVIAR PARA GOOGLE SHEETS
        // =================================================

        if (
            URL_GOOGLE_SHEETS !== ""
        ) {

            try {

                await fetch(
                    URL_GOOGLE_SHEETS,
                    {

                        method: "POST",

                        mode: "no-cors",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },

                        body:
                            JSON.stringify(
                                registro
                            )

                    }
                );

            }

            catch (erro) {

                console.log(
                    "Não foi possível enviar para a planilha.",
                    erro
                );

            }

        }


        // =================================================
        // MOSTRAR CONFIRMAÇÃO
        // =================================================

        nomeConfirmacao.textContent =
            nome;


        paginaEntrada.classList.add(
            "hidden"
        );


        paginaSucesso.classList.remove(
            "hidden"
        );

    }
);


// =====================================================
// ABRIR YOUTUBE
// =====================================================

botaoYoutube.addEventListener(
    "click",
    function() {

        window.open(
            LINK_DA_LIVE,
            "_blank"
        );

    }
);


// =====================================================
// ABRIR ADMIN
// =====================================================

abrirAdmin.addEventListener(
    "click",
    function() {

        paginaEntrada.classList.add(
            "hidden"
        );

        paginaSucesso.classList.add(
            "hidden"
        );

        paginaAdmin.classList.remove(
            "hidden"
        );

        carregarRegistros();

    }
);


// =====================================================
// CARREGAR REGISTROS LOCAIS
// =====================================================

function carregarRegistros() {

    const registros =
        JSON.parse(
            localStorage.getItem(
                "registrosCulto"
            ) || "[]"
        );


    tabelaRegistros.innerHTML =
        "";


    total.textContent =
        registros.length;


    registros.forEach(
        function(registro) {

            const linha =
                document.createElement(
                    "tr"
                );


            linha.innerHTML = `

                <td>
                    ${escaparHTML(
                        registro.nome
                    )}
                </td>

                <td>
                    ${registro.data}
                </td>

                <td>
                    ${registro.hora}
                </td>

                <td>
                    ${registro.id}
                </td>

            `;


            tabelaRegistros.appendChild(
                linha
            );

        }
    );

}


// =====================================================
// PROTEGER TEXTO DA TABELA
// =====================================================

function escaparHTML(texto) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        texto;

    return div.innerHTML;

}


// =====================================================
// VOLTAR
// =====================================================

botaoVoltar.addEventListener(
    "click",
    function() {

        paginaAdmin.classList.add(
            "hidden"
        );

        paginaEntrada.classList.remove(
            "hidden"
        );

    }
);
