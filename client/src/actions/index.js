const BASE_URL = "http://localhost:3001/";
const ALL_VIDEOGAMES_URL = `${BASE_URL}videogames`;
const VIDEOGAME_URL = `${BASE_URL}videogame/`;
const GENRES_URL = `${BASE_URL}genres/`;

export const GET_VIDEOGAMES = "GET_VIDEOGAMES";
export const GET_DETAILS = "GET_DETAILS";
export const POST_VIDEOGAME = "POST_VIDEOGAME";
export const GET_GENRES = "GET_GENRES";

export function getVideogames(source) {
    const url = source ?
        `${ALL_VIDEOGAMES_URL}?source=${source}`
        : ALL_VIDEOGAMES_URL;
    return async (dispatch) => {
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
            return onSuccess(json);

        } catch (error) {
            return onError(error);
        }
    };
}

export function getDetails(id) {
    return async function (dispatch) {
        const response = await fetch(`${VIDEOGAME_URL}${id}`)
        dispatch({
            type: GET_DETAILS,
            payload: response
        })
    };
}

export function postVideogame(game) {
    return async function (dispatch) {
        const response = await fetch(VIDEOGAME_URL, {
            method: "POST",
            body: game
        });
        dispatch({
            type: POST_VIDEOGAME,
            payload: response
        });
    };
}

export function getGenres() {
    return async (dispatch) => {
        function onSuccess(success) {
            console.log(success);
            dispatch({
                type: GET_GENRES,
                payload: success
            });
        }
        function onError(error) {
            console.error(error);
        }
        try {
            const response = await fetch(GENRES_URL);
            const json = await response.json();
            return onSuccess(json);

        } catch (error) {
            return onError(error);
        }
    };
}