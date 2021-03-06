const { connA, connB } = require('../mongodb/dbconec');
const Schema = connA.Schema;

const RomSchema = new Schema({
    chatId: { type: String },
    fecha: { type: Date },
    open: { type: Boolean, default: true },
    bot: { type: Boolean, default: false },
    mensajes: { type: Schema.Types.Mixed },
    cliente: { type: Schema.Types.Mixed },
    estado: { type: String },
    tipoConversacion : { type: String},
    observacionConversacion: {type :String}

}, { timestamps: true });
module.exports = connA.model('rom', RomSchema);