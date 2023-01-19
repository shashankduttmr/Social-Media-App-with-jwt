const jwt = require('jsonwebtoken')

module.exports.isLoggedin = function (req, res, next) {
    try {
        const token = req.signedCookies.__cu__ ||
            req.body.token ||
            req.header('Authorization').replace('Bearer ', '')
        if (token) {
            console.log(token);
            const decode = jwt.verify(token, process.env.token)
            if (decode) {
                req.currentUser = decode.currentUser
                req.username = decode.username
                req.decode = decode
                console.log(req.decode);
                if (decode.currentUser && decode.username && req.currentUser && req.username) {
                    next()
                } else {
                    req.flash('error', 'You must be logged in first to access this place')
                    res.redirect('/user/login')
                }
            }
        } else {
            req.flash('error', 'You must be logged in first to access this place')
            res.redirect('/user/login')
        }
    } catch(error) {
        req.flash('error', 'You must be logged in first to access this place')
        res.redirect('/user/login')
    }
}

module.exports.logger = function (req, res, next) {
    try {
        const token = req.signedCookies.__cu__ ||
            req.body.token ||
            req.header('Authorization').replace('Bearer ', '')
        if (token) {
            const decode = jwt.verify(token, process.env.token)
            if (decode) {
                req.currentUser = decode.currentUser
                req.username = decode.username
                console.log(decode);
                if (decode.currentUser && decode.username && req.currentUser && req.username) {
                    res.redirect('/')
                } else {
                    next()
                }
            }
        } else {
            req.flash('error', 'You must be logged in first to access this place')
            res.redirect('/user/login')
        }
    } catch {
        next()
    }
}