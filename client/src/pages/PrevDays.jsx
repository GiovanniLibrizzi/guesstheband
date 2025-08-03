import {
  getDateNumber,
  generateScoreFromStorage,
  generateStatusFromStorage,
} from "../Utils.js";
import { useGameContext } from "../contexts/GameContext.jsx";

function PrevDays() {
  const { loadStorage } = useGameContext();

  return (
    <>
      <br></br>
      {[...Array(getDateNumber())].map((e, i) => (
        <a key={i} href={`/?day=${i + 1}`}>
          <button className="archive">{`Day ${i + 1}`}</button>
          <p className="archive archiveBtn">
            &nbsp;&nbsp;{generateScoreFromStorage(loadStorage(i + 1))}
          </p>
          <p className="archiveBtn archive">
            &nbsp;&nbsp;{generateStatusFromStorage(loadStorage(i + 1))}
          </p>
          <br></br>
        </a>
      ))}
    </>
  );
}

export default PrevDays;
