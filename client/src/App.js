import { Route, Routes } from "react-router-dom";

// components imports
import Cards from "./components/Cards";
import Detail from "./components/Detail";
import Footer from "./components/Footer";
import { useSearchParams } from "react-router-dom";
// styles imports
import s from './App.css';

function App() {
    return (
        <div className="App">
            <Routes>
                {/* <Route path="/" element={<Landing/>} /> */}
                <Route path="/home" element={<Cards />} />
                <Route path="/videogame/:id" element={<Detail />} />

            </Routes>
            <Footer></Footer>
        </div>

    );
}

export default App;
