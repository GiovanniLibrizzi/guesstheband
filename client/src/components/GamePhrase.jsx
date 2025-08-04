import "../css/Game.css";
import { useGameContext } from "../contexts/GameContext";
import { Status, aGrammar } from "../Utils.js";
import { useEffect } from "react";

function GamePhrase() {
  const { band, gameStatus, guesses, loading } = useGameContext();

  var showBandImg = false;
  var phaseAlbumImg = 4;
  var phaseBandMembers = 3;

  const prepareGamePhrases = () => {
    // -- notable release date
    const dateOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    var notable_release_date = new Date(
      band.notable_release_date
    ).toLocaleDateString("en-US", dateOptions);

    var monthly_listeners = Intl.NumberFormat("en-US").format(
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
    var albumImg4Phrase = "";
    var albumImg5Phrase = "";

    // -- intro grammar / artist phrase
    var introPhrase = `${aGrammar(
      band.genre,
      true
    )} ${band.genre.toLowerCase()} band formed in ${band.location}`;

    // members
    var memberPhrase = `An image of the members can be seen below`;
    if (band.members != null) {
      memberPhrase = `Members include ${band.members}`;
    } else {
      if (!band.is_artist_solo) {
        showBandImg = true;
        memberPhrase = `An image of the band's members can be seen below`;
      }
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
      return gamePhrases;
    } catch (err) {
      console.log(err);
      //var gamePhrases = ["error!!"];
      return null;
    }
  };

  if (band == null) {
    return <></>;
  }

  var albumImgLinkBlur = `../src/assets/img_album/${band.band_id}-b.jpg`;
  var albumImgLink = `../src/assets/img_album/${band.band_id}.jpg`;

  var bandImgLink = `../src/assets/img_band/${band.band_id}-m.jpg`;

  var gamePhrases = prepareGamePhrases();

  // HTML return
  return (
    <>
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
    </>
  );
}

export default GamePhrase;
