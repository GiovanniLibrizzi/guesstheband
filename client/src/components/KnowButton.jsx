import { useState, useEffect } from "react";
import { useGameContext } from "../contexts/GameContext";
import { Status } from "../Utils";
import axios from "axios";

function KnowButton() {
  const { day, setKnewIt, loadStorage, gameStatus } = useGameContext();
  const [showKnowBtn, setShowKnowBtn] = useState(true);

  useEffect(() => {
    const data = loadStorage(day);
    if (data != null) {
      if (loadStorage(day).k != null) {
        setShowKnowBtn(false);
      }
    }
  }, []);

  const generateKnewData = (knew) => {
    const stats = {
      knew_it: 0,
      didnt_know: 0,
      day_id: day,
    };
    if (knew) {
      stats.knew_it = 1;
    } else {
      stats.didnt_know = 1;
    }
    return stats;
  };

  const sendStats = async (knew) => {
    const data = generateKnewData(knew);
    console.log(data);
    try {
      await axios.post("http://localhost:8800/bands/daily/stats", data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleKnowBtn = async (knew) => {
    setShowKnowBtn(false);
    setKnewIt(knew);
    console.log("test", knew);
    await sendStats(knew);
  };

  return (
    <>
      {gameStatus == Status.FAILURE && (
        <>
          {showKnowBtn && (
            <>
              <button
                onClick={() => {
                  handleKnowBtn(true);
                }}
              >
                Heard of them!
              </button>
              <button
                onClick={() => {
                  handleKnowBtn(false);
                }}
              >
                Don't know them...
              </button>
            </>
          )}
        </>
      )}
    </>
  );
}
export default KnowButton;
