const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const AppError = require('../../Error')

module.exports.register = function (req, res, next) {
    res.render('user/register')
}

module.exports.NewUser = async function (req, res, next) {
    try {
        const { firstname, lastname, email, username, password } = req.body
        if (!(firstname && lastname && email && username && password)) {
            req.flash('error', 'All fields are mendatory try again')
            res.redirect('/user/register')
        } else {
            const u1 = await User.findOne({ username: username.toLowerCase() })
            if (u1) {
                req.flash('error', 'username is already taken try again')
                res.redirect('/user/register')
            } else {
                const user = new User({
                    firstname: firstname,
                    lastname: lastname,
                    email: email.toLowerCase(),
                    username: username.toLowerCase(),
                    password: password
                })

                const token = jwt.sign({
                    currentUser: user._id,
                    username: user.username,
                },
                    process.env.token,
                )
                token.token = token
                const decode = jwt.verify(token, process.env.token)
                res.cookie('__cu__', token, { httpOnly: true, signed: true})
                res.cookie('_user', decode, { httpOnly: true, signed: true})
                await user.save()
                req.flash('success', 'Thank you for registering with us')
                res.redirect('/')
            }
        }
    } catch (error) {
        next(new AppError(error, 500))
    }
}

module.exports.Login = function (req, res) {
    res.render('user/login')
}

module.exports.UserLogin = async function (req, res, next) {
    try {
        const { username, password } = req.body
        if (!(username && password)) {
            req.flash('error', 'All fields are required try again')
            res.redirect('/user/login')
        } else {
            const u1 = await User.findOne({ username: username.toLowerCase() })
            if (!u1) {
                req.flash('error', 'User not registered yet')
                res.redirect('/user/register')
            } else {
                const verify = await bcrypt.compare(password, u1.password)
                if (!verify) {
                    req.flash('error', 'Invalid username or a password')
                    res.redirect('/user/login')
                } else {
                    const token = jwt.sign({
                        currentUser: u1._id,
                        username: u1.username
                    },
                        process.env.token
                    )
                    const decode = jwt.verify(token, process.env.token)
                    res.cookie('__cu__', token, { httpOnly: true, signed: true, secure:true})
                    res.cookie('_user', decode, { httpOnly: true, signed: true, secure:true})
                    req.flash('success', `Welcome Back ${u1.firstname}`)
                    res.redirect('/')
                }
            }
        }
    } catch (error) {
        next(new AppError(error, 500))
    }
}

module.exports.Logout = function(req, res, next){
    try {
        res.clearCookie('__cu__')
        res.clearCookie('_user')
        res.redirect('/')
    } catch (error) {
        next(new AppError(error, 500))
    }
}