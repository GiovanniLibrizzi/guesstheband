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
  var bandNotFound = false;
  var answers = [];
  var day_id = 0;

  var monthly_listeners = "0";
  var notable_release_date = null;

  const date = new Date();

  useEffect(() => {
    fetchTodaysBandData();
  }, []);

  //   useEffect(() => {
  // 	localStorage.setItem(`game-${getDateNumber()}`, )
  //   })

  const fetchTodaysBandData = async () => {
    try {
      const res = await axios.get("http://localhost:8800/bands/today");
      if (res.data == []) {
        bandNotFound = true;
        setLoading(false);
        return;
      }
      console.log("res", res.data[0]);
      setBand(res.data[0]);

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

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
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (!loading) {
    if (bandNotFound) {
      return <p>test</p>;
    }
    // -- notable release date
    var notable_release_date = new Date(
      band.notable_release_date
    ).toLocaleDateString("en-US", dateOptions);

    monthly_listeners = Intl.NumberFormat("en-US").format(
      band.monthly_listeners
    );

    // -- record label
    var labelPhrase = ``;
    if (band.label_name != null) {
      if (band.label_name.toLowerCase() != "independent") {
        labelPhrase = `who has been on the record label ${band.label_name}, `;
      } else {
        labelPhrase = `who is an independent arist `;
      }
    }

    //
    var notablePhrase = "most popular album";
    if (band.notable_is_first_work) {
      notablePhrase = "first album";
    }
    var albumImgPhrase = `The image below is a blurred version of their ${notablePhrase}`;
    var phaseAlbumImg = 4;
    var albumImg4Phrase = "";
    var albumImg5Phrase = "";

    var albumImgLinkBlur = `../src/assets/img_album/${band.band_id}-b.jpg`;
    var albumImgLink = `../src/assets/img_album/${band.band_id}.jpg`;

    // -- intro grammar / artist phrase
    var introPhrase = `${aGrammar(
      band.genre,
      true
    )} ${band.genre.toLowerCase()} band formed in ${band.location}`;

    // members
    var showBandImg = false;
    var phaseBandMembers = 3;
    var bandImgLink = `../src/assets/img_band/${band.band_id}-m.jpg`;
    var memberPhrase = `An image of the members can be seen below`;
    if (band.members != null) {
      memberPhrase = `Members include ${band.members}`;
    } else {
      showBandImg = true;
      memberPhrase = `An image of the band's members can be seen below`;
    }

    if (band.is_artist_solo) {
      introPhrase = `${aGrammar(
        band.genre,
        true
      )} ${band.genre.toLowerCase()} artist born in ${band.location}`;
      albumImg4Phrase = albumImgPhrase;
      phaseAlbumImg = 3;
      memberPhrase = ``;
    } else {
      albumImg5Phrase = albumImgPhrase + ". ";
    }

    // -- EP
    var epPhrase = `, ${band.ep_count} EPs`;
    if (band.ep_count == null) {
      epPhrase = "";
    }

    // Game phases
    try {
      var gamePhrases = [
        `${introPhrase} active from ${band.years_active}`,
        ` with ${monthly_listeners} monthly listeners ${labelPhrase}with ${band.album_count} albums${epPhrase}`,
        `. Their music can be classified as ${band.subgenres.toLowerCase()}, and their ${notablePhrase} was released on ${notable_release_date}`,
        `. ${memberPhrase}${albumImg4Phrase}`,
        `. ${albumImg5Phrase}Popular songs include: "${band.top_song_5}", "${band.top_song_4}"`,
        `, "${band.top_song_3}", "${band.top_song_2}", "${band.top_song_1}"`,
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

          {gameStatus != Status.VICTORY ? (
            <>
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
            </>
          ) : (
            <>
              {gamePhrases.map((phrase, index) => {
                return index >= guesses ? (
                  <p className="phrase" key={index}>
                    <i>{`${phrase}`}</i>
                  </p>
                ) : (
                  <p className="phrase" key={index}>{`${phrase}`}</p>
                );
              })}
            </>
          )}
          <br></br>
          {showBandImg &&
            (guesses >= phaseBandMembers || gameStatus != Status.PLAYING) && (
              <img src={bandImgLink} className="bandImg"></img>
            )}

          {gameStatus == Status.PLAYING ? (
            <>
              {guesses >= phaseAlbumImg && (
                <img src={albumImgLinkBlur} className="albumImg"></img>
              )}
            </>
          ) : (
            <>
              <img src={albumImgLink} className="albumImg"></img>
              <p className="notable-name">{`${band.notable_work_name} by ${band.name}`}</p>
            </>
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

export default Home;
