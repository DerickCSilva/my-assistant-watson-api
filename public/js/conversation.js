const _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const conversation = (() => {
    let contextLocal = {};
    let initialized = false;
    let initialParams = {};

    const getInitialized = () => initialized;

    const setInitialized = (value) => {
        if (!value) contextLocal = {};

        initialized = value;
    };

    const setParams = (params) => {
        initialParams = params;
        contextLocal = _extends({}, contextLocal, params);

        if (params.startOpen === true) {
            init();
            common.chatToggle();
        }
    };

    const createJSONOptions = (options) => {
        let optionJson = {
            tagName: 'li',
            classNames: ['options'],
            children: []
        };

        for (let i = 0; i < options.length; i++) {
            const option = options[i];

            if (option.value.input.text.indexOf("http") != -1) {
                optionJson.children.push({
                    tagName: 'ul',
                    text: option.label,
                    attributes: [{
                        name: 'onclick',
                        value: "window.open('" + option.value.input.text + "','_blank')"
                    }]
                });
            } else {
                optionJson.children.push({
                    tagName: 'ul',
                    text: option.label,
                    attributes: [{
                        name: 'onClick',
                        value: 'conversation.optionClick("' + option.value.input.text + '");'
                    }]
                });
            }
        }

        return optionJson;
    }

    const displayTextOutput = (text, type, options, imageSource) => {
        common.removeElementByClassName('from-chatbot-loading');
        common.removeOptions();

        let messageJson = {
            tagName: 'div',
            classNames: ['chat-msg', type],
            children: new Array()
        };

        const lastMessage = document.getElementById("log").lastChild;

        if (type.startsWith('from-chatbot') && (!lastMessage || lastMessage.classList.contains("from-user"))) {
            messageJson.children.push({
                tagName: 'span',
                classNames: ['msg-avatar'],
                children: [{
                    tagName: 'img',
                    attributes: [{ name: 'src', value: 'images/assistant.png' }]
                }]
            });
        }

        let optionJson = {};
        if (options) {
            optionJson = createJSONOptions(options);
        }

        var timeSpanJson = {};
        if (type != 'from-chatbot-loading') {
            timeSpanJson = createJSONTimeSpan();
        }

        if (imageSource) {
            text = (text ? text : "") + '<img class="img-small" src="' + imageSource + '" onClick="conversation.showImage(\'' + imageSource + '\')" >'
        }

        messageJson.children.push({
            tagName: 'div',
            classNames: ['cm-msg-text'],
            children: [{
                tagName: 'div',
                classNames: [type == 'from-chatbot-loading' ? 'ball' : options ? 'withOptions' : 'text'],
                text: text + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            },
                timeSpanJson,
                optionJson
            ]
        });

        const element = common.buildDomElementFromJson(messageJson);
        common.insertElement('log', element);

        element.toggle().fadeIn(400);
        common.scrollToChatBottom();
        common.inputFocus();
    };

    const displayResponse = (index, messageList) => {
        const withOptions = messageList.filter(item => {
            return item.response_type == "option";
        })[0] != undefined;

        common.toggleChatInput(withOptions, contextLocal.placeholder);

        if (index < messageList.length) {
            let pauseTime = common.getTimeRandom(200, 1200);
            const message = messageList[index++];

            if (message.response_type == 'pause') pauseTime = message.time;

            setTimeout(() => {
                switch (message.response_type) {
                    case 'text':
                        displayTextOutput(message.text, 'from-chatbot');
                        break;

                    case 'option':
                        displayTextOutput(message.title, 'from-chatbot', message.options);
                        break;

                    case 'image':
                        displayTextOutput(message.title, 'from-chatbot', null, message.source);
                        break;
                }

                if (index < messageList.length && message.response_type != 'pause') {
                    displayTextOutput('', 'from-chatbot-loading');
                }

                return displayResponse(index, messageList);
            }, pauseTime);

        }
    };

    const sendMessage = (text) => {
        displayTextOutput('', 'from-chatbot-loading');

        if (common.getUrlParam("chapa")) {
            contextLocal.chapa = common.getUrlParam("chapa");
        }

        api.sendRequestMessage(text, contextLocal).then(response => {
            if(!response.output.generic.length) {
                common.removeElementByClassName('from-chatbot-loading');
            }

            contextLocal = response.context;
            const messageQueue = response.output.generic;
            displayResponse(0, messageQueue);
        }).catch(response => {
            console.log(response);
            displayTextOutput('Não consigo me conectar ao meu servidor no momento. Por favor, tente novamente mais tarde!', 'from-chatbot');
        });
    };

    const init = () => {
        setInitialized(true);
        sendMessage('');
    };

    const createJSONTimeSpan = () => {
        const timeSpanJSON = {
            tagName: 'span',
            classNames: ["timespan"],
            text: common.formatDate(new Date(), true)
        };
        return timeSpanJSON;
    }

    const optionClick = (value) => {
        common.removeOptions();

        displayTextOutput(value, 'from-user');
        sendMessage(value);
    };

    const showImage = (source) => parent.postMessage("showImage-" + source, "*");

    return {
        getInitialized,
        setInitialized,
        setParams,
        displayTextOutput,
        sendMessage,
        init,
        optionClick,
        showImage
    };
})();
