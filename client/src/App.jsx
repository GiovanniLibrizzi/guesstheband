import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./contexts/GameContext";

import Game from "./pages/Game";
import AdminSubmit from "./pages/AdminSubmit";
import AdminCalendar from "./pages/AdminCalendar";
import "./css/App.css";

function App() {
  return (
    <GameProvider>
      <div className="App">
        <h2 className="title">Guess the Band</h2>

        <button className="topButton" href="#popup1">
          ?
        </button>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Game />} />
            <Route path="/admin/submit" element={<AdminSubmit />} />
            <Route path="/admin/calendar" element={<AdminCalendar />} />
          </Routes>
        </BrowserRouter>
      </div>
    </GameProvider>
  );
}

export default App;
