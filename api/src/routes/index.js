// #region imports
const express = require("express");
const { Op } = require("sequelize");

const { Videogame, Genre } = require("../db.js");
const {
    getVideogamesFromAPI,
    getDetailsFromAPI,
    getGenresFromAPI,
} = require("../utils.js");
// #endregion imports

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

// #region general variables
const router = express.Router();

// #endregion general variables

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use(express.json());

// #region get /videogames
router.get("/videogames", async (request, response) => {
    // get from DB and API
    let videogames = [];

    if (request.query.name) {
        // filter by name
        // destructuring de la llamada a la API y a la DB
        try {
            videogames = [
                ...(await getVideogamesFromAPI(
                    undefined,
                    undefined,
                    request.query.name
                )),
                ...(await Videogame.findAll({
                    attributes: [
                        "id",
                        "name",
                        "description",
                        "launchDate",
                        "rating",
                        "platforms",
                    ],
                    where: {
                        name: {
                            [Op.like]: `%${request.query.name}%`,
                        },
                    },
                    // includes all the relations
                    // include: [{model: Genre, through: "Videogame_Genre"}],
                    include: [{model: Genre}]
                })),
            ];

        } catch (error) {
            return response.status(404).json(error);
        }
    } else {
        // we have to return both
        let APIcall = null;
        let DBcall = null;

        // we use separate try/catch to me more specific
        try {
            APIcall = await getVideogamesFromAPI();
        } catch (error) {
            return response.status(500).json(error);
        }
        try {
            DBcall = await Videogame.findAll({
                attributes: [
                    "id",
                    "name",
                    "description",
                    "launchDate",
                    "rating",
                    "platforms",
                ],
                // includes all the relations
                // include: [{model: Genre, through: "Videogame_Genre"}],
                include: Genre
            });
        } catch (error) {
            return response.status(500).json(error);
        }

        videogames = [...APIcall, ...DBcall];
    }

    // catch if there were no errors but we didn't find anything
    if (videogames.length === 0) {
        return response.json({ "error": "not found" });
    }

    // everything went smoothly
    return response.json(videogames);
});
// #endregion

// #region get /videogame/:idVideogame
router.get("/videogame/:idVideogame", async (request, response) => {
    // get by id, request.params.idVideogame
    let videogameDetails = {};

    // if idVideogame isNaN, it can only be a (local) UUIDV4
    if (isNaN(request.params.idVideogame)) {
        // get it from the DB
        try {
            const DBcall = await Videogame.findByPk(
                request.params.idVideogame,
                {
                    attributes: [
                        "id",
                        "name",
                        "description",
                        "launchDate",
                        "rating",
                        "platforms",
                    ],
                    // includes all the relations
                    include: Genre
                }
            );
                console.log("DBCALL", DBcall);
            videogameDetails = DBcall;
        } catch (error) {
            return response
                .status(404)
                .json({
                    error: `Local Videogame with ID ${request.params.idVideogame} not found`,
                });
        }
    } else {
        // get it from the API
        try {
            const APIcall = await getDetailsFromAPI(request.params.idVideogame);
            if (APIcall.detail && APIcall.detail === "Not found.") {
                return response
                    .status(404)
                    .json({
                        error: `API Videogame with ID ${request.params.idVideogame} not found`,
                    });
            }
            videogameDetails = {
                id: APIcall.id,
                image: APIcall.background_image,
                name: APIcall.name,
                genres: APIcall.genres,
                description: APIcall.description,
                launchDate: APIcall.released,
                platforms: APIcall.platforms,
                rating: APIcall.rating,
            };
        } catch (error) {
            return response.status(404).json(error);
        }
    }

    // there were no errors
    return response.json(videogameDetails);
});
// #endregion

// #region get /genres
router.get("/genres", async (request, response) => {
    // if the call to DB returns an empty array, call the API and save the results to the DB
    let genres = await Genre.findAll();

    if (genres.length === 0) {
        try {
            const APIcall = await getGenresFromAPI();
            genres = APIcall.results.map((genre) => {
                // map only needed data
                return { id: genre.id, name: genre.name };
            });

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
// #endregion

// #region post /videogame
router.post("/videogame", async (request, response) => {
    // create videogame, save to DB and return success
    // request.body.*
    const { name, description, launchDate, rating, platforms, genres } =
        request.body.game;
    // we shouldn't be able to get to POST without going through the previously validated react-form but it's safer to check everything's in place
    if (!name || !description || !platforms) {
        return response.status(400).json({ error: "missing data" });
    }
    try {
        const alreadyExists = await Videogame.findAll({
            where: {
                name: name,
                description: description,
                platforms: platforms,
            },
        });

        if (alreadyExists.length > 0) {
            return response.status(400).json({ error: "game already exists" });
        }

        // if we have all the data and it's not in the local DB, save it
        const newGame = await Videogame.create(request.body.game);
        genres.forEach(async (genre) => {
            const genreFromDB = await Genre.findOne({ where: { name: genre } });
            const s = await newGame.addGenres(genreFromDB.id);
            console.log("s", s);
        })
        console.log("newGame:", newGame.toJSON());
        response.status(201).json({
            id: newGame.id,
            name: newGame.name,
            genres: newGame.itsGenres,
            description: newGame.description,
            launchDate: newGame.launchDate,
            rating: newGame.rating,
            platforms: newGame.platforms,
        });
    } catch (error) {
        return response.status(400).json(error);
    }
});
// #endregion

// #region exports
module.exports = router;
// #endregion