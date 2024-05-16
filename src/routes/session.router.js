const BaseRouter = require('./router')

const userModel = require('../dao/models/user.model')
// const { hashPassword, isValidPassword } = require('../utils/hashing')
const passport = require('passport')
const passportMiddleware = require('../middlewares/passport.middleware')

class SessionRouter extends BaseRouter {
    init() {

        this.post('/login', passportMiddleware('login'), /*passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' },*/(req, res) => {
            if (!req.user)
                //return res.status(400).send({ status: 'error', error: 'Credenciales inválidas!' })
                return res.sendUserError('Credenciales inválidas!')
            req.session.user = {
                _id: req.user._id,
                age: req.user.age,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                rol: req.user.rol
            }

            // no es necesario validar el login aquí, ya lo hace passport!
            return res.redirect('/products')
        })

        this.get('/faillogin', (req, res) => {
            res.send({ status: 'error', message: 'Login erróneo!' })
        })

        this.post('/reset_password', passport.authenticate('reset_password', { failureRedirect: '/api/sessions/failreset_password' }), async (req, res) => {
            // console.log(req.user)
            res.redirect('/login')
        })

        this.get('/failreset_password', (req, res) => {
            res.send({ status: 'error', message: 'No se pudo resetear la password!' })
        })

        // agregamos el middleware de passport para el register
        this.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }), async (req, res) => {
            // console.log('usuario: ', req.user)
            // no es necesario registrar el usuario aquí, ya lo hacemos en la estrategia!
            res.redirect('/login')
        })

        this.get('/failregister', (req, res) => {
            res.send({ status: 'error', message: 'Registración errónea.!' })
        })

        this.get('/github', passport.authenticate('github', { scope: ['user:email'] }), () => { })

        this.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
            // req.session.user = { _id: req.user._id }
            req.session.user = {
                _id: req.user._id,
                age: req.user.age,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                rol: req.user.rol,
                cart: req.user.cart
            }

            // no es necesario validar el login aquí, ya lo hace passport!
            return res.redirect('/products')
        })

        this.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }), () => { })

        this.get('/googlecallback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
            // req.session.user = { _id: req.user._id }
            // console.log(req.user)
            req.session.user = {
                _id: req.user._id,
                age: req.user.age,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                rol: req.user.rol
            }

            // no es necesario validar el login aquí, ya lo hace passport!
            return res.redirect('/products')
        })

        this.get('/logout', (req, res) => {
            req.session.destroy(_ => {
                res.redirect('/')
            })
        })

        this.get('/current', (req, res) => {
            if (!req.user)
                //return res.status(400).send({ status: 'error', error: 'No existe un usuario logeado!' })
                return res.sendUserError('No existe un usuario logeado!')
            req.session.user = {
                _id: req.user._id,
                age: req.user.age,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                rol: req.user.rol
            }

            // no es necesario validar el login aquí, ya lo hace passport!
            return res.redirect('/profile')
        })
    }
}

module.exports = SessionRouter