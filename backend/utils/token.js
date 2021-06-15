const crypto = require('crypto')
const db = require('../db')
const { throwError, throwIf } = require('../utils/throwFunctions')
const { token: tokenSalt } = require('../salts.json')

//format sqla
//date

const generateToken = (login, password, persistent) => {
    const time = [new Date().getTime(), process.hrtime()[1]]

    const token =
        (persistent ? '1' : '0') +
        crypto
            .createHash('sha256')
            .update(`${login}${password}${time[0]}${time[1]}${tokenSalt}`)
            .digest('base64')

    return token
}

const registerToken = async (login, token, persistent) => {
    const expires =
        Math.floor(new Date().getTime() / 1000) +
        3600 * (persistent ? 24 * 30 * 3 : 1)
    console.log(expires)

    await db
        .get()
        .promiseQuery(
            'INSERT INTO tokens (userId, token, expires) VALUES ((SELECT id FROM users WHERE login=?), ?, ?)', //czeka na format
            [login, token, expires]
        )
        .catch(throwError(500, 'SQL Error'))
}

const authorizeToken = async (auth, endpoint) => {
    if (['login', 'logout', 'register'].includes(endpoint)) return

    await deleteExpiredTokens()
    await db
        .get()
        .promiseQuery(
            'SELECT * FROM tokens WHERE token=? AND userId IN (SELECT id FROM users WHERE login=?)',
            [auth.token, auth.login]
        )
        .then(
            throwIf((rows) => rows.length === 0, 401, `Token expired!`),
            throwError(500, 'SQL Error')
        )

    const persistent = auth.token[0] === '1'
    const expires =
        Math.floor(new Date().getTime() / 1000) + // zamienić Date bo może być dziwne
        3600 * (persistent ? 24 * 30 * 3 : 1)

    await db
        .get()
        .promiseQuery(
            'UPDATE tokens SET expires = ? WHERE token=? AND userId IN (SELECT id FROM users WHERE login=?)',
            [expires, auth.token, auth.login]
        )
}

const deleteExpiredTokens = async () => {
    await db
        .get()
        .promiseQuery('DELETE FROM tokens WHERE expires < ?', [
            Math.floor(new Date().getTime() / 1000),
        ])
        .catch(throwError(500, 'SQL Error'))
}

module.exports = {
    generateToken,
    registerToken,
    authorizeToken,
    deleteExpiredTokens,
}
