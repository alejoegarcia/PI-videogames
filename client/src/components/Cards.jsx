import { React, useEffect, useState } from "react";

import { getGenres, getVideogames } from "../actions";
import { connect } from "react-redux";

// component import
import Card from "./Card";
import Button from "./Button";

// style import
import s from "./Cards.module.css";
import Form from "./ViewForm";

// constants import
import {
    gamesPerPage,
    ORDER_1_5,
    ORDER_5_1,
    ORDER_A_Z,
    ORDER_Z_A,
    SOURCE_API,
    SOURCE_DB,
} from "../assets/constants";

function mapStateToProps(state) {
    return {
        games: state.allGames,
        genres: state.genres,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getVideogames: (source, name) => dispatch(getVideogames(source, name)),
        getGenres: () => dispatch(getGenres()),
    };
}

function Cards(props) {
    const [currentPage, setCurrentPage] = useState(0);
    const [data, setData] = useState(props.games);
    const [filters, setFilters] = useState([]);
    const [sortAlphabetically, setSortAlphabetically] = useState(undefined);
    const [sortByRating, setSortByRating] = useState(undefined);
    const [gamesSource, setGamesSource] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [userSearch, setUserSearch] = useState("");

    useEffect(() => {
        /* async function fetchData() {
            await props.getVideogames();
            await props.getGenres();
        }
        if (!props.games.length) {
            fetchData();
            // setData(props.games);
        } */
        setData(props.games);
    }, []);

    /* useEffect(() => {
        setData(props.games);
    }, [props.games]); */

    useEffect(() => {
        window.scrollTo({ behavior: "smooth", top: "0px" });
    }, [currentPage]);

    useEffect(() => {
        if (loading && data.length > 0) setLoading(!loading);
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
    }, [props.games, filters, sortAlphabetically, sortByRating, gamesSource]);

    function filterAndSort() {
        setData(sortData(filterData(excludeDataSource())));
    }

    function excludeDataSource() {
        let newData = [...props.games];
        if (gamesSource === SOURCE_DB) {
            newData = newData.filter((game) => isNaN(game.id));
        } else if (gamesSource === SOURCE_API) {
            newData = newData.filter((game) => !isNaN(game.id));
        }
        return newData;
    }
    function filterData(argsData) {
        let filtered =
            // useAllGames || filters.length === 0 ? props.games : [...argsData];
            argsData;
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
        console.log(sortAlphabetically, sortByRating, gamesSource);
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
            setFilters(filters.filter((f) => f !== e.target.value));
        } else {
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

    function onSourceChange(e) {
        if (e.target.value !== "0") {
            setGamesSource(e.target.value);
        } else {
            setGamesSource(undefined);
        }
    }

    // if (props.games.length > 0 && props.genres.length > 0) {
    if (loading) {
        return <div>Loading...</div>;
    } else {
        const paginatedData = getPaginatedData();
        const totalPages = getPagination();
        return (
            <div>
                <div className="options">
                    <div className="filter-sort-form">
                        <Form
                            setFilters={setFilters}
                            onSourceChange={onSourceChange}
                            onGenresChange={onGenresChange}
                            onSortingChange={onSortingChange}
                            genres={props.genres}
                            filters={filters}
                            setLoading={setLoading}
                            userSearch={userSearch}
                            setUserSearch={setUserSearch}
                        />
                    </div>
                </div>
                <div className={s.cards}>
                    {paginatedData.map((game) => (
                        <Card game={game} key={game.id}></Card>
                    ))}
                </div>
                <div className="paginationWrapper">
                    <div className={s.pagination}>
                        {totalPages.map((_, ix) => {
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
                                    {ix === currentPage &&
                                        ix + 1 !== totalPages.length && (
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cards);
