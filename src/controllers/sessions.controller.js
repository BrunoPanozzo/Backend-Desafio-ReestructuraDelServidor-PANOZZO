class SessionsController {

    constructor() {
    }

    login (req, res) {
        if (!req.user)
            //return res.status(400).send({ status: 'error', error: 'Credenciales inválidas!' })
            return res.sendUserError('Credenciales inválidas!')
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
    }

    failLogin(req, res) {
        //res.send({ status: 'error', message: 'Login erróneo!' })
        res.sendUnauthorizedError('Login erróneo!')
    }

    resetPassword(req, res) {
        // console.log(req.user)
        res.redirect('/login')
    }

    failResetPassword(req, res) {
        //res.send({ status: 'error', message: 'No se pudo resetear la password!' })
        res.sendServerError('No se pudo resetear la password!')
    }

    register(req, res) {
        // console.log('usuario: ', req.user)
        // no es necesario registrar el usuario aquí, ya lo hacemos en la estrategia!
        res.redirect('/login')
    }

    failRegister(req, res) {
       //res.send({ status: 'error', message: 'Registración errónea.!' })
       res.sendServerError('Registración errónea.!')
    }

    githubCallback(req, res) {
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
    }

    googleCallback(req, res) {
        // req.session.user = { _id: req.user._id }
            // console.log(req.user)
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
    }

    logout(req, res) {
        req.session.destroy(_ => {
            res.redirect('/')
        })
    }

    current(req, res) {
        if (!req.user)
            //return res.status(400).send({ status: 'error', error: 'No existe un usuario logeado!' })
            return res.sendUserError('No existe un usuario logeado!')
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
        return res.redirect('/profile')
    }

}

module.exports = SessionsController