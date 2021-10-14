const express = require('express')
const app = express()

// hardcoded temporal
const games = [
    {
        id: 1234567890,
        name: 'Catan',
        scores: ['building points', 'points', 'longest route', 'biggest army', 'development points']
    },
    {
        id: 6298272910,
        name: 'War for Chicken Island',
        scores: ['points', 'beautiful points']
    }
]

app.get('/games', (_req, res) => {
    res.json(games)
})

app.listen(3000, () => {
    console.log('App listening on port 3000')
})