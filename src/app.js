const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Roger Gomez'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Roger Gomez'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Roger Gomez'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Address must be provided'
        })
    } else {
        geocode(req.query.address, (error, location) => {
        if (error) {
            res.send({error})
        } else {
            forecast(location, (error, wheather ) => {
                const {weatherDescription, feelslike, currentTemperature} = wheather
                res.send({
                    location: location.location,
                    forecast: `The current weather in ${location.location} is ${weatherDescription}. It is currently ${currentTemperature} it feels like ${feelslike}`
                })
                //res.send(`The current weather in ${location.location} is ${weatherDescription}. It is currently ${currentTemperature} it feels like ${feelslike}`)
            })}    
        })
    }
})


app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Roger Gomez',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Roger Gomez',
        errorMessage: 'Page not found.'
    })
})

app.listen(port, () => {
    console.log('Server is up on port' + port + '.')
})