function About() {
  return (
    <div>
      <h4>How to play Guess the Band</h4>
      <p className="about">
        Submit the name of a band or musical artist you think the clues are
        describing.
      </p>
      <p className="about">
        Every time you make a guess or hit skip, a new clue will be revealed.
      </p>
      <p className="about">
        You have six total guesses to determine the correct band/artist
      </p>
      <p className="about">
        Monthly listeners and song/album popularity are determined by Spotify
        statistics. Genres are given by wikipedia and rate your music
      </p>
    </div>
  );
}

export default About;
