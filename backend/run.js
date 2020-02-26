const express = require('express')
const path = require('path')

const app = express()
const port = 5000

app.use(express.static(path.join(__dirname, '../', 'frontend', 'build')))

app.post('/*', (req, res) => {
    res.status(404).send({ error: "Not found." })
})

app.get('/*', (req, res) => {
    console.log(`Requested: ${req.url}`)
    res.sendFile(path.join(__dirname, '../', 'frontend', 'build', 'index.html'))
})

app.listen(port, () => console.log(`Server is running on port ${port}!`))