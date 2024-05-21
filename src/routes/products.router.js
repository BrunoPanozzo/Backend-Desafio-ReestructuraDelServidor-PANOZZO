const BaseRouter = require('./router')

const { validateNewProduct, validateUpdateProduct, validateProduct } = require('../middlewares/product.middleware')

const ProductsController = require('../controllers/products.controller')
const ProductsStorage = require('../persistence/products.storage')
const ProductsServices = require('../services/products.service')

const withController = callback => {
    return (req, res) => {
        const storage = new ProductsStorage()
        const service = new ProductsServices(storage)
        const controller = new ProductsController(service)
        return callback(controller, req, res)
    }
}

class ProductRouter extends BaseRouter {
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

        //endpoints

        this.get('/', withController((controller, req, res) => controller.getProducts(req, res)))

        this.get('/:pid', validateProduct, withController((controller, req, res) => controller.getProductById(req, res)))

        this.post('/create', validateNewProduct, withController((controller, req, res) => controller.addProduct(req, res)))

        this.put('/:pid', validateUpdateProduct, withController((controller, req, res) => controller.updateProduct(req, res)))

        this.delete('/:pid', validateProduct, withController((controller, req, res) => controller.deleteProduct(req, res)))

    }
}

module.exports = ProductRouter