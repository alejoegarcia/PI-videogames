import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVideogames } from "../actions";

import s from "./Nav.module.css";

export default function Nav(props) {
    const [userSearch, setUserSearch] = useState("");
    const gamesSource = useSelector((state) => state.gamesSource);
    const dispatch = useDispatch();

    function handleChange(e) {
        setUserSearch(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        dispatch(getVideogames(gamesSource, userSearch));
    }

    return (
        <div className={s.nav}>
            <form className="form-container" onSubmit={(e) => handleSubmit(e)}>
                <div>
                    {/* <label className="label" htmlFor="title"> </label> */}
                    <input
                        type="text"
                        id="gameNameInput"
                        autoComplete="off"
                        value={userSearch}
                        onChange={(e) => handleChange(e)}
                    />
                </div>
                <button type="submit">Buscar</button>
            </form>
        </div>
    );
}
