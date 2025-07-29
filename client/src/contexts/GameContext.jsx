import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { Status } from "../Utils.js";

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [band, setBand] = useState(null);
  const [guessQuery, setGuessQuery] = useState("");
  const [guesses, setGuesses] = useState(0);
  const [previousGuesses, setPreviousGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState(Status.PLAYING);

  const date = new Date();

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
  };

  return <GameContext.Provider value={data}>{children}</GameContext.Provider>;
};
