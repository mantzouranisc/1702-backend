const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    Method:{
        type: String
    },
    URL:{
        type: String
    },
    Headers:{
        type: mongoose.Schema.Types.Mixed
    },
    IP:{
        type: String,
    },
    Date:{
        type:Date,
        default: Date.now
    }

})


module.exports = mongoose.model('logs',Schema,'Logs')