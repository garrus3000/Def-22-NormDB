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


// Mensajes, guardados en el archivo DB/mensajes.json
const chat = document.getElementById("enviarMensaje");

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
    await socket.emit("new-message", mensaje );
    e.target.text.value = "";
});

// Normalizador de mensajes, si no se copia no funciona, no entiendo los import dinámicos aveces.....
const authorsSchema = new normalizr.schema.Entity('authors');
const msjSchema = new normalizr.schema.Entity('mensajes', { author: authorsSchema }, { idAttribute: 'id' });
const fileSchema = [msjSchema]

const renderMsj = (msj) => {
    msj.map(el => {
        const html = ` <article> 
        <span class="text-primary fs-5 fw-bold">${el.author.id}</span>
        <span class="text-muted fs-6 fw-bold">${el.author.alias}</span>
        [<span class="text-brown fw-semibold">${el.author.fecha}</span>] :
        <span class="text-success fst-italic">${el.text}</span>
        <img src="${el.author.avatar}" alt="${el.author.alias}" class="rounded-circle ms-3" width="50" height="50">
        </article>`;
        const mensajes = document.getElementById("messages");
        mensajes.innerHTML += html;
    })
}


const renderCompresion = (arrMensajes, desNormMensaje) => {
    const _compresion = document.getElementById("compresion");

        // const original = JSON.stringify(originalObject);
        // const desnorma = JSON.stringify(desnormaObject);
        // const compresion = original.length - desnorma.length;
        // return compresion;



    const calculoDeCompr = ((JSON.stringify(arrMensajes).length / JSON.stringify(desNormMensaje).length) * 100).toFixed(2);
    const arrLength = console.log(arrMensajes.length);
    const desLength = console.log(desNormMensaje.result);
    printObject(arrMensajes);
    

    // const denormMsjsLength = (JSON.stringify(desNormMensaje)).length;
    // // const msjLength = (JSON.stringify(msj)).length;
    // // const compresion = ((msjLength - denormMsjsLength) / msjLength * 100).toFixed(2);
    // const compresion = (JSON.stringify(denormMsjsLength) / JSON.stringify(arrMensajes).length * 100).toFixed(2);
    _compresion.innerHTML = `(Compresión: ${calculoDeCompr}%)`;
}


socket.on("messages", (mensaje) => {
    renderMsj(mensaje);
    const normalizedMsj = normalizr.normalize(mensaje, [msjSchema]);
    renderCompresion(mensaje, normalizedMsj);
});
