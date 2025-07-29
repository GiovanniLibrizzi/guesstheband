import GamePhrase from "../components/GamePhrase.jsx";
import { useGameContext } from "../contexts/GameContext.jsx";
import { useState, useEffect, useRef } from "react";
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
  const {
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
  } = useGameContext();

  const maxGuesses = 6;

  // returns true if successful, false if not
  const fetchTodaysBandData = async () => {
    try {
      const res = await axios.get("http://localhost:8800/bands/today");
      if (res.data == []) {
        //bandNotFound = true;
        setLoading(false);
        return false;
      }
      console.log("res", res.data[0]);
      setBand(res.data[0]);

      setLoading(false);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const inputRef = useRef(null);

  const date = new Date();

  useEffect(() => {
    fetchTodaysBandData();
  }, []);

  //   useEffect(() => {
  // 	localStorage.setItem(`game-${getDateNumber()}`, )
  //   })

  // entry
  const handleGuess = (e, skipped = false) => {
    if (loading) return;

    var bandGuessed = guessQuery;
    if (skipped) {
      bandGuessed = null;
    }

    try {
      setGuesses(guesses + 1);

      var correct = checkGuess(guessQuery, band.name);

      if (correct) {
        // victory screen
        setGameStatus(Status.VICTORY);
        console.log(`You found the band in ${guesses}!`);
      } else {
        setPreviousGuesses((oldArray) => [...oldArray, bandGuessed]);

        if (guesses + 1 == maxGuesses) {
          // failed out
          setGameStatus(Status.FAILURE);
        }
        // incorrect; add more clues
      }
      setGuessQuery("");
      inputRef.current.value = "";
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!guessQuery.trim()) return;
    console.log("submit", e);
    return handleGuess(e, false);
  };

  const handleSkip = (e) => {
    e.preventDefault();
    setGuessQuery("");
    inputRef.current.value = "";
    return handleGuess(e, true);
  };

  if (!loading) {
    var albumImgLinkBlur = `../src/assets/img_album/${band.band_id}-b.jpg`;
    var albumImgLink = `../src/assets/img_album/${band.band_id}.jpg`;
    var bandImgLink = `../src/assets/img_band/${band.band_id}-m.jpg`;
    //const phrases = GamePhrase.prepareGamePhrases();
    // prepareGamePhrases();
  }

  return (
    <div className="App">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div>
          <h3>{`Game #${getDateNumber()} (${date.toLocaleDateString()})`}</h3>

          <GamePhrase />

          {gameStatus == Status.PLAYING ? (
            <div>
              <p>
                <i>{`${maxGuesses - guesses} guess${
                  maxGuesses - guesses == 1 ? `` : `es`
                } remaining!`}</i>
              </p>

              <form id="guessForm" onSubmit={handleSubmit}>
                <input
                  className="guessBox"
                  id="guessbox"
                  ref={inputRef}
                  placeholder="Enter your guess"
                  value={guessQuery}
                  onChange={(e) => setGuessQuery(e.target.value)}
                />
              </form>
              <form onSubmit={handleSkip}>
                <button>Skip</button>
              </form>
              <br></br>
              <button form="guessForm">Submit</button>
            </div>
          ) : (
            <div>
              {gameStatus == Status.VICTORY ? (
                <div>
                  <h3>Nailed it!!</h3>
                </div>
              ) : (
                <div>
                  <h3>Better luck next time...</h3>
                </div>
              )}
              <p>
                The answer was: <b>{`${band.name}`}</b>
              </p>
              <p className="results">{`${shareResults(
                guesses,
                maxGuesses,
                previousGuesses,
                gameStatus
              )}`}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    shareResults(
                      guesses,
                      maxGuesses,
                      previousGuesses,
                      gameStatus
                    )
                  );
                }}
              >
                Share
              </button>
            </div>
          )}

          {previousGuesses.map((answer, index) =>
            answer == null ? (
              <p className="guesses" key={index}>{`❌Skipped!`}</p>
            ) : (
              <p className="guesses" key={index}>{`❌${answer}`}</p>
            )
          )}
          {gameStatus == Status.VICTORY && <p>{`✅${band.name}`}</p>}
        </div>
      )}
    </div>
  );
}

export default Game;
