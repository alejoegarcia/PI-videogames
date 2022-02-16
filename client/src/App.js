import { Route, Routes } from "react-router-dom";

// components imports
import { Footer } from "./components/Footer";
// styles imports
import s from './App.css';

function App() {
  return (
    <div className="App">
        {/* <Nav></Nav> */}
      <Routes>
          <Route exact path="/">
          </Route>
          <Route exact path="/home">
              {/* <SearchBar></SearchBar> */}
              {/* <Cards></Cards> */}
              {/* <Buttons></Buttons> */}
              {/* <Pagination></Pagination> */}
          </Route>
          <Route exact path="/videogame/:id">
              {/* <Videogame></Videogame> */}
          </Route>
          <Route exact path="/videogame/create">
              {/* <Form></Form> */}
              {/* <Button text="Crear" onPost={onPost}></Button> */}
          </Route>
      </Routes>
      <Footer></Footer>
    </div>

  );
}

export default App;
