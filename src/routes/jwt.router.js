const BaseRouter = require('./router')

// const userModel = require('../dao/models/user.model')
// const { isValidPassword } = require('../utils/hashing')
const { verifyToken } = require('../utils/jwt')
// const passport = require('passport')
const passportMiddleware = require('../middlewares/passport.middleware')
// const config = require('../config/config')
const JwtController = require('../controllers/jwt.controller')
const JwtServices = require('../services/jwt.service')
const JwtStorage = require('../persistence/jwt.storage')

const withController = callback => {
    return (req, res) => {        
        const jwtStorage = new JwtStorage()
        const jwtService = new JwtServices(jwtStorage)
        const controller = new JwtController(jwtService)
        return callback(controller, req, res)
    }
}

class JwtRouter extends BaseRouter {
    init() {

        this.post('/login', withController((controller, req, res) => controller.login(req, res)))

        this.get('/private', verifyToken, withController((controller, req, res) => controller.private(req, res)))

        this.get('/current', passportMiddleware('jwt') /*passport.authenticate('jwt', {session: false})*/, withController((controller, req, res) => controller.current(req, res)))

    }
}
    
module.exports = JwtRouter