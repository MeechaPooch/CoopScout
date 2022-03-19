import express from 'express'
const app = express()
const port = 3001

app.use(express.static('../site'));

app.get('/', (req, res) => {
  res.sendFile('index.html',{root:'../site'})
})
app.get('/:resource', (req, res) => {
    res.sendFile(req.params.resource,{root:'../site'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})