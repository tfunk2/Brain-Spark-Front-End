const welcomeJokeSetup = document.querySelector('#welcome-joke-setup')
const welcomeJokePunchline = document.querySelector('#welcome-joke-punchline')
const loginForm = document.querySelector('#login-form')
const createUserForm = document.querySelector('#create-user-form')
const createUserButton = document.querySelector('#create-user-button')
const createUserFormContainer = document.querySelector('#create-user-form-container')

fetch('http://localhost:3000/jokes/')
    .then(response => response.json())
    .then(jokes => displayWelcomeJoke(jokes))


function displayWelcomeJoke (jokes) {
    const randomJokeIndex = Math.floor(Math.random() * 200)
    const randomJoke = jokes[randomJokeIndex]
    welcomeJokeSetup.innerText = randomJoke.setup
    welcomeJokePunchline.innerHTML = randomJoke.punchline
}

createUserForm.addEventListener('submit', () => {
    event.preventDefault()
    const formData = new FormData(createUserForm)
    const usernameInput = formData.get('username')
    const passwordInput = formData.get('password_digest')
    const userObject = {
            username: usernameInput,
            password_digest: passwordInput,
            lifetime_score: 0
        }

    fetch('http://localhost:3000/users', {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userObject)
    }).then(response => response.json())
    .then(result => console.log(result))

    successfulUserCreation()
})

function successfulUserCreation() {
    const userCreatedLabel = document.createElement('label')

    userCreatedLabel.for = "create-user-form"
    userCreatedLabel.innerText = "Username Successfully Created!"
    userCreatedLabel.id = "user-created-label"
    
    createUserFormContainer.prepend(userCreatedLabel)
}

loginForm.addEventListener('submit', () => {
    event.preventDefault()

    const formData = new FormData(loginForm)
    const usernameInput = formData.get('username')
    const passwordInput = formData.get('password_digest')


    fetch('http://localhost:3000/users/')
        .then(response => response.json())
        .then(users => searchByUsername(users))


    function searchByUsername(users){
        for (var i=0; i < users.length; i++) {
            if (users[i].username === usernameInput) {
                checkPassword(users[i])
            }
        }
    }

    function checkPassword(user){
        if (user.password_digest === passwordInput) {
            window.location.href = `userHomePage.html?id=${user.id}`
        }
    }

})