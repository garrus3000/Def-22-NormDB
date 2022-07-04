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

const renderMsj = (msj) => {
    msj.map(el => {
        const html = ` <article> 
        <span class="text-primary fs-5 fw-bold">${el.author.id}</span>
        <span class="text-muted fs-6 fw-bold">${el.author.alias}</span>
        [<span class="text-brown fw-semibold">${el.author.fecha}</span>] :
        <span class="text-success fst-italic">${el.text}</span>
        <img src="${el.author.avatar}" alt="${el.author.alias}" class="rounded-circle ms-3" width="75" height="75">
        </article>`;
        const mensajes = document.getElementById("messages");
        mensajes.innerHTML += html;
    })
}

// Esquemas de normalizacion para ver en consola del navegador
const textSchema = new normalizr.schema.Entity('text');
const authorSchema = new normalizr.schema.Entity('autores', {
    text: textSchema
});
const schemaMensajes = new normalizr.schema.Entity('mensajes', { author: authorSchema }, { idAttribute: "text" });

const renderCompresion = (msj) => {
    const _normalizado = normalizr.normalize(msj, [schemaMensajes]);
    console.log(_normalizado);
    const _desnormalizado = normalizr.denormalize(_normalizado.result, [schemaMensajes],_normalizado.entities );
    console.log(_desnormalizado);
    console.log('Length original :', JSON.stringify(msj).length)
    console.log('Length normalizado :', JSON.stringify(_normalizado).length)
    console.log('Length desnormalizado :', JSON.stringify(_desnormalizado).length)
    const compresion = ((JSON.stringify(msj).length / JSON.stringify(_normalizado).length) * 100).toFixed(2);
    console.log('Compresion :', compresion);
    const _compresion = document.getElementById("compresion");
    _compresion.innerHTML = `Compresion: ${compresion}%`;
}

socket.on("messages",  (mensaje) => {
    renderMsj(mensaje);
    renderCompresion(mensaje);
});
