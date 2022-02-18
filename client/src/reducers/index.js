import {
    GET_VIDEOGAMES,
    GET_DETAILS,
    POST_VIDEOGAME
} from "../actions/index.js";

const initialState = {
    allGames: [],
    gamesFromDB: [],
    gamesFromAPI: [],
    gameDetail: {}
};

export default function rootReducer(state = initialState, action) {
    switch (action.type) {
        case GET_VIDEOGAMES:
            if (initialState.gamesFromAPI.length === 0 || action.payload) {
                if (action.payload === "local") {
                    return {
                        ...state,
                        gamesFromDB: action.payload
                    };
                } else if (action.payload === "external") {
                    return {
                        ...state,
                        gamesFromAPI: action.payload
                    };
                } else {
                    return {
                        ...state,
                        allGames: action.payload
                    };
                }
            }
            return { ...state };
        case GET_DETAILS:
            return {
                ...state,
                gameDetail: action.payload
            };
        case POST_VIDEOGAME:
            let newState = { ...state };
            newState.allGames.push(action.payload);
            newState.gamesFromDB.push(action.payload);
            return newState;
        default:
            return { ...state };
    }
}