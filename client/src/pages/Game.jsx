import GamePhrase from "../components/GamePhrase.jsx";
import GameGuess from "../components/GameGuess.jsx";
import { useGameContext } from "../contexts/GameContext.jsx";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  checkGuess,
  shareResults,
  getDateNumber,
  Status,
  aGrammar,
} from "../Utils.js";
import "../css/Game.css";

function Game() {
  const [loading, setLoading] = useState(true);
  const { setBand } = useGameContext();

  // returns true if successful, false if not
  const fetchTodaysBandData = async () => {
    try {
      const res = await axios.get("http://localhost:8800/bands/today");
      if (res.data == []) {
        //bandNotFound = true;
        setLoading(false);
        return false;
      }
      setBand(res.data[0]);
      console.log("res", res.data[0]);

      setLoading(false);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const date = new Date();

  useEffect(() => {
    console.log("effect");
    fetchTodaysBandData();
  }, []);

  //   useEffect(() => {
  // 	localStorage.setItem(`game-${getDateNumber()}`, )
  //   })

  return (
    <div className="App">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <h3>{`Game #${getDateNumber()} (${date.toLocaleDateString()})`}</h3>

          <GamePhrase />
          <GameGuess />
        </>
      )}
    </div>
  );
}

export default Game;
