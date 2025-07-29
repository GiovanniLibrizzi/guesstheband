import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import AdminSubmit from "./pages/AdminSubmit";
import AdminCalendar from "./pages/AdminCalendar";
import viteLogo from "/vite.svg";
import "./css/App.css";

function App() {
  //const [count, setCount] = useState(0);

  return (
    <>
      <div className="App">
        <h2 className="title">Guess the Band</h2>

        <button className="topButton" href="#popup1">
          ?
        </button>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/submit" element={<AdminSubmit />} />
            <Route path="/admin/calendar" element={<AdminCalendar />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
