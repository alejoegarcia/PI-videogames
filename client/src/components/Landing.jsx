import React from "react";
import Button from "./Button";

import s from "./Landing.module.css";

export default function Landing() {
    return (
        <div className={s.landing}>
            <Button
            className="button"
                id="go-home"
                to="/home"
                text="Ver los juegos"
            />
        </div>
    );
}
