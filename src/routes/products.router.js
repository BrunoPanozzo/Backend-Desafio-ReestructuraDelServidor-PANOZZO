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

        this.get('/:pid', validateProduct, async (req, res) => {
            try {
                const productManager = req.app.get('productManager')
                const prodId = req.pid

                const product = await productManager.getProductById(prodId)

                if (product)
                    // HTTP 200 OK => se encontró el producto
                    // res.status(200).json(product)
                    res.sendSuccess(product)
                else
                    // HTTP 404 => el ID es válido, pero no se encontró ese producto
                    //res.status(404).json(`El producto con código '${prodId}' no existe.`)
                    res.sendNotFoundError(`El producto con código '${prodId}' no existe.`)
            }
            catch (err) {
                //return res.status(500).json({ message: err.message })
                return res.sendServerError(err)
            }
        })

        this.post('/create', validateNewProduct, async (req, res) => {
            try {
                const productManager = req.app.get('productManager')

                const newProduct = req.body

                // newProduct.thumbnail = [newProduct.thumbnail]
                newProduct.status = JSON.parse(newProduct.status)

                //agregar el producto al productManager
                await productManager.addProduct(newProduct.title,
                    newProduct.description,
                    newProduct.price,
                    newProduct.thumbnail,
                    newProduct.code,
                    newProduct.stock,
                    newProduct.status,
                    newProduct.category)

                // //notificar a los demás browsers mediante WS
                // req.app.get('io').emit('newProduct', newProduct)

                // HTTP 201 OK => producto creado exitosamente
                // res.status(201).json(`El producto con código '${newProduct.code}' se agregó exitosamente.`)
                res.sendCreated(`El producto con código '${newProduct.code}' se agregó exitosamente.`)
                // res.redirect('/allProducts')
            }
            catch (err) {
                //return res.status(500).json({ message: err.message })
                return res.sendServerError(err)
            }            
        })

        this.put('/:pid', validateUpdateProduct, async (req, res) => {
            try {
                const productManager = req.app.get('productManager')
                const prodId = req.pid
                const productUpdated = req.body
                
                const productActual = await productManager.getProductById(prodId)
                if (productActual) {
                    await productManager.updateProduct(productUpdated, prodId)

                    // HTTP 200 OK => producto modificado exitosamente
                    // res.status(200).json(productUpdated)
                    res.sendSuccess(productUpdated)
                }
                else
                    // HTTP 404 => el ID es válido, pero no se encontró ese producto
                    //res.status(404).json(`El producto con código '${prodId}' no existe.`)
                    res.sendNotFoundError(`El producto con código '${prodId}' no existe.`)
            }
            catch (err) {
                //return res.status(500).json({ message: err.message })
                return res.sendServerError(err)
            }
        })

        this.delete('/:pid', validateProduct, async (req, res) => {
            try {
                const productManager = req.app.get('productManager')
                const prodId = req.pid

                const product = await productManager.getProductById(prodId)
                if (product) {
                    await productManager.deleteProduct(prodId)

                    // HTTP 200 OK => producto eliminado exitosamente
                    // return res.status(200).json(`El producto con código '${prodId}' se eliminó exitosamente.`)
                    return res.sendSuccess(`El producto con código '${prodId}' se eliminó exitosamente.`)
                }
                else {
                    // HTTP 404 => el ID es válido, pero no se encontró ese producto
                    //return res.status(404).json(`El producto con código '${prodId}' no existe.`)
                    return res.sendNotFoundError(`El producto con código '${prodId}' no existe.`)
                }
            }
            catch (err) {
                //return res.status(500).json({ message: err.message })
                return res.sendServerError(err)
            }
        })
    }
}

module.exports = ProductRouter