const request = require('request')
const forecast = (location, callback) => {
    const {longitude, latitude} = location
    const url = `http://api.weatherstack.com/current?access_key=e5d09424a86298248448966450afa803&query=${longitude},${latitude}`
    request({
        url,
        json: true
    }, (error, response, body) => {
        if (error) {
            callback('Unable to connect to weather service', undefined)
        } else if (response.body.error) {
            callback('Unable to find the location', undefined)      
        } else {
            const {temperature, feelslike, humidity} = body.current
            callback( undefined, {
                weatherDescription: body.current.weather_descriptions[0],
                currentTemperature: temperature,
                feelslike,
                humidity
            })
            // console.log(response.statusCode)
            // console.log(`The current weather is ${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} it feels like ${body.current.feelslike}`)
        }
        
    }) 
}

module.exports = forecast