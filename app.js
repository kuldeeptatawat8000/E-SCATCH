const express = require("express")
const app = express()
const mongoDB = require('./config/mongoose-connection')
const cookieParser = require("cookie-parser")
const path = require("path")
const env = require("dotenv")
const ownersRouter = require("./routes/ownersRouter")
const usersRouter = require('./routes/usersRouter')
const productsRouter = require('./routes/productsRouter')
const indexRouter = require("./routes/indexRouter")
env.config();
const dbgr = require("debug")("development: mongoose")
const expressSession = require('express-session')
const flash = require("connect-flash")

//Config
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
)
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "views"));

//Routers 
app.use('/', indexRouter)
app.use('/owners', ownersRouter)
app.use('/users', usersRouter)
app.use('/products', productsRouter)

//Server Connect
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    mongoDB();
    dbgr(`Server Listen http://localhost:${PORT}`)
})