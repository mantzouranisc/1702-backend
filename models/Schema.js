const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    mmsi: {
        type: Number,
        required: true
    },
    status:{
        type: Number,
        required: true
    },
    stationId: {
        type: Number,
        required: true
    },
    speed:{
        type: Number,
        required: true
    },
    lon:{
        type: Number,
        required: true
    },
    lat:{
        type: Number,
        required: true 
    },
    course:{
        type: Number,
        required: true
    },
    heading:{
        type: Number,
        required: true
    },
    rot:{
        type: String
    },
    timestamp:{
        type: Number,
        required: true
    }
})


module.exports = mongoose.model('api',Schema)