class ProductsServices {
    
    constructor(storage) {
        this.storage = storage
    }

    async getProducts(filters) {
        return await this.storage.getProducts(filters)        
    }
}

module.exports = ProductsServices

