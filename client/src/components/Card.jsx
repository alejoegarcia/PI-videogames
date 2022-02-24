import React from "react";
import { Link } from "react-router-dom";
import Genre from "./Genre";
import s from "./Card.module.css";

export default function Card({ game }) {
    return (
        <div className={s.card}>
            <div className={s.cardImage}>
                <img
                    src={game.image}
                    alt="Videogame"
                    height="auto"
                    width="100px"
                />
            </div>
            <div className={s.cardInfo}>
                <div className={s.desc}>
                    <h6 className={s.primaryText}>{game.name}</h6>
                    <h6 className={s.secondaryText}>{game.rating}</h6>
                    <hr className={s.divider} />
                </div>
                <button>
                    {" "}
                    <Link
                        to={`/videogame/${game.id}`}
                        className={s.primaryText}
                    >
                        see details
                    </Link>
                </button>
                <div className={s.details}>
                    {game.genres.map((genre) => {
                        return <Genre name={genre.name} key={genre.id}></Genre>;
                    })}
                </div>
            </div>
        </div>
    );
}
