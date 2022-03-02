import React, { useState, useEffect } from "react";

import { getDetails, resetErrorMessages, setLoading } from "../actions";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";

import Loader from "./Loader";

import s from "./Detail.module.css";
import cs from "./Card.module.css";
import Genre from "./Genre";
import Button from "./Button";

function mapStateToProps(state) {
    return {
        gameData: state.gameDetail, // redux-oriented
        loading: state.loading,
        errorMessages: state.errorMessages,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        setStateLoading: (isLoading) => dispatch(setLoading(isLoading)),
        getDetails: (id) => dispatch(getDetails(id)),
        resetErrors: () => dispatch(resetErrorMessages()),
    };
}

function Detail(props) {
    const [localError, setLocalError] = useState(false);
    // const [gameData, setGameData] = useState({}); // redux-oriented
    let searchParams = useParams();

    useEffect(() => {
        props.setStateLoading(true);
        window.scrollTo({ behavior: "smooth", top: "0px" });
        async function fetchData() {
            await props.getDetails(searchParams.id); // redux-oriented
            // setGameData(await getDetails(searchParams.id));
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (props.gameData && (props.gameData.name || props.errorMessages.length > 0)) {
            setLoading(false);
        }
        if (props.errorMessages.length > 0) {
            setLocalError(true);
            props.resetErrors();
        }
        props.setStateLoading(false);
    }, [props, props.gameData]);

    if (props.loading) {
        return <Loader></Loader>;
    } else if (localError) {
        return (
            <div className={s.detail}>
                <h2>No encontramos lo que buscabas :/</h2>
                <p>Intenta otra vez</p>
                <button className="button">
                    <Link to="/home">Regresar</Link>
                </button>
            </div>
        );
    } else {
        return (
            <div className={s.detail}>
                <div className={s.name}>
                    <h2>{props.gameData.name}</h2>
                    <div className={s.heroImage}>
                        <img src={props.gameData.image} alt="Videogame" />
                    </div>
                    <div className={s.releaseAndRating}>
                        <div>fecha de lanzamiento: {props.gameData.launchDate}</div>
                        <div className={s.rating}>
                            rating: {props.gameData.rating}
                        </div>
                    </div>
                </div>
                {props.gameData.description && (
                    // https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml
                    // API gives description as HTML (with its tags) so we use this React
                    // property to add it without needing preprocessing
                    <div
                        dangerouslySetInnerHTML={{
                            __html: props.gameData.description,
                        }}
                        className={s.description}
                    ></div>
                )}
                {props.gameData.platforms && (
                    <div className={cs.details}>
                        <h3>¿Dónde puedes jugar {props.gameData.name}?</h3> <br />
                        {props.gameData.platforms.map((platform) => {
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
                    <Button
                        id="detailGoBack"
                        to="/home"
                        text="Regresar"
                    ></Button>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
