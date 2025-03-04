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

app.get('/ejs', (_, res) => {
    res.render('layout', { title: 'EJS', message: 'Test message', body: 'index' })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})