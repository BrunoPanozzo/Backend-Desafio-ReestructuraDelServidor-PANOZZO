const BaseRouter = require('./router')

const { userIsLoggedIn, userIsNotLoggedIn, userIsAdmin } = require('../middlewares/auth.middleware')

const ProductsStorage = require('../persistence/products.storage')
const ProductsServices = require('../services/products.service')
const CartsStorage = require('../persistence/carts.storage')
const CartsServices = require('../services/carts.service')
const ViewsController = require('../controllers/views.controller')

const withController = callback => {
    return (req, res) => {
        const productsStorage = new ProductsStorage()
        const productsService = new ProductsServices(productsStorage)
        const cartsStorage = new CartsStorage()
        const cartsService = new CartsServices(cartsStorage)
        const controller = new ViewsController(productsService, cartsService)
        return callback(controller, req, res)
    }
}

class ViewRouter extends BaseRouter {
    init() {

        //endpoints de Products y Carts
        
        this.get('/products', userIsLoggedIn, withController((controller, req, res) => controller.getProducts(req, res)))

        this.get('/products/detail/:pid', userIsLoggedIn, withController((controller, req, res) => controller.getProductDetail(req, res)))

        this.get('/products/addcart/:pid', userIsLoggedIn, withController((controller, req, res) => controller.addProductToCart(req, res)))

        this.get('/carts/:cid', userIsLoggedIn, withController((controller, req, res) => controller.getCartById(req, res)))

        this.get('/realtimeproducts', userIsLoggedIn, userIsAdmin, withController((controller, req, res) => controller.getRealTimeProducts(req, res)))

        this.get('/products/create', userIsLoggedIn, userIsAdmin, withController((controller, req, res) => controller.createProduct(req, res)))

        //endpoints de Messages

        this.get('/chat', withController((controller, req, res) => controller.chat(req, res)))

        //endpoints de Login/Register

        this.get('/', withController((controller, req, res) => controller.home(req, res)))

        this.get('/login', userIsNotLoggedIn, withController((controller, req, res) => controller.login(req, res)))
        
        this.get('/reset_password', userIsNotLoggedIn, withController((controller, req, res) => controller.resetPassword(req, res)))

        this.get('/register', userIsNotLoggedIn, withController((controller, req, res) => controller.register(req, res)))

        this.get('/profile', userIsLoggedIn, withController((controller, req, res) => controller.profile(req, res)))

    }
}

module.exports = ViewRouter;