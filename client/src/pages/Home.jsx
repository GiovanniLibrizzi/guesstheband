import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  checkGuess,
  shareResults,
  getDateNumber,
  Status,
  aGrammar,
} from "../Utils.js";
import "../css/Home.css";

function Home() {
  const [band, setBand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guessQuery, setGuessQuery] = useState("");
  const [guesses, setGuesses] = useState(0);
  const [previousGuesses, setPreviousGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState(Status.PLAYING);

  const inputRef = useRef(null);

  const maxGuesses = 6;
  var answers = [];
  var day_id = 0;

  var monthly_listeners = "0";
  var notable_release_date = null;
  const date = new Date();

  useEffect(() => {
    fetchTodaysBandData();
  }, []);

  const fetchTodaysBandData = async () => {
    try {
      const res = await axios.get("http://localhost:8800/bands/today");
      setBand(res.data[0]);

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchAllBands = async () => {
    try {
      const res = await axios.get("http://localhost:8800/bands");
      setBands(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // entry
  const handleGuess = (e, skipped = false) => {
    //if (e.type == "no-skip") {
    //}
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
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  if (!loading) {
    var notable_release_date = new Date(
      band.notable_release_date
    ).toLocaleDateString("en-US", dateOptions);

    monthly_listeners = Intl.NumberFormat("en-US").format(
      band.monthly_listeners
    );

    var introPhrase = `${aGrammar(
      band.genre,
      true
    )} ${band.genre.toLowerCase()} band formed in ${band.location}`;
    if (band.is_artist_solo) {
      introPhrase = `${aGrammar(
        band.genre,
        true
      )} ${band.genre.toLowerCase()} artist born in ${band.location}`;
    }

    var epPhrase = `, ${band.ep_count} EPs`;
    if (band.ep_count == null) {
      epPhrase = "";
    }
    var notablePhrase = "most popular album";
    if (band.notable_is_first_work) {
      notablePhrase = "first album";
    }
    // Game phases
    try {
      var gamePhrases = [
        `${introPhrase} active from ${band.years_active}`,
        ` who has ${monthly_listeners} monthly listeners and ${band.album_count} albums${epPhrase}`,
        `. Their music can be classified as ${band.subgenres.toLowerCase()}, and their ${notablePhrase} was released on ${notable_release_date}`,
        `. Members include ${band.members}`,
        `. Popular songs include: ${band.top_song_5}, ${band.top_song_4}`,
        `, ${band.top_song_3}, ${band.top_song_2}, ${band.top_song_1}`,
      ];
    } catch (err) {
      console.log(err);
      var gamePhrases = ["error!!"];
    }
  }

  return (
    <div className="App">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div>
          <h3>{`Game #${getDateNumber()} (${date.toLocaleDateString()})`}</h3>

          {gamePhrases.map((phrase, index) =>
            index == guesses ? (
              <p className="phrase" key={index}>
                <b>{`${phrase}`}</b>
              </p>
            ) : index < guesses ? (
              <p className="phrase" key={index}>{`${phrase}`}</p>
            ) : (
              <p className="phrase" key={index}></p>
            )
          )}
          {gameStatus == Status.PLAYING ? (
            <b>.</b>
          ) : (
            <p className="phrase">.</p>
          )}

          {gameStatus == Status.PLAYING ? (
            <div>
              <p>
                <i>{`${maxGuesses - guesses} guess${
                  maxGuesses - guesses == 1 ? `` : `es`
                } remaining!`}</i>
              </p>

              <form id="guessForm" onSubmit={handleSubmit}>
                <input
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
              <p key={index}>{`❌Skipped!`}</p>
            ) : (
              <p key={index}>{`❌${answer}`}</p>
            )
          )}
          {gameStatus == Status.VICTORY && (
            <p key={index}>{`✅${band.name}`}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;

/* {bands.map((band) => (
<p>{band.name}</p>
))} */

// 	const handleSearch = async (e) => {
// 		e.preventDefault(); // prevent page refresh
// 		if (!searchQuery.trim()) return;
// 		if (loading) return;
// 		setLoading(true);

// 		try {
// 		const searchResults = await searchMovies(searchQuery);
// 		setMovies(searchResults);
// 		setError(null);
// 		} catch (err) {
// 		console.log(err);
// 		setError("Failed to search movies...");
// 		} finally {
// 		setLoading(false);
// 		}
//   };
