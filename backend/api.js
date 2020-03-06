const db = require('./db')
const {throwError, throwIf} = require('./throwFunctions')

exports.endpointMap = {

    serverTime: async (args) => {
        const date = new Date()
        return {date}
    },

    testQuery: async (args) => {
        const id = args
        const value = await db.get().promiseQuery(
            'SELECT value FROM test WHERE id=?', [id]
        )
        .then(
            throwIf((value) => (!value), 512, "Lvl failed"),
            throwError(500, "SQL Error")
        )
        
        return {result: value[0]}
    },
    
    register: async (args) => {
        const login = args.login
        const password = args.password

        await db.get().promiseQuery(
            'SELECT login FROM users WHERE login=?', [login]
        )
        .then(
            throwIf((rows) => (rows.length), 456, "Login taken bruh"),
            throwError(500, "SQL Error")
        )

        await db.get().promiseQuery(
            'INSERT INTO users(login, password) VALUES (?, ?)', [login, password]
        ).catch(throwError(500, "SQL Error"))

        return {token: "1337"}
    },

    login: async (args) => {
        const {login, password} = args

        await db.get().promiseQuery(
            'SELECT login FROM users WHERE login=? AND password=?', [login, password]
        ).then(
            throwIf((user) => (!user), 403, "Invalid user or password"),
            throwError(500, "SQL Error")
        )

        return {token: "1337"}
    }
}