import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoading, postVideogame, resetSuccessMessages } from "../actions";
import { useNavigate } from "react-router-dom";

import Button from "./Button";
import s from "./CreateForm.module.css";
import Loader from "./Loader";

const availablePlatforms = [
    "Android",
    "Atari 8-bit",
    "Dreamcast",
    "Game Boy",
    "GameCube",
    "iOS",
    "Linux",
    "macOS",
    "NES",
    "Nintendo Switch",
    "PlayStation 3",
    "PlayStation 4",
    "PlayStation 5",
    "Web",
    "Wii",
    "Xbox",
];

function validate(input) {
    let errors = {};
    if (!input.name) {
        errors.name = "¿Cómo se llama este juego?";
    }
    if (!input.description) {
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
    if (input.platforms.length === 0) {
        errors.platforms = "¿Dónde puedes jugar este juego?";
    }
    return errors;
}

export default function CreateForm() {
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.loading);
    const requestError = useSelector((state) => state.errorMessages);
    const requestSuccess = useSelector((state) => state.successMessage);
    const genres = useSelector((state) => state.genres);
    const [input, setInput] = useState({
        name: "",
        description: "",
        launchDate: "",
        rating: "",
        genres: [],
        platforms: [],
    });
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setLoading(false));
    }, []);

    useEffect(() => {
        if (input.name && Object.keys(errors).length === 0) {
            setIsFormValid(true);
        } else if (isFormValid) {
            setIsFormValid(false);
        }
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
            navigate("/home");
            alert(requestSuccess);
            dispatch(resetSuccessMessages());
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
        dispatch(setLoading(true));
        dispatch(postVideogame(input));
    }

    if (loading) {
        // console.log(history);
        return <Loader></Loader>;
    } else {
        return (
            <div>
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
                            value={input.name}
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
                            value={input.description}
                        />
                        <div>
                            {errors.description && <p>{errors.description}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="launchDate">
                            Fecha de lanzamiento{" "}
                        </label>{" "}
                        <br />
                        <input
                            type="date"
                            name="launchDate"
                            id="gameDate"
                            onChange={handleInputChange}
                            value={input.launchDate}
                        />
                        <div>
                            {errors.launchDate && <p>{errors.launchDate}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="rating">Rating </label> <br />
                        <input
                            type="number"
                            name="rating"
                            id="gameRate"
                            autoComplete="off"
                            onChange={handleInputChange}
                            value={input.rating}
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
                                            value={genre.name}
                                            name="genres"
                                            onChange={handleInputChange}
                                            checked={input.genres.includes(
                                                genre.name
                                            )}
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
                            {availablePlatforms.map((platform, ix) => {
                                return (
                                    <div className="p" key={ix}>
                                        <input
                                            type="checkbox"
                                            id={`cbox-${ix}`}
                                            value={platform}
                                            name="platforms"
                                            onChange={handleInputChange}
                                            checked={input.platforms.includes(
                                                platform
                                            )}
                                        />
                                        <label>{platform}</label> <br />
                                    </div>
                                );
                            })}
                        </div>
                        <div>
                            {errors.platforms && <p>{errors.platforms}</p>}
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={!isFormValid}
                            className="button"
                        >
                            Agregar videojuego
                        </button>
                    </div>
                </div>
                {requestError &&
                    requestError.map((error) => {
                        return <p>{error[Object.keys(error)[0]]}</p>;
                    })}
                <Button id="detailGoBack" to="/home" text="Regresar"></Button>
            </div>
        );
    }
}
