let selectableVoices = [];

function populateVoiceList() {
    if (typeof speechSynthesis === "undefined") {
        return;
    }

    const voices = speechSynthesis.getVoices();
    selectableVoices = [];
    document.getElementById("voiceSelect").innerHTML = "";

    for (let i = 0; i < voices.length; i++) {
        if (voices[i].lang === "hu-HU") {
            selectableVoices.push(voices[i]);

            const option = document.createElement("option");
            option.textContent = `${voices[i].name} (${voices[i].lang})`;

            if (voices[i].default) {
                option.textContent += " — DEFAULT";
            }

            option.setAttribute("value", selectableVoices.length - 1);
            option.setAttribute("data-lang", voices[i].lang);
            option.setAttribute("data-name", voices[i].name);
            document.getElementById("voiceSelect").appendChild(option);
        }
    }
}

populateVoiceList();
if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.addEventListener("voiceschanged", populateVoiceList);
}
