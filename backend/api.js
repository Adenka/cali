const db = require('./db')

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

        if(!value)
        {
            throw ({code: 512, message: "Lvl failed"})
        }
        
        return {result: value}
    }
}