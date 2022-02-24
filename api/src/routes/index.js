// #region imports
const express = require('express');
const { Op } = require('sequelize');

const { Videogame, Genre } = require('../db.js');
const {
    getVideogamesFromAPI,
    getDetailsFromAPI,
    getGenresFromAPI
} = require("../utils.js");

// #endregion imports
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

// #region general variables
const router = express.Router();

// general variables
// #endregion general variables

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
            // const e = {};
            // e[error.message] = error.response.data.error;
            return response.status(404).json(error);
        }
    }

    return response.json(videogames);
});

router.get('/videogame/:idVideogame', async (request, response) => {
    // get by id, request.params.idVideogame
    // include: Genre (sequelize)
    let videogameDetails = {};

    // if idVideogame isNaN, it can only be a (local) UUIDV4
    if (isNaN(request.params.idVideogame)) {
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
        // return response.json(videogameDetails);

    } else {
        // get it from the API
        try {
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
                platforms: APIcall.platforms,
                rating: APIcall.rating
            };

        } catch (error) {
            return response.status(404).json(error);
        }
    }
    return response.json(videogameDetails);
});

router.get('/genres', async (request, response) => {
    // if the call to DB returns an empty array, call the API and save the results to the DB
    let genres = await Genre.findAll();

    if (genres.length === 0) {
        try {
            const APIcall = await getGenresFromAPI();
            genres = APIcall.results.map((genre) => {
                // map only needed data
                return { id: genre.id, name: genre.name };
            })

            // bulkCreate expects an array of objects
            await Genre.bulkCreate(genres);
        } catch (error) {
            return response.status(500).json(error);
        }
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
