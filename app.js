const express = require('express')
const app = express()
const port = 3030

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/healthz', (req, res) =>{
	res.set('Content-Type', 'application/json')
    res.send('{"status":"ok"}')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})