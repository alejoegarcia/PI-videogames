import React, { useState, useEffect } from "react";

import { getDetails } from "../actions";
import { useParams } from "react-router-dom";
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
                <div className={s.heroImage}>
                    <img src={props.game.image} alt="Videogame" />
                </div>
                <div className={s.name}>
                    <h2>{props.game.name}</h2>
                    <div className={s.releaseAndRating}>
                        <div>{props.game.launchDate}</div>
                        <div>{props.game.rating}</div>
                    </div>
                </div>
                {props.game.description && (
                    // https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml
                    <div
                        dangerouslySetInnerHTML={{
                            __html: props.game.description,
                        }}
                    ></div>
                )}
                {props.game.platforms && (
                    <div className={cs.details}>
                        <h3>¿Dónde puedes jugar {props.game.name}?</h3> <br />
                        {props.game.platforms.map((platform) => {
                            console.log(platform);
                            return (
                                <Genre
                                    name={platform.platform.name}
                                    key={`pl-${platform.platform.name}`}
                                ></Genre>
                            );
                            // return <div key={`pl-${platform.platform.name}`} className="platform">{platform.platform.name}</div>
                        })}
                    </div>
                )}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
