import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { postVideogame } from "../actions";

import s from "./CreateForm.module.css";

function validate(input) {
    let errors = {};
    if (!input.name) {
        errors.name = "¿Cómo se llama este juego?";
    } else if (!input.description) {
        errors.description = "¡Convénceme de jugarlo!";
    }
    if (
        input.rating &&
        (parseFloat(input.rating) < 0 || parseFloat(input.rating) > 5)
    ) {
        errors.rating = `¡No puede ser tan ${
            parseFloat(input.rating) > 5 ? "bueno" : "malo"
        }! Mantén el rating entre cero y cinco`;
    }
    if (input.launchDate) {
        const datepickerDate = new Date(input.launchDate);
        if (
            datepickerDate.getFullYear() < 1958 ||
            datepickerDate.getTime() > Date.now()
        ) {
            errors.launchDate =
                "A menos que viajes entre universos, solo podemos jugar videojuegos que salieron al mercado entre 1958 y hoy";
        }
    }
    if (!input.platforms) {
        errors.platforms = "¿Dónde puedes jugar este juego?";
    }
    return errors;
}

export default function CreateForm() {
    const dispatch = useDispatch();
    const requestError = useSelector((state) => state.errorMessages);
    const requestSuccess = useSelector((state) => state.successMessage);
    const genres = useSelector((state) => state.genres);
    const [input, setInput] = useState({
        name: "",
        description: "",
        launchDate: "",
        rating: 0,
        genres: [],
        platforms: [],
    });
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        if (input.name && Object.keys(errors).length === 0) {
            setIsFormValid(true);
        } else if (isFormValid) {
            setIsFormValid(false);
        }
        console.log(input);
    }, [input]);

    useEffect(() => {
        if (requestSuccess) {
            setInput({
                name: "",
                description: "",
                launchDate: "",
                rating: 0,
                genres: [],
                platforms: [],
            });
            alert(requestSuccess);
        }
    }, [requestSuccess]);

    const handleInputChange = function (e) {
        setErrors(
            validate({
                ...input,
                [e.target.name]: e.target.value,
            })
        );
        if (e.target.name !== "genres" && e.target.name !== "platforms") {
            setInput({
                ...input,
                [e.target.name]: e.target.value,
            });
        } else {
            if (input[e.target.name].includes(e.target.value)) {
                setInput({
                    ...input,
                    [e.target.name]: input[e.target.name].filter(
                        (el) => el.name !== e.target.name
                    ),
                });
            } else {
                setInput({
                    ...input,
                    [e.target.name]: [...input[e.target.name], e.target.value],
                });
            }
        }
    };
    function handleSubmit(e) {
        e.preventDefault();
        // setLoading(true);
        dispatch(postVideogame(input));
    }

    return (
        <div className={s.form}>
            <div>
                <label htmlFor="name">Nombre </label> <br />
                <input
                    type="text"
                    name="name"
                    id="name"
                    autoCorrect="off"
                    autoComplete="off"
                    autoFocus
                    placeholder="Nombre del juego"
                    onChange={handleInputChange}
                    required={true}
                />
                <div>{errors.name && <p>{errors.name}</p>}</div>
            </div>
            <div>
                <label htmlFor="description">Descripción </label> <br />
                <textarea
                    name="description"
                    id="desc"
                    placeholder="This super duper funny game combines a medieval atmosphere with futuristic weaponry in an attempt to bring steampunk into the games industry"
                    autoCorrect="off"
                    autoComplete="off"
                    onChange={handleInputChange}
                />
                <div>{errors.description && <p>{errors.description}</p>}</div>
            </div>
            <div>
                <label htmlFor="launchDate">Fecha de lanzamiento </label> <br />
                <input
                    type="date"
                    name="launchDate"
                    id="gameDate"
                    onChange={handleInputChange}
                />
                <div>{errors.launchDate && <p>{errors.launchDate}</p>}</div>
            </div>
            <div>
                <label htmlFor="rating">Rating </label> <br />
                <input
                    type="number"
                    name="rating"
                    id="gameRate"
                    autoComplete="off"
                    onChange={handleInputChange}
                />
                <div>{errors.rating && <p>{errors.rating}</p>}</div>
            </div>
            <div className={s.d}>
                <label htmlFor="">Géneros</label> <br />
                <div className={s.checkboxes}>
                    {genres.map((genre) => {
                        return (
                            <div className="g" key={genre.id}>
                                <input
                                    type="checkbox"
                                    id={`cbox-${genre.id}`}
                                    // className={`${s.checkbox} ${s.hiddenxsup}`}
                                    value={genre.name}
                                    name="genres"
                                    onChange={handleInputChange}
                                />
                                <label>{genre.name}</label> <br />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div>
                <label htmlFor="platforms">Plataformas </label> <br />
                <div className={s.checkboxes}>
                    <div>
                        <input
                            type="checkbox"
                            id="cbox-atari"
                            value="Atari 8-bit"
                            onChange={handleInputChange}
                        />
                        <label>Atari 8-bit</label> <br />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="cbox-dreamcast"
                            value="Dreamcast"
                            onChange={handleInputChange}
                        />
                        <label>Dreamcast</label> <br />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="cbox-gamecube"
                            value="GameCube"
                            onChange={handleInputChange}
                        />
                        <label>GameCube</label> <br />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="cbox-gameboy"
                            value="Game Boy"
                            onChange={handleInputChange}
                        />
                        <label>Game Boy</label> <br />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="cbox-nes"
                            value="NES"
                            onChange={handleInputChange}
                        />{" "}
                        <label>NES</label> <br />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="cbox-sega"
                            value="SEGA"
                            onChange={handleInputChange}
                        />{" "}
                        <label>SEGA</label> <br />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="cbox-nintendo"
                            value="Nintendo Switch"
                            onChange={handleInputChange}
                        />{" "}
                        <label>Nintendo Switch</label> <br />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="cbox-ps5"
                            value="PlayStation 5"
                            onChange={handleInputChange}
                        />{" "}
                        <label>PlayStation 5</label> <br />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="cbox-ps4"
                            value="PlayStation 4"
                            onChange={handleInputChange}
                        />{" "}
                        <label>PlayStation 4</label> <br />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="cbox-ps3"
                            value="PlayStation 3"
                            onChange={handleInputChange}
                        />{" "}
                        <label>PlayStation 3</label> <br />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="cbox-xbox"
                            value="Xbox"
                            onChange={handleInputChange}
                        />{" "}
                        <label>Xbox</label> <br />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="cbox-wii"
                            value="Wii"
                            onChange={handleInputChange}
                        />{" "}
                        <label>Wii</label> <br />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="cbox-android"
                            value="Android"
                            onChange={handleInputChange}
                        />{" "}
                        <label>Android</label> <br />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="cbox-ios"
                            value="iOS"
                            onChange={handleInputChange}
                        />{" "}
                        <label>iOS</label> <br />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="cbox-linux"
                            value="Linux"
                            onChange={handleInputChange}
                        />{" "}
                        <label>Linux</label> <br />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="cbox-macos"
                            value="macOS"
                            onChange={handleInputChange}
                        />{" "}
                        <label>macOS</label> <br />
                    </div>
                </div>
                <div>{errors.platforms && <p>{errors.platforms}</p>}</div>
            </div>
            <div>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                >
                    Agregar videojuego
                </button>
            </div>
            {requestError &&
                requestError.map((error) => {
                    return <p>{error[Object.keys(error)[0]]}</p>;
                })}
        </div>
    );
}
