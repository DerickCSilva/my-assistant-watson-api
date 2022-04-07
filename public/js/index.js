(() => {
    document.getElementById("chat-box-header").onclick = () => common.chatToggle();

    document.getElementById('chat-submit').onclick = (e) => {
        e.preventDefault();

        let input = document.getElementById('chat-input');
        const msg = input.value;
        if (msg.trim() == '') {
            return false;
        }

        input.value = '';

        conversation.displayTextOutput(msg, 'from-user');
        conversation.sendMessage(msg);
    };

    window.addEventListener("message", (e) => {
        if (e.data == "chatToggle") {
            common.chatToggle();
        } else if (e.data.indexOf("setParams") != -1) {
            const initialParams = JSON.parse(e.data.replace("setParams", ""));
            conversation.setParams(initialParams);
        } else {
            return;
        }
    }, false);
})();
