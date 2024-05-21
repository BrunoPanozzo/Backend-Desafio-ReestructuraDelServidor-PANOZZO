const userModel = require("../dao/models/user.model")

class JwtStorage {

    constructor() {
    }

    async login(email)        {  
        const user = await userModel.findOne({ email })
        return user
    }

}

module.exports = JwtStorage

