const quoteAPI = "https://zenquotes.io/api/random";

async function displayQuote(quoteAPI) {
    const response = await fetch(quoteAPI);
    const data = await response.json();

    /* extracts quote and author */
    const quote = data[0].q;
    const author = data[0].a;

    document.getElementById("quote-text").innerHTML = `
        "<strong>${quote}"<br><br>— ${author}<strong>`;
}

function initializeAnnyang() {
    if (annyang) {
        const commands = {
            'hello': () => {
                alert('Hello world!');
            },
            'change the color to *color': (color) => {
                document.body.style.backgroundColor = color
            },
            'navigate to *page': (page) => {
                if (page === "home") {
                    window.location.href = 'Home.html';
                } else if (page === "stocks") {
                    window.location.href = 'Stock_Page.html';
                } else if (page === "dogs") {
                    window.location.href = 'Dogs_Page.html';
                }
            }
        };

        annyang.addCommands(commands);

        const turnOnAudio = () => {
            annyang.start();
        };

        const turnOffAudio = () => {
            annyang.abort();
        };

        document.querySelector('.turn-on').addEventListener('click', turnOnAudio);
        document.querySelector('.turn-off').addEventListener('click', turnOffAudio);
    }

}

window.onload = () => {
    displayQuote(quoteAPI);
    initializeAnnyang();

};