const { connA, connB } = require('../mongodb/dbconec');
const Schema = connA.Schema;

const ChatSchema = new Schema({
    id: { type: String },
    body: { type: String },
    fromMe: { type: String },
    author: { type: String },
    time: { type: String },
    chatId: { type: String },
    messageNumber: { type: String },
    type: { type: String },
    senderName: { type: String },
    chatName: { type: String },
    cliente: { type: Schema.Types.Mixed }
}, { timestamps: true });
module.exports = connA.model('chat', ChatSchema);