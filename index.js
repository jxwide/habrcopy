const express = require('express')
const app = express()
const hbs = require('hbs')
const path = require('path')
const catRouter = require(path.resolve(__dirname, 'router', 'category.js'))
const indexRouter = require(path.resolve(__dirname, 'router', 'index.js'))
const port = process.env.PORT || 3000

// hbs
app.set('view engine', 'hbs')
hbs.registerPartials(path.resolve(__dirname, 'views', 'partials'))

app.use("/category", catRouter)
app.use("/", indexRouter)

const start = async () => {
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

start()