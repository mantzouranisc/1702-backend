# Vessels Tracks API Documentation
RESTful API that serves vessel tracks from a raw vessel positions data-source
# Table of Contents  
1. [Getting Started](#Installation)
    1. [Introduction](#Introduction)
    2. [Request Rate Limiting](#Request%20Rate%20Limitng)
    3. [Request Logging](#Request&20Logging)
    4. [JSON & XML & CSV(Content-Types)](#Installation)
2. [MMSI](#Usage)
3. [Latitude & Longitude Range](#Developmental_Process)
4. [Time Interval](#Timeinterval)
5. [Chaining](#Chaining)
5. [Built with](#Builtwith)


# Getting Started

## Introduction
   The API can either be installed locally with a database key that i have sent in a recent email or viewed online by clicking the link down bellow
## Request Rate Limiting
The current API limits are 10 requests every hour and are limited by IP address.You can use the X-RateLimit headers that get returned with every request to keep track of your current limits. If you exceed the limit, you will receive a 429 HTTP status with a Retry-After header. As soon your cool down period expires, you are free to continue making requests.

## Request Logging
Every GET Request to the API is being logged and sent to a MONGO database.Example Request:
[![N|Solid](https://i.imgur.com/wbdJ6En.png)]

## JSON & XML & CSV
The only formats the api supports are JSON & CSV & XML.The default format being sent by the api is JSON however you can request one of the two other specified formats by changing the Content-Type header to either application/xml or text/csv.

#### JSON Response example

[![N|Solid](https://i.imgur.com/UsNRp8v.png)]

### XML Response example
[![N|Solid](https://i.imgur.com/Fkp7wvC.png)]


### CSV Response example
[![N|Solid](https://i.imgur.com/NGHNYpz.png)]

# MMSI
### GET /api/filter?mmsi={mmsi}
Returns Vessels with the specified mmsi value(s)

#### Example of a request
    /api/filter?mmsi=311040700
#### Can also be chained to return results for multiple mmsi values i.e
    /api/filter?mmsi=311040700,311486000

# Latitude & Longitude Range
### GET /api/filter?lat={from},{to}&lon={from},{to}
Returns Vessels that have latitude and longitude within the specified range.Keep in mind 
Latitudes range from -90 to 90.
Longitudes range from -180 to 180
Any input that goes outside that range will return an error message as the message object
#### Examples of valid requests 
    /api/filter?lon=10,180
    /api/filter?lon=10,null Null stands for unspecified max value
    /api/filter?mmsi=311040700&lat=-30,40
    /api/filter?mmsi=311040700&lat=-30,40&lon=10,180
As you can see,lat and lon parameters can either be written alone or chained togheter

# Time Interval
### GET /api/filter?interval={min},{max}
Returns Vessels that have a timestamp within the interval specified
Timestamp Format: Date and time in MS (DOMTimeStamp)
Time_interval_example --> 1568904494193-1568904411579 = 82614(ms) --> 82.614(s)
#### Examples of valid requests
    /api/filter?interval=1372683960,1372700340
    /api/filter?interval=1372683960,null
    /api/filter?interval=1372683960
Like Latitude and Longitude Range min and max values can either be chained or written alone 

# Chaining 
Parameters can be chained togheter to filter the response

### Example 
    /api/filter?mmsi=311040700&lat=-90,90&lon=10,180
    /api/filter?mmsi=311040700,311486000&lat=-90,90&lon=10,180&interval=1372683960,1372700340
    
# Built With
Server side code is written in Node.js/Express
The Database used in the following project is a cloud version of mongoDB called MongoDB Atlas
Hosted at:Heroku





