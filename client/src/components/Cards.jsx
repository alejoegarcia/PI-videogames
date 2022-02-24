import { React, useEffect, useState } from "react";

import { getGenres, getVideogames } from "../actions";
import { connect } from "react-redux";

// component import
import Card from "./Card";
import Button from "./Button";

// style import
import s from "./Cards.module.css";

const gamesPerPage = 15;
const ORDER_A_Z = "ASC_ALPHA";
const ORDER_Z_A = "DESC_ALPHA";
const ORDER_1_5 = "ASC_RATING";
const ORDER_5_1 = "DESC_RATING";

function mapStateToProps(state) {
    return {
        games: state.allGames,
        genres: state.genres,
        gamesSource: state.gamesSource,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getVideogames: () => dispatch(getVideogames()),
        getGenres: () => dispatch(getGenres()),
    };
}

function Cards(props) {
    const [currentPage, setCurrentPage] = useState(0);
    const [data, setData] = useState(props.games);
    const [filters, setFilters] = useState([]);
    const [useAllGames, setUseAllGames] = useState(true);
    const [sortAlphabetically, setSortAlphabetically] = useState(undefined);
    const [sortByRating, setSortByRating] = useState(undefined);

    useEffect(() => {
        async function fetchData() {
            await props.getVideogames();
            await props.getGenres();
        }
        if (!props.games.length) {
            fetchData();
            setData(props.games);
        }
    }, []);

    useEffect(() => {
        setData(props.games);
    }, [props.games]);

    useEffect(() => {
        window.scrollTo({ behavior: "smooth", top: "0px" });
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(0);
        // ? is this needed?
        /* setFilters([]);
        setSortAlphabetically(undefined); */
        // ? is this needed?
        // onSortingChange();
    }, [data]);

    useEffect(() => {
        // setData(filterData());
        filterAndSort();
    }, [filters, sortAlphabetically, sortByRating]);

    function filterAndSort() {
        setData(sortData(filterData()));
    }
    function filterData() {
        let filtered =
            useAllGames || filters.length === 0 ? props.games : [...data];
        for (let filter of filters) {
            filtered = filtered.filter((game) => {
                if (game.genres.filter((g) => g.name === filter).length === 0) {
                    return false;
                }
                return true;
            });
        }
        return filtered;
    }

    function sortData(argsData) {
        // create a different object in memory via destructuring so React picks up the state change and also triggers useEffect
        console.log(sortAlphabetically, sortByRating);
        if (sortAlphabetically !== undefined || sortByRating !== undefined) {
            const sortBy = sortAlphabetically ? "name" : "rating";
            let backup = [...argsData];
            if (sortBy === "name") {
                backup.sort((a, b) =>
                    a[sortBy]
                        .toLowerCase()
                        .localeCompare(b[sortBy].toLowerCase())
                );
            } else {
                backup.sort((a, b) => a[sortBy] - b[sortBy]);
            }
            if (
                sortAlphabetically === ORDER_Z_A ||
                sortByRating === ORDER_5_1
            ) {
                backup.reverse();
            }
            return backup;
        }
        return argsData;
    }

    // pagination functions
    function getPaginatedData() {
        const gamesPerPage = 15;
        const startIndex = currentPage * gamesPerPage; /* - gamesPerPage */
        const endIndex = startIndex + gamesPerPage;
        return data.slice(startIndex, endIndex);
    }

    function getPagination() {
        const pages = Math.ceil(data.length / gamesPerPage);
        return [...Array(pages).keys()];
    }

    function setNextPage() {
        setCurrentPage((page) => page + 1);
    }
    function setPreviousPage() {
        setCurrentPage((page) => page - 1);
    }
    function setPageNumber(e) {
        setCurrentPage(parseInt(e));
    }

    function onGenresChange(e) {
        if (filters.includes(e.target.value)) {
            setUseAllGames(true);
            setFilters(filters.filter((f) => f !== e.target.value));
        } else {
            setUseAllGames(false);
            setFilters([...filters, e.target.value]);
        }
    }

    function onSortingChange(e) {
        console.log(e.target.value);
        if (e.target.value !== "0") {
            if (e.target.value === ORDER_A_Z || e.target.value === ORDER_Z_A) {
                setSortAlphabetically(e.target.value);
                setSortByRating(undefined);
            } else {
                setSortByRating(e.target.value);
                setSortAlphabetically(undefined);
            }
        }
    }

    // TODO: change game source, check if gfDB or gfAPI is already populated
    // function onSourceChange(e) {
    //     if (e.target.value !== "0") {
    //         setGamesSource(e.target.value);
    //     }
    // }

    if (props.games.length > 0 && props.genres.length > 0) {
        getPaginatedData();
        return (
            <div>
                <div className="options">
                    <div className="filters">
                        <form action="#">
                            <button
                                type="button"
                                onClick={() => setFilters([])}
                            >
                                Limpiar filtros
                            </button>
                            <select
                                id="genres-picker"
                                name="genres-picker"
                                multiple={true}
                                value={filters}
                                onChange={(e) => onGenresChange(e)}
                            >
                                {props.genres.map((genre) => {
                                    return (
                                        <option
                                            key={genre.id}
                                            value={genre.name}
                                        >
                                            {genre.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </form>
                    </div>
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
                </div>
                <div className={s.cards}>
                    {getPaginatedData().map((game) => (
                        <Card game={game} key={game.id}></Card>
                    ))}
                </div>
                <div className="paginationWrapper">
                    <div className={s.pagination}>
                        {getPagination().map((_, ix) => {
                            return (
                                <div
                                    key={`pagination-${ix}`}
                                    className={s.pagBtn}
                                >
                                    {currentPage !== 0 && ix === currentPage && (
                                        <div className={s.pagBtn}>
                                            <Button
                                                id="prev"
                                                key={`prev-${ix}`}
                                                click={setPreviousPage}
                                                text="Anterior"
                                            ></Button>
                                        </div>
                                    )}
                                    <Button
                                        id={`pagination-${ix}`}
                                        className={s.numberBtn}
                                        key={`pag-btn-${ix}`}
                                        click={() => setPageNumber(ix)}
                                        text={ix}
                                    ></Button>
                                    {data.length > gamesPerPage &&
                                        ix === currentPage && (
                                            <div className={s.pagBtn}>
                                                <Button
                                                    id="next"
                                                    key={`next-${ix}`}
                                                    click={setNextPage}
                                                    text="Siguiente"
                                                ></Button>
                                            </div>
                                        )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    } else {
        return <div>Loading...</div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cards);
