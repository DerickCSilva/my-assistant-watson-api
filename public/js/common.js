if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

HTMLElement.prototype.toggle = function () {
    this.style.display = this.style.display == 'none' ? '' : 'none';
    return this;
};

HTMLElement.prototype.fadeIn = function (milisseconds, display) {
    this.style.display = display || 'block';
    this.style.opacity = 0;

    const next = function () {
        let _this = this;

        this.style.opacity = parseFloat(this.style.opacity) + 0.01;
        if (this.style.opacity < 1) setTimeout(function () {
            return next.call(_this);
        }, milisseconds / 100);
        else return this;
    };

    next.call(this);
};

const common = (() => {
    const scrollToChatBottom = () => {
        let scrollingChat = document.getElementById('log');

        const elements = document.getElementsByClassName('chat-msg');
        const element = elements[elements.length - 1];

        if (element) {
            scrollingChat.scrollTop = element.offsetTop;
        }
    };

    const removeElement = (element) => element.parentNode.removeChild(element);

    const removeElementById = (elementId) => {
        const element = document.getElementById(elementId);
        removeElement(element);
    };

    const removeElementByClassName = (className) => {
        const elements = document.getElementsByClassName(className);
        for (let i = elements.length; i--;) {
            removeElement(elements[i]);
        }
    };

    const insertElement = (parentId, element) => {
        const parent = document.getElementById(parentId);
        return parent.appendChild(element);
    };

    const buildDomElementFromJson = function (domJson) {
        // Criando um elemento DOM com o nome de tag fornecido
        const element = document.createElement(domJson.tagName);

        // Preencha o "conteúdo" do elemento
        if (domJson.text) {
            element.innerHTML = domJson.text;
        } else if (domJson.html) {
            element.insertAdjacentHTML('beforeend', domJson.html);
        }

        // Adicionar classes ao elemento
        if (domJson.classNames) {
            for (let i = 0; i < domJson.classNames.length; i++) {
                element.classList.add(domJson.classNames[i]);
            }
        }
        // Adicionar atributos ao elemento
        if (domJson.attributes) {
            for (let j = 0; j < domJson.attributes.length; j++) {
                const currentAttribute = domJson.attributes[j];
                element.setAttribute(currentAttribute.name, currentAttribute.value);
            }
        }
        // Adicionar elementos filhos ao elemento
        if (domJson.children) {
            for (let k = 0; k < domJson.children.length; k++) {
                const currentChild = domJson.children[k];
                element.appendChild(buildDomElementFromJson(currentChild));
            }
        }

        return element;
    };

    const clearLogs = () => document.getElementById('log').innerHTML = '';

    const chatToggle = () => {
        if (!conversation.getInitialized()) {
            conversation.init();
        }

        const element = document.getElementById('chat-box');

        if (element.classList.contains('closed')) {
            element.classList.remove('closed');
            document.querySelector('#chat-box-toggle i').innerText = 'close';
            document.querySelector('.chat-header-text').innerText = 'Assistente Virtual';
        } else {
            element.classList.add('closed');
            document.querySelector('#chat-box-toggle i').innerText = 'keyboard_arrow_up';
            document.querySelector('.chat-header-text').innerText = 'Olá! Como posso ajudar?';

            conversation.setInitialized(false);
            clearLogs();
        }

        parent.postMessage("chatToggle", "*");
    };

    const removeOptions = () => {
        const messageWithOptions = document.getElementsByClassName('withOptions')[0];

        if (messageWithOptions) {
            const message = messageWithOptions.parentElement;

            if (message && message.children.length > 2) {
                message.removeChild(message.children[2]);
                messageWithOptions.classList.remove('withOptions');
                messageWithOptions.classList.add('text');
            }
        }
    };

    const inputFocus = () => {
        const input = document.getElementById('chat-input');
        input.focus();
    };

    const getTimeRandom = (min, max) => Math.random() * (max - min) + min;

    const formatDate = (date, justTime, justDate) => {
        const hours = date.getHours();
        let minutes = date.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const strTime = hours + ':' + minutes;
        const strDate = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + '/' + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + '/' + date.getFullYear();

        if (justTime) {
            return strTime;
        } else if (justDate) {
            return strDate;
        }

        return strDate + ' ' + strTime;
    };

    const toggleChatInput = (disable, placeholder) => {
        let chatInput = document.getElementById("chat-input");
        let chatSubmit = document.getElementById("chat-submit");
        chatInput.placeholder = placeholder || "Envie uma mensagem...";

        if (disable) {
            chatInput.placeholder = "Selecione uma opção acima...";
            chatInput.disabled = true;
            chatSubmit.disabled = true;
        } else {
            chatInput.placeholder = placeholder || "Envie uma mensagem...";
            chatInput.disabled = false;
            chatSubmit.disabled = false;
        }
    }

    const getUrlParam = (param) => {
        const url_string = window.location.href;
        const url = new URL(url_string);
        const data = url.searchParams.get(param);
        return data
    }

    return {
        removeElement,
        removeElementById,
        removeElementByClassName,
        insertElement,
        scrollToChatBottom,
        buildDomElementFromJson,
        chatToggle,
        removeOptions,
        inputFocus,
        getTimeRandom,
        formatDate,
        clearLogs,
        toggleChatInput,
        getUrlParam
    };
})();
