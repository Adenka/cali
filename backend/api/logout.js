const db = require('../db')
const { throwError, throwIf } = require('../utils/throwFunctions')

module.exports = async ({ token }) => {
    await db
        .get()
        .promiseQuery('DELETE FROM tokens WHERE token = ?', [token])
        .catch(throwError(500, 'SQL Error'))

    return {}
}
