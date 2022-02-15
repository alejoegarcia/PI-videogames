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

export default async function rootReducer(state = initialState, action) {
    switch (action.type) {
        case GET_VIDEOGAMES:
            if (initialState.gamesFromAPI.length === 0 || action.payload) {
                if (action.payload === "local") {
                    return {
                        ...state,
                        gamesFromDB: await fetch("http://localhost:3001/videogames?source=local")
                    };
                } else if (action.payload === "external") {
                    return {
                        ...state,
                        gamesFromAPI: await fetch("http://localhost:3001/videogames?source=external")
                    };
                } else {
                    return {
                        ...state,
                        allGames: await fetch("http://localhost:3001/videogames")
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