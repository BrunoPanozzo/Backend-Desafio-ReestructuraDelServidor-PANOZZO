const ProductsStorage = require('../persistence/products.storage')
const ProductsServices = require('../services/products.service')

const productsStorage = new ProductsStorage()
const productsServices = new ProductsServices(productsStorage)

//validar un string permitiendo solo números y letras
const soloLetrasYNumeros = (cadena) => {
    return (/^[a-zA-Z0-9]+$/.test(cadena))
}

//validar permitiendo solo números positivos
const soloNumerosPositivos = (cadena) => {
    return ((/^[0-9]+$/.test(cadena)) && (+cadena > 0))
}

//validar permitiendo solo números positivos, más el cero
const soloNumerosPositivos_Y_Cero = (cadena) => {
    return ((/^[0-9]+$/.test(cadena)) && (+cadena >= 0))
}

//validar que un numero sea estrictamente positivo, incluido el 0
const esPositivo = (cadena) => {
    return soloNumerosPositivos_Y_Cero(cadena)
}

//validar los campos de un "objeto" producto
const validateProductData = (title, description, price, thumbnail, code, stock, status, category) => {
    //validar que el campo "title" no esté vacío        
    if (title.trim().length <= 0) {
        console.error("El campo \"title\" es inválido")
        return false
    }
    //validar que el campo "description" no esté vacío
    if (description.trim().length <= 0) {
        console.error("El campo \"description\" es inválido")
        return false
    }
    //validar que el campo "price" contenga sólo números
    if ((!soloNumerosPositivos(price)) || (typeof price != "number")) {
        console.error("El campo \"price\" no es un número positivo")
        return false
    }
    //el campo "thumbnail" puede estar vacío, por eso queda comentado la validacion anterior, solo
    //verificar que es un arreglo de strings
    // if (thumbnail.trim().length <= 0) {
    //     console.error("El campo \"thumbnail\" es inválido")
    //     return false
    // 
    if (!Array.isArray(thumbnail)) {
        return false
    }
    else {
        let pos = -1
        do {
            pos++
        } while ((pos < thumbnail.length) && (typeof thumbnail[pos] == "string"));
        if (pos != thumbnail.length)
            return false
    }
    //validar que el campo "status" sea booleano
    if (typeof status != "boolean") {
        console.error("El campo \"status\" no es booleano")
        return false
    }
    //validar que el campo "category"  no esté vacío
    if (category.trim().length <= 0) {
        console.error("El campo \"category\" es inválido")
        return false
    }
    //validar que el campo "code" contenga sólo números y letras
    const codeAValidar = code.trim()
    if ((codeAValidar.length <= 0) || (!soloLetrasYNumeros(codeAValidar))) {
        console.error("El campo \"code\" es inválido")
        return false
    }
    //validar que el campo "stock" contenga sólo números
    if ((!soloNumerosPositivos_Y_Cero(stock)) || (typeof stock != "number")) {
        console.error("El campo \"stock\" no es un número")
        return false
    }
    return true
}

const validateNewProduct = async (req, res, next) => {
    try {
        const product = req.body

        product.thumbnail = [product.thumbnail]
        product.status = JSON.parse(product.status)

        product.price = +product.price
        product.stock = +product.stock

        if (validateProductData(product.title,
            product.description,
            product.price,
            product.thumbnail,
            product.code,
            product.stock,
            product.status,
            product.category)) {
            //debo verificar también que el campo "code" no se repita
            const prod = await productsServices.getProductByCode(product.code)
            if (prod) {
                let msjeError = `No se permite agregar el producto con código '${product.code}' porque ya existe.`
                // HTTP 400 => code repetido
                res.status(400).json({ error: msjeError })
                return
            }
            //exito, continuo al endpoint
            return next()
        }
        // HTTP 400 => producto con valores inválidos
        res.status(400).json({ error: "El producto que se quiere agregar posee algún campo inválido." })
    }
    catch (err) {
        res.status(400).json({ error: "El producto que se quiere agregar posee algún campo inválido." })
    }
}

const validateUpdateProduct = async (req, res, next) => {
    try {
        const prodId = req.params.pid
        const product = req.body

        //primero debo verificar que el producto exista en mi array de todos los productos
        const prod = await productsServices.getProductById(prodId)
        if (!prod) {
            // HTTP 404 => no existe el producto
            res.status(404).json({ error: `El producto con ID '${prodId}' no se puede modificar porque no existe.` })
            return
        }

        if (validateProductData(product.title,
            product.description,
            product.price,
            product.thumbnail,
            product.code,
            product.stock,
            product.status,
            product.category)) {
            //verifico que el campo "code", que puede venir modificado, no sea igual al campo code de otros productos ya existentes
            let allProducts = await productsServices.getProducts(req.query)
            let producto = allProducts.docs.find(element => ((element.code === product.code) && (element._id != prodId)))
            if (producto) {
                let msjeError = `No se permite modificar el producto con código '${product.code}' porque ya existe.`
                // HTTP 400 => code repetido
                res.status(400).json({ error: msjeError })
                return
            }

            //exito, continuo al endpoint
            return next()
        }
        // HTTP 400 => producto con valores inválidos
        res.status(400).json({ error: "El producto que se quiere modificar posee algún campo inválido." })
    }
    catch (err) {
        res.status(400).json({ error: "El producto que se quiere modificar posee algún campo inválido." })
    }
}

const validateProduct = async (req, res, next) => {
    try {
        let prodId = req.params.pid;
        
        //primero debo verificar que el producto exista en mi array de todos los productos
        const prod = await productsServices.getProductById(prodId)
        if (!prod) {
            // HTTP 404 => no existe el producto
            res.status(404).json({ error: `El producto con ID '${prodId}' no existe.` })
            return
        }

        //exito, continuo al endpoint
        return next()
    }
    catch (err) {
        res.status(400).json({ error: `El producto con ID '${req.params.pid}' no existe.` })
    }
}

module.exports = { validateNewProduct, validateUpdateProduct, validateProduct, esPositivo }