const productModel = require("../dao/models/product.model")

class ProductsStorage {

    constructor() {
    }

    inicializar = async () => {
        // chequear que la conexión existe y está funcionando
        if (productModel.db.readyState !== 1) {
            throw new Error('Error al conectarse a la BD de mongodb!')
        }
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

}

module.exports = ProductsStorage