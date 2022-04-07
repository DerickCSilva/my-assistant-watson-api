const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const assistant = new AssistantV2({
    version: process.env.ASSISTANT_API_VERSION,
    authenticator: new IamAuthenticator({
        apikey: process.env.ASSISTANT_API_KEY,
    })
});

const createWatsonSession = () => new Promise((solve, reject) => {
    assistant.createSession({
        assistantId: process.env.ASSISTANT_ID,
    }, (err, response) => {
        if (err) {
            reject(err);
        } else {
            solve(response);
        }
    });
});

const message = async (params, callback) => {
    let newMessage = Object.assign({}, { input: { text: "" }, context: {} }, params);

    if (!newMessage.context.session_id) {
        const session = await createWatsonSession();
        newMessage.context.session_id = session.result.session_id;
    }

    newMessage.context.caiu_no_anything_else = false;
    newMessage.input.options = { 'return_context': true };

    assistant.message({
        assistantId: process.env.ASSISTANT_ID,
        sessionId: newMessage.context.session_id,
        input: newMessage.input,
        context: {
            'global': {
                'system': {
                    "timezone": "America/Sao_Paulo"
                }
            },
            'skills': {
                'main skill': {
                    'user_defined': {
                        ...newMessage.context
                    }
                }
            }
        }
    }, (err, response) => {
        if (err) {
            console.log(JSON.stringify(err, null, 2));

            if (params.context && params.context.resultService) {
                params.context.resultService = null;
                message(params, callback);
            } else {
                callback(null, { context: newMessage.context, output: { text: "Não estou conseguindo me conectar com a minha inteligência. Por favor tente mais tarde." } });
            }
        } else {
            callback(null, {...response.result, input: newMessage.input, context: response.result.context.skills['main skill'].user_defined });
        }
    });
};

module.exports = { message };
