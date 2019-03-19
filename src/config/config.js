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
let urlMongoImplementos;


if (process.env.NODE_ENV === 'dev') {
    console.log("NODE DEVELOPER");
    //urlMongo = `mongodb://localhost:27017/ChatCentral`
    //urlMongo2 = `mongodb://localhost:27017/Implenet`
    urlMongo = `mongodb://mapperez:3Yaxa9ef@ds149875.mlab.com:49875/chatcentral`
    urlMongo2 = `mongodb://mapperez:3Yaxa9ef@ds149875.mlab.com:49875/implenet`
    urlMongoImplementos = `mongodb://192.168.211.77:27017/Implenet`


} else {
    console.log("NODE PRODUCCTION");
    urlMongo = `mongodb://mapperez:3Yaxa9ef@ds149875.mlab.com:49875/chatcentral`
    urlMongo2 = `mongodb://mapperez:3Yaxa9ef@ds149875.mlab.com:49875/implenet`
    urlMongoImplementos = `mongodb://192.168.211.77:27017/Implenet`
}

process.env.urlMongo = urlMongo;
process.env.urlMongo2 = urlMongo2;
process.env.urlMongoImplementos = urlMongoImplementos;
