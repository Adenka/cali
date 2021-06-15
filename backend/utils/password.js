const crypto = require('crypto')
const { password: passwordSalt } = require('../salts.json')

const hashPassword = (login, password) => {
    const hash = crypto
        .createHash('sha256')
        .update(`${login}${password}${passwordSalt}`)
        .digest('base64')

    return hash
}

module.exports = {
    hashPassword,
}
