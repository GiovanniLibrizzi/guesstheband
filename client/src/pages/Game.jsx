import GamePhrase from "../components/GamePhrase.jsx";
import GameGuess from "../components/GameGuess.jsx";
import GameStats from "../components/GameStats.jsx";
import { useGameContext } from "../contexts/GameContext.jsx";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import axios from "axios";
import { getDateNumber, isNumeric, Status } from "../Utils.js";
import "../css/Game.css";
import PrevDays from "./Archive.jsx";

function Game() {
  const { setBand, day, setDay, loading, setLoading, gameStatus } =
    useGameContext();

  const [searchParams, setSearchParams] = useSearchParams();

  // returns true if successful, false if not
  const fetchBandData = async () => {
    try {
      const res = await axios.get("http://localhost:8800/bands/date/id", {
        params: { id: day },
      });
      if (res.data == []) {
        alert("Band data not found today!");
        //setLoading(false);
        return false;
      }
      setBand(res.data[0]);
      //console.log("day", day);
      //console.log("res", res.data[0]);

      //setLoading(false);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const date = new Date();

  // Initialize day
  useEffect(() => {
    const dayCode = searchParams.get("day");
    if (dayCode != null) {
      if (isNumeric(dayCode)) {
        if (dayCode <= getDateNumber()) {
          setDay(dayCode);
        } else {
          setDay(getDateNumber());
        }
      }
    } else {
      setDay(getDateNumber());
    }
    //console.log("Day code:", dayCode);
    //fetchBandData();
  }, []);

  // Fetch band data when day is updated
  useEffect(() => {
    fetchBandData();
    setLoading(false);
  }, [day]);

  //   useEffect(() => {
  // 	localStorage.setItem(`game-${day}`, )
  //   })

  return (
    <div className="App">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <h3>{`Game #${day} (${date.toLocaleDateString()})`}</h3>

          <GamePhrase />
          <GameGuess />

          <GameStats />
        </>
      )}
    </div>
  );
}

export default Game;
