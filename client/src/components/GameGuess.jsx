import { useRef } from "react";

import "../css/Game.css";
import { useGameContext } from "../contexts/GameContext";
import {
  checkGuess,
  shareResults,
  getDateNumber,
  Status,
  aGrammar,
} from "../Utils.js";

function GameGuess() {
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
    maxGuesses,
    day,
  } = useGameContext();

  const inputRef = useRef(null);

  if (band == null) {
    return <></>;
  }

  // entry
  const handleGuess = (e, skipped = false) => {
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

  return (
    <>
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
            gameStatus,
            day
          )}`}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                shareResults(
                  guesses,
                  maxGuesses,
                  previousGuesses,
                  gameStatus,
                  day
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
    </>
  );
}

export default GameGuess;
