const { Router } = require('express')

class BaseRouter {
    constructor() {
        this.router = Router()
        this.init()
    }

    getRouter() {
        return this.router
    }

    init() {
        // va implementado en las clases hijas
    }

    get(path, ...callbacks) {
        // llamamos al router de express con el path, pero customizamos los callbacks
        this.router.get(path, this.generatecustomResponse, this.customizeCallbacks(callbacks))
    }

    post(path, ...callbacks) {
        // llamamos al router de express con el path, pero customizamos los callbacks
        this.router.post(path, this.generatecustomResponse, this.customizeCallbacks(callbacks))
    }
    
    put(path, ...callbacks) {
        // llamamos al router de express con el path, pero customizamos los callbacks
        this.router.put(path, this.generatecustomResponse, this.customizeCallbacks(callbacks))
    }

    delete(path, ...callbacks) {
        // llamamos al router de express con el path, pero customizamos los callbacks
        this.router.delete(path, this.generatecustomResponse, this.customizeCallbacks(callbacks))
    }

    customizeCallbacks(callbacks) {
        // para cada callback, se genera un middleware dentro de un try/catch
        //paramas contiene los parametros de cada middleware de la forma (req, res, next)
        return callbacks.map(callback => async (...params) => {
            try {
                //llamo a cada middleware
                // en el 1er argumento viene una referenca, si en el callback se llegase a utilizar "this", o sea esta clase
                // en el 2do argumento, viene un array de parámetros que usa el callback
                await callback.apply(this, params)
            } catch (err) {
                // nuestra función flecha es un middleware también, entonces sabemos que params será [req, res, next]
                const [, res,] = params
                //res.status(500).send(err)
                res.sendServerError(err)
            }
        })
    }

    generatecustomResponse (req, res, next) {
        res.sendSuccess = payload => res.send({status: 'success', payload})
        res.sendCreated= payload => res.status(201).send({status: 'success', payload})

        res.sendUserError = error => res.status(400).send({status: 'error', error})
        res.sendUnauthorizedError = error => res.status(401).send({status: 'error', error})
        res.sendNotFoundError = error => res.status(404).send({status: 'error', error})

        res.sendServerError= error => res.status(500).send({status: 'error', error})

        next()
    }
}

module.exports = BaseRouter