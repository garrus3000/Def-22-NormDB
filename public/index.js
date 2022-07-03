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