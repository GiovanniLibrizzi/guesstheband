import { useRef, useState, useEffect } from "react";

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
    setKnewIt,
    loadStorage,
  } = useGameContext();
  const [showKnowBtn, setShowKnowBtn] = useState(true);

  const inputRef = useRef(null);

  useEffect(() => {
    if (loadStorage(day).k != null) {
      setShowKnowBtn(false);
    }
  }, []);

  const handleKnowBtn = async (knew) => {
    setShowKnowBtn(false);
    setKnewIt(knew);
    console.log("test", knew);
    generateKnewData(knew);
  };

  if (band == null) {
    return <></>;
  }

  const generateData = (guesses, failed) => {
    const stats = {
      in1: 0,
      in2: 0,
      in3: 0,
      in4: 0,
      in5: 0,
      in6: 0,
      failed: 0,
    };
    if (failed != true) {
      stats[`in${guesses + 1}`] = 1;
    } else {
      stats.failed = 1;
    }
    //console.log(stats);
  };

  const generateKnewData = (knew) => {
    const stats = {
      knew_it: 0,
      didnt_know: 0,
    };
    if (knew) {
      stats.knew_it = 1;
    } else {
      stats.didnt_know = 1;
    }
  };

  const sendStats = async (data) => {
    // try {
    //   await axios.post("http://localhost:8800/bands", band);
    //   alert("Successfully entered!");
    //   window.location.reload();
    // } catch (err) {
    //   console.log(err);
    // }
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
        sendStats();
      } else {
        setPreviousGuesses((oldArray) => [...oldArray, bandGuessed]);

        if (guesses + 1 == maxGuesses) {
          // failed out
          setGameStatus(Status.FAILURE);
          // send data to stats db
          sendStats();
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
          <form onSubmit={handleSkip}>
            <button>Skip</button>
          </form>
          <br></br>
          <button form="guessForm">Submit</button>
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
          {showKnowBtn && (
            <>
              <button
                onClick={() => {
                  handleKnowBtn(true);
                }}
              >
                Knew it!
              </button>
              <button
                onClick={() => {
                  handleKnowBtn(false);
                }}
              >
                Didn't know it...
              </button>
            </>
          )}

          <br></br>
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
