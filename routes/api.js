const express = require('express')
const router = express.Router()
const DB = require('../models/Schema')
const rateLimit = require("express-rate-limit");
const Conversion = require('../ConversionModules/Convertion')


const parser = (value) => {
    if(!value) return [];
    let storage = [ value ]
    if(value.indexOf(',') > -1)
        storage = value.split(',')
    storage = storage.map((item) => parseFloat(item,10))
    return storage
}



const requestLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max:10,
    message:"Too many requests done from this IP, please try again after an hour"
})
 


router.get('/',(req,res) => {
    res.json({ 
        response: 'To use the API start by going to the api/filter Route and optionally enter parameters such as mmsi & latitude,longitude range & time_interval ',
        Example1: '/api/filter?mmsi=311040700,311486000',
        Example2:'/api/filter?mmsi=311040700&lat=-90,90&lon=10,180',
        Example3:'/api/filter?interval=1372683960,1372700340' 
    })
})


router.get('/filter',requestLimiter,async (req,res) => {
    const mmsi = req.query.mmsi
    const latitude = req.query.lat,longitude = req.query.lon
    const interval = req.query.interval
    const content_type = req.get('Content-Type')
    let mmsi_storage = parser(mmsi)
    let lat_range = parser(latitude)
    let lon_range = parser(longitude)
    let interval_range = parser(interval)
    if(!parseInt(mmsi,10))
        mmsi_storage = await DB.distinct('mmsi') //If there mmsi_arguement is not supplied or is null,load every default value
    try{
        const posts = await DB.find({ 
            mmsi: { $in: mmsi_storage }, 
            lat: { $gte: lat_range[0] || -90, $lte: lat_range[1] || 90 },
            lon: { $gte: lon_range[0] || -180, $lte: lon_range[1] || 180 },
            timestamp: {$gte: interval_range[0] || -1372700640000, $lte: interval_range[1] || 1372700640000 }
        }, { __v:0,_id:0 } )
        if(posts.length === 0){
            res.send({ response: 'There are no results that correspond to your filtering options,please try again '})
            return ;
        }
        if(lat_range[0] < -90 || lat_range[1] > 90 || lon_range[0] < -180 || lon_range[1] > 180){
            res.send({ response:'Latitude or Longitude filter is wrong, Latitude range must be between -90 and 90,Longitude range must be between -180 and 180' })
            return ;
        }
        if(content_type === 'application/json' || content_type === 'application/vnd.api+json' || !content_type){
            res.json({ response:posts })
        } else if(content_type === 'application/xml'){
            const obj = posts.map((item) => item.toObject())
            res.send(Conversion.JSONtoXML(obj))
        } else if(content_type === 'text/csv'){
            res.send(Conversion.JSONtoCSV(posts))
        } else {
            res.send({ response: `${content_type}[Content-Type] is not currently being supported by the api.The Content-Types supported are the following:  application/json,  application/vnd.api+json,  application/xml,  text/csv` })
        }
        console.log('Successfuly responded to the client! ')
    } catch(err) {
        console.log(err)
        res.json({ response:err.message })
    }
    
})

// router.post('/',(req,res) => {
//     DB.insertMany(json,(err,docs) => {
//         if(err) throw err 
//         console.log('succeeded')
//     })

module.exports = router
