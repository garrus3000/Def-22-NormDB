const socket = io();

// Productos con Fake.js vista en HBS
fetch("/api/productos-test")
    .then((response) => response.json())
    .then((data) => listaDeProductos(data))
    .catch((err) => console.log(err));

const listaDeProductos = (data) => {
    const productos = data;
    fetch("./views/productos.hbs")
        .then((res) => res.text())
        .then((template) => Handlebars.compile(template))
        .then((compiled) => compiled({ productos }))
        .then( (html) => (document.getElementById("productos").innerHTML = html) );
};


// Mensajes
const chat = document.getElementById("enviarMensaje");
// const botonEnviar = document.getElementById("botonEnviar");


chat.addEventListener("submit", async (e) => {
    e.preventDefault();
    const mensaje = {
        author: {
            id: e.target.id.value,
            nombre: e.target.nombre.value,
            apellido: e.target.apellido.value,
            edad: e.target.edad.value,
            alias: e.target.alias.value,
            avatar: e.target.avatar.value,
            fecha: new Date().toLocaleString(),
        },
        text: e.target.text.value,
    };
    await socket.emit("new-message", mensaje);
    e.target.text.value = "";
});

 const formatoMensajes = (mensaje) => {
    const { author, text } = mensaje;
    return `<article> 
                    <span class="text-primary fs-5 fw-bold">${author.id}</span>
                    <span class="text-muted fs-6 fw-bold">${author.alias}</span>
                    [<span class="text-brown fw-semibold">${author.fecha}</span>] :
                    <span class="text-success fst-italic">${text}</span>
                    <img src="${author.avatar}" alt="${author.alias}" class="rounded-circle ms-3" width="50" height="50">
            </article>`;

};

const renderMensajes = (mensajes) => {
    const listaDeMensajes = mensajes
        .map((mensaje) => formatoMensajes(mensaje))
        .join("");
    if (listaDeMensajes === "") {
        document.getElementById("messages").innerHTML = `<div> <p class=" p-2 text-danger fs-3 text-center">No hay mensajes</p> </p>`;
    } else document.getElementById("messages").innerHTML = listaDeMensajes;
};

socket.on("messages", (msj) => renderMensajes(msj));
