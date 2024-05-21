const BaseRouter = require('./router')

const passport = require('passport')
const passportMiddleware = require('../middlewares/passport.middleware')
const SessionsController = require('../controllers/sessions.controller')

const withController = callback => {
    return (req, res) => {
        const controller = new SessionsController()
        return callback(controller, req, res)
    }
}

class SessionRouter extends BaseRouter {
    init() {

        this.post('/login', passportMiddleware('login'), withController((controller, req, res) => controller.login(req, res)))

        this.get('/faillogin', withController((controller, req, res) => controller.faillogin(req, res)))

        this.post('/reset_password', passport.authenticate('reset_password', { failureRedirect: '/api/sessions/failreset_password' }), withController((controller, req, res) => controller.resetPassword(req, res)))

        this.get('/failreset_password', withController((controller, req, res) => controller.failResetPassword(req, res)))

        // agregamos el middleware de passport para el register
        this.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }), withController((controller, req, res) => controller.register(req, res)))

        this.get('/failregister', withController((controller, req, res) => controller.failRegister(req, res)))

        this.get('/github', passport.authenticate('github', { scope: ['user:email'] }), () => { })

        this.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), withController((controller, req, res) => controller.githubCallback(req, res)))

        this.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }), () => { })

        this.get('/googlecallback', passport.authenticate('google', { failureRedirect: '/login' }), withController((controller, req, res) => controller.googleCallback(req, res)))

        this.get('/logout', withController((controller, req, res) => controller.logout(req, res)))

        this.get('/current', withController((controller, req, res) => controller.current(req, res)))

    }
}

module.exports = SessionRouter