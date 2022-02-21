import React from "react";
import { Link } from "react-router-dom";
import Genre from "./Genre";
import s from "./Card.module.css";

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
                    {props.game.description && (
                        <h6 className={s.secondaryText}>
                            {props.game.description}
                        </h6>
                    )}
                </div>
                <button className={s.primaryText}> <Link to={``}></Link> see details</button>
                <div className={s.details}>
                    {props.game.genres.map((genre) => {
                        return <Genre name={genre.name} key={genre.id}></Genre>;
                    })}
                </div>
            </div>
        </div>
    );
}
