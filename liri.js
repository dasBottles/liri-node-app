// load dotenv config
require("dotenv").config();

// axios
let axios = require("axios");

// Spotify API keys
let Spotify = require('node-spotify-api');
let keys = require("./keys");
let spotify = new Spotify(keys.spotify);

// moment
let moment = require('moment');

// liri commands
let userInput = process.argv[2];
let userQuery = process.argv.slice(3).join(" ");

// concert-this
const concertThis = () => {
    let queryURL = "https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp"
    console.log('queryURL: ', queryURL);
    axios.get(queryURL)
    .then(
        function(response) {

            let userSearch = response.data[0];

            console.log(`\nHere is ${userSearch.artist.name}'s next show!\n`);

            // Prints location/venue of event
            let venue = userSearch.venue;
            console.log(`\nArtist: ${userSearch.lineup[0]} \nVenue: ${venue.name}\nVenue Location: ${venue.latitude}, ${venue.longitude}\nVenue City: ${venue.city}, ${venue.country}`)
            let date = userSearch.datetime;
            console.log(moment(date).format('dddd, MMMM Do YYYY, h:mm a'));
        }
    )
    .catch(function(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("---------------Data---------------");
            console.log(error.response.data);
            console.log("---------------Status---------------");
            console.log(error.response.status);
            console.log("---------------Status---------------");
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
        }
        console.log(error.config);
    });
}


const command = (userInput, userQuery) => {
    switch (userInput) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this":
            spotifyThis();
            break;
    }

}

command(userInput, userQuery);