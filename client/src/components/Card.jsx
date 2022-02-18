import React from "react";
import { Link } from "react-router-dom";
import s from "./Card.module.css"; // TODO: see why the styles make it laggy

export default function Card(props) {
    return (
        <div className={s.card}>
            <div className={s.cardImage}>
                <img
                    src={props.game.image}
                    alt="Videogame"
                    height="auto"
                    width="100px"
                />
            </div>
            <div className={s.cardInfo}>
                <div className={s.desc}>
                    <h6 className={s.primaryText}>{props.game.name}</h6>
                    <hr className={s.divider} />
                    <h6 className={s.secondaryText}>
                        {props.game.description}
                    </h6>
                </div>
                <button className={s.primaryText}>see details</button>
                <div className={s.details}>
                    {/* {props.game.genres.map((genre) => {
                        return (
                            <div className={s.rating}>
                                <h6 className={s.secondaryText}>{genre}</h6>
                                <hr className={s.divider} />
                            </div>
                        );
                    })} */}
                </div>
            </div>
            {/* TODO: export this to Genres.jsx */}
            {/* <div className={s.rating}>
                    <h6 className={s.secondary-text}>Action</h6>
                    <hr className={s.divider} />
                </div>
                <div className={s.rating}>
                    <h6 className={s.secondary-text}>Adventure</h6>
                    <hr className={s.divider} />
                </div>
                <div className={s.rating}>
                    <h6 className={s.secondary-text}>Arcade</h6>
                    <hr className={s.divider} />
                </div> */}
            {/* TODO: export this to Genres.jsx */}
        </div>
    );
}
