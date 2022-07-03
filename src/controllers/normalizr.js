import norm from 'normalizr';

const authorsSchema = new norm.schema.Entity('authors');
const msjSchema = new norm.schema.Entity('mensajes', { author: authorsSchema }, { idAttribute: 'id' });
const fileSchema = [msjSchema]

const normalizeMsj = (msj) => {
const normalizedMensaje = norm.normalize(msj, fileSchema);
return normalizedMensaje;
}

export { normalizeMsj };
