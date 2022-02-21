import React from "react";

import s from "./Detail.module.css";
export default function Detail(props) {
    if (props.game) {
        return (
            <div className={s.detail}>
                <div className={s.image}>
                    <img src={props.game.image} alt="Videogame" />
                </div>
                <div className={s.name}>
                    <h2>{props.game.name}</h2>
                    <aside>{props.game.rating}</aside>
                </div>
                {props.game.description && <div>{props.game.description}</div>}
            </div>
        );
    }
}
