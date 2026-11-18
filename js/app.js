
const API_URL = "https://api.tvmaze.com/search/shows?q=";

async function traducirTexto(texto) {
    if (!texto || texto === "No disponible") return texto;

    try {
        const respuesta = await fetch(
            "https://api.mymemory.translated.net/get?q=" +
            encodeURIComponent(texto) +
            "&langpair=en|es"
        );

        const datos = await respuesta.json();

        return datos.responseData.translatedText || texto;

    } catch (error) {
        console.error("Error de traducción:", error);
        return texto;
    }
}

const resultados = document.getElementById("resultados");
const buscador = document.getElementById("busqueda");
const botonBuscar = document.getElementById("buscar");

async function buscarSeries(termino = "Barbie") {

    resultados.innerHTML = "<p>Buscando contenido...</p>";

    try {
        const respuesta = await fetch(
            API_URL + encodeURIComponent(termino)
        );

        if (!respuesta.ok) {
            throw new Error("Error al consultar la API");
        }

        const datos = await respuesta.json();

        mostrarSeries(datos);

    } catch (error) {
        resultados.innerHTML =
            "<p>No se pudo cargar el catálogo. Intenta nuevamente.</p>";

        console.error(error);
    }
}

function mostrarSeries(series) {

    resultados.innerHTML = "";

    if (series.length === 0) {
        resultados.innerHTML =
            "<p>No encontramos resultados.</p>";
        return;
    }

   series.forEach(async elemento => {

        const serie = elemento.show;

        const tarjeta = document.createElement("article");
        tarjeta.className = "resultado-card";

        const imagen = document.createElement("img");

        imagen.src = serie.image?.medium ||
            "https://placehold.co/400x300/FCEEF3/D94F88?text=Barbie+World";

        imagen.alt = serie.name;

        const informacion = document.createElement("div");
        informacion.className = "resultado-info";

        const titulo = document.createElement("h3");
        titulo.textContent = serie.name;

        const descripcion = document.createElement("p");
        const texto = (serie.summary || "Sin descripción disponible.")
            .replace(/<[^>]*>/g, "");

        descripcion.textContent = "Traduciendo al español...";

const textoTraducido = await traducirTexto(texto);

descripcion.textContent =
    textoTraducido.length > 130
        ? textoTraducido.substring(0, 130) + "..."
        : textoTraducido;

        const botonDetalles = document.createElement("button");
        botonDetalles.className = "boton-detalles";
        botonDetalles.textContent = "Ver detalles";

        const detalles = document.createElement("div");
        detalles.className = "detalles-serie";
        detalles.hidden = true;

        const genero = serie.genres?.join(", ") || "No disponible";
        const estado = serie.status || "No disponible";
        const idioma = serie.language || "No disponible";

      detalles.textContent = "Traduciendo detalles...";

const [generoES, estadoES, idiomaES] = await Promise.all([
    traducirTexto(genero),
    traducirTexto(estado),
    traducirTexto(idioma)
]);

detalles.textContent =
    `Género: ${generoES} | Estado: ${estadoES} | Idioma: ${idiomaES}`;
        botonDetalles.addEventListener("click", () => {
            detalles.hidden = !detalles.hidden;

            botonDetalles.textContent = detalles.hidden
                ? "Ver detalles"
                : "Ocultar detalles";
        });

        informacion.appendChild(titulo);
        informacion.appendChild(descripcion);
        informacion.appendChild(botonDetalles);
        informacion.appendChild(detalles);

        tarjeta.appendChild(imagen);
        tarjeta.appendChild(informacion);

        resultados.appendChild(tarjeta);
    });
}

botonBuscar.addEventListener("click", () => {

    const termino = buscador.value.trim();

    if (termino) {
        buscarSeries(termino);
    }
});

buscador.addEventListener("keydown", evento => {

    if (evento.key === "Enter") {
        botonBuscar.click();
    }
});

// Cargar resultados al entrar
buscarSeries("Barbie");
