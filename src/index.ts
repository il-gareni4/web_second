import express from "express"

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', 'src/views')

app.get('/', (_, res) => {
    res.send('Hello World!')
})

app.get('/ejs', (req, res) => {
    res.render('layout', { title: 'EJS', message: req.query.message || "No message sent", body: 'index' })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})