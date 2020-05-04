const welcomeJokeSetup = document.querySelector('#welcome-joke-setup')
const welcomeJokePunchline = document.querySelector('#welcome-joke-punchline')
const loginForm = document.querySelector('#login-form')
const createUserForm = document.querySelector('#create-user-form')
const createUserButton = document.querySelector('#create-user-button')
const createUserFormContainer = document.querySelector('#create-user-form-container')
const loginFormContainer = document.querySelector('#login-form-container')
const userCreatedLabel = document.createElement('label')
const previousLabel = document.getElementById('user-created-label')



// Displays the random joke at the bottom of the page

fetch('http://brain-spark-back-end.herokuapp.com/jokes/')
    .then(response => response.json())
    .then(jokes => displayWelcomeJoke(jokes))

function displayWelcomeJoke (jokes) {
    const randomJokeIndex = Math.floor(Math.random() * 200)
    const randomJoke = jokes[randomJokeIndex]
    welcomeJokeSetup.innerText = randomJoke.setup
    welcomeJokePunchline.innerHTML = randomJoke.punchline
}


// Adds event listener and other functionality for incorrect/correct entries

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

    fetch('http://brain-spark-back-end.herokuapp.com/users', {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userObject)
    }).then(response => response.json())
    .then(result => handleUserCreation(result))

    function handleUserCreation(result) {
        if (result.username) {

            if (result.username[0] === "Username must be between 6 and 14 characters long.") {
                unsuccessfulUserCreation(result.username[0])
            } else if (result.username[0] === `${usernameInput} has already been taken.`) {
                unsuccessfulUserCreation(result.username[0])
            } else if (result.username[0] === "can't be blank") {
                unsuccessfulUserCreation(result.username[0])
            } else {
                successfulUserCreation()
            }
        } else {
            if (result.password_digest[0] === "Password must be between 6 and 14 characters long.") {
                unsuccessfulUserCreation(result.password_digest[0])
            } else {
                successfulUserCreation()
            }
        }
    }
    createUserForm.reset()
})

function unsuccessfulUserCreation(error_message) {
        if (previousLabel) {
            previousLabel.remove()
        }

        userCreatedLabel.for = "create-user-form"
        userCreatedLabel.innerText = error_message
        userCreatedLabel.id = "user-created-label"
        
        createUserFormContainer.prepend(userCreatedLabel)
    
}

function successfulUserCreation() {
    userCreatedLabel.for = "create-user-form"
    userCreatedLabel.innerText = "Username Successfully Created!"
    userCreatedLabel.id = "user-created-label"
    
    createUserFormContainer.prepend(userCreatedLabel)
}


// Adds event listener to login form submit, and adds functionality to incorrect entries

loginForm.addEventListener('submit', () => {
    event.preventDefault()

    const formData = new FormData(loginForm)
    const usernameInput = formData.get('username')
    const passwordInput = formData.get('password_digest')


    fetch('http://brain-spark-back-end.herokuapp.com/users/')
        .then(response => response.json())
        .then(users => searchByUsername(users))


    function searchByUsername(users){
        for (var i=0; i < users.length; i++) {
            if (users[i].username === usernameInput) {
               return checkPassword(users[i])
            }
        }
        checkPassword("Incorrect Username or Password")
    }

    function checkPassword(user){
        if (user === "Incorrect Username or Password") {
            wrongUserOrPassword()
        } else if (user.password_digest !== passwordInput) {
            wrongUserOrPassword()
        } else if (user.password_digest === passwordInput) {
            window.location.href = `userHomePage.html?id=${user.id}`
        } else {
            console.log("something went wrong in checkPassword")
        }
    }

    function wrongUserOrPassword() {
        const wrongUserOrPasswordLabel = document.createElement('label')

        wrongUserOrPasswordLabel.for = "login-form"
        wrongUserOrPasswordLabel.innerText = "Incorrect Username or Password"
        wrongUserOrPasswordLabel.id = "login-label"
        
        loginFormContainer.prepend(wrongUserOrPasswordLabel)
    }

})