import { BrowserRouter, Routes, Route } from "react-router";
import { GameProvider } from "./contexts/GameContext";

import Game from "./pages/Game";
import AdminSubmit from "./pages/AdminSubmit";
import AdminCalendar from "./pages/AdminCalendar";
import TopBar from "./components/TopBar";
import "./css/App.css";
import PrevDays from "./pages/Archive";
import ImageTest from "./pages/ImageTest";

function App() {
  return (
    <GameProvider>
      <div className="App">
        <a href="/" className="defaultColor">
          <h2 className="title">Guess the Band</h2>
        </a>

        <TopBar />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Game />} />
            <Route path="/archive" element={<PrevDays />} />
            <Route path="/admin/submit" element={<AdminSubmit />} />
            <Route path="/admin/calendar" element={<AdminCalendar />} />
            <Route path="/admin/test" element={<ImageTest />} />
          </Routes>
        </BrowserRouter>
      </div>
    </GameProvider>
  );
}

export default App;
