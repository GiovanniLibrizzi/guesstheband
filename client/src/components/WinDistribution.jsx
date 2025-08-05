function WinDistribution({ winDistribution }) {
  console.log("windist", winDistribution);

  var graphDist = [];
  const scaleVal = 30;
  var normalize = true;
  // normalize the graph part
  var total = 0;
  var highest = 0;
  winDistribution.map((e) => {
    total += e;
    if (e > highest) {
      highest = e;
    }
  });
  if (highest < scaleVal) {
    normalize = false;
  }

  if (total == 0) {
    console.log("NO DATA!");
    normalize = false;
  }

  if (normalize) {
    var highestRatio = 0;
    winDistribution.map((e) => {
      var ratio = e / total;
      if (ratio > highestRatio) {
        highestRatio = ratio;
      }
    });
    console.log("highest", highestRatio);

    var scale = 30 / highestRatio;
    winDistribution.map((e, i) => {
      graphDist.push(Math.round((e / total) * scale));
      console.log("windist map", e);
    });
  } else {
    winDistribution.map((e, i) => {
      graphDist.push(e);
    });
  }

  console.log("gdist", graphDist);

  return (
    <>
      {graphDist.map((e, i) => (
        <>
          {i < 6 ? (
            <p className="inline">{`${i + 1}: `}</p>
          ) : (
            <p className="inline">{`X: `}</p>
          )}
          {console.log("e", e)}
          {[...Array(e)].map((e, i) => (
            <p className="inline">█ </p>
          ))}

          <p className="inline">{`${winDistribution[i]}`}</p>
          <br></br>
        </>
      ))}
    </>
  );
}

export default WinDistribution;
