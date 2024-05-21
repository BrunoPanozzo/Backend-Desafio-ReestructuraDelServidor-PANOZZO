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
}

module.exports = ProductsController