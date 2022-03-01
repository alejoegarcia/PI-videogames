import React, { useState, useEffect } from "react";

import { getDetails } from "../actions";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";

import s from "./Detail.module.css";
import cs from "./Card.module.css";
import Genre from "./Genre";

function mapStateToProps(state) {
    return {
        game: state.gameDetail,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        getDetails: (id) => dispatch(getDetails(id)),
    };
}

function Detail(props) {
    const [loading, setLoading] = useState(true);
    let searchParams = useParams();

    useEffect(() => {
        window.scrollTo({ behavior: "smooth", top: "0px" });
        async function fetchData() {
            await props.getDetails(searchParams.id);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (props.game && props.game.name) {
            setLoading(false);
            console.log(props.game);
        }
    }, [props]);

    if (loading) {
        return <div>Loading...</div>;
    } else {
        return (
            <div className={s.detail}>
                <div className={s.name}>
                    <h2>{props.game.name}</h2>
                    <div className={s.heroImage}>
                        <img src={props.game.image} alt="Videogame" />
                    </div>
                    <div className={s.releaseAndRating}>
                        <div>{props.game.launchDate}</div>
                        <div className={s.rating}>{props.game.rating}</div>
                    </div>
                </div>
                {props.game.description && (
                    // https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml
                    // API gives description as HTML (with its tags) so we use this React
                    // property to add it without needing preprocessing
                    <div
                        dangerouslySetInnerHTML={{
                            __html: props.game.description,
                        }}
                        className={s.description}
                    ></div>
                )}
                {props.game.platforms && (
                    <div className={cs.details}>
                        <h3>¿Dónde puedes jugar {props.game.name}?</h3> <br />
                        {props.game.platforms.map((platform) => {
                            if (typeof platform === "string") {
                                return (
                                    <Genre
                                        name={platform}
                                        key={`pl-${platform}`}
                                    ></Genre>
                                );
                            } else {
                                return (
                                    <Genre
                                        name={platform.platform.name}
                                        key={`pl-${platform.platform.name}`}
                                    ></Genre>
                                );
                            }
                        })}
                    </div>
                )}
                <div className={s.btnWrapper}>
                    <button className="button">
                        <Link to="/home">Regresar</Link>
                    </button>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
