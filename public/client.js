const socket = io();

let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message_area");
let loginOverlay = document.querySelector("#login-overlay");
let usernameInput = document.querySelector("#username-input");
let joinBtn = document.querySelector("#join-btn");

let name;

// Handle Join
const joinChat = () => {
    const inputName = usernameInput.value.trim();
    if (inputName) {
        name = inputName;
        loginOverlay.style.opacity = '0';
        setTimeout(() => {
            loginOverlay.style.display = 'none';
            textarea.focus();
        }, 500);
    }
};

joinBtn.addEventListener("click", joinChat);
usernameInput.addEventListener("keyup", (e) => {
    if (e.key === 'Enter') joinChat();
});

textarea.addEventListener("keyup", (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
        sendMessage(e.target.value);
    }
});

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // Append message 
    appendMessage(msg, 'outgoing');
    textarea.value = "";
    scrollToBottom();

    // Send to server
    socket.emit("message", msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement("div");
    mainDiv.classList.add(type, 'message');

    let markUp = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
        <span class="timestamp">${msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    `
    mainDiv.innerHTML = markUp;
    messageArea.appendChild(mainDiv);
}

// Receive message
socket.on("message", (msg) => {
    appendMessage(msg, "incoming");
    scrollToBottom();
});

function scrollToBottom() {
    messageArea.scrollTo({
        top: messageArea.scrollHeight,
        behavior: 'smooth'
    });
}