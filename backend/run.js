const express = require('express')
const path = require('path')
const api = require('./api')
const db = require('./db')

const app = express()
const port = 5000

app.use(express.static(path.join(__dirname, '../', 'frontend', 'build')))

//odpowiedz na pytanie /api
//argumenty do requesta
//typ requesta
//wykonac odpowiednia funkcje z argumentami

app.get('/api', (req, res) => {
    const endpoint = req.query.endpoint
    const args = req.query.args

    const func = api.endpointMap[endpoint]
    if(!func)
    {
        res.status(469).send({error: "Invaild endpoint :'("})
    }
    else
    {
        func(args)
        .then(
            (result) => res.status(200).send(result),
            (error) => res.status(error.code).send(error)
        )
    }
})

app.post('/*', (req, res) => {
    res.status(404).send({ error: "Not found." })
})

app.get('/*', (req, res) => {
    console.log(`Requested: ${req.url}`)
    res.sendFile(path.join(__dirname, '../', 'frontend', 'build', 'index.html'))
})

db.connect(() => app.listen(port, () => console.log(`Server is running on port ${port}!`)))