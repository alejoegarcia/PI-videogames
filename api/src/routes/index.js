require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { Op } = require('sequelize');
const { Videogame, Genre } = require('../db.js');
const { RAWG_API_KEY } = process.env;
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = express.Router();

// allowed API endpoints
const getAllGamesURL = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}`;
const getGamesByNameURL = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=`;
const getGenresURL = `https://api.rawg.io/api/genres?key=${RAWG_API_KEY}`;
const getGameDetailsURL = `https://api.rawg.io/api/games/GAMEID?key=${RAWG_API_KEY}`;

// general variables
const maxGamesfromAPI = 100;
const videogameIDregex = /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/y;

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
    // const url = paginatedURL ? paginatedURL : getAllGamesURL;
    // const url = gameName ? `` paginatedURL ? paginatedURL : getAllGamesURL;
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
                genres: element.genres
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
    const responseData = await callAPI(url);
    return responseData;
}

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use(express.json());

router.get('/videogames', async (request, response) => {
    // get from DB and API
    let videogames = [];

    if (request.query.name) {
        // filter by name
        // destructuring de la llamada a la API y a la DB
        try {

            videogames = [
                ...await getVideogamesFromAPI(undefined, undefined, request.query.name),
                ...await Videogame.findAll({
                    attributes: ["id", 'name', 'description', "launchDate", "rating", "platforms"],
                    where: {
                        name: {
                            [Op.like]: `%${request.query.name}%`
                        }
                    },
                    include: Genre
                })
            ];
        } catch (error) {
            const e = {};
            e[error.message] = error.response.data.error;
            return response.status(404).json(e);
        }
    } else {
        // get all
        // destructuring de la llamada a la API y a la DB
        try {
            if (request.query.source === "local") {
                videogames = [
                    ...await Videogame.findAll({
                        attributes: ["id", 'name', 'description', "launchDate", "rating", "platforms"],
                        include: Genre
                    })
                ];
            } else if (request.query.source === "external") {
                videogames = [
                    ...await getVideogamesFromAPI()
                ];
            } else {
                videogames = [
                    ...await getVideogamesFromAPI(),
                    ...await Videogame.findAll({
                        attributes: ["id", 'name', 'description', "launchDate", "rating", "platforms"],
                        include: Genre
                    })
                ];
            }
            if (videogames.length === 0) {
                return response.json({ "warning": "no games found" });
            }
        } catch (error) {
            // TODO: handle other errors, this is API-specific
            const e = {};
            e[error.message] = error.response.data.error;
            return response.status(404).json(e);
        }
    }
    return response.json(videogames);
});

router.get('/videogame/:idVideogame', async (request, response) => {
    // get by id, request.params.idVideogame
    // include: Genre (sequelize)
    let videogameDetails = {};

    // trying to parse a UUIDV4 return NaN, which is type-coerced to false
    // if idVideogame can't be parsed, the game belongs to the local DB
    if (!parseInt(request.params.idVideogame)) {
        // get it from the DB
        const DBcall = await Videogame.findByPk(
            request.params.idVideogame,
            {
                attributes: ["id", 'name', 'description', "launchDate", "rating", "platforms"],
                include: Genre
            }
        );
        if (DBcall === null) {
            return response.status(404).json({ "error": `Local Videogame with ID ${request.params.idVideogame} not found` });
        }
        videogameDetails = DBcall;
        return response.json(videogameDetails);

    } else {
        // get it from the API
        const APIcall = await getDetailsFromAPI(request.params.idVideogame);
        if (APIcall.detail && APIcall.detail === "Not found.") {
            return response.status(404).json({ error: `API Videogame with ID ${request.params.idVideogame} not found` });
        }
        videogameDetails = {
            id: APIcall.id,
            image: APIcall.background_image,
            name: APIcall.name,
            genres: APIcall.genres,
            description: APIcall.description,
            launchDate: APIcall.released,
            platforms: APIcall.platforms
        };
    }
    return response.json(videogameDetails);
});

router.get('/genres', async (request, response) => {
    // if the call to DB returns an empty array, call the API and save the results to the DB
    let genres = await Genre.findAll();

    if (genres.length === 0) {
        const APIcall = await callAPI(getGenresURL);
        genres = APIcall.results.map((genre) => {
            // map only needed data
            return { id: genre.id, name: genre.name };
        })

        // bulkCreate expects an array of objects
        await Genre.bulkCreate(genres);
    } else {
        // already saved the genres in the DB
        genres = genres.map((genre) => {
            return { id: genre.dataValues.id, name: genre.dataValues.name };
        });
    }

    return response.json(genres);
});

router.post('/videogame', async (request, response) => {
    // create videogame, save to DB and return success
    // request.body.*
    const { name, description, launchDate, rating, platforms } = request.body;
    // we shouldn't be able to get to POST without going through the previously validated react-form but it's safer to check everything's in place
    if (!name || !description || !platforms) {
        return response.status(400).json({ "error": "Faltan datos" });
    }
    try {
        const alreadyExists = await Videogame.findAll({
            where: {
                name: name,
                description: description,
                launchDate: launchDate,
                platforms: platforms
            }
        });
        if (alreadyExists.length > 0) {
            return response.status(400).json({ "error": "game already exists" });
        }
        const newGame = await Videogame.create(request.body);
        response.status(201).json({
            id: newGame.id,
            name: newGame.name,
            description: newGame.description,
            launchDate: newGame.launchDate,
            rating: newGame.rating,
            platforms: newGame.platforms
        });
    } catch (error) {
        const prettyError = {
            "error": error.errors.map((e) => { return { [e.type]: e.message } })
        }

        return response.status(400).json(prettyError);
    }
});

module.exports = router;
