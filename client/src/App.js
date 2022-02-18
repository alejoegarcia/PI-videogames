import { Route, Routes } from "react-router-dom";

// components imports
import Footer from "./components/Footer";
import Cards from "./components/Cards";
// styles imports
import s from './App.css';

function App() {
  return (
    <div className="App">
        {/* <Nav></Nav> */}
      <Routes>
      {/* <Route path="/" element={<Home />}/> */}
      <Route path="/home" element={<Cards />}/>

      </Routes>
      <Footer></Footer>
    </div>

  );
}

export default App;
