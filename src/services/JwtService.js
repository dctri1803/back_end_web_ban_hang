const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const genneralAccessToken = async (payload) => {
    const access_token = jwt.sign({
        payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '30s' })

    return access_token
}

const genneralRefreshToken = async (payload) => {
    const refresh_token = jwt.sign({
        payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' })

    return refresh_token
}

const refreshTokenJwtService = async (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(token)
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    resolve({
                        status: 'ERROR',
                        message: 'The authentication'
                    })
                }
                console.log(user);
                const { payload } = user;
                const access_token = await genneralAccessToken({
                    id: payload?.id,
                    isAdmin: payload?.isAdmin
                })

                console.log(access_token)

                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    access_token
                })
            })

        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenJwtService
}