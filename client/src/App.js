import { Route, Routes, useSearchParams } from "react-router-dom";

// components imports
import Cards from "./components/Cards";
import Detail from "./components/Detail";
import Footer from "./components/Footer";
// styles imports
import s from './App.css';
import { useSelector } from "react-redux";

function App() {
    const [games] = useSelector((state) => state.allGames);
    const [searchParams] = useSearchParams();
    return (
        <div className="App">
            {/* <Nav></Nav> */}
            <Routes>
                {/* <Route path="/" element={<Landing/>} /> */}
                <Route path="/home" element={<Cards />} />
                <Route path="/videogame/:id" element={<Detail game={games.find((game) => game.id === searchParams.get("id"))} />} />

            </Routes>
            <Footer></Footer>
        </div>

    );
}

export default App;
