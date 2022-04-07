const _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

HTMLElement.prototype.fadeIn = function (milisseconds, display) {
    this.style.display = display || 'block';
    this.style.opacity = 0;

    const next = function () {
        const _this = this;

        this.style.opacity = parseFloat(this.style.opacity) + 0.01;
        if (this.style.opacity < 1) setTimeout(function () {
            return next.call(_this);
        }, milisseconds / 100); else return this;
    };

    next.call(this);
};

const widgetChatBot = (() => {
    let iframeChatBot;
    let initialParams;

    const createModalImage = () => {
        modal = document.createElement("div");
        modal.classList.add("modalImg");
        modal.onclick = () => {
            modal.style.display = "none";
        }

        modalClose = document.createElement("span");
        modalClose.classList.add("modalImg-close");
        modalClose.onclick = () => {
            modal.style.display = "none";
        }

        modalImg = document.createElement("img");
        modalImg.classList.add("modalImg-content");

        modal.appendChild(modalClose);
        modal.appendChild(modalImg);
        document.body.appendChild(modal);
    }

    const chatToggle = () => {
        if (iframeChatBot.classList.contains("closed")) {
            iframeChatBot.classList.remove("closed");
        } else {
            iframeChatBot.classList.add("closed");
        }
    };

    const showImage = (event) => {
        modal.style.display = "block";
        modalImg.src = event.data.replace("showImage-", "");
    }

    const receiveMessage = (event) => {
        if (event.data.startsWith("chatToggle")) {
            chatToggle();
        } else if (event.data.startsWith("showImage")) {
            showImage(event);
        }
    };

    const init = (params) => {
        initialParams = params;

        var url_string = window.location.href;
        var url = new URL(url_string);
        var chapa = url.searchParams.get("chapa");

        if (chapa != null) {
            params.chapa = chapa;
        }

        iframeChatBot = document.createElement("iframe");
        iframeChatBot.setAttribute("id", "widgetChatBot");
        iframeChatBot.classList.add("closed");
        iframeChatBot.setAttribute("src", params.domain + "/chat?usuario=" + params.loggedUser);
        document.body.appendChild(iframeChatBot);

        iframeChatBot.onload = () => {
            iframeChatBot.fadeIn(500);
            iframeChatBot.contentWindow.postMessage("setParams" + JSON.stringify(params), "*");
        };

        createModalImage();

        window.addEventListener("message", receiveMessage, false);
    };

    return { init };
})();
