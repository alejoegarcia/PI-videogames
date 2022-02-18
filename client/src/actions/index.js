require('dotenv').config();
// const { RAWG_API_KEY } = process.env;
// const getAllGamesURL = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}`;
// const getGamesByNameURL = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=`;
// const getGenresURL = `https://api.rawg.io/api/genres?key=${RAWG_API_KEY}`;
// const getGameDetailsURL = `https://api.rawg.io/api/games/GAMEID?key=${RAWG_API_KEY}`;

export const GET_VIDEOGAMES = "GET_VIDEOGAMES";
export const GET_DETAILS = "GET_DETAILS";
export const POST_VIDEOGAME = "POST_VIDEOGAME";

export function getVideogames(source) {
    const url = source ?
        `http://localhost:3001/videogames?source=${source}`
        : "http://localhost:3001/videogames";
    /* return async (dispatch) => {
        function onSuccess(success) {
            console.log(success);
            dispatch({
                type: GET_VIDEOGAMES,
                payload: success
            });
        }
        function onError(error) {
            console.error(error);
        }
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log(json);
            return onSuccess(json);

        } catch (error) {
            return onError(error);
        }
    }; */
    return function (dispatch) {
        console.log(url);
        fetch(url)
            .then(r => {
                console.log(r);
                return r.json();
            })
            .then(d => dispatch({
                type: GET_VIDEOGAMES,
                payload: d
            }))
            .catch(e => console.log(e));
    }
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