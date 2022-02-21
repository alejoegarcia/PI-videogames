import { React, useEffect, useState } from "react";

import { getGenres, getVideogames } from "../actions";
import { connect } from "react-redux";

// component import
import Card from "./Card";
import Button from "./Button";

// style import
import s from "./Cards.module.css";

const gamesPerPage = 15;
const ORDER_ASC = "ASC";
const ORDER_DESC = "DESC";

function mapStateToProps(state) {
    return {
        games: state.allGames,
        genres: state.genres,
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
    // const [sort, setSort] = useState(ORDER_ASC);

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
        // onSortingChange();
    }, [data]);

    useEffect(() => {
        let filtered = useAllGames || filters.length === 0 ? props.games : data;
        for (let filter of filters) {
            filtered = filtered.filter((game) => {
                if (game.genres.filter((g) => g.name === filter).length === 0) {
                    return false;
                }
                return true;
            });
        }
        setData(filtered);
    }, [filters]);

    // pagination functions
    function getPaginatedData() {
        const gamesPerPage = 15;
        const startIndex = currentPage * gamesPerPage; /* - gamesPerPage */
        const endIndex = startIndex + gamesPerPage;
        return data.slice(startIndex, endIndex);
        // setData(props.games.slice(startIndex, endIndex));
    }

    function getPagination() {
        const pages = Math.ceil(data.length / gamesPerPage);
        return [...Array(pages).keys()];
    }

    function setNextPage() {
        console.log(data.length, currentPage);
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
            console.log(
                "f",
                e.target.value,
                filters.filter((f) => f !== e.target.value)
            );
            setUseAllGames(true);
            setFilters(filters.filter((f) => f !== e.target.value));
        } else {
            setUseAllGames(false);
            setFilters([...filters, e.target.value]);
        }
    }

    function onSortingChange(e) {
        // create a different object in memory via destructuring so React picks up the state change and also triggers useEffect
        let backup = [...data].sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        if (e.target.value === ORDER_ASC) {
            setData(backup);
        } else {
            setData(backup.reverse());
        }
        console.log("bup", backup);
    }

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
                            <option value={ORDER_ASC} defaultChecked={true}>Ascendente</option>
                            <option value={ORDER_DESC}>Descendente</option>
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
