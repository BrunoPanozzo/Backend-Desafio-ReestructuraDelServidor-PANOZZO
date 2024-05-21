class CartsController {

    constructor(cartsService) {
        this.service = cartsService
    }

    async getCarts(req, res) {
        try {
            const carts = await this.service.getCarts()
            // HTTP 200 OK
            // res.status(200).json(carts)
            res.sendSuccess(carts)
            return
        }
        catch (err) {
            // return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }

    async getCartById(req, res) {
        try {
            let cartId = req.cid;

            let cartById = await this.service.getCartById(cartId)

            if (cartById)
                // HTTP 200 OK => se encontró el carrito
                // res.status(200).json(cartById)
                res.sendSuccess(cartById)
            else {
                // HTTP 404 => el ID es válido, pero no se encontró ese carrito
                // return res.status(404).json(`El carrito con código '${cartId}' no existe.`)
                return res.sendNotFoundError(`El carrito con código '${cartId}' no existe.`)
            }
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }

    async addCart(req, res) {
        try {
            const { products } = req.body

            await this.service.addCart(products)

            // HTTP 201 OK => carrito creado exitosamente
            // res.status(201).json(`Carrito creado exitosamente.`)
            res.sendCreated(`Carrito creado exitosamente.`)
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }

    async addProductToCart(req, res) {
        try {
            let cartId = req.cid
            let prodId = req.pid
            let quantity = +req.body.quantity

            const result = await this.service.addProductToCart(cartId, prodId, quantity)

            if (result)
                // HTTP 200 OK => carrito modificado exitosamente
                // res.status(200).json(`Se agregaron ${quantity} producto/s con ID ${prodId} al carrito con ID ${cartId}.`)
                res.sendSuccess(`Se agregaron ${quantity} producto/s con ID ${prodId} al carrito con ID ${cartId}.`)
            else
                //HTTP 400 Bad Request
                // res.status(400).json({ error: "El servidor no pudo entender la solicitud debido a una sintaxis incorrecta." })
                res.sendUserError("El servidor no pudo entender la solicitud debido a una sintaxis incorrecta.")
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }

    async updateCartProducts(req, res) {
        try {
            let cartId = req.cid
            const { products } = req.body

            await this.service.updateCartProducts(cartId, products)

            // HTTP 200 OK => se encontró el carrito
            // res.status(200).json(`Los productos del carrito con ID ${cartId} se actualizaron exitosamente.`)
            res.sendSuccess(`Los productos del carrito con ID ${cartId} se actualizaron exitosamente.`)
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }

    async deleteCart(req, res) {
        try {
            let cartId = req.cid

            await this.service.deleteCart(cartId)
            // HTTP 200 OK
            // res.status(200).json(`Carrito borrado exitosamente.`)
            res.sendSuccess(`Carrito borrado exitosamente.`)
            
            // await this.service.deleteAllProductsFromCart(cartId)
            // res.sendSuccess(`Se eliminaron todos los productos del carrito con ID ${cartId}.`)                
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }
    
    async deleteProductFromCart(req, res) {
        try {
            let cartId = req.cid
            let prodId = req.pid

            const result = await this.service.deleteProductFromCart(cartId, prodId)

            if (result)
                // HTTP 200 OK => carrito modificado exitosamente
                // res.status(200).json(`Se eliminó el producto con ID ${prodId} del carrito con ID ${cartId}.`)
                res.sendSuccess(`Se eliminó el producto con ID ${prodId} del carrito con ID ${cartId}.`)
            else {
                //HTTP 400 Bad Request
                // res.status(400).json({ error: "El servidor no pudo entender la solicitud debido a una sintaxis incorrecta." })
                res.sendUserError("El servidor no pudo entender la solicitud debido a una sintaxis incorrecta.")
            }
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }

}

module.exports = CartsController