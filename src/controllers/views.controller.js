class ViewsController {

    constructor(productsService, cartsService) {
        this.productsService = productsService
        this.cartsService = cartsService
    }

    async getProducts(req, res) {
        try {
            const filteredProducts = await this.productsService.getProducts(req.query)

            let user = req.session.user

            const data = {
                title: 'All Products',
                scripts: ['allProducts.js'],
                styles: ['home.css', 'allProducts.css'],
                useWS: false,
                user,
                filteredProducts
            }

            res.render('allProducts', data)
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }

    async getProductDetail(req, res) {
        try {
            const prodId = req.pid
            const product = await this.productsService.getProductById(prodId)

            const carts = await this.cartsService.getCarts()

            let cid = carts[0]._id
            let data = {
                title: 'Product detail',
                scripts: ['productDetail.js'],
                styles: ['home.css', 'productDetail.css'],
                useWS: false,
                useSweetAlert: true,
                product,
                cid
            }

            res.render('productDetail', data)
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }

    async addProductToCart(req, res) {
        try {
            const prodId = req.pid
            const product = await this.productsService.getProductById(prodId)

            //agrego una unidad del producto al primer carrito que siempre existe
            const carts = await this.cartsService.getCarts()
            // console.log(prodId)
            await this.cartsService.addProductToCart(carts[0]._id.toString(), prodId, 1);

            // res.redirect(`/products/detail/${prodId}`)
            // HTTP 200 OK => producto modificado exitosamente
            // res.status(200).json({message: 'Producto agregado con éxito'})
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }

    async getCartById(req, res) {
        try {
            const cartId = req.cid
            const cart = await this.cartsService.getCartById(cartId)

            let data = {
                title: 'Cart detail',
                // scripts: ['cartDetail.js'],
                styles: ['home.css', 'cartDetail.css'],
                useWS: false,
                cart
            }

            res.render('cartDetail', data)
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }

    async getRealTimeProducts(req, res) {
        try {
            let allProducts = await this.productsService.getProducts(req.query)

            const data = {
                title: 'Real Time Products',
                scripts: ['allProducts.js'],
                styles: ['home.css', 'allProducts.css'],
                useWS: false,
                allProducts
            }

            res.render('realtimeproducts', data)
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }

    createProduct(req, res) {
        try {
            const data = {
                title: 'Create Product',
                // scripts: ['createProduct.js'],
                styles: ['home.css'],
                useWS: false
            }

            res.render('createProduct', data)
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }

    chat(req, res) {
        try {
            const data = {
                title: 'Aplicación de chat',
                useWS: true,
                useSweetAlert: true,
                scripts: ['message.js'],
                styles: ['home.css']
            }

            res.render('message', data)
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }

    home(req, res) {
        try {
            const isLoggedIn = ![null, undefined].includes(req.session.user)

            res.render('index', {
                title: 'Inicio',
                isLoggedIn,
                isNotLoggedIn: !isLoggedIn,
            })
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }

    login(req, res) {
        try {
            // sólo se puede acceder si NO está logueado
            res.render('login', {
                title: 'Login'
            })
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }

    resetPassword(req, res) {
        try {
            // sólo se puede acceder si NO está logueado
            res.render('reset_password', {
                title: 'Reset Password'
            })
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }

    register(req, res) {
        try {
            //sólo se puede acceder si NO está logueado
            res.render('register', {
                title: 'Register'
            })
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }

    profile(req, res) {
        try {
            //sólo se puede acceder SI está logueado
            let user = req.session.user
            res.render('profile', {
                title: 'Mi perfil',
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    email: user.email
                }
            })
        }
        catch (err) {
            //return res.status(500).json({ message: err.message })
            return res.sendServerError(err)
        }
    }
    
}

module.exports = ViewsController