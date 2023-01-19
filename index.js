require('dotenv').config()
require('./config/database').connect()

const express = require('express')
const Morgan = require('morgan')
const MethodOverride = require('method-override')
const connectMongo = require('connect-mongo')
const flash = require('connect-flash')
const CookieParser = require('cookie-parser')
const Session = require('express-session')
const ExpressMongoSanitize = require('express-mongo-sanitize')
const AppError = require('./Error')
const EjsMate = require('ejs-mate')
const path = require('path')
const app = express()
const IndexRoute = require('./routes/index')
const AuthRoute = require('./routes/Auth/auth')

app.use(express.static(path.join(__dirname, '/assets')))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(ExpressMongoSanitize({
    replaceWith:'_'
}))
app.use(Morgan('dev'))
app.use(MethodOverride('_method'))
app.use(flash())
app.use(CookieParser('This is a Secret'))
app.use(Session({
    secret:'This is a Secret',
    resave:true,
    saveUninitialized:true,
    name:'socialmedia',
    store: connectMongo.create({
        dbName:'socialcode',
        mongoUrl:process.env.dburl
    }) 
}))
app.set('view engine', 'ejs')
app.engine('ejs', EjsMate)
app.set('/views', path.join(__dirname, '/views'))

app.use(function(req, res, next){
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    if(req.signedCookies.__cu__){
        if(req.signedCookies._user){
            res.locals.currentUser = req.signedCookies._user.currentUser
            res.locals.username = req.signedCookies._user.username
        }else{
            res.clearCookie('__cu__')
            res.locals.currentUser = 'Social Media'
            res.locals.username = ''
        }
    }else{
        res.clearCookie('_user')
        res.locals.currentUser = 'Social Media'
        res.locals.username = ''
    }
    next()
})

app.use('/', IndexRoute)
app.use('/user', AuthRoute)
// app.use('/post')


//Error handler//

app.use('*', function(req, res, next){
    next(new AppError('Page not available', 404))
})

app.use(function(err, req, res, next){
    const {message, status=404} = err
    res.status(status).render('error', {message, status})
})

app.listen(process.env.PORT, function(){
    console.log(`Server is up on ${process.env.PORT}`);
})