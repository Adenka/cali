const db = require('../db')
const { throwError, throwIf } = require('../utils/throwFunctions')
const { registerToken, generateToken } = require('../utils/token')
const { hashPassword } = require('../utils/password')

module.exports = async ({ login, password, persistent }) => {
    await db
        .get()
        .promiseQuery('SELECT login FROM users WHERE login=?', [login])
        .then(
            throwIf((rows) => rows.length, 456, 'Login taken bruh'),
            throwError(500, 'SQL Error')
        )

    await db
        .get()
        .promiseQuery('INSERT INTO users(login, password) VALUES (?, ?)', [
            login,
            hashPassword(login, password),
        ])
        .catch(throwError(500, 'SQL Error'))

    const token = generateToken(login, password, persistent)
    await registerToken(login, token, persistent)

    return { token }
}
