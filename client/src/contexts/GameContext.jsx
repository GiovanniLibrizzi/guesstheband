import { createContext, useState, useContext, useEffect } from "react";
import { Status, stringToStatus, getDateNumber, toPercent } from "../Utils.js";
import axios from "axios";

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [band, setBand] = useState(null);
  const [guessQuery, setGuessQuery] = useState("");
  const [guesses, setGuesses] = useState(0);
  const [previousGuesses, setPreviousGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState(Status.PLAYING);
  const [loading, setLoading] = useState(true);
  const [localStats, setLocalStats] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);

  const db_url = "http://134.209.56.7:8800";

  const maxGuesses = 6;
  const [day, setDay] = useState(0);

  var gameData = {
    gameStatus: Status.PLAYING,
    guesses: [""],
    k: null,
  };

  const loadGameData = (gameData) => {
    setPreviousGuesses(gameData.guesses);
    var status = stringToStatus(gameData.gameStatus);
    setGameStatus(status);
    var guesses = gameData.guesses.length;
    if (status != gameStatus.PLAYING) {
      guesses++;
    }
    setGuesses(guesses);
  };

  // Load storage into an object
  const loadStorage = (day) => {
    //console.log("Day", day);
    const loadedData = JSON.parse(localStorage.getItem(`game-${day}`));
    return loadedData;
  };

  const loadAllDays = () => {
    const loadedData = [];
    for (var i = 1; i <= getDateNumber(); i++) {
      loadedData.push(loadStorage(i));
    }
    return loadedData;
  };

  const loadLocalStats = () => {
    var winDistribution = [0, 0, 0, 0, 0, 0, 0];
    var gamesPlayed = 0;
    var gamesWon = 0;
    var currentStreak = 0;
    var maxStreak = 0;
    loadAllDays().forEach((e, i) => {
      if (e != null) {
        if (e.gameStatus == Status.VICTORY) {
          gamesPlayed++;
          gamesWon++;
          winDistribution[e.guesses.length]++;
        } else if (e.gameStatus == Status.FAILURE) {
          gamesPlayed++;
          winDistribution[winDistribution.length - 1]++;
        }
      }
    });
    const stats = {
      winDistribution: winDistribution,
      gamesPlayed: gamesPlayed,
      gamesWon: gamesWon,
    };
    setLocalStats(stats);
    return stats;
  };

  const setKnewIt = (bool) => {
    const data = loadStorage(day);
    data.k = bool ? 1 : 0;
    localStorage.setItem(`game-${day}`, JSON.stringify(data));
  };

  const loadGlobalStats = async () => {
    try {
      const res = await axios.get(`${process.env.DB_URL}/bands/daily/stats`, {
        params: { day_id: day },
      });
      const data = res.data[0];

      const totalWon =
        data.in1 + data.in2 + data.in3 + data.in4 + data.in5 + data.in6;
      const globalData = {
        winDistribution: [
          data.in1,
          data.in2,
          data.in3,
          data.in4,
          data.in5,
          data.in6,
          data.failed,
        ],
        knewIt: toPercent(data.knew_it, data.knew_it + data.didnt_know),
        totalKnewIt: toPercent(totalWon, totalWon + data.failed),
      };

      setGlobalStats(globalData);
      console.log(globalData);
    } catch (err) {
      console.log(err);
    }
  };

  // Load local storage into the states
  useEffect(() => {
    if (day == 0) {
      return;
    }
    const loadedData = loadStorage(day);
    if (loadedData != null) {
      loadGameData(loadedData);
    }
    loadLocalStats();
  }, [day]);

  // Set local storage
  useEffect(() => {
    if (day == 0) {
      return;
    }
    const loadedData = loadStorage(day);
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
    loadLocalStats();
  }, [guesses, previousGuesses, gameStatus]);

  // Load global stats
  useEffect(() => {
    if (gameStatus != Status.PLAYING) {
      loadGlobalStats();
      console.log(globalStats);
    }
  }, [gameStatus]);

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
    loadStorage,
    loadAllDays,
    localStats,
    setKnewIt,
    globalStats,
    db_url,
  };

  return <GameContext.Provider value={data}>{children}</GameContext.Provider>;
};
