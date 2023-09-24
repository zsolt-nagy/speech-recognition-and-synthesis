const speechRecognitionStartButton = document.querySelector(".js-speech-recognition-start");
const textListNode = document.querySelector(".js-felismert-szöveg-lista");

const textList = [];

const ACTIONS = {
    Delete: "Delete",
    Read: "Read",
};

let felismerő = null;
if (typeof window.webkitSpeechRecognition === "function") {
    felismerő = new window.webkitSpeechRecognition();
} else if (typeof window.SpeechRecognition === "function") {
    felismerő = new window.SpeechRecognition();
}

if (felismerő !== null) {
    felismerő.interimResults = true;
    felismerő.lang = "hu-HU";

    felismerő.addEventListener("result", updateRecognizedResults);
    felismerő.addEventListener("end", endRecognition);
    textListNode.addEventListener("click", handleListItemButtonClicked);

    speechRecognitionStartButton.addEventListener("click", startSpeechRecognition);
}

function handleListItemButtonClicked(event) {
    const index = event.target.dataset.index;
    const action = event.target.dataset.action;

    if (action === ACTIONS.Delete && typeof index === "string") {
        textList.splice(index, 1);
        render();
    } else if (action === ACTIONS.Read && typeof index === "string") {
        synthetizeText(textList[index]);
    }
}

function render() {
    textListNode.innerHTML = textList
        .map(
            (szöveg, index) => `
        <li>
            ${szöveg} 
            <button type="button" data-action="${ACTIONS.Delete}" data-index="${index}">🗑</index>
            <button type="button" data-action="${ACTIONS.Read}" data-index="${index}">📖</index>
        </li>
    `
        )
        .join("");
}

function startSpeechRecognition() {
    felismerő.start();
    speechRecognitionStartButton.setAttribute("disabled", true);
}

function updateRecognizedResults(event) {
    if (event.results.length > 0 && event.results[0].isFinal === true) {
        if (event.results[0].length > 0) {
            let szöveg = event.results[0][0].transcript;
            textList.push(szöveg);
            render();
        }
    }
}

function endRecognition(event) {
    speechRecognitionStartButton.removeAttribute("disabled");
}

function getVoice() {
    let index = document.querySelector("#voiceSelect").value;
    return selectableVoices[index];
}

function synthetizeText(text) {
    if (typeof text === "string") {
        const üzenet = new SpeechSynthesisUtterance();
        üzenet.text = text;
        const felolvasóHang = getVoice();
        console.log(felolvasóHang);
        if (felolvasóHang !== null) {
            üzenet.voice = felolvasóHang;
        }
        speechSynthesis.speak(üzenet);
    }
}
