class ProductsController {

    constructor(productsService) {
        this.service = productsService
    }

    async getProducts(req, res) {
        try {
            const filteredProducts = await this.service.getProducts(req.query)

            const result = {
                payload: filteredProducts.totalDocs,
                totalPages: filteredProducts.totalPages,
                prevPage: filteredProducts.prevPage,
                nextPage: filteredProducts.nextPage,
                page: filteredProducts.page,
                hasPrevPage: filteredProducts.hasPrevPage,
                hasNextPage: filteredProducts.hasNextPage,
                prevLink: filteredProducts.hasPrevPage ? `/products?page=${filteredProducts.prevPage}` : null,
                nextlink: filteredProducts.hasNextPage ? `/products?page=${filteredProducts.nextPage}` : null
            }

            let status = 'success'
            if (filteredProducts.docs.length == 0)
                status = 'error'
            let finalResult = {
                status,
                ...result
            }

            // HTTP 200 OK
            // return res.status(200).json(finalResult)
            return res.sendSuccess(finalResult)
        }
        catch (err) {
            //return res.status(500).json({ error: err })
            return res.sendServerError(err)
        }
    }

    async getProductById(req, res) {
        try {
            const prodId = req.pid

            const product = await this.service.getProductById(prodId)

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
    }

    async addProduct(req, res) {
        try {
            const newProduct = req.body

            // newProduct.thumbnail = [newProduct.thumbnail]
            newProduct.status = JSON.parse(newProduct.status)

            //agregar el producto al productManager
            await this.service.addProduct(newProduct.title,
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
    }

    async updateProduct(req, res) {
        try {
            const prodId = req.pid
            const productUpdated = req.body
            
            const productActual = await this.service.getProductById(prodId)
            if (productActual) {
                await this.service.updateProduct(productUpdated, prodId)

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
    }

    async deleteProduct(req, res) {
        try {
            const prodId = req.pid

            const product = await this.service.getProductById(prodId)
            if (product) {
                await this.service.deleteProduct(prodId)

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
    }
}

module.exports = ProductsController