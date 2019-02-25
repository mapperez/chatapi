require('../config/config');

const Mongoose = require('mongoose').Mongoose;

//Instancias
const connA = new Mongoose();
const connB = new Mongoose();


connA.connect(process.env.urlMongo, { useNewUrlParser: true });
connB.connect(process.env.urlMongo2, { useNewUrlParser: true });

module.exports = {
    connA,
    connB
}