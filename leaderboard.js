const params = window.location.search
const searchParams = new URLSearchParams(params)
const id = searchParams.get('id')

const leaderboardInnerSection = document.querySelector("#leaderboard-inner-section")
const appSubtitleContainer = document.querySelector("#app-subtitle-container")

fetch('http://brain-spark-back-end.herokuapp.com/users')
    .then(response => response.json())
    .then(users => getTopSevenUsers(users))

function getTopSevenUsers(users) {    
    // const topValues = users.lifetime_score.sort((a,b) => b-a).slice(0,5)
    // console.log(topValues) 

   const topUsers = users.sort(function(a, b) {
        return a.lifetime_score - b.lifetime_score
    }).reverse()
    const topSeven = topUsers.slice(0, 7)
    postTopSeven(topSeven)
}

function postTopSeven(topSeven) {
    let i = 1
    topSeven.forEach(user => {
        const createUsernameH1 = document.createElement('h1')
        const createSparkScoreH1 = document.createElement('h1')
        const createRankingContainer = document.createElement('section')

        createUsernameH1.innerHTML = `<div id="ranking">#${i}</div> ${user.username}`
        createUsernameH1.className = "username-h1"
        createSparkScoreH1.innerText = user.lifetime_score
        createSparkScoreH1.className = "spark-score-h1"
        createRankingContainer.className = "ranking-container"

        createRankingContainer.append(createUsernameH1, createSparkScoreH1)
        leaderboardInnerSection.append(createRankingContainer)
        i++
    })
    createLinkBackHome()
}
function createLinkBackHome() {
    const linkBackToHome = document.createElement('a')

    linkBackToHome.href = `http://brain-spark.firebaseapp.com/userHomePage.html?id=${id}`
    linkBackToHome.id = "link-back-home"
    linkBackToHome.innerText = "Home"

    appSubtitleContainer.append(linkBackToHome)
}


