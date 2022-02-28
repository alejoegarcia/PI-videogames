import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getVideogames } from "../actions";

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

export default function Form({
    setFilters,
    onSourceChange,
    onGenresChange,
    onSortingChange,
    filters,
    genres,
    userSearch,
    setUserSearch,
    setLoading,
}) {
    const dispatch = useDispatch();

    function handleChange(e) {
        setUserSearch(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        console.log(e.target.value, userSearch);
        dispatch(getVideogames(userSearch));
    }
    return (
        <div>
            <form action="#">
                <div>
                    <input
                        type="text"
                        id="gameNameInput"
                        autoComplete="off"
                        value={userSearch}
                        onChange={(e) => handleChange(e)}
                    />
                    <button type="submit" onClick={handleSubmit}>
                        Buscar
                    </button>
                    <button type="submit" onClick={handleSubmit}>
                        Borrar búsqueda
                    </button>
                </div>
                <button type="button" onClick={() => setFilters([])}>
                    Limpiar filtros
                </button>
                <div className="source">
                    <select
                        onChange={onSourceChange}
                        id="change-sort"
                        name="source"
                    >
                        <option value={SOURCE_ALL}>Todos</option>
                        <option value={SOURCE_API}>Solo API</option>
                        <option value={SOURCE_DB}>Solo BBDD</option>
                    </select>
                </div>
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
                <div className="sort">
                    <select
                        onChange={onSortingChange}
                        id="change-sort"
                        name="order"
                    >
                        <option value={0}>Ordenar</option>
                        <option value={ORDER_A_Z}>A-Z</option>
                        <option value={ORDER_Z_A}>Z-A</option>
                        <option value={ORDER_1_5}>1-5</option>
                        <option value={ORDER_5_1}>5-1</option>
                    </select>
                </div>
            </form>
        </div>
    );
}
