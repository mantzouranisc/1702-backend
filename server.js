const express = require('express')
const mongoose = require('mongoose')
const LogSchema = require('./models/UserLogSchema')
const {createServer} = require('http')
require('dotenv/config')

const app = express()
const server = createServer(app)

const normalizePort = port => parseInt(port, 10)
const PORT = normalizePort(process.env.PORT || 3001)

app.use(express.json())
app.set('trust proxy', 1);

app.use('/',(req,res,next) => {
  const IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
  const Log = new LogSchema({ IP,Method: req.method, URL:req.url, Headers:req.headers  })
  Log.save((err,client) => {
    if(err) throw err;
    console.log('User successfuly Logged')
    next()
  })
})


app.get('/',(req,res) => {
  res.json({ message: 'To use the API start by going to the api/filter Route and optionally enter parameters such as mmsi & latitude,longitude range & time_interval ',Example1: '/api/filter?mmsi=311040700,311486000',Example2:'/api/filter?mmsi=311040700&lat=-90,90&lon=10,180',Example3:'/api/filter?interval=1372683960,1372700340'  })
})

const ApiRouter = require('./routes/api')
app.use('/api',ApiRouter)

app.get('*',(req,res) => {
  res.send({ message: 'Seems like you entered a wrong route,please start by going to the /api/filter Route,Examples of correct requests',Example1: '/api/filter?mmsi=311040700,311486000',Example2:'/api/filter?mmsi=311040700&lat=-90,90&lon=10,180',Example3:'/api/filter?interval=1372683960,1372700340'   })
})


mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true,useUnifiedTopology: true },(err) => {
  if(err) throw err
  console.log(`Mongo DB connection successful`)
})


server.listen(PORT,'0.0.0.0',(err) => {
  if(err) throw err
  console.log(`Server started[localhost:${PORT}]`)
})
