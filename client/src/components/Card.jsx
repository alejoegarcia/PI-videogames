import React from "react";
import { Link } from "react-router-dom";
import s from "./Card.module.css";

export default function Card(props) {
    return (
        <div class="card">
            <div class="card-img">
                <img src={props.game.image} alt="Videogame" />
            </div>
            <div class="desc">
                <h6 class="primary-text">{props.game.name}</h6>
                <h6 class="secondary-text">{props.game.description}</h6>
            </div>
            <button class="primary-text">see details</button>
            <div class="details">
                {/* TODO: export this to Genres.jsx */}
                <div class="rating">
                    <h6 class="secondary-text">Action</h6>
                    <hr class="divider" />
                </div>
                <div class="rating">
                    <h6 class="secondary-text">Adventure</h6>
                    <hr class="divider" />
                </div>
                <div class="rating">
                    <h6 class="secondary-text">Arcade</h6>
                    <hr class="divider" />
                </div>
                {/* TODO: export this to Genres.jsx */}
            </div>
        </div>
    );
}
