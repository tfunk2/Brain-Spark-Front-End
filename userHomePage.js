const params = window.location.search
const searchParams = new URLSearchParams(params)
const id = searchParams.get('id')


const currentDate = new Date()
const monthDay = (currentDate.getMonth() + 1) + '/' + currentDate.getDate()
const currentDay = currentDate.getDate()
const currentYear = currentDate.getFullYear()
console.log(currentDate.getMonth() + 1)

const userSection = document.querySelector('#user-section')
const dateElement = document.querySelector('#date')
const dateFactElement = document.querySelector('#random-date-fact')
const numberElement = document.querySelector('#number')
const numberFactElement = document.querySelector('#random-number-fact')
const triviaSection = document.querySelector('#trivia-section')
const triviaForm = document.querySelector('#trivia-form')
const triviaDropdown = document.querySelector('#answers-dropdown')

const userWelcome = document.createElement('h3')
const sparkLabel = document.createElement('h3')
const totalSparks = document.createElement('h2')
const dropdownOption1 = document.createElement('option')
const dropdownOption2 = document.createElement('option')
const dropdownOption3 = document.createElement('option')
const dropdownOption4 = document.createElement('option')
const difficultyH3 = document.createElement('h3')
const categoryH3 = document.createElement('h3')
const sparkWorthH3 = document.createElement('h3')
const triviaQuestion = document.createElement('p')
const checkAnswerInput = document.createElement('input')
const leaderboardLink = document.createElement('a')

triviaForm.addEventListener("submit", checkAnswer)


fetch(`http://brain-spark-back-end.herokuapp.com/users/${id}`)
    .then(response => response.json())
    .then(user => displayUserInfo(user))

function displayUserInfo(user) {
    const userWelcomeContainer = document.createElement('div')

    userWelcomeContainer.id = "user-welcome-container"
    userWelcome.innerHTML = `Welcome <div id="username">${user.username}</div>`
    userWelcome.id = "user-welcome"
    sparkLabel.innerText = "- Lifetime Sparks Earned -"
    sparkLabel.id = "spark-label"
    totalSparks.innerText = user.lifetime_score
    totalSparks.id = "total-sparks"
    leaderboardLink.innerText = "Leaderboard"
    leaderboardLink.href = `http://brain-spark.firebaseapp.com/leaderboard.html?id=${id}`
    leaderboardLink.id = "leaderboard-link"

    userWelcomeContainer.append(userWelcome, sparkLabel, totalSparks, leaderboardLink)
    userSection.append(userWelcomeContainer)
}

// display date facts

fetch('http://brain-spark-back-end.herokuapp.com/date_facts')
    .then(response => response.json())
    .then(date_facts => displayDateFacts(date_facts))

function displayDateFacts(date_facts) {
   let data = date_facts.filter(function (item) {
       return item.date_of_fact == monthDay
   })
    // console.log(data)
   const randomDateFactIndex = Math.floor(Math.random() * data.length)
   dateElement.innerHTML = `Today is<div id="todays-date">${data[randomDateFactIndex].date_of_fact + "/" + currentYear}</div>`
   dateFactElement.innerText = data[randomDateFactIndex].fact
}

// display number facts 

fetch('http://brain-spark-back-end.herokuapp.com/number_facts')
    .then(response => response.json())
    .then(number_facts => displayNumberFacts(number_facts))

function displayNumberFacts(number_facts) {
    let data = number_facts.filter(function (item) {
        return item.number == currentDay
    })
    // console.log(data)
    const randomNumberFactIndex = Math.floor(Math.random() * data.length)
    numberElement.innerHTML = `Todays number<div id="todays-number">${data[randomNumberFactIndex].number}</div>`
    numberFactElement.innerText = data[randomNumberFactIndex].fact
    }


// display trivia
let trivia
let randomTriviaQuestion
fetch('http://brain-spark-back-end.herokuapp.com/trivia')
    .then(response => response.json())
    .then(triviaArray => generateTriviaDropdown(triviaArray))

function generateTriviaDropdown(triviaArray) {
    trivia = triviaArray
    const randomTriviaIndex = Math.floor(Math.random() * 750)
    randomTriviaQuestion = trivia[randomTriviaIndex]
    
    defineWorth()

    triviaQuestion.id = "trivia-question"
    difficultyH3.id = "difficulty"
    sparkWorthH3.id = "spark-worth"
    categoryH3.id = "category"
    checkAnswerInput.type = "submit"
    checkAnswerInput.value = "Check Answer"
    difficultyH3.innerText = 
        `${randomTriviaQuestion.difficulty.charAt(0).toUpperCase() + randomTriviaQuestion.difficulty.slice(1)} Difficulty`
    categoryH3.innerText = `${randomTriviaQuestion.category} Trivia`
    triviaQuestion.innerText = randomTriviaQuestion.question
    

    let answersArray = [
        randomTriviaQuestion.correct_answer, 
        randomTriviaQuestion.incorrect_answer_1,
        randomTriviaQuestion.incorrect_answer_2,
        randomTriviaQuestion.incorrect_answer_3
    ]
    console.log(randomTriviaQuestion)
    // console.log(answersArray)
    function arrayShuffle(array) {
        for (let i = 3; i > 0; i-- ) {
            let newPosition = Math.floor(Math.random() * (i + 1))
            let temporaryPosition = array[i]
            array[i] = array[newPosition]
            array[newPosition] = temporaryPosition
        }
        return array
    }

    let shuffledArray = arrayShuffle(answersArray)

    dropdownOption1.value = shuffledArray[0]
    dropdownOption2.value = shuffledArray[1]
    dropdownOption3.value = shuffledArray[2]
    dropdownOption4.value = shuffledArray[3]
    dropdownOption1.innerText = shuffledArray[0]
    dropdownOption2.innerText = shuffledArray[1]
    dropdownOption3.innerText = shuffledArray[2]
    dropdownOption4.innerText = shuffledArray[3]
    dropdownOption1.name = "selected_answer"
    dropdownOption2.name = "selected_answer"
    dropdownOption3.name = "selected_answer"
    dropdownOption4.name = "selected_answer"

    triviaSection.prepend(categoryH3, difficultyH3, sparkWorthH3, triviaQuestion)
    triviaDropdown.append(dropdownOption1, dropdownOption2, dropdownOption3, dropdownOption4)
    triviaForm.append(triviaDropdown, checkAnswerInput)

    
}

function defineWorth () {
    switch(randomTriviaQuestion.difficulty) {
        case "easy": 
            sparkWorthH3.innerHTML = `Worth <div class="sparks">50</div> Sparks`
            break
        case "medium":
            sparkWorthH3.innerHTML = `Worth <div class="sparks">100</div> Sparks`
            break
        case "hard":
            sparkWorthH3.innerHTML = `Worth <div class="sparks">200</div> Sparks`
            break
        default: 
            console.log("defineWorth switch statement")
    }
}

function checkAnswer(event) {
    event.preventDefault()
    const formData = new FormData(triviaForm)
    const answerInput = formData.get('selected_answer')
    const wrongOrRight = document.createElement('h3')
    wrongOrRight.id = "wrong-or-right"
    
    console.log("answer input", answerInput, randomTriviaQuestion.correct_answer)
    if (answerInput !== randomTriviaQuestion.correct_answer) {
        
        wrongOrRight.innerHTML = `That wasn't right! <div id="previous-answer">Previous question's correct Answer: ${randomTriviaQuestion.correct_answer}</div>`
        triviaForm.append(wrongOrRight)
        console.log("wrong")
    } else if (answerInput === randomTriviaQuestion.correct_answer) {
        let sparksToAdd
        if (randomTriviaQuestion.difficulty == "easy") {
            sparksToAdd = 50
            wrongOrRight.innerText = "Correct! +50 Sparks!"
            triviaForm.append(wrongOrRight)
        } else if (randomTriviaQuestion.difficulty == "medium"){
            sparksToAdd = 100
            wrongOrRight.innerText = "Correct! +100 Sparks!"
            triviaForm.append(wrongOrRight)
        } else if (randomTriviaQuestion.difficulty == "hard") {
            sparksToAdd = 200
            wrongOrRight.innerText = "Correct! +200 Sparks!"
            triviaForm.append(wrongOrRight)
        }

        addSparkScore(sparksToAdd) 

        
    }
    triviaForm.reset()
    generateTriviaDropdown(trivia)
}
function addSparkScore(sparksToAdd) {
    // console.log(user, sparksToAdd)
    totalSparks.innerText = parseInt(totalSparks.innerText) + sparksToAdd

    fetch(`http://brain-spark-back-end.herokuapp.com/users/${id}`, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            lifetime_score: totalSparks.innerText
        })
    }).then(response => response.json())
    .then(console.log)
}
