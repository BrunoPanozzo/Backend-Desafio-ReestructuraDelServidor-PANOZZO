const BaseRouter = require('./router')

// const CartManager = require('../dao/fsManagers/CartManager');
// const ProductManager = require('../dao/fsManagers/ProductManager')
const { validateNewCart, validateCart } = require('../middlewares/cart.middleware')
const { validateProduct } = require('../middlewares/product.middleware')

class CartRouter extends BaseRouter {
    init() {

        //param validations

        this.param('pid', (req, res, next, value) => {
            const isValid = /^[a-z0-9]+$/.test(value)
            if (!isValid)
                // return res.status(400).send('Parámetro inválido')
                return res.sendUserError('Parámetro inválido')  
            req.pid = value
            next()
        })

        this.param('cid', (req, res, next, value) => {
            const isValid = /^[a-z0-9]+$/.test(value)
            if (!isValid)
                // return res.status(400).send('Parámetro inválido')
                return res.sendUserError('Parámetro inválido')
            req.cid = value
            next()
        })

        //endpoints

        this.get('/', ['PUBLIC'], async (req, res) => {
            try {
                const cartManager = req.app.get('cartManager')
                const carts = await cartManager.getCarts()
                // HTTP 200 OK
                // res.status(200).json(carts)
                res.sendSuccess(carts)
                return
            }
            catch (err) {
                // return res.status(500).json({ message: err.message })
                return res.sendServerError(err)
            }
        })

        this.get('/:cid', validateCart, async (req, res) => {
            try {
                const cartManager = req.app.get('cartManager')
                let cartId = req.cid;

                let cartById = await cartManager.getCartById(cartId);

                if (cartById)
                    // HTTP 200 OK => se encontró el carrito
                    // res.status(200).json(cartById)
                    res.sendSuccess(cartById)
                else {
                    // HTTP 404 => el ID es válido, pero no se encontró ese carrito
                    // return res.status(404).json(`El carrito con código '${cartId}' no existe.`)
                    return res.sendNotFoundError(`El carrito con código '${cartId}' no existe.`)
                }
            }
            catch (err) {
                //return res.status(500).json({ message: err.message })
                return res.sendServerError(err)
            }
        })

        this.post('/', validateNewCart, async (req, res) => {
            try {
                const cartManager = req.app.get('cartManager')
                const { products } = req.body;

                // console.log(products)

                await cartManager.addCart(products);

                // HTTP 201 OK => carrito creado exitosamente
                // res.status(201).json(`Carrito creado exitosamente.`)
                res.sendCreated(`Carrito creado exitosamente.`)
            }
            catch (err) {
                //return res.status(500).json({ message: err.message })
                return res.sendServerError(err)
            }
        })

        this.post('/:cid/products/:pid', validateCart, validateProduct, async (req, res) => {
            try {
                const cartManager = req.app.get('cartManager')
                let cartId = req.cid;
                let prodId = req.pid;
                let quantity = 1;

                await cartManager.addProductToCart(cartId, prodId, quantity);

                // HTTP 200 OK => carrito modificado exitosamente
                // res.status(200).json(`Se agregaron ${quantity} producto/s con ID ${prodId} al carrito con ID ${cartId}.`)
                res.sendSuccess(`Se agregaron ${quantity} producto/s con ID ${prodId} al carrito con ID ${cartId}.`)
            }
            catch (err) {
                //return res.status(500).json({ message: err.message })
                return res.sendServerError(err)
            }
        })

        this.put('/:cid', validateCart, async (req, res) => {
            try {
                const cartManager = req.app.get('cartManager')
                let cartId = req.cid;
                const { products } = req.body;

                await cartManager.updateCartProducts(cartId, products);

                // HTTP 200 OK => se encontró el carrito
                // res.status(200).json(`Los productos del carrito con ID ${cartId} se actualizaron exitosamente.`)
                res.sendSuccess(`Los productos del carrito con ID ${cartId} se actualizaron exitosamente.`)
            }
            catch (err) {
                //return res.status(500).json({ message: err.message })
                return res.sendServerError(err)
            }
        })

        this.put('/:cid/products/:pid', validateCart, validateProduct, async (req, res) => {
            try {
                const cartManager = req.app.get('cartManager')
                let cartId = req.cid;
                let prodId = req.pid;
                const quantity = +req.body.quantity;

                const result = await cartManager.addProductToCart(cartId, prodId, quantity);

                if (result)
                    // HTTP 200 OK => carrito modificado exitosamente
                    //res.status(200).json(`Se agregaron ${quantity} producto/s con ID ${prodId} al carrito con ID ${cartId}.`)
                    res.sendSuccess(`Se agregaron ${quantity} producto/s con ID ${prodId} al carrito con ID ${cartId}.`)
                else {
                    //HTTP 400 Bad Request
                    // res.status(400).json({ error: "El servidor no pudo entender la solicitud debido a una sintaxis incorrecta." })
                    res.sendUserError("El servidor no pudo entender la solicitud debido a una sintaxis incorrecta.")
                }


            }
            catch (err) {
                //return res.status(500).json({ message: err.message })
                return res.sendServerError(err)
            }
        })

        this.delete('/:cid', validateCart, async (req, res) => {
            try {
                const cartManager = req.app.get('cartManager')
                let cartId = req.cid;

                await cartManager.deleteCart(cartId)
                // HTTP 200 OK
                // res.status(200).json(`Carrito borrado exitosamente.`)
                res.sendSuccess(`Carrito borrado exitosamente.`)
                
                // await cartManager.deleteAllProductsFromCart(cartId)
                // res.sendSuccess(`Se eliminaron todos los productos del carrito con ID ${cartId}.`)                
            }
            catch (err) {
                //return res.status(500).json({ message: err.message })
                return res.sendServerError(err)
            }
        })

        this.delete('/:cid/products/:pid', validateCart, validateProduct, async (req, res) => {
            try {
                const cartManager = req.app.get('cartManager')
                let cartId = req.cid;
                let prodId = req.pid;

                const result = await cartManager.deleteProductFromCart(cartId, prodId);

                if (result)
                    // HTTP 200 OK => carrito modificado exitosamente
                    // res.status(200).json(`Se eliminó el producto con ID ${prodId} del carrito con ID ${cartId}.`)
                    res.sendSuccess(`Se eliminó el producto con ID ${prodId} del carrito con ID ${cartId}.`)
                else {
                    //HTTP 400 Bad Request
                    // res.status(400).json({ error: "El servidor no pudo entender la solicitud debido a una sintaxis incorrecta." })
                    res.sendUserError("El servidor no pudo entender la solicitud debido a una sintaxis incorrecta.")
                }
            }
            catch (err) {
                //return res.status(500).json({ message: err.message })
                return res.sendServerError(err)
            }
        })
    }
}

module.exports = CartRouter
