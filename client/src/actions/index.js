const BASE_URL = "http://localhost:3001/";
const ALL_VIDEOGAMES_URL = `${BASE_URL}videogames`;
const VIDEOGAME_URL = `${BASE_URL}videogame/`;
const GENRES_URL = `${BASE_URL}genres/`;

export const GET_VIDEOGAMES = "GET_VIDEOGAMES";
export const GET_DETAILS = "GET_DETAILS";
export const POST_VIDEOGAME = "POST_VIDEOGAME";
export const GET_GENRES = "GET_GENRES";
export const ADD_ERROR = "ADD_ERROR";

export function getVideogames(name) {
    const url = name ?
        `${ALL_VIDEOGAMES_URL}?name=${name}`
        : ALL_VIDEOGAMES_URL;

    return async (dispatch) => {
        function onSuccess(success) {
            dispatch({
                type: GET_VIDEOGAMES,
                payload: success
            });
        }
        function onError(error) {
            console.error(error);
            dispatch({
                type: ADD_ERROR,
                payload: error
            });
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
    return async (dispatch) => {
        function onSuccess(success) {
            dispatch({
                type: GET_DETAILS,
                payload: success
            })
        }
        function onError(error) {
            console.error(error);
            dispatch({
                type: ADD_ERROR,
                payload: error
            });
        }
        try {
            const response = await fetch(`${VIDEOGAME_URL}${id}`);
            const json = await response.json();
            return onSuccess(json);

        } catch (error) {
            return onError(error);
        }
    };
}

export function postVideogame(game) {
    return async (dispatch) => {
        function onSuccess(success) {
            console.log(success);
            dispatch({
                type: POST_VIDEOGAME,
                payload: success
            });
        }
        function onError(error) {
            console.error("onerror", error);
            dispatch({
                type: ADD_ERROR,
                payload: error
            });
        }
        try {
            const response = await fetch(VIDEOGAME_URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "game": game })
            });
            const json = await response.json();
            if (response.ok) {
                return onSuccess(json);
            } else {
                return onError(json.error);
            }

        } catch (error) {
            console.log("will throw error");
            return onError(error);
        }
    };
}

export function getGenres() {
    return async (dispatch) => {
        function onSuccess(success) {
            dispatch({
                type: GET_GENRES,
                payload: success
            });
        }
        function onError(error) {
            dispatch({
                type: ADD_ERROR,
                payload: error
            });
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