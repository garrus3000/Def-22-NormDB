import norm from 'normalizr';
import util from 'util';


const printMsj = (objeto) =>{
    console.log(util.inspect(objeto, false, 12, true))
};

const textSchema = new norm.schema.Entity('text');
const authorSchema = new norm.schema.Entity('autores', {
    text: textSchema
});
const schemaMensajes = new norm.schema.Entity('mensajes', { author: authorSchema }, { idAttribute: "text" });

const nomalizerMsj = (mensajes) => {
    const _normalizado = norm.normalize(mensajes, [schemaMensajes]);
    const mensajeLength = JSON.stringify(_normalizado).length;
    const lenghOriginal = JSON.stringify(mensajes).length;
    const compresion = ((lenghOriginal - mensajeLength) / lenghOriginal * 100).toFixed(2);
    console.log(lenghOriginal);
    console.log(`Compresion: ${compresion}%`);
    console.log(mensajeLength);
    // printMsj(nomaaa);
    // console.log(_normalizado);
    const _desnormalizado = norm.denormalize(_normalizado.result, [schemaMensajes],_normalizado.entities );
    // printMsj(denormalized);
    // console.log(denormalized);
}

export { nomalizerMsj };