import { React, useEffect, useState } from "react";

import {
    getGenres,
    getVideogames,
    setFilters,
    setGamesSource,
    setSortAlphabetically,
    setSortByRating,
} from "../actions";
import { connect } from "react-redux";

// component import
import Card from "./Card";
import Button from "./Button";
import Loader from "./Loader";

// style import
import s from "./Cards.module.css";
import Form from "./ViewForm";

// constants import
import {
    gamesPerPage,
    ORDER_5_1,
    ORDER_Z_A,
    SOURCE_API,
    SOURCE_DB,
} from "../assets/constants";

function mapStateToProps(state) {
    return {
        games: state.allGames,
        gamesSource: state.source,
        filters: state.filters,
        sortAlpha: state.sortAlpha,
        sortRating: state.sortRating,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getVideogames: () => dispatch(getVideogames()),
        getGenres: () => dispatch(getGenres()),
        setGamesSource: (source) => dispatch(setGamesSource(source)),
        setFilters: (filters) => dispatch(setFilters(filters)),
        setSortAlphabetically: (sort) => dispatch(setSortAlphabetically(sort)),
        setSortByRating: (sort) => dispatch(setSortByRating(sort)),
    };
}

function Cards({
    games,
    gamesSource,
    filters,
    sortAlpha,
    sortRating,
    getVideogames,
}) {
    const [currentPage, setCurrentPage] = useState(0);
    const [data, setData] = useState(games);
    const [loading, setLoading] = useState(true);
    const [userSearch, setUserSearch] = useState("");

    async function fetchData() {
        await getVideogames();
    }

    useEffect(() => {
        /*
        if (!props.games.length) {
            fetchData();
            // setData(props.games);
        } */
        setData(games);
    }, []);

    useEffect(() => {
        window.scrollTo({ behavior: "smooth", top: "0px" });
    }, [currentPage]);

    useEffect(() => {
        if (loading && (data.length > 0 || data.error)) setLoading(!loading);
        setCurrentPage(0);
    }, [data]);

    useEffect(() => {
        if (games.error) {
            alert("No encontramos lo que buscabas :/");
            fetchData();
        } else {
            setData(sortData(filterData(excludeDataSource())));
        }
    }, [games, filters, sortAlpha, sortRating, gamesSource]);

    function excludeDataSource() {
        let newData = [...games];
        if (gamesSource === SOURCE_DB) {
            newData = newData.filter((game) => isNaN(game.id));
        } else if (gamesSource === SOURCE_API) {
            newData = newData.filter((game) => !isNaN(game.id));
        }
        return newData;
    }
    function filterData(argsData) {
        let filtered = argsData;
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
        if (sortAlpha !== undefined || sortRating !== undefined) {
            const sortBy = sortAlpha ? "name" : "rating";
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
            if (sortAlpha === ORDER_Z_A || sortRating === ORDER_5_1) {
                backup.reverse();
            }
            return backup;
        }
        return argsData;
    }

    // pagination functions
    function getPaginatedData() {
        const gamesPerPage = 15;
        const startIndex = currentPage * gamesPerPage;
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

    if (loading) {
        return <Loader></Loader>;
    } else if (data.length === 0) {
        return (
            <div>
                <Form
                    setLoading={setLoading}
                    userSearch={userSearch}
                    setUserSearch={setUserSearch}
                />
                <h2>
                    No hay juegos que coincidan con los filtros que has agregado
                    :/
                </h2>
                <p>Intenta quitar algunos</p>
            </div>
        );
    } else {
        const paginatedData = getPaginatedData();
        const totalPages = getPagination();
        return (
            <div>
                <Form
                    setLoading={setLoading}
                    userSearch={userSearch}
                    setUserSearch={setUserSearch}
                />
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
                                                to={setPreviousPage}
                                                text="Anterior"
                                                click={true}
                                            ></Button>
                                        </div>
                                    )}
                                    <Button
                                        id={`pagination-${ix}`}
                                        className={s.numberBtn}
                                        key={`pag-btn-${ix}`}
                                        to={() => setPageNumber(ix)}
                                        text={ix}
                                        disabled={ix === currentPage}
                                        click={true}
                                    ></Button>
                                    {ix === currentPage &&
                                        ix + 1 !== totalPages.length && (
                                            <div className={s.pagBtn}>
                                                <Button
                                                    id="next"
                                                    key={`next-${ix}`}
                                                    to={setNextPage}
                                                    text="Siguiente"
                                                    click={true}
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
