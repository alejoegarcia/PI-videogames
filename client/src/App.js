import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getVideogames, getGenres } from "./actions";


// components imports
import Button from "./components/Button";
import Cards from "./components/Cards";
import Detail from "./components/Detail";
import Footer from "./components/Footer";

// styles imports
import s from './App.css';
import CreateForm from "./components/CreateForm";

function App() {
    // const genres = useSelector((state) => state.genres)
    const dispatch = useDispatch();

    useEffect(() => {
        function startUp() {
            dispatch(getVideogames());
            dispatch(getGenres());
            // dispatch(getPlatforms());
        }
        startUp();
    }, [])

    return (
        <div className="App">
            <Button id="create-game" to="/videogame/create" text="Crear juego" />
            <Routes>
                {/* <Route path="/" element={<Landing/>} /> */}
                <Route path="/home" element={<Cards />} />
                <Route path="/videogame/:id" element={<Detail />} />
                <Route path="/videogame/create" element={<CreateForm />} />

            </Routes>
            <Footer></Footer>
        </div>

    );
}

export default App;
