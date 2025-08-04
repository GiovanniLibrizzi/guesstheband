import { useEffect, useState } from "react";
import { useGameContext } from "../contexts/GameContext";
import { toPercent, Status } from "../Utils";

function GameStats() {
    const { stats, gameStatus } = useGameContext();

 
    

    return (
        <>
        {gameStatus != Status.PLAYING && (
            <>
            <br></br>
            <p>Win Distribution:</p>
            {stats.winDistribution.map((e, i) => (
                <>
                {(i < 6) ? (            
                    <p className="inline">{`${i+1}: `}</p>
                ) : (
                <p className="inline">{`X: `}</p>
                )}
                
                {[...Array(e)].map((e, i) => (
                    <p className="inline">█ </p>
                ))}
                
                <p className="inline">{`${e}`}</p>
                <br></br>
                </>
            ))}

            <p>{`Games played: ${stats.gamesPlayed}`}</p>
            <p>{`Games won: ${stats.gamesWon}`}</p>
            <p>{`Win percent: ${toPercent(stats.gamesWon, stats.gamesPlayed)}`}</p>
            </>
        )}
        </>
    );

}

export default GameStats;