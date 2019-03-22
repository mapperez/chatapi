const dialogflow = require('dialogflow');
const uuid = require('uuid');

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(projectId, mensaje, sessionId) {

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
    runSample
}