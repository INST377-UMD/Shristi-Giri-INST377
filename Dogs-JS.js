const dogAPI = "https://dog.ceo/api/breeds/image/random";

async function randomDogImage() {
    const response = await fetch(dogAPI);
    const data = await response.json();
    return data.message;
}

async function populateSlider() {
    const carouselContainer = document.querySelector('[data-simple-slider]');
    let imageHtml = '';

    /* populate slider using loop to store only 10 random images from dog api */
    for (let i = 1; i <= 10; i++) {
        const imageUrl = await randomDogImage();
        imageHtml += `<img src="${imageUrl}" style="width:100%; height:100%"/>`;
    }

    carouselContainer.innerHTML = imageHtml;

    simpleslider.getSlider();
}

const dogBreedAPI = "https://dogapi.dog/api/v2";

async function fetchBreeds() {
    const response = await fetch(`${dogBreedAPI}/breeds`);
    const data = await response.json();
    return data.data;
}

async function fetchBreedInfo(breedId) {
    const response = await fetch(`${dogBreedAPI}/breeds/${breedId}`);
    const data = await response.json();
    return data.data.attributes; /* return dog breed info (ex. description, life, etc) */
}

async function populateBreedButtons() {
    const buttonContainer = document.getElementById("button-container");
    const breeds = await fetchBreeds();

    /* create buttons for each breed from api */
    breeds.forEach((breed) => {
        const button = document.createElement("button");
        button.textContent = breed.attributes.name;
        button.setAttribute("class", "breed-button");
        button.setAttribute("data-id", breed.id);
        button.addEventListener("click", () => displayBreedDetails(breed.id));
        buttonContainer.appendChild(button);
    });
}

async function displayBreedDetails(breedId) {
    const detailsContainer = document.getElementById("details-container");
    const breed = await fetchBreedInfo(breedId);

    /* extract breed info needed for the containers listing necessary details */
    const name = breed.name;
    const description = breed.description;
    const minLife = breed.life.min;
    const maxLife = breed.life.max;

    detailsContainer.innerHTML = `
        <h2>${name}</h2>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Min Life Span:</strong> ${minLife} years</p>
        <p><strong>Max Life Span:</strong> ${maxLife} years</p>
    `;
    detailsContainer.style.display = "block";
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
            },
            'load dog breed *dogBreed': async (dogBreed) => {
                const breeds = await fetchBreeds();
                const matchingBreed = breeds.find(breed =>
                    breed.attributes.name.toLowerCase() === dogBreed.toLowerCase()
                );

                if (matchingBreed) {
                    displayBreedDetails(matchingBreed.id);
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
    populateSlider();
    populateBreedButtons();
    initializeAnnyang();
};