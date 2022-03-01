import React from "react";
import s from "./Loader.module.css";

export default function Loader() {
    return (
        <div>
            <h2>Buscando...</h2>
            <svg viewBox="25 25 50 50" className={s.loadersvg}>
                <circle r="20" cy="50" cx="50"></circle>
            </svg>
        </div>
    );
}
