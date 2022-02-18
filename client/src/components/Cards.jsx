import { React, useEffect, useState } from "react";

import { getVideogames } from "../actions";
import { connect } from "react-redux";

// component import
import Card from "./Card";

// style import
import s from "./Cards.module.css";

function mapStateToProps(state) {
    return {
        games: state.allGames,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getVideogames: () => dispatch(getVideogames())
    };
}

/* export default  */ function Cards(props) {
    const [currentPage, setCurrentPage] = useState(0);
    useEffect(() => {
        console.log("called ue");
        async function fetchData() {
            await props.getVideogames();
            // console.log(gv, typeof gv);
            // await gv();
        }
        if (!props.games.length) {
            fetchData();
        }
    }, []);

    if (props.games.length > 0) {
    return (
        <div className={s.cards}>
            {props.games[currentPage].map((game) => (
                <Card game={game} key={game.id}></Card>
            ))}
        </div>
    );
    } else {
        return (
            <div>
                Loading...
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cards);
