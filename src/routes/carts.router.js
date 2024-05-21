const BaseRouter = require('./router')

const { validateNewCart, validateCart } = require('../middlewares/cart.middleware')
const { validateProduct } = require('../middlewares/product.middleware')

const  CartsController = require('../controllers/carts.controller')
const CartsStorage = require('../persistence/carts.storage')
const CartsServices = require('../services/carts.service')

const withController = callback => {
    return (req, res) => {
        const storage = new CartsStorage()
        const service = new CartsServices(storage)
        const controller = new CartsController(service)
        return callback(controller, req, res)
    }
}

class CartRouter extends BaseRouter {
    init() {

        //param validations

        this.router.param('pid', (req, res, next, value) => {
            const isValid = /^[a-z0-9]+$/.test(value)
            if (!isValid)
                // return res.status(400).send('Parámetro inválido')
                return res.sendUserError('Parámetro inválido')  
            req.pid = value
            next()
        })

        this.router.param('cid', (req, res, next, value) => {
            const isValid = /^[a-z0-9]+$/.test(value)
            if (!isValid)
                // return res.status(400).send('Parámetro inválido')
                return res.sendUserError('Parámetro inválido')
            req.cid = value
            next()
        })

        //endpoints

        this.get('/', withController((controller, req, res) => controller.getCarts(req, res)))

        this.get('/:cid', validateCart, withController((controller, req, res) => controller.getCartById(req, res)))

        this.post('/', validateNewCart, withController((controller, req, res) => controller.addCart(req, res)))

        this.post('/:cid/products/:pid', validateCart, validateProduct, withController((controller, req, res) => controller.addProductToCart(req, res)))
        
        this.put('/:cid', validateCart, withController((controller, req, res) => controller.updateCartProducts(req, res)))

        this.put('/:cid/products/:pid', validateCart, validateProduct, withController((controller, req, res) => controller.addProductToCart(req, res)))

        this.delete('/:cid', validateCart, withController((controller, req, res) => controller.deleteCart(req, res)))

        this.delete('/:cid/products/:pid', validateCart, validateProduct, withController((controller, req, res) => controller.deleteProductFromCart(req, res)))
    }
}

module.exports = CartRouter
