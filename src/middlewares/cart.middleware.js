const { esPositivo } = require('../middlewares/product.middleware')

const CartsStorage = require('../persistence/carts.storage')
const CartsServices = require('../services/carts.service')
const ProductsStorage = require('../persistence/products.storage')
const ProductsServices = require('../services/products.service')

const cartsStorage = new CartsStorage()
const cartsServices = new CartsServices(cartsStorage)
const productsStorage = new ProductsStorage()
const productsServices = new ProductsServices(productsStorage)

module.exports = {
    validateNewCart: async (req, res, next) => {
        try {
            const { products } = req.body

            //valido que cada producto que quiero agregar a un carrito exista y que su quantity sea un valor positivo
            products.forEach(async producto => {
                const prod = await productsServices.getProductById(producto._id)
                if (!prod) {
                    res.status(400).json({ error: `No se puede crear el carrito porque no existe el producto con ID '${producto._id}'.` })
                    return
                }
                //valido además que su campo quantity sea un valor positivo
                if (!esPositivo(producto.quantity)) {
                    res.status(400).json({ error: `El valor de quantity del producto con ID '${producto._id}' es inválido.` })
                    return
                }
            })
            //exito, continuo al endpoint
            return next()
        }
        catch (err) {
            res.status(400).json({ error: `No se puede crear el carrito.` })
        }
    },
    validateCart: async (req, res, next) => {
        try {
            let cartId = req.params.cid;            

            const cart = await cartsServices.getCartById(cartId)
            if (!cart) {
                res.status(400).json({ error: `No existe el carrito con ID '${cartId}'.` })
                return
            }
            //exito, continuo al endpoint
            return next()
        }
        catch (err) {
            res.status(400).json({ error: `No existe el carrito con ID '${req.params.cid}'.` })
        }
    }
}
