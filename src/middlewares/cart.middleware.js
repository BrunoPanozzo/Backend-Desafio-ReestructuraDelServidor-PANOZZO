const { esPositivo } = require('../middlewares/product.middleware')

module.exports = {
    validateNewCart: async (req, res, next) => {
        try {
            const productManager = req.app.get('productManager')
            const { products } = req.body

            //valido que cada producto que quiero agregar a un carrito exista y que su quantity sea un valor positivo
            products.forEach(async producto => {
                const prod = await productManager.getProductById(producto._id)
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
            const cartManager = req.app.get('cartManager')
            let cartId = req.params.cid;            

            const cart = await cartManager.getCartById(cartId)
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
