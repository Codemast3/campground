const mongoose = require('mongoose')
const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp' )
.then(() => {
    console.log("Mongo Connection Open")
})
.catch(err => {
    console.log("Mongo Connection Error")
    console.log(err)
})

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"))
db.once("open",() => {
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedCampgrounds = async () => {
    await Campground.deleteMany({});
    for(let i=0;i<200;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '6787bea2bea556265369d6df',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
           
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quae, repellendus. Quisquam, quidem. Consequatur, quos. Quisquam, quidem. Consequatur, quos.',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                    ]
                    }
                    ,
            images: [
                {
                  url: 'https://res.cloudinary.com/dqtrikkhp/image/upload/v1737322516/Campground/iumqx4t9aebsdqvvts3z.png',
                  filename: 'Campground/iumqx4t9aebsdqvvts3z',
                 
                }
              ]

        })
        await camp.save();
    }
}

seedCampgrounds().then(() => {
    mongoose.connection.close();
})





// seedDB();

