const express = require('express')
const bodyParser = require('body-parser')
const { json } = require('body-parser')
const app = express()


// Datos estáticos temporales
// Temporalmente guardar los usuarios en memoria y después los guardare en una BD
let usuarios = []
let scoreboards = []
const games = [
    {
        id: 1234567890,
        name: 'Catan',
        slug: 'catan',
        scores: ['building points', 'points', 'longest route', 'biggest army', 'development points']
    },
    {
        id: 6298272910,
        name: 'War for Chicken Island',
        slug: 'war-for-chicken-island',
        scores: ['points', 'beautiful points']
    }
]

// middleware
app.use(bodyParser.json())

app.get('/games', (_req, res) => {
    res.json(games)
})

app.get('/games/:slug', (req, res) =>  {
    const slug = req.params.slug;

    const game = games.find((game) => {
        return slug === game.slug
    })

    if (game === undefined) {
        res.status(404)
        return res.json({
            error: 'Juego no encontrado'
        })
    }

    return res.json(game)
})

// obtener todos los scoreboards de un juego en específico
app.get('/scoreboards/:gameSlug', (req, res) => {
    const gameSlug = req.params.gameSlug;
    const filteredScoreboards = scoreboards.filter((scoreboard) => {
        return scoreboard.gameSlug === gameSlug
    })

    if(filteredScoreboards.length > 0) {
        return res.json({
            error: null,
            scoreboards: filteredScoreboards
        })
    }

    res.status(404)
    return res.json({
        error: 'No se encontraron scoreboards para este juego'
    })
})

// crear un scoreboard para un juego en específico
app.post('/scoreboards/:gameSlug', (req, res) => {
    const gameSlug = req.params.gameSlug;
    const { gameName, players } = req.body;

    // sumar los scores de los jugadores
    const playersUpdated = players.map((player) => {
        let scoreTotal = 0;
        player.scores.forEach((score) => {
            scoreTotal += score.scoreValue
        })
        player.total = scoreTotal;
        return player;
    })

    const scoreboard = {
        id: Math.round(Math.random() * 1000000), // ID FALSO TEMPORAL 
        createdAt: new Date(),
        gameSlug,
        gameName,
        players: playersUpdated
    }

    scoreboards.push(scoreboard)

    console.log('Scoreboards: ', scoreboards)

    return res.json({
        error: null,
        scoreboard
    })
})

// obtener todos los scoreboards de un juego
app.get('/scoreboards/:gameSlug/:scoreId', (req, res) => {
    const gameSlug = req.params.gameSlug;
    const scoreId = req.params.scoreId;
    const scoreboard = scoreboards.find( (scoreboard) => {
        return scoreboard.id == scoreId && scoreboard.gameSlug === gameSlug
    })

    if (scoreboard === undefined) {
        res.status(404)
        return res.json({
            error: 'Score board no encontrado'
        })
    }

    return res.json({
        error: null,
        scoreboard,
    })
})

app.post('/login', (req, res) => {
    // leer del request los datos de email y password
    const email = req.body.email;
    const password = req.body.password

    // buscar usuario en la "base de datos" (buscar en el arreglo de usuarios si hay uno con el mismo email)
    const user = usuarios.find( (usuario) => {
        return email === usuario.email
    }) 

    if (user === undefined) {
        return res.json({
            error: 'Usuario o password inválido'
        })
    }

    // comparar el password
    if (user.password === password) {
        // retornar un json con un mensaje de status ok si el email y password existen en la BD
        return res.json({
            user: {
                email: user.email,
                username: user.username,
                createdAt: user.createdAt
            },
            error: null,
        })
    }

    // retornar un error
        return res.json({
            error: 'Ususario o password inválidos'
        })
})

// Register
app.post('/register', (req, res) => {

    // destructuring
    const { email, password, username } = req.body
    
    // validación básica (solo para revisar que tienen contenido)
    if (!!!email || !!!password || !!!username) {
        return res.json({
            error: 'El email, username y el password son obligatorios'
        })
    }

    const user = {
        email,
        password,
        username,
        createdAt: new Date()
    }
    usuarios.push(user)
    console.log(usuarios)
    return res.json({
        user: {
            email,
            username,
            createdAt: new Date()
        }
    })
})

app.listen(3000, () => {
    console.log('App listening on port 3000')
})