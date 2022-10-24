const path = require("path")
const express = require("express")
const hbs = require("hbs")
const forecast = require("./utils/forecast")
const geocode = require("./utils/geocode")
//const geocode = require("./utils/geocode")
const request = require('request')

console.log(__dirname)
console.log(path.join(__dirname, "../public"))

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public")
const viewsPath = path.join(__dirname,"../templates/views")
const partialsPath = path.join(__dirname,"../templates/partials")

// Setup handlesbars engine and views location
app.set("view engine","hbs")
app.set("views", viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get("",(req,res) => {
    res.render("index",{
        title: "Weather",
        name: "Wei"
    })
})

app.get("/about",(req,res) => {
    res.render("about",{
        title: "About me",
        name: "Wei"
    })
})

app.get("/help",(req,res) => {
    res.render("help",{
        helpText: "This is some helpful text",
        title: "Help",
        name: "Wei"
    })
})

app.get("/weather", (req,res)=>{
    if(!req.query.address){
        return res.send({
            error: "It is no address"
        })
    }   
/*     geocode(req.query.address,(error,{ latitude, longitude, location}) => {
        if(error) {
            return res.send({error})
        }
    }) */
    forecast(req.query.address,(error,forecastData) => {
        if(error) {
            return res.send({error})
        }
        res.send({
            forecast: forecastData.data,
            country: forecastData.country,
            location: req.query.address,
            
        })
    })

/*      res.send({
        forecast : "It is snowing",
        location : "Ljubljana",
        address: req.query.address
    }) */
})

app.get("/products",(req,res)=>{
    if(!req.query.search) {
        return res.send({
            error: "You must provide a search term"
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get("/help/*",(req,res)=>{
    res.render("404",{
        title: "404",
        name: "Wei",
        errorMessage: "Help artical not found"
    })
})

app.get("*",(req, res)=>{
    res.render("404",{
        title: "404",
        errorMessage: "Page not found",
        name: "Wei"
    })
})

app.listen(port, () =>{
    console.log("Server is up on port " + port)
} )  