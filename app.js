const express = require("express")
const app = express()
const mongoDB = require('./config/mongoose-connection')
const cookieParser = require("cookie-parser")
const path = require("path")
const env = require("dotenv")
const ownersRouter = require("./routes/ownersRouter")
const usersRouter = require('./routes/usersRouter')
const productsRouter = require('./routes/productsRouter')
env.config();
const dbgr = require("debug")("development: mongoose")

//Config
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')



//Routes
app.get("/", (req, res) => {
    res.send("Hello World !")
})

app.use('/owners', ownersRouter)
app.use('/users', usersRouter)
app.use('/products', productsRouter)

//Server Connect
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    mongoDB();
    dbgr(`Server Listen http://localhost:${PORT}`)
})