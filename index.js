const welcomeJokeSetup = document.querySelector('#welcome-joke-setup')
const welcomeJokePunchline = document.querySelector('#welcome-joke-punchline')

fetch('http://localhost:3000/jokes/')
    .then(response => response.json())
    .then(jokes => displayWelcomeJoke(jokes))


function displayWelcomeJoke (jokes) {
    const randomJokeIndex = Math.floor(Math.random() * 200)
    const randomJoke = jokes[randomJokeIndex]
    welcomeJokeSetup.innerText = randomJoke.setup
    welcomeJokePunchline.innerHTML = randomJoke.punchline
}