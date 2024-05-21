const cartModel = require("../dao/models/cart.model")

class CartsServices {
    
    constructor(storage) {
        this.storage = storage
    }

    async getCarts() {
        return await this.storage.getCarts()        
    }

    async getCartById(cartId) {
        return await this.storage.getCartById(cartId)    
    }

    async addCart(products) {
        return await this.storage.addCart(products) 
    }

    async addProductToCart(cartId, prodId, quantity) {
        return await this.storage.addProductToCart(cartId, prodId, quantity)
    }

    async updateCartProducts(cartId, products) {
        return await this.storage.updateCartProducts(cartId, products)
    }

    async deleteCart(cartId) {
        return await this.storage.deleteCart(cartId)
    }

    async deleteAllProductsFromCart(cartId) {
        return await this.storage.deleteAllProductsFromCart(cartId)
    }

    async deleteProductFromCart(cartId, prodId) {
        return await this.storage.deleteProductFromCart(cartId, prodId)
    }

}

module.exports = CartsServices