const socket=io();

let textarea=document.querySelector("#textarea");
let messageArea=document.querySelector(".message_area");
let name;
do {
    name=prompt("please enter your name");
} while (!name);

textarea.addEventListener("keyup",(e)=>{
    if(e.key==='Enter')
    {
        sendMessage(e.target.value);
    }
});

function sendMessage(message){
    let msg={
        user:name,
        message:message.trim()
    }

    //append message 
    appendMessage(msg,'outgoing');
    textarea.value="";
    scrolltoptobottom();
    //send to server
    socket.emit("message",msg);
}

function appendMessage(msg,type){
    let mainDiv=document.createElement("div");
    let className=type;
    mainDiv.classList.add(className,'message');
    let markUp=`
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
    `
    mainDiv.innerHTML=markUp;
    messageArea.appendChild(mainDiv);
}

//recieve message

socket.on("message",(msg)=>{
    appendMessage(msg,"incoming");
    scrolltoptobottom();
});

function scrolltoptobottom(){
    messageArea.scrollTop=messageArea.scrollHeight;
}