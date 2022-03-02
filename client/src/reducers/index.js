import {
    SET_LOADING,
    GET_VIDEOGAMES,
    GET_DETAILS,
    POST_VIDEOGAME,
    GET_GENRES,
    ADD_ERROR,
    RESET_ERRORS,
    RESET_SUCCESS,
    SET_SOURCE,
    SET_FILTERS,
    SET_SORT_ALPHA,
    SET_SORT_RATING
} from "../actions/index.js";

const initialState = {
    loading: true,
    allGames: [],
    // gameDetail: {},
    genres: [],
    errorMessages: [],
    successMessage: undefined,
    source: undefined,
    filters: [],
    sortAlpha: undefined,
    sortRating: undefined
};

export default function rootReducer(state = initialState, action) {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case GET_VIDEOGAMES:
            if (initialState.allGames.length === 0 || action.payload) {
                return {
                    ...state,
                    allGames: action.payload
                };
            }
            return { ...state };
        case GET_DETAILS:
            return {
                ...state,
                gameDetail: action.payload
            };
        case POST_VIDEOGAME:
            let newState = { ...state, successMessage: "¡Listo, ya agregaste el videojuego a nuestra base de datos!" };
            newState.allGames.push(action.payload);
            return newState;
        case GET_GENRES:
            return {
                ...state,
                genres: action.payload
            };
        case ADD_ERROR:
            return {
                ...state,
                errorMessages: action.payload
            };
        case RESET_ERRORS:
            return {
                ...state,
                errorMessages: []
            };
        case RESET_SUCCESS:
            return {
                ...state,
                successMessage: undefined
            };
        case SET_SOURCE:
            return {
                ...state,
                source: action.payload
            };
        case SET_FILTERS:
            return {
                ...state,
                filters: action.payload
            };
        case SET_SORT_ALPHA:
            return {
                ...state,
                sortAlpha: action.payload
            };
        case SET_SORT_RATING:
            return {
                ...state,
                sortRating: action.payload
            };
        default:
            return { ...state };
    }
}