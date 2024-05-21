const cartModel = require("../dao/models/cart.model")

class CartsStorage {

    constructor() {
    }

    inicializar = async () => {
        // chequear que la conexión existe y está funcionando
        if (cartModel.db.readyState !== 1) {
            throw new Error('Error al conectarse a la BD de mongodb!')
        }
    }

    async getCarts() {
        try {
            const carts = await cartModel.find()
            return carts.map(d => d.toObject({ virtuals: true }))
        }
        catch (err) {
            return []
        }
    }

    async getCartById(cartId) {
        const cart = await cartModel.findOne({ _id: cartId }).populate('products._id')
        if (cart) {
            return cart
        }
        else {
            // console.error(`El carrito con código "${cartId}" no existe.`)
            return null
        }
    }

    async addCart(products) {
        let nuevoCarrito = await cartModel.create({
            products
        })
        // console.log(nuevoCarrito)
    }

    async addProductToCart(cartId, prodId, quantity) {
        //obtengo el carrito
        const cart = await this.getCartById(cartId)
        //obtengo los productos del carrito        
        const productsFromCart = cart.products
        const productIndex = productsFromCart.findIndex(item => item._id._id.toString() === prodId)
        if (productIndex != -1) {
            //existe el producto en el carrito, actualizo sólo su cantidad
            productsFromCart[productIndex].quantity += quantity
        }
        else { //no existe, debo crearlo
            let newProduct = {
                _id: prodId,
                quantity: quantity
            }
            productsFromCart.push(newProduct);
        }
        await cartModel.updateOne({ _id: cartId }, cart)
        return true
    }

    async updateCartProducts(cartId, products) {
        //obtengo el carrito
        const cart = await this.getCartById(cartId)
        cart.products = products

        await cartModel.updateOne({ _id: cartId }, cart)
    }

    async deleteCart(cartId) {
        await cartModel.deleteOne({ _id: cartId })
    }

    async deleteAllProductsFromCart(cartId) {
        //obtengo el carrito
        const cart = await this.getCartById(cartId)
        cart.products = []
        await cartModel.updateOne({ _id: cartId }, cart)
    }

    async deleteProductFromCart(cartId, prodId) {
        //obtengo el carrito
        const cart = await this.getCartById(cartId)
        //obtengo los productos del carrito        
        const productsFromCart = cart.products
        const productIndex = productsFromCart.findIndex(item => item._id._id.toString() === prodId)
        if (productIndex != -1) {
            //existe el producto en el carrito, puedo eliminarlo
            productsFromCart.splice(productIndex, 1)
            await cartModel.updateOne({ _id: cartId }, cart)
            return true
        }
        else {
            //no existe el producto en el carito, imposible de eliminar
            return false
        }
    }
}

module.exports = CartsStorage