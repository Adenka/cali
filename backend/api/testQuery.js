const db = require('../db')
const { throwError, throwIf } = require('../utils/throwFunctions')

module.exports = async ({ id, auth }) => {
    const value = await db
        .get()
        .promiseQuery('SELECT value FROM test WHERE id=?', [id])
        .then(
            throwIf((value) => !value, 512, 'Lvl failed'),
            throwError(500, 'SQL Error')
        )

    return { result: value[0] }
}
