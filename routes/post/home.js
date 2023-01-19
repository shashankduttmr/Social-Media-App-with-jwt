const express = require('express')
const Router = express.Router()
const middleware = require('../../middlewares/isloggedin')
const controllers = require('../../controllers/posts/index')

Router.get('/new', middleware.isLoggedin, controllers.new)

module.exports = Router