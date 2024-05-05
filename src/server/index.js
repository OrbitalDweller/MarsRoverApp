require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// API calls
app.get('/manifest/:rover', async (req, res) => {
    try {
        const rover = req.params.rover
        let manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ manifest })
    } catch (err) {
        console.log('error:', err)
    }
})

app.get('/photo/:rover/:sol', async (req, res) => {
    try {
        const rover = req.params.rover
        const sol = req.params.sol
        let photos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?api_key=${process.env.API_KEY}&sol=${sol}`)
            .then(res => res.json())
        res.send({ photos })
    } catch (err) {
        console.log('error', err)
    }
})

// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))