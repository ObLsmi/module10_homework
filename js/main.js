const sendButton = document.querySelector(".send_button");
const geodButton = document.querySelector(".geo_button");
const chatBox = document.querySelector(".chat-box");

function userChat(inputText) {
    const inputTextValue = inputText.value;
    const userText = document.createElement("p");
    userText.textContent = inputTextValue;
    userText.classList.add("chat_text", "user");

    chatBox.appendChild(userText);
};

function sendServer(inputText) {
    let sendMessage = false;
    let respServer = false;

    // Ссылка из задания не работала, взял ссылку из примера
    const wsUri = "wss://echo.websocket.org/";

    websocket = new WebSocket(wsUri);

    websocket.onopen = function(evt) {
        console.log("Connected");

        const message = inputText.value;
        websocket.send(message);
        sendMessage = true;
    };
    
    websocket.onerror = function(evt) {
        console.log("Error");
        
        const errorText = document.createElement("p");
        errorText.textContent = "Ошибка при отправке сообщения";
        errorText.classList.add("chat_text", "send_error");

        chatBox.appendChild(errorText);
    };

    websocket.onmessage = function(evt) {
        const reqServer = evt.data;
        console.log("Получено сообщение: ", reqServer);
        if (!reqServer.startsWith("Request served by")) {
            const serverText = document.createElement("p");
            serverText.textContent = evt.data;
            serverText.classList.add("chat_text", "server");

            chatBox.appendChild(serverText);

            respServer = true;

            if (sendMessage && respServer) {
                websocket.close();
                websocket = null;

                inputText.value = "";
            }
        };
    };

    websocket.onclose = function(evt) {
        console.log("Disconnected");
    };
};

const error = () => {
    console.log("Невозможно получить ваше местоположение");
    const getMapErr = document.createElement("p");
    getMapErr.textContent = "Невозможно получить ваше местоположение";
    getMapErr.classList.add("chat_text", "send_error");

    chatBox.appendChild(getMapErr);
};

const success = (position) => {
    console.log('position', position);
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;

    const positionText = document.createElement("p");
    positionText.textContent = `Твоя гео-лоация: https://www.openstreetmap.org/${latitude}/${longitude}`;
    positionText.classList.add("chat_text", "server");

    chatBox.appendChild(positionText);
};

sendButton.addEventListener("click", () => {
    const inputText = document.getElementById("text");
    const text = inputText.value.trim();
    if (text.length === 0) {
        inputText.classList.add("error");
    } else {
        if (inputText.classList.contains("error")) {
            inputText.classList.remove("error");
        };
        userChat(inputText);
        sendServer(inputText);
    };
});

geodButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        console.log("Geolocation не поддерживается вашим браузером");
    } else {
        console.log("Определение местоположения…")
        navigator.geolocation.getCurrentPosition(success, error);
    };
});


