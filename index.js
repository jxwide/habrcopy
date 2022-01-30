const express = require('express')
const app = express()
const hbs = require('hbs')
const path = require('path')
const catRouter = require('./catRouter')
const port = process.env.PORT || 3000

// hbs
app.set('view engine', 'hbs')
hbs.registerPartials(path.resolve(__dirname, 'views', 'partials'))

app.use("/category", catRouter)

const start = async () => {
    app.get('/', (req, res) => {
        res.redirect('/category/all/week')
    })
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

start()