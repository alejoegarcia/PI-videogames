import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { postVideogame } from "../actions";

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
                        (el) => el.name !== e.t.name
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
        <div>
            <div>
                <label htmlFor="name">Nombre</label>
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
                <label htmlFor="description">Descripción</label>
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
                <label htmlFor="launchDate">Fecha de lanzamiento</label>
                <input
                    type="date"
                    name="launchDate"
                    id="gameDate"
                    onChange={handleInputChange}
                />
                <div>{errors.launchDate && <p>{errors.launchDate}</p>}</div>
            </div>
            <div>
                <label htmlFor="rating">Rating</label>
                <input
                    type="number"
                    name="rating"
                    id="gameRate"
                    autoComplete="off"
                    onChange={handleInputChange}
                />
                <div>{errors.rating && <p>{errors.rating}</p>}</div>
            </div>
            <div>
                {genres.map((genre) => {
                    return (
                        <label key={genre.id}>
                            <input
                                type="checkbox"
                                id={`cbox-${genre.id}`}
                                value={genre.name}
                                name="genres"
                                onChange={handleInputChange}
                            />
                            {genre.name}
                        </label>
                    );
                })}
            </div>
            <div>
                <label htmlFor="platforms">Plataformas</label>
                <select
                    name="platforms"
                    id="gamePlat"
                    multiple={true}
                    onChange={handleInputChange}
                >
                    <optgroup label="Vintage">
                        <option value="Atari 8-bit">Atari 8-bit</option>
                        <option value="Dreamcast">Dreamcast</option>
                        <option value="GameCube">GameCube</option>
                        <option value="Game Boy">Game Boy</option>
                        <option value="NES">NES</option>
                        <option value="SEGA">SEGA</option>
                        <option value="SNES">SNES</option>
                    </optgroup>
                    <optgroup label="Consolas">
                        <option value="Nintendo Switch">Nintendo Switch</option>
                        <option value="PlayStation 5">PlayStation 5</option>
                        <option value="PlayStation 4">PlayStation 4</option>
                        <option value="PlayStation 3">PlayStation 3</option>
                        <option value="Xbox">Xbox</option>
                        <option value="Wii">Wii</option>
                    </optgroup>
                    <optgroup label="SOs">
                        <option value="Android">Android</option>
                        <option value="iOS">iOS</option>
                        <option value="Linux">Linux</option>
                        <option value="macOS">macOS</option>
                    </optgroup>
                </select>
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
