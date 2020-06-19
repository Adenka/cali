const db = require('./db')
const { throwError, throwIf } = require('./throwFunctions')
const crypto = require('crypto')
const { password: passwordSalt, token: tokenSalt } = require('./salts.json')

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
            'INSERT INTO tokens (login, token, expires) VALUES (?, ?, ?)',
            [login, token, expires]
        )
        .catch(throwError(500, 'SQL Error'))
}

const hashPassword = (login, password) => {
    const hash = crypto
        .createHash('sha256')
        .update(`${login}${password}${passwordSalt}`)
        .digest('base64')

    return hash
}

const deleteExpiredTokens = async () => {
    await db
        .get()
        .promiseQuery('DELETE FROM tokens WHERE expires < ?', [
            Math.floor(new Date().getTime() / 1000),
        ])
        .catch(throwError(500, 'SQL Error'))
}

const authorizeToken = async (auth) => {
    await deleteExpiredTokens()
    await db
        .get()
        .promiseQuery('SELECT * FROM tokens WHERE token=? AND login=?', [
            auth.token,
            auth.login,
        ])
        .then(
            throwIf((rows) => rows.length === 0, 401, `Token expired!`),
            throwError(500, 'SQL Error')
        )

    const persistent = auth.token[0] === '1'
    const expires =
        Math.floor(new Date().getTime() / 1000) +
        3600 * (persistent ? 24 * 30 * 3 : 1)

    await db
        .get()
        .promiseQuery(
            'UPDATE tokens SET expires = ? WHERE token=? AND login=?',
            [expires, auth.token, auth.login]
        )
}

exports.endpointMap = {
    serverTime: async (args) => {
        const date = new Date()
        return { date }
    },

    testQuery: async ({ id, auth }) => {
        await authorizeToken(auth)
        const value = await db
            .get()
            .promiseQuery('SELECT value FROM test WHERE id=?', [id])
            .then(
                throwIf((value) => !value, 512, 'Lvl failed'),
                throwError(500, 'SQL Error')
            )

        return { result: value[0] }
    },

    register: async ({ login, password, persistent }) => {
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
    },

    login: async ({ login, password, persistent }) => {
        await db
            .get()
            .promiseQuery(
                'SELECT login FROM users WHERE login=? AND password=?',
                [login, hashPassword(login, password)]
            )
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
    },
}
