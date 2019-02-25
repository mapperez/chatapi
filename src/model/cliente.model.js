const { connA, connB } = require('../mongodb/dbconec');
const Schema = connB.Schema;

const ClienteSchema = new Schema({
    rut: {
        type: Schema.Types.String,
        required: [true, 'El campo es requerido'],
        unique: true
    },
    nombre: {
        type: Schema.Types.String,
        required: [true, 'El nombre es requerido']
    },
    apellido: {
        type: Schema.Types.String,
        required: [true, 'El apellido es requerido']
    },
    correos: {
        type: Schema.Types.Mixed
    },
    telefonos: {
        type: Schema.Types.Mixed
    },
    direcciones: {
        type: Schema.Types.Mixed
    },
    cod_region: {
        type: Schema.Types.String,
        required: [true, 'El campo cod_region es requerido']
    },
    provincia: {
        type: Schema.Types.String,
        required: [true, 'El campo provincia es requerido']
    },
    ciudad: {
        type: Schema.Types.String,
        required: [true, 'El campo ciudad es requerido']
    },
    clasificacionFinanciera: {
        type: Schema.Types.String,
        required: [true, 'El campo clasificacionFinanciera es requerido']
    },
    tipoCartera: {
        type: Schema.Types.String,
        required: [true, 'El campo es tipoCartera requerido']
    },
    clasificacion: {
        type: Schema.Types.String,
        required: [true, 'El campo es clasificacion requerido']
    },
    condicionPago: {
        type: Schema.Types.String,
        required: [true, 'El campo condicionPago es requerido']
    },
    credito: {
        type: Schema.Types.String,
        required: [true, 'El campo credito es requerido']
    },
    creditoUtilizado: {
        type: Schema.Types.String,
        required: [true, 'El campo creditoUtilizado es requerido']
    },
    formaPago: {
        type: Schema.Types.String,
        required: [true, 'El campo formaPago es requerido']
    },
    giros: {
        type: Schema.Types.String,
        required: [true, 'El campo giros es requerido']
    },
    segmento: {
        type: Schema.Types.String,
        required: [true, 'El campo segmento es requerido']
    },
    subSegmento: {
        type: Schema.Types.String,
        required: [true, 'El campo subSegmento es requerido']
    },
}, { timestamps: true });
module.exports = connB.model('cliente', ClienteSchema);