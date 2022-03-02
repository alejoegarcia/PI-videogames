require('dotenv').config();
const BASE_URL = process.env.REACT_APP_API || "http://localhost:3001/";
const ALL_VIDEOGAMES_URL = `${BASE_URL}videogames`;
const VIDEOGAME_URL = `${BASE_URL}videogame/`;
const GENRES_URL = `${BASE_URL}genres/`;

export const SET_LOADING = "SET_LOADING";
export const GET_VIDEOGAMES = "GET_VIDEOGAMES";
export const GET_DETAILS = "GET_DETAILS";
export const POST_VIDEOGAME = "POST_VIDEOGAME";
export const GET_GENRES = "GET_GENRES";
export const ADD_ERROR = "ADD_ERROR";
export const SET_SOURCE = "SET_SOURCE";
export const SET_FILTERS = "SET_FILTERS";
export const SET_SORT_ALPHA = "SET_SORT_ALPHA";
export const SET_SORT_RATING = "SET_SORT_RATING";
export const RESET_ERRORS = "RESET_ERRORS";
export const RESET_SUCCESS = "RESET_SUCCESS";

export function setLoading(isLoading) {
    return {
        type: SET_LOADING,
        payload: isLoading
    };
}

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
            dispatch({
                type: ADD_ERROR,
                payload: error
            });
        }
        try {
            const response = await fetch(url);
            const json = await response.json();
            if (response.ok) {
                return onSuccess(json);
            } else {
                return onError(json.error);
            }
        } catch (error) {
            return onError(error);
        }
    };
}

/* export async function getDetails(id) {
    try {
        const response = await fetch(`${VIDEOGAME_URL}${id}`);
        const json = await response.json();
        if (response.ok) {
            console.log("detail ok", json);
            return json;
        } else {
            return json.error;
        }
    } catch (error) {
        return error;
    }
}; */
export function getDetails(id) {
    return async (dispatch) => {
        function onSuccess(success) {
            dispatch({
                type: GET_DETAILS,
                payload: success
            })
        }
        function onError(error) {
            dispatch({
                type: ADD_ERROR,
                payload: error
            });
        }
        try {
            const response = await fetch(`${VIDEOGAME_URL}${id}`);
            const json = await response.json();
            if (response.ok) {
                return onSuccess(json);
            } else {
                return onError(json.error);
            }

        } catch (error) {
            return onError(error);
        }
    };
}

export function postVideogame(game) {
    return async (dispatch) => {
        function onSuccess(success) {
            dispatch({
                type: POST_VIDEOGAME,
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

// for Cards and ViewForm
export function setGamesSource(newSource) {
    return {
        type: SET_SOURCE,
        payload: newSource
    };
}

export function setFilters(newFilters) {
    return {
        type: SET_FILTERS,
        payload: newFilters
    };
}

export function setSortAlphabetically(newSort) {
    return {
        type: SET_SORT_ALPHA,
        payload: newSort
    };
}

export function setSortByRating(newSort) {
    return {
        type: SET_SORT_RATING,
        payload: newSort
    };
}

export function resetErrorMessages() {
    return {
        type: RESET_ERRORS
    };
}
export function resetSuccessMessages() {
    return {
        type: RESET_SUCCESS
    };
}