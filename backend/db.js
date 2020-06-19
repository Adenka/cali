const mysql = require('mysql')
const config = require('./dbConfig.json')
const util = require('util')

var state = {
    pool: null,
}

exports.connect = (done) => {
    state.pool = mysql.createPool(config)
    state.pool.promiseQuery = util.promisify(state.pool.query)
    done()
}

exports.get = () => {
    return state.pool
}
