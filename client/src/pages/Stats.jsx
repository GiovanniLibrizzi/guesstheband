import { useEffect } from "react";
import WinDistribution from "../components/WinDistribution";
import { useGameContext } from "../contexts/GameContext";
import { useState } from "react";
import { toPercent } from "../Utils";

function Stats() {
  const [loading, setLoading] = useState(true);
  const { localStats } = useGameContext();

  useEffect(() => {
    if (localStats != null) {
      setLoading(false);
    }
  }, [localStats]);

  return (
    <>
      {!loading && (
        <>
          <br></br>
          <p>Your Win Distribution:</p>
          <WinDistribution winDistribution={localStats.winDistribution} />

          <p>{`Games played: ${localStats.gamesPlayed}`}</p>
          <p>{`Games won: ${localStats.gamesWon}`}</p>
          <p>{`Win percent: ${toPercent(
            localStats.gamesWon,
            localStats.gamesPlayed
          )}`}</p>
        </>
      )}
    </>
  );
}

export default Stats;
