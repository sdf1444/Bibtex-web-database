const showNotification = (textMessage) => {
    let text = document.createElement("div");
    text.innerHTML = textMessage;
    console.log(text);
    text.style.position = "fixed";
    text.style.top = "200px";
    text.style.width = "100%";
    text.style.fontWeight = "bold";
    text.style.fontSize = "25px";
    text.style.zIndex = "999";
    text.style.textAlign = "center";
    text.style.opacity = "1";
    document.documentElement.appendChild(text);
    let op = 1;
    let h = 0;
    let changeOpacity = setInterval(() => {
        if (op <= 0) {
            clearInterval(changeOpacity);
            document.documentElement.removeChild(text);
        }
        else {
            op -= 0.03;
            h += 1;
        }
        text.style.top = (200 - h) + "px";
        text.style.opacity = op;
    }, 25);
}

chrome.runtime.onMessage.addListener((message, sender, callback) => {
    console.log('received message');
    console.log(message);
    if (message.functiontoInvoke === "showNotification") {
        showNotification(message.text);
    }
})