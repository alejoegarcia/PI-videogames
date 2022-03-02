import React from "react";
import { connect } from "react-redux";
import {
    setLoading,
    getVideogames,
    setFilters,
    setGamesSource,
    setSortAlphabetically,
    setSortByRating,
} from "../actions";

// constants import
import {
    ORDER_1_5,
    ORDER_5_1,
    ORDER_A_Z,
    ORDER_Z_A,
    SOURCE_ALL,
    SOURCE_API,
    SOURCE_DB,
} from "../assets/constants";

import Button from "./Button";
import s from "./ViewForm.module.css";

function mapStateToProps(state) {
    return {
        loading: state.loading,
        filters: state.filters,
        genres: state.genres,
        source: state.source,
        sort: state.sortAlpha || state.sortRating,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setLoading: (isLoading) => dispatch(setLoading(isLoading)),
        getVideogames: (name) => dispatch(getVideogames(name)),
        setStateGamesSource: (source) => dispatch(setGamesSource(source)),
        setStateFilters: (filters) => dispatch(setFilters(filters)),
        setStateSortAlphabetically: (sort) =>
            dispatch(setSortAlphabetically(sort)),
        setStateSortByRating: (sort) => dispatch(setSortByRating(sort)),
    };
}

function Form({
    getVideogames,
    genres,
    filters,
    userSearch,
    setUserSearch,
    setLoading,
    source,
    setStateGamesSource,
    setStateFilters,
    sort,
    setStateSortAlphabetically,
    setStateSortByRating,
}) {
    function onGenresChange(e) {
        if (filters.includes(e.target.value)) {
            setStateFilters(filters.filter((f) => f !== e.target.value));
        } else {
            setStateFilters([...filters, e.target.value]);
        }
    }

    function onSortingChange(e) {
        if (e.target.value !== "0") {
            if (e.target.value === ORDER_A_Z || e.target.value === ORDER_Z_A) {
                setStateSortAlphabetically(e.target.value);
                setStateSortByRating(undefined);
            } else {
                setStateSortByRating(e.target.value);
                setStateSortAlphabetically(undefined);
            }
        }
    }

    function onSourceChange(e) {
        // if (e.target.value !== "0") {
            setStateGamesSource(e.target.value);
        // } else {
        //     setStateGamesSource(SOURCE_ALL);
        // }
    }

    function handleChange(e) {
        setUserSearch(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        if (e.target.id === "btnDeleteSearch") {
            setUserSearch("");
            getVideogames();
        } else {
            getVideogames(userSearch);
        }
    }
    return (
        <div className={s.viewFormWrapper}>
            <form action="#">
                <div className={s.search}>
                    <input
                        type="text"
                        id="gameNameInput"
                        autoComplete="off"
                        value={userSearch}
                        onChange={(e) => handleChange(e)}
                    />
                    <button
                        type="submit"
                        className="button"
                        onClick={handleSubmit}
                    >
                        Buscar
                    </button>
                    <button
                        type="submit"
                        className="button"
                        onClick={handleSubmit}
                        disabled={userSearch === ""}
                        id="btnDeleteSearch"
                    >
                        Borrar búsqueda
                    </button>
                </div>
                <button
                    type="button"
                    className="button resetFilters"
                    onClick={() => {
                        setUserSearch("");
                        setStateGamesSource(SOURCE_ALL);
                        setStateFilters([]);
                        setStateSortAlphabetically(undefined);
                        setStateSortByRating(undefined);
                    }}
                >
                    Limpiar filtros
                </button>
                <div className={s.filters}>
                    <div className="source">
                        <select
                            onChange={onSourceChange}
                            id="change-sort"
                            name="source"
                            value={source}
                        >
                            <option value={SOURCE_ALL}>Todos</option>
                            <option value={SOURCE_API}>Solo API</option>
                            <option value={SOURCE_DB}>Solo BBDD</option>
                        </select>
                    </div>
                    <div className="genres">
                        <select
                            id="genres-picker"
                            name="genres-picker"
                            multiple={true}
                            value={filters}
                            onChange={(e) => onGenresChange(e)}
                        >
                            {genres.map((genre) => {
                                return (
                                    <option key={genre.id} value={genre.name}>
                                        {genre.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="sort">
                        <select
                            onChange={onSortingChange}
                            id="change-sort"
                            name="order"
                            value={sort || 0}
                        >
                            <option value={0}>Ordenar</option>
                            <option value={ORDER_A_Z}>A-Z</option>
                            <option value={ORDER_Z_A}>Z-A</option>
                            <option value={ORDER_1_5}>1-5</option>
                            <option value={ORDER_5_1}>5-1</option>
                        </select>
                    </div>
                </div>
            </form>
            <div className={s.addGame}>
                <h3>Quizás quieras... </h3>
                <Button
                    style={{ "margin-left": "10px" }}
                    className="button"
                    id="btn-create"
                    to="/videogame/create"
                    text="agregar un juego"
                />
            </div>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
