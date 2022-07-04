import norm from 'normalizr';
import util from 'util';


const authorsSchema = new normalizr.schema.Entity('authors');
const msjSchema = new normalizr.schema.Entity('mensajes', { author: authorsSchema }, { idAttribute: 'id' });
const fileSchema = [msjSchema];

export const printObject = (obj) =>  console.log(util.inspect(objeto, false, 12, true));

export const nomalizerMsj = (mensajes) => {
    const normalizedMsj = norm.normalize(mensajes, fileSchema);
    printObject(normalizedMsj);
    return normalizedMsj;
}

export const desNormalizerMsj = (normalizedMsj) => {
    const mensajes = norm.denormalize(normalizedMsj, fileSchema);
    printObject(mensajes);
    return mensajes;
}
