/**
 * Ambiente de Ejecucion
 */

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Puertos
 */

process.env.PORT = process.env.PORT || 4000





/**
 * Host
 */
let urlMongo;
let urlMongo2;
let dbName = 'ChatCentral'
let dbName2 = 'Implenet'
let hosdev = 'localhost'
let hospro = '192.168.211.77'

if (process.env.NODE_ENV === 'dev') {
    console.log("NODE DEVELOPER");
    urlMongo = `mongodb://${hosdev}:27017/${dbName}`
    urlMongo2 = `mongodb://${hosdev}:27017/${dbName2}`

} else {
    console.log("NODE PRODUCCTION");
    urlMongo = `mongodb://${hospro}:27017/${dbName}`
    urlMongo2 = `mongodb://${hosdev}:27017/${dbName2}`

}

process.env.urlMongo = urlMongo;
process.env.urlMongo2 = urlMongo2;