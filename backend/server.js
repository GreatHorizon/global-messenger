var express = require('express')
var session = require('express-session')
var app = express()
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

var registerRouter = require('./routes/registerRouter')
var loginRouter = require('./routes/loginRouter')
var searchRouter = require('./routes/searchRouter')
var homeRouter = require('./routes/homeRouter')
var logoutRouter = require('./routes/logoutRouter')
var addChatRouter = require('./routes/addChatRouter')
var userChatsRouter = require('./routes/userChatsRouter')
var deleteChatRouter = require('./routes/deleteChatRouter')
var SQLiteStore = require('connect-sqlite3')(session)
var cors = require('cors')
var globals = require('./config/globals')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.set('trust proxy', 1);
app.use(cors({ credentials: true, origin: true }))
app.use(cookieParser())
app.use(session({
    secret: globals.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new SQLiteStore,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000, secure: true } // 1 week
}))

app.use(loginRouter)
app.use(registerRouter)
app.use(searchRouter)
app.use(homeRouter)
app.use(logoutRouter)
app.use(addChatRouter)
app.use(deleteChatRouter)
app.use(userChatsRouter)

app.listen('3000', () => {
    console.log('Server started on port 3000...')
})
app.get('/', (req,res) => {

})