require('dotenv').config();
const { RAWG_API_KEY } = process.env;
const getAllGamesURL = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}`;
const getGamesByNameURL = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=`;
const getGenresURL = `https://api.rawg.io/api/genres?key=${RAWG_API_KEY}`;
const getGameDetailsURL = `https://api.rawg.io/api/games/GAMEID?key=${RAWG_API_KEY}`;

export const GET_VIDEOGAMES = "GET_VIDEOGAMES";
export const GET_DETAILS = "GET_DETAILS";
export const POST_VIDEOGAME = "POST_VIDEOGAME";

export function getVideogames(source) {
    const url = source ?
        `http://localhost:3001/videogames?source=${source}`
        : "http://localhost:3001/videogames";
    return async function (dispatch) {
        const response = await fetch(url);
        console.log(response);
        dispatch({
            type: GET_VIDEOGAMES,
            payload: response
        })
    };
}

export function getDetails(id) {
    return async function (dispatch) {
        const response = await fetch(`http://localhost:3001/videogame/${id}`)
        dispatch({
            type: GET_DETAILS,
            payload: response
        })
    };
}

export function postVideogame(game) {
    return async function (dispatch) {
        const response = await fetch(`http://localhost:3001/videogame`, {
            method: "POST",
            body: game
        });
        dispatch({
            type: POST_VIDEOGAME,
            payload: response
        });
    };
}