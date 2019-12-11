// load dotenv config
require("dotenv").config();

// request
let request = require('request');

// fs
let fs = require('fs');
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
            function (response) {
                // data variables
                let userSearch = response.data[0];
                let venue = userSearch.venue;
                let date = userSearch.datetime;

                // Prints details of event
                console.log(`\nHere is ${userSearch.artist.name}'s next show!\n`);
                console.log(`\nArtist: ${userSearch.lineup[0]} \nVenue: ${venue.name}\nVenue Location: ${venue.latitude}, ${venue.longitude}\nVenue City: ${venue.city}, ${venue.country}\nTime: ${moment(date).format('dddd, MMMM Do YYYY, h:mm a')}`)

                let log = `\n= = = = = concert-this = = = = =\n\nHere is ${userSearch.artist.name}'s next show!\nArtist: ${userSearch.lineup[0]}\nVenue: ${venue.name}\nVenue Location: ${venue.latitude}, ${venue.longitude}\nVenue City: ${venue.city}, ${venue.country}\nTime: ${moment(date).format('dddd, MMMM Do YYYY, h:mm a')}\n\n= = = = = concert-this = = = = =\r\n\r\n\r\n`


                fs.appendFile('log.txt', log, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Concert logged!');
                    }
                })

            }
        )
        .catch(function (error) {
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

// spotify-this 
const spotifyThis = () => {
    // Print the users' query
    console.log(`\r\n\r\n\nSearching for by ${userQuery}!\r\n\r\n`);

    //If user does not input a query, the query will be defaulted to "The Sign" by Ace of Base
    if (!userQuery) {
        userQuery = 'the sign ace of base'
    }

    spotify.search({
        type: 'track',
        query: userQuery,
        limit: 1
    }, function (error, response) {
        if (error) {
            return console.log(`Sorry! There was an error: ${error}\nTry another search.`);
        }
        // Details of song
        let songArr = (response.tracks.items);
        let artistName = songArr[0].album.artists[0].name
        let songName = songArr[0].name
        let songURL = songArr[0].external_urls.spotify
        let albumName = songArr[0].album.name;
        // Prints song to console
        console.log(`\nArtist: ${artistName}\nSong title: ${songName}\nSpotify link: ${songURL}`);
        if (songArr[0].album.album_type !== 'single') {
            console.log(`Album name: ${albumName}`);
        };

        let log = `\n= = = = = spotify-this-song = = = = =\n\nArtist: ${artistName}\nSong title: ${songName}\nSpotify link: ${songURL}\nAlbum name: ${albumName}\n\n= = = = = spotify-this-song = = = = =\r\n\r\n\r\n`
        fs.appendFile('log.txt', log, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Song logged!');
            }
        })

    })
}

// movie-this
const movieThis = () => {

    if (!userQuery) {
        userQuery = 'Mr. Nobody'
        return console.log(`\nIf you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>\nIt's on Netflix!`)
    }
    request(`http://www.omdbapi.com/?t=${userQuery}&apikey=trilogy`, function (err, response) {
        if (err && response.statusCode !== 200) {
            return console.log(`There was an error with you request:\n${response.statusCode}\n${response.body}`);
        }
        let movieData = JSON.parse(response.body)
        title = movieData.Title;
        year = movieData.Year;
        rating = movieData.Rated
        tomatoRating = movieData.Ratings[1].Value;
        country = movieData.Country;
        language = movieData.Language;
        plot = movieData.Plot;
        actors = movieData.Actors;
        console.log(`\ntitle: ${title}\nyear: ${year}\nrating: ${rating}\ntomatoRating: ${tomatoRating}\ncountry: ${country}\nlanguage: ${language}\nplot: ${plot}\nactors: ${actors}`);

        let log = `\n= = = = = movie-this = = = = =\n\ntitle: ${title}\nyear: ${year}\nrating: ${rating}\ntomatoRating: ${tomatoRating}\ncountry: ${country}\nlanguage: ${language}\nplot: ${plot}\nactors: ${actors}\n\n= = = = = movie-this = = = = =\r\n\r\n\r\n`

        fs.appendFile('log.txt', log, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Movie logged!');
            }
        })

    })
}

// do-what-it-says
const doWhatItSays = () => {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        // Prints error, if any
        if (err) {
            return console.log(err);
        }

        // Defines data
        let dataArr = data.split(',');
        userInput = dataArr[0];
        userQuery = dataArr[1];
        // Runs command function according to random.txt
        command(userInput, userQuery);
    });
}


const command = (userInput, userQuery) => {
    switch (userInput) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
            spotifyThis();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-this":
            doWhatItSays();
            break;
    }
}

command(userInput, userQuery);