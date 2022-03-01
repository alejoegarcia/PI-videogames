import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getVideogames, getGenres } from "./actions";


// components imports
import Cards from "./components/Cards";
import Detail from "./components/Detail";
import Footer from "./components/Footer";
import Landing from "./components/Landing";

// styles imports
import s from './App.css';
import CreateForm from "./components/CreateForm";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        function startUp() {
            dispatch(getVideogames());
            dispatch(getGenres());
        }
        startUp();
    }, [])

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route exact path="/home" element={<Cards />} />
                <Route exact path="/videogame/:id" element={<Detail />} />
                <Route exact path="/videogame/create" element={<CreateForm />} />

            </Routes>
            <Footer></Footer>
        </div>

    );
}

export default App;
