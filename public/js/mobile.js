(() => {
    common.chatToggle(1);
    //initial chat settings
    (() => {
        let chat_submit = document.getElementById('chat-submit');
        let chat_body = document.getElementById('chat-box-body');
        let chat_logs = document.querySelector('#log');
        let chat_input = document.getElementById('chat-input');
        let input_box = document.getElementById('input-box');
        chat_body.style.height = 'calc(100vh - 51px)';

        const theme = common.modeTheme();
        chat_logs.classList.add(theme.theme);
        chat_submit.style.color = theme.color;
        if (theme.dark) {
            chat_logs.classList.add('dark_bg');
            input_box.classList.add('dark_bg');
            chat_input.classList.add('dark_bg');
        } else {
            chat_logs.classList.add('default_bg');
        }
    })();

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
        console.log('listener')
        if (e.data == "chatToggle") {
            common.chatToggle();
        } else if (e.data.indexOf("setParams") != -1) {
            var initialParams = JSON.parse(e.data.replace("setParams", ""));
            conversation.setParams(initialParams);
        } else {
            return;
        }
    }, false);
})();
