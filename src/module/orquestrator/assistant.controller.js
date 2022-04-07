const conversation = require('./assistant.repository');

const sendMessageToConversation = message =>
    new Promise((resolve, reject) => {
        conversation.message(message, (err, response) => {
            if (err) {
                reject(err);
            }

            resolve(response);
        });
    });

const processMessage = async (req, res) => {
    try {
        let messageToUser = await sendMessageToConversation(req.body);

        return res.json(messageToUser);
    } catch (error) {
        console.error(error);
        return res.status(400);
    }
};

module.exports = { processMessage };
