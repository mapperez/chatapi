const dialogflow = require('dialogflow');
const uuid = require('uuid');


async function mensajeABots( mensaje, sessionId) {
    const projectId = "agenteejemplo-67c1a";

    // Create a new session
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);



    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: mensaje,
                // The language used by the client (en-US)
                languageCode: 'es-CL',
            },
        },
    };

    // Send request and log result
    return sessionClient.detectIntent(request);


}


module.exports = {
    mensajeABots
}