// #region imports
require('dotenv').config();
const axios = require('axios');
const { RAWG_API_KEY } = process.env;

const maxGamesfromAPI = 100;

// #region allowed API endpoints
const getAllGamesURL = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}`;
const getGamesByNameURL = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=`;
const getGenresURL = `https://api.rawg.io/api/genres?key=${RAWG_API_KEY}`;
const getGameDetailsURL = `https://api.rawg.io/api/games/GAMEID?key=${RAWG_API_KEY}`;

// #region API
async function callAPI(url) {
    try {
        // get the data from the API
        const responseFromAPI = await axios.get(url);
        return responseFromAPI.data;
    } catch (error) {
        // something happened
        throw error;
    }
}

async function getVideogamesFromAPI(paginatedURL, alreadyFetchedGames = 0, gameName) {
    // array to save the fetch's results
    let gamesFromAPI = [];
    // url from where we'll get the data (API's pagination has 20 items and adds ?page=n)
    const url = paginatedURL ?
        paginatedURL :
        gameName !== undefined ?
            `${getGamesByNameURL}${gameName}`
            : getAllGamesURL;

    try {
        // get the data from the API
        const responseData = await callAPI(url);

        // push only the needed info while there's info to push and we haven't already reached the max amount of games (as stated in the README)
        // if we're not on the first call, we've already fetched info and we have to consider the alreadyFetchedGames to prevent this recursion from going on for eternity
        for (let i = 0; i < responseData.results.length && alreadyFetchedGames + gamesFromAPI.length < maxGamesfromAPI; i++) {
            const element = responseData.results[i];
            gamesFromAPI.push({
                id: element.id, // we also get the id to include it in the link to the game's details
                name: element.name,
                image: element.background_image,
                genres: element.genres,
                rating: element.rating,
                platforms: element.platforms
            });
        }

        // if we haven't fully populated the array and there's more info to retrieve from the API, return the destructuring of the current results array and await for the recursive call
        // include alreadyFetchedGames + gamesFromAPI.length to avoid infinite recursion
        if (alreadyFetchedGames + gamesFromAPI.length < maxGamesfromAPI && responseData.next) {
            return [
                ...gamesFromAPI,
                ...await getVideogamesFromAPI(responseData.next, alreadyFetchedGames + gamesFromAPI.length)
                // we don't need to pass gameName as it's already inside jres.next and this is the first value we check when setting the URL
            ];
        } else {
            // we've successfully populated the array or we can't get more info from the API, stop the recursion
            return gamesFromAPI;
        }
    } catch (error) {
        // something went wrong
        throw error;
    }
}

async function getDetailsFromAPI(id) {
    const url = getGameDetailsURL.replace("GAMEID", id);
    try {
        const responseData = await callAPI(url);
        return responseData;
    } catch (error) {
        throw error;
    }
}

async function getGenresFromAPI() {
    try {
        const responseData = await callAPI(getGenresURL);
        return responseData;
    } catch (error) {
        throw error;
    }
}
// #endregion API

// #region exports
module.exports = {
    getVideogamesFromAPI,
    getDetailsFromAPI,
    getGenresFromAPI
};