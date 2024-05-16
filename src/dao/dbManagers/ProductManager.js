const productModel = require('../models/product.model')

class ProductManager {

    //variables internas
    static #lastID_Product = 0

    constructor() { }

    inicializar = async () => {
        // No hacer nada
        // Podríamos chequear que la conexión existe y está funcionando
        if (productModel.db.readyState !== 1) {
            throw new Error('Error al conectarse a la BD de mongodb!')
        }
        else {
            const products = await this.getProducts({})            
            ProductManager.#lastID_Product = this.#getHigherID(products.docs)
        }
    }

    //métodos internos
    #getHigherID = (products) => {
        let higherID = 0
        products.forEach(item => {
            if (item.id > higherID)
                higherID = item.id
        });
        return higherID
    }

    //retornar un ID único para cada producto nuevo
    #getNuevoID = () => {
        ProductManager.#lastID_Product += 1
        return ProductManager.#lastID_Product;
    }

    getProducts = async (filters) => {
        try {
            let filteredProducts = await productModel.find()

            //busqueda general, sin filtros, devuelvo todos los productos en una sola página
            if (JSON.stringify(filters) === '{}') {
                filteredProducts = await productModel.paginate({}, { limit: filteredProducts.length})
                // return filteredProducts.docs.map(d => d.toObject({ virtuals: true }))                
                return filteredProducts
            }

            //busqueda general, sin filtros, solo esta avanzando o retrocediendo por las paginas
            let { page, ...restOfFilters } = filters
            if (page && JSON.stringify(restOfFilters) === '{}') {
                filteredProducts = await productModel.paginate({}, { page: page, lean: true })
                // return filteredProducts.docs.map(d => d.toObject({ virtuals: true }))
                return filteredProducts
            } 

            if (!page) page = 1
            let { limit, category, availability, sort } = { limit: 10, page: page, availability: 1, sort: 'asc', ...filters }
           
            // console.log(limit)
            // console.log(page)
            // console.log(category)
            // console.log(availability)
            // console.log(sort)

            if (availability == 1) {
                if (category)
                    filteredProducts = await productModel.paginate({ category: category, stock: { $gt: 0 }}, { limit: limit, page: page, sort: { price: sort }, lean: true })
                else
                filteredProducts = await productModel.paginate({ stock: { $gt: 0 }}, { limit: limit, page: page, sort: { price: sort }, lean: true })
            }
            else {
                if (category)
                    filteredProducts = await productModel.paginate({ category: category, stock: 0 }, { limit: limit, page: page, sort: { price: sort }, lean: true })
                else
                filteredProducts = await productModel.paginate({ stock: 0 }, { limit: limit, page: page, sort: { price: sort }, lean: true })
            }

            return filteredProducts
            // return filteredProducts.map(d => d.toObject({ virtuals: true }))
        }
        catch (err) {
            console.log({ error: err })
            return []
        }
    }

    getProductById = async (prodId) => {
        const producto = await productModel.findOne({ _id: prodId })
        if (producto)
            return producto
        else {
            console.error(`El producto con id "${prodId}" no existe.`)
            return
        }
    }

    //buscar en el arreglo de productos un producto con un CODE determinado. Caso contrario devolver msje de error
    getProductByCode = async (prodCode) => {
        const producto = await productModel.findOne({ code: prodCode })
        if (producto)
            return producto
        else {
            console.error(`El producto con código "${prodCode}" no existe.`)
            return
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock, status, category) => {
        let product = await productModel.create({
            id: this.#getNuevoID(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category
        })
    }

    updateProduct = async (prodId, producto) => {
        await productModel.updateOne({ _id: prodId }, producto)
    }

    deleteProduct = async (idProd) => {
        await productModel.deleteOne({ _id: idProd })
    }
}

module.exports = ProductManager

