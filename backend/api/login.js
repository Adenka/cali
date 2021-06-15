const db = require('../db')
const { throwError, throwIf } = require('../utils/throwFunctions')
const { registerToken, generateToken } = require('../utils/token')
const { hashPassword } = require('../utils/password')

module.exports = async ({ login, password, persistent }) => {
    await db
        .get()
        .promiseQuery('SELECT login FROM users WHERE login=? AND password=?', [
            login,
            hashPassword(login, password),
        ])
        .then(
            throwIf(
                (user) => user.length === 0,
                403,
                'Invalid user or password'
            ),
            throwError(500, 'SQL Error')
        )

    const token = generateToken(login, password, persistent)
    await registerToken(login, token, persistent)

    return { token }
}
