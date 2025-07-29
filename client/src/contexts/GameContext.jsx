import { createContext, useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Status, stringToStatus, getDateNumber } from "../Utils.js";

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [band, setBand] = useState(null);
  const [guessQuery, setGuessQuery] = useState("");
  const [guesses, setGuesses] = useState(0);
  const [previousGuesses, setPreviousGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState(Status.PLAYING);
  const [loading, setLoading] = useState(true);

  const maxGuesses = 6;
  const [day, setDay] = useState(0);

  var gameData = {
    gameStatus: Status.PLAYING,
    guesses: [""],
  };

  const loadGameData = (gameData) => {
    //console.log(gameData);
    //console.log(gameData.gameStatus);
    setPreviousGuesses(gameData.guesses);

    setGameStatus(stringToStatus(gameData.gameStatus));
    setGuesses(gameData.guesses.length + 1);
  };

  const loadStorage = () => {
    console.log("Day", day);
    const loadedData = JSON.parse(localStorage.getItem(`game-${day}`));
    return loadedData;
  };

  // Load local storage on instantization
  useEffect(() => {
    if (day == 0) {
      return;
    }
    const loadedData = loadStorage();
    if (loadedData != null) {
      loadGameData(loadedData);
    }
  }, [day]);

  // Set local storage
  useEffect(() => {
    if (day == 0) {
      return;
    }
    const loadedData = loadStorage();
    if (
      loadedData != null &&
      stringToStatus(loadedData.gameStatus) != Status.PLAYING
    ) {
      return;
    }
    //if (gameStatus == Status.PLAYING) {
    gameData.gameStatus = String(gameStatus);
    gameData.guesses = previousGuesses;

    localStorage.setItem(`game-${day}`, JSON.stringify(gameData));
  }, [guesses, previousGuesses, gameStatus]);

  const data = {
    gameStatus,
    setGameStatus,
    previousGuesses,
    setPreviousGuesses,
    guesses,
    setGuesses,
    guessQuery,
    setGuessQuery,
    band,
    setBand,
    maxGuesses,
    day,
    setDay,
    loading,
    setLoading,
  };

  return <GameContext.Provider value={data}>{children}</GameContext.Provider>;
};
