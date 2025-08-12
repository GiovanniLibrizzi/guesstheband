import { useEffect, useState } from "react";
import { useGameContext } from "../contexts/GameContext";
import { toPercent, Status } from "../Utils";
import WinDistribution from "./WinDistribution";

function GameStats() {
  const { localStats, globalStats, gameStatus } = useGameContext();
  const [globalGraph, setGlobalGraph] = useState(<></>);

  useEffect(() => {
    if (globalStats != null) {
      var gg = (
        <>
          {globalStats.knewIt != null && (
            <>
              <p>{`${globalStats.totalKnewIt} of players got the answer right`}</p>
              <p>{`~${globalStats.knewIt} of players who failed have heard of the answer`}</p>
            </>
          )}

          <p>Global Win Distribution:</p>
          <WinDistribution winDistribution={globalStats.winDistribution} />
        </>
      );
    }
    setGlobalGraph(gg);
  }, [globalStats]);

  return (
    <>
      {gameStatus != Status.PLAYING && (
        <>
          <br></br>
          <p>Win Distribution:</p>
          <WinDistribution winDistribution={localStats.winDistribution} />

          <p>{`Games played: ${localStats.gamesPlayed}`}</p>
          <p>{`Games won: ${localStats.gamesWon}`}</p>
          <p>{`Win percent: ${toPercent(
            localStats.gamesWon,
            localStats.gamesPlayed
          )}`}</p>

          <br></br>
          {globalGraph}
        </>
      )}
    </>
  );
}

export default GameStats;
