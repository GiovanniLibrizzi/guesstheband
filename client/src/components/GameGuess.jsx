import { useRef, useState, useEffect } from "react";
import axios from "axios";
import "../css/Game.css";
import { useGameContext } from "../contexts/GameContext";
import {
  checkGuess,
  shareResults,
  getDateNumber,
  Status,
  aGrammar,
  generateScore,
} from "../Utils.js";
import KnowButton from "./KnowButton.jsx";

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
  const [shared, setShared] = useState(false);

  if (band == null) {
    return <></>;
  }

  const generateData = (guesses, correct) => {
    const stats = {
      in1: 0,
      in2: 0,
      in3: 0,
      in4: 0,
      in5: 0,
      in6: 0,
      failed: 0,
      day_id: day,
    };
    if (correct) {
      stats[`in${guesses + 1}`] = 1;
    } else {
      stats.failed = 1;
    }
    return stats;
  };

  const sendStats = async (correct) => {
    const data = generateData(guesses, correct);
    //console.log(data);
    try {
      await axios.post(`${process.env.DB_URL}/bands/daily/stats`, data);
    } catch (err) {
      console.log(err);
    }
  };
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
        // send data to stats db
        sendStats(correct);
      } else {
        setPreviousGuesses((oldArray) => [...oldArray, bandGuessed]);

        if (guesses + 1 == maxGuesses) {
          // failed out
          setGameStatus(Status.FAILURE);
          // send data to stats db
          sendStats(correct);
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
    //console.log("submit", e);
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
        <>
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
              autocomplete="off"
            />
          </form>
          <button form="guessForm">Submit</button>
          <br></br>
          <form onSubmit={handleSkip}>
            <button>Skip</button>
          </form>
        </>
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
          <KnowButton />

          <p className="results">{`Your score: ${generateScore(
            guesses,
            maxGuesses,
            previousGuesses,
            gameStatus,
            day
          )}`}</p>
          <button
            onClick={() => {
              setShared(true);
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
          {shared && <p className="tiny">Results copied to clipboard!</p>}
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
