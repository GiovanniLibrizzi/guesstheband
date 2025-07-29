import { createContext, useState, useContext } from "react";
import { Status } from "../Utils.js";

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [band, setBand] = useState(null);
  const [guessQuery, setGuessQuery] = useState("");
  const [guesses, setGuesses] = useState(0);
  const [previousGuesses, setPreviousGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState(Status.PLAYING);
  const maxGuesses = 6;

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
  };

  return <GameContext.Provider value={data}>{children}</GameContext.Provider>;
};
