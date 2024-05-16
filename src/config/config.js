const dotenv = require('dotenv')

dotenv.config()

module.exports = {
    MONGO_URL:process.env.MONGO_URL,
    ENV:process.env.ENV,
    SECRET:process.env.SECRET,
    PORT:process.env.PORT,
    DBNAME:process.env.DBNAME,
    APP_ID:process.env.APP_ID,
    CLIENT_ID:process.env.CLIENT_ID,
    CLIENT_SECRET:process.env.CLIENT_SECRET,
    CALLBACK_URL:process.env.CALLBACK_URL,
    CLIENT_ID_GOOGLE:process.env.CLIENT_ID_GOOGLE,
    CLIENT_SECRET_GOOGLE:process.env.CLIENT_SECRET_GOOGLE,
    CALLBACK_URL_GOOGLE:process.env.CALLBACK_URL_GOOGLE,
    ADMIN_USER:process.env.ADMIN_USER,
    ADMIN_USER_PASS:process.env.ADMIN_USER_PASS
}