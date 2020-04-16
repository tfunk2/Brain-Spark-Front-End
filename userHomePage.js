const params = window.location.search
const searchParams = new URLSearchParams(params)
const id = searchParams.get('id')

fetch(`http://localhost:3000/users/${id}`)
    .then(response => response.json())
    .then(user => console.log(user))