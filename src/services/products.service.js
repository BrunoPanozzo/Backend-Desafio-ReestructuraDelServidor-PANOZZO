class ProductsServices {

    constructor(storage) {
        this.storage = storage
    }

    async getProducts(filters) {
        return await this.storage.getProducts(filters)
    }

    async getProductById(prodId) {
        return await this.storage.getProductById(prodId)
    }
    
    async getProductByCode(prodCode) {
        return await this.storage.getProductByCode(prodCode)
    }

    async addProduct(title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category) {
        return await this.storage.addProduct(title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category)
    }

    async updateProduct(productUpdated, prodId) {
        return await this.storage.updateProduct(productUpdated, prodId)
    }

    async deleteProduct(prodId) {
        return await this.storage.deleteProduct(prodId)
    }

}

module.exports = ProductsServices

